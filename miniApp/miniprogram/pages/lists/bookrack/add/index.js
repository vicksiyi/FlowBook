// pages/lists/bookrack/add/index.js
const getBook = require("../../../../utils/scan").getBook;
const { $Message } = require('../../../../dist/base/index');
const getRandomStr = require("../../../../utils/utils").getRandomStr;
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
    date: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '广油信息-上架图书',
    })
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
        $Message({
          content: '获取成功',
          type: 'success'
        });
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
  submit() {
    $Message({
      content: '上架成功',
      type: 'success'
    });
  }
})