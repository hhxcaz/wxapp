// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  /**
   * 用户登入方法，如果用户未登入则会去登入，如果用户已登入则无效果，如果用户不存在则弹窗询问用户是否注册
   */
  login(){
    let sessionFlag = false;//Session过期判断标志位
    wx.checkSession({
      success: () => {
        sessionFlag = false;
      },
      fail: () => {
        sessionFlag = true;
        this.cleanUserData();
      },
      complete: () => {
        if(!this.userData.userLoginFlag || this.userData.nickName == null) {
          sessionFlag = true;
          this.cleanUserData();
        }
        if(sessionFlag)
        {
          let code = null;
          wx.login({
            success: (res) => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              code = res.code;
            },
            fail: (res) => {
              this.cleanUserData();
            },
            complete: () => {
              if(code != null) {
                let result = null;//后端返回结果
                wx.request({
                  url: "https://106.52.255.36/api/v1/pub/wx/login",
                  method: "POST",
                  data: {
                    "code": code
                  },
                  success: (res) => {
                    result = res.data;
                  },
                  fail: (res) => {
                    this.cleanUserData();
                  },
                  complete: () => {
                    if(result != null) {
                      if(result.success) {
                        this.userData.userLoginFlag = true;
                        this.userData.admin = result.data.user.admin;
                        wx.setStorageSync('token', result.data.token);
                        this.userData.nickName = result.data.user.nickname;
                        this.userData.avatarUrl = result.data.user.avatar;
                        this.showWelcomeToast("欢迎回来[ "+this.userData.nickName+" ]");
                        return;
                      }
                      //用户不存在则弹窗询问用户是否注册
                      if(result.code == 2007) {
                        //wx.getUserProfile必须由用户点击手势触发，所以必须要由用户点击是否需要注册
                        wx.showModal({
                          title: "当前账号尚未注册",
                          content: "是否同意注册账号？",
                          confirmText: "同意",
                          success: (res) => {
                            if(res.confirm) {
                              this.register();
                            }
                            else {
                              this.cleanUserData();
                              this.showRegisterErrorModal("未同意注册账号");
                            }
                          },
                          fail: (res) => {
                            this.cleanUserData();
                          }
                        });
                        return;
                      }
                    }
                    this.showLoginErrorModal("请尝试重新进入");
                  }
                });
              }
              else {
                this.showLoginErrorModal("凭证获取失败，请检查网络");
              }
            }
          });
        }
      }
    });
  },
  /**
   * 用户注册方法，将会弹窗询问用户是否给予个人信息，然后通过给予的个人信息注册
   * 当用户注册成功时将会当作已登入 [数据信息这时用的是通过微信获取到的，后续数据信息将由后端的为准]
   */
  register() {
    let userInfoResult = null;//用户信息回传
    wx.getUserProfile({
      lang: "zh_CN",
      desc: "我们需要您的个人信息注册账号",
      success: (res) => {
        userInfoResult = res;
      },
      fail: (res) => {
        userInfoResult = null;
        this.cleanUserData();
      },
      complete: () => {
        if(userInfoResult != null) {
          let code = null;
          wx.login({
            success: (res) => {
              code = res.code;
            },
            fail: (res) => {
              this.cleanUserData();
            },
            complete: () => {
              if(code != null) {
                let result = null;//后端返回结果
                wx.request({
                  url: "https://106.52.255.36/api/v1/pub/wx/register",
                  method: "POST",
                  data: {
                    "code": code,
                    "userInfo": userInfoResult.userInfo
                  },
                  success: (res) => {
                    result = res.data;
                  },
                  fail: (res) => {
                    this.cleanUserData();
                  },
                  complete: () => {
                    if(result != null) {
                      if(result.success) {
                        this.userData.userLoginFlag = true;
                        this.userData.admin = false;
                        this.userData.nickName = userInfoResult.userInfo.nickName;
                        wx.setStorageSync('token', result.data.token);
                        this.userData.avatarUrl = userInfoResult.userInfo.avatarUrl;
                        this.showWelcomeToast("欢迎您[ "+this.userData.nickName+" ]");
                        return;
                      }
                    }
                    this.showRegisterErrorModal("请尝试重新注册");
                  }
                });
              }
              else {
                this.showRegisterErrorModal("凭证获取失败，请检查网络");
              }
            }
          });
        }
        else {
          this.showRegisterErrorModal("未同意获取信息，无法注册账号");
        }
      }
    });
  },
  /**
   * 显示登入失败弹窗
   * @param {String} TpiMessage 提示信息 
   */
  showLoginErrorModal(TpiMessage) {
    this.switchIndex();
    wx.showModal({
      title: "登入失败",
      content: TpiMessage,
      showCancel: false,
      confirmText: "我知道了"
    });
  },
  /**
   * 显示注册失败弹窗
   * @param {String} TpiMessage 提示信息 
   */
  showRegisterErrorModal(TpiMessage) {
    this.switchIndex();
    wx.showModal({
      title: "注册失败",
      content: TpiMessage,
      showCancel: false,
      confirmText: "我知道了"
    });
  },
  /**
   * 显示 欢迎 Toast
   * @param {String} Message 欢迎信息
   */
  showWelcomeToast(Message) {
    wx.showToast({
      title: Message,
      icon: "none",
      duration: 1000
    });
  },
  /**
   * 当前页如果是 发布 或 我的 则切回主页
   * (用户点击 发布 或者 我的 时触发登入/注册 为了让用户 登入/注册 失败时不停留在这二个页面所以切回主页)
   */
  switchIndex() {
    if(!this.userData.userLoginFlag || this.userData.nickName == null) {
      let Pages = getCurrentPages();
      //如果当前页是 发布 或 我的 这二个页面则跳转前要先切回首页[不能让用户返回时留在这二个页面里]
      if(Pages.length > 0 && (Pages[Pages.length-1].route == "pages/post/post" || Pages[Pages.length-1].route == "pages/me/me")) {
        wx.switchTab({
          url: "/pages/index/index"
        });
      }
    }
  },
  /**
   * 清空UserData
   */
  cleanUserData() {
    this.userData.userLoginFlag = false;
    this.userData.admin = false;
    this.userData.nickName = null;
    this.userData.avatarUrl = null;
  },
  userData: {
    userLoginFlag: false,
    admin: false,
    nickName: null,
    avatarUrl: null
  },
  globalData: {
    userInfo: null
  }
})
