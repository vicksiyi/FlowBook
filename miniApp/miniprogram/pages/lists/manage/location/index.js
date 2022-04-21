// pages/lists/manage/location/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 39.89631551,
    longitude: 116.323459711,
    markers: [{
      id: 1,
      latitude: 39.89631551,
      longitude: 116.323459711,
      name: '虎虎春联购'
    }],
    covers: [{
      latitude: 39.89631551,
      longitude: 116.323459711,
      iconPath: '/image/location.png'
    }, {
      latitude: 39.89631551,
      longitude: 116.323459711,
      iconPath: '/image/location.png'
    }],
    location: 600,
    desc: "限制在书架附近600米才能借书成功！"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  }
})