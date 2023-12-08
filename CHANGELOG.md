# Change Log
All notable changes to this project will be documented in this file.
 
## [Unreleased] - yyyy-mm-dd
 
Here we write upgrading notes for brands. It's a team effort to make them as
straightforward as possible.
 
### Added
 
### Changed
 
### Fixed

## [1.0.1] - 2023-12-09

### Fixed

- Support for Streamlit 1.21.0 minimum [#3](https://github.com/rmarquet21/streamlit-annotation-tools/issues/3)

## [1.0.0] - 2023-12-08

### Added

- Add `text_labeler` component

### Changed

- rename 'text_annotation' to 'text_highlighter'

## [0.3.4] - 2023-12-07

### Changed

- Update architecture of frontend components

### Fixed

- hidden state when adding a new list [#1](https://github.com/rmarquet21/streamlit-annotation-tools/issues/1)

## [0.3.3] - 2023-05-10

### Fixed

- Special characters are not removed anymore

## [0.3.1] - 2023-05-10

### Fixed

- Impossible to select a punctuation at the end of an annotation, it is directly removed from the final annotation. (Now to select with punctuation at the end, you have to highlight until the final punctuation, without letting the autocompletion select the entire last word)

## [0.3.0] - 2023-05-08

### Added

- New UI

### Changed

- Update to latest version of `React v18`

### Fixed

- Text dispear on hover

## [0.2.2] - 2023-04-17

### Fixed

- Fix import of build

## [0.2.0] - 2023-04-17
 
### Added

- Initial release
