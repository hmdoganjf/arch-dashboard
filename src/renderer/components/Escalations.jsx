import React from 'react'

const Escalations = ({ setIsPanic }) => {
  const [escalations, setEscalations] = React.useState([])
  const [muteDuration, setMuteDuration] = React.useState(15)

  React.useEffect(() => {
    const fetchEscalations = async () => {
      const newEsc = await window.ipcRenderer.getEscalations()
      setEscalations(newEsc)
      if (newEsc.length > 0) {
        setIsPanic(true)
      }
    }
    fetchEscalations()
  }, [])

  const handleMuteSelect = e => {
    const duration = e.target.value
    setMuteDuration(duration)
  }

  const handleMute = async () => {
    setIsPanic(false)
    await window.ipcRenderer.muteEscalations(muteDuration * 60 * 1000)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <h1>Current Escalation(s)</h1>
      <ol>
        {escalations?.map(escalation => (
          <li key={escalation.id}>
            <a
              target='_blank'
              href={`${window.ipcRenderer.getL3Link()}/${escalation.id}`}
            >
              <h2>{`${escalation.title} - ${escalation.created_at}`}</h2>
            </a>
            <button
              onClick={() => window.ipcRenderer.ackEscalation(escalation.id)}
            >
              Acknowledge
            </button>
          </li>
        ))}
      </ol>
      <div>
        <select onChange={handleMuteSelect}>
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
          <option value={120}>120</option>
        </select>
        <button onClick={handleMute}>Mute</button>
      </div>
    </div>
  )
}

export default Escalations
