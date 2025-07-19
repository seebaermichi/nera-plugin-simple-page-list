import { describe, it, expect } from 'vitest'
import { getAppData } from '../index.js'

describe('Simple Page List plugin', () => {
    it('adds a page list to app data', () => {
        const app = { title: 'Test App' }
        const pagesData = [
            {
                meta: {
                    title: 'Blog Post 1',
                    description: 'First blog post',
                    href: '/posts/blog-post-1.html',
                    createdAt: '2025-01-01',
                },
            },
            {
                meta: {
                    title: 'Blog Post 2',
                    description: 'Second blog post',
                    href: '/posts/blog-post-2.html',
                    createdAt: '2025-01-02',
                },
            },
            {
                meta: {
                    title: 'About Page',
                    description: 'About us',
                    href: '/about.html',
                    createdAt: '2025-01-01',
                },
            },
        ]

        const result = getAppData({ app, pagesData })

        expect(result.pageList).toBeDefined()
        expect(result.pageList).toHaveLength(2) // Only posts matching /posts path
        expect(result.pageList[0].title).toBe('Blog Post 2') // Sorted by date desc
        expect(result.pageList[1].title).toBe('Blog Post 1')
    })

    it('handles empty pages data gracefully', () => {
        const app = { title: 'Test App' }
        const pagesData = []

        const result = getAppData({ app, pagesData })

        expect(result.pageList).toBeDefined()
        expect(result.pageList).toHaveLength(0)
    })

    it('preserves existing app data', () => {
        const app = { title: 'Test App', siteUrl: 'https://example.com' }
        const pagesData = []

        const result = getAppData({ app, pagesData })

        expect(result.title).toBe('Test App')
        expect(result.siteUrl).toBe('https://example.com')
        expect(result.pageList).toBeDefined()
    })

    it('sorts pages by date in descending order', () => {
        const app = { title: 'Test App' }
        const pagesData = [
            {
                meta: {
                    title: 'Old Post',
                    href: '/posts/old-post.html',
                    createdAt: '2024-01-01',
                },
            },
            {
                meta: {
                    title: 'New Post',
                    href: '/posts/new-post.html',
                    createdAt: '2025-01-01',
                },
            },
            {
                meta: {
                    title: 'Middle Post',
                    href: '/posts/middle-post.html',
                    createdAt: '2024-06-01',
                },
            },
        ]

        const result = getAppData({ app, pagesData })

        expect(result.pageList[0].title).toBe('New Post')
        expect(result.pageList[1].title).toBe('Middle Post')
        expect(result.pageList[2].title).toBe('Old Post')
    })

    it('includes more link text from config', () => {
        const app = { title: 'Test App' }
        const pagesData = [
            {
                meta: {
                    title: 'Test Post',
                    href: '/posts/test-post.html',
                    createdAt: '2025-01-01',
                },
            },
        ]

        const result = getAppData({ app, pagesData })

        expect(result.pageList[0].moreLinkText).toBeDefined()
        expect(typeof result.pageList[0].moreLinkText).toBe('string')
    })
})
