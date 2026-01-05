// 同时输出6
for (var i = 0; i <= 5; i++) {
    setTimeout(function () {
        console.log(i)
    }, 1000)
}


// 同时输出0，1，2，3，4，5
for (var i = 0; i <= 5; i++) {
    (
        function (j) {
            setTimeout(function () {
                console.log(i)
            }, 1000)
        }
    )(j)
}

for (var i = 0; i <= 5; i++) {
    timeoutPromise(i);
}
function timeoutPromise(i) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(i);
            resolve(true);
        }, 1000);
    });
}

// 每隔一秒输出一个
async function init() {
    for (var i = 0; i < 10; i++) {
        await timeoutPromise(i);
    }
}
function timeoutPromise(i) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(i);
            resolve(true);
        }, 1000);
    });
}
init();

// 休眠函数


