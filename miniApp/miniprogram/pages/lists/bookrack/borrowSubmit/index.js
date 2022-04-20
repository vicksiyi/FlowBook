// pages/lists/bookrack/borrowSubmit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    latitude: 39.89631551,
    longitude: 116.323459711,
    markers: [{
      id: 1,
      latitude: 39.89631551,
      longitude: 116.323459711,
      name: '虎虎春联购'
    }],
    covers: [{
      latitude: 39.89631551,
      longitude: 116.323459711,
      iconPath: '/image/location.png'
    }, {
      latitude: 39.89631551,
      longitude: 116.323459711,
      iconPath: '/image/location.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '刑法中的同意制度-借出-提交表单',
    })
  },
  bindDateChange(res) {
    this.setData({ date: res.detail.value })
  },
  handleClick() {
    wx.navigateBack({
      delta: 3
    })
  }
})