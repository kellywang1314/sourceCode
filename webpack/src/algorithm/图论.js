/* 岛屿数量
遍历网格的每个单元格，遇到 '1'（未访问的岛屿）时，启动 DFS/BFS，将该岛屿的所有相连 '1' 标记为 '0'（已访问）。
每启动一次 DFS/BFS，岛屿数量加 1。
*/
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
    if (grid.length === 0) return 0;
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    // DFS：将当前岛屿的所有相连1标记为0
    const dfs = (i, j) => {
        // 边界判断 + 是否为陆地：越界/非陆地直接返回
        if (i < 0 || j < 0 || i >= rows || j >= cols || grid[i][j] === '0') {
            return;
        }
        // 标记为已访问（淹掉岛屿）
        grid[i][j] = '0';
        // 递归遍历上下左右四个方向
        dfs(i - 1, j); // 上
        dfs(i + 1, j); // 下
        dfs(i, j - 1); // 左
        dfs(i, j + 1); // 右
    };

    // 遍历整个网格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                count++; // 发现新岛屿，计数+1
                dfs(i, j); // 淹掉整个岛屿
            }
        }
    }
    return count;
};

// 测试用例
const grid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"]
];
console.log(numIslands(grid)); // 输出：3


// 所有可能的路径
var allPathsSourceTarget = function (graph) {
    // 1. 存储所有找到的路径（最终要返回的结果）
    const result = [];
    // 2. 终点是最后一个节点（比如graph长度为4，终点就是3）
    const target = graph.length - 1;

    // 3. 核心：DFS回溯函数（curNode=当前在哪个节点，path=当前走的路线）
    const dfs = (curNode, path) => {
        // 4. 终止条件：如果当前走到了终点，就把这条路线存起来
        if (curNode === target) {
            result.push([...path]); // 拷贝路线（避免后续修改）
            return; // 不用再走了，返回上一步
        }

        // 5. 遍历当前节点能走到的所有节点（比如当前在0，就遍历1、2）
        for (const nextNode of graph[curNode]) {
            // 6. 选择：把下一个节点加入当前路线（比如0→1）
            path.push(nextNode);
            // 7. 递归：从nextNode出发，继续找路线（比如从1出发找去3的路）
            dfs(nextNode, path);
            // 8. 回溯：撤销选择（比如走完0→1→3后，把3删掉，回到0→1；再删掉1，回到0，去走0→2）
            path.pop();
        }
    };

    // 9. 启动DFS：从0出发，初始路线是[0]
    dfs(0, [0]);
    // 10. 返回所有找到的路线
    return result;
};