import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
 
  },
  //事件处理函数
  preventTouchMove:function(e) {

  },

  onLoad(options){
    const self = this;
    
    self.getMemberInfo()
  },
 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  getMemberInfo(){
    const self  = this;
    const postData = {
      car_num:'陕AF38T6',
      token:wx.getStorageSync('token'),  
    };
    const callback = (res)=>{
      if(res){
        self.data.mainData = res
      }else{
        api.showToast('网络故障','none')
      };
      self.setData({
        web_mainData:self.data.mainData
      })
    }
    api.getMemberInfo(postData,callback)
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
 
})

  