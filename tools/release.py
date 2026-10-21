"""Validate app versions and prepare reproducible, unpublished GitHub releases."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
VERSION = re.compile(r"^\d+\.\d+\.\d+$")


def run(*args, input=None):
    return subprocess.check_output(args, text=True, input=input, cwd=ROOT).strip()


def app_version(text):
    name = re.search(r"\bversionName\s+['\"]([^'\"]+)['\"]", text)
    code = re.search(r"\bversionCode\s+(\d+)\b", text)
    if not name or not code or not VERSION.fullmatch(name[1]) or int(code[1]) < 1:
        raise ValueError("Use a numeric X.Y.Z versionName and a positive versionCode in app/build.gradle")
    return name[1], int(code[1])


def number(version):
    return tuple(map(int, version.split('.')))


def check_version(current, previous):
    if number(current[0]) <= number(previous[0]) or current[1] <= previous[1]:
        raise ValueError("A new release must increase both versionName and versionCode")


def plan():
    version, code = app_version((ROOT / 'app/build.gradle').read_text())
    tags = [t for t in run('git', 'tag', '--list', 'v*').splitlines() if VERSION.fullmatch(t[1:])]
    tag = f'v{version}'
    head = run('git', 'rev-parse', 'HEAD')
    if tag in tags:
        tagged = app_version(run('git', 'show', f'{tag}:app/build.gradle'))
        if (version, code) != tagged:
            raise ValueError("This version is already tagged; bump both versionName and versionCode")
        # Retry the original release commit, but never rebuild an existing version from later code.
        release = run('git', 'rev-list', '-n', '1', tag) == head
    else:
        if tags:
            previous = max(tags, key=lambda t: number(t[1:]))
            check_version((version, code), app_version(run('git', 'show', f'{previous}:app/build.gradle')))
        release = True
    return {'version': version, 'code': code, 'tag': tag, 'sha': head, 'release': release}


def changelog_entry(text, version):
    match = re.search(r'^## ' + re.escape(version) + r'\s*\n(.*?)(?=^## |\Z)', text, re.M | re.S)
    return match[1].strip() if match else ''


def notes(info, unsigned=False):
    tags = [t for t in run('git', 'tag', '--merged', info['sha'], '--list', 'v*').splitlines()
            if VERSION.fullmatch(t[1:]) and number(t[1:]) < number(info['version'])]
    previous = max(tags, key=lambda t: number(t[1:])) if tags else None
    history = f"{previous}..{info['sha']}" if previous else info['sha']
    changes = run('git', 'log', '--no-merges', '--format=- %s (%h)', history)
    entry = changelog_entry((ROOT / 'CHANGELOG.md').read_text(), info['version'])
    body = f"# CAD Viewer {info['version']}\n\n"
    body += entry + '\n\n' if entry else '## Changes\n\n' + (changes or '- No additional commits.') + '\n\n'
    if entry and changes:
        body += '<details>\n<summary>Commit history</summary>\n\n' + changes + '\n\n</details>\n\n'
    if unsigned:
        body += '## Unsigned release build\n\nThis APK cannot be installed until signed. GitHub signing is not configured; sign locally with the existing app certificate or enable the signing secrets described in RELEASING.md. Do not uninstall your existing app.\n'
    else:
        body += '## Install\n\nDownload the APK below and install it over your existing CAD Viewer / STL Viewer app. Android 8.0 or newer is required.\n'
    if previous:
        body += f"\n[Full comparison](https://github.com/{os.environ['GH_REPO']}/compare/{previous}...{info['tag']})\n"
    return body


def api(path, payload=None):
    args = ['gh', 'api', path]
    if payload is not None:
        args += ['--method', 'POST', '--input', '-']
    return json.loads(run(*args, input=json.dumps(payload) if payload is not None else None))


def optional_api(path):
    result = subprocess.run(['gh', 'api', path], text=True, capture_output=True, cwd=ROOT)
    if result.returncode == 0:
        return json.loads(result.stdout)
    if '(HTTP 404)' in result.stderr:
        return None
    raise RuntimeError(result.stderr)


def publish(unsigned=False):
    # Refresh tags in case another workflow created the release while this build was running.
    run('git', 'fetch', 'origin', '--tags')
    info = plan()
    if not info['release']:
        print('Version already belongs to another commit; no release needed.')
        return
    repo = os.environ['GH_REPO']
    prefix = f'repos/{repo}'
    existing = optional_api(f"{prefix}/releases/tags/{info['tag']}")
    if existing and not existing['draft']:
        print('Release is already published; leaving it unchanged.')
        return
    dist = ROOT / 'dist'
    apk = dist / apk_name(info['version'], unsigned)
    if not apk.is_file():
        raise ValueError(f'Missing release APK: {apk}')
    source = dist / f"CAD-Viewer-{info['version']}-source.zip"
    run('git', 'archive', '--format=zip', f'--prefix=CAD-Viewer-{info["version"]}/', f'--output={source}', info['sha'])
    checksum = dist / 'SHA256SUMS'
    checksum.write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in (apk, source)))
    changelog = dist / 'CHANGELOG.md'
    changelog.write_text(notes(info, unsigned))
    ref = optional_api(f"{prefix}/git/ref/tags/{info['tag']}")
    if ref is None:
        api(f'{prefix}/git/refs', {'ref': f"refs/tags/{info['tag']}", 'sha': info['sha']})
    elif ref['object']['sha'] != info['sha']:
        raise ValueError('Refusing to move an existing release tag')
    if existing:
        run('gh', 'release', 'edit', info['tag'], '--notes-file', str(changelog))
    else:
        run('gh', 'release', 'create', info['tag'], '--verify-tag', '--draft',
            '--title', f"CAD Viewer {info['version']}", '--notes-file', str(changelog))
    run('gh', 'release', 'upload', info['tag'], str(apk), str(source), str(checksum), str(changelog), '--clobber')
    print(f"Draft ready: https://github.com/{repo}/releases")


def apk_name(version, unsigned=False):
    return f"CAD-Viewer-{version}{'-unsigned' if unsigned else ''}.apk"


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['plan', 'publish'])
    parser.add_argument('--unsigned', action='store_true', help='Clearly label the release as requiring local signing')
    args = parser.parse_args()
    if args.command == 'publish':
        publish(args.unsigned)
    else:
        info = plan()
        print(json.dumps(info))
        if output := os.environ.get('GITHUB_OUTPUT'):
            with open(output, 'a') as stream:
                stream.write(f"version={info['version']}\nrelease={str(info['release']).lower()}\n")
