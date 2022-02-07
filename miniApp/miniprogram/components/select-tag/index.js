// components/select-tag/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lists: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    nav: function (res) {
      let _this = this;
      let index = res.currentTarget.dataset.id;
      wx.navigateTo({
        url: `${_this.properties.lists[index].path}`,
      })
    }
  }
})
