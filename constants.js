
const util = require("./utils/util.js");

// 请求的基础数据
let commonData = {
	"s": new Date().getTime(),
	"b": "1.0.1",
	"g": wx.getStorageSync("guid"),
	"v": {}
};

// 环境配置 -- dev || prod
let ENV = "dev";

let constants = {

	ENV: ENV,

	// 小程序配置
	app: {
		APPID: "wxc243c3f2cdc08553",
		SECRET: "7dc0642c16eeef19305d4135ce8ece60"
	},

	// 资源cdn地址
	CDN_URL: ENV === "prod" ? "https://p.ihuada.com/mp/prod" : "https://p.ihuada.com/mp/dev",

	// 服务器地址配置
	SERVER_URL: "https://www.ihuada.com",

	// API
	API: {
		userLogin (user, pass) {
			return Object.assign(commonData, {
				"c": constants.SERVER_URL + "/login",
				"v": {"user": user, "pass": pass} 
			})
		},

	}
}

module.exports = constants;