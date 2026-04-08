import { useMemo, useEffect, useState } from 'react'
import { dateToStr, timeToMin, START_HOUR, END_HOUR, SLOT_H } from '../utils'

const WEEKDAYS = ['월', '화', '수', '목', '금']
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR)
const HEADER_H = 78  // px, must match .wk-header height in CSS

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getNowMin() {
  const n = new Date()
  return n.getHours() * 60 + n.getMinutes()
}

export default function CalendarWeekly({ currentDate, bookings, onDateClick, onBookingClick }) {
  const todayStr = dateToStr(new Date())
  const [nowMin, setNowMin] = useState(getNowMin())

  useEffect(() => {
    const t = setInterval(() => setNowMin(getNowMin()), 60000)
    return () => clearInterval(t)
  }, [])

  const weekDates = useMemo(() => {
    const monday = getMonday(currentDate)
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [currentDate])

  const todayColIndex = weekDates.findIndex((d) => dateToStr(d) === todayStr)
  const isThisWeek = todayColIndex !== -1

  const getBookingsForDate = (date) =>
    bookings.filter((b) => b.date === dateToStr(date))

  const totalH = HOURS.length * SLOT_H
  const nowTop = ((nowMin - START_HOUR * 60) / 60) * SLOT_H

  return (
    <div className="calendar-weekly">
      <div className="wk-scroll">
        <div className="wk-inner" style={{ height: HEADER_H + totalH + 'px' }}>

          {/* Sticky header */}
          <div className="wk-header">
            <div className="wk-gutter" />
            {weekDates.map((date, i) => {
              const isToday = dateToStr(date) === todayStr
              return (
                <div
                  key={i}
                  className={`wk-day-header${isToday ? ' today' : ''}`}
                  onClick={() => onDateClick(date)}
                >
                  <span className="wk-weekday">{WEEKDAYS[i]}</span>
                  <span className={`wk-date-num${isToday ? ' today-badge' : ''}`}>
                    {date.getDate()}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Hour grid */}
          <div className="wk-grid">
            {HOURS.map((h) => (
              <div key={h} className="wk-row">
                <div className="wk-hour-label">{h}:00</div>
                {[0,1,2,3,4].map((d) => <div key={d} className="wk-cell" />)}
              </div>
            ))}
          </div>

          {/* Events overlay */}
          <div className="wk-events-layer" style={{ top: HEADER_H + 'px' }}>
            {weekDates.map((date, di) =>
              getBookingsForDate(date).map((b) => {
                const startMin = timeToMin(b.startTime) - START_HOUR * 60
                const endMin   = timeToMin(b.endTime)   - START_HOUR * 60
                const durationMin = endMin - startMin
                const top    = (startMin / 60) * SLOT_H
                const height = Math.max((durationMin / 60) * SLOT_H, 24)
                const titleFontSize =
                  durationMin <= 10 ? '10px' :
                  durationMin <= 20 ? '12px' :
                  durationMin <= 30 ? '14px' : '17px'
                const eventPadding =
                  height <= 24 ? '1px 5px' :
                  height <= 32 ? '2px 6px' : undefined
                return (
                  <div
                    key={b.id}
                    className="wk-event"
                    style={{
                      top:     top + 'px',
                      height:  height + 'px',
                      left:    `calc(${di} * 100% / 5 + 3px)`,
                      width:   `calc(100% / 5 - 6px)`,
                      ...(eventPadding && { padding: eventPadding }),
                    }}
                    onClick={() => onBookingClick(b)}
                  >
                    <span className="wk-event-title" style={{ fontSize: titleFontSize }}>{b.title}</span>
                  </div>
                )
              })
            )}

            {/* Current time line */}
            {isThisWeek && nowMin >= START_HOUR * 60 && nowMin <= END_HOUR * 60 && (
              <div
                className="wk-now-line"
                style={{
                  top:   nowTop + 'px',
                  left:  `calc(${todayColIndex} * 100% / 5)`,
                  width: `calc(100% / 5)`,
                }}
              >
                <div className="wk-now-dot" />
                <div className="wk-now-bar" />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
