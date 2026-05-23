var lottery = [];
var n;

// 直到陣列 lottery 選滿 6 球
while (lottery.length <= 6) {

    // 取一隨機 1 ~ 49 數字
    n = Math.floor(Math.random() * 49) + 1;

    // 如果選出來的 n 不存在，就放入陣列
    if (lottery.indexOf(n) === -1) {
        lottery.push(n);
    }
}