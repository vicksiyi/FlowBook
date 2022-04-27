// pages/lists/bookrack/home/index.js
const { $Message } = require("../../../../dist/base/index");
const { getbookrackbooks } = require("../../../../utils/api/bookrack");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: [
      { title: "添", url: "../add/index" },
      { title: "借", url: "../borrowBook/index" },
      { title: "还", url: "../back/index" },
      { title: "退", url: "../exit/index" }],
    selected: false,
    title: '',
    uuid: '',
    id: "",
    loading: false,
    islast: false,
    page: 1,
    books: [],
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    const { title, uuid, id } = options;
    if (!title || !uuid || !id) {
      $Message({ type: "error", content: "未知错误" });
      this.setData({ loading: true })
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 500);
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    let token = wx.getStorageSync('_token');
    this.setData({ title: title, uuid: uuid, id: id, token: token });
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
  },
  onShow() {
    this.setData({ page: 1, islast: false, books: [] })
    this.getData();
  },
  async getData() {
    let { page, token, uuid, islast, books } = this.data;
    if (islast) {
      $Message({ type: "warning", content: "已经是最后一页" });
      return;
    }
    this.setData({ loading: true });
    let _result = await getbookrackbooks(page, uuid, token);
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
    books.push.apply(books, _result.data);
    this.setData({ books: books })
  },
  switchSelect() {
    this.setData({
      selected: !this.data.selected
    })
  },
  nav(e) {
    const { item } = e.currentTarget.dataset;
    const { uuid } = this.data;
    wx.setStorageSync('book', JSON.stringify(item));
    wx.navigateTo({
      url: `../detail/index?uuid=${uuid}`,
    })
  },
  navPage(res) {
    const url = res.currentTarget.dataset.url;
    const { uuid, title, id } = this.data;
    if (!title || !uuid || !id) {
      $Message({ type: "error", content: "未知错误" });
      this.setData({ loading: true })
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 500);
    }
    wx.navigateTo({
      url: `${url}?uuid=${uuid}&title=${title}&id=${id}`,
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  },
  scrolltolower() {
    this.getData();
  }
})