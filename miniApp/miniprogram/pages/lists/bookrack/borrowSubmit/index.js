// pages/lists/bookrack/borrowSubmit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: ""
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
  }
})