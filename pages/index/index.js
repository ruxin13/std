//index.js

let constants = require("../../constants.js");

Page({
  data: {
   
  },

  onLoad: function () {
		wx.showLoading({
			title: '加载中……',
		});
		// setTimeout(function () {
		// 	wx.redirectTo({
		// 		url: '/pages/std/std',
		// 	})
		// }, 2000);

    let sound_sm = wx.getStorageSync("sound_sm");
    if (!sound_sm) {
      wx.downloadFile({
        url: constants.CDN_URL + "/sound/sm.mp3",
        success: function (res) {
          if (res.statusCode === 200) {
            wx.setStorageSync("sound_sm", res.tempFilePath);
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/std/std',
            })
          }
        }
      })
    } else {
      wx.hideLoading();
      wx.redirectTo({
        url: '/pages/std/std',
      })
    }



  }

});
