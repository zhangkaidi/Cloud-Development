// miniprogram/pages/map/map.js
const app = getApp()
Page({
  data: {
    latitude: 39.9082878062,
    longitude: 116.3983440399,
    markers: [],
    flag: false,
    id: null
  },
  onShow: function() {
    const {
      openid
    } = app.globalData;
    this.getMark()
    this.exitOpenId(openid)
  },
  mark: function() {
    let that = this;
    const {
      flag,
      id
    } = this.data
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
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
                        title: res.userInfo.nickName,
                        iconPath: res.userInfo.avatarUrl,
                        latitude: resp.latitude,
                        longitude: resp.longitude,
                        width: 20,
                        height: 20,
                      }
                    }).then(resp => {
                      wx.showToast({
                        title: '标记成功',
                      })
                      that.getMark()
                    })
                  }
                }
              })
            },
            fail() {
              wx.showToast({
                title: '失败~',
              })
            }
          })
        }
      }
    })
  },
  exitOpenId: function(openid) {
    const db = wx.cloud.database({});
    db.collection('map').where({
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
    db.collection('map').where({
        _openid: openid
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
      that.setData({
        markers: res.result.data
      })
    }).catch(res => {
      console.log('res---->' + res)
    })
  },
  markertap: function() {
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度 
      success(res) {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 5
        })
      }
    })
  }
})