import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    gender:0,
    isKeyboard: false,//是否显示键盘
    specialBtn: false,
    tapNum: false,//数字键盘是否可以点击
    parkingData: false,//是否展示剩余车位按钮
    isFocus: false,//输入框聚焦
    flag: false,//防止多次点击的阀门
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
    keyboard1: '粤京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵川青藏琼宁渝',
    keyboard2: '',
    keyboard2For: ['完成'],
    keyboardValue: '',
    textArr: [],
    textValue: '陕A',
    placeholder: '输入或拍照录入车牌',
    sForm:{
      name:''
    },
    newOil:false,
    buttonClick:true
  },
  onLoad: function () {
   
  },

  tapSpecBtn: function (e) {
    // 特殊键盘事件（删除和完成）
    var self = this;
    if (self.data.flag) {
      return false
    }
    var btnIndex = e.target.dataset.index;
   
  
    if (btnIndex == 0) {
      //说明是完成事件
      var carreg = /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/;
      var carreg1 = /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{6}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{6}[DdFf])$/;
      if (!carreg.test(self.data.textCarNum)&&!carreg1.test(self.data.textCarNum)) {
        wx.showToast({
          title: '车牌号不正确',
          icon: 'success',
          mask: true,
          image: '/images/close.png',
          duration: 2000
        })
      } else {
        self.setData({
          textValue:self.data.textArr,
          isKeyboard: false,
          isFocus: false
        });
      }
    }
  },

  showKeyboard: function () {
    //输入框显示键盘状态
    var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true,
    })
  },

  hideKeyboard: function () {
    //点击页面隐藏键盘事件
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (self.data.textValue) {
        self.setData({
          isKeyboard: false
        })
      } else {
        self.setData({
          isKeyboard: false,
          isFocus: false,
        })
      }
    }else{
      var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true,
    })
    }
  },

  tapKeyboard: function (e) {
    //键盘事件
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    if (tapVal == "巛") {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = self.data.keyboard1;
      } else if (self.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        this.keyboardValue = self.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = self.data.keyboard2;
      }
      self.data.textValue = self.data.textArr.join("");

      self.setData({
        textValue:self.data.textArr,
        textCarNum: self.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum,
      })
      return false
    }

    if (self.data.textArr.length >= 8) {
      return false;
    }
    if((self.data.newOil&&self.data.textArr.length<8)||self.data.textArr.length<7){
      self.data.textArr.push(tapVal);
    };
    
    
    console.log(self.data.textArr)
     self.data.textCarNum = self.data.textArr.join("");
    self.data.sForm.name = self.data.textArr.join("");
    self.setData({
      textCarNum:self.data.textCarNum
    });
    self.setData({
      textCarNum:self.data.textArr.join(""),
      textValue: self.data.textArr,
      keyboardValue: self.data.keyboard2,
      specialBtn: true,
    });

    if (self.data.textArr.length > 1) {
      //展示数字键盘
      self.setData({
        tapNum: true
      })
    }
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var self = this;
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    self.data.keyboard1 = self.data.keyboard1.split('')
    self.data.keyboard2 = self.data.keyboard2.split('')
  },


  onShow: function () {
    //生命周期函数--监听页面显示
    var self = this;
    self.setData({
      flag: false
    })
    var carno = self.data.textValue;
    if (carno.length <9) {
      self.setData({
        keyboardValue: self.data.keyboard2,
        specialBtn: true,
        tapNum: true,       
        textArr: carno.split("")
      })
    }else{
      self.setData({
        keyboardValue: self.data.keyboard1
      });
    }
  },

  submit(){
    const self = this;
    self.data.buttonClick=true;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
      if((self.data.newOil&&self.data.textArr.length==8)||self.data.textArr.length==7){
        self.addressAdd()
      }else{
        api.showToast('请输入正确的车牌','none')
      };
      
    }else{
      api.showToast('请补全信息','none');
    };
  },

  newOil(){
    const self = this;
    self.data.newOil = !self.data.newOil
    self.setData({
      web_newOil:self.data.newOil
    })
  },
  addressAdd(){
    const self = this;
    if(self.data.buttonClick==true){
      api.showToast('请稍等','none')
    };
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{
      wx.hideLoading();
      api.dealRes(data);
      setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },1000);
    };
    api.addressAdd(postData,callback);
  },

})
