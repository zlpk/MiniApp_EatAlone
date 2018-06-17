var utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenwidth:0,  
    videoheight:0,
    loadsuccess: true,
    //loadfail: "",
    loadcomplete: false,
    foodName: "",
    dailyVideoUrl: "",
    videoImage: "",
    materialslist: [
    ],
    stepslist: [
    ]
  },

sleep(d){
    for(var t = Date.now();Date.now() - t <= d;);
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
      videoheight: (1080*screensize.screenwidth)/1920
    })
   
    var thispage = this;
    console.log(this)
    wx.request({
      url: 'https://www.eatalone.cn/video',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var querystatus = res.statusCode;
        if (querystatus != 200) {
          wx.showToast({
            title: '数据加载失败',
            icon: 'none',
            duration: 2000
          });
          thispage.setData({
            loadcomplete: true,
            loadsuccess: true,
            loadfail: false
          });
          return;
        }
        var querydata = res.data.data[0];
        var materlist = [
          {
            id: "materials",
            name: "美食食材",
            open: false,
            pages: [
            ]
          }
        ];
        Array.prototype.push.apply(materlist[0].pages, querydata.content);
        //materlist[0].pages = querydata.content;
        //console.log(materlist[0].pages);

        var stelist = [
          {
            id: "steps",
            name: "做法步骤",
            open: false,
            pages: [
            ]
          }
        ];
        for (var i = 0; i < querydata.steps.length;i++) {
          var page = {
            stepname: "第" + (i + 1).toString(10) + "步",
            stepcontent: querydata.steps[i]
          }
          stelist[0].pages.push(page);
        }

        thispage.setData({
          foodName: querydata.title,
          dailyVideoUrl: querydata.url,
          videoImage: querydata.image,
          materialslist: materlist,
          stepslist: stelist,
          loadcomplete: true,
          loadsuccess: false,
          loadfail: true
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '数据加载失败',
          icon: 'none',
          duration: 2000
        });
        thispage.setData({
          loadcomplete: true,
          loadsuccess: true,
          loadfail: false
        });
      },
      complete: function() {
        //thispage.setData({ loadcomplete: true });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
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
    var thispage = this;

    thispage.setData({
      loadsuccess: true,
      loadcomplete: false,
      foodName: "",
      dailyVideoUrl: "",
      videoImage: "",
      materialslist: [
      ],
      stepslist: [
      ]
    })

    wx.request({
      url: 'https://www.eatalone.cn/video',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var querystatus = res.statusCode;
        if (querystatus != 200) {
          wx.showToast({
            title: '数据加载失败',
            icon: 'none',
            duration: 2000
          });
          thispage.setData({
            loadcomplete: true,
            loadsuccess: true,
            loadfail: false
          });
          return;
        }
        var querydata = res.data.data[0];
        var materlist = [
          {
            id: "materials",
            name: "美食食材",
            open: false,
            pages: [
            ]
          }
        ];
        Array.prototype.push.apply(materlist[0].pages, querydata.content);

        var stelist = [
          {
            id: "steps",
            name: "做法步骤",
            open: false,
            pages: [
            ]
          }
        ];
        for (var i = 0; i < querydata.steps.length; i++) {
          var page = {
            stepname: "第" + (i + 1).toString(10) + "步",
            stepcontent: querydata.steps[i]
          }
          stelist[0].pages.push(page);
        }

        thispage.setData({
          foodName: querydata.title,
          dailyVideoUrl: querydata.url,
          videoImage: querydata.image,
          materialslist: materlist,
          stepslist: stelist,
          loadcomplete: true,
          loadsuccess: false,
          loadfail: true
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '数据加载失败',
          icon: 'none',
          duration: 2000
        });
        thispage.setData({
          loadcomplete: true,
          loadsuccess: true,
          loadfail: false
        });
      },
      complete: function () {
        //thispage.setData({ loadcomplete: true });
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
    
  }
})