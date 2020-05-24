

## 写在前面
- implementation of a toy-browser 🙆

<!-- more -->

### 第一步：初始化
- 我们采用以下 html 代码段

	```html
	<html maaa=a >
	    <head>
	        <style>
	    #container{
	        width:500px;
	        height:300px;
	        display:flex;
	        background-color:rgb(255,255,255);
	    }
	    #container #myid{
	      width:200px;
	      height:100px;
	      background-color:rgb(255,0,0)
	    }
	    #container .c1{
	      flex:1;
	      background-color:rgb(0,255,0)
	    }
	        </style>
	    </head>
	    <body>
	        <div id="container">
	          <div id="myid"></div>
	          <div class="c1"></div>
	        </div>
	    </body>
    </html>
	```
- 代码逻辑自顶向下
- 首先，我们在 endTag 的时候进行 layout
	- 我们只处理 flex，可以简化成在 endTag 时，进行 layout 即可
- computeCSS7.js

	```javascript
	const layout = require("./layout.js")
	
	// ... some code
	
	function emit(token) {
		
	  // ... some code
		
	  if (token.type == "startTag") {
		    
		 // ... some code
		
	  } else if (token.type == "endTag") {
	    if (top.tagName != token.tagName) {
	      throw new Error("Tag start end doesn't match")
	    } else {
	      // console.log('pop', stack.pop())
	      /** 遇到 style 标签时，执行添加 CCS 规则的操作 */
	      if (top.tagName === "style") {
	        addCSSRules(top.children[0].content)
	      }
	      layout(top)
	      stack.pop()
	    }
	    currentTextNode = null
	  } else if (token.type == "text") {
		    
		 // ... some code
		
	  }
	}
	```
#### flex 布局基础概念
	
