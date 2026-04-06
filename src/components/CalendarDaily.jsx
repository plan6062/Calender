const START_HOUR = 8
const END_HOUR = 20
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR)
const SLOT_H = 64 // px per hour

function timeToMin(t) {
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

  const totalH = HOURS.length * SLOT_H

  return (
    <div className="calendar-daily">
      <div className="dl-inner" style={{ height: totalH + 'px' }}>

        {/* Hour grid */}
        <div className="dl-grid">
          {HOURS.map((h) => (
            <div key={h} className="dl-row">
              <div className="dl-hour-label">{h}:00</div>
              <div className="dl-cell" />
            </div>
          ))}
        </div>

        {/* Events overlay */}
        <div className="dl-events-layer">
          {dayBookings.map((b) => {
            const startMin = timeToMin(b.startTime) - START_HOUR * 60
            const endMin   = timeToMin(b.endTime)   - START_HOUR * 60
            const top    = (startMin / 60) * SLOT_H
            const height = Math.max(((endMin - startMin) / 60) * SLOT_H, 24)
            return (
              <div
                key={b.id}
                className="dl-event"
                style={{ top: top + 'px', height: height + 'px' }}
                onClick={() => onBookingClick(b)}
              >
                <span className="dl-event-time">{b.startTime} – {b.endTime}</span>
                <span className="dl-event-title">{b.title}</span>
                <span className="dl-event-name">{b.name}</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
