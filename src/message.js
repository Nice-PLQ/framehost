export default class Message {
  constructor(actions, origin, win) {
    this.targetWindow = win;
    this.actions = actions;
    this.origin = origin;

    // message listener
    window.addEventListener('message', (event) => {
      this.messageHandle(event);
    }, false);
  }

  messageHandle(event) {

    // origin check
    let origin = event.origin || event.originalEvent.origin;
    if (this.origin && this.origin !== origin) {
      throw new Error('origin must be the same');
    }

    let message = event.data;
    if (typeof message === 'string') {
      try {
        message = JSON.parse(message);
      } catch (e) {
        throw new Error('message must be a plain string or JSON string');
      }
    }

    // deconstruct action from the message, and execute that
    const { action, data } = message;
    const func = this.actions[action];
    if (func && typeof func === 'function') {
      func(data);
    }
  }

  emit(data = {}) {
    data.origin = window.location.origin;
    this.targetWindow.postMessage(JSON.stringify(data), this.origin || '*');
  }
}