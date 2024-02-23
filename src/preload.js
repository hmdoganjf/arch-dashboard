const { contextBridge, ipcRenderer } = require('electron')

const url = location.href

if (url.includes('main_window')) {
  contextBridge.exposeInMainWorld('ipcRenderer', {
    getEscalations: () => ipcRenderer.invoke('getEscalations'),
    muteEscalations: duration => ipcRenderer.send('muteEscalations', duration),
    ackEscalation: id => ipcRenderer.send('ackEscalation', id),
    getL3Link: () => process.env.L3_LINK
  })
} else {
  // add a script that will trigger on mouse hovers:
  // if the mouse is not hovered for 5 seconds after the start of the app, send a message to the main process
  // if the mouse is not hovered for 5 seconds after any hover, send a message to the main process
  let timer = null
  const TIMEOUT_MS = process.env.TIMEOUT_SECONDS * 1000
  // there are 4 windows in main process, we should only send the message from visible window
  // so we need to check if the window is visible
  // if it is visible, we will send the message to main process
  // if it is not visible, we will do nothing

  timer = setTimeout(() => {
    ipcRenderer.send('stagnant', {
      url: location.href,
      source: 'start'
    })
  }, TIMEOUT_MS)

  const onMouseMove = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      ipcRenderer.send('stagnant', {
        url: location.href,
        source: 'hover'
      })
    }, TIMEOUT_MS)
  }

  const onKeyPress = (e) => {
    console.log(e);
    switch(e.key) {
      case 'p':
      case 'ArrowLeft':
        ipcRenderer.send('prev', {
          url: location.href,
          source: 'keypress'
        })
        break;
      case 'n':
      case 'ArrowRight':
        ipcRenderer.send('next', {
          url: location.href,
          source: 'keypress'
        })
        break;
      default:
        break;
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      ipcRenderer.send('stagnant', {
        url: location.href,
        source: 'hover'
      })
    }, TIMEOUT_MS)
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('keydown', onKeyPress);
}
