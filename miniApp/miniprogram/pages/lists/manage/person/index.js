// pages/lists/manage/person/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    showRight: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 60
        })
      },
    })
  },
  manage() {
    this.setData({ showRight: !this.data.showRight })
  },
  toggleRight() {
    this.setData({ showRight: !this.data.showRight })
  },
  show(){
    wx.navigateTo({
      url: '../history/index',
    })
  }  
})