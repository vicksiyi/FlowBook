// pages/lists/bookrack/back/index.js
const getRandomStr = require("../../../../utils/utils").getRandomStr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: false,
    isbn: "9787212058937",
    url: "http:\/\/api.jisuapi.com\/isbn\/upload\/96\/033c435b3f0f30.jpg",
    title: "有理想就有疼痛",
    author: "高晓春",
    publisher: "安徽人民出版社",
    pubdate: "2013-1",
    summary: "《有理想就有疼痛:中国当代文化名人访谈录》是一份关于当代中国文化的最真实底稿，收录了高晓春与白先勇、冯骥才、余华、莫言、余秋雨、陈忠实等20位当代中国文化大家的对话。通过近距离的访谈，展现了这些文化大家多彩的内心世界，也阐释了他们对生命、艺术、财富及文化的理解。",
    images:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  scan() {
    let _this = this;
    wx.scanCode({
      onlyFromCamera: true,
      async success(res) {
        _this.setData({ isshow: true })
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
      content: '归还成功',
      type: 'success'
    });
  }
})