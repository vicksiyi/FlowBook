// pages/lists/mine/index.js
const { getminebookrack } = require("../../../utils/api/bookrack");
const { $Message } = require("../../../dist/base/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    token: "",
    loading: false,
    bookracks: [],
    height: 0,
    islast: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let token = wx.getStorageSync('_token');
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight,
          token: token
        })
      },
    })
  },
  onShow() {
    this.setData({
      page: 1,
      islast: false,
      bookracks: []
    })
    this.getData();
  },
  async getData() {
    let _this = this;
    let { page, token, islast } = this.data;
    if (islast) {
      $Message({ type: "warning", content: "已经是最后一页" });
      return;
    }
    this.setData({ loading: true });
    let _result = await getminebookrack(token, page);
    this.setData({ loading: false });
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      return;
    }
    if (_result.data.length != 10) {
      $Message({ type: "warning", content: "最后一页" });
      this.setData({ islast: true })
    } else {
      _this.setData({ page: page + 1 });
    }
    let bookracks = this.data.bookracks;
    bookracks.push.apply(bookracks, _result.data);
    this.setData({ bookracks: bookracks });
  },
  nav(e) {
    let { uuid, title, is_passwd } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../manage/home/index?uuid=${uuid}&title=${title}&is_passwd=${is_passwd}`,
    })
  },
  add() {
    wx.navigateTo({
      url: '../manage/add/index',
    })
  },
  scrolltolower(e) {
    this.getData();
  }
})