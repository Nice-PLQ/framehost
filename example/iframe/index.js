import FrameHost from '../../src/framehost';

const iframe = document.querySelector('iframe');
const button = document.querySelector('button');

const actions = {
  receiveFromTestPage: (data) => {
    console.log('receiveFromTestPage-----', data);
  },
};

const origin = 'http://example.b.com:9000';

const framehost = new FrameHost(actions, origin, iframe.contentWindow);

button.addEventListener('click', () => {
  framehost.postMessage({
    action: 'messageFromIframePageTest',
    data: 'I am a message that from iframe example'
  });
}, false);