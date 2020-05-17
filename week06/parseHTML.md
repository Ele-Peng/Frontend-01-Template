
## 写在前面
- implementation of a toy-browser 🙆
- 现在我们可以写 HTML 的解析啦，开不开心！😝
- ![HTML 的解析](http://p1.meituan.net/myvideodistribute/6e1d35dcd8c01b557925f8d799583cb1130452.png)

<!-- more -->



## 实践过程

### 第一步：拆分文件
- 为了方便文件管理，我们把parse单独拆到文件中
- parser 接受 HTML 文本作为参数，返回一颗 DOM 树


- server.js

	```javascript
	const server = http.createServer((req, res) => {
	
	  ... some code 
	  
	  res.end(
	    `<html maaa=a >
	    <head>
	        <style>
	    body div #myid{
	        width:100px;
	        background-color: #ff5000;
	    }
	    body div img{
	        width:30px;
	        background-color: #ff1111;
	    }
	        </style>
	    </head>
	    <body>
	        <div>
	            <img id="myid"/>
	            <img />
	        </div>
	    </body>
	    </html>`);
	});
	
	server.listen(8088);
	```
- client.js
	
	```javascript
	... some code
	
	void async function () {
	
	  ... some code
	  
	  let dom = parser.parseHTML(response.body)
	  
	}()
	```

- parseHTML1.js


	```javascript
	// 拆分文件
	
	module.exports.parseHTML = function parseHTML(html){
	
	  console.log(html)
	  
	}
	```
	
