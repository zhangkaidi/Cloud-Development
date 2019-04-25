const app = getApp()
const utils = require('../../utils/utils.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfoList: [],
    flag: false,
    userInfoListData: "",
    openid: "",
    defaultImage: "../../images/user-unlogin.png",
    navgationText: "点赞",
    aniNum: null
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const {
      openid
    } = app.globalData;
    this.getUserCount() //点赞数
    this.exitOpenId(openid)
    this.getUserInfoMessage()
  },
  onHide: function() {
    this.setData({
      aniNum: null
    })
  },
  getUserCount: function() {
    const db = wx.cloud.database()
    db.collection('userInfo').count().then(res => {
      this.setData({
        userInfoListData: res.total,
        aniNum: utils.random(0, res.total - 1)
      })
    })
  },
  addUserInfo: function() {
    const {
      flag
    } = this.data
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              wx.setStorageSync('avatarUrl',
                res.userInfo.avatarUrl,
              )
              wx.setStorageSync('nickName',
                res.userInfo.nickName
              )
              if (flag) {
                wx.showToast({
                  title: '已经点过赞啦~',
                  icon: "none"
                })
                return
              }
              const db = wx.cloud.database({});
              db.collection('userInfo').add({
                  data: {
                    avatarUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName
                  }
                })
                .then(resp => {
                  that.getUserInfoMessage()
                  that.getUserCount()
                  that.exitOpenId()
                  wx.showToast({
                    title: '点赞成功~',
                    icon: "none"
                  })
                })
                .catch(resp => {
                  console.log('resp' + resp)
                  wx.showToast({
                    title: '点赞失败~',
                    icon: "none"
                  })
                })
            },
            fail(res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  exitOpenId: function(openid) {
    console.log('exitOpenId--->' + openid)
    const db = wx.cloud.database({});
    const aa = db.collection('userInfo').where({
        _openid: openid
      })
      .count()
      .then(resp => {
        console.log('res.total' + resp.total)
        if (resp.total == 0) {
          this.setData({
            flag: false
          })
        } else {
          this.setData({
            flag: true
          })
        }
      })
      .catch(resp => {})
  },

  getUserInfoMessage: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'usercount',
    }).then(res => {
      that.setData({
        userInfoList: res.result.data
      })
    }).catch(res => {
      console.log('res---->' + res)
    })
  }
})