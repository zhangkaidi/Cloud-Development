const app = getApp()
const utils = require('../../utils.js')
Page({
  data: {
    messageListData: 0,
    message: "",
    getMessage: [],
    focus: false,
    openid: "",
    inputShow: false,
    tip: "",
    index: 1
  },
  onShow: function() {
    this.setData({
      openid: app.globalData.openid,
      tip: "",
      index: 1
    })
    this.getUserCount()
    this.getMessage()
  },
  onHide: function() {
    this.pageScrollTo();
  },
  pageScrollTo: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  skip: function(index) {
    const {
      getMessage,
    } = this.data;
    const db = wx.cloud.database()
    db.collection('message').orderBy('createTime', 'desc').skip(10 * index).limit(10)
      .get()
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].createTime = utils.formatDateTime(res.data[i].createTime)
        }
        console.log('skip' + res)
        this.setData({
          getMessage: getMessage.concat(res.data),
          index: index + 1,
          tip: ""
        })
      })
      .catch(console.error)
  },
  onReachBottom: function() {
    console.log('onReachBottom')
    const {
      messageListData,
      countSkip,
      index
    } = this.data
    if (countSkip > 1 && countSkip > index) {
      this.setData({
        tip: "加载中~"
      }, () => {
        this.skip(index);
      })
    } else {
      this.setData({
        tip: "没有更多数据~"
      })
    }

  },
  formSubmit: function() {
    const {
      avatarUrl,
      nickName,
      message
    } = this.data
    if (!message) {
      return;
    }
    let that = this;
    const db = wx.cloud.database({});
    db.collection('message').add({
      data: {
        message: message,
        createTime: db.serverDate(),
        avatarUrl: avatarUrl,
        nickName: nickName,
        isTop: false
      }
    }).then(resp => {
      that.getUserCount()
      wx.showToast({
        title: '祝福成功~',
        icon: "none",
      })
      that.pageScrollTo();
      that.getMessage()
      that.setData({
        message: "",
        index: 1,
        tip: ""
      })
    })
  },
  getUserCount: function() {
    const db = wx.cloud.database()
    db.collection('message').count().then(res => {
      this.setData({
        messageListData: res.total,
        countSkip: Math.ceil(res.total / 10)
      })
    })
  },
  messageText: function(e) {
    this.setData({
      message: e.detail.value.replace(/\s+/g, '')
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
      content: istop ? '确定取消置顶吗？' : '确定要置顶吗？',
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
              that.getUserCount()
            })
            .catch(res => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
              console.error('[数据库] [删除记录] 失败：', err)
            })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  },
  publish: function() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                inputShow: true
              }, () => {
                that.setData({
                  focus: true
                })
              })
            },
            fail(res) {
              that.setData({
                inputShow: false
              })
            }
          })
        }
      }
    })
  },
  getMessage: function() {
    const db = wx.cloud.database()
    db.collection('message').orderBy('createTime', 'desc').limit(10).get().then(res => {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].createTime = utils.formatDateTime(res.data[i].createTime)
        if (res.data[i].isTop) {
          var str = res.data.splice(i, 1);
          res.data.unshift(str[0]);
        }
      }
      this.setData({
        getMessage: res.data
      })
    })
  }
})