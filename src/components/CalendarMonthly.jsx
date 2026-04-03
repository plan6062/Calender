import { useMemo } from 'react'

const WEEKDAYS = ['월', '화', '수', '목', '금']

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export default function CalendarMonthly({ currentDate, bookings, onDateClick }) {
  const today = new Date()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const weeks = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Start from Monday of the first week
    const startDate = new Date(firstDay)
    const dayOfWeek = startDate.getDay() // 0=Sun, 1=Mon...
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startDate.setDate(startDate.getDate() + diff)

    const rows = []
    let current = new Date(startDate)

    while (current <= lastDay || current.getMonth() === month) {
      const week = []
      for (let d = 0; d < 7; d++) {
        week.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      // startDate is Monday, so week[0]=Mon, week[1]=Tue, ..., week[4]=Fri
      const mf = [week[0], week[1], week[2], week[3], week[4]]
      rows.push(mf)
      if (current > lastDay && current.getDay() === 1) break
      if (current > lastDay && rows.length >= 6) break
    }
    return rows
  }, [year, month])

  const getBookingsForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    return bookings.filter((b) => b.date === dateStr)
  }

  return (
    <div className="calendar-monthly">
      <div className="weekday-header">
        {WEEKDAYS.map((d) => (
          <div key={d} className="weekday-label">{d}</div>
        ))}
      </div>
      <div className="month-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="week-row">
            {week.map((date, di) => {
              const isToday = isSameDate(date, today)
              const isCurrentMonth = date.getMonth() === month
              const dayBookings = getBookingsForDate(date)
              return (
                <div
                  key={di}
                  className={`day-cell${isCurrentMonth ? '' : ' other-month'}${isToday ? ' today' : ''}`}
                  onClick={() => onDateClick(date)}
                >
                  <span className={`day-number${isToday ? ' today-badge' : ''}`}>
                    {date.getDate()}
                  </span>
                  <div className="day-bookings">
                    {dayBookings.slice(0, 2).map((b) => (
                      <div key={b.id} className="booking-chip" title={b.title}>
                        {b.startTime} {b.title}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="booking-more">+{dayBookings.length - 2}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
