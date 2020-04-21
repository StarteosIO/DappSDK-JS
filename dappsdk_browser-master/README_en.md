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
