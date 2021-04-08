// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  /**
   * 用户登入方法，如果用户未登入则会去登入，如果用户已登入则无效果
   */
  login(){
    let sessionFlag = false;//Session过期判断标志位
    wx.checkSession({
      success: () => {
        sessionFlag = false;
      },
      fail: () => {
        sessionFlag = true;
      },
      complete: () => {
        if(!this.userData.userLoginFlag || this.userData.userName == null) {
          sessionFlag = true;
        }
        if(sessionFlag)
        {
          wx.login({
            success: (res) => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              // wx.showToast({
              //   title: "欢迎回来[ XXX ]",
              //   icon: "none",
              //   duration: 1000
              // });
              // this.userData.userLoginFlag = true;
              // this.userData.userName = "XXX";
              wx.request({
                url: "http://106.52.255.36/api/v1/pub/wx/login",
                method: "POST",
                data: {
                  "code": res.code
                },
                success: (res) => {
                  console.log(res);
                },
                fail: (res) => {
                  this.cleanUserData();
                },
                complete: () => {
                  if(!this.userData.userLoginFlag || this.userData.userName == null) {
                    let Pages = getCurrentPages();
                    //如果当前页是 发布 或 我的 这二个页面则跳转前要先切回首页[不能让用户返回时留在这二个页面里]
                    if(Pages.length > 0 && (Pages[Pages.length-1].route == "pages/post/post" || Pages[Pages.length-1].route == "pages/me/me")) {
                      wx.switchTab({
                        url: "/pages/index/index"
                      });
                    }
                    wx.showModal({
                      title: "登入失败",
                      content: "请尝试重新进入",
                      showCancel: false,
                      confirmText: "我知道了"
                    });
                  }
                }
              });
            },
            fail: (res) => {
              this.cleanUserData();
            },
            complete: () => {
              if(!this.userData.userLoginFlag || this.userData.userName == null) {
                let Pages = getCurrentPages();
                //如果当前页是 发布 或 我的 这二个页面则跳转前要先切回首页[不能让用户返回时留在这二个页面里]
                if(Pages.length > 0 && (Pages[Pages.length-1].route == "pages/post/post" || Pages[Pages.length-1].route == "pages/me/me")) {
                  wx.switchTab({
                    url: "/pages/index/index"
                  });
                }
                wx.showModal({
                  title: "登入失败",
                  content: "请尝试重新进入",
                  showCancel: false,
                  confirmText: "我知道了"
                });
              }
            }
          });
        }
      }
    });
  },
  /**
   * 清空UserData
   */
  cleanUserData() {
    this.userData.userLoginFlag = false;
    this.userData.userName = null;
  },
  userData: {
    userLoginFlag: false,
    userName: null
  },
  globalData: {
    userInfo: null
  }
})
