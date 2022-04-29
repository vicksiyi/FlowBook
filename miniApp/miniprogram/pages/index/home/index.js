// pages/index/home/index.js
const { $Message } = require("../../../dist/base/index");
const { mine } = require("../../../utils/api/user");
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
      path: "../../lists/sort/index"
    }, {
      url: "../../assets/images/home/book.png",
      text: "查看书架",
      path: "../../lists/show/index"
    }, {
      url: "../../assets/images/home/add-book.png",
      text: "加入书架",
      path: "../../lists/add/index"
    }, {
      url: "../../assets/images/home/mine-book.png",
      text: "我的书架",
      path: "../../lists/mine/index"
    }],
    token: "",
    mine: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let token = wx.getStorageSync('_token');
    this.setData({ token: token });
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 50,
          listHeight: result.windowHeight - 200
        })
      },
    })
    this.getmine();
  },
  onShow(){
    this.getmine();
  },
  handleChange({ detail }) {
    let _this = this;
    this.setData({
      current: detail.key
    });
  },
  async getmine() {
    let { token } = this.data;
    this.setData({ spinShow: true })
    let _result = await mine(token);
    this.setData({ spinShow: false })
    wx.setStorageSync('mine', JSON.stringify(_result.data))
    this.setData({ mine: _result.data })
  },
  exit() {
    wx.removeStorageSync('_token')
    wx.redirectTo({
      url: '../../signIn/index/index',
    })
  }
})