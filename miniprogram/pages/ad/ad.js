// miniprogram/pages/ad/ad.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exitInfo: false,
    next: false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOpenid()
  },
  initInfo: function() {
    this.getOpenid(callback)
  },
  userInfo: function() {
    var _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              app.globalData.nickName = res.userInfo.nickName
              _this.addUserInfo(res.userInfo)
              wx.switchTab({
                url: '/pages/home/home'
              })
            }
          })
        } else {
          console.log('未授权')
        }
      }
    })
  },
  addUserInfo: function(userInfo) {
    const db = wx.cloud.database({});
    db.collection('user').add({
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
      })
      .then(resp => {
        console.log('resp--->' + resp)
      })
  },
  searchUserInfo: function() {
    const db = wx.cloud.database({});
    db.collection('user').add({
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
      })
      .then(resp => {
        console.log('resp--->' + resp)
      })
  },
  diffOpenid: function(openid) {
    var _this = this;
    const db = wx.cloud.database({});
    db.collection('user').where({
        _openid: openid
      })
      .get()
      .then(resp => {
        if (resp.data.length > 0) {
          app.globalData.avatarUrl = resp.data[0].avatarUrl;
          app.globalData.nickName = resp.data[0].nickName;
          _this.setData({
            exitInfo: false,
            next: true
          })
          setTimeout(() => {
            console.log(2)
            wx.switchTab({
              url: '/pages/home/home'
            })
          }, 3000)
        } else {
          _this.setData({
            exitInfo: true,
            next: false
          })
        }
      })
  },
  getOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.diffOpenid(res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        wx.showToast({
          title: '服务器异常~',
          icon: "none"
        })
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  next: function() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})