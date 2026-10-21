# Building and publishing updates

The public repository is https://github.com/nivekmai/cad-viewer.

## Normal update

1. Make the changes on a branch and open a pull request. CI builds the app, runs Android and release-automation tests, checks lint, and exercises the offline STEP/DWG/SCAD engines in Chromium and the converted geometry in the native parsers.
2. For a release, increase **both** `versionName` and `versionCode` in `app/build.gradle`. For example, after `1.4.0` / `7`, use `1.4.1` / `8`.
3. Optionally add a `## 1.4.1` entry to `CHANGELOG.md` with concise user-facing changes. If no entry exists, release notes are generated from commit subjects since the previous version tag. Write descriptive commit/PR titles.
4. Merge into `main`. After all checks pass, Actions builds a release APK and creates a version tag and **draft GitHub release**. The draft includes the APK, source archive, SHA-256 checksums, and changelog. When signing is enabled, the APK uses the existing CAD Viewer certificate. Otherwise it is explicitly named `CAD-Viewer-VERSION-unsigned.apk` and requires signing before installation.
5. Open https://github.com/nivekmai/cad-viewer/releases, review the draft and install the APK for a phone check, then click **Publish release**. Publishing is a deliberate manual step.

Ordinary pushes without a version bump still run CI but do not create another release. Published releases and their tags are never overwritten. To change a version already tagged, bump both version fields again. A failed release job can be rerun against its original commit; it repairs the existing draft without duplicating it. The workflow can also be run manually from the Actions tab on `main`.

## Build downloads

Every successful CI run saves APKs under the `android-builds` artifact and validation reports under `validation-reports`. The CI debug APK uses a temporary runner certificate; use the **release APK attached to the draft/release** for in-place updates to the installed app. Release APKs are not debuggable. Signed release APKs retain the existing development signing certificate for compatibility. Unsigned release APKs cannot be installed directly.

## Signing and repository maintenance

The release job uses these repository Actions secrets:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_KEY_ALIAS`

Configure these secrets using the existing local Android keystore to preserve update compatibility. Signing material is never committed to Git. Preserve a secure backup: replacing the certificate prevents in-place updates. The workflow verifies the certificate fingerprint before attaching any APK. If signing is enabled but any secret is missing, signing fails with a setup message rather than using a different key.

Set the repository Actions variable `RELEASE_SIGNING_ENABLED` to `true` after the signing secrets are configured. Until enabled, CI creates draft releases containing explicitly labeled unsigned APKs. Signing can also be done locally without transferring the key to GitHub. After enabling signing, rerun the workflow for the original tagged commit to add the signed APK to its draft; already published releases are never modified.

Pull-request builds do not receive signing secrets or release-write permissions. Signing runs only after successful checks on `main`. Third-party workflow actions are pinned to commit hashes; Dependabot proposes monthly action updates. The Gradle wrapper, build tools, and browser test dependencies are pinned too.

The viewer-specific code has no newly selected license. Bundled CAD engines, fonts, and fixtures retain the licenses and source/build references under `third_party/`; these notices also ship with the APK. Do not remove them.
