// miniprogram/pages/map/map.js
const app = getApp()
Page({
  data: {
    latitude: 39.9082878062,
    longitude: 116.3983440399,
    markers: [],
    flag: false,
    id: null,
    navgationText: '地图',
    markersCount: ""
  },
  onShow: function() {
    this.getMark()
    this.exitOpenId()
    this.getLocationSetting()
  },
  getuserinfo: function() {
    this.getLocation()
  },
  getLocation: function() {
    const {
      id,
      flag
    } = this.data;
    let that = this;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(resp) {
        const db = wx.cloud.database()
        if (flag) {
          wx.showModal({
            title: '提示',
            content: '确定重新定位？',
            success(res) {
              if (res.confirm) {
                db.collection('map').doc(id).update({
                  data: {
                    latitude: resp.latitude,
                    longitude: resp.longitude
                  }
                }).then(resp => {
                  console.log('resp--->' + JSON.stringify(resp))
                  wx.showToast({
                    title: '更新成功',
                  })
                  that.getMark()
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          db.collection('map').add({
            data: {
              id: new Date().getTime(),
              title: app.globalData.nickName,
              iconPath: app.globalData.avatarUrl,
              latitude: resp.latitude,
              longitude: resp.longitude,
              width: 20,
              height: 20,
              switchShow: true
            }
          }).then(resp => {
            wx.showToast({
              title: '标记成功',
            })
            that.exitOpenId()
            that.getMark()
          })
        }
      },
      fail() {
        wx.showToast({
          title: '定位失败！',
          icon: 'none'
        })
      }
    })
  },
  initLocation: function() {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {} else {
          wx.openSetting({
            success(res) {
              console.log('res--->' + res)
            },
            fail(res) {}
          })
        }
      },
      fail(res) {}
    })
  },
  getLocationSetting: function() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {} else {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {},
            fail() {}
          })
        }
      },
      fail(res) {}
    })
  },
  exitOpenId: function() {
    const db = wx.cloud.database({});
    db.collection('map').where({
        _openid: app.globalData.openid
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
    db.collection('map').where({
        _openid: app.globalData.openid
      })
      .get()
      .then(resp => {
        this.setData({
          id: resp.data[0]._id
        })
      })
      .catch(resp => {})
  },
  getMark: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'marklist',
    }).then(res => {
      this.setData({
        markersCount: res.result.data && res.result.data.length
      })
      for (var i = 0; i < res.result.data.length; i++) {
        if (!res.result.data[i].switchShow) {
          res.result.data[i].iconPath = ''
          res.result.data[i].title = '匿名'
        }
      }
      that.setData({
        markers: res.result.data.filter(d => d),
        markersEndCount: res.result.data && res.result.data.filter(d => d).length
      })
    }).catch(res => {
      console.log('res---->' + res)
    })
  },
  markertap: function(e) {
    console.log(e.markerId)
    const {
      markers
    } = this.data;
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].id === e.markerId) {
        wx.openLocation({
          latitude: markers[i].latitude,
          longitude: markers[i].longitude,
          scale: 5
        })
      }
    }
  }
})