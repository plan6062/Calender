export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'month', label: '월' },
    { id: 'week', label: '주' },
    { id: 'day', label: '일' },
  ]

  return (
    <nav className="tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tabbar-btn${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
