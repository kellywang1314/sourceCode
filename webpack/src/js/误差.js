function withinErrorMargin (left, right) {
    return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2)
}
