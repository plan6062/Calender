const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8~20
const SLOT_HEIGHT = 72 // px per hour

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function dateToStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

export default function CalendarDaily({ currentDate, bookings, onBookingClick }) {
  const dateStr = dateToStr(currentDate)
  const dayBookings = bookings
    .filter((b) => b.date === dateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const TIMELINE_HEIGHT = HOURS.length * SLOT_HEIGHT

  return (
    <div className="calendar-daily">
      <div className="daily-timeline" style={{ height: TIMELINE_HEIGHT + 'px' }}>
        {HOURS.map((h) => (
          <div
            key={h}
            className="hour-line"
            style={{ top: (h - HOURS[0]) * SLOT_HEIGHT + 'px' }}
          >
            <span className="hour-label">{h}:00</span>
          </div>
        ))}

        <div className="daily-col">
          {dayBookings.map((b) => {
            const startMin = timeToMinutes(b.startTime) - HOURS[0] * 60
            const endMin = timeToMinutes(b.endTime) - HOURS[0] * 60
            const top = (startMin / 60) * SLOT_HEIGHT
            const height = Math.max(((endMin - startMin) / 60) * SLOT_HEIGHT, 24)
            return (
              <div
                key={b.id}
                className="booking-block daily-block"
                style={{ top: top + 'px', height: height + 'px' }}
                onClick={() => onBookingClick(b)}
              >
                <span className="block-time">{b.startTime} – {b.endTime}</span>
                <span className="block-title">{b.title}</span>
                <span className="block-name">{b.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
