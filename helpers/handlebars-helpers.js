const dayjs = require('dayjs')
module.exports = {
  dateFormator: (options) => { return dayjs(options.fn(this)).format('MM/DD/YYYY') },
  mkArr: (...items) => { 
    items.pop()
    return items
  },
  ifCond: (a, b, options) => { 
    if (Array.isArray(b) && b.includes(a)) return options.fn(this)
    if (a === b) return options.fn(this)
  }
}