// miniprogram/pages/message/message.js
const app = getApp()
const utils = require('../../utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getMessage: [],
    getMessageCount: 0,
    openid: "",
    navgationText: "消息列表",
    top: false//置顶权限
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      openid: app.globalData.openid
    })
    this.getMessage()
    this.isWhiteList()
  },

  deleteMessage: function() {
    const {
      id
    } = e.currentTarget.dataset;
  },
  getMessage: function() {
    console.log('getMessage--->' + app.globalData.openid)
    const {
      openid
    } = app.globalData;
    const db = wx.cloud.database()
    db.collection('message').where({
        _openid: openid
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].createTime = utils.formatDateTime(res.data[i].createTime)
          if (res.data[i].isTop) {
            var str = res.data.splice(i, 1);
            res.data.unshift(str[0]);
          }
        }
        this.setData({
          getMessage: res.data,
          getMessageCount: res.data.length
        })
      })
  },
  topMessage: function(e) {
    const {
      id,
      istop
    } = e.currentTarget.dataset
    let that = this;
    console.log('id--->' + id)
    console.log('isTop--->' + istop)
    wx.showModal({
      title: '提示',
      content: istop ? '取消置顶吗？' : '需要置顶吗？',
      success(res) {
        if (res.confirm) {
          const db = wx.cloud.database()
          console.log('confirm_id' + id)
          db.collection('message').doc(id).update({
              data: {
                isTop: !istop
              }
            })
            .then(res => {
              wx.showToast({
                title: istop ? '取消成功' : '置顶成功',
              })
              that.getMessage()
            })
            .catch(err => {
              wx.showToast({
                icon: 'none',
                title: istop ? '取消失败' : '置顶失败',
              })
              console.error('[数据库] 失败：', err)
            })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  },
  deleteMessage: function(e) {
    const {
      id
    } = e.currentTarget.dataset
    let that = this;
    console.log('id--->' + id)
    wx.showModal({
      title: '提示',
      content: '确定要删除这条消息吗？',
      success(res) {
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('message').doc(id).remove()
            .then(res => {
              wx.showToast({
                title: '删除成功',
              })
              that.getMessage()
            })
            .catch(res => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
              console.error('[数据库] [删除记录] 失败：', res)
            })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  },
  isWhiteList: function() {
    const db = wx.cloud.database()
    const _ = db.command
    console.log('app.globalData.openid-->' + app.globalData.openid)
    db.collection('whiteList').where({
        openid: _.in([app.globalData.openid])
      })
      .count()
      .then(res => {
        if (res.total > 0) {
          this.setData({
            top: true
          })
        } else {
          this.setData({
            top: false
          })
        }
        console.log(res.total)
      })
  },
  noTopMessage: function() {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '此功能暂由开发者操作，可联系客服申请此权限~',
      success(res) {}
    })
  }
})