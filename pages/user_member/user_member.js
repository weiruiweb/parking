import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
 
  },


  onLoad(options){
    const self = this;
    self.getAddressData()
  },

  getAddressData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      isdefault:1
    };
    const callback = (res)=>{
      console.log(res);
      if(res.info.data.length>0){
        self.data.carData = res.info.data[0]
      }else{
        api.showToast('无会员信息，请先绑定车牌','none')
        setTimeout(function(){
            wx.navigateBack({
              delta: 1
            });
          },1000);
      };
      self.setData({
        web_carData:self.data.carData,
      });
      self.getMemberInfo()
    };
    api.addressGet(postData,callback);
  },

  getMemberInfo(){
    const self  = this;
    const postData = {
      car_num:self.data.carData.name,
      token:wx.getStorageSync('token'),  
    };
    const callback = (res)=>{
      if(res.score){
        self.data.mainData = res;
        self.setData({
          web_mainData:self.data.mainData
        })
      }else{
        api.showToast('该车牌号未绑定会员','none',1000)
        setTimeout(function(){
          api.pathTo('/pages/register/register','redi')
        },1000);
      };
      
    }
    api.getMemberInfo(postData,callback)
  },
 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
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

  