var util = require('../../utils/util.js');

var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchiconsize: 24,
    searchiconcolor: "#e64340",
    loadcomplete: true,
    inputcontent: "",
    tagsNum: 0,
    tagsList:[
    ],
    queryResultList:[
    ],
    cleartouchlocation: [
    ]
  },

  inputKeyClick: function(e) {
    this.setData({inputcontent:e.detail.value})
  },

  inputblur: function(e) {
    var str = e.detail.value;
    str = util.trim(str);
    if (str.length != 0){
      var tagslist = this.data.tagsList;
      var num = this.data.tagsNum;
      tagslist[num] = {
        id: num.toString(),
        tagcontent: str,
        clearcolor: "gray"
      }
      this.setData({ tagsList: tagslist})
      this.setData({ tagsNum: num+1})
    }
    this.setData({ inputcontent: "" })
  },

  cleartouchstart: function(e) {
    var location = this.data.cleartouchlocation;
    location[0] = {
      pageX: e.changedTouches[0].pageX,
      pageY: e.changedTouches[0].pageY,
    }
    this.setData({ cleartouchlocation: location})
  },
  cleartouchmove: function(e) {
    var id = e.target.id;
    var numid = parseInt(id);
    var tagslist = this.data.tagsList;
    var location = this.data.cleartouchlocation;
    var pageX = e.changedTouches[0].pageX;
    var pageY = e.changedTouches[0].pageY;
    if ((Math.abs(pageX - location[0].pageX) > 10) || (Math.abs(pageY - location[0].pageY) > 10)) {
      tagslist[numid].clearcolor = "white";
      this.setData({ tagsList: tagslist})
    }
    if ((Math.abs(pageX - location[0].pageX) <= 10) && (Math.abs(pageY - location[0].pageY) <= 10)) {
      tagslist[numid].clearcolor = "gray";
      this.setData({ tagsList: tagslist })
    }
  },
  cleartouchend: function(e) {
    var id = e.target.id;
    // console.log(id)
    var numid = 0;
    var tagsnum = this.data.tagsNum;
    var tagslist = this.data.tagsList;
    var location = this.data.cleartouchlocation;
    var pageX = e.changedTouches[0].pageX;
    var pageY = e.changedTouches[0].pageY;
    for (var i = 0; i < tagslist.length;i++) {
      if (tagslist[i].id == id) {
        numid = i;
        break;
      }
    } 
    if ((Math.abs(pageX - location[0].pageX) > 10) || (Math.abs(pageY - location[0].pageY) > 10)) {
      tagslist[numid].clearcolor = "white";
      this.setData({ tagsList: tagslist })
    }
    else {
      tagslist[numid].clearcolor = "gray";
      tagslist.splice(numid, 1);
      tagsnum = tagsnum - 1;
      this.setData({ tagsList: tagslist,tagsNum: tagsnum})
    }
  },

  searchiconclick: function() {
    var thispage = this;

    var ntag = thispage.data.tagsNum;
    if (ntag == 0) {
      thispage.setData({
        inputcontent: "",
        tagsNum: 0,
        tagsList: [
        ],
        queryResultList: [
        ],
        cleartouchlocation: [
        ]
      })
      return;
    }

    thispage.setData({
      loadcomplete: false
    })

    var tagcontent = "";
    for (var i = 0; i < ntag;i++)
    {
      tagcontent += "\"" + thispage.data.tagsList[i].tagcontent + "\"";
      if (i < (ntag-1))
        tagcontent += ",";
    }
    console.log('https://www.eatalone.cn/video?content=[' + tagcontent + "]")
    wx.request({
      url: 'https://www.eatalone.cn/video?content=['+tagcontent +"]",
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var querystatus = res.statusCode;
        if (querystatus != 200) {
          thispage.setData({
            loadcomplete: true
          })
          wx.showToast({
            title: '数据请求失败',
            icon: 'success',
            duration: 2000
          });
          return;
        }
        console.log(res.data.data);

        var querydata = res.data.data;

        var reslist = new Array();
        for(var i = 0;i < querydata.length;i++) {
          var singleres = {
            title: "",
            imageSrc: "",
            videoUrl: "",
            content: [],
            steps: []
          };
          singleres.title = querydata[i].title;
          singleres.imageSrc = querydata[i].image;
          singleres.videoUrl = querydata[i].url;
          Array.prototype.push.apply(singleres.content, querydata[i].content);
          Array.prototype.push.apply(singleres.steps, querydata[i].steps);
          reslist[i] = singleres;
        }

        thispage.setData({
          queryResultList: reslist,
          loadcomplete: true
        })
        app.historyData.queryResultList = reslist;
      },
      fail: function() {
        thispage.setData({
          loadcomplete: true
        })
        wx.showToast({
          title: '数据加载失败',
          icon: 'success',
          duration: 2000
        });
      }
    })
  },

  searchiconclickstart: function() {
    this.setData({
      searchiconsize: 20,
      searchiconcolor: "gray"
      })
  },
  searchiconclickend: function () {
    this.setData({
      searchiconsize: 24,
      searchiconcolor: "#e64340"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loadcomplete: true,
      inputcontent: "",
      tagsNum: 0,
      tagsList: [],
      queryResultList: [],
      cleartouchlocation: []
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var result = app.historyData.queryResultList;
    this.setData({queryResultList: result})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var thispage = this;

    var ntag = thispage.data.tagsNum;
    if (ntag == 0) {
      thispage.setData({
        inputcontent: "",
        tagsNum: 0,
        tagsList: [
        ],
        queryResultList: [
        ],
        cleartouchlocation: [
        ]
      })
      wx.stopPullDownRefresh();
      return;
    }

    thispage.setData({
      loadcomplete: false
    })

    var tagcontent = "";
    for (var i = 0; i < this.data.tagsList.length; i++) {
      tagcontent += "\"" + this.data.tagsList[i].tagcontent + "\"";
      if (i < (this.data.tagsList.length - 1))
        tagcontent += ",";
    }
    wx.request({
      url: 'https://www.eatalone.cn/video?content=[' + tagcontent + "]",
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var querystatus = res.statusCode;
        if (querystatus != 200) {
          thispage.setData({
            loadcomplete: true
          })
          wx.showToast({
            title: '数据加载失败',
            icon: 'success',
            duration: 2000
          });
          return;
        }

        var querydata = res.data.data;

        var reslist = new Array();
        for (var i = 0; i < querydata.length; i++) {
          var singleres = {
            title: "",
            imageSrc: "",
            videoUrl: "",
            content: [],
            steps: []
          };
          singleres.title = querydata[i].title;
          singleres.imageSrc = querydata[i].image;
          singleres.videoUrl = querydata[i].url;
          Array.prototype.push.apply(singleres.content, querydata[i].content);
          Array.prototype.push.apply(singleres.steps, querydata[i].steps);
          reslist[i] = singleres;
        }

        thispage.setData({
          queryResultList: reslist,
          loadcomplete: true
        })
        app.historyData.queryResultList = reslist;
      },
      fail: function () {
        thispage.setData({
          loadcomplete: true
        })
        wx.showToast({
          title: '数据加载失败',
          icon: 'success',
          duration: 2000
        });
      }
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 用户点击查询
   */
  formSubmit: function (e) {
  }
})