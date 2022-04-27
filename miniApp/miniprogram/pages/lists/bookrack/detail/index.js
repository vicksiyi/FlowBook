// pages/lists/bookrack/detail/index.js
const { $Message } = require("../../../../dist/base/index");
const { getbookupdetail } = require("../../../../utils/api/bookrack");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {},
    loading: false,
    uuid: "",
    page: 1,
    islast: false,
    details: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { uuid } = options;
    if (!uuid) {
      $Message({ type: "error", content: "未知错误" });
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 500)
    }
    let token = wx.getStorageSync('_token')
    this.setData({ uuid: uuid, token: token });
  },
  onShow() {
    let book = wx.getStorageSync('book')
    if (!book) {
      wx.navigateBack({
        delta: 1,
      })
    } else {
      book = JSON.parse(book);
    }
    this.setData({ book: book });
    wx.setNavigationBarTitle({
      title: book.title,
    })
    this.setData({ page: 1, islast: false, details: [] });
    this.getData();
  },
  async getData() {
    let { page, book, uuid, islast, token, details } = this.data;
    if (islast) {
      $Message({ type: "warning", content: "已经是最后一页" });
      return;
    }
    this.setData({ loading: true });
    let _result = await getbookupdetail(page, uuid, book.isbn, token);
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
    details.push.apply(details, _result.data);
    this.setData({ details: details });
  },
  nav(e) {
    const { item } = e.currentTarget.dataset;
    wx.setStorageSync('detail', JSON.stringify(item));
    wx.navigateTo({
      url: '../borrow/index',
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  },
  scrolltolower() {
    this.getData();
  }
})