// pages/lists/add/index.js
const { $Message } = require('../../../dist/base/index');
const { search, joinbookrack } = require("../../../utils/api/bookrack");
const md5 = require("../../../utils/md5");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    visible: false,
    iskey: false,
    keyword: "",
    page: 1,
    islast: false,
    bookracks: [],
    height: 0,
    passwd: "",
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let token = wx.getStorageSync('_token');
    wx.getSystemInfo({
      success: (result) => {
        console.log(result.windowHeight);
        _this.setData({
          token: token,
          height: result.windowHeight - (result.windowHeight * 50) / 603
        });
      },
    })
  },
  show(res) {
    const { iskey, id } = res.currentTarget.dataset;
    this.setData({
      iskey: iskey == '1' ? true : false,
      visible: true,
      passwd: "",
      id: id
    })
  },
  async submit() {
    let { iskey, passwd, token, id } = this.data;
    if (iskey && !passwd) {
      $Message({ type: "warning", content: "请输入密码" });
      return;
    }
    passwd = passwd ? md5(passwd) : "";
    this.setData({ loading: true });
    let _result = await joinbookrack(id, passwd, token);
    this.setData({ loading: false, visible: false });
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      return;
    }
    $Message({ type: "success", content: "成功加入" });
  },
  cancel() {
    this.setData({
      visible: false
    })
  },
  keywordChange(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  async search(e, isget = false) {
    let _this = this;
    let { keyword, page, token, islast } = this.data;
    let bookracks = null;
    if (!isget) {
      page = 1;
      this.setData({ page: 1, islast: false });
      bookracks = []
    }
    else bookracks = this.data.bookracks;
    if (!keyword) {
      $Message({ content: '搜索词不能为空', type: 'warning' });
      return;
    }
    if (isget && islast) {
      $Message({ type: "warning", content: "已经是最后一页" });
      return;
    }
    this.setData({ loading: true });
    let _result = await search(keyword, page, token);
    this.setData({ loading: false });
    if (_result.code != 200) {
      $Message({ content: _result.msg, type: 'error' })
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
  scrolltolower() {
    this.search('', true);
  },
  passwdChange(e) {
    this.setData({
      passwd: e.detail.value
    })
  }
})