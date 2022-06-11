const dayjs = require('dayjs')
const dayOfYear = require('dayjs/plugin/dayOfYear')
dayjs.extend(dayOfYear)

const formatMessageTime = (createdAt) => {
  const today = dayjs(new Date())
  const yesterday = dayjs(new Date()).subtract(1, 'day')
  const createdDay = dayjs(createdAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }))

  switch (createdDay.dayOfYear()) {
    case today.dayOfYear():
      return createdDay.format('HH:mm')
    case yesterday.dayOfYear():
      return '昨天'
    default:
      return  createdDay.format('MM/DD/YYYY')
  }
}

module.exports = {
  formatMessageTime
}