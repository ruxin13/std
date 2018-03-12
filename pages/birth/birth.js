// pages/birth/birth.js
let constants = require("../../constants.js");
let moment = require("../../utils/moment.min");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks: 0,
    days: 0,
		CDN_URL: constants.CDN_URL,
    modal: {
      modalHide: true,
      modalMsg: " ",
      modalTitle: "提示",
      modalClass: "fade-in",
      modalTit: ""
    }
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let weeks = wx.getStorageSync("weeks");
    // let days = wx.getStorageSync("days");
    // if (weeks || days) {
    //   this.setData({
    //     weeks: weeks,
    //     days: days
    //   })
    // } else {
    //   wx.setStorageSync("weeks", this.data.weeks);
    //   wx.setStorageSync("days", this.data.days);
    // }

    let birthDate = wx.getStorageSync("birthDate");
    if (birthDate) {
      let rest = 24192000000 - (birthDate - new Date().getTime());
      let weeks = parseInt(rest / 604800000);
      let days = parseInt((rest % 604800000) / 86400000);
      this.setData({
        weeks: weeks,
        days: days
      })
    } else {
      this.setData({
        weeks: 20,
        days: 0
      });
      let defaultDate = new Date().getTime() + 12182400000;
      wx.setStorageSync("birthDate", defaultDate);
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

	// 拖动孕周
  bindChangeWeeks: function (e) {

    let days = this.data.days;
    let birthDate = new Date().getTime() + ((280 - (e.detail.value * 7 + days)) * 86400000);
    this.setData({
      weeks: e.detail.value,
      birthDate: birthDate
    });

    wx.setStorageSync("weeks", e.detail.value);
    wx.setStorageSync("birthDate", birthDate);

  },

  // 拖动天数
  bindChangeDays: function (e) {

    let weeks = this.data.weeks;
    let birthDate = new Date().getTime() + ((280- (weeks * 7 + e.detail.value)) * 86400000);
    this.setData({
      days: e.detail.value,
      birthDate: birthDate
    });

    wx.setStorageSync("days", e.detail.value);
    wx.setStorageSync("birthDate", birthDate);
  },

  // 下一步
  bindNext: function () {
    wx.navigateBack();
  },

  // 弹框信息
  bindTapInfo: function () {
    let obj = {
      modalHide: false,
      modalMsg: "",
      modalTitle: "",
      modalClass: "fade-in",
      modalTit: "/img/titimg3.png"
    };
    this.setData({
      modal: obj
    });
  },

  bindChangingWeeks: function (e) {
    let days = this.data.days;
    let birthDate = new Date().getTime() + ((280 - (e.detail.value * 7 + days)) * 86400000);
    this.setData({
      weeks: e.detail.value,
      birthDate: birthDate
    });

    wx.setStorageSync("weeks", e.detail.value);
    wx.setStorageSync("birthDate", birthDate);
  },

  bindChangingDays: function (e) {
    let weeks = this.data.weeks;
    let birthDate = new Date().getTime() + ((280 - (weeks * 7 + e.detail.value)) * 86400000);
    this.setData({
      days: e.detail.value,
      birthDate: birthDate
    });

    wx.setStorageSync("days", e.detail.value);
    wx.setStorageSync("birthDate", birthDate);
  }
});