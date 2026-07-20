import fs from 'fs'
import os from 'os'
import path from 'path'
import pug from 'pug'
import { fileURLToPath } from 'url'
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATE = path.resolve(__dirname, '../views/simple-page-list.pug')

// The suite runs entirely inside a temp directory. It used to write into
// <repo>/config/, which now holds a shipped default that must not be clobbered.
let tmpDir
let originalCwd

beforeAll(() => {
    originalCwd = process.cwd()
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'simple-page-list-'))
    fs.mkdirSync(path.join(tmpDir, 'config'), { recursive: true })
    process.chdir(tmpDir)
})

afterAll(() => {
    process.chdir(originalCwd)
    fs.rmSync(tmpDir, { recursive: true, force: true })
})

afterEach(() => {
    fs.rmSync(path.join(tmpDir, 'config/simple-page-list.yaml'), {
        force: true,
    })
})

function writeConfig(yaml) {
    fs.writeFileSync(path.join(tmpDir, 'config/simple-page-list.yaml'), yaml)
}

async function getAppData(args) {
    const mod = await import('../index.js')

    return mod.getAppData(args)
}

function page(title, href, extra = {}) {
    return { meta: { title, href, createdAt: '2024-01-01', ...extra } }
}

describe('Simple Page List Plugin', () => {
    it('handles single legacy page_path config', async () => {
        writeConfig('page_path: /posts\nmore_link_text: more\n')

        const result = await getAppData({
            app: { name: 'MyApp' },
            pagesData: [
                page('Post 1', '/posts/one.html', { description: 'desc' }),
                page('Ignore', '/about.html'),
            ],
        })

        expect(result.pageList).toHaveLength(1)
        expect(result.pageList[0].title).toBe('Post 1')
        expect(result.pageList[0].moreLinkText).toBe('more')
    })

    it('handles multiple page_paths (array of strings)', async () => {
        writeConfig('page_paths:\n  - /blog\n  - /news\n')

        const result = await getAppData({
            app: {},
            pagesData: [
                page('Blog Entry', '/blog/entry.html'),
                page('News Entry', '/news/story.html'),
            ],
        })

        expect(result.pageList.blog).toHaveLength(1)
        expect(result.pageList.news).toHaveLength(1)
    })

    it('exclude pages from exclude pages in config', async () => {
        writeConfig(
            'page_paths:\n  - /blog\n  - /news\nexclude_pages:\n  - /news/index.html\n'
        )

        const result = await getAppData({
            app: {},
            pagesData: [
                page('Blog Entry', '/blog/entry.html'),
                page('News Entry', '/news/story.html'),
                page('News Overview', '/news/index.html'),
            ],
        })

        expect(result.pageList.blog).toHaveLength(1)
        expect(result.pageList.news).toHaveLength(1)
    })

    it('handles object-based page_paths with custom key and sort', async () => {
        writeConfig(
            'page_paths:\n  - path: /rezepte/mittagessen\n    key: lunch\n    sortBy: sorting_key\n    sortOrder: ascending\n'
        )

        const result = await getAppData({
            app: {},
            pagesData: [
                page('Zucchini Pasta', '/rezepte/mittagessen/zucchini.html', {
                    sorting_key: 2,
                }),
                page('Aubergine Curry', '/rezepte/mittagessen/aubergine.html', {
                    sorting_key: 1,
                }),
            ],
        })

        expect(result.pageList.lunch).toHaveLength(2)
        expect(result.pageList.lunch[0].title).toBe('Aubergine Curry')
        expect(result.pageList.lunch[1].title).toBe('Zucchini Pasta')
    })

    it('falls back to createdAt if no date is given', async () => {
        writeConfig('page_path: /posts\n')

        const result = await getAppData({
            app: {},
            pagesData: [page('Undated Post', '/posts/undated.html')],
        })

        expect(result.pageList).toHaveLength(1)
        expect(result.pageList[0].title).toBe('Undated Post')
    })

    it('handles empty pagesData gracefully', async () => {
        writeConfig('page_path: /empty\n')

        const result = await getAppData({ app: {}, pagesData: [] })

        expect(result.pageList).toHaveLength(0)
    })
})

