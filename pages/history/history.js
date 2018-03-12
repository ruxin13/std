// pages/history/history.js
let constants = require("../../constants");
let moment = require("../../utils/moment.min");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN_URL: constants.CDN_URL,
    list: [],
    renderList: [],
    weeks: 0,
    days: 0,
    // resArr: ["胎动正常", "胎动较少"],
    birthDateStr: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
		let list = wx.getStorageSync("tmpHistory2");

		if (list && list.length > 0) {
      list = list.sort(that.compare("time"));

      list.map(function (item) {
        item.date = moment(item.time).format("YYYY-MM-DD");
        item.timeStr = moment(item.time).format("HH:mm:ss");
      });

      let renderList = [];
      let tmpList = [];
      let tmpNum = 0;

		  for (let i=0; i<list.length; i++) {

		    let tmpObj = {};

		    Object.assign(tmpObj, list[i]);

        tmpObj.date = moment(list[i].time).format("YYYY-MM-DD");
        tmpObj.timeStr = moment(list[i].time).format("HH:mm:ss");

        // 判断首
        if (i === 0) {
          tmpObj.isTop = true;
        } else {
          tmpObj.isTop = list[i-1].date !== tmpObj.date;
        }

        // 判断尾
        if (list.length === 1) {
          tmpObj.isEnd = true;
        } else {
          tmpObj.isEnd = !!(list[i + 1] && list[i + 1].date !== tmpObj.date);
          if (i === list.length-1) {
            tmpObj.isEnd = true;
          }
        }

        // 放入分数组
        tmpList.push(tmpObj);
        tmpNum += tmpObj.times;

        if (tmpObj.isEnd) {
          tmpList[0].totalTimes = Math.round(tmpNum);
          // tmpList[0].resStr = that.data.resArr[Math.round(tmpNum / tmpList.length) > 24 ? 0 : 1];
          tmpNum = 0;
          renderList.push(tmpList);
          tmpList = [];
        }

      }

      that.setData({
        list: list,
        renderList: renderList
      })

		}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   weeks: wx.getStorageSync("weeks"),
    //   days: wx.getStorageSync("days")
    // });

    let birthDate = wx.getStorageSync("birthDate");
    if (birthDate) {
      let rest = (birthDate - new Date().getTime());
      let weeks = parseInt(rest / 604800000);
      let days = parseInt((rest % 604800000) / 86400000);
      this.setData({
        birthDateStr: moment(birthDate).format("YYYY年MM月DD日"),
        weeks: weeks,
        days: days
      })

    } else {
      wx.showToast({
        title: "请先设置孕周",
        icon: "none",
        duration: 2000,
        mask: true,
        success: function () {
          setTimeout(function () {
            wx.navigateTo({
              url: "/pages/birth/birth"
            });
          }, 2000)
        }
      });
    }
  },

  // 排序
  compare: function (prop){
    return function(a, b){
      return b[prop] - a[prop];
    }
  }
});