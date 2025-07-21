# @nera-static/plugin-simple-page-list

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator that creates filtered page lists based on directory paths. Ideal for blog post listings, news sections, or content categories grouped and sorted chronologically.

## ✨ Features

-   Filter pages by one or more directory paths
-   Supports flat or grouped page lists (`app.pageList` or `app.pageList.<key>`)
-   Automatic chronological sorting (configurable)
-   Custom sorting by `date`, `title`, or any frontmatter field
-   Access filtered lists globally in templates
-   Includes ready-to-use Pug templates using BEM CSS methodology
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

Define the filter settings in `config/simple-page-list.yaml`.

### 🔹 Option 1: Single path (legacy)

```yaml
page_path: /posts
more_link_text: Read more
```

-   `page_path`: Directory to include pages from
-   `more_link_text`: Label for the "read more" link (optional)

### 🔹 Option 2: Multiple paths (grouped output)

```yaml
page_paths:
    - /recipes/lunch
    - /recipes/breakfast
    - path: /blog
      key: blogPosts
      sortBy: title
      sortOrder: ascending
sortBy: date
sortOrder: descending
more_link_text: Read more
exclude_pages:
    - /recipes/lunch/index.html
```

-   `page_paths`: Array of paths (either strings or objects)
    -   If a string, the last folder segment becomes the key (e.g. `/recipes/lunch` → `lunch`)
    -   If an object, you can override the `key`, `sortBy`, or `sortOrder`
-   `sortBy`: Field to sort by (`date`, `title`, etc.)
-   `sortOrder`: `ascending` or `descending`
-   Top-level `sortBy`/`sortOrder` apply to all unless overridden per entry
-   `exclude_pages`: Array of rendered pages which should not be included in the page list (e.g. `/recipes/lunch/index.html`)

## 🧩 Usage

### Content Frontmatter

Ensure your pages are located in the configured directories and include required metadata:

```yaml
---
title: Delicious Pasta
description: A quick and easy pasta recipe.
date: 2025-01-15
---
```

Supported `date` formats:

-   `2025-01-15` (ISO)
-   `15.01.2025` (German-style)
-   Any JS-valid date string

If `date` is missing, Nera’s `createdAt` will be used as a fallback.

### Access in templates

#### Legacy usage (single path config):

```pug
if app.pageList && app.pageList.length > 0
  section.page-list
    h2 Recent Posts
    each page in app.pageList
      article.page-list__item
        h3: a(href=page.href) #{page.title}
        if page.description
          p #{page.description}
        a.page-list__more-link(href=page.href) #{page.moreLinkText}
```

#### Grouped usage (multiple paths):

```pug
if app.pageList.blogPosts
  h2 Blog
  each post in app.pageList.blogPosts
    article
      h3: a(href=post.href) #{post.title}
```

```pug
if app.pageList.lunch
  h2 Lunch Recipes
  each recipe in app.pageList.lunch
    h3: a(href=recipe.href) #{recipe.title}
```

## 📊 Output Structure

Depending on configuration, the plugin injects one of the following:

#### 1. Flat array (legacy):

```js
app.pageList = [
  {
    title: "Page Title",
    description: "Page description",
    href: "/posts/my-post.html",
    date: 1705276800000,
    moreLinkText: "Read more"
  },
  ...
]
```

#### 2. Grouped object:

```js
app.pageList = {
  lunch: [
    { title, href, date, ... }
  ],
  blogPosts: [
    { title, href, date, ... }
  ]
}
```

## 🛠️ Template Publishing

Use the default template provided by the plugin:

```bash
npx @nera-static/plugin-simple-page-list run publish-template
```

This will copy:

```
views/vendor/plugin-simple-page-list/
└── simple-page-list.pug
```

You can then include it in your layout:

```pug
include /views/vendor/plugin-simple-page-list/simple-page-list
```

## 🎨 Styling

The default template uses BEM-style class names:

```css
.page-list {
}
.page-list__title {
}
.page-list__item {
}
.page-list__header {
}
.page-list__item-title {
}
.page-list__link {
}
.page-list__description {
}
.page-list__footer {
}
.page-list__more-link {
}
```

## 🧪 Testing & Development

```bash
npm install
npm test
npm run lint
```

Tests use [Vitest](https://vitest.dev) and cover:

-   Filtering by directory path
-   Sorting by `date`, `title`, etc.
-   Grouped and flat output modes
-   Correct fallback behavior and robustness
-   Template publishing logic

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

-   [Plugin Repository](https://github.com/seebaermichi/nera-plugin-simple-page-list)
-   [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-simple-page-list)
-   [Nera Static Site Generator](https://github.com/seebaermichi/nera)

## 🧩 Compatibility

-   **Nera**: v4.1.0+
-   **Node.js**: >= 18
-   **Plugin API**: Uses `getAppData()` for injecting filtered page lists

## 📦 License

MIT
