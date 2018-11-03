import FrameHost from '../../src/framehost';

const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');

const actions = {
  receiveFromTestPage: (data) => {
    console.log('receiveFromTestPage-----', data);
  },
}
const origin = 'http://example.b.com:9000';

let framehost = null;
btn1.addEventListener('click', () => {
  // open new window
  const targetWin = window.open('http://example.b.com:9000/test');
  framehost = new FrameHost(actions, origin, targetWin);
}, false)

btn2.addEventListener('click', () => {
  framehost.postMessage({
    action: 'messageFromWindowPageTest',
    data: 'I am a message that from window page'
  })
}, false);