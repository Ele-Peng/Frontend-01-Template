

## 写在前面
- 记录一下将 String 字符串，转成字节流的整个实现过程


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
        bytes[index] = str.charCodeAt(strIndex) & 0xFF;
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

## 写在后面
- 祝大家多多发财