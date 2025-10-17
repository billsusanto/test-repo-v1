'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  region: string
}

const timezones: Timezone[] = [
  // Americas
  { name: 'Los Angeles', city: 'LA', zone: 'America/Los_Angeles', emoji: '🌴', region: 'Americas' },
  { name: 'San Francisco', city: 'SF', zone: 'America/Los_Angeles', emoji: '🌉', region: 'Americas' },
  { name: 'Denver', city: 'DEN', zone: 'America/Denver', emoji: '🏔️', region: 'Americas' },
  { name: 'Chicago', city: 'CHI', zone: 'America/Chicago', emoji: '🌆', region: 'Americas' },
  { name: 'New York', city: 'NYC', zone: 'America/New_York', emoji: '🗽', region: 'Americas' },
  { name: 'Toronto', city: 'YYZ', zone: 'America/Toronto', emoji: '🍁', region: 'Americas' },
  { name: 'Mexico City', city: 'MEX', zone: 'America/Mexico_City', emoji: '🌮', region: 'Americas' },
  { name: 'São Paulo', city: 'SAO', zone: 'America/Sao_Paulo', emoji: '🇧🇷', region: 'Americas' },
  { name: 'Buenos Aires', city: 'BUE', zone: 'America/Argentina/Buenos_Aires', emoji: '⚽', region: 'Americas' },
  
  // Europe
  { name: 'London', city: 'LON', zone: 'Europe/London', emoji: '🎡', region: 'Europe' },
  { name: 'Paris', city: 'PAR', zone: 'Europe/Paris', emoji: '🗼', region: 'Europe' },
  { name: 'Berlin', city: 'BER', zone: 'Europe/Berlin', emoji: '🍺', region: 'Europe' },
  { name: 'Rome', city: 'ROM', zone: 'Europe/Rome', emoji: '🍕', region: 'Europe' },
  { name: 'Madrid', city: 'MAD', zone: 'Europe/Madrid', emoji: '💃', region: 'Europe' },
  { name: 'Amsterdam', city: 'AMS', zone: 'Europe/Amsterdam', emoji: '🚲', region: 'Europe' },
  { name: 'Stockholm', city: 'STO', zone: 'Europe/Stockholm', emoji: '👑', region: 'Europe' },
  { name: 'Moscow', city: 'MOW', zone: 'Europe/Moscow', emoji: '🏰', region: 'Europe' },
  
  // Asia
  { name: 'Dubai', city: 'DXB', zone: 'Asia/Dubai', emoji: '🏜️', region: 'Asia' },
  { name: 'Mumbai', city: 'BOM', zone: 'Asia/Kolkata', emoji: '🕌', region: 'Asia' },
  { name: 'Bangkok', city: 'BKK', zone: 'Asia/Bangkok', emoji: '🛕', region: 'Asia' },
  { name: 'Singapore', city: 'SIN', zone: 'Asia/Singapore', emoji: '🦁', region: 'Asia' },
  { name: 'Hong Kong', city: 'HKG', zone: 'Asia/Hong_Kong', emoji: '🏙️', region: 'Asia' },
  { name: 'Shanghai', city: 'SHA', zone: 'Asia/Shanghai', emoji: '🐉', region: 'Asia' },
  { name: 'Tokyo', city: 'TYO', zone: 'Asia/Tokyo', emoji: '🗼', region: 'Asia' },
  { name: 'Seoul', city: 'SEL', zone: 'Asia/Seoul', emoji: '🏯', region: 'Asia' },
  
  // Oceania
  { name: 'Sydney', city: 'SYD', zone: 'Australia/Sydney', emoji: '🦘', region: 'Oceania' },
  { name: 'Melbourne', city: 'MEL', zone: 'Australia/Melbourne', emoji: '🏏', region: 'Oceania' },
  { name: 'Auckland', city: 'AKL', zone: 'Pacific/Auckland', emoji: '🥝', region: 'Oceania' },
  
  // Africa
  { name: 'Cairo', city: 'CAI', zone: 'Africa/Cairo', emoji: '🐫', region: 'Africa' },
  { name: 'Lagos', city: 'LOS', zone: 'Africa/Lagos', emoji: '🌍', region: 'Africa' },
  { name: 'Johannesburg', city: 'JNB', zone: 'Africa/Johannesburg', emoji: '🦁', region: 'Africa' },
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
  const [showTimezoneModal, setShowTimezoneModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
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

  const regions = ['all', ...Array.from(new Set(timezones.map(tz => tz.region)))]

  const filteredTimezones = timezones.filter(tz => {
    const matchesSearch = tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tz.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === 'all' || tz.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const clockVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        duration: 0.8
      }
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <main className={isDarkMode ? 'dark' : ''}>
      <motion.div 
        className="container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated background particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <motion.div 
          className="controls"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button 
            className="control-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle theme"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isDarkMode ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.button 
            className="control-btn"
            onClick={() => setIs24Hour(!is24Hour)}
            title="Toggle time format"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {is24Hour ? '12H' : '24H'}
          </motion.button>
        </motion.div>

        <motion.div 
          className="clock-card"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Title with emoji */}
          <AnimatePresence mode="wait">
            <motion.h1 
              className="title"
              key={selectedTimezone.zone}
              initial={{ opacity: 0, x: -30, rotateY: -90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 30, rotateY: 90 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="emoji"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.15, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              >
                {selectedTimezone.emoji}
              </motion.span>
              {selectedTimezone.name}
            </motion.h1>
          </AnimatePresence>

          {/* Analog Clock */}
          <motion.div 
            className="analog-clock"
            variants={clockVariants}
          >
            <motion.div 
              className="clock-face"
              animate={{
                boxShadow: [
                  '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.2)',
                  '0 15px 40px rgba(0, 0, 0, 0.4), inset 0 0 35px rgba(255, 255, 255, 0.3)',
                  '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.2)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="hour-marker" 
                  style={{ transform: `rotate(${i * 30}deg)` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.6 + i * 0.04,
                    type: 'spring',
                    stiffness: 250
                  }}
                >
                  <motion.span 
                    style={{ transform: `rotate(-${i * 30}deg)` }}
                    whileHover={{ scale: 1.3, color: '#fff' }}
                  >
                    {i === 0 ? 12 : i}
                  </motion.span>
                </motion.div>
              ))}
              <motion.div 
                className="hand hour-hand" 
                style={{ transform: `rotate(${hoursDegrees}deg)` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.9, type: 'spring', stiffness: 150 }}
              />
              <motion.div 
                className="hand minute-hand" 
                style={{ transform: `rotate(${minutesDegrees}deg)` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 150 }}
              />
              <motion.div 
                className="hand second-hand" 
                style={{ transform: `rotate(${secondsDegrees}deg)` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.1, type: 'spring', stiffness: 150 }}
              />
              <motion.div 
                className="center-dot"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
            </motion.div>
          </motion.div>

          {/* Digital Time */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="time"
              key={timeData.timeString}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {timeData.timeString}
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            {timeData.dateString}
          </motion.div>

          {/* Change Timezone Button */}
          <motion.button
            className="change-timezone-btn"
            onClick={() => setShowTimezoneModal(true)}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            🌍 Change Timezone
          </motion.button>
        </motion.div>

        {/* Timezone Selection Modal */}
        <AnimatePresence>
          {showTimezoneModal && (
            <>
              <motion.div
                className="modal-backdrop"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setShowTimezoneModal(false)}
              />
              <motion.div
                className="timezone-modal"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div 
                  className="modal-header"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2>Select Timezone</h2>
                  <motion.button
                    className="close-btn"
                    onClick={() => setShowTimezoneModal(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </motion.div>

                <motion.input
                  className="search-input"
                  type="text"
                  placeholder="🔍 Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />

                <motion.div 
                  className="region-filters"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {regions.map((region, index) => (
                    <motion.button
                      key={region}
                      className={`region-btn ${selectedRegion === region ? 'active' : ''}`}
                      onClick={() => setSelectedRegion(region)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      {region === 'all' ? '🌎 All' : region}
                    </motion.button>
                  ))}
                </motion.div>

                <motion.div 
                  className="timezone-grid"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.03
                      }
                    }
                  }}
                >
                  {filteredTimezones.map((tz, index) => (
                    <motion.button
                      key={tz.zone + tz.name}
                      className={`timezone-card ${selectedTimezone.zone === tz.zone ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTimezone(tz)
                        setShowTimezoneModal(false)
                        setSearchQuery('')
                      }}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.8 },
                        visible: { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: {
                            type: 'spring',
                            stiffness: 200,
                            damping: 20
                          }
                        }
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span 
                        className="card-emoji"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                      >
                        {tz.emoji}
                      </motion.span>
                      <div className="card-info">
                        <div className="card-name">{tz.name}</div>
                        <div className="card-city">{tz.city}</div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
