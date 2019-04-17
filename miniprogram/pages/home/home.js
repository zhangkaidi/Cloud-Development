const app = getApp()
let util = require('../../utils.js')
Page({
  data: {},
  getUserInfo: function() {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              app.globalData.nickName = res.userInfo.nickName
              wx.switchTab({
                url: '/pages/my/my',
              })
            },
            fail(res){
              console.log(res)
            }
          })
        }
      }
    })
  }
})