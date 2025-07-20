# @nera-static/plugin-simple-page-list

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator that creates filtered page lists based on directory paths. Ideal for blog post listings, news sections, or content categories grouped and sorted chronologically.

## ✨ Features

- Filter pages by directory path (e.g., `/posts`, `/news`, `/blog`)
- Automatic chronological sorting (newest first)
- Access filtered lists globally via `app.pageList`
- Includes ready-to-use Pug templates using BEM CSS methodology
- Template publishing system for easy customization
- Configurable "read more" link text
- Lightweight and zero-runtime overhead
- Full compatibility with Nera v4.1.0+

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-simple-page-list
```

Nera will automatically detect the plugin and apply the page filtering during the build.

## ⚙️ Configuration

Define the filter settings in `config/simple-page-list.yaml`:

```yaml
page_path: /posts
more_link_text: Read more
```

- `page_path`: Directory to include pages from
- `more_link_text`: Custom label for "Read more" link (default: "Read more")

## 🧩 Usage

### Content Frontmatter

Ensure your pages are located in the configured directory and include necessary metadata:

```yaml
---
title: Amazing Blog Post
description: This is an amazing blog post
date: 2025-01-15
---
```

`date` supports formats like:

- `2025-01-15`
- `15.01.2025`
- Any JS-valid date string

If `date` is missing, Nera’s `createdAt` will be used.

### Access in templates

```pug
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

### Data structure

```javascript
{
  title: "Page Title",
  description: "Page description",
  href: "/posts/page-slug.html",
  date: 1705276800000,
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

Include it in your layouts:

```pug
include /views/vendor/plugin-simple-page-list/simple-page-list
```

## 🎨 Styling

The default template uses BEM CSS methodology:

```css
.page-list { }
.page-list__title { }
.page-list__item { }
.page-list__header { }
.page-list__item-title { }
.page-list__link { }
.page-list__description { }
.page-list__footer { }
.page-list__more-link { }
```

## 📊 Generated Output

The plugin filters pages from a directory and sorts them by `date` (or fallback). The resulting array is injected into `app.pageList`.

## 🧪 Development

```bash
npm install
npm test
npm run lint
```

Tests use [Vitest](https://vitest.dev) and validate:

- Filtering logic by directory
- Sorting by date
- Data structure and output formatting
- Template publishing and overwrite protection

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

- [Plugin Repository](https://github.com/seebaermichi/nera-plugin-simple-page-list)
- [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-simple-page-list)
- [Nera Static Site Generator](https://github.com/seebaermichi/nera)

## 🧩 Compatibility

- **Nera**: v4.1.0+
- **Node.js**: >= 18
- **Plugin API**: Uses `getAppData()` for injecting filtered page lists

## 📦 License

MIT
