const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trim(str) {
  str = str.replace(/^(\s|\u00A0)+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }   
  return str
}

function getscreensize() {
  var windowWidth = 0;
  var windowHeight = 0;
  wx.getSystemInfo({
    success: function (res) {
      windowWidth = res.windowWidth;
      windowHeight = res.windowHeight;
      //console.log('windowWidth: ' + windowWidth)
      //console.log('windowHeight: ' + windowHeight)
    }
  })
  var screensize = {
    screenwidth: windowWidth,
    screenheight: windowHeight
  };
  return screensize;
}

module.exports = {
  formatTime: formatTime, 
  trim: trim,
  getscreensize: getscreensize
}
