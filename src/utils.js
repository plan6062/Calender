export const START_HOUR = 8
export const END_HOUR = 20
export const SLOT_H = 64 // px per hour

export function dateToStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function timeToMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
