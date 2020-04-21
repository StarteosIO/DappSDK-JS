# STARTEOS DAPP SDK使用文档 

- [STARTEOS DAPP SDK使用文档](#starteos-dapp-sdk使用文档)
    - [安装](#安装)
    - [回调与Promise](#回调与promise)
    - [错误处理](#错误处理)
        - [错误](#错误)
        - [错误与状态码](#错误与状态码)
    - [API](#api)
        - [exec](#exec)
        - [_SYSTEM_](#_system_)
            - [获取Native SDK信息](#获取native-sdk信息)
            - [获取当前语言设置](#获取当前语言设置)
            - [获取当前显示币种](#获取当前显示币种)
        - [_GUI_](#_gui_)
            - [全屏切换](#全屏切换)
            - [更改状态栏显示](#更改状态栏显示)
            - [Toast](#toast)
            - [进度](#进度)
            - [Alert](#alert)
            - [Dialog](#dialog)
            - [复制到剪切板](#复制到剪切板)
            - [扫描二维码](#扫描二维码)
        - [_CUSTOMER_](#_customer_)
            - [获取当前钱包类型](#获取当前钱包类型)
            - [检查当前是否开启了指纹支付](#检查当前是否开启了指纹支付)
        - [_EOS_](#_eos_)
            - [获取当前账户](#获取当前账户)
            - [获取当前账户余额](#获取当前账户余额)
            - [获取当前账户信息](#获取当前账户信息)
            - [获取账户列表](#获取账户列表)
            - [获取余额](#获取余额)
            - [获取账户信息](#获取账户信息)
            - [转账](#转账)
            - [获取交易记录](#获取交易记录)
        - [_ETH_](#_eth_)
            - [转账](#转账)

---

## 安装
`npm install dappsdk`

ES-Module: 
```js
import dappSDK from 'dappsdk'

dappSDK.gui.showToast({message: 'Hello World!', delay: 1000})
```

作为普通资源加载, 使用 `node_modules/dappsdk/dist/index.js`:
```html
<script type="text/javascript" src="路径"></script>
```
```js
window.dappSDK.gui.showToast({message: 'Hello World!', delay: 1000})
```
> 不管你使用何种方式引入, `window.dappSDK`始终存在.

---

## 回调与Promise

> 首先, SDK本身并不附带promise, 如果你需要promise, 请确保window.Promise存在.

所有的API均有一个可选的回调函数参数, 如果这个参数不存在, 那调用这个API将返回一个 `Promise` 实例:

```js
window.dappSDK.system.getSdkInfo({})
    .then(({version}) => alert(version));

window.dappSDK.system.getSdkInfo({}, function(err, data) {
    if(err) {
        return alert('Error: ' + err.message)
    }
    var version = data.version;
    alert(version)
})
```

---

## 错误处理

在使用callback风格调用API的时候, 注意回调函数**永远**接收两个参数, 第一个为错误,
第二个为请求结果, 如果存在错误, 大部分情况请求结果会为空, 所以在代码中应使用 `错误优先回调` :

```js
window.dappSDK.system.getSdkInfo({}, function(err, data) {
    if(err) {
        var code = error.code;
        console.log(code);
        // 如果错误存在, 那么return可以保证之后的代码不执行
        return alert('Error: ' + err.message)
    }
    var version = data.version;
    alert(version)
})
```

### 错误

不管使用何种风格处理异步, `error` 都会包含3个变量, `error.message`, `error.code`, `error.extra`.
`message` 是对`error`的简单描述,
`code` 是 `message` 的映射,
`extra` 是 `message` 额外描述, 在大多数情况下, `extra` 为 `undefined`.

### 错误与状态码

| 状态码 | 错误 |
| --- | --- |
| -10001 | namespace错误, 可能是sdk与native端的版本不对应, 尝试升级app和sdk到最新版本 |
| -10002 | function错误, 可能是sdk与native端的版本不对应, 尝试升级app和sdk到最新版本 |
| -10003 | params错误 |
| -10004 | 用户取消了操作 |
| -10005以后 | 其他错误，根据api不同，文档中给于说明 |

---

## API

---

### exec

---

```js
function exec(namespace, fnName, params, [callback])
```

parameters:

名称 | 类型 | 备注
--- | --- | ---
namespace | String | 被调用函数的命名空间.
fnName | String | 函数名.
params | Object | 调用该函数时的参数.
callback | Function| 可选, 如果存在, 那当原生端响应时将调用此函数.

例:

```js
window.dappSDK.exec('system', 'getSdkInfo', {}, function(data) {
    alert(data.version) //version
})
```

---

### _SYSTEM_

namespace: `system`

---

#### 获取Native SDK信息

**function:** `getSdkInfo`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| version | String | 版本号 |

例:
```js
dappSDK.system.getSdkInfo({}, function(err, data) {
    if(err)
        return console.error(err);
    console.log(data)
}); 

dappSDK.system.getSdkInfo({})
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

---

#### 获取当前语言设置

**function:** `getLanguageSetting`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| languageSetting | String | 语言设置(Chinese,English) |

---

#### 获取当前显示币种

**function:** `getSymbol`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| symbol | String | 币种(USD,CNY) |

---

### _GUI_
namespace: `gui`

---

#### 全屏切换

**function:** `changeFullScreen`

**params:**

| key | value | remark |
| --- | --- | --- |
| fullScreen | Boolean | 是否全屏 |

**output:** `null`

---

#### 更改状态栏显示

**function:** `changeStatusBar`

**params:**

| key | value | remark |
| --- | --- | --- |
| title | String | 标题 |
| color | String | 十六进制颜色(#FFFFFF) |
| theme | String | 使用暗色或者白色的图标以及文字(dark,light) |
| canGoBack | Boolean | 是否能够返回上一级（并且显示返回按钮） |

**output:** `null`

---

#### Toast

**function:** `showToast`

**params:**

| key | value | remark |
| --- | --- | --- |
| message | String | 内容 |
| delay | Integer | 显示时长 |

**output:** `null`

---

#### 进度

**function:** `showProgress`

**params:**

key | value | remark
--- | --- | ---
message | String | 内容
delay | Number | 最大显示时长（毫秒），默认最大3000ms

**output:** `null`

---

**function:** `hideProgress`

**params:** `null`

**output:** `null`

---

#### Alert

**function:** `showAlert`

**params:**

| key | value | remark |
| --- | --- | --- |
| title | String | 标题 |
| message | String | 内容 |
| btnString | String | 按钮文字 |

**output:**

| key | value | remark |
| --- | --- | --- |
| clicked | Integer | 接收到回调时，代表用户按下了按钮 |

---

#### Dialog

**function:** `showDialog`

**params:**

| key | value | remark |
| --- | --- | --- |
| title | String | 标题 |
| message | String | 内容 |
| leftBtnString | String | 左边按钮文字 |
| rightBtnString | String | 右边按钮文字 |

**output:**

| key | value | remark |
| --- | --- | --- |
| clicked | Integer | 接收到回调时，代表用户按下了按钮，0代表左边，1代表右边 |

---

#### 复制到剪切板

**function:** `setClipboard`

**params:**

| key | value | remark |
| --- | --- | --- |
| data | String | 复制的内容 |

**output:** `null`

---

#### 扫描二维码

**function:** `scanQRCode`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| result | String | 扫描到的内容 |

---

### _CUSTOMER_
namespace: `customer`

---

#### 获取当前钱包类型

**function:** `getCurrentWalletType`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| walletType | String | 钱包类型(EOS,ETH) |

**error:**

| code | remark |
| --- | --- |
| -10005 | 当前没有钱包 |

---

#### 检查当前是否开启了指纹支付

**function:** `checkFingerprintPayment`

**params:** `null`

**output:**

key | value | remark
--- | --- | ---
status | Number | 状态（-1：硬件不支持，0：未开启，1：已开启）

---

### _EOS_
namespace: `eos`

---

#### 获取当前账户

**function:** `getCurrentWalletAccount`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| account | String | 账户名 |
| address | String | 公钥 |

**error:**

| code | remark |
| --- | --- |
| -10005 | 当前没有钱包 |

---

#### 获取当前账户余额

**function:** `getCurrentBalance`

**params:**

| key | value | remark |
| --- | --- | --- |
| tokenName | String | 代币名称 |
| contract | String | 合约地址 |

**output:**

| key | value | remark |
| --- | --- | --- |
| account | String | 账户名 |
| tokenName | String | 代币名称 |
| contract | String | 合约地址 |
| balance | Number | 余额 |

**error:**

| code | remark |
| --- | --- |
| -10005 | 当前没有钱包 |

---

#### 获取当前账户信息

**function:** `getCurrentAccountInfo`

**params:** `null`

**output:** `链上返回的原始数据`

**error:**

| code | remark |
| --- | --- |
| -10005 | 当前没有钱包 |

---

#### 获取账户列表

**function:** `getWalletAccounts`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| accounts | Array | 账户名列表 |

**item:**

| key | value | remark |
| --- | --- | --- |
| account | String | 账户名 |
| address | String | 公钥 |

**error:**

| code | remark |
| --- | --- |
| -10005 | 当前没有钱包 |

---

#### 获取余额

**function:** `getBalance`

**params:**

| key | value | remark |
| --- | --- | --- |
| account | String | 账户名 |
| contract | String | 合约地址 |

**output:**

| key | value | remark |
| --- | --- | --- |
| account | String | 账户名 |
| contract | String | 合约地址 |
| balance | Number | 余额 |
| symbol | String | 单位 |

**error:**

| code | remark |
| --- | --- |
| -10006 | 查询失败（网络错误） |

---

#### 获取账户信息

**function:** `getAccountInfo`

**params:**

| key | value | remark |
| --- | --- | --- |
| account | String | 账户名 |

**output:** `链上返回的原始数据`

---

#### 转账

**function:** `transfer`

**params:**

| key | value | remark |
| --- | --- | --- |
| from | String | 转出账户名 |
| fromAddress | String | 转出账户公钥 |
| to | String | 转账接受账户名 |
| amount | Number | 金额 |
| symbol | String | 代币单位 |
| contract | String | 合约地址 |
| memo | String | 备注 |
| hint | String | 提示，仅用于展示给用户 |

**output:**

| key | value | remark |
| --- | --- | --- |
| transactionId | String | 交易ID |

**error:**

| code | remark |
| --- | --- |
| -10006 | 网络错误 |
| -10007 | 交易失败 |
| -10008 | 没有找到转出的钱包 |

---

#### 获取交易记录

**function:** `getTransactionRecord`

**params:**

| key | value | remark |
| --- | --- | --- |
| account | String | 账户名 |
| tokenName | String | 代币名称 |
| contract | String | 合约地址 |
|  \ | \ | 翻页方式待定 |

**output:** `链上返回的原始数据`

---

### _ETH_
namespace: `eth`

---

#### 转账
`待定`
