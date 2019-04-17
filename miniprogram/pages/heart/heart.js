const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfoList: [],
    flag: false,
    userInfoListData:"",
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOpenid() //当前用户openid
    this.getUserCount() //点赞数
    this.exitOpenId()
    this.getUserInfo()
  },
  getUserCount: function() {
    const db = wx.cloud.database()
    db.collection('userInfo').count().then(res => {
      this.setData({
        userInfoListData: res.total
      })
    })
  },
  addUserInfo: function() {
    const {
      flag
    } = this.data
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
          avatarUrl: app.globalData.avatarUrl,
          nickName: app.globalData.nickName
        }
      })
      .then(resp => {
        this.getUserInfo()
        this.getUserCount()
        this.exitOpenId()
        wx.showToast({
          title: '点赞成功~',
          icon: "none"
        })
      })
      .catch(resp => {
        wx.showToast({
          title: '点赞失败~',
          icon: "none"
        })
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
  getOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        if (res.result.openid) {
          this.exitOpenId(res.result.openid)
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  getUserInfo: function() {
    const db = wx.cloud.database({});
    const that = this;
    db.collection('userInfo').get()
      .then(resp => {
        that.setData({
          userInfoList: resp.data
        })
      })
      .catch(resp => {})
  }
})