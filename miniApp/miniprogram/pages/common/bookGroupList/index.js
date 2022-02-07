// pages/common/bookGroupList/index.js
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
    wx.setNavigationBarTitle({
      title: '排行榜-书架',
    })
  },
  select:function(res){
    console.log(res)
  }
})