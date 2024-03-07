import { Message } from 'element-ui'
export function cusMessage(msg, duration = 5000) {
  return Message({
    center: true,
    message: msg,
    duration: duration,
    customClass: 'message__dark',
    type: 'dark'
  });
}
/*函数防抖*/
export function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function() {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.call(context,args);
    }, gapTime);
  };
}

export function throttle(fn, interval) {  //节流
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300 ;//间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context,arguments[0]);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

export function getRealType(target) {
  return Object.prototype.toString
    .call(target)
    .match(/\s+(.*)\]$/)[1]
    .toLowerCase();
}

export function object2FormData(obj) {
  if (!obj || obj instanceof FormData || getRealType(obj) !== "object")
    return obj;
  const fd = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    fd.append(key, value);
  });
  return fd;
}
