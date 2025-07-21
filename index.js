import path from 'path'
import { getConfig } from '@nera-static/plugin-utils'

const HOST_CONFIG_PATH = path.resolve(
    process.cwd(),
    'config/simple-page-list.yaml'
)

/**
 * Parse date safely with German format support
 */
function parseDate(meta) {
    const raw = meta.date
    if (typeof raw === 'string') {
        const germanMatch = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
        if (germanMatch) {
            const [, day, month, year] = germanMatch
            return Date.parse(
                `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            )
        }
        return Date.parse(raw)
    }
    if (raw instanceof Date) return raw.getTime()
    if (typeof raw === 'number') return raw

    return Date.parse(meta.createdAt)
}

/**
 * Extracts key from path (e.g. /posts/news → news)
 */
function getKeyFromPath(p) {
    return p.replace(/\/+$/, '').split('/').filter(Boolean).pop()
}

/**
 * Sort comparator
 */
function getSortFn(sortBy = 'date', sortOrder = 'descending') {
    const dir = sortOrder === 'ascending' ? 1 : -1

    return (a, b) => {
        const aVal = a[sortBy] ?? ''
        const bVal = b[sortBy] ?? ''
        if (aVal < bVal) return -1 * dir
        if (aVal > bVal) return 1 * dir
        return 0
    }
}

/**
 * Filters and maps pages for a given path
 */
function getPageData(pagesData, pagePath, config, sortBy, sortOrder) {
    return pagesData
        .filter(
            ({ meta }) =>
                meta.href?.includes(pagePath) &&
                !config.exclude_pages?.includes(meta.href)
        )
        .map(({ meta }) => ({
            ...meta,
            date: parseDate(meta),
            moreLinkText: config.more_link_text || 'Read more',
        }))
        .sort(getSortFn(sortBy, sortOrder))
}

/**
 * Build page list from config
 */
function getPageList(pagesData, config) {
    if (Array.isArray(config.page_paths)) {
        const paths = {}

        config.page_paths.forEach((entry) => {
            let dirPath, key, sortBy, sortOrder

            if (typeof entry === 'string') {
                dirPath = entry
                key = getKeyFromPath(entry)
                sortBy = config.sortBy || 'date'
                sortOrder = config.sortOrder || 'descending'
            } else if (typeof entry === 'object' && entry.path) {
                dirPath = entry.path
                key = entry.key ?? getKeyFromPath(dirPath)
                sortBy = entry.sortBy || config.sortBy || 'date'
                sortOrder = entry.sortOrder || config.sortOrder || 'descending'
            } else {
                return // Skip invalid entry
            }

            paths[key] = getPageData(
                pagesData,
                dirPath,
                config,
                sortBy,
                sortOrder
            )
        })

        return paths
    }

    // fallback for legacy config
    const sortBy = config.sortBy || 'date'
    const sortOrder = config.sortOrder || 'descending'
    return getPageData(pagesData, config.page_path, config, sortBy, sortOrder)
}

/**
 * Entry point for Nera plugin
 */
export function getAppData({ app, pagesData }) {
    const config = getConfig(HOST_CONFIG_PATH)

    if (!config || (!config.page_path && !config.page_paths)) {
        return app
    }

    return {
        ...app,
        pageList: getPageList(pagesData, config),
    }
}
