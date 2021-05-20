Page({
  data: {
    currentTab: 0,
    widHeight:1000
  },
  getheight(){
    var query = wx.createSelectorQuery();
    var that = this;
    var len = (wx.getStorageSync('xlist')).length;
    console.log(len)
    query.select('.card').boundingClientRect(function (rect) {
      that.setData({
        widHeight: 260 * len
      })
    }).exec();
  },
  getdata(i) {
    wx.request({
      url: 'https://api.xunhuiwang.cn/api/v1/pri/lost/my',
      header: { 'Authorization': wx.getStorageSync('token') },
      data: {
        type: i
      },
      success: (res) => {
        if (i == 1) {
          this.setData({
            slist: res.data.data.lost.items,
          })
        } else {
          this.setData({
            xlist: res.data.data.lost.items,
          })
        }
        console.log(res.data)
      },
      complete: function (res) {
        wx.showToast({
          title: "获取成功",
          icon: "success",
          duration: 1000
        });
      }
    })
  },
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  },
  delete: function(e){
    var _this = this
    wx.showModal({
      title: "温馨提示", 
      content: "确定彻底删除此条信息？", 
      cancelText: "否",
      confirmText: "是",
      success: function (res) {
        wx.request({
          url: 'https://api.xunhuiwang.cn/api/v1/pri/lost/remove',
          header: { 'Authorization': wx.getStorageSync('token') },
          method: 'POST',
          data: {
            id: e.target.dataset.id,
            status: 3
          },
          success: (res) => {
            console.log(res.data)
          },
          complete: function (res) {
            wx.showToast({
              title: "删除成功",
              icon: "success",
              duration: 1000
            });
            _this.getdata(1)
            _this.getdata(2)
          }
        })
     },
    })
  },
  finish: function(e){
    var _this = this
    wx.showModal({
      title: "温馨提示", 
      content: "是否将此条信息设为已完成？", 
      cancelText: "否",
      confirmText: "是",
      success: function (res) {
        wx.request({
          url: 'https://api.xunhuiwang.cn/api/v1/pri/lost/remove',
          header: { 'Authorization': wx.getStorageSync('token') },
          method: 'POST',
          data: {
            id: e.target.dataset.id,
            status: 2
          },
          success: (res) => {
            console.log(res.data)
          },
          complete: function (res) {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 1000
            });
            _this.getdata(1)
            _this.getdata(2)
          }
        })
     },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata(1)
    this.getdata(2)
    this.getheight()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})