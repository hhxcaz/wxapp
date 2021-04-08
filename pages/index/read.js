// pages/read/read.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    // read: [
    //   {
    //     "Id": "9d663ff1-a01f-473b-9bec-8e328e5949bd",
    //     "Name": "2021测试月考",
    //     "MarkingPapersModel": 0,
    //     "ExamState": 0,
    //     "ExamType": 1,
    //     "BeginTime": "2021-01-23",
    //     "EndTime": "2021-01-25",
    //     "Creator": "测试先留着",
    //     "CreatorPhone": "135666668888",
    //     "SubjectList": [
    //       {
    //         "ExamSubjectId": "e3e21a55-6c55-4cc3-836b-c5d255768",
    //         "ExamSubjectName": "数学",
    //         "GredeName": "初三",
    //         "SubjectState": 3
    //       }
    //     ],
    //   }
    // ],
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
  read: function (e) {
    wx.navigateTo({
      url: '../read/overview?sj=' + e.target.dataset.sj,
    })
    wx.setNavigationBarTitle({
      title: e.target.dataset.name
    })
  },
  subject: function (e) {
    wx.navigateTo({
      url: '../read/subject?title=' + e.target.dataset.sub + '&sid=' + e.target.dataset.sid,
    })
    wx.setNavigationBarTitle({
      title: e.target.dataset.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '加载中......',
    })
    wx.request({
      // url: 'https://www.lbwj.work/api/application/EngShi/GetMarkingExamInfoPageList',
      url: 'http://www.lbwj.work:801/api/application/EngShi/GetMarkingExamInfoPageList',
      data: {
        PageIndex: 1,
        PageSize: 30,
        token: wx.getStorageSync('token'),
      },
      success: (res) => {
        wx.setStorageSync('read', res.data.Data)
        console.log(res.data.Data)
      },
      complete: function (res) {
        wx.hideLoading()
        _this.setData({
          read: res.data.Data,
        })
      }
    })
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var query = wx.createSelectorQuery();
    var that = this;
    var len = (wx.getStorageSync('read')).length;
    query.select('.exam').boundingClientRect(function (rect) {
      that.setData({
        // 获取要循环标签的高度
        // height: rect.height,
        widHeight: 128 * len
      })
    }).exec();
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
    var _this = this;
    wx.showLoading({
      title: '加载中......',
    })
    wx.request({
      url: 'http://www.lbwj.work:801/api/application/EngShi/GetMarkingExamInfoPageList',
      // url: 'https://www.lbwj.work/api/application/EngShi/GetMarkingExamInfoPageList',
      data: {
        PageIndex: 1,
        PageSize: 30,
        token: wx.getStorageSync('token'),
      },
      success: (res) => {
        wx.setStorageSync('read', res.data.Data)
      },
      complete: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        _this.setData({
          read: res.data.Data,
        })
      }
    })
    var query = wx.createSelectorQuery();
    var len = (wx.getStorageSync('read')).length;
    query.select('.exam').boundingClientRect(function (rect) {
      _this.setData({
        // 获取要循环标签的高度
        // height: rect.height,
        widHeight: 128 * len
      })
    }).exec();
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