# framehost - 轻量的跨域通信库

#### 支持iframe，浏览器新tab窗口之间的数据通信（注意：支持IE10+）

### 安装
```
npm install framehost --save
```

### 如何使用？
```javascript
import Framehost from 'framehost';
```
#### 1、iframe通信示例
```javascript
// parent.js

const iframe = document.querySelector('iframe');

// 定义action，当接收到message消息时会触发匹配到的方法，参数是接收到的数据。action对象里可定义多个方法
const actions = {
  doParentAction: (data) => {
    console.log(data);
  }
}

// 设置安全域名，可选，默认为'*'
const origin = 'http://www.children.com';

// 初始化framehost
const framehost = new FrameHost(actions, origin, iframe.contentWindow);

// 发送消息给iframe窗口，执行iframe里定义的doChildrenAction方法，并将data数据传过去，data数据可以是object、number、string、boolean、array
framehost.postMessage({
  action: 'doChildrenAction',
  data: {
    message: 'this is a message for children.js',
  }
});
```

```javascript
// children.js

const actions = {
  doChildrenAction: (data) => {
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

#### 2、浏览器tab窗口通信示例
与上面iframe示例代码基本相同，唯一不同的是在初始化Framehost时传的第三个window参数不同
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
const origin = 'http://www.pageA.com';
const framehost = new FrameHost(actions, origin);

framehost.postMessage({
  action: 'pageA',
  data: 'send message to pageA'
});
```

### API
#### new Framehost(actions: Object, [origin: String], [targetWin: Window])
初始化Framhost，可接收三个参数：

##### actions 必选
类型是一个对象，key均为函数，当收到message消息时，会匹配对象中的key，并执行key对应的方法，如：
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

##### origin 可选
消息来源，当提供了`origin`参数时，只处理origin设置的域名发来的消息，默认origin的值为'*'

##### targetWin 可选
消息发送的目标窗口，如果消息是往iframe窗口发送，则该参数值为`iframe.contentWindow`。如果消息往浏览器tab窗口发送，则该参数值为执行`window.open()`方法后返回的窗口引用。

#### postMessage({action: string, data: any}, callback: function)
#### postMessage([{action: string, data: any}, ...], callback: function)
发送消息的方法，是`Framehost`的实例方法，该方法接收一个对象或者对象数组，和一个回调函数作为参数，参数对象必须包含`action`和`data`字段，`action`表示目标窗口需要执行的方法名，`data`表示传递的数据。`callback`函数会在所有消息发送出去之后立即调用，`callback`是可选的。如：
```javascript
const framehost = new Framehost(actions, origin, targetWin);
framehost.postMessage({
  action: 'doSomething1', // 目标窗口需要执行的方法名
  data: 'I am a message data', // 支持object、array、number、string、boolean
}, () => {
  console.log('消息已发送');
});

// 或者
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
  console.log('所有消息已发送');
});*/
```

#### destroy()
如果确定不再需要继续发送消息时，可执行destroy函数进行释放。注意：调用该了函数后，就不能在继续发送消息了。如：
```javascript
framehost.postMessage({
  action: 'doSomething1',
  data: 'I am a message data',
}, () => {
  console.log('消息已发送，后续不需要再发送消息了');
  framehost.destroy();
});
```

### Example
可运行的示例在example目录，请确保本地设置了域名映射
```
127.0.0.1 example.a.com
127.0.0.1 example.b.com
```
然后执行`npm run example`，并在浏览器打开[http://example.a.com:9000/iframe](http://example.a.com:9000/iframe)或者[http://example.a.com:9000/window](http://example.a.com:9000/window)
