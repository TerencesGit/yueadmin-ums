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
		},
		randomCode (length) {
      length = length || 4;
      var code = '';
      const ALPHABET = 'abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
      for (let i = 0; i < length; i++) {
        code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
      }
      return code;
    },
    canvasCode (canvasEle) {
      const canvas = document.getElementById(canvasEle);
      const cxt = canvas.getContext('2d');
      const authCode = this.randomCode();
      const linear = cxt.createLinearGradient(10, 10, 60, 30);  
            linear.addColorStop(0,'purple');  
            linear.addColorStop(.5,'orange');  
            linear.addColorStop(1,'green');
      cxt.clearRect(0, 0, 100, 100);
      cxt.font = "22px Microsoft Yahei";
      cxt.fillStyle = linear;
      cxt.fillText(authCode, 10, 25);
      return authCode;
    }
}
