// pages/lists/manage/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: [{
      logo: '../../../../assets/images/otherIcon/manage/person.png',
      title: '人员管理',
      url: "../person/index"
    }, {
      logo: '../../../../assets/images/otherIcon/manage/bookrack.png',
      title: '书本管理',
      url: "../bookrack/index"
    }, {
      logo: '../../../../assets/images/otherIcon/manage/location.png',
      title: '位置管理',
      url: "../location/index"
    }, {
      logo: '../../../../assets/images/otherIcon/manage/addtype.png',
      title: '加入方式',
      url: "../addtype/index"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '广油信息技术网络工作室',
    })
  },
  nav(res) {
    const url = res.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  }
})