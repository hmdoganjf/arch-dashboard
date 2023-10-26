import * as React from 'react';
import { createRoot } from 'react-dom/client';
const ipc = window.require('electron').ipcRenderer;

const root = createRoot(document.body);

function openChildWindow(){ 
    ipc.send('openChildWindow');   
}

function closeChildWindow(){ 
    ipc.send('closeChildWindow');   
}

root.render(
    <div>
        <h2>Hello from React! test</h2>
        <button onClick={openChildWindow}>Go to window</button>
        <button onClick={closeChildWindow}>Close window</button>
    </div>
);
