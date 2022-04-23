// components/bookrack/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    desc: {
      type: String,
      value: "暂无描述"
    },
    logo: {
      type: String,
      value: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    },
    title: {
      type: String,
      value: ""
    },
    nickName: {
      type: String,
      value: ""
    },
    isBorrow: {
      type: Boolean,
      value: false
    },
    iskey: {
      type: Boolean,
      value: false
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
    test() {
      this.triggerEvent('click')
    }
  },
})
