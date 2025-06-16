import { padNumber } from './padNumber'

export const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`
}

export const timestampToDateWithSeconds = (timestamp: number) => {
  const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`
}
