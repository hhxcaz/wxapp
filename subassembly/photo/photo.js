// subassembly/photo/photo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    photoList: {
      type: Array
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showImg(e){
      let my = this;
      wx.previewImage({
        urls: my.data.photoList,
        current: my.data.photoList[e.currentTarget.dataset.index],
        complete: function() {
          // 自定义组件向父组件传值
          my.triggerEvent('updatePhotoList', {photoList: my.data.photoList});
        }
      });
    },
    uploadImg(){
      let my = this;
      let num = 3 - this.data.photoList.length ;
      wx.chooseImage({
        count: num,//能选择的最大图片
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res){
          if(my.data.photoList.length < 3)
          {
            if(res.tempFilePaths.length < num) {
              num = res.tempFilePaths.length;
            }
            res.tempFilePaths = res.tempFilePaths.slice(0,num);
            let newPhotoList = [];
            for(let a = 0;a < res.tempFilePaths.length;a++) {
              newPhotoList[a] = {
                url: res.tempFilePaths[a],
                realAddress: false
              };
            }
            my.setData({
              photoList: my.data.photoList.concat(newPhotoList)
            });
          }
        },
        complete: function() {
          // 自定义组件向父组件传值
          my.triggerEvent('updatePhotoList', {photoList: my.data.photoList});
        }
      });
    },
    deleteImg(e){
      let nowPhotoList = [];
      for (let a = 0;a < this.data.photoList.length;a++) {
        if (a == e.currentTarget.dataset.index) {
          continue;
        }
        else {
          nowPhotoList.push(this.data.photoList[a]);
        }
      }
      this.setData({
        photoList: nowPhotoList
      });
      // 自定义组件向父组件传值
      this.triggerEvent('updatePhotoList', {photoList: this.data.photoList});
    }
  }
})
