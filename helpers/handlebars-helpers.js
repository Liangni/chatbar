const dayjs = require('dayjs')
module.exports = {
  dateFormator: (options) => { return dayjs(options.fn(this)).format('MM/DD/YYYY') }
}