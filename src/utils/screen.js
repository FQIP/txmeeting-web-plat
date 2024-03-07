//@ sourceURL=screen.js
/*
* 请求大屏
*/
export function requestFullScreen (el) {
  var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
  if (!isFullscreen) {//进入全屏,多重短路表达式
    (el.requestFullscreen && el.requestFullscreen()) ||
    (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
    (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());
  }
  if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}
/*
* 退出大屏
*/
export function exitFull () {
  // 判断各种浏览器，找到正确的方法
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  if (typeof cfs != "undefined" && cfs) {
    cfs.call(el);
  } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer 10
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

export function addFullScreenChangeEventListener(screenChangeEvent) {
  //监听大屏(兼容主流浏览器)
  document.addEventListener('fullscreenchange', function (ev) {
    screenChangeEvent()
  })
  document.addEventListener('webkitfullscreenchange', function (ev) {
    screenChangeEvent()
  })
  document.addEventListener('mozfullscreenchange', function (ev) {
    screenChangeEvent()
  })
  document.addEventListener('MSFullscreenChange', function (ev) {
    screenChangeEvent()
  })
}

export function isFullScreen() {
  return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
}

