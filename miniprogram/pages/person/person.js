// miniprogram/pages/person/person.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchShow: false,
    id: "",
    mapCount: 0,
    nickName: "",
    avatarUrl: ""
  },
  onShow: function() {
    this.mark();
    wx.hideShareMenu();
    this.setData({
      nickName: wx.getStorageSync('nickName'),
      avatarUrl: wx.getStorageSync('avatarUrl')
    })
  },
  onShareAppMessage: function(options) {
    if (options.from == 'button') {
      return {
        title: 'where are u?',
        path: '/pages/my/my',
        imageUrl: "../../images/share.jpg"
      }
    }
  },
  goTarget: function(e) {
    const {
      url
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: url
    })
  },
  switchChange(e) {
    const {
      mapCount
    } = this.data;
    if (mapCount == 0) {
      this.setData({
        switchShow: false
      })
      wx.showModal({
        title: '提示',
        content: '未设置定位，是否去标记？',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/map/map',
            })
          } else if (res.cancel) {
            console.log('cancal')
          }
        }
      })
      return;
    }
    const {
      id
    } = this.data;
    const {
      value
    } = e.detail
    const db = wx.cloud.database()
    db.collection('map').doc(id)
      .update({
        data: {
          switchShow: value
        }
      })
      .then(resp => {
        this.mark()
      })
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  mark: function() {
    const db = wx.cloud.database()
    db.collection('map').where({
        _openid: app.globalData.openid
      })
      .get()
      .then(resp => {
        if (resp.data.length == 0) {
          return
        } else {
          this.setData({
            mapCount: resp.data && resp.data.length,
            switchShow: resp.data && resp.data[0].switchShow,
            id: resp.data && resp.data[0]._id
          })
        }
        console.log(JSON.stringify(resp))
      })
  },
  getUserInfo: function() {
    let that = this;
    wx.getSetting({
      success(ress) {
        if (ress.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              wx.setStorageSync('avatarUrl',
                res.userInfo.avatarUrl,
              )
              wx.setStorageSync('nickName',
                res.userInfo.nickName
              )
              that.setData({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                isLogn: true
              })
            },
            fail() {
              that.setData({
                isLogn: false
              })
            }
          })
        }
      }
    })
  }
})