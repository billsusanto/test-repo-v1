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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15
      }
    }
  }

  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  }

  return (
    <main className={isDarkMode ? 'dark' : ''}>
      <motion.div 
        className="container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Controls */}
        <motion.div 
          className="controls"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="control-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle theme"
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.span
              key={isDarkMode ? 'sun' : 'moon'}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </motion.span>
          </motion.button>
          <motion.button 
            className="control-btn"
            onClick={() => setIs24Hour(!is24Hour)}
            title="Toggle time format"
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {is24Hour ? '12H' : '24H'}
          </motion.button>
        </motion.div>

        <motion.div 
          className="clock-card"
          variants={itemVariants}
        >
          {/* Title with emoji */}
          <AnimatePresence mode="wait">
            <motion.h1 
              className="title"
              key={selectedTimezone.zone}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                className="emoji"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
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
            <div className="clock-face">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="hour-marker" 
                  style={{ transform: `rotate(${i * 30}deg)` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.8 + i * 0.05,
                    type: 'spring',
                    stiffness: 200
                  }}
                >
                  <span style={{ transform: `rotate(-${i * 30}deg)` }}>
                    {i === 0 ? 12 : i}
                  </span>
                </motion.div>
              ))}
              <motion.div 
                className="hand hour-hand" 
                style={{ transform: `rotate(${hoursDegrees}deg)` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1, type: 'spring' }}
              />
              <motion.div 
                className="hand minute-hand" 
                style={{ transform: `rotate(${minutesDegrees}deg)` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.1, type: 'spring' }}
              />
              <motion.div 
                className="hand second-hand" 
                style={{ transform: `rotate(${secondsDegrees}deg)` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
              />
              <motion.div 
                className="center-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, type: 'spring', stiffness: 200 }}
              />
            </div>
          </motion.div>

          {/* Digital Time */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="time"
              key={timeData.timeString}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {timeData.timeString}
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {timeData.dateString}
          </motion.div>

          {/* Timezone Selector */}
          <motion.div 
            className="timezone-selector"
            variants={itemVariants}
          >
            {timezones.map((tz, index) => (
              <motion.button
                key={tz.zone}
                className={`timezone-btn ${selectedTimezone.zone === tz.zone ? 'active' : ''}`}
                onClick={() => setSelectedTimezone(tz)}
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.6 + index * 0.1,
                  type: 'spring',
                  stiffness: 100
                }}
              >
                <motion.span 
                  className="tz-emoji"
                  animate={selectedTimezone.zone === tz.zone ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 0.5
                  }}
                >
                  {tz.emoji}
                </motion.span>
                <span className="tz-city">{tz.city}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  )
}
