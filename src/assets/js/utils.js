export default {
    setCookie (name, value, time) {
    	if (!time) {
    		document.cookie = name + "="+ escape(value) + ";expires=" + 0
    	} else {
    		let exp = new Date()
				exp.setTime(exp.getTime() + this.getSec(time))
				document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
    	}
		},
    getCookie (name) {
      let arr,
          reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
      	return unescape(arr[2]);
      } else {
      	return null;
      }
    },
    delCookie (name) {
			let exp = new Date();
			exp.setTime(exp.getTime() - 1);
			let cval = this.getCookie(name);
			if(cval != null) {
				document.cookie= name + "="+cval+";expires="+exp.toGMTString();
			}
		},
		getSec (time) {
			let number = time.substring(0, time.length - 1) * 1,
			    unit = time.substring(time.length - 1);
			if (unit === "s"){
				return number * 1000
			} else if (unit === 'm') {
				return number * 1000 * 60
			} else if (unit === "h") {
				return number * 1000 * 60 * 60
			} else if (unit === "d") {
				return number * 1000 * 60 * 60 * 24
			}
		}
}