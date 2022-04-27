// pages/lists/bookrack/add/index.js
const getBook = require("../../../../utils/scan").getBook;
const { $Message } = require('../../../../dist/base/index');
const getRandomStr = require("../../../../utils/utils").getRandomStr;
const { upbook } = require("../../../../utils/api/bookrack");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn: "",
    url: "",
    title: "",
    author: "",
    publisher: "",
    pubdate: "",
    summary: "",
    spinShow: false,
    images: [],
    date: "",
    msg: "",
    navtitle: '',
    uuid: "",
    id: '',
    token: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    let token = wx.getStorageSync('_token');
    let { title, uuid, id } = options;
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
    this.setData({ navtitle: title, uuid: uuid, token: token, id: id })
  },
  scan() {
    let _this = this;
    this.setData({ spinShow: true })
    wx.scanCode({
      onlyFromCamera: true,
      async success(res) {
        let _result = (await getBook(res.result)).result;
        _this.setData({
          isbn: _result.isbn,
          url: _result.pic,
          title: _result.title,
          author: _result.author,
          publisher: _result.publisher,
          pubdate: _result.pubdate,
          summary: _result.summary
        })
        $Message({ content: '获取成功', type: 'success' });
      },
      fail() {
        $Message({ content: '无法识别', type: 'error' });
      },
      complete() {
        _this.setData({ spinShow: false })
      }
    })
  },
  addImage() {
    let _this = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      camera: 'back',
      success(res) {
        _this.setData({ spinShow: true })
        let suffix = '.jpeg'
        let cloudPath = 'images/' + getRandomStr() + suffix;
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: res.tempFiles[0].tempFilePath,
          success: res => {
            let images = _this.data.images;
            images.push(res.fileID);
            _this.setData({ images: images });
          },
          complete() {
            _this.setData({ spinShow: false })
          }
        })
      }
    })
  },
  async submit() {
    let { isbn, url, title, author, publisher, pubdate,
      summary, images, date, msg, uuid, token, id } = this.data;
    if (!uuid) {
      $Message({ type: "error", content: "书架错误" });
      return;
    }
    if (!isbn || !title) {
      $Message({ type: "error", content: "本书无法添加" });
      return;
    }
    if (images.length < 1) {
      $Message({ type: "warning", content: "请添加图片" });
      return;
    }
    this.setData({ spinShow: true });
    let _result = await upbook({
      isbn, img: url, title, author, publisher, pubdate,
      desc: summary, images, max_time: date, msg, uuid, id
    }, token);
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      this.setData({ spinShow: false });
      return;
    }
    $Message({ type: "success", content: "上架成功" });
    time = setTimeout(() => {
      this.setData({ spinShow: false });
      wx.navigateBack({
        delta: 1,
      })
    }, 500);
  },
  msgChange(e) {
    this.setData({ msg: e.detail.detail.value });
  },
  bindDateChange(e) {
    this.setData({ date: e.detail.value });
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})