- 运行结果
	- ![运行结果](http://p0.meituan.net/myvideodistribute/98a64e9c9eb9f97c01b0bb4ccb0141f976175.png)
	
### 第二步：创建状态机
- 我们用 FSM 来实现 HTML 的分析
- 在 HTML 标准中，已经规定了 HTML 的状态
- Toy-Browser 只挑选其中的一部分状态，完成一个最简版本


- parseHTML2.js

	```javascript
	// 初始化 FSM - Finite State Machine

	const EOF = Symbol("EOF")
	
	function data(char) {
	
	}
	
	module.exports.parseHTML = function parseHTML(html){
	
	  let state = data
	
	  for (let char of html) {
	    state = state(c)
	  }
	
	  state = state(EOF)
	  
	}
	```
	
### 第三步：解析标签
- 主要的标签有：开始标签，结束标签和自封闭标签
- 在这一步我们暂时忽略属性

- 【未完：状态图分析】
- parseHTML3.js

	```javascript
	// 解析标签

	const EOF = Symbol("EOF")
	
	function data(char) {
	  if (char == "<") {
	    return tagOpen
	  } else if (char == EOF) {
	    return 
	  } else {
	    return data
	  }
	}
	
	
	// 1. 开始标签
	// 2. 结束标签
	// 3. 自封闭标签
	function tagOpen(char) {
	  if (char == "/") { // 结束标签
	    return endTagOpen
	  } else if (char.match(/^[a-zA-Z]$/)) { // 开始标签
	    return tagName(char)
	  } else {
	    return 
	  }
	}
	
	
	function endTagOpen(char) {
	  if (char.match(/^[a-zA-Z]$/)) {
	    return tagName(char)
	  } else if (char == ">") {
	
	  } else if(char == EOF) {
	
	  }
	}
	
	
	function tagName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char.match(/^[a-zA-Z]$/)) {
	    return tagName
	  } else if (char == ">") {
	    return data
	  } else {
	    return tagName
	  }
	}
	
	
	function beforeAttributeName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == ">") {
	    return data
	  } else if (char == "=") {
	    return beforeAttributeName
	  } else {
	    return beforeAttributeName
	  }
	}
	
	
	function selfClosingStartTag(char) {
	  if (char == ">") {
	    return data
	  } else if (char == "EOF") {
	
	  } else {
	
	  }
	}
	
	module.exports.parseHTML = function parseHTML(html){
	
	  let state = data
	
	  for (let char of html) {
	    state = state(char)
	  }
	
	  state = state(EOF)
	  
	}
	```
	
### 第四步：创建元素
- 在状态中，除了状态迁移，我们还会要加入业务逻辑
- 我们在标签结束状态提交标签 token
- parseHTML4.js

	```javascript
	// emitToken 创建元素

	let currentToken = null
	
	function emit(token) {
	  if (token.type != "text") 
	    console.log(token)
	}
	
	const EOF = Symbol("EOF")
	
	function data(char) {
	  if (char == "<") {
	    return tagOpen
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char == ">") {
	    emit(currentToken)
	    return data
	  } else if (char == EOF) {
	    emit({
	      type: "EOF"
	    })
	    return 
	  } else {
	    return data
	  }
	}
	
	
	// 1. 开始标签
	// 2. 结束标签
	// 3. 自封闭标签
	function tagOpen(char) {
	  if (char == "/") { // 结束标签
	    return endTagOpen
	  } else if (char.match(/^[a-zA-Z]$/)) { // 开始标签
	    currentToken = {
	      type: "startTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else {
	    return 
	  }
	}
	
	
	function endTagOpen(char) {
	  if (char.match(/^[a-zA-Z]$/)) {
	    currentToken = {
	      type: "endTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else if (char == ">") {
	
	  } else if(char == EOF) {
	
	  }
	}
	
	
	function tagName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName(char)
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char.match(/^[a-zA-Z]$/)) {
	    currentToken.tagName += char.toLowerCase()
	    return tagName
	  } else if (char == ">") {
	    emit(currentToken)
	    return data
	  } else {
	    return tagName
	  }
	}
	
	
	function beforeAttributeName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == ">") {
	    return beforeAttributeName
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char == EOF) {
	    return 
	  } else if (char == "=") {
	    return data
	  } else {
	    return beforeAttributeName
	  }
	}
	
	
	function selfClosingStartTag(char) {
	  if (char == ">" || char == "/") {
	    currentToken.isSelfClosing = true
	    currentToken.type = "selfClosingTag"
	    emit(currentToken)
	    return data
	  } else if (char == "EOF") {
	
	  } else {
	
	  }
	}
	
	module.exports.parseHTML = function parseHTML(html){
	
	  let state = data
	
	  for (let char of html) {
	    state = state(char)
	  }
	
	  state = state(EOF)
	  
	}
	```
	
- 运行结果
	- ![第四步运行结果](http://p0.meituan.net/myvideodistribute/5c4078e02702211bbe87ca75d2044cdb106832.png)

	
### 第五步：处理属性
- 属性分为单引号、双引号、无引号三种写法，因此需要较多状态处理
- 处理属性的方式跟标签类似
- 属性结束时，我们把属性加到标签 token 上

- parseHTML5.js

	```javascript
	// 处理属性 attribute

	let currentToken = null
	let currentAttribute = null
	
	function emit(token) {
	  if (token.type != "text") 
	    console.log(token)
	}
	
	const EOF = Symbol("EOF")
	
	function data(char) {
	  if (char == "<") {
	    return tagOpen
	  } else if (char == EOF) {
	    emit({
	      type: "EOF"
	    })
	    return 
	  } else {
	    emit({
	      type: "text",
	      content: char
	    })
	    return data
	  }
	}
	
	
	// 1. 开始标签
	// 2. 结束标签
	// 3. 自封闭标签
	function tagOpen(char) {
	  if (char == "/") { // 结束标签
	    return endTagOpen
	  } else if (char.match(/^[a-zA-Z]$/)) { // 开始标签
	    currentToken = {
	      type: "startTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else {
	    // return data
	  }
	}
	
	
	function endTagOpen(char) {
	  if (char.match(/^[a-zA-Z]$/)) {
	    currentToken = {
	      type: "endTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else if (char == ">") {
	    // return data
	  } else if(char == EOF) {
	    // return data
	  }
	}
	
	
	function tagName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName(char)
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char.match(/^[a-zA-Z]$/)) {
	    currentToken.tagName += char.toLowerCase()
	    return tagName
	  } else if (char == ">") {
	    emit(currentToken)
	    return data
	  } else {
	    return tagName
	  }
	}
	
	
	function beforeAttributeName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == ">" || char == "/" || char == EOF) {
	    return afterAttributeName(char)
	  } else if (char == "=") {
	    return 
	  } else {
	    currentAttribute = {
	      name: "",
	      value: ""
	    }
	    return attributeName(char)
	  }
	}
	
	function afterAttributeName(char) {
	  if (char == "/") {
	    return selfClosingStartTag
	  } else if (char == EOF) {
	    return 
	  } else {
	    emit(currentToken)
	    return data
	  }
	}
	
	function attributeName(char) {
	  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
	    return afterAttributeName(char)
	  } else if (char == "=") {
	    return beforeAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == "\"" || char == "\'" || char == "<") {
	    return attributeName
	  } else {
	    currentAttribute.name += char
	    return attributeName
	  }
	}
	
	function beforeAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
	    return beforeAttributeValue
	  } else if (char == "\"") {
	    return doubleQuotedAttributeValue
	  } else if (char == "\'") {
	    return singleQuotedAttributeValue
	  } else if (char == ">") {
	    emit(currentToken)
	    // return data
	  } else {
	    return UnquotedAttributeValue(char)
	  }
	}
	
	function doubleQuotedAttributeValue(char) {
	  if (char == "\"") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    return afterQuotedAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return doubleQuotedAttributeValue
	  }
	}
	
	function singleQuotedAttributeValue(char) {
	  if (char == "\'") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    return afterQuotedAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return singleQuotedAttributeValue
	  }
	}
	
	function afterQuotedAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char ==">") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    emit(currentToken)
	    return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    // return data
	  }
	}
	
	function UnquotedAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    // emit(currentToken)
	    return beforeAttributeName
	  } else if (char == "/") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    // emit(currentToken)
	    return selfClosingStartTag
	  } else if (char == ">") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    emit(currentToken)
	    return data
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == "\"" || char == "\'" || char == "<" || char == "=" || char == "`") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return UnquotedAttributeValue
	  }
	}
	
	
	function selfClosingStartTag(char) {
	  if (char == ">" || char == "/") {
	    currentToken.isSelfClosing = true
	    currentToken.type = "selfClosingTag"
	    emit(currentToken)
	    return data
	  } else if (char == "EOF") {
	    // return data
	  } else {
	    // return data
	  }
	}
	
	module.exports.parseHTML = function parseHTML(html){
	
	  let state = data
	
	  for (let char of html) {
	    state = state(char)
	    // console.log(state)
	  }
	
	  state = state(EOF)
	  
	}
	```

- 运行结果
	- ![第五步运行结果](http://p0.meituan.net/myvideodistribute/3b45aac402868fe1c62c7d7debbcfd24114412.png)

	
### 第六步：构建 DOM 树
- 从标签创建 DOM 树的基本技巧是使用栈
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
- 自封闭节点可视为入栈后立刻出栈
- 任何元素的父元素是它入栈前的栈顶
- parseHTML6.js

	```javascript
	// 处理属性 constructTree

	let currentToken = null
	let currentAttribute = null
	
	let stack = [{type: "document", children: []}]
	
	function emit(token) {
	  if (token.type == "text") 
	    return
	
	  let top = stack[stack.length - 1]
	
	
	  if (token.type == "startTag") {
	    let element = {
	      type: "element",
	      children: [],
	      attributes: []
	    }
	
	    element.tagName = token.tagName
	
	    for (let p in token) {
	      if (p != "type" && p != "tagName") {
	        element.attributes.push({
	          name: p,
	          value: token[p]
	        })
	      }
	    }
	
	    top.children.push(element)
	    element.parent = top
	
	    if (!token.isSelfClosing)
	      stack.push(element)
	
	    console.log('push', element)
	
	  } else if (token.type == "endTag") {
	    if (top.tagName != token.tagName) {
	      throw new Error("Tag start end doesn't match")
	    } else {
	      console.log('pop', stack.pop())
	    }
	  }
	}
	
	const EOF = Symbol("EOF")
	
	function data(char) {
	  if (char == "<") {
	    return tagOpen
	  } else if (char == EOF) {
	    emit({
	      type: "EOF"
	    })
	    return 
	  } else {
	    emit({
	      type: "text",
	      content: char
	    })
	    return data
	  }
	}
	
	
	// 1. 开始标签
	// 2. 结束标签
	// 3. 自封闭标签
	function tagOpen(char) {
	  if (char == "/") { // 结束标签
	    return endTagOpen
	  } else if (char.match(/^[a-zA-Z]$/)) { // 开始标签
	    currentToken = {
	      type: "startTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else {
	    // return data
	  }
	}
	
	
	function endTagOpen(char) {
	  if (char.match(/^[a-zA-Z]$/)) {
	    currentToken = {
	      type: "endTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else if (char == ">") {
	    // return data
	  } else if(char == EOF) {
	    // return data
	  }
	}
	
	
	function tagName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName(char)
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char.match(/^[a-zA-Z]$/)) {
	    currentToken.tagName += char.toLowerCase()
	    return tagName
	  } else if (char == ">") {
	    emit(currentToken)
	    return data
	  } else {
	    return tagName
	  }
	}
	
	
	function beforeAttributeName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == ">" || char == "/" || char == EOF) {
	    return afterAttributeName(char)
	  } else if (char == "=") {
	    return 
	  } else {
	    currentAttribute = {
	      name: "",
	      value: ""
	    }
	    return attributeName(char)
	  }
	}
	
	function afterAttributeName(char) {
	  if (char == "/") {
	    return selfClosingStartTag
	  } else if (char == EOF) {
	    return 
	  } else {
	    emit(currentToken)
	    return data
	  }
	}
	
	function attributeName(char) {
	  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
	    return afterAttributeName(char)
	  } else if (char == "=") {
	    return beforeAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == "\"" || char == "\'" || char == "<") {
	    return attributeName
	  } else {
	    currentAttribute.name += char
	    return attributeName
	  }
	}
	
	function beforeAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
	    return beforeAttributeValue
	  } else if (char == "\"") {
	    return doubleQuotedAttributeValue
	  } else if (char == "\'") {
	    return singleQuotedAttributeValue
	  } else if (char == ">") {
	    emit(currentToken)
	    // return data
	  } else {
	    return UnquotedAttributeValue(char)
	  }
	}
	
	function doubleQuotedAttributeValue(char) {
	  if (char == "\"") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    return afterQuotedAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return doubleQuotedAttributeValue
	  }
	}
	
	function singleQuotedAttributeValue(char) {
	  if (char == "\'") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    return afterQuotedAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return singleQuotedAttributeValue
	  }
	}
	
	function afterQuotedAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char ==">") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    emit(currentToken)
	    return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    // return data
	  }
	}
	
	function UnquotedAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    // emit(currentToken)
	    return beforeAttributeName
	  } else if (char == "/") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    // emit(currentToken)
	    return selfClosingStartTag
	  } else if (char == ">") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    emit(currentToken)
	    return data
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == "\"" || char == "\'" || char == "<" || char == "=" || char == "`") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return UnquotedAttributeValue
	  }
	}
	
	
	function selfClosingStartTag(char) {
	  if (char == ">" || char == "/") {
	    currentToken.isSelfClosing = true
	    emit(currentToken)
	    return data
	  } else if (char == "EOF") {
	    // return data
	  } else {
	    // return data
	  }
	}
	
	module.exports.parseHTML = function parseHTML(html){
	
	  let state = data
	
	  for (let char of html) {
	    state = state(char)
	    // console.log(state)
	  }
	
	  state = state(EOF)
	  
	  console.log(stack)
	}
	```
	
- 运行结果：这边我在每次对栈操作时(push/pop)时，添加了 console
	- ![第六步运行结果](http://p1.meituan.net/myvideodistribute/f83a95f5afec8c5ad34c8df0a34a6ff8116344.png)
- 这边推荐使用 [vs-code debugger 使用方法](https://code.visualstudio.com/docs/editor/debugging)
	- ![第六步运行结果 vscode debugger](http://p0.meituan.net/myvideodistribute/7a4cb0d87ac89cb3a5ae4252c3a5d6a7321211.png)


### 第七步：文本节点
- 文本节点与自封闭标签处理类似
- 多个文本节点需要合并

- parseHTML7.js

	```javascript
	// 处理文本节点 combineText

	let currentToken = null
	let currentAttribute = null
	let currentTextNode = null
	
	let stack = [{type: "document", children: []}]
	
	function emit(token) {
	
	  let top = stack[stack.length - 1]
	
	  if (token.type == "startTag") {
	    let element = {
	      type: "element",
	      children: [],
	      attributes: []
	    }
	
	    element.tagName = token.tagName
	
	    for (let p in token) {
	      if (p != "type" && p != "tagName") {
	        element.attributes.push({
	          name: p,
	          value: token[p]
	        })
	      }
	    }
	
	    top.children.push(element)
	    element.parent = top
	
	    if (!token.isSelfClosing)
	      stack.push(element)
	    
	    currentTextNode = null
	    // console.log('push', element)
	  } else if (token.type == "endTag") {
	    if (top.tagName != token.tagName) {
	      throw new Error("Tag start end doesn't match")
	    } else {
	      // console.log('pop', stack.pop())
	      stack.pop()
	    }
	    currentTextNode = null
	  } else if (token.type == "text") {
	    if (currentTextNode == null) {
	      currentTextNode = {
	        type: "text",
	        content: ""
	      }
	      top.children.push(currentTextNode)
	    }
	    currentTextNode.content += token.content
	    // console.log(top.children)
	  }
	}
	
	const EOF = Symbol("EOF")
	
	function data(char) {
	  if (char == "<") {
	    return tagOpen
	  } else if (char == EOF) {
	    emit({
	      type: "EOF"
	    })
	    return 
	  } else {
	    emit({
	      type: "text",
	      content: char
	    })
	    return data
	  }
	}
	
	
	// 1. 开始标签
	// 2. 结束标签
	// 3. 自封闭标签
	function tagOpen(char) {
	  if (char == "/") { // 结束标签
	    return endTagOpen
	  } else if (char.match(/^[a-zA-Z]$/)) { // 开始标签
	    currentToken = {
	      type: "startTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else {
	    // return data
	  }
	}
	
	
	function endTagOpen(char) {
	  if (char.match(/^[a-zA-Z]$/)) {
	    currentToken = {
	      type: "endTag",
	      tagName: ""
	    }
	    return tagName(char)
	  } else if (char == ">") {
	    // return data
	  } else if(char == EOF) {
	    // return data
	  }
	}
	
	
	function tagName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName(char)
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char.match(/^[a-zA-Z]$/)) {
	    currentToken.tagName += char.toLowerCase()
	    return tagName
	  } else if (char == ">") {
	    emit(currentToken)
	    return data
	  } else {
	    return tagName
	  }
	}
	
	
	function beforeAttributeName(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == ">" || char == "/" || char == EOF) {
	    return afterAttributeName(char)
	  } else if (char == "=") {
	    return 
	  } else {
	    currentAttribute = {
	      name: "",
	      value: ""
	    }
	    return attributeName(char)
	  }
	}
	
	function afterAttributeName(char) {
	  if (char == "/") {
	    return selfClosingStartTag
	  } else if (char == EOF) {
	    return 
	  } else {
	    emit(currentToken)
	    return data
	  }
	}
	
	function attributeName(char) {
	  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
	    return afterAttributeName(char)
	  } else if (char == "=") {
	    return beforeAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == "\"" || char == "\'" || char == "<") {
	    return attributeName
	  } else {
	    currentAttribute.name += char
	    return attributeName
	  }
	}
	
	function beforeAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
	    return beforeAttributeValue
	  } else if (char == "\"") {
	    return doubleQuotedAttributeValue
	  } else if (char == "\'") {
	    return singleQuotedAttributeValue
	  } else if (char == ">") {
	    emit(currentToken)
	    // return data
	  } else {
	    return UnquotedAttributeValue(char)
	  }
	}
	
	function doubleQuotedAttributeValue(char) {
	  if (char == "\"") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    return afterQuotedAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return doubleQuotedAttributeValue
	  }
	}
	
	function singleQuotedAttributeValue(char) {
	  if (char == "\'") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    return afterQuotedAttributeValue
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return singleQuotedAttributeValue
	  }
	}
	
	function afterQuotedAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    return beforeAttributeName
	  } else if (char == "/") {
	    return selfClosingStartTag
	  } else if (char ==">") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    emit(currentToken)
	    return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    // return data
	  }
	}
	
	function UnquotedAttributeValue(char) {
	  if (char.match(/^[\t\n\f ]$/)) {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    // emit(currentToken)
	    return beforeAttributeName
	  } else if (char == "/") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    // emit(currentToken)
	    return selfClosingStartTag
	  } else if (char == ">") {
	    currentToken[currentAttribute.name] = currentAttribute.value
	    emit(currentToken)
	    return data
	  } else if (char == "\u0000") {
	    // return data
	  } else if (char == "\"" || char == "\'" || char == "<" || char == "=" || char == "`") {
	    // return data
	  } else if (char == EOF) {
	    // return data
	  } else {
	    currentAttribute.value += char
	    return UnquotedAttributeValue
	  }
	}
	
	
	function selfClosingStartTag(char) {
	  if (char == ">" || char == "/") {
	    currentToken.isSelfClosing = true
	    emit(currentToken)
	    return data
	  } else if (char == "EOF") {
	    // return data
	  } else {
	    // return data
	  }
	}
	
	module.exports.parseHTML = function parseHTML(html){
	
	  let state = data
	
	  for (let char of html) {
	    state = state(char)
	  }
	
	  state = state(EOF)
	  
	}
	```

- 运行结果
	- ![第六步运行结果 vscode debugger](http://p0.meituan.net/myvideodistribute/1d00a3a9aa02bd2ff5eb52805c38768b345257.png)



## 参考文献
- [HTML standard docs](https://html.spec.whatwg.org/multipage/)
- [VSCODE debugger](https://code.visualstudio.com/docs/editor/debugging)



## 写在后面
- [完整代码地址-戳我戳我戳我](https://github.com/Ele-Peng/toy-browser)
- 学而不思则罔 互勉
- 祝大家多多发财