Page({
  data: {
    photoList: [],
    num: 160,
    snum: 160,
    currentTab: 0,
    xinfo: '',
    sinfo: '',
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
      snum: 160 - e.detail.value.length,
      sinfo: e.detail.value
    })
  },
  /**
   * 自定义子组件更新 PhotoList 参数
   * @param {*} e 
   */
  updatePhotoList: function (e) {
    this.setData({
      photoList: e.detail.photoList
    });
  },
  xpost: function () {
    let _this = this;
    if (this.data.xinfo == '') {
      wx.showToast({
        title: "尚未填写发布内容",
        icon: "none",
        duration: 1000
      });
    } else {
      this.waitUpdateFile().then(() => {
        wx.showLoading({ title: '正在发布......' });
        var images = [];
        for (let a = 0; a < this.data.photoList.length; a++) {
          if (this.data.photoList[a].realAddress) {
            images.push(this.data.photoList[a].url);
          }
        }
        let Flag = false;
        wx.request({
          url: 'https://api.xunhuiwang.cn/api/v1/pri/lost/publish',
          method: 'POST',
          header: {
            'Authorization': wx.getStorageSync('token')
          },
          data: {
            intro: this.data.xinfo,
            address: this.data.locationName,
            image: images.toString(),
            categoryId: this.data.index + 1,
            reward: this.data.money,
            type: 2
          },
          success: (res) => {
            console.log(res.data);
            Flag = res.data.success;
          },
          complete: function () {
            wx.hideLoading();
            if(Flag) {
              new Promise((resolve) => {
                if(getApp().userData.ai) {
                  wx.showModal({
                    title: "您已打开了AI寻物", 
                    content: "请同意我们给您推送通知，否则将会关闭AI寻物功能", 
                    showCancel: false,
                    confirmText: "我知道了",
                    success: function (res) {
                      console.log(res);
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
                                getApp().updateUserData_AI(false);
                              }else if(moIdState === 'reject'){
                                console.log("拒绝消息推送");
                                getApp().updateUserData_AI(false);
                              }else if(moIdState === 'ban'){
                                console.log("已被后台封禁");
                                getApp().updateUserData_AI(false);
                              }
                              resolve();
                            }else {
                              // 当用户没有点击 ’总是保持以上选择，不再询问‘  按钮。那每次执到这都会拉起授权弹窗
                              wx.requestSubscribeMessage({   // 调起消息订阅界面
                                tmplIds: ["FIYygnDaIsG0b3k4C8bpptGgs2xPrW3vWOSOrzshuXo"],
                                success (res) { 
                                  switch(res.FIYygnDaIsG0b3k4C8bpptGgs2xPrW3vWOSOrzshuXo) {
                                    case "accept":
                                      console.log('订阅消息 用户同意');
                                      wx.request({
                                        url: 'https://api.xunhuiwang.cn/api/v1/pub/message/send',
                                        header: { 'Authorization': wx.getStorageSync('token') },
                                        method: 'POST',
                                        data: {
                                          address: _this.data.locationName,
                                          contactWay: getApp().userData.phone,
                                          nickname: getApp().userData.nickName,
                                          remark: "您的失物已被找回",
                                          template_id: "FIYygnDaIsG0b3k4C8bpptGgs2xPrW3vWOSOrzshuXo",
                                          time: "2020-02-02 00:00:00",
                                          touser: getApp().userData.userName
                                        },
                                        success: (res) => {
                                          console.log(res);
                                        }
                                      });
                                      break;
                                    case "reject":
                                      console.log('订阅消息 用户拒绝');
                                      getApp().updateUserData_AI(false);
                                      break;
                                    //剩下的是后台封禁等啥的判断，直接统一处理为false
                                    default:
                                      console.log('订阅消息 失败');
                                      getApp().updateUserData_AI(false);
                                      break;
                                  }
                                  resolve();
                                },
                                fail (er){
                                  console.log("订阅消息 失败");
                                  console.log(er);
                                  getApp().updateUserData_AI(false);
                                  resolve();
                                }
                              });
                            }
                          }else {
                            console.log("订阅消息总开关为关闭状态");
                            getApp().updateUserData_AI(false);
                            resolve();
                          }
                        },
                        fail: function(error){
                          console.log(error);
                          getApp().updateUserData_AI(false);
                          resolve();
                        },
                      });
                   },
                  });
                }
                else {
                  resolve();
                }
              }).then(() => {
                wx.showToast({
                  title: "恭喜，发布成功！",
                  icon: "success",
                  duration: 1000
                });
                setTimeout(function() {
                  wx.switchTab({
                    url: '../index/index'
                  })
                  }, 1000);
              });
            }
            else {
              wx.showToast({
                title: "发布失败！",
                icon: "error",
                duration: 1000
              });
            }
          }
        });
      });
    }
  },
  waitUpdateFile: function () {
    let promiseList = [];
    //wx.uploadFile 接口每次只支持一张图片
    for (let a = 0; a < this.data.photoList.length; a++) {
      if (!this.data.photoList[a].realAddress) {
        let promise = new Promise((resolve) => {
          wx.uploadFile({
            url: 'https://api.xunhuiwang.cn/api/v1/pri/alioss/upload',
            header: {
              'Authorization': wx.getStorageSync('token')
            },
            filePath: this.data.photoList[a].url,
            name: "file",
            success: (res) => {
              res = JSON.parse(res.data).data;
              this.data.photoList[a].url = res.url;
              this.data.photoList[a].realAddress = true;
            },
            complete: (res) => {
              this.setData({
                photoList: this.data.photoList
              });
              resolve();
            }
          });
        });
        promiseList.push(promise);
      }
    }
    return Promise.all(promiseList);
  },
  spost: function () {
    if (this.data.sinfo == '') {
      wx.showToast({
        title: "尚未填写发布内容",
        icon: "none",
        duration: 1000
      });
    } else {
      this.waitUpdateFile().then(() => {
        wx.showLoading({ title: '正在发布......' });
        var images = [];
        for (let a = 0; a < this.data.photoList.length; a++) {
          if (this.data.photoList[a].realAddress) {
            images.push(this.data.photoList[a].url);
          }
        }
        let Flag = false;
        wx.request({
          url: 'https://api.xunhuiwang.cn/api/v1/pri/lost/publish',
          method: 'POST',
          header: {
            'Authorization': wx.getStorageSync('token')
          },
          data: {
            intro: this.data.sinfo,
            address: this.data.locationName,
            image: images.toString(),
            categoryId: this.data.index + 1,
            type: 1
          },
          success: (res) => {
            console.log(res.data);
            Flag = res.data.success;
          },
          complete: function () {
            wx.hideLoading();
            if(Flag) {
              wx.showToast({
                title: "恭喜，发布成功！",
                icon: "success",
                duration: 1000
              });
              setTimeout(function() {
                wx.switchTab({
                  url: '../index/index'
                })
                }, 1000);
            }
            else {
              wx.showToast({
                title: "发布失败！",
                icon: "error",
                duration: 1000
              });
            }
          }
        });
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().login(); //每次显示页面都去执行一下登入方法，如果未登入则会登入，如果已登入则无效果，如果登入失败则弹出登入失败提示
    if (wx.getStorageSync('location') !== '') {
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
  onUnload: function () { },

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