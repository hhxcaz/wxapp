// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    currentTab: 0,
    choose: 0,
    selectorVisible: false,
    widHeight: 1200,
    limit: 10,
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
  more: function (e) {
    if(e.target.dataset.id == 'x'){
        this.setData({
          limit: this.data.limit+10
        });
        this.getdata(2,0)
        this.getheight
    }else{
      this.setData({
        limit: this.data.limit+10
      });
      this.getdata(1,0)
      this.getheight
    }
  },
  choose: function(e){
    this.setData({
      choose: e.target.dataset.id,
    });
    if(this.data.currentTab){
      this.getdata(1,e.target.dataset.id)
    }else{
      this.getdata(2,e.target.dataset.id)
    }
  },
  // 当用户选择了组件中的城市之后的回调函数
  onSelectCity(e) {
    this.setData({
      locationName: e.detail.city.fullname
    });
    wx.setStorageSync('location', e.detail.city.fullname)
    this.getdata(2,6)
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
  getdata(i,t) {
    wx.request({
      url: 'https://api.xunhuiwang.cn/api/v1/pub/lost/list',
      header: { 'Authorization': wx.getStorageSync('token') },
      data: {
        address: this.data.locationName,
        type: i,
        cate: t,
        limit: this.data.limit,
        page: 1
      },
      success: (res) => {
        if (i == 1) {
          this.setData({
            slist: res.data.data.items,
            snum: res.data.data.total
          })
          wx.setStorageSync('slist', res.data.data.items)
        } else {
          this.setData({
            xlist: res.data.data.items,
            xnum: res.data.data.total
          })
          wx.setStorageSync('xlist', res.data.data.items)
        }
        console.log(res.data)
      },
      complete: function (res) {
        wx.showToast({
          title: "获取成功",
          icon: "success",
          duration: 1000
        });
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    if(this.data.currentTab == 0){
      var i=2 //寻物启事
    }else{
      var i=1
    }
    this.getdata(i,0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  onLoad: function (optins) {
    this.getdata(1,0)
    this.getdata(2,0)
  },
  onReady: function () {
    var that = this
    setTimeout(function() {
      that.getheight()
      }, 100)
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
