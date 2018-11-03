import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,
   isLoadAll:false,
   carData:[],
   parkData:[]
  },

  onLoad(options){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    
    self.getAddressData();
  },

  tab(e){
    const self = this;
    if(e.currentTarget.dataset.id==1){
      self.orderGet(true);
    };
    self.setData({
      currentId:e.currentTarget.dataset.id
    })
  },

  getAddressData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
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
        api.showToast('没有停车信息','none');
      };
      self.setData({
        web_carData:self.data.carData,
      });
      self.GetCarInfo()
    };
    api.addressGet(postData,callback);
  },

  GetCarInfo(){
    const self  = this;
    const postData = {
      token:wx.getStorageSync('token'),
      data:{
        carCode:self.data.carData.name,
      },
      url:"GetCarInfo" 
    };
    const callback = (res)=>{
      console.log(res)
      if(res.resCode==0){
        self.data.mainData = res,
        self.data.buttonClicked=false
      }else{
        api.showToast('没有停车信息','none')
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
        web_time:api.formatSeconds(self.data.mainData.parkingSeconds)
      });
    }
    api.GetCarInfo(postData,callback)
  },

  orderGet(){
    const self  = this;
    const postData = {
      paginate:api.cloneForm(self.data.paginate),
      token:wx.getStorageSync('token'),
    };
    postData.searchItem = {
      thirdapp_id:12,
      type:5,
      user_no:wx.getStorageSync('info').user_no
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.parkData.push.apply(self.data.parkData,res.info.data);   
      }else{
        isLoadAll:true
        api.showToast('没有更多了','none')
      }
      wx.hideLoading();
      self.setData({
        web_parkData:self.data.parkData,
      });
    }
    api.logGet(postData,callback)
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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

  