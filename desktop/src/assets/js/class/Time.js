const DAYMILLISECOND = 24 * 60 * 60 * 1000

function Time() {
  if (this instanceof Time) {
    // this.yesterday = Time.getPrevDate()
  } else {
    return new Time()
  }
}
/**
 * 获取当前时间的毫秒数
 */
Time.getCurrentMillisecond = () => {
  return new Date().getTime()
}
/**
 * 日期格式化方法
 * @argument(Date) date 日期时间
 */
Time.prototype.formatDate = (date) => {
  if (date.constructor !== Date) return
  return `${Time.getYear(date)}/${Time.getMonth(date)}/${Time.getDate(date)} ${Time.getHours(date)}:${Time.getMinutes(date)}:${Time.getSeconds(date)}`
}
/**
 * 日期补白方法
 * @argument(String) d 日期
 */
Time.padStartDate = (d) => {
  if (typeof d !== 'string') return
  return d.padStart(2, '0')
}
/**
 * 获取年
 * @argument(Date) date 日期
 */
Time.getYear = (date) => {
  if (date.constructor !== Date) return
  return date.getFullYear()
}
/**
 * 获取月
 * @argument(Date) date 日期
 */
Time.getMonth = (date) => {
  if (date.constructor !== Date) return
  let month = Number(date.getMonth()) + 1
  return Time.padStartDate(String(month))
}
/**
 * 获取当前日
 * @argument(Date) date 日期
 */
Time.getDate = (date) => {
  if (date.constructor !== Date) return
  return Time.padStartDate(String(date.getDate()))
}
/**
 * 获取小时
 * @argument(Date) date 日期
 */
Time.getHours = (date) => {
  if (date.constructor !== Date) return
  return Time.padStartDate(String(date.getHours()))
}
/**
 * 获取分钟数
 * @argument(Date) date 日期
 */
Time.getMinutes = (date) => {
  if (date.constructor !== Date) return
  return Time.padStartDate(String(date.getMinutes()))  
}
/**
 * 获取秒数
 * @argument(Date) date 日期
 */
Time.getSeconds = (date) => {
  if (date.constructor !== Date) return
  return Time.padStartDate(String(date.getSeconds()))  
}
/**
 * 获取前一天日期时间
 */
Time.prototype.getPrevDate = () => {
  const today = Time.getCurrentMillisecond()
  const yesterday = new Date(today - DAYMILLISECOND)
  return yesterday
}
/**
 * 获取当前日期的起始时间
 * @argument(Object) date 
 */
Time.prototype.getStartDate = (date) => {
  if (date.constructor !== Date) return
  const dateMill = date.getTime()
  const hour = date.getHours() * 60 * 60 * 1000 // 小时
  const minutes = date.getMinutes() * 60 * 1000 // 分
  const seconds = date.getSeconds() * 1000 // 秒
  return new Date(dateMill - hour - minutes - seconds)
}
/**
 * 获取当前时期的结束时间
 * @argument(Object) date
 */
Time.prototype.getEndDate = (date) => {
  if (date.constructor !== Date) return
  const dateMill = date.getTime()
  const MAXHOURS = 23
  const MAXMINUTES = 59
  const MAXSECONDS = 59
  const hour = (MAXHOURS - date.getHours()) * 60 * 60 * 1000 // 小时
  const minutes = (MAXMINUTES - date.getMinutes()) * 60 * 1000 // 分
  const seconds = (MAXSECONDS - date.getSeconds()) * 1000 // 秒
  return new Date(dateMill + hour + minutes + seconds)
}

export default Time
