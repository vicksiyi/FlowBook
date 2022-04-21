// pages/lists/manage/add/index.js
const getRandomStr = require("../../../../utils/utils").getRandomStr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: "",
    spinShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  add() {
    wx.navigateBack({ delta: 1 })
  },
  upload() {
    let _this = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        _this.setData({ spinShow: true })
        let suffix = '.jpeg'
        let cloudPath = 'images/' + getRandomStr() + suffix;
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: res.tempFiles[0].tempFilePath,
          success: res => {
            _this.setData({ logo: res.fileID });
          },
          complete() {
            _this.setData({ spinShow: false })
          }
        })
      }
    })
  }
})