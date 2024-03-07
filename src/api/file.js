require('./index.js');
import $axios from 'axios'
const $apis = '';
const $mainApis = process.env.VUE_APP_BASE_API;

export function _getFileBaseApis() {
  return $mainApis
}
_getFileBaseApis();

function getFileBaseApis() {
  if ($apis && $apis != '') {
    return [];
  }
  return [_getFileBaseApis]
}


export function fileRequest(method, url, params) {
  return Promise.all([getFileBaseApis]).then(()=>{
    return $axios({
      method: method,
      url: $mainApis + url,
      data: params,
    })
  })
}

/**
 *
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteFileRequest(id) {
  return fileRequest('post', '/vcfFileManager/delFile', { id});
}

export function getUploadUrl(meetingId, catgId) {
  return $mainApis + '/vcfFileManager/upload?meetingId='+meetingId+'&catgId='+catgId;
}


export function getFile(fileUid) {
  return $mainApis + '/vcfFileManager/queryImg?fileId=' + fileUid;
}

export function getDownLoadFileUrl(ids) {
  let params = ids.map((id) => 'ids='+id);
  return $mainApis + '/vcfFileManager/downloadAllFiles?'+params.join('&');
}

export function getPrintFileUrl(id) {
  return $mainApis + '/document/print?id=' + id;
}

export function printFile(id) {
  return $axios({
    method: 'get',
    url: $mainApis + '/document/print?id=' + id,
    responseType: 'blob'
  }).then((res) => {
    return res.data;
  })
}