describe('path matching', () => {
    it('matches only pages inside the configured directory', async () => {
        writeConfig('page_paths:\n  - /blog\n')

        const result = await getAppData({
            app: {},
            pagesData: [
                page('Post', '/blog/post.html'),
                page('Nested', '/blog/2024/nested.html'),
                page('Section index', '/blog.html'),
                page('Unrelated', '/my/blog-archive/x.html'),
                page('Elsewhere', '/company-blog/x.html'),
            ],
        })

        expect(result.pageList.blog.map((p) => p.href).sort()).toEqual([
            '/blog/2024/nested.html',
            '/blog/post.html',
        ])
    })

    it('does not let a section index page list itself', async () => {
        writeConfig('page_path: /blog\n')

        const result = await getAppData({
            app: {},
            pagesData: [
                page('Section index', '/blog.html'),
                page('Post', '/blog/post.html'),
            ],
        })

        expect(result.pageList.map((p) => p.href)).toEqual(['/blog/post.html'])
    })

    it('tolerates a trailing slash in the configured path', async () => {
        writeConfig('page_paths:\n  - /blog/\n')

        const result = await getAppData({
            app: {},
            pagesData: [
                page('Post', '/blog/post.html'),
                page('Section index', '/blog.html'),
            ],
        })

        expect(result.pageList.blog).toHaveLength(1)
    })

    it('skips pages that have no href', async () => {
        writeConfig('page_path: /blog\n')

        const result = await getAppData({
            app: {},
            pagesData: [page('No href', undefined), page('Post', '/blog/p.html')],
        })

        expect(result.pageList).toHaveLength(1)
    })
})

describe('shipped template', () => {
    const render = (pageList) => pug.renderFile(TEMPLATE, { app: { pageList } })

    const items = [
        {
            title: 'Post 1',
            href: '/blog/p1.html',
            description: 'desc',
            moreLinkText: 'Read more',
        },
    ]

    it('renders the flat array shape', () => {
        const html = render(items)

        expect(html).toContain('class="page-list"')
        expect(html).toContain('href="/blog/p1.html"')
        expect(html).toContain('Post 1')
        expect(html).toContain('class="page-list__description"')
    })

    it('renders the grouped object shape', () => {
        const html = render({ blog: items })

        expect(html).toContain('class="page-list"')
        expect(html).toContain('href="/blog/p1.html"')
        expect(html).toContain('Post 1')
    })

    it('labels each group with its key', () => {
        const html = render({ blog: items, news: items })

        expect(html).toContain('class="page-list__group-title"')
        expect(html).toContain('>blog<')
        expect(html).toContain('>news<')
    })

    it('emits the same markup for a flat list as before grouping support', () => {
        // Guards the published-template contract: sites holding a vendored copy
        // of the old template must keep rendering byte-identical output.
        expect(render(items)).toBe(
            '<section class="page-list"><h2 class="page-list__title">Recent Pages</h2>' +
                '<article class="page-list__item"><header class="page-list__header">' +
                '<h3 class="page-list__item-title">' +
                '<a class="page-list__link" href="/blog/p1.html">Post 1</a></h3></header>' +
                '<p class="page-list__description">desc</p>' +
                '<footer class="page-list__footer">' +
                '<a class="page-list__more-link" href="/blog/p1.html">Read more</a>' +
                '</footer></article></section>'
        )
    })

    it.each([
        ['an empty array', []],
        ['an empty object', {}],
        ['groups that are all empty', { blog: [] }],
        ['undefined', undefined],
    ])('renders nothing for %s', (_label, pageList) => {
        expect(render(pageList)).toBe('')
    })
})
