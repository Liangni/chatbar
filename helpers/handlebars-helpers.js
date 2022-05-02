const dayjs = require('dayjs')
module.exports = {
  dateFormator: (options) => { return dayjs(options.fn(this)).format('MM/DD/YYYY') },
  makeArray: (...items) => { 
    items.pop()
    return items
  },
  some: (a, arr, options) => {
    if (arr.some(item => a === item )) return options.fn(this)
  },
  ifCond: (a, b, options) => { 
    if (a === b) return options.fn(this)
  }
}