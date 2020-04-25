
## 写在前面
- 简单记录一下，Javascript parseInt 内部实现，并实现 convertStringToNumber

## 实践准备
- 首先我们需要简单梳理一下我们的实现过程，再根据 [ECMAScript-262](https://www.ecma-international.org/publications/standards/Ecma-262.htm) 标准完善实现
- input: @params: { str } 输入需要转换的字符串, { radix } 转换的指定基数
- 对 input 的简单处理 StringNumericLiteral
	- 规格化 str
	- ![StringNumericLiteral BNF](http://p0.meituan.net/myvideodistribute/6f4d129d30fe4d0b45743d72da9760ca14615.png)
		- 将 str 中可能出现的 StrWhiteSpace 去掉
			- ![StrWhiteSpace BNF](http://p0.meituan.net/myvideodistribute/3ab76a2ee0627ddeeec42e093ae8307717214.png)
				- ![LineTerminator BNF](http://p0.meituan.net/myvideodistribute/d9ba181d676994f053ba3ba067279cf48592.png)
	- 判断 radix 是否合法，仅支持 Decimal / BinaryInteger / OctalInteger / HexInteger radix
		- Decimal: 10
		- BinaryInteger: 2
		- OctalInteger: 8
		- HexInteger: 16
- 简单算法处理过程
	- 十进制数
		- ![StrDecimalLiteral BNF](http://p0.meituan.net/myvideodistribute/dbb89c490f4cbe92ce1e7b1025912cde51542.png)
		- 处理 Infinity 情况
		- 符号位处理
		- 小数点
		- 科学计数法
	- 二进制数
		- ![BinaryInteger](http://p1.meituan.net/myvideodistribute/f12e98da62b6529c1d3781a6c1dc36a86760.png)
	- 八进制数
		- ![OctalInteger](http://p1.meituan.net/myvideodistribute/e11bf633f8350bb17f761b719762ed038371.png)
	- 十六进制数
		- ![HexInteger](http://p0.meituan.net/myvideodistribute/274e704676b7d52093ac555c4b43f61013946.png)
- output: return number

## 详细实践
- 根据上面的实践准备

```javascript
/*
* @params: { str } 输入需要转换的字符串, { radix } 转换的指定基数
* return: number
*/
function convertStringToNumber(str, radix) {
  const noWhiteSpaceStr = replaceWhiteSpaceInStr(str) /** 将 str 中的 whitespace 进行匹配 */
  const checkedRadixStr = formatStrByRadix(str, radix) /** 将 str 根据指定基数进行转换 */
  let resNum = 0
  switch (radix) {
    case 10:
      resNum = converStringToDeciaml(str) /** 将 str 转成十进制 */
      break;
    case 2:
      resNum = converStringToBinaryInteger(str) /** 将 str 转成二进制*/
      break;
    case 8:
      resNum = converStringToOctalInteger(str) /** 将 str 转成八进制*/
      break;
    case 16:
      resNum = converStringToHexIntegers(str) /** 将 str 转成十六进制*/
      break;
    default:
      return NaN
  }
  return resNum
}
```
- 将 str 中的 whitespace 进行匹配
	
	```javascript
	/*
	* @params: { str } 输入需要替换的字符串
	* return: resStr 无 whitespace 字符串
	*/
	function replaceWhiteSpaceInStr(str) {
	  let resStr = str.replace(/\s*/g, '') // 去除空格
	  // resStr = resStr.replace(/^[\u000A|\u000D|\u2028|\u2029]/g, '') // 去除 LineTerminator unicode输入方式
	  resStr =  resStr.replace(/[\r|\n]/g, '') // 去除换行
	  return resStr
	}
	```
	- 单元测试
		- ![单元测试截图](http://p0.meituan.net/myvideodistribute/a70fa86dd4d8261537f8cbf5c0e5bc2c71147.png)
- 将 str 根据指定基数进行转换
	
	```javascript
	/*
	* @params: { str } 输入需要替换的字符串, { radix } 转换的指定基数
	* return: resStr 根据指定基数转换过得字符串
	*/
	function formatStrByRadix(str, radix) {
	  let resStr = ''
	  let testReg = null
	  switch (radix) {
	    case 10:
	      testReg = /^((0)|([1-9][0-9]*))?.?([0-9]*)((e|E)?(\+|\-)?([0-9]*))?/
	      break;
	    case 2:
	      // 根据 ECMA-262 是 /^0(b|B)(0|1)+$/
	      // 但是我在 Chrome 浏览器上测了，二进制没有 'b' or 'B'
	      testReg = /^(0|1)+/
	      break;
	    case 8:
	      // 根据 ECMA-262 是 /^0(O|o)[0-7]+$/
	      // 但是我在 Chrome 浏览器上测了，二进制没有 'o' or 'O'
	      testReg = /^[0-7]+/
	      break;
	    case 16:
	      // 根据 ECMA-262 是 /^0(x|X)([0-9a-fA-F])+/
	      // 但是我在 Chrome 浏览器自测中发现，没有表示符 'x' or 'X'也可
	      testReg = /^0(x|X)?([0-9a-fA-F])+/
	      break;
	    default:
	      console.log(`radix: ${radix}, str:  ${str} illegal radix`)
	      return false
	  }
	  resStr = (testReg.exec(str) && testReg.exec(str)['0']) || 'convert fail'
	  console.log(`radix: ${radix}, ${str} --> resStr: `, resStr)
	}
	formatStrByRadix('001010101', 3)
	formatStrByRadix('001010101', 2)
	formatStrByRadix('001010101', 8)
	formatStrByRadix('0b01010101', 2)
	formatStrByRadix('012345677', 8)
	formatStrByRadix('012345677', 2)
	formatStrByRadix('0o12345677', 8)
	formatStrByRadix('1.01E+23', 10)
	formatStrByRadix('.012345677', 10)
	formatStrByRadix('.012345677', 10)
	formatStrByRadix('0123acfACF', 16)
	formatStrByRadix('0x123acfACF', 16)
	formatStrByRadix('0x123acfACFG', 16)
	```
	- 单元测试
		- ![单元测试](http://p0.meituan.net/myvideodistribute/ff9d3e6a3cd279427f8873f91911290774369.png)

- 根据指定基数进行相应算法转换
	- 二进制：
		
		```javascript
		
		// 将 str 转成二进制
		function converStringToBinaryInteger(str, radix) {
		  return strMultipleRadix(str, radix)
		}
		
		/*
		* @params: { str } 输入需要替换的字符串, { radix } 转换的指定基数
		* return: resStr 乘以指定基数转换过得字符串
		*/
		function strMultipleRadix(str, radix) {
		  let tempStrArr = str.split('')
		  let res = 0
		  for (let i = tempStrArr.length - 1; i > 0; i --) {
		    res += (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, tempStrArr.length - i - 1)
		  }
		  return res
		}
		converStringToBinaryInteger('001010101', 2)
		```
		
		- 单元测试
			- ![单元测试截图](http://p0.meituan.net/myvideodistribute/5f3f3d1a2d0851eddaa1e258a182831864745.png)
	- 八进制
		- 同上

			```javascript
			// 将 str 转成八进制
			function converStringToBinaryInteger(str, radix) {
			  return strMultipleRadix(str, radix)
			}
			
			/*
			* @params: { str } 输入需要替换的字符串, { radix } 转换的指定基数
			* return: resStr 乘以指定基数转换过得字符串
			*/
			function strMultipleRadix(str, radix) {
			  let tempStrArr = str.split('')
			  let res = 0
			  for (let i = tempStrArr.length - 1; i > 0; i --) {
			    res += (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, tempStrArr.length - i - 1)
			  }
			  return res
			}
			converStringToBinaryInteger('001010101', 2)
			```
		- 单元测试
			- ![单元测试截图](http://p1.meituan.net/myvideodistribute/e9db13d824513d4e72509cd571f90dc069034.png)
	- 十六进制
		- 需要对 a-f A-F 进行判断，别忘了+10

			```javascript
			  // 将 str 转成十六进制
			  function converStringToBinaryInteger(str, radix) {
			    return strMultipleRadix(str, radix)
			  }
			
			  /*
			  * @params: { str } 输入需要替换的字符串, { radix } 转换的指定基数
			  * return: resStr 乘以指定基数转换过得字符串
			  */
			  function strMultipleRadix(str, radix) {
			    let tempStrArr = str.split('')
			    let res = 0
			    for (let i = tempStrArr.length - 1; i > 0; i--) {
			      if (radix === 16) {
			        if ((tempStrArr[i].codePointAt(0) - '0'.codePointAt(0) >= 0) && (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0) < 10)) {
			          res += (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, tempStrArr.length - i - 1)
			        } else if ((tempStrArr[i].codePointAt(0) - 'a'.codePointAt(0) >= 0) && (tempStrArr[i].codePointAt(0) - 'a'.codePointAt(0) < 6)) {
			          console.log('(tempStrArr[i].codePointAt(0)a', tempStrArr[i].codePointAt(0) - 'a'.codePointAt(0))
			          res += (tempStrArr[i].codePointAt(0) - 'a'.codePointAt(0) + 10) * Math.pow(radix, tempStrArr.length - i - 1)
			        } else if ((tempStrArr[i].codePointAt(0) - 'A'.codePointAt(0) >= 0) && (tempStrArr[i].codePointAt(0) - 'A'.codePointAt(0) < 6)) {
			          console.log('(tempStrArr[i].codePointAt(0)A', tempStrArr[i].codePointAt(0) - 'A'.codePointAt(0))
			          res += (tempStrArr[i].codePointAt(0) - 'A'.codePointAt(0) + 10) * Math.pow(radix, tempStrArr.length - i - 1)
			        }
			      } else {
			        res += (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, tempStrArr.length - i - 1)
			      }
			    }
			    return res
			  }
			  console.log(converStringToBinaryInteger('001010101', 16))
			  console.log(converStringToBinaryInteger('00101acfAFF', 16))
			```
		- 单元测试
			- ![单元测试截图](http://p0.meituan.net/myvideodistribute/e2e319f170fe2334f7b589cfc0f77b06205824.png)
- 最终二/八/十六进制根据指定基数进行相应算法转换方法为：
	
	```javascript
		/*
	  * @params: { str } 输入需要替换的字符串, { radix } 转换的指定基数
	  * return: resStr 乘以指定基数转换过得字符串
	  */
	  function strMultipleRadix(str, radix) {
	    let tempStrArr = str.split('')
	    let res = 0
	    for (let i = tempStrArr.length - 1; i > 0; i--) {
	      if (radix === 16) {
	        if ((tempStrArr[i].codePointAt(0) - '0'.codePointAt(0) >= 0) && (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0) < 10)) {
	          res += (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, tempStrArr.length - i - 1)
	        } else if ((tempStrArr[i].codePointAt(0) - 'a'.codePointAt(0) >= 0) && (tempStrArr[i].codePointAt(0) - 'a'.codePointAt(0) < 6)) {
	          res += (tempStrArr[i].codePointAt(0) - 'a'.codePointAt(0) + 10) * Math.pow(radix, tempStrArr.length - i - 1)
	        } else if ((tempStrArr[i].codePointAt(0) - 'A'.codePointAt(0) >= 0) && (tempStrArr[i].codePointAt(0) - 'A'.codePointAt(0) < 6)) {
	          res += (tempStrArr[i].codePointAt(0) - 'A'.codePointAt(0) + 10) * Math.pow(radix, tempStrArr.length - i - 1)
	        }
	      } else {
	        res += (tempStrArr[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, tempStrArr.length - i - 1)
	      }
	    }
	    return res
	  }
	```
### 转换成十进制
- 实践思路
	1. 判断正负符号位
	2. 判断是否为 Infinity
	3. 判断是否为 整数
		1. 整数
			1. 是否为科学计数法表示
				- 是，通过指数位置分成两部分：整数部分+指数部分
				- 否，只需处理整数部分
		2. 小数
			1. 是否为科学计数法表示
				1. 是，通过分割成小数点到指数，分成三部分：整数部分+小数部分+指数部分
				2. 否，通过小数点位置，分成两部分：整数部分+小数部分
	
- 代码大致为：


```javascript 
  function converStringToDeciaml(str) {
    // console.log('str-=-=--=-==-=', str)
    const sign = getSign(str)
    const strFormatBySign = formatStrBySign(str)
    if (isInfinity(strFormatBySign)) return (1 / 0) * sign // 如果为 Inifity,乘以符号位输出Infinity
    const numberObject = splitStr(strFormatBySign)
    const {int, float, exponentSign, exponent} = numberObject
    // console.log('numberObject', numberObject)
    const resInt = calculateInt(int) // 计算整数部分
    // console.log('resInt', resInt)
    const resFloat = calculateFloat(float) // 计算小数部分
    // console.log('resFloat', resFloat)
    const resExponent = calculateExponent(resInt, resFloat, exponentSign, exponent) // 计算（整数+小数）*  指数部分
    const res = sign * resExponent // 最后乘以符号位
    return res
  }
```
	
#### 判断正负，并根据符号位格式化字符串

```javascript

  // 获取符号位
  function getSign(str) {
    // 如果S的首字符为'-'
    if(str.indexOf('-') == 0) { 
      return -1
    }
    return 1
  }
```
#### 根据符号位格式化字符串（移除字符号位）

```javascript
  // 根据符号位格式化字符串
  function formatStrBySign(str) {
    // 如果 str 的首字符为‘+’或'-'，则移除首字符
    if (str.indexOf('-') == 0 || str.indexOf('+') == 0) {
      str = str.substring(1, str.length)
    }
    return str
  }
```

#### 判断是否为Infinity

```javascript
  // 是否为 Infinity
  function isInfinity(str) {
    const testReg = /^Infinity/
    let resReg = testReg.exec(str)
    return resReg && resReg[0]
  }
```

#### 切割字符串，分成整数+小数+指数位符号+指数部分

```javascript
  // 切割字符串
  /*
  * @params: { str } 输入需要切割的字符串
  * return: res: Object {
  *   int: 整数位,
  *   float: 小数位,
  *   exponentSign: 指数位符号,
  *   exponent: 指数位
  * }
  */
  function splitStr(str) {
    const testReg = /^((0)|([1-9][0-9]*))?.?([0-9]*)(e|E)?((\+|\-)?([0-9]*))?/
    let resReg = testReg.exec(str)
    let res = {
      int: resReg['1'] || 0,
      float: resReg['4'] || 0,
      exponentSign: resReg['7'] || '+',
      exponent: resReg['8'] || 0
    }
    return res
  }
```

#### 整数部分运算

```javascript

  // 整数部分运算
  function calculateInt(str) {
    let res = 0
    const radix = 10
    for (let i = str.length - 1; i >= 0; i--) {
      res += (str[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, str.length - i - 1)
    }
    return res
  }
```


#### 小数部分运算

```javascript

  // 小数部分运算
  function calculateFloat(str) {
    let res = 0
    const radix = 10
    for (let i = 0; i < str.length; i++) {
      res += (str[i].codePointAt(0) - '0'.codePointAt(0)) * Math.pow(radix, i * -1)
    }
    return res
  }
```


#### 指数部分运算

```javascript

  // 指数部分运算
  function calculateExponent(int, float, exponentSign, exponent) {
    // if (float)
    let str = int + 0.1 * float
    const radix = 10
    const exponentInt = calculateInt(exponent)
    if (exponentSign === '+') {
      str = str * Math.pow(radix, exponentInt)
    } else {
      str = str * Math.pow(radix, exponentInt * -1)
    }
    // console.log('Math.abs(str)', Math.abs(str) -  Math.floor(str))
    // // console.log('Number.EPSILON', Number.EPSILON)
    // if (Math.abs(str) -  Math.floor(str)) {
    //   return str.toFixed(1)
    // }
    return str
  }
```

#### 单元测试
- 测试用例

```javascript
  console.log(converStringToDeciaml('1.0e+10'))
  console.log('parseFloat 结果', parseFloat('1.0e+10', 10))
  console.log(converStringToDeciaml('-1.0e+10'))
  console.log('parseFloat 结果', parseFloat('-1.0e+10', 10))
  console.log(converStringToDeciaml('1.012e+10'))
  console.log('parseFloat 结果', parseFloat('1.012e+10', 10))
  console.log(converStringToDeciaml('-1.012e+10'))
  console.log('parseFloat 结果', parseFloat('-1.012e+10', 10))
  console.log(converStringToDeciaml('.012e+10'))
  console.log('parseFloat 结果', parseFloat('.012e+10', 10))
  console.log(converStringToDeciaml('-.012e+10'))
  console.log('parseFloat 结果', parseFloat('-.012e+10', 10))
  console.log(converStringToDeciaml('0.12e+10'))
  console.log('parseFloat 结果', parseFloat('0.12e+10', 10))
  console.log(converStringToDeciaml('-0.12e+10'))
  console.log('parseFloat 结果', parseFloat('-0.12e+10', 10))
  console.log(converStringToDeciaml('1.2e-10'))
  console.log('parseFloat 结果', parseFloat('1.2e-10', 10))
  console.log(converStringToDeciaml('-1.2e-10'))
  console.log('parseFloat 结果', parseFloat('-1.2e-10', 10))
  console.log(converStringToDeciaml('-1.22'))
  console.log('parseFloat 结果', parseFloat('-1.22', 10))
  console.log(converStringToDeciaml('Infinity'))
  console.log('parseFloat 结果', parseFloat('Infinity', 10))
  console.log(converStringToDeciaml('Infinity2222'))
  console.log('parseFloat 结果', parseFloat('Infinity2222', 10))
  console.log(converStringToDeciaml('22Infinity2222'))
  console.log('parseFloat 结果', parseFloat('22Infinity2222', 10))
```

- 测试截图
- ![第一部分测试截图](http://p1.meituan.net/myvideodistribute/f3bc45ab42eea92318ad58711d21a666220332.png)
- ![第二部分测试截图](http://p1.meituan.net/myvideodistribute/2cf7b8c0ae63f2009cbd77d83dec1e2c176792.png)

## 待解决问题
- 是的 😭 它的浮点数的舍入，我没有想到好的方法，哭唧唧
- 代码地址


## 写在后面
- 祝大家多多发财
