// subassembly/phone.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone: {
      type: Object
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
    /**
     * 取消
     * @param {*} e 
     */
    onCancel(e) {
      // 自定义组件向父组件传值
      this.triggerEvent('onCancel');
    },
    /**
     * 确认
     * @param {*} e 
     */
    onConfirm(e) {
      // 自定义组件向父组件传值
      this.triggerEvent('onConfirm');
    },
    /**
     * 输入的电话号码传回给父组件
     * @param {*} e 
     */
    phoneValueUpdate(e) {
      // 自定义组件向父组件传值
      this.triggerEvent('phoneValueUpdate',{phoneNum: e.detail.value});
    }
  }
})
