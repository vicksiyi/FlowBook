// pages/lists/bookrack/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: ["添", "借", "还", "退"],
    selected: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const title = options.title;
    wx.setNavigationBarTitle({
      title: `${title ? title : '广油信息技术网络工作室'}书架`,
    })
  },
  switchSelect() {
    this.setData({
      selected: !this.data.selected
    })
  },
  nav() {
    wx.navigateTo({
      url: '../detail/index',
    })
  }
})