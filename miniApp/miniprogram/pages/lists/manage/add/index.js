// pages/lists/manage/add/index.js
const getRandomStr = require("../../../../utils/utils").getRandomStr;
const { create } = require("../../../../utils/api/bookrack");
const { $Message } = require("../../../../dist/base/index");
const md5 = require("../../../../utils/md5");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: "",
    title: "",
    desc: "",
    passwd: "",
    spinShow: false,
    token: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('_token');
    this.setData({
      token: token
    })
  },
  async add() {
    let _this = this;
    let { title, desc, passwd, logo, token } = this.data;
    if (!title || !desc || !logo) {
      $Message({ type: "warning", content: "请输入必要的字段" });
      return;
    }
    if (passwd) passwd = md5(passwd);
    this.setData({ spinShow: true });
    let _result = await create({ title, desc, passwd, logo }, token);
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      this.setData({ spinShow: false });
    } else {
      $Message({ type: "success", content: "创建成功" });
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
        _this.setData({ spinShow: false });
      }, 500)
    }
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
  },
  titleChange(e) {
    this.setData({
      title: e.detail.detail.value
    })
  },
  descChange(e) {
    this.setData({
      desc: e.detail.detail.value
    })
  },
  passwdChange(e) {
    this.setData({
      passwd: e.detail.detail.value
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})