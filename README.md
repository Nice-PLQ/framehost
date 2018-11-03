# framehost - A lightweight cross domain communication library

#### Support data communication between iframe, browser new tab windows (Note: IE10+)

[中文文档](./zh-cn.md)

### Install
```
npm install framehost --save
```

### How to use?
```javascript
import Framehost from 'framehost';
```

#### 1.iframe code example
```javascript
// parent.js

const iframe = document.querySelector('iframe');

// Define actions
// When the message is received, the matching method is triggered. The parameter is the received data. Multiple methods can be defined in action objects.
const actions = {
  doParentAction: (data) => {
    console.log(data);
  }
}

// You can set up a secure domain name source, default to '*'.
const origin = 'http://www.children.com';

// Init framehost
const framehost = new FrameHost(actions, origin, iframe.contentWindow);

// Send a message to the iframe window, execute the 'doChildrenAction' method defined in iframe, and pass the data to it. The data can be object, number, string, boolean, array.
framehost.postMessage({
  // Action defined in children.js 
  action: 'doChildrenAction',

  // Send data
  data: {
    message: 'this is a message for children.js',
  }
});
```

```javascript
// children.js

const actions = {
  doChildrenAction: (data) => {
    console.log(data);
  }
}
const origin = 'http://www.parent.com';
const framehost = new FrameHost(actions, origin);

framehost.postMessage({
  action: 'doParentAction',
  data: 'send message to parent.js'
})
```

#### 2.browser tab windows code example
This is basically the same as the iframe sample code above, except that the third window parameter passed when the Framehost is initialized is different.
```javascript
// pageA

const actions = {
  pageA: (data) => {
    console.log(data);
  }
}
const origin = 'http://www.pageB.com';

const targetWin = window.open('http://www.pageB.com/index.html');
const framehost = new FrameHost(actions, origin, targetWin);

framehost.postMessage({
  action: 'pageB',
  data: 'send message to pageB'
})
```

```javascript
// pageB

const actions = {
  pageB: (data) => {
    console.log(data);
  }
}
const origin = 'http://www.pageA.com'
const framehost = new FrameHost(actions, origin);

framehost.postMessage({
  action: 'pageA',
  data: 'send message to pageA'
})
```

### API
#### new Framehost(actions: Object, [origin: string], [targetWin: window])
Initializing Framhost can receive three parameters:

##### actions
Type is an object and keys are functions. When a message is received, the key in the object is matched and the corresponding method of key is executed, such as:
```javascript
const actions = {
  doSomething1: (data) => {
    console.log(data);
  },
  doSomething2: (data) => {
    console.log(data);
  },
  doSomething3: (data) => {
    console.log(data);
  }
};
```

##### origin
Message source, when the `origin` parameter is provided, only messages from the domain name set by origin are processed. default to '*'.

##### targetWin
The target window for message sending, if the message is sent to the iframe window, the parameter value is `iframe.contentWindow`. If the message is sent to the browser tab window, the parameter value is the window reference returned after the `window.open()` method is executed.

#### postMessage({action: string, data: any}, callback: function)
#### postMessage([{action: string, data: any}, ...], callback: function)
The method of sending messages is an instance method of `Framehost`. This method receives an object or an array of objects and a callback function as parameters. The parameter object must contain `action` and `data` fields, `action` represents the method name that the target window needs to execute, and `data` represents the data transferred. The `callback` function will be called immediately after all messages are sent out, and `callback` is optional. Such as:
```javascript
const framehost = new Framehost(actions, origin, targetWin);
framehost.postMessage({
  action: 'doSomething1', // The name of the method to execute in the target window.
  data: 'I am a message data', // Support object/array/number/string/boolean data type.
}, () => {
  console.log('message sent');
});

// or
/*framehost.postMessage([
  {
    action: 'doSomething1',
    data: 'I am a message data',
  },
  {
    action: 'doSomething2',
    data: 'I am a another message data',
  },
], () => {
  console.log('all message sent');
});*/
```

#### destroy()
If it is determined that there is no need to continue sending messages, the `destroy` function can be released. Note: after calling the function, you cannot continue sending messages. Such as:
```javascript
framehost.postMessage({
  action: 'doSomething1',
  data: 'I am a message data',
}, () => {
  console.log('the message has been sent, and there is no need to send the message again.');
  framehost.destroy();
});
```

### Example
A working example can be found in the `example` directory，Please ensure that domain name mapping is set up locally.
```
127.0.0.1 example.a.com
127.0.0.1 example.b.com
```
run `npm run example`，And open [http://example.a.com:9000/iframe](http://example.a.com:9000/iframe) or [http://example.a.com:9000/window](http://example.a.com:9000/window) in browser.



