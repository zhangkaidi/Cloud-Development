//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },
  globalData: {
    avatarUrl: "",
    nickName: "",
    openid: "",
    appid: "wxf71fb1cee7a18c9e",
    key: "MMYBZ-SYILR-XZXWY-W7DLK-HSALZ-V3FF4",
    publishSuccess: false
  }
})