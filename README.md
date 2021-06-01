- [Documentation (English)](README_en.md)
- [使用说明(中文)](README_zh.md)

## 安装起步

`npm install dappsdk`

ES-Module:

```js
import dappSDK from "st-dapp-sdk-js";

dappSDK.gui.showToast({ message: "Hello World!", delay: 1000 });
```

作为普通资源加载, 使用 `node_modules/dappsdk/dist/index.js`:

```html
<script type="text/javascript" src="路径"></script>
```

```js
window.dappSDK.gui.showToast({ message: "Hello World!", delay: 1000 });
```

> 不管你使用何种方式引入, `window.dappSDK`始终存在.

---

## 回调与 Promise

> 首先, SDK 本身并不附带 promise, 如果你需要 promise, 请确保 window.Promise 存在.

所有的 API 均有一个可选的回调函数参数, 如果这个参数不存在, 那调用这个 API 将返回一个 `Promise` 实例:

```js
window.dappSDK.system.getSdkInfo({}).then(({ version }) => alert(version));

window.dappSDK.system.getSdkInfo({}, function (err, data) {
  if (err) {
    return alert("Error: " + err.message);
  }
  var version = data.version;
  alert(version);
});
```

---

## 错误处理

在使用 callback 风格调用 API 的时候, 注意回调函数**永远**接收两个参数, 第一个为错误,
第二个为请求结果, 如果存在错误, 大部分情况请求结果会为空, 所以在代码中应使用 `错误优先回调` :

```js
window.dappSDK.system.getSdkInfo({}, function (err, data) {
  if (err) {
    var code = error.code;
    console.log(code);
    // 如果错误存在, 那么return可以保证之后的代码不执行
    return alert("Error: " + err.message);
  }
  var version = data.version;
  alert(version);
});
```

### 错误

不管使用何种风格处理异步, `error` 都会包含 3 个变量, `error.message`, `error.code`, `error.extra`.
`message` 是对`error`的简单描述,
`code` 是 `message` 的映射,
`extra` 是 `message` 额外描述, 在大多数情况下, `extra` 为 `undefined`.

### 错误与状态码

| 状态码      | 错误                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| -10001      | namespace 错误, 可能是 sdk 与 native 端的版本不对应, 尝试升级 app 和 sdk 到最新版本 |
| -10002      | function 错误, 可能是 sdk 与 native 端的版本不对应, 尝试升级 app 和 sdk 到最新版本  |
| -10003      | params 错误                                                                         |
| -10004      | 用户取消了操作                                                                      |
| -10005 以后 | 其他错误，根据 api 不同，文档中给于说明                                             |

---

## API

- [Documentation (English)](README_en.md)
- [使用说明(中文)](README_zh.md)
