

## 写在前面

- Before it is evaluated, all ECMAScript code must be associated with a realm. Conceptually, a realm consists of a set of intrinsic objects, an ECMAScript global environment, all of the ECMAScript code that is loaded within the scope of that global environment, and other associated state and resources.

<!-- more -->

- 从逻辑上讲，堆栈中的每个上下文总是与其 realm 相关联
	- 让我们看看单独的realm的例子，使用vm模块：
	
		```javascript
		const vm = require('vm');
		
		// First realm, and its global:
		const realm1 = vm.createContext({x: 10, console});
		
		// Second realm, and its global:
		const realm2 = vm.createContext({x: 20, console});
		
		// Code to execute:
		const code = `console.log(x);`;
		
		vm.runInContext(code, realm1); // 10
		vm.runInContext(code, realm2); // 20
		```
	- ![realm](http://p0.meituan.net/myvideodistribute/5055c18e52edec4cd447d7acfd4a8278158263.png)


## 实践记录

- JavaScript 中所有的固有对象

	```javascript
	

    let objects = [
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "Array",
      "Date",
      "RegExp",
      "Promise",
      "Proxy",
      "Map",
      "WeakMap",
      "Set",
      "WeakSet",
      "Function",
      "Boolean",
      "String",
      "Number",
      "Symbol",
      "Object",
      "Error",
      "EvalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "DataView",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Uint8Array",
      "Uint16Array",
      "Uint32Array",
      "Uint8ClampedArray",
      "Atomics",
      "JSON",
      "Math",
      "Reflect"
    ];

    const set = new Set();

    const globalObject = []

    for (let i of objects) {
      globalObject.push({
        object: this[i],
        path: [i]
      })
    }

    while (globalObject.length) {
      const current = globalObject.shift()
      console.log(current.path.join('.'))
      if (set.has(current.object))
        continue;
      set.add(current.object)



      let proto = Object.getPrototypeOf(current.object)
      if (proto) {
        globalObject.push({
          path: current.path.concat(["__proto__"]),
          object: proto
        })
      }

      for (let p of Object.getOwnPropertyNames(current.object)) {
        let d = Object.getOwnPropertyDescriptor(current.object, p)
        if (d.hasOwnProperty("value") && ((d.value !== null && typeof d.value === "object") || (typeof d.value === "function")) && d.value instanceof Object) {
          globalObject.push({
            path: current.path.concat([p]),
            object: d.value
          })
        }
        if (d.hasOwnProperty("get") && typeof d.get === "function") {
          globalObject.push({
            path: current.path.concat([p]),
            object: d.get
          })
        }
        if (d.hasOwnProperty("set") && typeof d.set === "function") {
          globalObject.push({
            path: current.path.concat([p]),
            object: d.set
          })
        }
      }
    }
	```
	
- 根据上述代码，进行数据结构方面的格式化
	
	```javascript
	
    const objects = [
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "Array",
      "Date",
      "RegExp",
      "Promise",
      "Proxy",
      "Map",
      "WeakMap",
      "Set",
      "WeakSet",
      "Function",
      "Boolean",
      "String",
      "Number",
      "Symbol",
      "Object",
      "Error",
      "EvalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "DataView",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Uint8Array",
      "Uint16Array",
      "Uint32Array",
      "Uint8ClampedArray",
      "Atomics",
      "JSON",
      "Math",
      "Reflect"
    ];

    const set = new Set();

    const globalObject = {
      id: "Global Object",
      children: [

      ]
    }

    for (let i of objects) {
      globalObject.children.push({
        children: [],
        id: i
      })
    }


    for (let i = 0; i < objects.length; i++) {
      const current = objects[i]
      if (set.has(objects[i]))
        continue;
      set.add(objects[i])
      for (let p of Object.getOwnPropertyNames(window[objects[i]])) {
        let d = Object.getOwnPropertyDescriptor(window[objects[i]], p)
        if (d.hasOwnProperty("value") && ((d.value !== null && typeof d.value === "object") || (typeof d.value === "function")) && d.value instanceof Object) {
          let childrenThird = []
          for (let k of Object.getOwnPropertyNames(d.value)) {
            if (k !== 'name' && k !== 'length') {
              childrenThird.push({ id: k })
            }
          }
          globalObject["children"][i].children.push({
            children: childrenThird,
            id: p
          })
        }
        if (d.hasOwnProperty("get") && typeof d.get === "function") {
          let childrenThird = []
          for (let k of Object.getOwnPropertyNames(d.get)) {
            if (k !== 'name' && k !== 'length') {
              childrenThird.push({ id: k })
            }
          }
          globalObject["children"][i].children.push({
            children: childrenThird,
            id: p
          })
        }
        if (d.hasOwnProperty("set") && typeof d.set === "function") {
          let childrenThird = []
          for (let k of Object.getOwnPropertyNames(d.set)) {
            if (k !== 'name' && k !== 'length') {
              childrenThird.push({ id: k })
            }
          }
          globalObject["children"][i].children.push({
            children: childrenThird,
            id: p
          })
        }
      }
    }
	```

  - 处理好的JSON数据  

	    ```javascrtipt
	    {"id":"Global Object","children":[{"children":[],"id":"eval"},{"children":[],"id":"isFinite"},{"children":[],"id":"isNaN"},{"children":[],"id":"parseFloat"},{"children":[],"id":"parseInt"},{"children":[],"id":"decodeURI"},{"children":[],"id":"decodeURIComponent"},{"children":[],"id":"encodeURI"},{"children":[],"id":"encodeURIComponent"},{"children":[{"children":[{"id":"constructor"},{"id":"concat"},{"id":"copyWithin"},{"id":"fill"},{"id":"find"},{"id":"findIndex"},{"id":"lastIndexOf"},{"id":"pop"},{"id":"push"},{"id":"reverse"},{"id":"shift"},{"id":"unshift"},{"id":"slice"},{"id":"sort"},{"id":"splice"},{"id":"includes"},{"id":"indexOf"},{"id":"join"},{"id":"keys"},{"id":"entries"},{"id":"values"},{"id":"forEach"},{"id":"filter"},{"id":"flat"},{"id":"flatMap"},{"id":"map"},{"id":"every"},{"id":"some"},{"id":"reduce"},{"id":"reduceRight"},{"id":"toLocaleString"},{"id":"toString"}],"id":"prototype"},{"children":[],"id":"isArray"},{"children":[],"id":"from"},{"children":[],"id":"of"}],"id":"Array"},{"children":[{"children":[{"id":"constructor"},{"id":"toString"},{"id":"toDateString"},{"id":"toTimeString"},{"id":"toISOString"},{"id":"toUTCString"},{"id":"toGMTString"},{"id":"getDate"},{"id":"setDate"},{"id":"getDay"},{"id":"getFullYear"},{"id":"setFullYear"},{"id":"getHours"},{"id":"setHours"},{"id":"getMilliseconds"},{"id":"setMilliseconds"},{"id":"getMinutes"},{"id":"setMinutes"},{"id":"getMonth"},{"id":"setMonth"},{"id":"getSeconds"},{"id":"setSeconds"},{"id":"getTime"},{"id":"setTime"},{"id":"getTimezoneOffset"},{"id":"getUTCDate"},{"id":"setUTCDate"},{"id":"getUTCDay"},{"id":"getUTCFullYear"},{"id":"setUTCFullYear"},{"id":"getUTCHours"},{"id":"setUTCHours"},{"id":"getUTCMilliseconds"},{"id":"setUTCMilliseconds"},{"id":"getUTCMinutes"},{"id":"setUTCMinutes"},{"id":"getUTCMonth"},{"id":"setUTCMonth"},{"id":"getUTCSeconds"},{"id":"setUTCSeconds"},{"id":"valueOf"},{"id":"getYear"},{"id":"setYear"},{"id":"toJSON"},{"id":"toLocaleString"},{"id":"toLocaleDateString"},{"id":"toLocaleTimeString"}],"id":"prototype"},{"children":[],"id":"now"},{"children":[],"id":"parse"},{"children":[],"id":"UTC"}],"id":"Date"},{"children":[{"children":[{"id":"constructor"},{"id":"exec"},{"id":"dotAll"},{"id":"flags"},{"id":"global"},{"id":"ignoreCase"},{"id":"multiline"},{"id":"source"},{"id":"sticky"},{"id":"unicode"},{"id":"compile"},{"id":"toString"},{"id":"test"}],"id":"prototype"},{"children":[],"id":"input"},{"children":[],"id":"input"},{"children":[],"id":"$_"},{"children":[],"id":"$_"},{"children":[],"id":"lastMatch"},{"children":[],"id":"lastMatch"},{"children":[],"id":"$&"},{"children":[],"id":"$&"},{"children":[],"id":"lastParen"},{"children":[],"id":"lastParen"},{"children":[],"id":"$+"},{"children":[],"id":"$+"},{"children":[],"id":"leftContext"},{"children":[],"id":"leftContext"},{"children":[],"id":"$`"},{"children":[],"id":"$`"},{"children":[],"id":"rightContext"},{"children":[],"id":"rightContext"},{"children":[],"id":"$'"},{"children":[],"id":"$'"},{"children":[],"id":"$1"},{"children":[],"id":"$1"},{"children":[],"id":"$2"},{"children":[],"id":"$2"},{"children":[],"id":"$3"},{"children":[],"id":"$3"},{"children":[],"id":"$4"},{"children":[],"id":"$4"},{"children":[],"id":"$5"},{"children":[],"id":"$5"},{"children":[],"id":"$6"},{"children":[],"id":"$6"},{"children":[],"id":"$7"},{"children":[],"id":"$7"},{"children":[],"id":"$8"},{"children":[],"id":"$8"},{"children":[],"id":"$9"},{"children":[],"id":"$9"}],"id":"RegExp"},{"children":[{"children":[{"id":"constructor"},{"id":"then"},{"id":"catch"},{"id":"finally"}],"id":"prototype"},{"children":[],"id":"all"},{"children":[],"id":"race"},{"children":[],"id":"resolve"},{"children":[],"id":"reject"},{"children":[],"id":"allSettled"}],"id":"Promise"},{"children":[{"children":[],"id":"revocable"}],"id":"Proxy"},{"children":[{"children":[{"id":"constructor"},{"id":"get"},{"id":"set"},{"id":"has"},{"id":"delete"},{"id":"clear"},{"id":"entries"},{"id":"forEach"},{"id":"keys"},{"id":"size"},{"id":"values"}],"id":"prototype"}],"id":"Map"},{"children":[{"children":[{"id":"constructor"},{"id":"delete"},{"id":"get"},{"id":"set"},{"id":"has"}],"id":"prototype"}],"id":"WeakMap"},{"children":[{"children":[{"id":"constructor"},{"id":"has"},{"id":"add"},{"id":"delete"},{"id":"clear"},{"id":"entries"},{"id":"forEach"},{"id":"size"},{"id":"values"},{"id":"keys"}],"id":"prototype"}],"id":"Set"},{"children":[{"children":[{"id":"constructor"},{"id":"delete"},{"id":"has"},{"id":"add"}],"id":"prototype"}],"id":"WeakSet"},{"children":[{"children":[{"id":"arguments"},{"id":"caller"},{"id":"constructor"},{"id":"apply"},{"id":"bind"},{"id":"call"},{"id":"toString"}],"id":"prototype"}],"id":"Function"},{"children":[{"children":[{"id":"constructor"},{"id":"toString"},{"id":"valueOf"}],"id":"prototype"}],"id":"Boolean"},{"children":[{"children":[{"id":"constructor"},{"id":"anchor"},{"id":"big"},{"id":"blink"},{"id":"bold"},{"id":"charAt"},{"id":"charCodeAt"},{"id":"codePointAt"},{"id":"concat"},{"id":"endsWith"},{"id":"fontcolor"},{"id":"fontsize"},{"id":"fixed"},{"id":"includes"},{"id":"indexOf"},{"id":"italics"},{"id":"lastIndexOf"},{"id":"link"},{"id":"localeCompare"},{"id":"match"},{"id":"matchAll"},{"id":"normalize"},{"id":"padEnd"},{"id":"padStart"},{"id":"repeat"},{"id":"replace"},{"id":"search"},{"id":"slice"},{"id":"small"},{"id":"split"},{"id":"strike"},{"id":"sub"},{"id":"substr"},{"id":"substring"},{"id":"sup"},{"id":"startsWith"},{"id":"toString"},{"id":"trim"},{"id":"trimStart"},{"id":"trimLeft"},{"id":"trimEnd"},{"id":"trimRight"},{"id":"toLocaleLowerCase"},{"id":"toLocaleUpperCase"},{"id":"toLowerCase"},{"id":"toUpperCase"},{"id":"valueOf"}],"id":"prototype"},{"children":[],"id":"fromCharCode"},{"children":[],"id":"fromCodePoint"},{"children":[],"id":"raw"}],"id":"String"},{"children":[{"children":[{"id":"constructor"},{"id":"toExponential"},{"id":"toFixed"},{"id":"toPrecision"},{"id":"toString"},{"id":"valueOf"},{"id":"toLocaleString"}],"id":"prototype"},{"children":[],"id":"isFinite"},{"children":[],"id":"isInteger"},{"children":[],"id":"isNaN"},{"children":[],"id":"isSafeInteger"},{"children":[],"id":"parseFloat"},{"children":[],"id":"parseInt"}],"id":"Number"},{"children":[{"children":[{"id":"constructor"},{"id":"toString"},{"id":"valueOf"},{"id":"description"}],"id":"prototype"},{"children":[],"id":"for"},{"children":[],"id":"keyFor"}],"id":"Symbol"},{"children":[{"children":[],"id":"assign"},{"children":[],"id":"getOwnPropertyDescriptor"},{"children":[],"id":"getOwnPropertyDescriptors"},{"children":[],"id":"getOwnPropertyNames"},{"children":[],"id":"getOwnPropertySymbols"},{"children":[],"id":"is"},{"children":[],"id":"preventExtensions"},{"children":[],"id":"seal"},{"children":[],"id":"create"},{"children":[],"id":"defineProperties"},{"children":[],"id":"defineProperty"},{"children":[],"id":"freeze"},{"children":[],"id":"getPrototypeOf"},{"children":[],"id":"setPrototypeOf"},{"children":[],"id":"isExtensible"},{"children":[],"id":"isFrozen"},{"children":[],"id":"isSealed"},{"children":[],"id":"keys"},{"children":[],"id":"entries"},{"children":[],"id":"fromEntries"},{"children":[],"id":"values"}],"id":"Object"},{"children":[{"children":[{"id":"constructor"},{"id":"message"},{"id":"toString"}],"id":"prototype"},{"children":[],"id":"captureStackTrace"}],"id":"Error"},{"children":[{"children":[{"id":"constructor"},{"id":"message"}],"id":"prototype"}],"id":"EvalError"},{"children":[{"children":[{"id":"constructor"},{"id":"message"}],"id":"prototype"}],"id":"RangeError"},{"children":[{"children":[{"id":"constructor"},{"id":"message"}],"id":"prototype"}],"id":"ReferenceError"},{"children":[{"children":[{"id":"constructor"},{"id":"message"}],"id":"prototype"}],"id":"SyntaxError"},{"children":[{"children":[{"id":"constructor"},{"id":"message"}],"id":"prototype"}],"id":"TypeError"},{"children":[{"children":[{"id":"constructor"},{"id":"message"}],"id":"prototype"}],"id":"URIError"},{"children":[{"children":[{"id":"constructor"},{"id":"byteLength"},{"id":"slice"}],"id":"prototype"},{"children":[],"id":"isView"}],"id":"ArrayBuffer"},{"children":[{"children":[{"id":"constructor"},{"id":"byteLength"},{"id":"slice"}],"id":"prototype"}],"id":"SharedArrayBuffer"},{"children":[{"children":[{"id":"constructor"},{"id":"buffer"},{"id":"byteLength"},{"id":"byteOffset"},{"id":"getInt8"},{"id":"setInt8"},{"id":"getUint8"},{"id":"setUint8"},{"id":"getInt16"},{"id":"setInt16"},{"id":"getUint16"},{"id":"setUint16"},{"id":"getInt32"},{"id":"setInt32"},{"id":"getUint32"},{"id":"setUint32"},{"id":"getFloat32"},{"id":"setFloat32"},{"id":"getFloat64"},{"id":"setFloat64"},{"id":"getBigInt64"},{"id":"setBigInt64"},{"id":"getBigUint64"},{"id":"setBigUint64"}],"id":"prototype"}],"id":"DataView"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Float32Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Float64Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Int8Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Int16Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Int32Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Uint8Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Uint16Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Uint32Array"},{"children":[{"children":[{"id":"constructor"},{"id":"BYTES_PER_ELEMENT"}],"id":"prototype"}],"id":"Uint8ClampedArray"},{"children":[{"children":[],"id":"load"},{"children":[],"id":"store"},{"children":[],"id":"add"},{"children":[],"id":"sub"},{"children":[],"id":"and"},{"children":[],"id":"or"},{"children":[],"id":"xor"},{"children":[],"id":"exchange"},{"children":[],"id":"compareExchange"},{"children":[],"id":"isLockFree"},{"children":[],"id":"wait"},{"children":[],"id":"wake"},{"children":[],"id":"notify"}],"id":"Atomics"},{"children":[{"children":[],"id":"parse"},{"children":[],"id":"stringify"}],"id":"JSON"},{"children":[{"children":[],"id":"abs"},{"children":[],"id":"acos"},{"children":[],"id":"acosh"},{"children":[],"id":"asin"},{"children":[],"id":"asinh"},{"children":[],"id":"atan"},{"children":[],"id":"atanh"},{"children":[],"id":"atan2"},{"children":[],"id":"ceil"},{"children":[],"id":"cbrt"},{"children":[],"id":"expm1"},{"children":[],"id":"clz32"},{"children":[],"id":"cos"},{"children":[],"id":"cosh"},{"children":[],"id":"exp"},{"children":[],"id":"floor"},{"children":[],"id":"fround"},{"children":[],"id":"hypot"},{"children":[],"id":"imul"},{"children":[],"id":"log"},{"children":[],"id":"log1p"},{"children":[],"id":"log2"},{"children":[],"id":"log10"},{"children":[],"id":"max"},{"children":[],"id":"min"},{"children":[],"id":"pow"},{"children":[],"id":"random"},{"children":[],"id":"round"},{"children":[],"id":"sign"},{"children":[],"id":"sin"},{"children":[],"id":"sinh"},{"children":[],"id":"sqrt"},{"children":[],"id":"tan"},{"children":[],"id":"tanh"},{"children":[],"id":"trunc"}],"id":"Math"},{"children":[{"children":[],"id":"defineProperty"},{"children":[],"id":"deleteProperty"},{"children":[],"id":"apply"},{"children":[],"id":"construct"},{"children":[],"id":"get"},{"children":[],"id":"getOwnPropertyDescriptor"},{"children":[],"id":"getPrototypeOf"},{"children":[],"id":"has"},{"children":[],"id":"isExtensible"},{"children":[],"id":"ownKeys"},{"children":[],"id":"preventExtensions"},{"children":[],"id":"set"},{"children":[],"id":"setPrototypeOf"}],"id":"Reflect"}]}
	    ```
	
- 绘制 G6 Tree Graph
	- 需要在 HTML 中创建一个用于容纳 G6 绘制的图的容器，通常为 div  标签。G6 在绘制时会在该容器下追加 canvas 标签，然后将图绘制在其中。
		
		```javascript
		<div id="container" />
		```
	- 引入 G6 的数据源为 JSON 格式的对象。即上面我们处理过的 globalObject
	- 创建关系图（实例化）时，至少需要为图设置容器、宽和高。
		
		```javascript
		
	    const width = window.devicePixelRatio * window.screen.width * 0.5; // 高清显示
	    const height = window.devicePixelRatio * window.screen.height;
	    const graph = new G6.TreeGraph({
	      container: 'container',
	      width,
	      height,
	      modes: {
	        default: [
	          {
	            type: 'collapse-expand',
	            onChange: function onChange(item, collapsed) {
	              const data = item.get('model').data;
	              data.collapsed = collapsed;
	              return true;
	            },
	          },
	          'drag-canvas',
	          'zoom-canvas',
	        ],
	      },
	      defaultNode: {
	        size: 26,
	        anchorPoints: [
	          [0, 0.5],
	          [1, 0.5],
	        ],
	        style: {
	          fill: '#C6E5FF',
	          stroke: '#5B8FF9',
	        },
	      },
	      defaultEdge: {
	        type: 'cubic-horizontal',
	        style: {
	          stroke: '#A3B1BF',
	        },
	      },
	      layout: {
	        type: 'compactBox',
	        direction: 'LR',
	        getId: function getId(d) {
	          return d.id;
	        },
	        getHeight: function getHeight() {
	          return 16;
	        },
	        getWidth: function getWidth() {
	          return 16;
	        },
	        getVGap: function getVGap() {
	          return 10;
	        },
	        getHGap: function getHGap() {
	          return 100;
	        },
	      },
	    });
		```
		
	- 配置数据源，渲染
		
		```javascript
		graph.data(data);
	    graph.render();
	    graph.fitView();
		```
		
- 运行截图
	- ![g6](http://p0.meituan.net/myvideodistribute/348969f29ced9ddcebac4fce71a1de42543229.png)


## 写在后面
- [完整代码地址-戳我戳我戳我](https://github.com/Ele-Peng/antv-g6-realm)
- 祝大家多多发财