- ![flex 排版解释图](http://p0.meituan.net/myvideodistribute/1e160d5f7cbdc299f68d432dcb19cca1137896.png)

	> 给 div 这类块状元素元素设置 display: flex 或者给 span 这类内联元素设置 display: inline-flex ，flex 布局即创建！其中，直接设置 display: flex 或者 display: inline-flex 的元素称为 flex 容器，里面的子元素称为 flex 子项。

	- ![flex 相关方法概览](http://p1.meituan.net/myvideodistribute/0f5622ba2bab24f882be6007f6761a4422506.png)

- 由上 felx 布局中的 主轴，交叉轴图示，我们可以先定义变量
	
	```javascript
	mainSize, // 主轴size width / height
	mainStart, // 主轴起点 left / right / top / bottom
	mainEnd, // 主轴终点 left / right / top / bottom
	mainSign, // 主轴符号位，用于 是否 reverse +1 / -1
	mainBase, // 主轴开始的位置 0 / style.width
	crossSize, // 交叉轴size width / height
	crossStart, // 交叉轴坐标起点 left / right / top / bottom
	crossEnd, // 交叉轴坐标终点 left / right / top / bottom
	crossSign, // 交叉轴符号位，用于 是否 reverse +1 / -1
	crossBase; // 交叉轴开始的位置 0 / style.width
	```
- 处理 flex 布局中属性默认值
	
	```javascript
	if (!style.flexDirection || style.flexDirection === 'auto')
	    style.flexDirection = 'row'
	if (!style.alignItems || style.alignItems === 'auto')
	    style.alignItems = 'stretch'
	if (!style.justifyContent || style.justifyContent === 'auto')
	    style.justifyContent = 'flex-start'
	if (!style.flexWrap || style.flexWrap === 'auto')
	    style.flexWrap = 'nowrap'
	if (!style.alignContent || style.alignContent === 'auto')
	    style.alignContent = 'center'
	```
#### flex-direction
- ![MDN flex-direction 语法解释](http://p0.meituan.net/myvideodistribute/bec69e2fc98cf7ebfaad21b5d166030361399.png)
	- flex-direction: row
		- 默认值，显示为行。方向为当前文档水平流方向，默认情况下是从左往右。
			
			```javascript
			if (style.flexDirection === 'row') {
				mainSize = 'width'
				mainStart = 'left'
				mainEnd = 'right'
				mainSign = +1
				mainBase = 0
					
				crossSize = 'height'
				crossStart = 'top'
				crossEnd = 'bottom'
			}
			```
	- flex-direction: row-reverse
		- 显示为行。但方向和row属性值是反的。
		
			```javascript
			if (style.flexDirection === 'row-reverse') {
			    mainSize = 'width'
			    mainStart = 'right'
			    mainEnd = 'left'
			    mainSign = -1
			    mainBase = style.width
			
			    crossSize = 'height'
			    crossStart = 'top'
			    crossEnd = 'bottom'
			}
			```
	- flex-direction: column
		- 显示为列。方向为当前文档垂直流方向，默认情况下是从上至下。
		
			```javascript
			if (style.flexDirection === 'column') {
			    mainSize = 'height'
			    mainStart = 'top'
			    mainEnd = 'bottom'
			    mainSign = +1
			    mainBase = 0
			
			    crossSize = 'width'
			    crossStart = 'left'
			    crossEnd = 'right'
			}
			```
	- flex-direction: column-reverse
		- 显示为列。但方向和column属性值是反的。
		
			```javascript
			if (style.flexDirection === 'column-reverse') {
			    mainSize = 'height'
			    mainStart = 'bottom'
			    mainEnd = 'top'
			    mainSign = -1
			    mainBase = style.height
			
			    crossSize = 'width'
			    crossStart = 'left'
			    crossEnd = 'right'
			}
			```
		
#### flex-wrap
- ![MDN flex-wrap语法解释](http://p0.meituan.net/myvideodistribute/137acf28be957d3b145c9571e3af265462518.png)
	- flex-wrap: nowrap
		- 默认值，表示单行显示，不换行。于是很容易出现宽度溢出的场景，其渲染表现比较复杂，需要对CSS3宽度有一定了解。这边我们简单处理为：（以水平布局举例）
			- flex 子项宽度 width 之和大于 flex 容器宽度，则内容溢出，表现和 white-space: nowrap 类似。
			- flex 子项宽度 width 之和大于 flex 容器宽度，则内容不溢出
			
			```javascript
		    crossBase = 0
		    crossSign = +1
			```
		
	- flex-wrap: wrap
		- 宽度不足换行显示
			
			```javascript
		    crossBase = 0
		    crossSign = +1
			```

	- flex-wrap: wrap-reverse
		- 宽度不足换行显示，但是是从下往上开始，也就是原本换行在下面的子项现在跑到上面

			```javascript
			if (style.flexWrap === 'wrap-reverse') {
			    let temp = crossStart
			    crossStart = crossEnd
			    crossEnd = temp
			    crossSign = -1
			}
			```

	
- [layout1.js 完整代码戳我戳我戳我](https://github.com/Ele-Peng/toy-browser/blob/master/layout1.js)


### 第二步：收集元素进行
- flex 容器没有设置 mainSize，直接撑开，count flex 子项 mainSize

	```javascript
  let isAutoMainSize = false
  // 没有设置 mainSize 直接撑开
  if (!style[mainSize]) { // auto sizing
		elementStyle[mainSize] = 0
		for (let i = 0; i < items.length; i ++) {
		    let item = items[i]
		    if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) 
		      elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
		}
		isAutoMainSize = true
  }
	```
	
- flex 容器 flex-wrap: no-wrap && isAutoMainSize，mainSpace 为0，允许撑大，**强行分进第一行**

	```javascript
	if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    }
	```
- flex 子项 display 为 flex，直接塞进当前行，mainSpace 不作处理，后续自适应
	- flex: none | auto | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

		```javascript
		if (itemStyle.flex) {
	      flexLine.push(item)
	    } 
		``` 
- flex 容器是否换行
	
	```javascript
	// 当前flex 子项，大于 flex mainSize,自适应
	if (itemStyle[mainSize] > style[mainSize]) {
	    itemStyle[mainSize] = style[mainSize]
	}
	// 当前flex 子项，大于 flex 容器剩余 mainSpace，另起新行
	if (mainSpace < itemStyle[mainSize]) {
	    flexLine.mainSpace = mainSpace
	    flexLine.crossSpace = crossSpace
	
	    // 创建新行
	    flexLine = []
	    flexLines.push(flexLine)
	    flexLine.push(item)
	
	    mainSpace = style[mainSize]
	    crossSpace = 0
	} else { // 未超过 flex 容器剩余 mainSpace，添加进行 
	    flexLine.push(item)
	}
	// 处理交叉轴，只需要取 flex 子项最大 crossSize
	if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
	    crossSpace = Math.max(crossSpace, itemStyle[crossSize])
	}
	// flex 容器剩余 mainSpace
	mainSpace -= itemStyle[mainSize]
	```
- [layout2.js 完整代码戳我戳我戳我](https://github.com/Ele-Peng/toy-browser/blob/master/layout2.js)
	
### 第三步：计算主轴
- 计算主轴方向
	- 找出所有 flex 子项也为 flex 元素

		```javascript
	    for (let i = 0; i < items.length; i++) {
	        const item = items[i]
	        const itemStyle = getStyle(item)
	
	        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
	          flexTotal += itemStyle.flex
	          continue
	        }
	    }
		```
		- 存在 flex 子项也为 flex
			- 填充 flexLine 剩余 mainSpace 空间

				```javascript

		        const currentMain = mainBase
		
		        for (let i = 0; i < items.length; i++) {
		          const item = items[i]
		          const itemStyle = getStyle(item)
		
		          if (itemStyle.flex) {
		            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
		          }
		          itemStyle[mainStart] = currentMain
		          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
		          currentMain = itemStyle[mainEnd]
		        }
				```
		
		- 不存在 flex 子项也为 flex，把主轴方向剩余尺寸按比例分配给这些元素
		- justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
			- justify-content: flex-start
				- 默认值

					```javascript
					if (!style.justifyContent || style.justifyContent === 'auto')
					    style.justifyContent = 'flex-start'
					```

					```javascript
			        if (style.justifyContent === 'flex-start') {
			          currentMain = mainBase
			          gap = 0
			        }
					```
			- justify-content: flex-end
				- 逻辑CSS属性值，与默认文档流方向相反

					```javascript
			        if (style.justifyContent === 'flex-start') {
			          currentMain = mainSpace * mainSign + mainBase
			          gap = 0
			        }
					```
			- justify-content: center
				- 居中对齐

					```javascript
			        if (style.justifyContent === 'center') {
			          currentMain = mainSpace / 2 * mainSign + mainBase
			          gap = 0
			        }
					```
			- justify-content: space-between
				- 表现为两端对齐。between 是中间的意思，意思是多余的空白间距只在元素中间区域分配

					```javascript
			        if (style.justifyContent === 'space-between') {
			          gap = mainSpace / (items.length - 1) * mainSign
			          currentMain = mainBase
			        }
					```
			- justify-content: space-around
				- around 是环绕的意思，意思是每个 flex 子项两侧都环绕互不干扰的等宽的空白间距，最终视觉上边缘两侧的空白只有中间空白宽度一半

					```javascript
			        if (style.justifyContent === 'space-around') {
			          gap = mainSpace / items.length * mainSign
			          currentMain = gap / 2 + mainBase
			        }
					```
			- justify-content: space-evenly
				- evenly 是匀称、平等的意思。也就是视觉上，每个 flex 子项两侧空白间距完全相等

					```javascript
			        if (style.justifyContent === 'space-evenly') {
			          gap = mainSpace / (items.length + 1) * mainSign
			          currentMain = gap + mainBase
			        }
					```
		- 循环计算 flex 子项位置
			
			```javascript
	        for (let i = 0; i < items.length; i++) {
	          const item = items[i]
	          itemStyle[mainStart] = currentMain
	          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
	          currentMain = itemStyle[mainEnd] + gap
	        }
			```
		
	- 若剩余空间为负数，所有 flex 元素为 0，等比压缩剩余元素

		```javascript
		if (mainSpace < 0) {
		    // 对负的 mainSpace， 所有该行 flex 子项等比例缩放（未设置 flex-shrink 默认值是1，也就是默认所有的 flex 子项都会收缩）
		    const scale = style[mainSize] / (style[mainSize] - mainSpace)
		    const currentMain = mainBase
		    for (let i = 0; i < items.length; i ++) {
		      const item = items[i]
		      const itemStyle = getStyle(item)
			
		      if (itemStyle.flex) {
		        itemStyle[mainSize] = 0
		      }
			
		      itemStyle[mainSize] = itemStyle[mainSize] * scale
			
		      // flex 容器这一行内，flex 子项排布
		      itemStyle[mainStart] = currentMain
		      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
		      currentMain = itemStyle[mainEnd]
		    }
 		}
		```
- [layout3.js 完整代码戳我戳我戳我](https://github.com/Ele-Peng/toy-browser/blob/master/layout3.js)
		
### 第四步：计算交叉轴
- 计算交叉轴方向
	- 根据每一行中最大元素尺寸计算行高

		```javascript
		if (!style[crossSize]) { // 交叉轴，crossSize 未设定时默认为 count flexLines 每行最大 crossSpace 之和 
		    crossSpace = 0
		    elementStyle[crossSize] = 0
		    for (let i = 0; i < flexLines.length; i ++) {
		      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
		    }
		} else { // 设定后，计算出 最终的 crossSpace，为 crossSpace 减去每行最大 crossSpace，剩余空间，用作分配
		    crossSpace = style[crossSize]
		    for (let i = 0; i < flexLines.length; i ++) {
		      crossSpace -= flexLines[i].crossSpace
		    }
		}
		```
	- 根据行高 flex-align 和 item-align，确定元素具体位置

		```javascript
		
		flexLines.forEach(function (items) {
		    let lineCrossSize = style.alignContent === 'stretch' ? // 拉伸 flex 子项，填满交叉轴
		      items.crossSpace + crossSpace / flexLines.length :
		      item.crossSpace
		
		    for (let i = 0; i < items.length; i ++) {
		      const item = items[i]
		      const itemStyle = getStyle(item)
		
		      const align = itemStyle.alignSelf || style.alignItems // align-self指控制单独某一个flex子项的垂直对齐方式
		      // align-items属性，表示子项们
		
		      if (itemStyle[crossSize] === null) {
		        itemStyle[crossSize] = (align === 'stretch') ?
		          lineCrossSize : 0
		      }
		
		      if (align === 'flex-start') {
		        itemStyle[crossStart] = crossBase
		        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
		      }
		
		      if (align === 'flex-end') {
		        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
		        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
		      }
		
		      if (align === 'center') {
		        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
		        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
		      }
		
		      if (align === 'stretch') {
		        itemStyle[crossStart] = crossBase
		        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
		          itemStyle[crossSize] : lineCrossSize)
		
		        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
		      }
		    }
		    crossBase += crossSign * (lineCrossSize + step)
	  })
		```
- 运行结果
	- ![第四步运行结果](http://p0.meituan.net/myvideodistribute/0e488c9e6c482d1d67f2a1872a58aa0d231450.png)

- [layout4.js 完整代码戳我戳我戳我](https://github.com/Ele-Peng/toy-browser/blob/master/layout4.js)




## 参考文献
- [display: flex 教程](https://www.zhangxinxu.com/wordpress/2018/10/display-flex-css3-css/#justify-content)
- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [MDN Flex](https://developer.mozilla.org/en-US/docs/Glossary/Flex)



## 写在后面
- 祝大家多多发财