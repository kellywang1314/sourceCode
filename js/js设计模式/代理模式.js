// 为其他对象提供一种代理，便以控制对这个对象的访问，不能直接访问目标对象,常用的就是es6的proxy

// 虚拟代理
var myImage = (function() {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);
	return {
    	setSrc: function(src) {
    		imgNode.src = src;
    	}
    }
})();

var preImage = (function() {
	var img = new Image; 
    img.onload = function() {
    	myImage.setSrc = img.src;
    }; 
 
    return {
    	setSrc: function(src) {
    		myImage.setSrc('../loading.gif');
    		img.src = src;
    	}
    }
})(); 
 
preImage.setSrc('https://cn.bing.com/az/hprichbg/rb/TadamiTrain_ZH-CN13495442975_1920x1080.jpg'); 


// 应用：缓存代理
const mult = function() {
    let a = 1
    for (let i = 0, l; l = arguments[i++];) {
      a = a * l
    }
    return a
  }
  
  const proxyMult = (function() {
    const cache = {}
    return function() {
      const tag = Array.prototype.join.call(arguments, ',')
      if (cache[tag]) {
        return cache[tag]
      }
      cache[tag] = mult.apply(this, arguments)
      return cache[tag]
    }
  })()