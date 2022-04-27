// pages/lists/show/index.js
const { getjoinbookrack } = require("../../../utils/api/bookrack");
const { $Message } = require("../../../dist/base/index");
const _ = require("../../../utils/md5");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    islast: false,
    page: 1,
    loading: false,
    bookracks: [],
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let token = wx.getStorageSync('_token');
    wx.getSystemInfo({
      success: (result) => {
        this.setData({ token: token, height: result.windowHeight })
        this.getData();
      },
    })
  },
  nav: function (res) {
    const title = res.currentTarget.dataset.title;
    wx.navigateTo({
      url: `../bookrack/home/index?title=${title}`,
    })
  },
  click() {
    console.log("粗糙度");
  },
  async getData() {
    let { page, islast, token, bookracks } = this.data;
    if (islast) {
      $Message({ content: '已经是最后一页', type: 'warning' });
      return;
    }
    this.setData({ loading: true });
    let _result = await getjoinbookrack(page, token);
    this.setData({ loading: false });
    if (_result.code != 200) {
      $Message({ content: _result.msg, type: 'error' });
      return;
    }
    if (_result.data.length != 10) {
      $Message({ type: "warning", content: "最后一页" });
      this.setData({ islast: true })
    } else {
      _this.setData({ page: page + 1 });
    }
    bookracks.push.apply(bookracks, _result.data);
    this.setData({ bookracks: bookracks })
  },
  scrolltolower(){
    this.getData();
  }
})