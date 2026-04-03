export default function TodaySchedule({ bookings, onBookingClick }) {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  const todayBookings = bookings
    .filter((b) => b.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const formatTime = (t) => {
    const [h, m] = t.split(':')
    return `${h}:${m}`
  }

  return (
    <section className="today-schedule">
      <h3 className="today-title">오늘 일정</h3>
      {todayBookings.length === 0 ? (
        <p className="no-schedule">오늘 예약 없음</p>
      ) : (
        <ul className="schedule-list">
          {todayBookings.map((b) => (
            <li
              key={b.id}
              className="schedule-item"
              onClick={() => onBookingClick(b)}
            >
              <span className="schedule-time">
                {formatTime(b.startTime)} – {formatTime(b.endTime)}
              </span>
              <span className="schedule-title">{b.title}</span>
              <span className="schedule-name">{b.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
