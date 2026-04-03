import { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '10', '20', '30', '40', '50']

function TimeSelect({ value, onChange, disabled }) {
  const [h, m] = value.split(':')
  return (
    <div className="time-select">
      <select
        value={h}
        onChange={(e) => onChange(`${e.target.value}:${m}`)}
        disabled={disabled}
      >
        {HOURS.map((hr) => (
          <option key={hr} value={hr}>{hr}시</option>
        ))}
      </select>
      <select
        value={m}
        onChange={(e) => onChange(`${h}:${e.target.value}`)}
        disabled={disabled}
      >
        {MINUTES.map((mn) => (
          <option key={mn} value={mn}>{mn}분</option>
        ))}
      </select>
    </div>
  )
}

export default function BookingModal({ booking, initialDate, bookings = [], onClose }) {
  const isView = !!booking

  const [form, setForm] = useState({
    title: '',
    name: '',
    date: initialDate || '',
    startTime: '09:00',
    endTime: '10:00',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (booking) {
      setForm({
        title: booking.title,
        name: booking.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      })
    }
  }, [booking])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.name.trim() || !form.date || !form.startTime || !form.endTime) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (form.startTime >= form.endTime) {
      setError('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }
    const conflict = bookings.find((b) =>
      b.date === form.date &&
      b.startTime < form.endTime &&
      b.endTime > form.startTime
    )
    if (conflict) {
      setError(`${conflict.startTime}~${conflict.endTime} "${conflict.title}" 예약과 시간이 겹칩니다.`)
      return
    }
    setLoading(true)
    try {
      await addDoc(collection(db, 'bookings'), {
        title: form.title.trim(),
        name: form.name.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        createdAt: serverTimestamp(),
      })
      onClose()
    } catch (e) {
      setError('저장 중 오류가 발생했습니다.')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('이 예약을 삭제하시겠습니까?')) return
    setLoading(true)
    try {
      await deleteDoc(doc(db, 'bookings', booking.id))
      onClose()
    } catch (e) {
      setError('삭제 중 오류가 발생했습니다.')
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isView ? '예약 상세' : '새 예약'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <p className="modal-error">{error}</p>}

          <label>회의명</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="회의 제목을 입력하세요"
            readOnly={isView}
            className={isView ? 'readonly' : ''}
          />

          <label>예약자</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="예약자 이름"
            readOnly={isView}
            className={isView ? 'readonly' : ''}
          />

          <label>날짜</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            readOnly={isView}
            className={isView ? 'readonly' : ''}
          />

          <div className="time-row">
            <div>
              <label>시작 시간</label>
              <TimeSelect
                value={form.startTime}
                onChange={(v) => setForm((prev) => ({ ...prev, startTime: v }))}
                disabled={isView}
              />
            </div>
            <div>
              <label>종료 시간</label>
              <TimeSelect
                value={form.endTime}
                onChange={(v) => setForm((prev) => ({ ...prev, endTime: v }))}
                disabled={isView}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isView ? (
            <button className="btn-delete" onClick={handleDelete} disabled={loading}>
              {loading ? '삭제 중...' : '예약 삭제'}
            </button>
          ) : (
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </button>
          )}
          <button className="btn-cancel" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  )
}
