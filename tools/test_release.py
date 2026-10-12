import unittest
from pathlib import Path
import tempfile
from unittest.mock import patch
import release
from release import app_version, check_version, changelog_entry


class ReleaseTests(unittest.TestCase):
    def test_reads_version(self):
        self.assertEqual(('0.10.2', 12), app_version("versionName '0.10.2'\nversionCode 12"))

    def test_rejects_invalid_versions(self):
        for text in ["versionName 'bad'\nversionCode 12", "versionName '1.0.0'", "versionName '1.0.0'\nversionCode 0"]:
            with self.assertRaises(ValueError):
                app_version(text)

    def test_requires_both_versions_to_increase(self):
        previous = ('0.10.2', 12)
        for current in [('0.10.2', 13), ('0.10.3', 12), ('0.9.0', 13)]:
            with self.assertRaises(ValueError):
                check_version(current, previous)
        check_version(('0.10.3', 13), previous)
        check_version(('0.11.0', 13), previous)

    def test_changelog_only_uses_requested_version(self):
        text = '# Changelog\n\n## 0.11.0\n\n- New feature.\n\n## 0.10.2\n\n- Old feature.\n'
        self.assertEqual('- New feature.', changelog_entry(text, '0.11.0'))
        self.assertEqual('- Old feature.', changelog_entry(text, '0.10.2'))
        self.assertEqual('', changelog_entry(text, '0.10.3'))


class ReleasePlanTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        root = Path(self.directory.name)
        self.patch = patch.object(release, 'ROOT', root)
        self.patch.start()
        self.addCleanup(self.patch.stop)
        (root / 'app').mkdir()
        release.run('git', 'init', '-b', 'main')
        release.run('git', 'config', 'user.name', 'Release test')
        release.run('git', 'config', 'user.email', 'test@example.invalid')
        self.commit('0.10.2', 12)

    def commit(self, version, code):
        (release.ROOT / 'app/build.gradle').write_text(f"versionName '{version}'\nversionCode {code}\n")
        release.run('git', 'add', '.')
        release.run('git', 'commit', '--allow-empty', '-m', 'Test version')

    def test_initial_release_and_retry_then_ordinary_push(self):
        self.assertTrue(release.plan()['release'])
        release.run('git', 'tag', 'v0.10.2')
        self.assertTrue(release.plan()['release'])
        self.commit('0.10.2', 12)
        self.assertFalse(release.plan()['release'])

    def test_version_bump_creates_another_release(self):
        release.run('git', 'tag', 'v0.10.2')
        self.commit('0.10.3', 13)
        self.assertTrue(release.plan()['release'])
        self.assertEqual('v0.10.3', release.plan()['tag'])

    def test_code_only_bump_cannot_reuse_tag(self):
        release.run('git', 'tag', 'v0.10.2')
        self.commit('0.10.2', 13)
        with self.assertRaises(ValueError):
            release.plan()


if __name__ == '__main__':
    unittest.main()
