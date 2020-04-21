import uuid from 'uuid/v4';

// 首先判断设备, 因为ios, android的通信方法和接口稍有不同
function getDeviceType(){
  const ua = navigator.userAgent;
  if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua)) {
    return false // ios false
  } else if (/[Aa]ndroid/.test(ua)) {
    return true // android true
  } else {
    // 可能原因: 
    // 1. 环境为普通浏览器或者node
    // 2. 钱包版本过低
    console.error(`Error: Unknown environment,please open it in wallet's browser, 
    未知环境, 请在钱包浏览器下打开.`)
  }
}

const isAndroid = getDeviceType();

// sdk为最终暴露接口, __DAPPCALLBACKS为回调函数映射, 键为函数名, 值是函数体
const sdk = {
  __DAPPCALLBACKS: {}
};

// sdk结构, 分为两层, 外层对应文档内的命名空间(namespace), 内层对应命名空间内的方法,
// 遍历此结构, 并调用下面定义的函数生成函数(funcGen)可生成整个api
const tree = {
  system: ['getSdkInfo', 'getLanguageSetting', 'getSymbol'],
  gui: ['changeFullScreen', 'changeStatusBar', 'showToast', 'showAlert', 'showDialog', 'setClipboard', 'scanQRCode', 'showProgress', 'hideProgress','share'],
  customer: ['getCurrentWalletType', 'checkFingerprintPayment'],
  eos: ['getCurrentWalletAccount', 'getCurrentBalance', 'getCurrentAccountInfo', 'getWalletAccounts', 'getBalance', 'getAccountInfo', 'transfer', 'getTransactionRecord'],
  bos: ['getCurrentWalletAccount', 'getCurrentBalance', 'getCurrentAccountInfo', 'getWalletAccounts', 'getBalance', 'getAccountInfo', 'transfer', 'getTransactionRecord'],
  eth: []
};

// 最主要的运行方法
/**
 * @param namespace: String, 命名空间, 参照sdk文档
 * @param func: String, 方法名, 参考sdk文档,
 * @param params: Object, 调用的参数
 * @param callback: Function, 回调函数, 可选参数, 会在调用完成(无论成功失败)后调用
 * @description 调用此函数实际结果为: 以params为参数调用指定namespace下的func方法, 如提供callback, 则native端返回结果后用对应结果作为参数调用callback
 */
sdk.exec = function(namespace, func, params, callback) {
  const fnName = uuid(); // 回调函数名称, uuid保证唯一, 因为过程为异步, 且用户可能发起多个异步操作
  const parameters = {
    params,
    namespace,
    function: func,
    callback: `window.dappSDK.__DAPPCALLBACKS["${fnName}"]`
  };// 组装参数
  let promise, _resolve, _reject;
  if(!callback) { // 按照设计, 如果不提供callback应该返回一个Promise实例
    if(!window.Promise) // sdk不内置Promise库, 如果不存在, 抛出异常
      throw('Error: Cannot find Promise constructor in window scope. You can import a Promise library or use callback style.')
    promise = new Promise(function(resolve, reject) {
      // 生成器函数第一次运行后, 将拿到的resolve, reject保存, 供回调函数使用
      _resolve = resolve;
      _reject = reject;
    })
  }
  sdk.__DAPPCALLBACKS[fnName] = function(res) { // 生成回调函数, 因为native端实际就是调用window下的一些函数来实现消息通信
    let {code, message, data} = JSON.parse(res);
    let e = null;
    code = parseInt(code); // 错误码见文档, 10000为成功
    if(code !== 10000) {
      e = new Error(message);
      e.code = code;
      e.extra = data;
    }
    if(callback) { // 回调存在用结果作为参数调用callback, 错误优先
      callback(e, data)
    } else if(e) {
      _reject(e) // promise错误
    } else {
      _resolve(data) // 正常
    }
    delete sdk.__DAPPCALLBACKS[fnName]; // 删除注册回调函数, 供gc清理 
  };
  const ps = JSON.stringify(parameters);
  if(isAndroid) { // 安卓调用原生通信方法
    if(!window.dappApi)
      throw('Error: Cannot find dappApi in window scope. Please update the app to the newest version.')
    window.dappApi.request(ps);
  } else { // ios
    if(!window.webkit || !window.webkit.messageHandlers.dappApi)
      throw('Error: Cannot find dappApi in window scope. Please update the app to the newest version.')
    window.webkit.messageHandlers.dappApi.postMessage(ps);
  }
  if(!callback)
    return promise
};

function funcGen(namespace, fnName) {
  return function(params, callback) {
    return sdk.exec(namespace, fnName, params, callback)
  }
}

Object.keys(tree).forEach(ns => {
  const interfaceNames = tree[ns];
  sdk[ns] = {};
  const targetNamespace = sdk[ns];
  interfaceNames.forEach(name => {
    targetNamespace[name] = funcGen(ns, name)
  })
});

export default sdk;