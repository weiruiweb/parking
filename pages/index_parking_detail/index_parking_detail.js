import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
	currentId:0,
	currentId1:0,
	buttonClicked:true,
	useScore:false,
  	maxScore:'',
  	paidMoney:''
  },

  onLoad(options){

    const self = this;
    wx.showLoading();
    console.log(options);
    token.getUserInfo();
    self.data.carCode = options.carCode;
    self.GetCarInfo();
    
  },


   getMemberInfo(){
    const self  = this;
    const postData = {
      car_num:self.data.carCode,
      token:wx.getStorageSync('token'),  
    };
    const callback = (res)=>{
      if(res.code==0){
        self.data.memberData = res;
        self.countMoney();
      }else{
        api.showToast('搜索不到会员信息','none')
        setTimeout(function(){
            wx.navigateBack({
              delta: 1
            });
          },1000);
      };
      self.setData({
        web_memberData:self.data.memberData
      })
    }
    api.getMemberInfo(postData,callback)
  },





	  GetCarInfo(){
	    const self  = this;
	    const postData = {
	      token:wx.getStorageSync('token'),
	      data:{
	        carCode:self.data.carCode,
	      },
	      url:"GetCarInfo" 
	    };
	    const callback = (res)=>{
	      console.log(res)
	      if(res.resCode==0){
	        self.data.mainData = res,
	        self.data.buttonClicked=false
	      }else{
	        api.showToast('搜索不到车辆信息','none')
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            });
          },1000);
	      };
	      wx.hideLoading();

	      self.setData({
	        web_mainData:self.data.mainData,
	        web_time:api.formatSeconds(self.data.mainData.parkingSeconds)
	      });
	      
	      self.getMemberInfo()
	    }
	    api.GetCarInfo(postData,callback)
	  },




    pay(order_id){
      const self = this;
      if(self.data.buttonClicked){
        api.showToast('数据有误','none')
      }
      wx.showLoading();
      const postData = {
        token:wx.getStorageSync('token'),
        data:{
          payAfter:{
            data:{
              carCode:self.data.carCode,
              chargeMoney:self.data.mainData.chargeMoney,
              paidMoney:self.data.mainData.paidMoney,
              JMMoney:self.data.mainData.chargeMoney - self.data.mainData.paidMoney,
              payTime:self.data.mainData.payTime,
              chargeType:11,
              chargeSource:"3"
            },
            url:"AddChargeInfo"
          }
        },
      };
      if(self.data.mainData.paidMoney!=0){
        postData.wxPay=self.data.mainData.paidMoney,
        postData.wxPayStatus=0
      };
      const callback = (res)=>{
        console.log(res)
        if(res.solely_code==100000){
          api.showToast('支付成功','none')
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              });
            },1000);    

          if(self.data.mainData.paidMoney!=0){
              const payCallback=(payData)=>{
              if(payData==1){
                api.showToast('支付成功','none')
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  });
                },1000);     
              }else{
                api.showToast('调起微信支付失败','none')
              };
            api.realPay(res.info,payCallback);    
          }
        };

      }else{
        api.showToast('支付失败','none')
      }  
    }
    api.directPay(postData,callback);
  },

  changePayType(e){
  	const self = this;
  	var ratio = wx.getStorageSync('info').thirdApp.standard;
  	
  	if(self.data.mainData.paidMoney==self.data.mainData.chargeMoney){
  		self.data.mainData.paidMoney = self.data.mainData.chargeMoney - (self.data.maxScore/ratio);
  	}else if(self.data.mainData.paidMoney==(self.data.mainData.chargeMoney - (self.data.maxScore/ratio))){
  		self.data.mainData.paidMoney = self.data.mainData.chargeMoney;
  	};
  	self.setData({
  		web_mainData:self.data.mainData,
  	});
  },

  countMoney(){
  	const self = this;

  	var ratio = wx.getStorageSync('info').thirdApp.standard;
  	console.log(self.data.mainData.paidMoney,ratio);
  	if(self.data.memberData.score<self.data.mainData.paidMoney*ratio){
  		self.data.maxScore = self.data.memberData.score;
  	}else{
  		self.data.maxScore = self.data.mainData.paidMoney*ratio
  	};
  	
  	console.log(self.data.mainData.paidMoney)
  	self.setData({
  		web_maxScore:self.data.maxScore,
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

  