// map实现
Array.prototype.myMap = function(fn){
    let temp = []
    for(let i=0; i<this.length; i++){
        temp.push(fn(this[i],i,this))
    }
    return temp
}

// filter实现
Array.prototype.myFilter = function(fn){
    let temp = []
    for(let i=0; i<this.length; i++){
        fn(this[i]) && temp(fn(this[i],i,this))
    }
    return temp
}

// reduce实现
Array.prototype.myReduce = function(fn,init){
    for(let i=0; i<this.length; i++){
        init = fn(init,this[i],i,this)
    }
    return init
}

// some函数的实现
Array.prototype.someNew = function (fn) {
    for (let i = 0; i < this.length; i++) {
        if (fn(this[i])) {
            return true
        }
    }
    return false
};

// Array.from()的实现
Array.prototype.slice.call(this)


 // const leftDrillTree = [
    //     {
    //       "key": "key:@total@",
    //       "value": "总计",
    //       "path": [],
    //       "children": [
    //         {
    //           "key": "key:上海子公司",
    //           "value": "上海子公司",
    //           "path": [
    //             "上海子公司"
    //           ],
    //           "children": [
    //             {
    //               "key": "key:上海子公司 上海大宁店",
    //               "value": "上海大宁店",
    //               "path": [
    //                 "上海子公司",
    //                 "上海大宁店"
    //               ],
    //               "children": [
    //                 {
    //                   "key": "key:上海子公司 上海大宁店 一季度",
    //                   "value": "一季度",
    //                   "path": [
    //                     "上海子公司",
    //                     "上海大宁店",
    //                     "一季度"
    //                   ]
    //                 },
    //                 {
    //                   "key": "key:上海子公司 上海大宁店 二季度",
    //                   "value": "二季度",
    //                   "path": [
    //                     "上海子公司",
    //                     "上海大宁店",
    //                     "二季度"
    //                   ]
    //                 }
    //               ]
    //             },
    //             {
    //               "key": "key:上海子公司 上海曹家渡店",
    //               "value": "上海曹家渡店",
    //               "path": [
    //                 "上海子公司",
    //                 "上海曹家渡店"
    //               ],
    //               "children": [
    //                 {
    //                   "key": "key:上海子公司 上海曹家渡店 一季度",
    //                   "value": "一季度",
    //                   "path": [
    //                     "上海子公司",
    //                     "上海曹家渡店",
    //                     "一季度"
    //                   ]
    //                 },
    //                 {
    //                   "key": "key:上海子公司 上海曹家渡店 二季度",
    //                   "value": "二季度",
    //                   "path": [
    //                     "上海子公司",
    //                     "上海曹家渡店",
    //                     "二季度"
    //                   ]
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     }
    // ]

  // const leftNewDrillTree = [
  //     {
  //       "key": "key:@total@",
  //       "value": "总计",
  //       "path": [],
  //       "children": [
  //         {
  //           "key": "key:上海子公司1",
  //           "value": "上海子公司",
  //           "path": [
  //             "上海子公司"
  //           ],
  //           "children": [
  //             {
  //                 "key": "key:上海子公司 上海大宁店1",
  //                 "value": "上海大宁店",
  //                 "path": [
  //                   "上海子公司",
  //                   "上海大宁店",
  //                 ],
  //                 "children": [
  //                     {
  //                       "key": "key:上海子公司 上海大宁店 一季度",
  //                       "value": "一季度",
  //                       "path": [
  //                         "上海子公司",
  //                         "上海大宁店",
  //                         "一季度"
  //                       ]
  //                     },
  //                 ]
  //             }],
  //           },
  //           {
  //             "key": "key:上海子公司2",
  //             "value": "上海子公司",
  //             "path": [
  //               "上海子公司"
  //             ],
  //             "children": [
  //               {
  //                   "key": "key:上海子公司 上海大宁店1",
  //                   "value": "上海大宁店",
  //                   "path": [
  //                     "上海子公司",
  //                     "上海大宁店",
  //                   ],
  //                   "children": [
  //                       {
  //                         "key": "key:上海子公司 上海大宁店 二季度",
  //                         "value": "二季度",
  //                         "path": [
  //                           "上海子公司",
  //                           "上海大宁店",
  //                           "二季度"
  //                         ]
  //                       },
  //                   ]
  //               }],
  //             },
  //             {
  //                 "key": "key:上海子公司3",
  //                 "value": "上海子公司",
  //                 "path": [
  //                   "上海子公司"
  //                 ],
  //                 "children": [
  //                   {
  //                       "key": "key:上海子公司 上海曹家渡店1",
  //                       "value": "上海曹家渡店",
  //                       "path": [
  //                         "上海子公司",
  //                         "上海曹家渡店",
  //                       ],
  //                       "children": [
  //                           {
  //                             "key": "key:上海子公司 上海曹家渡店 一季度",
  //                             "value": "一季度",
  //                             "path": [
  //                               "上海子公司",
  //                               "上海曹家渡店",
  //                               "一季度"
  //                             ]
  //                           },
  //                       ]
  //                   }],
  //                 },
  //                 {
  //                     "key": "key:上海子公司4",
  //                     "value": "上海子公司",
  //                     "path": [
  //                       "上海子公司"
  //                     ],
  //                     "children": [
  //                       {
  //                           "key": "key:上海子公司 上海曹家渡店2",
  //                           "value": "上海曹家渡店",
  //                           "path": [
  //                             "上海子公司",
  //                             "上海曹家渡店",
  //                           ],
  //                           "children": [
  //                               {
  //                                 "key": "key:上海子公司 上海曹家渡店 二季度",
  //                                 "value": "二季度",
  //                                 "path": [
  //                                   "上海子公司",
  //                                   "上海曹家渡店",
  //                                   "二季度"
  //                                 ]
  //                               },
  //                           ]
  //                       }],
  //                     },
                  
              
            
          
  //         ],
          
  //     }
  // ]