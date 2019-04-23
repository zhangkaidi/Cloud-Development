// Bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navgationText: { // 属性名
      type: String,
      value: ''
    },
    num: { // 属性名
      type: Number,
      value: ''
    },
    isBack: {
      type: Boolean,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    startBarHeight: "",
    navgationHeight: ""
  },
  lifetimes: {
    attached() {
      this.setNavigation()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navigatBackTo: function() {
      wx.switchTab({
        url: '/pages/person/person'
      })
    },
    setNavigation() {
      let startBarHeight = 20
      let navgationHeight = 44
      let that = this
      wx.getSystemInfo({
        success: function(res) {
          console.log(res.model)
          if (res.model == 'iPhone X') {
            startBarHeight = 44
          }
          that.setData({
            startBarHeight: startBarHeight,
            navgationHeight: navgationHeight
          })
        }
      })
    }
  }
})