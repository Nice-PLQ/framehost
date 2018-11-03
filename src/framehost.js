import Message from './message';

const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

const noop = () => { };

const defaultAction = {
  INIT: 'init'
}

export default class FrameHost {
  constructor(actions, origin, win) {
    this.message = null;

    // actions must be a object
    if (!isObject(actions)) {
      throw new Error('actions must be a object');
    }

    if (origin && typeof origin !== 'string') {
      win = origin;
      origin = '';
    }

    if (origin && typeof isObject(origin) && win && typeof win === 'string') {
      [win, origin] = [origin, win];
    }

    // win - provide when initialization.
    // window.opener - reference to the window that opened the window using open().
    // window.top - reference to the topmost window in the window hierarchy.
    const targetWindow = win || window.opener || window.top;
    this.message = new Message(actions, origin, targetWindow);

    // emit init action
    this.message.emit({
      action: defaultAction.INIT
    });
  }

  postMessage(data, callback = noop) {
    if (!(this.message instanceof Message)) {
      return;
    }

    if (isObject(data)) {
      if (!data.action) {
        throw new Error('postMessage arguments must contain "action" attribute and not empty');
      }

      this.message.emit(data);
      callback();

    } else if (Array.isArray(data)) {
      data.forEach(item => {
        this.message.emit(item);
      });
      callback();

    } else {
      throw new Error('postMessage arguments must be a object or array');
    }
  }

  destroy() {
    this.message = null;
  }

}