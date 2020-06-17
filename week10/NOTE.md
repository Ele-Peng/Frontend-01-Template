
## 写在前面
- 永不再鸽，是不可能的
- 补到第二天的 12:37
- 灵魂问题：还敢拖延嘛！！
- 又拖到 DDL

<!-- more -->

## HTML 的定义：XML 与 SGML

### DTD 与 XML namespace
- [https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd](https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)
	- [https://www.w3.org/TR/xhtml1/DTD/xhtml-lat1.ent](https://www.w3.org/TR/xhtml1/DTD/xhtml-lat1.ent)
		- \&nbsp; \u00A0 " " (no-break space = non-breaking space)
		- \<!ENTITY nbsp    "\&#160;"\> \<!-- no-break space = non-breaking space, U+00A0 ISOnum --\>
	- [https://www.w3.org/TR/xhtml1/DTD/xhtml-symbol.ent](https://www.w3.org/TR/xhtml1/DTD/xhtml-symbol.ent)
	- [https://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent](https://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent)
		- html 属性中不能使用 \", 需要转义
			- \<!ENTITY quot    "\&#34;"\> \<!--  quotation mark, U+0022 ISOnum --\> \"
		- html 中不能使用 \&, 需要转义
			- \<!ENTITY amp    "\&#38;#38;"\> \<!--  ampersand, U+0026 ISOnum --\> \&
		- html 中不能使用 \<, 需要转义
			- \<!ENTITY lt    "\&#38;#60;"\> \<!--  less-than sign, U+003C ISOnum --\> \<
		- html 中不能使用 \>, 需要转义
			- <\!ENTITY gt    "\&#62;"\> \<!--  greater-than sign, U+003E ISOnum --\> \>
- [http://www.w3.org/1999/xhtml](http://www.w3.org/1999/xhtml)




## HTML 标签 - 语义
### 为 wiki 编写 HTML
- [示例 wiki](http://static001.geekbang.org/static/time/quote/World_Wide_Web-Wikipedia.html)


## HTML - 语法
### 合法元素
- Element: &lt;tagname&gt;...&lt;/tagname&gt;
- Text: text
- Comment: \<!-- comments --\>
- DocumentType: <!Doctype html>
- ProcessingInstruction: <?a 1?> 
	- 预处理
- CDATA: <![CDATA[]]>

### 字符引用
- \&\#160; \&nbsp;
- \&amp;
- \&lt;
- \&gt;
- \&quot;



## DOM

### 导航类操作
- parentNode
- childNodes
	- living collection 会被实时修改
- firstChild
- lastChild
- nextSibling
- previousSibling



### 修改操作
- 所有的 DOM 默认有且只有一个父元素
	- 不能被两次插入 DOM 树中。
	- 将一个 DOM 元素，插入到 a 位置，再调用插入到 b 位置，会默认的先从 a 位置 remove 出来
	- ![ChildNodes living collection](http://p1.meituan.net/myvideodistribute/fa6ba8388663f1d63bc4d062f05c7da8276923.png)
- appendChild
- insertBefore
- removeChild
- replaceChild

### 高级操作
- compareDocumentPosition 是一个用于比较两个节点中关系的函数
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否完全相同
- isSameNode 检查两个节点是否是同一个节点，实际上在 JS 中可以用 ===
- cloneNode 复制一个节点，如果传入参数 true，则会连同子元素做深拷贝



## Event: 冒泡与捕获
- [addEventListener MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- ![冒泡与捕获](http://p0.meituan.net/myvideodistribute/46f706af50150735f325d6b6c7ac7c77150662.png)


## Range API
#### 把一个元素的所有子元素逆序

### Range 用法
- var range = new Range()
- range.setStart(element, 9)
- range.setEnd(element, 4)
- var range = document.getSelection().getRangeAt(0)
- var fragment = range.extractContents()
- range.insertNode(document.createTextNode("aaa"))

### Range API
- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents
- 结论：range 更为精细操作 DOM，批量操作 DOM


## CSSOM
### document.styleSheets
- document.styleSheets
- 案例


### Rules
- document.styleSheets[0].cssRules
- document.styleSheets[0].insertRule("p{color: pink;}", 0)
- document.styleSheets[0].removeRule(0)

### Rule
- CSSStyleRule
	- selectorText String
	- style k-v 结构
- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFontFaceRule
- CSSPageRule
- CSSNamespaceRule
- CSSKeyframesRule
- CSSKeyframeRule
- CSSSupportRule
- ...


### getComputedStyle
- window.getComputedStyle(elt, pseudoElt)
	- elt 想要获取的元素
	- pseudoElt 可选，伪元素

### CSSOM View
#### 窗口API
窗口 API 用于操作浏览器窗口的位置、尺寸等

- moveTo(x, y) 窗口移动到屏幕的特定坐标；
- moveBy(x, y) 窗口移动特定距离；
- resizeTo(x, y) 改变窗口大小到特定尺寸；
- resizeBy(x, y) 改变窗口大小特定尺寸。
- open()


	```javascript
	let childWindow = window.open("about:blank", "_blank")
	
	let childWindow = window.open("about:blank", "_blank", "width=100,height=100,left=100,top=100")
	
	childWindow.moveBy(-50, -50)
	
	childWindow.resizeBy(50, 50)
	```

#### 滚动API
视口滚动 API(可视区域，由 window 对象操作)

- scrollX 是视口的属性，表示 X 方向上的当前滚动距离，有别名 pageXOffset；
- scrollY 是视口的属性，表示 Y 方向上的当前滚动距离，有别名 pageYOffset；
- scroll(x, y) 使得页面滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}；
- scrollBy(x, y) 使得页面滚动特定的距离，支持传入配置型参数 {top, left}。

元素滚动 API(元素滚动 API，在 Element 类上)

- scrollTop 元素的属性，表示 Y 方向上的当前滚动距离。
- scrollLeft 元素的属性，表示 X 方向上的当前滚动距离。
- scrollWidth 元素的属性，表示元素内部的滚动内容的宽度，一般来说会大于等于元素宽度。
- scrollHeight 元素的属性，表示元素内部的滚动内容的高度，一般来说会大于等于元素高度。
- scroll(x, y) 使得元素滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}。scrollBy(x, y) 使得元素滚动到特定的位置，支持传入配置型参数 {top, left}。
- scrollIntoView(arg) 滚动元素所在的父元素，使得元素滚动到可见区域，可以通过 arg 来指定滚到中间、开始或者就近。


	```javascript
	window.scroll(0, 0)
	
	window.scroll(0, 50) // 滚动至 (0, 50)
	
	window.scrollBy(0, 50) // 滚动绝对值
	```

#### 布局API
全局尺寸信息

- window.innerHeight, window.innerWidth 这两个属性表示视口的大小。
- window.outerWidth, window.outerHeight 这两个属性表示浏览器窗口占据的大小，很多浏览器没有实现，一般来说这两个属性无关紧要。
- window.devicePixelRatio 这个属性非常重要，表示物理像素和 CSS 像素单位的倍率关系，Retina 屏这个值是 2，后来也出现了一些 3 倍的 Android 屏。
- window.screen （屏幕尺寸相关的信息）
	- window.screen.width, window.screen.height 设备的屏幕尺寸。
	- window.screen.availWidth, window.screen.availHeight 设备屏幕的可渲染区域尺寸，一些 Android 机器会把屏幕的一部分预留做固定按钮，所以有这两个属性，实际上一般浏览器不会实现的这么细致。
	- window.screen.colorDepth, window.screen.pixelDepth 这两个属性是固定值 24，应该是为了以后预留。

元素的布局信息

- getClientRects(),会返回一个列表，里面包含元素对应的每一个盒所占据的客户端矩形区域，这里每一个矩形区域可以用 x, y, width, height 来获取它的位置和尺寸;
- getBoundingClientRect(),它返回元素对应的所有盒的包裹的矩形区域，需要注意，这个 API 获取的区域会包括当 overflow 为 visible 时的子元素区域。


	```javascript
	getClientRects() // 伪元素不会被计入
	
	getBoundingClientRect()
	
	window.innerHeight
	// 等同于 document.documentElement.getBoundingClientRect().height
	
	window.innerWidth
	// 等同于 document.documentElement.getBoundingClientRect().width
	
	window.outerHeight
	
	window.outerWidth
	
	window.devicePixelRatio
	```



## 所有 API



## Reference
- [杨登程 CSSOM Note](https://github.com/yangdengcheng/Frontend-01-Template/blob/master/week10/NOTE.md)


## 写在后面
- 祝大家多多发财