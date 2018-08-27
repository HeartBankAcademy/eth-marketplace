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
  return Math.trunc(new Date(date).getTime() / 1000)
}

const dateFromTimestamp = timestamp => {
  new Date(Number(timestamp) * 1000)
}

const secondsAgo = _seconds => {
  return now() - 1000 * _seconds
}

const minutesAgo = _minutes => {
  return now() - 1000 * 60 * _minutes
}

const hoursAgo = _hours => {
  return now() - 1000 * 60 * 60 * _hours
}

module.exports = {
  now,
  today,
  date,
  timestampFromDate,
  dateFromTimestamp,
  secondsAgo,
  minutesAgo,
  hoursAgo
}
