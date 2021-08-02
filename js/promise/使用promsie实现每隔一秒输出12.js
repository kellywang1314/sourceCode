const arr = [1, 2, 3]

arr.reduce((cur,item) => {
    return cur.then((res) => {
        return new Promise((resolve) => {
            setTimeout(() => {console.log(item);resolve(item)},1000)
        })
    })
},Promise.resolve())