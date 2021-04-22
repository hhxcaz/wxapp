// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    currentTab: 0,
    selectorVisible: false,
    locationName: '南宁市'
  },
  swichNav: function (e) {

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
    this.setData({
      currentTab: e.detail.current,
    })
  },
  selectorCity: function (e) {
    this.setData({
      selectorVisible: true,
    });
  },
  // 当用户选择了组件中的城市之后的回调函数
  onSelectCity(e) {
    this.setData({
      locationName: e.detail.city.fullname
    });
    wx.setStorageSync('location', e.detail.city.fullname)
  },
  calling: function () {
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
  getdata(i) {
    wx.request({
      url: 'https://api.xunhuiwang.cn/api/v1/pub/lost/list',
      header: { 'Authorization': wx.getStorageSync('token') },
      data: {
        address: this.data.locationName,
        type: i,
        limit: 10,
        page: 1
      },
      success: (res) => {
        if (i == 1) {
          this.setData({
            slist: res.data.data.items
          })
        } else {
          this.setData({
            xlist: res.data.data.items
          })
        }
        console.log(res.data)
      },
      complete: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
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
    if(this.data.currentTab == 0){
      var i=2 //寻物启事
    }else{
      var i=1
    }
    this.getdata(i)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  onLoad: function (optins) {
    this.getdata(1)
    this.getdata(2)
  },
  onReady: function () {
    // if (wx.getUserProfile) {
    //   this.setData({
    //     canIUseGetUserProfile: true
    //   })
    // }
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
  onShow: function () {
    if (wx.getStorageSync('location') !== '') {
      this.setData({
        locationName: wx.getStorageSync('location')
      });
    }
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
