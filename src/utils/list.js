import { Message } from 'element-ui'
import $axios from 'axios'
const $apis = process.env.VUE_APP_BASE_API
/**
 * 根据键值list获取data里面的数据
 * @param data
 * @param keys
 * @returns Object
 */
export function getObjectByKeyList(data, keys) {
  if (!keys || keys.length == 0) {
    return {};
  }

  let params = Object(null);
  keys.forEach(function(key){
    if (data[key] !== undefined || data[key] !== null) {
      params[key] = data[key];
    }
  })
  return params;
}
/**
 * 获取URLSearchParams
 * @param data
 * @returns {URLSearchParams}
 */
export function getQueryParams(data) {
  if(data instanceof URLSearchParams) {
    return data;
  }
  var params = new URLSearchParams();

  if (typeof data === 'object' && !(data === null || data === undefined)) {
    Object.keys(data).map(function(key){
      params.append(key, data[key]);
    })
  }else {
    console.error('getQueryParams: data should be object');
  }

  return params;
}

/**
 *
 * @param method {post|get}
 * @param url
 * @param params {Object|URLSearchParams}
 * @param successCallBack
 * @param failCallBack
 * @param errorCallBack
 */
export function load(method, url, params, {success:successCallBack, fail:failCallBack, error:errorCallBack}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('load:', method, url, params);
  }

  params = getQueryParams(params);
  return $axios({
    method: method,
    url: $apis + url,
    data: params,
  })
  .then((res) => {
    if (res?.data?.result == 0) {
      successCallBack && successCallBack(res.data);
    } else {
      failCallBack && failCallBack(res.data);
    }
    return res.data;
  })
  .catch((e) => {
    errorCallBack && errorCallBack(e);
  });
}

export function duplicateById(data, idKey='id') {
  let s = new Set();
  let list = [];
  data.forEach((item) => {
    let priData = item[idKey] + '';
    if (!s.has(priData)) {
      list.push(item);
      s.add(priData)
    }
  })

  return list
}

/**
 *
 * @param newData
 * @param oldData
 * @param privId
 * @returns {*}
 */
export function mergeTableData(newData, oldData, privId="id") {
  if (!newData || newData.length<1) {
    return oldData;
  }

  function has(data, item) {
    let is_has = false;
    data.map((_item, index)=> {
      (item[privId] == _item[privId] ) && (is_has = index);
    })

    return is_has;
  }

  newData.forEach((item)=>{
    let index = has(oldData, item);
    if (index === false) {
      oldData.push(item);
    } else {
      oldData[index] = item;
    }
  })

  return oldData;
}

//改方法不会修改 oldData 的值
export function mergeShallowTableData(newData, oldData, privId="id") {
  let temp = [];
  temp.push(...oldData);
  return mergeTableData(newData,temp,privId);
}

export function request(method, url, params, {success:successCallBack, fail:failCallBack, error:errorCallBack}) {
  console.log(process.env)
  if (process.env.NODE_ENV === 'development') {
    console.log('load:', method, url, params);
  }
  return $axios({
    method: method,
    url: $apis + url,
    data: params,
  })
    .then((res) => {
      if (res.data.result == 0) {
        successCallBack && successCallBack(res.data);
      } else {
        failCallBack && failCallBack(res.data);
      }
      return res.data;
    })
    .catch((e) => {
      errorCallBack && errorCallBack(e);
    });
}

export function listSuccessMsg(msg) {
  return Message({
    type: "success",
    message: msg,
  });
}

export function listErrorMsg(msg) {
  return Message({
    message: msg,
    type: "warning",
  });
}

export function aPathTo(url) {
  const elink = document.createElement('a')
  elink.target = '_blank';
  elink.style.display = 'none'
  elink.href = url
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href) // 释放URL 对象
  document.body.removeChild(elink)
}

export function aDownload(url, fileName) {
  const elink = document.createElement('a')
  elink.download = fileName
  elink.style.display = 'none'
  elink.href = url
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href) // 释放URL 对象
  document.body.removeChild(elink)
}

export function blobDownload(blobContent, fileName) {
  const blob = new Blob([blobContent])
  // 非IE下载
  if ('download' in document.createElement('a')) {
    let url = URL.createObjectURL(blob);
    console.log(url);
    aDownload(url, fileName)
  }else {// IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}

export function print(url) {
  var date = (new Date()).getTime()
  var ifr = document.createElement('iframe')
  ifr.style.frameborder = 'no'
  ifr.style.display = 'none'
  ifr.style.pageBreakBefore = 'always'
  ifr.setAttribute('id', 'printPdf' + date)
  ifr.setAttribute('name', 'printPdf' + date)
  ifr.src = url
  document.body.appendChild(ifr)
  _doPrint('printPdf' + date)
  window.URL.revokeObjectURL(ifr.src) // 释放URL 对象
}

export function blobPrint(blobContent,type) {
  let typeName= 'application/pdf' ;
  if(type === 'jpg' ||type === 'png' ||type === 'jpeg'||type === 'gif'){
	  typeName= 'image/'+type ;
  }
 // const blob = new Blob([blobContent])
  const blob = new Blob([blobContent],{ type: typeName})
  let url = URL.createObjectURL(blob);
  print(url);
}

export function _doPrint(id) {
  var ordonnance = document.getElementById(id).contentWindow
  setTimeout(() => {
    // window.print()
    ordonnance.print()

  }, 100)
}
