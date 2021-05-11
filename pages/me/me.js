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
    if(this.data.phone.phoneNum.length != 11) {
      this.showToast("手机号码格式不正确，请检查",1000);
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
            this.showToast("手机号码更新成功",1000);
            this.updatePhone(false,this.data.phone.timerNum,this.data.phone.theString,"","");
          }
          else {
            this.showToast(res.data.message,1000);
          }
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
    }
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
        if(res.data.success) {
          if(a) {
            this.showToast("AI功能已打开",1000);
          }
          else {
            this.showToast("AI功能已关闭",1000);
          }
        }
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
      url: '../history/history'
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
            wx.getSetting({
              withSubscriptions: true,   //  这里设置为true,下面才会返回mainSwitch
              success: function(res){
                console.log(res);
                // 调起授权界面弹窗
                if (res.subscriptionsSetting.mainSwitch) {  // 用户打开了订阅消息总开关
                  if (res.subscriptionsSetting.itemSettings != null) {// 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
                    let moIdState = res.subscriptionsSetting.itemSettings["FIYygnDaIsG0b3k4C8bpptGgs2xPrW3vWOSOrzshuXo"];  // 用户同意的消息模板id
                    if(moIdState === 'accept'){   
                      console.log('接受了消息推送');
                      that.xdata(true);
                    }else if(moIdState === 'reject'){
                      console.log("拒绝消息推送");
                      that.xdata(false);
                    }else if(moIdState === 'ban'){
                      console.log("已被后台封禁");
                      that.xdata(false);
                    }
                  }else {
                    // 当用户没有点击 ’总是保持以上选择，不再询问‘  按钮。那每次执到这都会拉起授权弹窗
                    wx.requestSubscribeMessage({   // 调起消息订阅界面
                      tmplIds: ["FIYygnDaIsG0b3k4C8bpptGgs2xPrW3vWOSOrzshuXo"],
                      success (res) { 
                        switch(res.FIYygnDaIsG0b3k4C8bpptGgs2xPrW3vWOSOrzshuXo) {
                          case "accept":
                            console.log('订阅消息 用户同意');
                            that.xdata(true);
                            break;
                          case "reject":
                            console.log('订阅消息 用户拒绝');
                            that.xdata(false);
                            break;
                          //剩下的是后台封禁等啥的判断，直接统一处理为false
                          default:
                            console.log('订阅消息 失败');
                            that.xdata(false);
                            break;
                        }
                      },
                      fail (er){
                        console.log("订阅消息 失败");
                        console.log(er);
                        that.xdata(false);
                      }
                    });
                  }
                }else {
                  console.log("订阅消息总开关为关闭状态");
                  that.xdata(false);
                }
              },
              fail: function(error){
                console.log(error);
                that.xdata(false);
              },
            });
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