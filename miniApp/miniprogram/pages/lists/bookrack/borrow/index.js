// pages/lists/bookrack/borrow/index.js
const { $Message } = require('../../../../dist/base/index');
const { getimages } = require("../../../../utils/api/bookrack");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {},
    detail: {},
    loading: false,
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('_token');
    this.setData({ token: token })
    wx.setNavigationBarTitle({
      title: '刑法中的同意制度-借出',
    })
  },
  onShow() {
    let book = wx.getStorageSync('book');
    let detail = wx.getStorageSync('detail');
    if (!book) {
      wx.navigateBack({ delta: 2, })
    } else {
      book = JSON.parse(book);
    }
    if (!detail) {
      wx.navigateBack({ delta: 1, })
    } else {
      detail = JSON.parse(detail);
    }
    this.setData({ book: book, detail: detail });
    wx.setNavigationBarTitle({
      title: `${book.title}-借出`,
    })
    this.getData();
  },
  async getData() {
    let { detail, token } = this.data;
    this.setData({ loading: true })
    let _result = await getimages(detail.id, token);
    this.setData({ loading: false })
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg })
      return;
    }
    this.setData({
      images: _result.data
    })
  },
  showImg(res) {
    const { index } = res.currentTarget.dataset;
    const { images } = this.data;
    let _images = images.map(value => {
      return value.url
    })
    wx.previewImage({
      current: images[index].url,
      urls: _images
    })
  },
  nav() {
    wx.navigateTo({
      url: '../borrowSubmit/index',
    })
  }
})