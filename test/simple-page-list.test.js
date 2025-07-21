import fs from 'fs/promises'
import path from 'path'
import { describe, it, expect, afterEach } from 'vitest'

const CONFIG_PATH = path.resolve('config/simple-page-list.yaml')

async function writeConfig(yaml) {
    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true })
    await fs.writeFile(CONFIG_PATH, yaml)
}

async function deleteConfig() {
    try {
        await fs.unlink(CONFIG_PATH)
    } catch {
        // Ignore errors
    }
}

describe('Simple Page List Plugin', () => {
    afterEach(deleteConfig)

    it('handles single legacy page_path config', async () => {
        await writeConfig(`
page_path: /posts
more_link_text: more
`)

        const { getAppData } = await import('../index.js')

        const result = getAppData({
            app: { name: 'MyApp' },
            pagesData: [
                {
                    meta: {
                        title: 'Post 1',
                        href: '/posts/one.html',
                        description: 'desc',
                        createdAt: '2024-01-01',
                    },
                },
                {
                    meta: {
                        title: 'Ignore',
                        href: '/about.html',
                        createdAt: '2024-01-02',
                    },
                },
            ],
        })

        expect(result.pageList).toHaveLength(1)
        expect(result.pageList[0].title).toBe('Post 1')
        expect(result.pageList[0].moreLinkText).toBe('more')
    })

    it('handles multiple page_paths (array of strings)', async () => {
        await writeConfig(`
page_paths:
  - /blog
  - /news
`)

        const { getAppData } = await import('../index.js')

        const result = getAppData({
            app: {},
            pagesData: [
                {
                    meta: {
                        title: 'Blog Entry',
                        href: '/blog/entry.html',
                        createdAt: '2023-12-01',
                    },
                },
                {
                    meta: {
                        title: 'News Entry',
                        href: '/news/story.html',
                        createdAt: '2023-12-02',
                    },
                },
            ],
        })

        expect(result.pageList.blog).toHaveLength(1)
        expect(result.pageList.news).toHaveLength(1)
    })

    it('handles object-based page_paths with custom key and sort', async () => {
        await writeConfig(`
page_paths:
  - path: /rezepte/mittagessen
    key: lunch
    sortBy: title
    sortOrder: ascending
`)

        const { getAppData } = await import('../index.js')

        const result = getAppData({
            app: {},
            pagesData: [
                {
                    meta: {
                        title: 'Zucchini Pasta',
                        href: '/rezepte/mittagessen/zucchini.html',
                        createdAt: '2024-01-01',
                    },
                },
                {
                    meta: {
                        title: 'Aubergine Curry',
                        href: '/rezepte/mittagessen/aubergine.html',
                        createdAt: '2024-01-02',
                    },
                },
            ],
        })

        expect(result.pageList.lunch).toHaveLength(2)
        expect(result.pageList.lunch[0].title).toBe('Aubergine Curry')
        expect(result.pageList.lunch[1].title).toBe('Zucchini Pasta')
    })

    it('falls back to createdAt if no date is given', async () => {
        await writeConfig(`
page_path: /posts
`)

        const { getAppData } = await import('../index.js')

        const result = getAppData({
            app: {},
            pagesData: [
                {
                    meta: {
                        title: 'Undated Post',
                        href: '/posts/undated.html',
                        createdAt: '2024-05-05',
                    },
                },
            ],
        })

        expect(result.pageList).toHaveLength(1)
        expect(result.pageList[0].title).toBe('Undated Post')
    })

    it('handles empty pagesData gracefully', async () => {
        await writeConfig(`
page_path: /empty
`)

        const { getAppData } = await import('../index.js')
        const result = getAppData({ app: {}, pagesData: [] })

        expect(result.pageList).toHaveLength(0)
    })
})
