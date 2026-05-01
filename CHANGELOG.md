# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-30
### Added
- **Core Logic**: Automatic extraction of Second Level Domain (SLD) for tag generation.
- **UI Injection**: Floating button (`+`) in email fields for quick auto-fill.
- **Multi-Account Support**: Ability to manage multiple base emails in the Options page.
- **In-Form Selection**: Dropdown menu in the `+` button to select between multiple accounts on the fly.
- **Popup Interface**: View suggested tag, history of used tags, and active email selection.
- **Privacy First**: Clear labels and logic ensuring all data stays 100% local (`chrome.storage.local`).
- **Modern Aesthetic**: Premium dark mode design with custom dinosaur icon and glassmorphism elements.
- **SPA Compatibility**: Support for dynamic forms (React, Vue, etc.) via event dispatching and MutationObserver.

### Fixed
- Fixed validation errors in some sites by adding `focus` and `blur` events after auto-filling.
- Fixed "import statement outside a module" errors in content scripts by bundling into IIFE.
- Fixed extension icon resolution and format issues.
