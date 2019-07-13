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
  onLoad:function(){
    this.getUserInfoMessage()
    this.getUserCount() //点赞数
  },
  onShow: function() {
    const {
      openid
    } = app.globalData;
    this.exitOpenId(openid)
    this.setData({
      aniNum: utils.random(0, this.data.userInfoListData - 1)
    })
  },
  onHide: function() {
    this.setData({
      aniNum: null
    })
  },
  onPullDownRefresh:function(){
    this.getUserInfoMessage()
    this.getUserCount() //点赞数
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
  },
  getUserCount: function() {
    const db = wx.cloud.database()
    db.collection('userInfo').count().then(res => {
      this.setData({
        userInfoListData: res.total,
      })
    })
  },
  addUserInfo: function() {
    const {
      flag
    } = this.data
    let that = this;
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
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    wx.cloud.callFunction({
      name: 'usercount',
    }).then(res => {
      wx.hideLoading()
      that.setData({
        userInfoList: res.result.data
      })
    }).catch(res => {
      console.log('res---->' + res)
      wx.hideLoading()
    })
  }
})