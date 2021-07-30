

function sleep (ms = 100) {
    let sleepSwitch = true
    let s = Date.now()
    while (sleepSwitch) {
        if (Date.now() - s > ms) {
            sleepSwitch = false
        }
    } 
}



async function test() {
    console.log('开始');
    await sleep(4000);
    console.log('结束');
}
 
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}