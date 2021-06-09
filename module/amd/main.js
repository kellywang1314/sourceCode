
// 配置基础路径
// require.config({
//     baseUrl: "js/lib",
//     paths: {
//       "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
//       "underscore": "underscore.min",
//     }
//   });


// require(["jquery","underscore"],function($,_){
    
// });

// 引用模块，将模块放在[]内
require(['math'],function(math){
    var sum = math.add(10,20);
    console.log(sum,'ddd')
});


  