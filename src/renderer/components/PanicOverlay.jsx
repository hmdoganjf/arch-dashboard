import React from 'react'
import alarmsound from '../assets/alarm.mp3'

const PanicOverlay = ({ isPanic }) => {
  const [isIncreasing, setIsIncreasing] = React.useState(true)
  React.useEffect(() => {
    const overlay = document.getElementById('panic-overlay')
    if (isPanic) {
      // make opacity fluctuate between 0 and 1 steadily
      const interval = setInterval(() => {
        const opacity = parseFloat(overlay.style.opacity)
        if (isIncreasing && opacity < 1) {
          overlay.style.opacity = opacity + 0.1
        } else if (isIncreasing && opacity >= 1) {
          setIsIncreasing(false)
        } else if (!isIncreasing && opacity > 0) {
          overlay.style.opacity = opacity - 0.1
        } else if (!isIncreasing && opacity <= 0) {
          setIsIncreasing(true)
        }
      }, 40)
      return () => {
        clearInterval(interval)
      }
    }
    else {
      overlay.style.opacity = 0
    }
  }, [isPanic, isIncreasing])

  React.useEffect(() => {
    if (isPanic) {
      const audio = new Audio(alarmsound)
      audio.play()
      return () => {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [isPanic])

  return (
    <div
      id='panic-overlay'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'red',
        zIndex: -1,
        opacity: 0
      }}
    />
  )
}

export default PanicOverlay
