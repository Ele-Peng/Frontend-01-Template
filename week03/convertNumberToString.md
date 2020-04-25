
## 写在前面
- 是的我要折腾一下 Javascript convertNumberToString 了🙆
- [convertStringToNumber 实现](https://ele-peng.github.io/2020/04/24/convertStringToNumber/)

<!-- more -->
## 实践准备
- 首先我们依旧需要简单梳理一下我们的实践过程，再根据 [ECMAScript-262](https://www.ecma-international.org/publications/standards/Ecma-262.htm) 标准P61完善实践
- input: @params: { num } 输入需要转换的number, { radix } 转换的指定基数
- 对 input-num 的特殊处理
	- ![input-num 的特殊处理](http://p1.meituan.net/myvideodistribute/e0405830e24314df04f89a21078cc64198443.png)
- 简单算法处理
	- 获取符号位
		- \- 负 显示
		- \+ 正 不显示
	- 十进制
	- 二进制
	- 八进制
	- 十六进制

- output: return resStr

## 实践过程
- 经过上面的分析，我们代码可以先写成

	```javascript
	  function convertNumberToString(num) {
	    try {
	      const formatNum = Number(num) // 处理Number为十进制
	      if (isNaN(formatNum)) return 'NaN'
	      if (isZero(formatNum)) return '0'
	      const sign = getSign(formatNum)
	      if (!isFinite(formatNum)) return sign + 'Infinity'
	      return convertDecimalNumberToString(formatNum)
	    } catch (err) {
	      throw new Error(err)
	    }
	  }
	```
- input number 的特殊处理
	- If m is NaN, return the String "NaN".
	
		> if (isNaN(formatNum)) return 'NaN'
	
	- If m is +0 or -0, return the String "0".
		
		```javascript
		  if (isZero(formatNum)) return '0'
		  function isZero(num) {
		    if (1 / num === Infinity || 1 / num === -Infinity) {
		      return true
		    }
		    return false
		  }
		```
	- If m is less than zero, return the string-concatenation of "-" and ! NumberToString(-m).

		```javascript
		  const sign = getSign(formatNum)
		  function getSign(num) {
		    if (num === -Infinity) {
		      return "-"
		    } else if (num === Infinity) {
		      return ""
		    } // 特殊情况 0 前面已经处理
		    return num / Math.abs(num) === 1 ? "" : "-"
		  }
		```
	
	- If m is +∞, return the String "Infinity".

		> if (!isFinite(formatNum)) return sign + 'Infinity'

- 常规 Decimal Number 处理

	```javascript
	  function convertDecimalNumberToString(num) {
	    const radix = 10
	    let int = Math.floor(num)
	    let float = (num - int) * 100 / 100
	    let resInt = ''
	    let resFloat = ''
	    // 整数部分 取余，除以基数
	    while (int > 0) {
	      resInt = String(int % radix) + resInt
	      int = Math.floor(int / radix)
	    }
	    if (float) {
	      resFloat = '.'
	      // 小数部分，乘以基数，取整
	      while (float > 0) {
	        resFloat = resFloat + Math.floor(float * radix)
	        float -= Math.floor(float * radix)
	      }
	    }
	    return resInt + resFloat
	  }
	```
	
## 测试用例

```javascript
  console.log(convertNumberToString(-Infinity))
  console.log('toString', -Infinity.toString())
  console.log(convertNumberToString(+Infinity))
  console.log('toString', +Infinity.toString())
  console.log(convertNumberToString(120.11112))
  console.log('toString', 120.11112.toString())
  console.log(convertNumberToString(120))
  console.log('toString', (120).toString())
```
- 测试截图
	- ![测试截图](http://p0.meituan.net/myvideodistribute/b741d6a87bab9c52f01871781745689124911.png)

## 写在后面
- 可以看出，我们写的 converNumbertoString 遇到浮点数，就失灵了，有想到说 用 toString，然后正则匹配出小数点后面的浮点数，舍入相应位数，但是这样，就用到了 toString 方法，似乎与我的最初想法实现 convertNumbertToString 死锁了 🙃
- 大家有其他的不用 toString 实践，欢迎大家提 issue 告诉我呀~
- [代码地址](https://github.com/Ele-Peng/Frontend-01-Template/blob/master/week03/convertNumberToString.html)
- 祝大家多多发财
