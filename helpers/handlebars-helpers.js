const dayjs = require('dayjs')

module.exports = {
    dateFormator: (options) => dayjs(options.fn(this).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })).format('MM/DD/YYYY'),
    makeArray: (...items) => {
        items.pop()
        return items
    },
    some: (a, arr, options) => {
        if (arr.some((item) => a === item)) return options.fn(this)
    },
    ifCond: (a, b, options) => {
        if (a === b) return options.fn(this)
    },
    getFileNameFromUrl: (options) => {
        const indexes = []
        let index = options.fn(this).indexOf('/')

        while (index !== -1) {
            indexes.push(index)
            index = options.fn(this).indexOf('/', index + 1)
        }
        const fileNameIndexStart = indexes[indexes.length - 1] + 1
        const fileName = options.fn(this).slice(fileNameIndexStart, options.fn(this).length)
        return fileName
    }
}
