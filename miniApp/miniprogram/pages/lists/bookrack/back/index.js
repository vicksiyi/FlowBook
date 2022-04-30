// pages/lists/bookrack/back/index.js
const getRandomStr = require("../../../../utils/utils").getRandomStr;
const { getdetailborrow, backbook } = require("../../../../utils/api/bookrack");
const { $Message } = require("../../../../dist/base/index");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    uuid: "",
    token: "",
    book: {},
    detail: {},
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { uuid } = options;
    let token = wx.getStorageSync('_token');
    this.setData({ uuid, token })
  },
  async getData(isbn) {
    let { uuid, token } = this.data;
    this.setData({ loading: true })
    let _result = await getdetailborrow(isbn, uuid, token);
    this.setData({ loading: false })
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      return;
    }
    if(_result.data) {
      $Message({ type: "warning", content: "暂无借阅此书" });
    }
    this.setData({ book: _result.book, detail: _result.data })
  },
  scan() {
    let _this = this;
    wx.showLoading({ title: '识别中', mask: true })
    wx.scanCode({
      onlyFromCamera: true,
      async success(res) {
        _this.getData(res.result);
      },
      complete() {
        wx.hideLoading()
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
        _this.setData({ loading: true })
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
            _this.setData({ loading: false })
          }
        })
      }
    })
  },
  async submit() {
    let { detail, images, token } = this.data;
    wx.showLoading({ title: '归还中', mask: true })
    let _result = await backbook({
      bru_id: detail.bru_id,
      brrb_id: detail.brrb_id,
      images
    }, token);
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      wx.hideLoading()
      return;
    }
    $Message({ type: "success", content: "归还成功" });
    time = setTimeout(() => {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
    }, 100)
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})