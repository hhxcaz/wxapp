// pages/me/me.js
Page({

  data: {
    avatarUrl: getApp().userData.avatarUrl,
    nickName: getApp().userData.nickName,
    tel: getApp().userData.phone,
    switch1Checked: getApp().userData.ai,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  xdata: function (a) {
    wx.request({
      url: 'https://api.xunhuiwang.cn/api/v1/pri/user/tel',
      header: { 'Authorization': wx.getStorageSync('token') },
      method: 'POST',
      data: {
        ai: a
      },
      success: (res) => {
        console.log(res.data);
      },
      complete: () => {
        wx.request({
          url: 'https://api.xunhuiwang.cn/api/v1/pri/user/info',
          header: { 'Authorization': wx.getStorageSync('token') },
          method: 'GET',
          success: (res) => {
            getApp().updateUserData(res.data.data);
            this.UpdateUserData();
          }
        });
      }
    });
  },
  record: function () {
    wx.navigateTo({
      url: '../me/history'
    })
  },
  ai: function(e){
    let that = this
    if(e.detail.value){
      wx.showModal({
        title: "温馨提示", 
        content: "打开AI后，系统可能会匹配到潜在的相似物品，并推送通知", 
        cancelText: "算了",
        confirmText: "确定",
        success: function (res) {
          if (res.cancel) { //点击取消
            that.xdata(false);
          }
          else {
            that.xdata(true);
          }
       },
      });
    }
    else {
      that.xdata(false);
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().login().then(() => { this.UpdateUserData(); });//每次显示页面都去执行一下登入方法，如果未登入则会登入，如果已登入则无效果，如果登入失败则弹出登入失败提示
  },
  /**
   * 重新加载 UserData 的数据信息
   * (由于login的异步原因可能导致UserData在login结束后要重新加载)
   * (如果更新了UserData的数据则也要调用该方法重新加载UserData)
   */
  UpdateUserData() {
    this.setData({
      avatarUrl: getApp().userData.avatarUrl,
      nickName: getApp().userData.nickName,
      tel: getApp().userData.phone,
      switch1Checked: getApp().userData.ai,
    });
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