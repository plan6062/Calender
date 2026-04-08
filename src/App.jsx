import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { dateToStr } from './utils'
import TabBar from './components/TabBar'
import CalendarMonthly from './components/CalendarMonthly'
import CalendarWeekly from './components/CalendarWeekly'
import CalendarDaily from './components/CalendarDaily'
import TodaySchedule from './components/TodaySchedule'
import BookingModal from './components/BookingModal'
import './App.css'


function getMonthLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}

function getWeekLabel(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  return `${monday.getMonth() + 1}/${monday.getDate()} – ${friday.getMonth() + 1}/${friday.getDate()}`
}

function getDayLabel(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`
}

export default function App() {
  const [tab, setTab] = useState('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState([])
  const [modal, setModal] = useState(null) // null | { type: 'new', date } | { type: 'view', booking }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'bookings'), (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      list.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      setBookings(list)
    })
    return unsub
  }, [])

  const navigate = (dir) => {
    const d = new Date(currentDate)
    if (tab === 'month') {
      d.setMonth(d.getMonth() + dir)
    } else if (tab === 'week') {
      d.setDate(d.getDate() + dir * 7)
    } else {
      d.setDate(d.getDate() + dir)
    }
    setCurrentDate(d)
  }

  const goToday = () => setCurrentDate(new Date())

  const getHeaderLabel = () => {
    if (tab === 'month') return getMonthLabel(currentDate)
    if (tab === 'week') return getWeekLabel(currentDate)
    return getDayLabel(currentDate)
  }

  const handleDateClick = (date) => {
    setModal({ type: 'new', date: dateToStr(date) })
  }

  const handleBookingClick = (booking) => {
    setModal({ type: 'view', booking })
  }

  const handleFabClick = () => {
    setModal({ type: 'new', date: dateToStr(new Date()) })
  }

  const closeModal = () => setModal(null)

  const handleFullscreen = () => {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    }
  }

  return (
    <div className="app">
      {/* Today Schedule Section (위) */}
      <TodaySchedule bookings={bookings} onBookingClick={handleBookingClick} />

      {/* Calendar Section (아래) */}
      <div className="calendar-section">
        {/* Header */}
        <header className="cal-header">
          <button className="nav-btn" onClick={() => navigate(-1)}>‹</button>
          <div className="header-center">
            <span className="header-label">{getHeaderLabel()}</span>
            <button className="today-btn" onClick={goToday}>오늘</button>
          </div>
          <button className="nav-btn" onClick={() => navigate(1)}>›</button>
          <button className="fullscreen-btn" onClick={handleFullscreen} title="전체화면">⛶</button>
        </header>

        {/* Calendar View */}
        <div className="calendar-view">
          {tab === 'month' && (
            <CalendarMonthly
              currentDate={currentDate}
              bookings={bookings}
              onDateClick={handleDateClick}
            />
          )}
          {tab === 'week' && (
            <CalendarWeekly
              currentDate={currentDate}
              bookings={bookings}
              onDateClick={handleDateClick}
              onBookingClick={handleBookingClick}
            />
          )}
          {tab === 'day' && (
            <CalendarDaily
              currentDate={currentDate}
              bookings={bookings}
              onBookingClick={handleBookingClick}
            />
          )}
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={handleFabClick} aria-label="새 예약">+</button>

      {/* Tab Bar */}
      <TabBar activeTab={tab} onTabChange={setTab} />

      {/* Modal */}
      {modal && modal.type === 'new' && (
        <BookingModal
          initialDate={modal.date}
          bookings={bookings}
          onClose={closeModal}
        />
      )}
      {modal && modal.type === 'view' && (
        <BookingModal
          booking={modal.booking}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
