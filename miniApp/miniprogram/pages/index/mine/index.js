// pages/index/mine/index.js
const { $Message } = require("../../../dist/base/index");
const { edit } = require("../../../utils/api/user");
const getRandomStr = require("../../../utils/utils").getRandomStr;
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isedit: false,
    token: "",
    mine: {},
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('_token');
    let mine = wx.getStorageSync('mine');
    this.setData({ token, mine: JSON.parse(mine) })
  },
  nicknameChahnge(e) {
    this.setData({ ["mine.nick_name"]: e.detail.detail.value })
  },
  descChange(e) {
    this.setData({ ["mine.desc"]: e.detail.detail.value })
  },
  upload() {
    let { isedit } = this.data;
    if (!isedit) { return; }
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
            _this.setData({ ["mine.avatar"]: res.fileID });
          },
          complete() {
            _this.setData({ loading: false })
          }
        })
      }
    })
  },
  edit() {
    $Message({ content: '开始编辑', type: 'warning' });
    this.setData({ isedit: true })
  },
  async save() {
    let _this = this;
    let { mine, token } = this.data;
    let { nick_name, avatar, desc } = mine;
    if (!nick_name || !avatar || !desc) {
      $Message({ content: '字段不能为空', type: 'warning' });
      return;
    }
    this.setData({ loading: true })
    let _result = await edit({
      nick_name: nick_name,
      avatar: avatar,
      desc: desc
    }, token);
    if (_result.code != 200) {
      $Message({ content: _result.msg, type: 'error' });
      this.setData({ loading: false })
      return;
    }
    $Message({ content: "成功修改", type: 'success' });
    _this.setData({ loading: false, isedit: false })
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})