const { getConfig } = require('../plugin-helper')

module.exports = (() => {
  const getPageList = pagesData => {
    const config = getConfig(`${__dirname}/config/simple-page-list.yaml`)

    return pagesData.filter(({ meta }) => meta.htmlPathName.includes(config.page_path))
      .map(({ meta }) => ({
        href: meta.htmlPathName,
        date: Date.parse(meta.date),
        description: meta.description,
        moreLinkText: config.more_link_text,
        title: meta.title,
      }))
      .sort((a, b) => b.date - a.date)
  }

  const getAppData = data => {
    if (data.app !== null && typeof data.app === 'object') {
      return Object.assign({}, data.app, {
        pageList: getPageList(data.pagesData)
      })
    }

    return data.app
  }

  return {
    getAppData
  }
})()
