// pages/lists/bookrack/borrow/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '刑法中的同意制度-借出',
    })
  },
  showImg(res) {
    const url = res.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  nav(){
    wx.navigateTo({
      url: '../borrowSubmit/index',
    })
  }
})