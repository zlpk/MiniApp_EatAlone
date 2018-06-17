var utils = require('../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenwidth: 0,
    videoheight: 0,
    titleInfo: "忆往昔美食",
    foodName: "",
    searchResultVideoUrl: "",
    imageurl: "",
    materialslist: [
      {
        id: 'materials',
        name: '美食食材',
        open: false,
        pages: [
        ]
      }],
    stepslist: [
      {
        id: 'steps',
        name: '做法步骤',
        open: false,
        pages: [
        ]
      }]
  },

  materialsToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.materialslist;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      materialslist: list
    });
  },

  stepsToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.stepslist;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      stepslist: list
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var screensize = utils.getscreensize();
    this.setData({
      screenwidth: screensize.screenwidth,
      videoheight: (1080 * screensize.screenwidth) / 1920
    })
    
    var foodname = options.foodName;
    var resultsList = app.historyData.queryResultList;
    var i,j;
    var materialslist = [
      {
        id: 'materials',
        name: '美食食材',
        open: false,
        pages: [
        ]
      }];
    var stepslist = [
      {
        id: 'steps',
        name: '做法步骤',
        open: false,
        pages: [
        ]
      }];
    for (i = 0;i < resultsList.length;i++)
    {
      if(resultsList[i].title == foodname)
      {
        var materialslistpages = [];
        for (j = 0; j < resultsList[i].content.length;j++)
        {
          materialslistpages[j] = resultsList[i].content[j];
        }
        materialslist[0].pages = materialslistpages;

        var stepslistpages = [];
        for (j = 0; j < resultsList[i].steps.length;j++)
        {
          var page = {
            stepname: "第" + (j + 1).toString(10) + "步",
            stepcontent: resultsList[i].steps[j]
          }
          stepslistpages[j] = page;
        }
        stepslist[0].pages = stepslistpages;

        this.setData({
          foodName:foodname,
          searchResultVideoUrl: resultsList[i].videoUrl,
          imageurl: resultsList[i].imageSrc,
          materialslist: materialslist,
          stepslist: stepslist
          });
        break;
      }
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log("dailyupdate hide");
    this.videoContext = wx.createVideoContext('myVideo');
    this.videoContext.pause();
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

  }
})