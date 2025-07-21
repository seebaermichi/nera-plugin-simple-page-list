# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2025-07-21

### Added

-   All meta data of the page in the page list

### Changed

-   Each page in the page list will now include all its meta data

### Fixed

-   Sorting by custom keys

### Migration Guide

This update is fully backward-compatible with v2.1.1.

## [2.1.1] - 2025-07-21

### Added

-   Support for `exclude_pages` as an array pages which should be excluded form list

### Changed

-   A page list will now not include pages from `exclude_pages`

### Migration Guide

This update is fully backward-compatible with v2.1.0.

-   Provide pages which should be excluded:

    ```yaml
    exclude_pages:
        - /recipes/lunch/index.html
    ```

## [2.1.0] - 2025-07-21

### Added

-   Support for `page_paths` as an array to define multiple directories
-   Grouped output via `app.pageList.<key>` for each configured path
-   Support for individual `key`, `sortBy`, and `sortOrder` per path
-   Automatic fallback key generation based on folder name if no `key` is specified
-   Custom sorting by `title`, `date`, or any other frontmatter field
-   New tests covering all new features and edge cases

### Changed

-   Improved internal sorting logic using reusable sort functions
-   `getAppData()` now loads configuration directly within the function for testability
-   Clean fallback handling for legacy `page_path` configuration
-   Adjusted default template logic to handle both flat and grouped data

### Migration Guide

This update is fully backward-compatible with v2.0.0.

However, you can now:

-   Use multiple directories by replacing:

    ```yaml
    page_path: /posts
    ```

    with:

    ```yaml
    page_paths:
        - /posts
        - /news
    ```

-   Provide custom sorting or keys per path:

    ```yaml
    page_paths:
        - path: /recipes/lunch
          key: lunch
          sortBy: title
          sortOrder: ascending
    ```

## [2.0.0] - 2025-07-19

### Added

-   **BREAKING**: Complete rewrite for Nera v4.1.0 compatibility
-   Professional CHANGELOG.md for release tracking
-   Enhanced template publishing system via `@nera-static/plugin-utils@^1.1.0`
-   BEM CSS methodology for page list templates
-   Comprehensive test suite with 7 tests covering all functionality
-   ESLint configuration with modern JavaScript standards
-   Husky git hooks for code quality

### Changed

-   **BREAKING**: Migrated from CommonJS to ES modules
-   **BREAKING**: Updated from `meta.htmlPathName` to `meta.href` property
-   **BREAKING**: Now uses `@nera-static/plugin-utils` instead of legacy plugin-helper
-   **BREAKING**: Package name changed to `@nera-static/plugin-simple-page-list`
-   Enhanced package.json with modern configuration and proper dependencies
-   Improved BEM CSS classes for better styling consistency:
    -   `.page-list` - Main container
    -   `.page-list__title` - Section title
    -   `.page-list__grid` - Grid container
    -   `.page-list__item` - Individual page item
    -   `.page-list__header` - Item header
    -   `.page-list__item-title` - Item title
    -   `.page-list__link` - Page link
    -   `.page-list__content` - Item content area
    -   `.page-list__description` - Page description
    -   `.page-list__footer` - Item footer
    -   `.page-list__more-link` - Read more link

### Fixed

-   Improved error handling for missing configuration
-   Better fallback for missing `more_link_text` configuration
-   Enhanced date parsing to support both `createdAt` and `date` meta properties

### Technical Details

-   Uses `getAppData()` function to provide global app-level page list data
-   Page lists are available in `app.pageList` for global template access
-   Full compatibility with Nera v4.1.0 plugin system
-   Template publishing to `views/vendor/plugin-simple-page-list/`
-   Automatic sorting by creation date (newest first)
-   Directory-based page filtering via `page_path` configuration

### Migration Guide

**Breaking Changes from v1.x:**

1. **Package Installation:**

    ```bash
    # Old
    cd src/plugins
    git clone git@github.com:seebaermichi/nera-plugin-simple-page-list.git simple-page-list

    # New
    npm install @nera-static/plugin-simple-page-list
    ```

2. **Template Includes:**

    ```pug
    // Old
    include /relative/path/to/src/plugins/simple-page-list/views/simple-page-list

    // New - publish templates first
    npx @nera-static/plugin-simple-page-list run publish-template
    include /views/vendor/plugin-simple-page-list/simple-page-list
    ```

3. **Configuration:** No changes required to `config/simple-page-list.yaml`

## [1.0.0] - Previous Release

-   Initial release with basic page listing functionality
