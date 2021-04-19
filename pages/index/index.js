// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    currentTab: 0,
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
  calling: function(){
    wx.makePhoneCall({
      phoneNumber: '18677066237',
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中......',
    })
    wx.request({
      url: 'https://106.52.255.36/api/v1/pub/lost/list',
      header: { 
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        address: '广西壮族自治区-南宁市',
        type: '2',
        limit: 10,
        page: 1
      },
      success: (res) => {
        _this.setData({
          xlist: res.data.data.items
        })
        console.log(res.data)
      },
      complete: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
    var query = wx.createSelectorQuery();
    // var len = (wx.getStorageSync('read')).length;
    // query.select('.exam').boundingClientRect(function (rect) {
    //   _this.setData({
    //     // 获取要循环标签的高度
    //     // height: rect.height,
    //     widHeight: 128 * len
    //   })
    // }).exec();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onLoad: function(optins) {
    var _this = this
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    wx.request({
      url: 'https://106.52.255.36/api/v1/pub/lost/list',
      header: { 
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        address: '广西壮族自治区-南宁市',
        type: '2',
        limit: 10,
        page: 1
      },
      success: (res) => {
        _this.setData({
          xlist: res.data.data.items
        })
        console.log(res.data)
      }
    })
  },
  onReady: function () {
    // var query = wx.createSelectorQuery();
    // var that = this;
    // var len = (wx.getStorageSync('read')).length;
    // query.select('.exam').boundingClientRect(function (rect) {
    //   that.setData({
    //     // 获取要循环标签的高度
    //     // height: rect.height,
    //     widHeight: 128 * len
    //   })
    // }).exec();
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
