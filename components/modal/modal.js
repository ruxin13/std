Component({
	properties: {
    modalHidden: {
			type: Boolean,
			value: true
		},
    modalTitle: {
      type: String,
      value: "提示"
    },
    modalClass: {
      type: String,
      value: "fade-in"
    },
    modalTit: {
      type: String,
      value: ""
    }
	},
	data: {

	},
	methods: {
		// 关闭
    bindTapCloseModal: function () {
      let that = this;
      that.setData({
        modalClass: "fade-out"
      });
      setTimeout(function () {
        that.setData({
          modalHidden: true
        })
      }, 500);
		}
	}
});