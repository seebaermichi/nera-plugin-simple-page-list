# @nera-static/plugin-simple-page-list

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator that creates filtered page lists based on directory paths. Perfect for blog post listings, news sections, or any content category that needs to be grouped and displayed chronologically.

## ✨ Features

-   Filter pages by directory path (e.g., `/posts`, `/news`, `/blog`)
-   Automatic chronological sorting (newest first)
-   Access page lists globally via `app.pageList`
-   Includes ready-to-use Pug templates with BEM CSS methodology
-   Template publishing system for easy customization
-   Configurable "read more" link text
-   Lightweight and zero-runtime overhead
-   Full compatibility with Nera v4.1.0+

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-simple-page-list
```

Nera will automatically detect the plugin and apply the page filtering during the build.

## ⚙️ Configuration

The plugin uses `config/simple-page-list.yaml` to define which pages to include:

```yaml
page_path: /posts
more_link_text: Read more
```

-   **`page_path`**: The directory path to filter pages by (e.g., `/posts`, `/blog`, `/news`)
-   **`more_link_text`**: Text for the "read more" link (defaults to "Read more")

## 🧩 Usage

### Mark your content pages

Ensure your pages are in the configured directory and have the required meta fields:

```yaml
---
title: Amazing Blog Post
description: This is an amazing blog post about web development
date: 2025-01-15
---
# Amazing Blog Post

Your content here...
```

**Note:** The `date` field is optional and supports multiple formats:

-   ISO format: `2025-01-15`
-   German format: `15.01.2025`
-   Any valid date string that JavaScript can parse

If no `date` is provided, Nera's automatically generated `createdAt` timestamp will be used for sorting.

### Access in your templates

The plugin makes the filtered page list available via `app.pageList`:

```pug
// Display page list
if app.pageList && app.pageList.length > 0
    section.page-list
        h2 Recent Posts
        each page in app.pageList
            article.page-list__item
                h3: a(href=page.href) #{page.title}
                if page.description
                    p #{page.description}
                a(href=page.href) #{page.moreLinkText}
```

### Available data structure

Each item in the page list contains:

```javascript
{
    title: "Page Title",
    description: "Page description",
    href: "/posts/page-slug.html",
    date: 1705276800000, // Parsed from meta.date (2025-01-15) for sorting
    moreLinkText: "Read more"
}
```

## 🛠️ Template Publishing

Use the default template provided by the plugin:

```bash
npx @nera-static/plugin-simple-page-list run publish-template
```

This copies the template to:

```
views/vendor/plugin-simple-page-list/
└── simple-page-list.pug
```

You can then include it in your layouts:

```pug
// Include page list
include /views/vendor/plugin-simple-page-list/simple-page-list
```

### Template customization

You can customize the copied template or create your own based on the data structure provided by `app.pageList`.

## 🎯 Use Cases

### Blog Post Listings

```yaml
# config/simple-page-list.yaml
pageList:
    directories:
        - blog
    sortBy: date
    sortOrder: descending
    limit: 5
```

### News Sections

```yaml
# config/simple-page-list.yaml
pageList:
    directories:
        - news
    sortBy: date
    sortOrder: descending
    limit: 10
```

### Project Showcases

```yaml
# config/simple-page-list.yaml
pageList:
    directories:
        - projects
    sortBy: title
    sortOrder: ascending
```

## 🎨 BEM CSS Classes

The default template uses BEM (Block Element Modifier) methodology:

-   `.page-list` - Main container
-   `.page-list__title` - Section title
-   `.page-list__item` - Individual page item
-   `.page-list__header` - Item header
-   `.page-list__item-title` - Item title
-   `.page-list__link` - Page link
-   `.page-list__description` - Page description
-   `.page-list__footer` - Item footer
-   `.page-list__more-link` - Read more link## 🧪 Development

```bash
npm install
npm test
npm run lint
```

Tests are powered by [Vitest](https://vitest.dev) and cover:

-   Page filtering by directory path
-   Chronological sorting functionality
-   Data structure validation
-   Template publishing logic and file overwrite prevention

### 🔄 Compatibility

-   **Nera v4.1.0+**: Full compatibility with latest static site generator
-   **Node.js 18+**: Modern JavaScript features and ES modules
-   **Plugin Utils v1.1.0+**: Enhanced plugin utilities integration

### 🏗️ Architecture

This plugin uses the `getAppData()` function to process page data and make filtered page lists available via `app.pageList`. Pages are filtered by directory path and sorted chronologically.

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

-   [Plugin Repository](https://github.com/seebaermichi/nera-plugin-simple-page-list)
-   [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-simple-page-list)
-   [Nera Static Site Generator](https://github.com/seebaermichi/nera)
-   [Plugin Documentation](https://github.com/seebaermichi/nera#plugins)

## 📄 License

MIT
