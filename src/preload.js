// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.innerHTML = `
    console.log('preload script loaded');
`
document.head.appendChild(script);
