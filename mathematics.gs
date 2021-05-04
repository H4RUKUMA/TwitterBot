var Mathematics = function () {};
 
Mathematics.prototype = {
  
  sum : function(array)
  {
    if(!isArray(array)) return false;
    //　配列だったら合計を求める
    return array.reduce(function(previous, current, i, array) {
      return previous + current;
    });
  },
  
  // averageは平均値。相加平均または算術平均(arithmetic mean)のことで，データの合計をデータの個数で割ったもの
  average : function(array) {
    if(!isArray(array)) return false;
    // 配列だったら平均を求める
    var average = this.sum(array) / array.length;
    return average;
  },
  
  // medianは中央値。中位数，中位値，メディアン等ともよばれます．得られたデータを昇順（小さい順）に並べ替えたとき，
  // その順番がちょうど真ん中の位置（順位）にあたるデータの値です．ただし，データの個数が偶数の場合は，
  // ちょうど真ん中の位置に数値がないので，真ん中をはさむ2つのデータの値の平均を中央値とします．
  // 中央値は，極端な数値のデータである外れ値(outliers)の影響を受けにくい性質（robustness）を持つのが特筆されます．
  median : function(array) {
    if(!isArray(array)) return false;
    
    var half = (array.length/2)|0;  //折り返し地点
    var arraySorted = array.sort(this.compareNumbers);  //比較関数でソートする。
    
    if(arraySorted.length % 2)
    {//割り切れないときは，median値はソートした中央の値１個をそのまま返せば良い。
      return arraySorted[half];
    }
    //割り切れたときは，median = 中央の二つの値の平均値
    return (arraySorted[half-1] + arraySorted[half]) / 2;
  },
  
  // meanは単純平均値なのでaverageと同じ
  mean : function(array) {
    return average(array);
  },
  
  // modeは最頻値。度数分布表(frequency table)から，最も度数の多い階級の値を最頻値といいます．
  // 並み値，モードともよばれる．分布形の山が2つ(bimodal)あるいはそれ以上(multimodal)存在する場合や，
  // 山がなく平坦(uniform)な場合には，最頻値は代表値としてあまり意味をなさなくなります．
  mode : function(array) {
    if(!isArray(array)) return false;
    // 複数の要素が同じ頻度で現れたら，全ての最頻値を配列に詰めて返す。
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    var modes = [],
        count = [],
        i = 0,
        number = 0,
        maxIndex = 0;
    for (i = 0; i < array.length; i++) {
      number = array[i];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
        maxIndex = count[number];
      }
    }
    for (i in count) if (count.hasOwnProperty(i)) {
      if (count[i] === maxIndex) {
        modes.push(Number(i));
      }
    }
    return modes;
  },
  
  range : function(array) {
    if(!isArray(array)) return false;
    var arraySorted = array.sort(this.compareNumbers);
    return [arraySorted[0], arraySorted[arraySorted.length - 1]];
  },
  
  max : function(array) {
    if(!isArray(array)) return false;
    return array.reduce(function(a, b) {
      return Math.max(a, b);
    });
  },
  
  min : function(array) {
    if(!isArray(array)) return false;
    return array.reduce(function(a, b) {
      return Math.min(a, b);
    });
  },
  
  // ソートの時に使用するためだけの大小比較関数
  compareNumbers : function(a, b) {
    return (a - b);
  }
};
 
// 配列かどうかはよく使うので，Mathematicsの外で定義。
function isArray(value)
{
  return value &&                             
    typeof value === 'object' &&
      typeof value.length === 'number' &&
        typeof value.splice === 'function' &&
          !(value.propertyIsEnumerable('length'));
}