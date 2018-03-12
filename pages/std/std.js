// pages/std/std.js

let constants = require("../../constants.js");
let moment = require("../../utils/moment.min");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0, // 0: 未开始；1: 计数中； 2:计数结束
    wave: "",
    CDN_URL: constants.CDN_URL,
    time: 3600,
    timeStr: "00:00",
    validHit: 0,
    invalidHit: 0,
    lastHit: 0,
    canValidHit: true,
    allowedTap: true,
    curTheme: 2,  // theme.id的值
    playing: false,
    soundSwitch: true,
    modal: {
      modalHide: true,
      modalMsg: " ",
      modalTitle: "提示",
      modalClass: "fade-in",
      modalTit: ""
    },
    theme: [
      {tit: "gm", id: 1, name: "光芒", sound: "gm.mp3"},
      {tit: "sm", id: 2, name: "生命", sound: "sm.mp3"},
      {tit: "dh", id: 3, name: "大海", sound: "dh.mp3"},
      {tit: "yj", id: 4, name: "雨季", sound: "yj.mp3"}],
    weeks: 0,
    days: 0,
    birthDateStr: "",
    keepScreenOn: false,
    birthDate: null,
    volSwitch: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 按钮的声音
    this.btnSound = wx.createInnerAudioContext();
    this.btnSound.autoplay = false;

    // 主题的背景音乐播放
    this.bgm = wx.createInnerAudioContext();
    this.bgm.autoplay = false;
    this.bgm.loop = true;
    this.bgm.src = wx.getStorageSync(`sound_${this.data.theme[this.data.curTheme-1].tit}`);
    this.bgm.onError((e) => {
      console.log(e);
    });

    // 加载完成后再下载其它主题的音乐
    this.downloadThemeBGM();

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
		
		var birthDate;

		////////////////////////////////////////
		let w = wx.getStorageSync("weeks");
		let d = wx.getStorageSync("days");
		if (w || d || (w == 0 && d == 0)) {
			birthDate = ((280 - (w * 7 + d)) * 86400000) + new Date().getTime();
			wx.setStorageSync("birthDate", birthDate);
		} else {
			birthDate = wx.getStorageSync("birthDate");
		}
		////////////////////////////////////////

    if (birthDate) {
      let rest = 24192000000 - (birthDate - new Date().getTime());
      let weeks = w;
      let days = d
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    this.setData({
    });

  },

	// 分享
	onShareAppMessage: function () {
		return {
			title: "华大母婴记胎动",
			path: "/pages/std/std",
			imageUrl: "https://p.ihuada.com/mp/dev/img/share.jpg",
			success: function (res) {
				console.log("share success!");
			},
			fail: function (res) {}
		}
	},

  // 大按钮--开始计数
  bindTapStart: function () {
    let that = this;
    this.countDown();
    this.resetCount();
    this.data.volSwitch && this.bgm.play();
    this.setData({
      playing: true,
      keepScreenOn: true
    });

      wx.setKeepScreenOn({
        keepScreenOn: that.data.keepScreenOn
      })

  },

  // 大按钮--计数中
  bindTapCount: function () {
    let that = this;

    // 动画显示 && 音效
    that.showTapAnimation();

    // 次数
    let validHit = that.data.validHit;
    let invalidHit = that.data.invalidHit;

    //
    that.checkValidHit();

    if (that.data.canValidHit) {
      that.setData({
        validHit: validHit + 1,
        lastHit: new Date().getTime(),
      })
    } else {
      that.setData({
        invalidHit: invalidHit + 1,
      })
    }
  },

  // 有效点击
  checkValidHit: function () {
    let that = this;
    let lastHit = this.data.lastHit;
    let now = new Date().getTime();
    let ca = now - lastHit;
    if (ca >= 300000) { // 有效点击的间隔时间
      this.setData({
        canValidHit: true
      });
      let tmpHistory2 = wx.getStorageSync("tmpHistory2");
      !tmpHistory2 && (tmpHistory2 = []);
      let tmpObj = {};
      tmpObj.time = new Date().getTime();
      tmpObj.times = 1;
      tmpHistory2.push(tmpObj);
      wx.setStorageSync("tmpHistory2", tmpHistory2);
    } else {
      this.setData({
        canValidHit: false
      })
    }
  },

  // 计数点击
  showTapAnimation () {
    let that = this;
    if (that.data.allowedTap) {
      that.setData({
        wave: "an-wave",
        allowedTap: false
      });

      // 按钮声音
      let r = that.getRamdomNum(0, 7);
      that.btnSound.src = `/sound/${r}.mp3`;
      console.log(r);
      that.data.volSwitch && that.btnSound.play();

      // 震动
      wx.vibrateLong({
        success: function () {
          console.log("vibrate");
        }
      });

      setTimeout(function () {
        that.setData({
          wave: "",
          allowedTap: true
        })
      }, 1000);
    }
  },

  // 大按钮--重新开始计时
  bindTapRestart: function () {
		let that = this;
		wx.showModal({
			title: '提示',
			content: '确定要重新开始吗？',
			confirmColor: "#ff708b",
			success: function (res) {
				if (res.confirm) {
					that.setData({
						status: 0,
						time: 3600
					});
				}
			}
		})
    
  },

  // 历史记录按钮
  bindTapHistory: function () {
    wx.navigateTo({
      url: "/pages/history/history"
    })
  },

  // 修改孕周按钮
  bindTapMod: function () {
    wx.navigateTo({
      url: "/pages/birth/birth"
    })
  },

  // 切换主题
  bindChangeTheme: function (e) {
    let index = e.currentTarget.dataset.id;
    let theme = this.data.theme;
    this.setData({curTheme: index});
    this.bgm.src = wx.getStorageSync(`sound_${theme[index-1].tit}`);
    this.data.volSwitch && this.bgm.play();
  },

  // 弹框信息
  bindTapInfo: function () {
    let obj = {
      modalHide: false,
      modalMsg: "",
      modalTitle: "",
      modalClass: "fade-in",
      modalTit: "/img/titimg1.png"
    };
    this.setData({
      modal: obj
    });
  },

  // 倒计时
  countDown () {
    let that = this;
    let t = that.data.time;
    function cd() {
      if (t > 1) {
        t--;
        let m = Math.floor(t / 60);
        let s = Math.floor(t % 60);
        if (m < 10) {m = "0" + m}
        if (s < 10) {s = "0" + s}
        that.setData({
          time: t,
          timeStr: m + ":" + s
        })
      } else if (t = 1) {
        // 终止
        that.setData({
          timeStr: "00:00",
          status: 2,
          playing: false,
          keepScreenOn: false
        });
        clearInterval(ti);
        wx.setKeepScreenOn({
          keepScreenOn: that.data.keepScreenOn
        });
				// 存储数据
				let tmpHistory = wx.getStorageSync("tmpHistory");
				let tmpObj = {};
				let n = new Date();
				let id = "td_" + n.getFullYear() + (n.getMonth() + 1) + n.getDate() + n.getHours() + n.getMinutes() + n.getSeconds() + n.getMilliseconds() + that.generateID();
				tmpObj.time = n.getTime();
				tmpObj.times = that.data.validHit;
				tmpObj.id = id;
				!tmpHistory && (tmpHistory = []);
				tmpHistory.push(tmpObj);
				wx.setStorageSync("tmpHistory", tmpHistory);
      }
    }
    let ti = setInterval(cd, 1000);
  },

  // 随机字符串
  generateID: function () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  },

  // 生成随机数，用于随机选取按钮声音
  getRamdomNum: function (minNum, maxNum) {
    switch(arguments.length){
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  },

  // 下载主题音乐
  downloadThemeBGM: function () {
    let theme = this.data.theme;
    for (let i=0; i<theme.length; i++) {
      (function (index) {
        let tmp = wx.getStorageSync(`sound_${theme[index].tit}`);
        if (!tmp) {
          let url = `${constants.CDN_URL}/sound/${theme[index].sound}`;
          wx.downloadFile({
            url: url,
            success: function (res) {
              if (res.statusCode === 200) {
                wx.setStorageSync(`sound_${theme[index].tit}`, res.tempFilePath);
              }
            }
          });
        }
      })(i);
    }
  },

  // 重置状态
  resetCount: function () {
    this.setData({
      status: 1,
      validHit: 0,
      invalidHit: 0,
      lastHit: 0,
      canValidHit: true,
      allowedTap: true
    })
  },


  // 开关音乐
  bindVolSwitch: function () {
    if (!this.data.volSwitch) {
      // play
      this.bgm.play();
    } else {
      // pause
      this.bgm.pause();
    }
    this.setData({
      volSwitch: !this.data.volSwitch
    })
  }

});