import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
      
  },
  onLoad: function () {
    const self = this;
    self.getArtData()
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:2
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['会员权益']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      wx.hideLoading();
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },

})
