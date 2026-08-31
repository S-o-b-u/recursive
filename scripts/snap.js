const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9444',
    '--window-size=390,844',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + os.tmpdir() + '/edge_snap_' + Date.now(),
    '--disable-gpu',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await fetch('http://127.0.0.1:9444/json').then(r => r.json());
    const page = list.find(p => p.url.includes('localhost:3000')) || list[0];
    console.log('Page found:', page.url);
    
    const WebSocket = globalThis.WebSocket;
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    
    ws.onopen = () => {
      let msgId = 1;
      const send = (method, params = {}) => {
        return new Promise(resolve => {
          const id = msgId++;
          const handler = (event) => {
            const data = JSON.parse(event.data);
            if (data.id === id) {
              ws.removeEventListener('message', handler);
              resolve(data.result);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id, method, params }));
        });
      };

      (async () => {
        await send('Page.enable');
        await send('Runtime.enable');
        
        // Complete intro immediately
        await send('Runtime.evaluate', { 
          expression: `
            document.documentElement.dataset.intro = 'done';
            window.dispatchEvent(new CustomEvent('recursive-intro-done'));
            const introRoot = document.querySelector('.intro-root');
            if (introRoot) introRoot.style.display = 'none';
          `
        });
        
        await new Promise(r => setTimeout(r, 1200));

        await send('Runtime.evaluate', { 
          expression: `
            window.scrollTo(0, 0);
          `
        });
        
        await new Promise(r => setTimeout(r, 1200));
        
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('hero-mobile-snap.png', Buffer.from(screenshot.data, 'base64'));
        console.log('Saved screenshot to hero-mobile-snap.png');
        edge.kill();
        process.exit(0);
      })();
    };
  } catch(e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}

main();
