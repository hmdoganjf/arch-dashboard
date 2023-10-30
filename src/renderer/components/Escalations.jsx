import React from 'react'

const Escalations = ({ setIsPanic }) => {
  const [escalations, setEscalations] = React.useState([])
  const [muteDuration, setMuteDuration] = React.useState(15)

  React.useEffect(() => {
    const fetchEscalations = async () => {
      const newEsc = await window.ipcRenderer.getEscalations();
      setEscalations(newEsc);
      if (newEsc.length > 0) {
        setIsPanic(true);
      }
    }
    fetchEscalations();
  }, [])

  const handleMuteSelect = (e) => {
    const duration = e.target.value;
    setMuteDuration(duration);
  }

  const handleMute = () => {
    setIsPanic(false);
    window.ipcRenderer.muteEscalations(muteDuration * 60 * 1000);
  }

  return (
    <>
      <h1>Current Escalations</h1>
      <ol>
        {escalations?.map((escalation) => (
          <li key={escalation.id}>
            <a target='_blank' href={`${window.ipcRenderer.getL3Link()}/${escalation.id}`}>
              <h2>{`${escalation.title} - ${escalation.created_at}`}</h2>
            </a>
          </li>
        ))}
      </ol>
      <select onChange={handleMuteSelect}>
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
          <option value={120}>120</option>
      </select>
      <button onClick={handleMute}>Mute</button>
    </>
  )
}

export default Escalations
