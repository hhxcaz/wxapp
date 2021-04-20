Page({
  data: {
    num: 160,
    snum: 160,
    currentTab: 0,
    selectorVisible: false,
    selectData: ['手机数码', '卡证钱包', '宠物', '其他'],
    index: 0, //选择的下拉列表下标
    locationName: '南宁市'
  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
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
  money: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  cal: function (e) {
    this.setData({
      num: 160 - e.detail.value.length,
      xinfo: e.detail.value
    })
  },
  cals: function (e) {
    this.setData({
      num: 160 - e.detail.value.length
    })
  },
  xpost: function () {
    console.log(this.data.money)
    wx.showLoading({
      title: '正在发布......',
    })
    wx.request({
      url: 'https://106.52.255.36/api/v1/pri/lost/publish',
      method:'POST',
      header: { 
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        intro: this.data.xinfo,
        address: this.data.locationName,
        image: '',
        categoryId: this.data.index,
        reward: this.data.money,
        type: 2
      },
      success: (res) => {
        console.log(res.data)
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },
  spost: function () {
    console.log(this.data.money)
    wx.showLoading({
      title: '正在发布......',
    })
    wx.request({
      url: 'https://106.52.255.36/api/v1/pri/lost/publish',
      method:'POST',
      header: { 
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        intro: this.data.xinfo,
        address: this.data.locationName,
        image: '',
        categoryId: this.data.index,
        type: 1
      },
      success: (res) => {
        console.log(res.data)
      },
      complete: function (res) {
        wx.hideLoading()
      }
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
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().login(); //每次显示页面都去执行一下登入方法，如果未登入则会登入，如果已登入则无效果，如果登入失败则弹出登入失败提示
    if(wx.getStorageSync('location')!==''){
      this.setData({
        locationName: wx.getStorageSync('location')
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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