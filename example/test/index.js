import FrameHost from '../../src/framehost';

const actions = {
  messageFromIframePageTest: (data) => {
    console.log('messageFromIframePageTest-----',data);
  },
  messageFromWindowPageTest: (data) => {
    console.log('messageFromWindowPageTest-----',data);
  },
}
const origin = 'http://example.a.com:9000';

const framehost = new FrameHost(actions, origin);

const button = document.querySelector('button');

button.addEventListener('click', () => {
  framehost.postMessage({
    action: 'receiveFromTestPage',
    data: 'I am a message that from test page'
  })
}, false);