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
    mainData:[],
    sForm:{
      car_num:''
    }
    
  },


  onLoad(options){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
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


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      console.log(res);
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.addressGet(postData,callback);
  },

  tapSearch(e){
    const self = this;
    console.log(e);
    self.data.sForm.car_num = api.getDataSet(e,'car_num');
    self.setData({
      web_sForm:self.data.sForm
    })
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm
    });  
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

  