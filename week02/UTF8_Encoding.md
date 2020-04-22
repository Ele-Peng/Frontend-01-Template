
## 写在前面
- 记录一下将 String 字符串，转成字节流的整个实现过程

<!-- more -->

## 实践过程
#### 总体思路
- 统计字符串长度
- 循环遍历字符串，进行编码
- 输出编码后的字节流

```javascript
function UTF8_Encoding(str) {
   let length = str.length,
        strIndex = -1,
        strEnd = length - 1,
        bytes = new Uint8Array(length),
        index = 0;

    while (strIndex++ < strEnd) {
        bytes[index] = str.charCodeAt(strIndex) & 0xFF; // 设置为低8位值
        index += 1;
    }

    return bytes;
}
```

## 字节流文件转 String
#### 总体思路
- 统计字节流长度
- 循环遍历字节流，进行解码
- 输出解码后的字节流

```javascript
function UTF8_Decoding(bytes) {
    var str = "",
        bytesIndex = -1,
        bytesEnd = bytes.length - 1;

    while (bytesIndex ++ < bytesEnd) {
        str += String.fromCharCode(bytes[bytesIndex]);
    }

    return str;
};
```

#### 测试截图
- ![测试截图](http://p0.meituan.net/myvideodistribute/1adbcd8a4c10e2fd308373e0050eafce62354.png)


## 类型化数组
- 类型化数组中的元素都是数字。使用构造函数在创建类型化数组的时候决定了数组中数字（有符号或者无符号整数或者浮点数）的类型和大小（以位为单位）
- 类型化数组有固定的长度。
- 在创建类型化数组的时候，数组中的元素总是默认初始化为0.
- **类型化数组**
	- **TypedArray** 视图支持的数据类型一共有 9 种（ **DataView** 视图支持除 **Uint8C** 以外的其他 8 种）。

		| 数据类型 | 字节长度 | 含义 | 对应的 C 语言类型 |
		| --- | --- | --- | --- |
		| Int8 | 1 | 8 位带符号整数 | signed char |
		| Uint8 |	1 |	8 位不带符号整数 |	unsigned char |
		| Uint8C | 1 | 8 位不带符号整数（自动过滤溢出）|unsigned char |
		| Int16 |	2 |	16 位带符号整数 |	short |
		| Uint16 | 2 | 16 位不带符号整数 | unsigned short |
		| Int32 |	4 | 32 位带符号整数 | int |
		| Uint32 | 4 | 32 位不带符号的整数 | unsigned int |
		| Float32 | 4	 | 32 位浮点数 | float |
		| Float64 | 8 |	64 位浮点数 | double |
- 在创建一个类型化数组的时候，可以传递数组大小给构造函数，或者传递一个数组或者类型化数组来用于初始化数组元素。一旦创建了类型化数组，就可以像操作其他类数组对象那样，通过常规的中括号表示法来对数组元素进行读/写操作。

	```javascript
	var bytes = new Uint8Array(1024); // 1kb字节 
	for (var i = 0; i < bytes.length; i ++) // 循环数组的每个元素
	for (var i = 0; i < bytes.length; i ++) // 循环数组的每个元素
		bytes[i] = i & 0xFF; // 设置为索引的低8位值
	var copy = new Uint8Array(bytes); // 创建数组的副本
	var ints = new Int32Array([0, 1, 2, 3]); // 包含这4个int值的类型化数组
	```
- 类型化数组：他们都是**基本字节块的视图**，称为一个 ArrayBuffer 。ArrayBuffer 只是不透明的字节块。可以通过类型化数组获取这些字节，但是 ArrayBuffer 自己并不是一个类型化数组。可以像对任意 Javascript 对象那样，使用数字数组索引来操作 ArrayBuffer。但是，这样做并**不能赋予访问缓冲区中字节的权限**
	
	```javascript
	var bytes = new Uint8Array(8); // 分配8个字节
	bytes[0] = 1 // 把第一个字节设置为1
	bytes.buffer[0] = 255 // 错误获取，缓冲区中没有索引值0
	bytes.buffer[1] = 255 // 错误设置缓冲区字节
	
	```

### “字节顺序”
- 字节组织成更长的字的顺序
- 为了高效，类型化数组采用底层硬件的原生顺序。在低位优先(little-endian)系统中， ArrayBuffer 中数字的字节是按照从低位到高位的顺序排列的。在高位优先(big-endian)系统中，字节是按照从高位到低位的顺序排列的。
- 可以使用如下代码来检测系统的字节顺序：

	```javascript
	// 如果整数 Ox00000001 在内存中表示成： 01 00 00 00
	// 则说明当前系统是低位优先系统
	// 相反，在高位优先系统中，它会表示成：00 00 00 01
	var little_endian = new Int8Array(new Int32Array([1]).buffer)[0] === 1
	```
	
## 思考问题 0.1 + 0.2 ≠ 0.3
- 我们可以先来看看 十进制小数的二进制表示：
	- 整数部分：除以2，取出余数，商继续除以2，直到得到0为止，将取出的余数逆序
	- 小数部分：乘以2，然后取出整数部分，将剩下的小数部分继续乘以2，然后再取整数部分，一直取到小数部分为零为止。如果永远不为零，则按要求保留足够位数的小数，最后一位做0舍1入。将取出的整数顺序排列。
	- 所以 0.1 可以表示为
		- 0.000110011001100110011...
	- 0.2 可以表示为
		- 0.00110011001100110011...

		
```javascript
// 0.1 和 0.2 都转化成二进制后再进行运算
0.00011001100110011001100110011001100110011001100110011010 +
0.0011001100110011001100110011001100110011001100110011010 =
0.0100110011001100110011001100110011001100110011001100111

// 转成十进制正好是 0.30000000000000004
```

- 二进制数转成 IEEE 754 标准


	- ![IEEE 754 标准](http://p0.meituan.net/myvideodistribute/eefbaacb81e66deb742370e27d9e3bb876872.png)

	- 使用 64 位固定长度来表示，也就是标准的double 双精度浮点数。
	- 这样的存储结构优点是可以归一化处理整数和小数，节省存储空间。
	- 这64个比特又可分为三个部分，即：
		- 第1位: 是符号的标志位(S), 0代表正数，1代表负数
		- 第1-11位: 指数位(E), 存储指数（exponent），用来表示次方数
		- 第12-63位: 尾数(M), 这52 位是尾数，超出的部分自动进一舍零
	- 实际数字就可以用以下公式来计算：
		
		- ![IEEE 754数学公式](http://p0.meituan.net/myvideodistribute/7b2c9fce00cfe3bf57fcede347257af276632.png)

	- 因此 0.1 的二进制表示：	

		> 0.00011001100110011001100110011001100110011001100110011001100...
	
		- 首先 0.1 是正数，标志位 
		
			> Sign = 0
			
		- 其次, 将小数转化为科学计数法
			
			> 1.100110011001100110011001100110011001100110011001100... * 2^-4
			
			- 相对于，小数点移了4位，指数减4
			
				> exponent = -4 + 1023 = 1019
				
				> 01111111011

		- 由于科学计数法, 第一个数始终是1, 所以可以忽略存储, 只要存后面的52位就可以了
		- **如果超过了52位, 就是对第53位舍0进1**（精度误差）, 结果也就是

			> 100110011001100110011001100110011001100110011001101
		
	- 因此 0.1 的 IEEE 754 的表示：
	
		- ![0.1 的IEEE 754](http://p0.meituan.net/myvideodistribute/1ae3cf9f7bda61d8d0849ce05f7657f997288.png)
	- 同理 0.2 的 IEEE 754 的表示：
		
		- ![0.2 的 IEEE 754](http://p0.meituan.net/myvideodistribute/0c5d93145800b45b59a3ef23dc2abe4a97936.png)

### 查看 0.1 表示方式

```javascript
let b = new Float64Array([0.1])
console.log(b)
let intArr = new Uint8Array(b.buffer)
for (let i = 7; i > 0; i --) {
    s = intArr[i].toString(2)
    while(s.length < 8) {
        s = '0' + s
    }
    console.log(s)

}
```	

- ![低位优先系统](http://p0.meituan.net/myvideodistribute/d996e0a508b796f5a3d4f4866c1bf43064783.png)
- 首先我们的系统是低位优先系统(little_endian)
- ![查看 0.1 表示方式截图](http://p0.meituan.net/myvideodistribute/de79ee3caac77ddad9398cfeaaf3719f227171.png)
	- 0 --> 标志位
	- 011111111011 --> 指数位
	- 1001{11}1010 --> 尾数
## 写在后面
- 祝大家多多发财