import * as React from 'react'
import { createRoot } from 'react-dom/client'
import Escalations from './components/Escalations.jsx'
import PanicOverlay from './components/PanicOverlay.jsx'

const root = createRoot(document.getElementById('root'))

const App = () => {
  const [isPanic, setIsPanic] = React.useState(false)

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      setIsPanic(!isPanic)
    }
  }

  const handleMouseClick = event => {
    if (event.button === 2) {
      setIsPanic(!isPanic)
    }
  }

  React.useEffect(() => {
    document.addEventListener('keypress', handleKeyPress)
    document.addEventListener('mousedown', handleMouseClick)
    return () => {
      document.removeEventListener('keypress', handleKeyPress)
      document.removeEventListener('mousedown', handleMouseClick)
    }
  }, [isPanic])

  return (
    <>
      <PanicOverlay isPanic={isPanic} />
      <Escalations setIsPanic={setIsPanic} />
    </>
  )
}

root.render(<App />)
