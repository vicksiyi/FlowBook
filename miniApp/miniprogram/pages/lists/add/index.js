// pages/lists/add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    visible: false,
    iskey: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  show(res) {
    const iskey = res.currentTarget.dataset.iskey;
    this.setData({
      iskey: iskey == '1' ? true : false,
      visible: true
    })
  },
  submit() {
    this.setData({
      visible: false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  cancel() {
    this.setData({
      visible: false
    })
  }
})