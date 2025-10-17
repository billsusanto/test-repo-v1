'use client'

import { useState, useEffect } from 'react'

interface TimeData {
  hours: number
  minutes: number
  seconds: number
  timeString: string
  dateString: string
}

interface Timezone {
  name: string
  city: string
  zone: string
  emoji: string
}

const timezones: Timezone[] = [
  { name: 'Los Angeles', city: 'LA', zone: 'America/Los_Angeles', emoji: '🌴' },
  { name: 'New York', city: 'NYC', zone: 'America/New_York', emoji: '🗽' },
  { name: 'London', city: 'LON', zone: 'Europe/London', emoji: '🎡' },
  { name: 'Tokyo', city: 'TYO', zone: 'Asia/Tokyo', emoji: '🗼' },
]

export default function Home() {
  const [selectedTimezone, setSelectedTimezone] = useState<Timezone>(timezones[0])
  const [timeData, setTimeData] = useState<TimeData>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    timeString: '',
    dateString: ''
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [is24Hour, setIs24Hour] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      // Get time for selected timezone
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone.zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour
      })
      
      const dateString = now.toLocaleDateString('en-US', {
        timeZone: selectedTimezone.zone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Get individual components for analog clock
      const hours = parseInt(now.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone.zone,
        hour: '2-digit',
        hour12: false
      }))
      const minutes = parseInt(now.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone.zone,
        minute: '2-digit'
      }))
      const seconds = parseInt(now.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone.zone,
        second: '2-digit'
      }))
      
      setTimeData({ hours, minutes, seconds, timeString, dateString })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [selectedTimezone, is24Hour])

  const secondsDegrees = (timeData.seconds / 60) * 360
  const minutesDegrees = ((timeData.minutes + timeData.seconds / 60) / 60) * 360
  const hoursDegrees = ((timeData.hours % 12 + timeData.minutes / 60) / 12) * 360

  return (
    <main className={isDarkMode ? 'dark' : ''}>
      <div className="container">
        {/* Controls */}
        <div className="controls">
          <button 
            className="control-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button 
            className="control-btn"
            onClick={() => setIs24Hour(!is24Hour)}
            title="Toggle time format"
          >
            {is24Hour ? '12H' : '24H'}
          </button>
        </div>

        <div className="clock-card">
          {/* Title with emoji */}
          <h1 className="title">
            <span className="emoji">{selectedTimezone.emoji}</span>
            {selectedTimezone.name}
          </h1>

          {/* Analog Clock */}
          <div className="analog-clock">
            <div className="clock-face">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="hour-marker" 
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <span style={{ transform: `rotate(-${i * 30}deg)` }}>
                    {i === 0 ? 12 : i}
                  </span>
                </div>
              ))}
              <div 
                className="hand hour-hand" 
                style={{ transform: `rotate(${hoursDegrees}deg)` }}
              />
              <div 
                className="hand minute-hand" 
                style={{ transform: `rotate(${minutesDegrees}deg)` }}
              />
              <div 
                className="hand second-hand" 
                style={{ transform: `rotate(${secondsDegrees}deg)` }}
              />
              <div className="center-dot" />
            </div>
          </div>

          {/* Digital Time */}
          <div className="time">{timeData.timeString}</div>
          <div className="date">{timeData.dateString}</div>

          {/* Timezone Selector */}
          <div className="timezone-selector">
            {timezones.map((tz) => (
              <button
                key={tz.zone}
                className={`timezone-btn ${selectedTimezone.zone === tz.zone ? 'active' : ''}`}
                onClick={() => setSelectedTimezone(tz)}
              >
                <span className="tz-emoji">{tz.emoji}</span>
                <span className="tz-city">{tz.city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
