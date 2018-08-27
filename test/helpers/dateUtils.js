const now = () => {
  return timestampFromDate(new Date().toISOString())
}

const today = () => {
  return timestampFromDate(new Date().toISOString().substr(0, 10))
}

const date = (year, month, date) => {
  return timestampFromDate(`${year}-${month}-${date}`)
}

const timestampFromDate = date => {
  return Math.floor(new Date(date).getTime() / 1000)
}

const dateFromTimestamp = timestamp => {
  new Date(Number(timestamp) * 1000)
}

module.exports = {
  now,
  today,
  date,
  timestampFromDate,
  dateFromTimestamp
}
