

## CSS 基本语法
### CSS2.1 语法
- [Appendix G. Grammar of CSS 2.1](https://www.w3.org/TR/CSS21/grammar.html#q25.0)
- [CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3/)


### CSS2.1 总体结构
![productions_1](http://p0.meituan.net/myvideodistribute/b9beefeab08a031d689d4e989de4c2f1197837.png)
![productions_2](http://p0.meituan.net/myvideodistribute/7340e333e43e235776839a2c00bfb982147104.png)

- 简化为：
	- @charset
	- @import
	- rules
		- @media
		- @page
		- rule


## CSS @ Rules
- [@charset](https://www.w3.org/TR/css-syntax-3/)
- [@import](https://www.w3.org/TR/css-cascade-4/)
- [@media](https://www.w3.org/TR/css3-conditional/)
- [@page](https://www.w3.org/TR/css-page-3/)
- [@counter-style](https://www.w3.org/TR/css-counter-styles-3/)
- [@keyframes](https://www.w3.org/TR/css-animations-1/)
- [@fontface](https://www.w3.org/TR/css-fonts-3/)
- [@supports](https://www.w3.org/TR/css3-conditional/)
- [@namespace](https://www.w3.org/TR/css-namespaces-3/)


## CSS 规则的结构
- Selector
	- [selectors-3](https://www.w3.org/TR/selectors-3/)
	- [selectors-4](https://www.w3.org/TR/selectors-4/)
- Key
	- Properties
	- Variables
		- [css-variables](https://www.w3.org/TR/css-variables/)
- Value
	- [css-values-4](https://www.w3.org/TR/css-values-4/)


## 初建 CSS 知识体系
- ![CSS 知识体系](http://p0.meituan.net/myvideodistribute/236b6afc66be8e7c1ea00a43b76d43a7259289.png)


## 收集标准
![CSS standards](http://p0.meituan.net/myvideodistribute/77c702cce890b37809d44d258837f1bd733569.png)


- all standards and drafts are in the id named container of the html document.
- so we can write a script to collect the standards.

### 第一步：获取所有 li dom 节点
	
	
```javascript
const list = document.getElementById("container").children
  
console.log('list', list)
``` 
![获取的所有 li 节点](http://p0.meituan.net/myvideodistribute/6cb3b64a2be23ea9ffce86db74757615120112.png)

### 第二步：匹配出 data-tag 中为 css 的 standard
- ![css standard](http://p1.meituan.net/myvideodistribute/3d1fb8e8198d5d5774cd861235d5682a314365.png)
- 观察得到，我们只需要将 data-tag nodeValue 中有 “css” 抓出来即可

	```javascript
	const list = document.getElementById("container").children
	const result = []
	for (let i of list) {
	  if (i.getAttribute('data-tag').match(/css/)) {
	    result.push({
	      name: i.children[1].innerText,
	      url: i.children[1].children[0].href
	    })
	  }
	}
	console.log(JSON.stringify(result, null, '    '))
	```


## 收集 CSS 属性相关标准

```javascript
let iframe = document.createElement("iframe");
document.body.innerHTML = "";
document.body.appendChild(iframe);




function happen(element, event){
    return new Promise(function(resolve){
        let handler = () => {
            resolve();
            element.removeEventListener(event, handler);
        }
        element.addEventListener(event, handler);
    })
}




void async function(){
    for(let standard of standards) {
        iframe.src = standard.url;
        console.log(standard.name);
        await happen(iframe, "load");
    }
}();
```


## 写在后面
- 祝大家多多发财