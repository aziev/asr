import { ref } from 'vue'

const now = ref(new Date())

setInterval(() => {now.value = new Date()}, 1000)

export function useDate() {
  const leftTime = (to) => {
    let milliseconds = to - now.value
    let totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
    let hours = Math.floor(totalSeconds / 3600)
    let minutes = Math.floor((totalSeconds % 3600) / 60)
    let seconds = totalSeconds % 60

    if (totalSeconds < 600) {
      return padAndConcatTime(hours, minutes, seconds)
    }

    return padAndConcatTime(hours, minutes)
  }

  return {
    now,
    leftTime
  }
}

/**
 * Converts Date instance to time string in format "hh:mm"
 */
export function dateToString (date) {
  return padAndConcatTime(
    date.getHours(),
    date.getMinutes()
  )
}

/**
 * Converts time string in format "hh:mm" to Date instance
 */
export function stringToDate(string, dayShift = 0) {
  const currentDate = new Date()
  const split = String(string).split(':')

  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + dayShift,
    Number(split[0]), // hours
    Number(split[1]) // minutes
  )
}

export function padAndConcatTime(hours, minutes, seconds = null) {
  let hh = String(hours).padStart(2, '0')
  let mm = String(minutes).padStart(2, '0')

  if (seconds !== null) {
    let ss = String(seconds).padStart(2, '0')

    return `${hh}:${mm}:${ss}`
  }

  return `${hh}:${mm}`
}