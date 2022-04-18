// pages/index/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'home',
    height: 0,
    spinShow: false,
    listHeight: 0,
    lists: [{
      url: "../../assets/images/home/sort.png",
      text: "书架排行",
      path:"../../lists/sort/index"
    }, {
      url: "../../assets/images/home/book.png",
      text: "查看书架",
      path:"../../lists/show/index"
    }, {
      url: "../../assets/images/home/add-book.png",
      text: "加入书架",
      path:"../../lists/add/index"
    }, {
      url: "../../assets/images/home/mine-book.png",
      text: "我的书架",
      path:"../../lists/mine/index"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 50,
          listHeight: result.windowHeight - 200
        })
      },
    })
  },
  handleChange({ detail }) {
    let _this = this;
    this.setData({
      current: detail.key,
      spinShow: true
    });
    let time = setTimeout(() => {
      _this.setData({
        spinShow: false
      })
      clearTimeout(time);
    }, 1000)
  }
})