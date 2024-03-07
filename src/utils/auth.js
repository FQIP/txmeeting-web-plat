import Cookies from "js-cookie";

const TokenKey = "txmeeting_web";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function setSessionStorage(token) {
  return sessionStorage.setItem(TokenKey, token);
}
export function getSessionStorage(token) {
  return sessionStorage.getItem(TokenKey);
}
export function getSessionStorageInfo(name) {
  return sessionStorage.getItem(name);
}
