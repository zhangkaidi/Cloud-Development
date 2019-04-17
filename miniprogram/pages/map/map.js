// miniprogram/pages/map/map.js
Page({
  data: {
    latitude: 34.3155400000,
    longitude: 107.6004300000,
    markers: [{
      id: 0,
      title: "前往目的地",
      iconPath: '/images/location.png',
      latitude: 34.3155400000,
      longitude: 107.6004300000,
      width: 60,
      height: 60,
    }]
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  markertap: function() {
    const {
      latitude,
      longitude
    } = this.data;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
  },
})