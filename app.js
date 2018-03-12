
const util = require('./utils/util.js');
// const event = require('./utils/event.js');
let constants = require('./constants.js');

App({
  onLaunch: function () {

		// guid
		wx.setStorageSync('guid', wx.getStorageSync('guid') || util.guid());

		// 系统信息
		wx.getSystemInfo({
			success: function (res) {
				wx.setStorageSync("system", res.system.split(" "[0]));
				// 微信版本验证
				this.checkVersion = false;
				if (res.SDKVersion && parseFloat(res.SDKVersion) > 1.1) {
					this.checkVersion = true;
				} else {
					wx.showToast({
						title: '您的微信版本过旧，请升级后再进入',
						duration: 10000
					})
				}
			}
		});
		

		this.wxLogin();
  },
	// 微信登录
	wxLogin: function () {
		let that = this;
		wx.checkSession({
			success: function () {
				//session 未过期，并且在本生命周期一直有效
				console.log("Session OK!");
			},
			fail: function () {
				console.log("Session Login!");
				wx.login({
					success: function (res) {
						wx.setStorageSync("loginCode", res.code);
						wx.getUserInfo({
							withCredentials: true, // false不返回敏感信息
							lang: "zh_CN",
							success: function (inf) {
								console.log(inf);
								wx.setStorageSync("userInfo", inf.userInfo);
								that.globalData = {
									"userInfo": inf.userInfo,
									"hasUserInfo": true
								}
							},
							fail: function () {
								wx.getSetting({
									success: function (setting) {
										if (!setting.authSetting['scope.userInfo']) {
											that.reGetUserInfo();
										}
									}
								})			
							}
						})
					}
				})
			}
		})
	},
	reGetUserInfo: function () {
		let that = this;
		// 用户拒绝授权获取信息
		wx.showModal({
			title: '提示',
			content: '授权失败，请打开用户信息授权！',
			showCancel: false,
			success: function (res) {
				if (res.confirm) {
					wx.openSetting({
						success: function (aures) {
							if (!aures.authSetting['scope.userInfo']) {
								that.reGetUserInfo();
							}
						}
					})
				}
			}
		})
	},
	globalData: {
		userInfo: null,
		hasUserInfo: false
	}
});