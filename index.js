import path from 'path'
import { getConfig } from '@nera-static/plugin-utils'

const HOST_CONFIG_PATH = path.resolve(
    process.cwd(),
    'config/simple-page-list.yaml'
)

const config = getConfig(HOST_CONFIG_PATH)

function getPageList(pagesData) {
    if (!config) {
        return []
    }

    return pagesData
        .filter(({ meta }) => meta.href.includes(config.page_path))
        .map(({ meta }) => {
            // Parse date with fallback to createdAt
            let parsedDate
            if (meta.date) {
                // Support various date formats: YYYY-MM-DD, DD.MM.YYYY, timestamps
                if (typeof meta.date === 'string') {
                    // Convert DD.MM.YYYY to YYYY-MM-DD format for better parsing
                    const germanDateMatch = meta.date.match(
                        /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
                    )
                    if (germanDateMatch) {
                        const [, day, month, year] = germanDateMatch
                        parsedDate = Date.parse(
                            `${year}-${month.padStart(2, '0')}-${day.padStart(
                                2,
                                '0'
                            )}`
                        )
                    } else {
                        parsedDate = Date.parse(meta.date)
                    }
                } else {
                    parsedDate = Date.parse(meta.date)
                }
            }

            // Fallback to createdAt if date parsing failed or date is not provided
            if (!parsedDate || isNaN(parsedDate)) {
                parsedDate = Date.parse(meta.createdAt)
            }

            return {
                href: meta.href,
                date: parsedDate,
                description: meta.description,
                moreLinkText: config.more_link_text || 'Read more',
                title: meta.title,
            }
        })
        .sort((a, b) => b.date - a.date)
}

/**
 * Returns modified app data with page list.
 * @param {object} param - Object containing app and pagesData
 * @param {object} param.app - App data object
 * @param {object[]} param.pagesData - Array of page data objects
 * @returns {object} Modified app data with pageList
 */
export function getAppData({ app, pagesData }) {
    const pageList = getPageList(pagesData)
    return {
        ...app,
        pageList,
    }
}
