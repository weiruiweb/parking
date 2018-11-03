import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    img1:0,
    text: '这是一条会滚动的文字滚来滚去的文字跑马灯，哈哈哈哈哈哈哈哈',
    marqueePace: 1,
    marqueeDistance: 0,
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',
    interval: 20,

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
    newOil:false
  },




  tapSpecBtn: function (e) {
    // 特殊键盘事件（删除和完成）
    var that = this;
    if (that.data.flag) {
      return false
    }
    var btnIndex = e.target.dataset.index;
    var textCarNum = that.data.textArr.join("");
    that.setData({
      textCarNum:textCarNum
    });
    console.log(btnIndex)
    if (btnIndex == 0) {
      //说明是完成事件
     // var carreg = /^(([\u4e00-\u9fa5][a-zA-Z]|[\u4e00-\u9fa5]{2}\d{2}|[\u4e00-\u9fa5]{2}[a-zA-Z])[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/;
    //  new Regex(@"^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$", RegexOptions.Compiled);
      var carreg = /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/;
      var carreg1 = /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{6}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{6}[DdFf])$/;
      if (!carreg.test(textCarNum)&&!carreg1.test(textCarNum)) {
        wx.showToast({
          title: '车牌号不正确',
          icon: 'success',
          mask: true,
          image: '/images/close.png',
          duration: 2000
        })
      } else {
        that.setData({
          flag: true,
          isKeyboard: false,
          isFocus: false
        });
      }
    }
  },

  showKeyboard: function () {
    //输入框显示键盘状态
    var that = this;
    that.setData({
      isFocus: true,
      isKeyboard: true,
    })
  },

  hideKeyboard: function () {
    //点击页面隐藏键盘事件
    var that = this;
    if (that.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (that.data.textValue) {
        that.setData({
          isKeyboard: false
        })
      } else {
        that.setData({
          isKeyboard: false,
          isFocus: false,
        })
      }
    }else{
      var that = this;
    that.setData({
      isFocus: true,
      isKeyboard: true,
    })
    }
  },

  tapKeyboard: function (e) {
    //键盘事件
    var that = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    if (tapVal == "巛") {
      //说明是删除
      that.data.textArr.pop();
      if (that.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = that.data.keyboard1;
      } else if (that.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        this.keyboardValue = that.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = that.data.keyboard2;
      }
      that.data.textValue = that.data.textArr.join("");

      that.setData({
        textValue:that.data.textArr,
        textCarNum: that.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum,
      })
      return false
    }

    if (that.data.textArr.length >= 8) {
      return false;
    }
    that.data.textArr.push(tapVal);
    
    console.log(that.data.textArr)

    that.setData({
      textCarNum:that.data.textArr.join(""),
      textValue: that.data.textArr,
      keyboardValue: that.data.keyboard2,
      specialBtn: true,
    })
    if (that.data.textArr.length > 1) {
      //展示数字键盘
      that.setData({
        tapNum: true
      })
    }
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var that = this;
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    that.data.keyboard1 = that.data.keyboard1.split('')
    that.data.keyboard2 = that.data.keyboard2.split('')
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

  newOil(){
    const self = this;
    self.data.newOil = !self.data.newOil
    self.setData({
      web_newOil:self.data.newOil
    })
  },

  onLoad(options) {
    const self = this;
    console.log(self.data.img1);
    var length = self.data.text.length * self.data.size;
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    self.setData({
      web_newOil:self.data.newOil,
      img1:self.data.img1,
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : self.data.marquee2_margin
    });
    self.run2();
  },


  run2: function () {
    var self = this;
    var interval = setInterval(function () {
      if (-self.data.marqueeDistance2 < self.data.length) {
        self.setData({
          marqueeDistance2: self.data.marqueeDistance2 - self.data.marqueePace,
          marquee2copy_status: self.data.length + self.data.marqueeDistance2 <= self.data.windowWidth + self.data.marquee2_margin,
        });
      } else {
        if (-self.data.marqueeDistance2 >= self.data.marquee2_margin) {
          self.setData({
            marqueeDistance2: self.data.marquee2_margin
          });
          clearInterval(interval);
          self.run2();
        } else {
          clearInterval(interval);
          self.setData({
            marqueeDistance2: -self.data.windowWidth
          });
          self.run2();
        }
      }
    }, self.data.interval);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  