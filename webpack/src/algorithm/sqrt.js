// 精度0.01
function sqrtBisection(n) {
    if (isNaN(n)) return NaN
    if (n === 0 || n === 1) return n
    let low = 0,
        high = n,
        pivot = (low + high) / 2,
        lastPivotValue = Math.pow(pivot, 2),
        EPSILO = 0.01 // 误差
    while(Math.abs(lastPivotValue - n) > EPSILO ){
        if (lastPivotValue > n) {
            high = pivot
        } else if (lastPivotValue < n) {
            low = pivot
        } else {
            return pivot
        }
        pivot = (low + high) / 2
        lastPivotValue = Math.pow(pivot, 2)
    }
    return pivot
}