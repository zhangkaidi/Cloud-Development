var formatDateTime = (date) => {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

function getFileList(name, that) {
  wx.cloud.callFunction({
    name: name,
  }).then(res => {
    that.setData({
      fileList: res.result.tempFileURL
    })
  }).catch(res => {
    console.log('res---->' + res)
  })
}

function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

function getDbCount(dbname, callback) {
  const db = wx.cloud.database()
  db.collection(dbname).count().then(res => {
    callback && callback(res.count)
  })
}
module.exports = {
  formatDateTime,
  getFileList,
  random,
  getDbCount
}