import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    submitData:{
      name:'',
      phone:'',
      car_num:''
    },
    buttonCanClick:true
  },


  onLoad(options){
    const self = this;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    });
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
        self.data.submitData.car_num = res.info.data[0].name
      }
      self.setData({
        web_submitData:self.data.submitData,
      });
    };
    api.addressGet(postData,callback);
  },

  inputChange(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },

  register(){
    const self  = this;
    const postData = api.cloneForm(self.data.submitData);
    const callback = (res)=>{
      if(res.score){
        api.showToast('注册成功','none',1000)
        setTimeout(function(){
          api.pathTo('/pages/user/user','redi')
        },1000);
      }else{
        api.showToast(res.msg,'none')
      };
      self.data.buttonCanClick = true;
      self.setData({
        web_buttonCanClick:self.data.buttonCanClick
      });
    }
    api.register(postData,callback)
  },

  submit(){
    const self = this;
    self.data.buttonCanClick = false;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    });
    var phone = self.data.submitData.phone;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','fail');
         self.data.buttonCanClick = true;
          self.setData({
            web_buttonCanClick:self.data.buttonCanClick
          });
      }else{
        self.register();
      }
    }else{
      api.showToast('请补全信息','fail');
      self.data.buttonCanClick = true;
      self.setData({
        web_buttonCanClick:self.data.buttonCanClick
      });
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
