/**
 * climbStairs
 * 爬楼梯：一次可爬 1 或 2 阶，返回到达第 n 阶的方法数
 * @param {number} n 台阶数
 * @returns {number} 方法数
 */
export function climbStairs(n) {
  if (n <= 2) return n
  let a = 1, b = 2
  for (let i = 3; i <= n; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}

/**
 * rob
 * 打家劫舍：不能抢相邻的房屋，返回最大收益
 * @param {number[]} nums 每个房屋的金额
 * @returns {number} 最大收益
 */
export function rob(nums) {
  let prevNo = 0, prevYes = 0
  for (const n of nums) {
    const temp = prevNo
    prevNo = Math.max(prevNo, prevYes) // 本次不抢
    prevYes = temp + n // 本次抢
  }
  return Math.max(prevNo, prevYes)
}

