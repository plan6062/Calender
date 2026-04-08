import { dateToStr, timeToMin, START_HOUR, END_HOUR, SLOT_H } from '../utils'

const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR)

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
            const durationMin = endMin - startMin
            const top    = (startMin / 60) * SLOT_H
            const height = Math.max((durationMin / 60) * SLOT_H, 24)
            const titleFontSize =
              durationMin <= 10 ? '11px' :
              durationMin <= 20 ? '14px' :
              durationMin <= 30 ? '17px' : '22px'
            const eventPadding =
              height <= 24 ? '2px 8px' :
              height <= 36 ? '4px 10px' : undefined
            const isCompact = durationMin <= 30
            return (
              <div
                key={b.id}
                className="dl-event"
                style={{
                  top: top + 'px',
                  height: height + 'px',
                  ...(eventPadding && { padding: eventPadding }),
                  ...(isCompact && { flexDirection: 'row', alignItems: 'center', gap: '6px' }),
                }}
                onClick={() => onBookingClick(b)}
              >
                <span className="dl-event-time">{b.startTime} – {b.endTime}</span>
                <span className="dl-event-title" style={{ fontSize: titleFontSize, flex: isCompact ? 1 : undefined }}>{b.title}</span>
                <span className="dl-event-name" style={isCompact ? { fontSize: '11px', flexShrink: 0 } : {}}>{b.name}</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
