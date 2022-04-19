// pages/lists/bookrack/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: [
      { title: "添", url: "../add/index" },
      { title: "借", url: "" },
      { title: "还", url: "" },
      { title: "退", url: "" }],
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
  },
  navPage(res) {
    const url = res.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  }
})