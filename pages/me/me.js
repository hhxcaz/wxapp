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
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    phone: {
      showModal: false,
      timerNum: 60,
      theString: "获取验证码",
      phoneNum: "",
      codeNum: ""
    }
  },
  /**
   * 把修改 phone 数据的方法包装起来，这样后续调用不用占那么多行
   * @param {*} showModal 
   * @param {*} timerNum 
   * @param {*} theString 
   * @param {*} phoneNum 
   * @param {*} codeNum 
   */
  updatePhone(showModal,timerNum,theString,phoneNum,codeNum) {
    this.setData({
      phone: {
        showModal: showModal,
        timerNum: timerNum,
        theString: theString,
        phoneNum: phoneNum,
        codeNum: codeNum
      }
    });
  },
  showToast(message,time) {
    wx.showToast({
      title: message,
      icon: "none",
      duration: time
    });
  },
  phoneShowModal() {
    this.updatePhone(true,this.data.phone.timerNum,this.data.phone.theString,this.data.phone.phoneNum,this.data.phone.codeNum);
  },
  phoneOnCancel() {
    this.updatePhone(false,this.data.phone.timerNum,this.data.phone.theString,this.data.phone.phoneNum,this.data.phone.codeNum);
  },
  phoneValueUpdate(e) {
    this.updatePhone(this.data.phone.showModal,this.data.phone.timerNum,this.data.phone.theString,e.detail.phoneNum,this.data.phone.codeNum);
  },
  phoneOnConfirm() {
    let message = "未知错误";
    let icon = "none";
    let _this = this;
    if(this.data.phone.phoneNum.length != 11) {
      this.showToast("手机号码格式不正确，请检查",2000);
    }
    else {
      wx.request({
        url: 'https://api.xunhuiwang.cn/api/v1/pri/user/tel',
        header: { 'Authorization': wx.getStorageSync('token') },
        method: 'POST',
        data: {
          phone: this.data.phone.phoneNum
        },
        success: (res) => {
          if(res.data.success) {
            message = "手机号码更新成功";
            this.updatePhone(false,this.data.phone.timerNum,this.data.phone.theString,"","");
          }
          else {
            message = res.data.message;
            icon = "error";
          }
        },
        complete: () => {
          wx.showToast({
            title: message,
            icon: icon,
            duration: 2000
          });
          setTimeout(function () {
            _this.updateUserData();
        }, 2000);
        }
      });
    }
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  record: function () {
    wx.navigateTo({
      url: '../history/history'
    })
  },
  ai: function(e){
    let that = this;
    if(e.detail.value){
      wx.showModal({
        title: "温馨提示", 
        content: "打开AI后，系统可能会匹配到潜在的相似物品，并推送通知", 
        cancelText: "算了",
        confirmText: "确定",
        success: function (res) {
          if (res.cancel) { //点击取消
            getApp().updateUserData_AI(false);
          }
          else {
            getApp().updateUserData_AI(true);
          }
       },
      });
    }
    else {
      getApp().updateUserData_AI(false);
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
    getApp().login().then(() => { this.updateUserData(); });//每次显示页面都去执行一下登入方法，如果未登入则会登入，如果已登入则无效果，如果登入失败则弹出登入失败提示
  },
  /**
   * 重新加载 UserData 的数据信息
   * (由于login的异步原因可能导致UserData在login结束后要重新加载)
   * (如果更新了UserData的数据则也要调用该方法重新加载UserData)
   */
  updateUserData() {
    getApp().updateUserInfo().then((flag) => {
      if(flag) {
        this.setData({
          avatarUrl: getApp().userData.avatarUrl,
          nickName: getApp().userData.nickName,
          tel: getApp().userData.phone,
          switch1Checked: getApp().userData.ai,
        });
      }
      else {
        getApp().login().then(() => {
          this.updateUserData();
        });
      }
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