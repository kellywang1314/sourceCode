var myPow = function(x, n) {
    if (n === 0) return 1.0
    if (n === 1) return x
    if (n < 0) {
        return 1/myPow(x, -n)
    }

    let sub = myPow(x, ~~(n / 2))
    return sub * sub * myPow(x, n % 2)
}
