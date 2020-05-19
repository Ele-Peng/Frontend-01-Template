
## 写在前面
- 准备整一下 “基于KMP的FSM处理 pattern” 啦，祝我成功 🙋
- 这里呢~ 准备分为三步去实现
	- FSM 处理字符串
	- KMP 算法概述
	- 基于 KMP 的 FSM 处理 pattern 的实现

<!-- more -->

## 实践记录

### FSM 处理字符串
#### FSM 概念
- 每一个状态都是一个机器
	- 在每一个机器里，我们可以做计算、存储、输出
	- 所有的这些机器接受的输入是一致的
	- 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）
- 每一个机器知道下一个状态
	- 每个机器都有确定的下一个状态（Moore）
	- 每个机器根据输入决定下一个状态（Mealy）

#### 在一个字符串中，找到字符串 abcdef
- 不使用 FSM ，在一个字符串中，找到字符串 abcdef找到字符串 abcdef

	```javascript
	  function match(string) {
	    let foundA = false
	    let foundB = false
	    let foundC = false
	    let foundD = false
	    let foundE = false
	    for (let char of string) {
	      if (char == 'a')
	        foundA = true
	      else if (foundA && char == 'b')
	        foundB = true
	      else if (foundB && char == 'c')
	        foundC = true
	      else if (foundC && char == 'd')
	        foundD = true
	      else if (foundD && char == 'e')
	        foundE = true
	      else if (foundD && char == 'f')
	        return true
	      else {
	        let foundA = false
	        let foundB = false
	        let foundC = false
	        let foundD = false
	        let foundE = false
	      }
	    }
	    return false
	  }
	  console.log(match("I aabcdefghm grood."))
	  console.log(match("I aacdefghm grood."))
	```
	- 运行结果
		- ![第一版运行结果](http://p0.meituan.net/myvideodistribute/40a9e9395d783093ae5e9af1bc2d081c58822.png)
	- 缺点：
		1. 不可扩展代码较多
		2. if else 多次判断

- 使用 FSM ，在一个字符串中，找到字符串 abcdef 

	```javascript
	  function match(string) {
	    let state = start
	    for (let char of string) {
	      state = state(char)
	    }
	    return state === end
	  }
	  function start(char) {
	    if (char === 'a')
	      return findA
	    else
	      return start
	  }
	  function end(char) {
	    return end
	  }
	  function findA(char) {
	    if (char === 'b')
	      return findB
	    else
	      return start(char)
	  }
	  function findB(char) {
	    if (char === 'c')
	      return findC
	    else
	      return start(char)
	  }
	  function findC(char) {
	    if (char === 'd')
	      return findD
	    else
	      return start(char)
	  }
	  function findD(char) {
	    if (char === 'e')
	      return findE
	    else
	      return start(char)
	  }
	  function findE(char) {
	    if (char === 'f')
	      return end
	    else
	      return start
	  }
	  console.log(match("I aabcdefghm grood."))
	  console.log(match("I aacdefghm grood."))
	```
	- 运行结果
		- ![FSM 处理字符串 abcdef](http://p0.meituan.net/myvideodistribute/74431b7630e0a9f8b3aeb65907987b9a80908.png)

### JS 中的有限状态机

```javascript
// 每个函数是一个状态
function state(input) { // 函数参数就是输入
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  return next;
}

/** 以下是调用 **/
while(input) {
  // 获取输入
  state = state(input) // 把状态机的返回值作为下一个状态
}
```

#### 使用 FSM ，在一个字符串中，找到字符串 abcabx

```javascript

  function match(string) {
    let state = start
    for (let char of string) {
      state = state(char)
    }
    return state === end
  }
  function start(char) {
    if (char === 'a')
      return findA
    else
      return start
  }
  function end(char) {
    return end
  }
  function findA(char) {
    if (char === 'b')
      return findB
    else
      return start(char)
  }
  function findB(char) {
    if (char === 'c')
      return findC
    else
      return start(char)
  }
  function findC(char) {
    if (char === 'a')
      return findA2
    else
      return start(char)
  }
  function findA2(char) {
    if (char === 'b')
      return findB2
    else
      return start(char)
  }
  function findB2(char) {
    if (char === 'x')
      return end
    else
      return findB(char)
  }
  match("I aabcabcabx grood.")
```
- 运行结果
	- ![FSM 找到 abcabx](http://p1.meituan.net/myvideodistribute/c09493a569d2d4e21d1600ebd9fcb84589625.png)

#### 使用 FSM ，在一个字符串中，找到字符串 ababx

```javascript
  function match(string) {
    let state = start
    for (let char of string) {
      state = state(char)
    }
    return state === end
  }
  function start(char) {
    if (char === 'a')
      return findA1
    else
      return start
  }
  function end(char) {
    return end
  }
  function findA1(char) {
    if (char === 'b')
      return findB1
    else
      return start(char)
  }
  function findB1(char) {
    if (char === 'a')
      return findA2
    else
      return start(char)
  }
  function findA2(char) {
    if (char === 'b')
      return findB2
    else
      return start(char)
  }
  function findB2(char) {
    if (char === 'a')
      return findA3
    else
      return start(char)
  }
  function findA3(char) {
    if (char === 'b')
      return findB3
    else
      return start(char)
  }
  function findB3(char) {
    if (char === 'x')
      return end
    else
      return findB2(char)
  }
  console.log(match("I aababababx grood."))
  console.log(match("I aabababababx grood."))
  console.log(match("I aababaeababx grood."))
  console.log(match("I aabababaabx grood."))
```
- 运行结果
	- ![abababx](http://p0.meituan.net/myvideodistribute/6c000a617a3f594e24bf99c52d4d0848101059.png)

【那我们该如何利用 FSM 处理未知 pattern 呢？🤔

【字符串匹配问题就是在一个文本字符串T中搜索某个模式字符串P的所有出现位置。

### KMP 算法概述
#### KMP 最长公共前后缀长度
- 假如 pattern 为 ABABCABAA
	- 前缀依次为 A AB ABA ABAB ABABC ABABCA ABABCAB ABABCABA
	- 后缀依次为 A AA BAA ABAA CABAA BCABAA ABCABAA BABCABAA
- 那么它的最长公共前后缀长度为多少呢？
	- A --> 0
		- 无前缀
		- 无后缀
		- 最长公共前后缀：""，len = 0
	- AB --> 0
		- 前缀 A
		- 后缀 B
		- 最长公共前后缀：""，len = 0
	- ABA --> 1
		- 后缀 B BA 
		- 最长公共前后缀：A，len = 1
	- ABAB --> 2
		- 前缀 A AB ABA
		- 后缀 B AB BAB 
		- 最长公共前后缀：AB，len = 2
	- ABABC --> 0
		- 前缀 A AB ABA ABAB
		- 后缀 C BC ABC BABC
		- 最长公共前后缀：""，len = 0
	- ABABCA --> 1
		- 前缀 A AB ABA ABAB ABABC
		- 后缀 A CA BCA ABCA BABCA
		- 最长公共前后缀：A，len = 1
	- ABABCAB --> 2
		- 前缀 A AB ABA ABAB ABABC ABABCA
		- 后缀 B AB CAB BCAB ABCAB BACAB
		- 最长公共前后缀：AB，len = 2
	- ABABCABA --> 3
		- 前缀 A AB ABA ABAB ABABC ABABCA ABABCAB
		- 后缀 A BA ABA CABA BCABA ABCABA BABCABA
		- 最长公共前后缀：ABA，len = 3
	- ABABCABAA --> 1
		- 前缀 A AB ABA ABAB ABABC ABABCA ABABCAB ABABCABA
		- 后缀 A AA BAA ABAA CABAA BCABAA ABCABAA BABCABAA
		- 最长公共前后缀：A，len = 1
- 因此我们可以构建出，最长公共前后缀长度为
	- [0, 0, 1, 2, 0, 1, 2, 3, 1] 对应 pattern 字符串数组
	- [A, B, A, B, C, A, B, A, A]
	- [0, 1, 2, 3, 4, 5, 6, 7, 8]
- 那么根据
	- A --> len = 0, i = 0
	- AB --> len = 0, i = 1
	- <u>A</u>B<u>A</u> --> len = 1, i = 2, pattern[i] = A, pattern[上一个len] = A
	- <u>AB</u><u>AB</u> --> len = 2, i = 3, pattern[i] = B, pattern[上一个len] = B
	- ABABC --> len = 0, i = 4
	- <u>A</u>BABC<u>A</u> --> len = 1, i = 5, pattern[i] = A, pattern[上一个len] = A
	- <u>AB</u>ABC<u>AB</u> --> len = 2, i = 6, pattern[i] = B, pattern[上一个len] = B
	- <u>ABA</u>BC<u>ABA</u> --> len = 3, i = 7, pattern[i] = A, pattern[上一个len] = A
	- ABABCABAA --> len = 1, i = 8
	- 我们可以观察得到
		
		```javascript
		if (pattern[i] === pattern[len]) {
	        len ++;
	        prefix[i] = len;
	        i ++;
	    }
		```
	- 除此之外的情况呢？比如最后的 ABABCABAA --> len = 1, i = 8
		- [0, 1, 2, 3, 4, 5, 6, 7, 8] 字符串数组下标索引
		- [A, B, A, B, C, A, B, A, A] 字符串数组
		- [0, 0, 1, 2, 0, 1, 2, 3, ?] prefixTable
			- 我们可以发现，前一个字符 A 对应的 prefix 为 3，对应的pattern[3]为 B（prefix[len - 1] === B），B的前一个字符 A 对应的 prefix 为 1（len = prefix[len - 1] --> 0），pattern[1] 为 A，再执行上层代码 prefix[8] === len[0]
	
	
- KMP 最长公共前后缀长度实现

	```javascript
	function prefixTable(pattern, prefix, n) {
	    prefix[0] = 0; // prefix 初始
	    let len = 0; // 最长公共前后缀长度
	    let i = 1;
	    while(i < n) {
	      if (pattern[i] === pattern[len]) {
	        len ++;
	        prefix[i] = len;
	        i ++;
	      } else {
	        if (len > 0) {
	          len = prefix[len - 1]
	        }
	        else {
	          prefix[i] = len
	          i ++
	        }
	      }
	      console.log(prefix)
	    }
	  }
	```
- 运行结果
	- ![运行结果](http://p0.meituan.net/myvideodistribute/354d6d33c10aa23f150c26a68a09f19084870.png)
- 再添一层处理，因为前缀是不不会包括自己本身的，所以我们需要整体后移一位，并且，空出来的第一项置为 -1

	```javascript
	function movePrefixTable(prefix, n) {
	    for (let i = n - 1; i > 0; i --) {
	      prefix[i] = prefix[i - 1]
	    }
	    prefix[0] = -1
	}
	```
	
#### KMP 处理 pattern

```javascript
  function prefixTable(pattern, prefix, n) {
    prefix[0] = 0; // prefix 初始
    let len = 0; // 最长公共前后缀长度
    let i = 1;
    while(i < n) {
      if (pattern[i] === pattern[len]) {
        len ++;
        prefix[i] = len;
        i ++;
      } else {
        if (len > 0) {
          len = prefix[len - 1]
        }
        else {
          prefix[i] = len
          i ++
        }
      }
      console.log(prefix)
    }
  }

  function movePrefixTable(prefix, n) {
    for (let i = n - 1; i > 0; i --) {
      prefix[i] = prefix[i - 1]
    }
    prefix[0] = -1
  }

  function kmpSearch(text, pattern) {
    const patternArray = pattern.split("")
    let patternLen = patternArray.length
    const textArray = text.split("")
    let textLen = textArray.length

    let prefixArray = new Array(patternLen)
    prefixTable(patternArray, prefixArray, patternLen)
    movePrefixTable(prefixArray, patternLen)

    // console.log('prefixTemp', prefixTemp)
    console.log('prefixArray', prefixArray)

    // textArray len m
    // pattern len n

    let i = 0, j = 0;
    while(i < textLen) {
      if (j === patternLen - 1 && textArray[i] === patternArray[j]) {
        console.log("Found pattern at ", i - j)
        j = prefixArray[j]
      }
      if (textArray[i] === patternArray[j]) {
        i ++;
        j ++;
      } else {
        j = prefixArray[j]
        if (j === -1) {
          i ++;
          j ++;
        }
      }
    }
  }

  kmpSearch("ABABABABCABAAB", "ABABCABAA")
```
- 运行结果
	- ![运行结果](http://p0.meituan.net/myvideodistribute/f4273ce6b530673651ce3a9f513c730760549.png)
	- ![运行结果](http://p0.meituan.net/myvideodistribute/214a8fcf81cda92716e44270f816392663018.png)

### 基于 KMP 的 FSM 处理 pattern

```javascript


  let textArray = [] // 未知字符串
  let text = ""
  let textLen = 0 // 未知字符串长度
  let patternArray = [] // pattern 字符串
  let pattern = ""
  let patternLen // 未知 pattern 长度
  let prefixArray = null // KMP prefix table
  let len = 0 // 最长公共前后缀长度


  function initState() {
    patternArray = pattern.split("")
    patternLen = patternArray.length
    textArray = text.split("")
    textLen = textArray.length
    prefixArray = new Array(patternLen)
    prefixArray[0] = 0
    let len = 0
    return patteranStart
  }


  function patteranStart(i) {
    if (patternArray[i] === patternArray[len]) {
      len++;
      prefixArray[i] = len;
      return { needAdd: true };
    } else {
      if (len > 0) {
        len = prefixArray[len - 1]
        return { needAdd: false }
      }
      else {
        prefixArray[i] = len
        return { needAdd: true }
      }
    }
    if (i ===  patternLen) {
      return movePrefixTable
    }
  }


  function movePrefixTable() {
    for (let i = patternLen - 1; i > 0; i--) {
      prefixArray[i] = prefixArray[i - 1]
    }
    prefixArray[0] = -1
    return KMPSearch
  }


  function KMPSearch(i, j) {
    if (j === patternLen - 1 && textArray[i] === patternArray[j]) {
      j = prefixArray[j]
      return { iNeedAdd: false, jNeedAdd: false, isMatched: true }
    }
    if (textArray[i] === patternArray[j]) {
      return { iNeedAdd: true, jNeedAdd: true, isMatched: false }
    } else {
      j = prefixArray[j]
      if (j === -1) {
        return { iNeedAdd: true, jNeedAdd: true, isMatched: false }
      }
    }
    return { iNeedAdd: true, jNeedAdd: false, isMatched: false }
  }
  
  const STATUS_MAP = {
    "init": initState,
    "prefixtable": patteranStart,
    "movePrefixTable": movePrefixTable,
    "KMPSearch": KMPSearch
  }

  function match(_text, _pattern) {
    text = _text
    pattern = _pattern

    let patternState = initState
    let STATUS_MAP_KEYS = Object.keys(STATUS_MAP)

    for (let status = 0; status < STATUS_MAP_KEYS.length; status++) {
      patternState = STATUS_MAP[STATUS_MAP_KEYS[status]]
      if (STATUS_MAP_KEYS[status] === "init") {

        patternState()

      } else if (STATUS_MAP_KEYS[status] === "prefixtable") {

        let res = { len: 0, needAdd: true }
        for (let i = 1; i <= patternLen; res.needAdd && i++) {
          res = patternState(i)
        }

      } else if (STATUS_MAP_KEYS[status] === "movePrefixTable") {

        patternState()

      } else if (STATUS_MAP_KEYS[status] === "KMPSearch") {

        let kmpSearchRes = { iNeedAdd: false, jNeedAdd: false, isMatched: false }
        for (let i = 0, j = 0; i < textLen;) {
          kmpSearchRes = patternState(i, j)
          if (kmpSearchRes.isMatched) {
            console.log("First Found pattern at ", i - j)
            return kmpSearchRes.isMatched
          }
          if (kmpSearchRes.iNeedAdd)
            i++
          if (kmpSearchRes.jNeedAdd)
            j++
        }
        return kmpSearchRes.isMatched

      }
    }
  }

  match("ABABABABCABAAB", "ABABCABAA")
```

- 运行结果
	- ![基于 KMP 的 FSM 处理 pattern 运行结果](http://p0.meituan.net/myvideodistribute/7079d40d337c97ae742c21e0f7a2f87320359.png)

	
## 参考
- [KMP 算法视频讲解](https://www.bilibili.com/video/BV1Px411z7Yo)
- [KMP-最长公共前后缀长度](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)



## 写在后面
- 非常有趣 ~~~~ 开熏
- 学而不思则罔 互勉
- 祝大家多多发财