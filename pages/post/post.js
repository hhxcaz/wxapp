// pages/post/post.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 160,
    snum: 160,
    currentTab: 0,
    selectorVisible: false,
    locationName: null
  },
  selectorCity: function (e) {
    this.setData({
      selectorVisible: true,
    });
  },
  // 当用户选择了组件中的城市之后的回调函数
  onSelectCity(e) {
    this.setData({
      locationName: e.detail.province.fullname+"-"+e.detail.city.fullname
    });
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
  cal: function (e) {
    this.setData({
      num: 160 - e.detail.value.length
    })
  },
  cals: function (e) {
    this.setData({
      num: 160 - e.detail.value.length
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    getApp().login();//每次显示页面都去执行一下登入方法，如果未登入则会登入，如果已登入则无效果，如果登入失败则弹出登入失败提示
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