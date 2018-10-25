import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
     latitude: 0,//纬度 
    longitude: 0,//经度 
    speed: 0,//速度 
    accuracy: 16,//位置精准度 
    markers: [], 
    covers: [], 
  },
   getlocation: function () { 
      var markers = [{ 
       latitude: 31.23, 
       longitude: 121.47, 
       name: '浦东新区', 
       desc: '我的位置'
      }] 
      var covers = [{ 
       latitude: 31.23, 
       longitude: 121.47, 
       iconPath: '/images/close.png', 
       rotate: 0 
      }] 
      this.setData({ 
       longitude: 121.47, 
       latitude: 31.23, 
       markers: markers, 
       covers: covers, 
      }) 
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

  