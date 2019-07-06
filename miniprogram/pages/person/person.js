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
    avatarUrl: "",
    openid: "",
    defaultImage: "../../images/user-unlogin.png"
  },
  onShow: function() {
    this.mark();
    wx.hideShareMenu();
    this.setData({
      openid: app.globalData.openid,
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl
    })
  },
  onShareAppMessage: function(options) {
    if (options.from == 'button') {
      return {
        title: 'where are u?',
        path: '/pages/ad/ad',
        imageUrl: "../../images/share.jpg"
      }
    }
  },
  goTarget: function(e) {
    const {
      nickName
    } = this.data;
    if (!nickName) {
      wx.showToast({
        title: '请先登录~',
        icon: "none"
      })
      return;
    }
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
  }
})