// pages/lists/show/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  nav: function (res) {
    const title = res.currentTarget.dataset.title;
    wx.navigateTo({
      url: `../bookrack/home/index?title=${title}`,
    })
  },
  click(){
    console.log("粗糙度");
  }
})