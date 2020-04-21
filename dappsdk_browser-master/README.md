- [en](#starteos-dapp-sdk-hand-book)
- [中文](#starteos-dapp-sdk使用文档)

# STARTEOS DAPP SDK hand book

- [STARTEOS DAPP SDK hand book](#starteos-dapp-sdk-hand-book)
    - [installation](#installation)
    - [callback and Promises](#callback-and-promises)
    - [error handling](#error-handling)
        - [Error](#error)
        - [errors and codes](#errors-and-codes)
    - [API](#api)
        - [exec](#exec)
        - [_SYSTEM_](#_system_)
            - [get Native SDK information](#get-native-sdk-information)
            - [get current language setting](#get-current-language-setting)
            - [get current currency type](#get-current-currency-type)
        - [_GUI_](#_gui_)
            - [full screen switch](#full-screen-switch)
            - [change status bar](#change-status-bar)
            - [Toast](#toast)
            - [Progress](#progress)
            - [Alert](#alert)
            - [Dialog](#dialog)
            - [set to clipboard](#set-to-clipboard)
            - [scan QR code](#scan-qr-code)
        - [_CUSTOMER_](#_customer_)
            - [get current wallet type](#get-current-wallet-type)
            - [Fingerprint](#fingerprint)
        - [_EOS_](#_eos_)
            - [get current wallet account](#get-current-wallet-account)
            - [get current account's balance](#get-current-accounts-balance)
            - [get current account's information](#get-current-accounts-information)
            - [get accounts](#get-accounts)
            - [get balance](#get-balance)
            - [get account's information](#get-accounts-information)
            - [transfer](#transfer)
            - [get transaction record](#get-transaction-record)
        - [_ETH_](#_eth_)
            - [transaction](#transaction)
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

## installation
`npm install dappsdk`

ES-Module: 
```js
import dappSDK from 'dappsdk'

dappSDK.gui.showToast({message: 'Hello World!', delay: 1000})
```

Use SDK as normal `script` resource, use `node_modules/dappsdk/dist/index.js`:
```html
<script type="text/javascript" src="path-to-the-sdk"></script>
```
```js
window.dappSDK.gui.showToast({message: 'Hello World!', delay: 1000})
```
> Whatever the way you import the SDK is, the `window.dappSDK` exists.

---

## callback and Promises

> First of all, the SDK itself does not contain any Promise library, if you need it, ensure that the `window.Promise` exists.

All the API could receive a callback function as optional, if callback does not exist, call the API will renturn an instance of  `Promise`:

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

## error handling

When using the API with callback style, keep it in mind that the callback function **MUST** receive two parameters, first of which is an instance of `Error` , and the second is the result of the call, if err is truthy, the result may be `undefined`, so you should use `error-first-callback` to handle with the call:

```js
window.dappSDK.system.getSdkInfo({}, function(err, data) {
    if(err) {
        var code = error.code;
        console.log(code);
        // if error exists, `return` makes the rest of logic not be executed.
        return alert('Error: ' + err.message)
    }
    var version = data.version;
    alert(version)
})
```

### Error

No matter whiche style you use for callback, the `error` will contain 3 variables, `error.message`, `error.code`, `error.extra`.
`message` is the short information about the error,
`code` is the mapping of `message` in our definition,
`extra` is the extra information of the error, and it's more detailed than the `message`, in most case, `extra` is `undefined`.

### errors and codes

| code | error |
| --- | --- |
| -10001 | invalid namespace, mostly because the app and SDK's version not match |
| -10002 | invalid function, mostly because the app and SDK's version not match |
| -10003 | parameters error |
| -10004 | user canceled the operation |
| -10005 and less | other type of error, will be listed in the rest of the document |

---

## API

---

### exec

---

```js
function exec(namespace, fnName, params, [callback])
```

parameters:

name | type | remark
--- | --- | ---
namespace | String | The namespace of the function to be executed.
fnName | String | Function name.
params | Object | Parameters to be excuted with.
callback | Function| Optional parameter, if it exists, the function will be excuted when the native side responses.

e.g.:

```js
window.dappSDK.exec('system', 'getSdkInfo', {}, function(data) {
    alert(data.version) //version
})
```

---

### _SYSTEM_

namespace: `system`

---

#### get Native SDK information

**function:** `getSdkInfo`

**params:** `null`

**output:**

key | value | remark
--- | --- | ---
version | String | version of the native SDK

i.e.:
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

#### get current language setting

**function:** `getLanguageSetting`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| languageSetting | String | setting(Chinese,English) |

---

#### get current currency type

**function:** `getSymbol`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| symbol | String | currency type(USD,CNY) |

---

### _GUI_
namespace: `gui`

---

#### full screen switch

**function:** `changeFullScreen`

**params:**

| key | value | remark |
| --- | --- | --- |
| fullScreen | Boolean | true means set the current full screen state on |

**output:** `null`

---

#### change status bar

**function:** `changeStatusBar`

**params:**

| key | value | remark |
| --- | --- | --- |
| title | String | title |
| color | String | color(#FFFFFF) |
| theme | String | (dark,light) |
| canGoBack | Boolean | is able to go back(and display the go back button) |

**output:** `null`

---

#### Toast

**function:** `showToast`

**params:**

| key | value | remark |
| --- | --- | --- |
| message | String | content |
| delay | Integer | the time toast stays |

**output:** `null`

---

#### Progress

**function:** `showProgress`

**params:**

key | value | remark
--- | --- | ---
message | String | content
delay | Number | How long will the message display

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
| title | String | title |
| message | String | content |
| btnString | String | text inside the button |

**output:**

| key | value | remark |
| --- | --- | --- |
| clicked | Integer | when user press the button, this will be received by | | the callback |

---

#### Dialog

**function:** `showDialog`

**params:**

| key | value | remark |
| --- | --- | --- |
| title | String | title |
| message | String | content |
| leftBtnString | String | left btn text |
| rightBtnString | String | right btn text |

**output:**

| key | value | remark |
| --- | --- | --- |
| clicked | Integer | when user press the button, this value will be received by the callback, 0-left, 1-right. |

---

#### set to clipboard

**function:** `setClipboard`

**params:**

| key | value | remark |
| --- | --- | --- |
| data | String | content to be set |

**output:** `null`

---

#### scan QR code

**function:** `scanQRCode`

**params:** `null`

**output:**

|key | value | remark | 
|--- | --- | --- |
|result | String | result of a qr code |

---

### _CUSTOMER_
namespace: `customer`

---

#### get current wallet type

**function:** `getCurrentWalletType`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| walletType | String | wallet type(EOS,ETH) |

**error:**

| code | remark |
| --- | --- |
| -10005 | no wallet found |

---

#### Fingerprint

**function:** `checkFingerprintPayment`

**params:** `null`

**output:**

key | value | remark
--- | --- | ---
status | Number | status（-1: does not support due to the hardware， 0： disabled，1： enabled）

---

### _EOS_
namespace: `eos`

---

#### get current wallet account

**function:** `getCurrentWalletAccount`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| account | String | account |
| address | String | public key |

**error:**

| code | remark |
| --- | --- |
| -10005 | no wallet found |

---

#### get current account's balance

**function:** `getCurrentBalance`

**params:**

| key | value | remark |
| --- | --- | --- |
| tokenName | String | token name |
| contract | String | contract |

**output:**

| key | value | remark |
| --- | --- | --- |
| account | String | account |
| tokenName | String | token name |
| contract | String | contract |
| balance | Number | balance |

**error:**

| code | remark |
| --- | --- |
| -10005 | no wallet found |

---

#### get current account's information

**function:** `getCurrentAccountInfo`

**params:** `null`

**output:** `the information in the chain`

**error:**

| code | remark |
| --- | --- |
| -10005 | no wallet found |

---

#### get accounts

**function:** `getWalletAccounts`

**params:** `null`

**output:**

| key | value | remark |
| --- | --- | --- |
| accounts | Array | accounts |

**item:**

| key | value | remark |
| --- | --- | --- |
| account | String | account |
| address | String | public key |

**error:**

| code | remark |
| --- | --- |
| -10005 | no wallet found |

---

#### get balance

**function:** `getBalance`

**params:**

| key | value | remark |
| --- | --- | --- |
| account | String | account |
| contract | String | contract |

**output:**

| key | value | remark |
| --- | --- | --- |
| account | String | account |
| contract | String | contract |
| balance | Number | balance |
| symbol | String | symbol |

**error:**

| code | remark |
| --- | --- |
| -10006 | search fail(network error) |

**error:**

| code | remark |
| --- | --- |
| -10006 | network error |
| -10007 | transaction error |
| -10008 | target wallet not found |

---

#### get account's information

**function:** `getAccountInfo`

**params:**

| key | value | remark |
| --- | --- | --- |
| account | String | account |

**output:** `the information in the chain`

---

#### transfer

**function:** `transfer`

**params:**

| key | value | remark |
| --- | --- | ---
| from | String | the account transfer from |
| fromAddress | String | the pub key transfer from | 
| to | String | the account transfer to |
| amount | Number | amount |
| symbol | String | symbol |
| contract | String | contract |
| memo | String | memo |
| hint | String | hint for user |

**output:**

| key | value | remark | 
| --- | --- | --- | 
| transactionId | String | string that stands a transaction | 

---

#### get transaction record

**function:** `getTransactionRecord`

**params:**

| key | value | remark |
| --- | --- | --- |
| account | String | account |
| tokenName | String | token |
| contract | String | contract |
|  \ | \ | pagination undetermined |

**output:** `the information in the chain`

---

### _ETH_
namespace: `eth`

---

#### transaction
`undetermined`


# STARTEOS DAPP SDK使用文档 

- [STARTEOS DAPP SDK使用文档](#starteos-dapp-sdk使用文档)
    - [安装](#安装)
    - [回调与Promise](#回调与Promise)
    - [错误处理](#错误处理)
    - [API](#api)
        - [_SYSTEM_](#_system_)
            - [获取Native SDK信息](#获取native-sdk信息)
            - [获取当前语言设置](#获取当前语言设置)
            - [获取当前显示币种](#获取当前显示币种)
        - [_GUI_](#_gui_)
            - [全屏切换](#全屏切换)
            - [更改状态栏显示](#更改状态栏显示)
            - [Toast](#toast)
            - [Alert](#alert)
            - [Dialog](#dialog)
            - [复制到剪切板](#复制到剪切板)
            - [扫描二维码](#扫描二维码)
        - [_CUSTOMER_](#_customer_)
            - [获取当前钱包类型](#获取当前钱包类型)
        - [_EOS_](#_eos_)
            - [获取当前账户名](#获取当前账户)
            - [获取当前账户余额](#获取当前账户余额)
            - [获取当前账户信息](#获取当前账户信息)
            - [获取账户列表](#获取账户列表)
            - [获取余额](#获取余额)
            - [获取账户信息](#获取账户信息)
            - [转账](#转账)
            - [获取交易记录](#获取交易记录)
        - [_ETH_](#_eth_)
            - [转账](#转账-1)

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
