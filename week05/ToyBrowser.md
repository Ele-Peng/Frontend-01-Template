
## 写在前面
- implementation of a toy-browser 🙆


## 实践过程


### Server 端实现

```
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
server.listen(8088);
```

> When headers have been set with response.setHeader(), they will be merged with any headers passed to response.writeHead(), with the headers passed to **response.writeHead() given precedence**.

- writeHead 与 setHeader 相比，具有更高的优先级
- 所以最终的请求体头 'Content-Type': 'text/plain'
- 这里我们让它监听 8088 端口，因为默认的 80端口，可能会存在占用
- 我们可以在浏览器中，对 http://127.0.0.1:8088/ 访问，最后我们要利用 toy-browser 简单模拟
	- ![浏览器行为](http://p0.meituan.net/myvideodistribute/aa69465245fc64274c75ac4e5aab244691470.png)



### Client 端实现

#### 第一版：简单实现

```
const net = require('net');
const client = net.createConnection({ port: 8088 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('POST / HTTP/1.1\r\n');
  client.write('HOST: 127.0.0.1\r\n');
  client.write('Content-Length: 9\r\n');
  client.write('Content-Type: application/x-www-form-urlencoded\r\n');
  client.write('\r\n');
  client.write('name=elle');
  client.write('\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
- 我们开启服务端


	> node server.js
	
- 再开启客户端


	> node client.js

- 运行截图
	- ![client](http://p0.meituan.net/myvideodistribute/5a4f9f936d87d43335d08670a03205a448885.png)
	- ![server](http://p1.meituan.net/myvideodistribute/115d90c1e9de7f974d7749988e01c87332973.png)

- 我们可以看到请求成功的发出，并且服务端也进行了正确的反馈。
	- 请求体：name=elle，'content-length': '9'

#### 第二版：对 request 进行简单封装
- 简单分析 request 构造器所需内容
	- ![request](http://p0.meituan.net/myvideodistribute/7663a0cff7c034fbeadce907b2e445b588991.png)
	
		```javascript
	    // request line
	      // method, url = host + port + path
	    // headers
	      // Content-Type
	        // Content-Type: application/x-www-form-urlencoded
	        // Content-Type: application/json
	        // Content-Type: multipart/form-data
	        // Content-Type: text/xml
	      // Content-Length
	    // body: k-v
		```
- 我们可以简单写出封装后的 reqeust

	```javascript
	
	class Request {
	    // request line
	      // method, url = host + port + path
	    // headers
	      // Content-Type
	        // Content-Type: application/x-www-form-urlencoded
	        // Content-Type: application/json
	        // Content-Type: multipart/form-data
	        // Content-Type: text/xml
	      // Content-Length
	    // body: k-v
	
	  constructor(options) {
	    this.method = options.method || "GET"
	    this.host = options.host
	    this.port = options.port || 80
	    this.path = options.path || "/"
	    this.body = options.body || {}
	    this.headers = options.headers || {}
	    if (!this.headers["Content-Type"]) {
	      this.headers["Content-Type"] = "application/x-www-form-urlencoded"
	    }
	
	    if (this.headers["Content-Type"] === "application/json") {
	      this.bodyText = JSON.stringify(this.body)
	    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
	      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
	    }
	
	    // calculate Content-Length
	    this.headers["Content-Length"] = this.bodyText.length
	
	  }
	
	  toString() {
	    return `${this.method} ${this.path} HTTP/1.1\r\nHOST: ${this.host}\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}\r\n`
	  }
	}
	```
	
- 再利用封装后的 request 进行 client 访问

	```javascript
	const net = require("net");
	
	const client = net.createConnection({
	  host: "127.0.0.1",
	  port: 8088
	}, () => {
	  // 'connect' listener.
	  console.log('connected to server!');
	
	  const options = {
	    method: "POST",
	    path: "/",
	    host: "127.0.0.1",
	    port: 8088,
	    headers: {
	      ["X-Foo2"]: "customed"
	    },
	    body: {
	      name: "elle"
	    }
	  }
	
	  let request = new Request(options)
	  client.write(request.toString());
	});
	client.on('data', (data) => {
	  console.log(data.toString());
	  client.end();
	});
	client.on('end', () => {
	  console.log('disconnected from server');
	});
	client.on('error', (err) => {
	  console.log(err);
	  client.end();
	});
	``` 
	
- 运行结果
	- ![封装后的request](http://p0.meituan.net/myvideodistribute/19807e0f02f52d93b9391645a286cfdf48815.png)

	
### 第三版：对 responseParse 进行封装
- 简单分析 response 内容框架
	- ![response](http://p0.meituan.net/myvideodistribute/9c17bab40bf615430215e496d9bdfeb5147249.png)
	- 开始我们的状态机 constructor 简单编写
	
		```javascript
		constructor() {
		    this.WAITING_STATUS_LINE = 0;
		    this.WAITING_STATUS_LINE_END = 1;
		    this.WAITING_HEADER_NAME = 2;
		    this.WAITING_HEADER_SPACE = 3;
		    this.WAITING_HEADER_VALUE = 4;
		    this.WAITING_HEADER_LINE_END = 5;
		    this.WAITING_HEADER_BLOCK_END = 6;
		    this.WAITING_BODY = 7;
		
		    this.current = this.WAITING_STATUS_LINE;
		    this.statusLine = "";
		    this.headers = {};
		    this.headerName = "";
		    this.headerValue = "";
		    this.bodyParse = null;
		}
		```
	- 对 response 字符流进行处理。循环读取流中数据
		
		```javascript
		// 字符流处理
		receive(string) {
		    for (let i = 0; i < string.length; i++) {
		      this.receiveChar(string.charAt(i));
		    }
		}		
  		```
  		
  	- 对流中单个字符进行扫描
  		
  		```javascript
		  receiveChar(char) {
		    if (this.current === this.WAITING_STATUS_LINE) {
		      if (char === '\r') {
		        this.current = this.WAITING_STATUS_LINE_END
		      } else {
		        this.statusLine += char
		      }
		    }
		
		    else if (this.current === this.WAITING_STATUS_LINE_END) {
		      if (char === '\n') {
		        this.current = this.WAITING_HEADER_NAME
		      }
		    }
		
		    else if (this.current === this.WAITING_HEADER_NAME) {
		      if (char === ':') {
		        this.current = this.WAITING_HEADER_SPACE
		      } else if (char === '\r') {
		        this.current = this.WAITING_HEADER_BLOCK_END
		        if (this.headers['Transfer-Encoding'] === 'chunked')
		          this.bodyParse = new TrunkedBodyParser();
		      } else {
		        this.headerName += char
		      }
		    }
		
		    else if (this.current === this.WAITING_HEADER_SPACE) {
		      if (char === ' ') {
		        this.current = this.WAITING_HEADER_VALUE
		      }
		    }
		
		    else if (this.current === this.WAITING_HEADER_VALUE) {
		      if (char === '\r') {
		        this.current = this.WAITING_HEADER_LINE_END
		        this.headers[this.headerName] = this.headerValue
		        this.headerName = ""
		        this.headerValue = ""
		      } else {
		        this.headerValue += char
		      }
		    }
		
		    else if (this.current === this.WAITING_HEADER_LINE_END) {
		      if (char === '\n') {
		        this.current = this.WAITING_HEADER_NAME
		      }
		    }
		
		    else if (this.current === this.WAITING_HEADER_BLOCK_END) {
		      if (char === '\n') {
		        this.current = this.WAITING_BODY
		      }
		    }
		
		    else if (this.current === this.WAITING_BODY) {
		      this.bodyParse.receiveChar(char)
		    }
		  }  		
  		```
		- 简单分析 server 端的 TrunkBody 
			
			```javascript
			2 // 下一行 trunk 长度
			ok // trunk 内容
			0 // trunk 终止，再没有内容
			```
			
			- 开始我们的 TrunkedBodyParser 状态机 constructor 简单编写
	
				```javascript
				  constructor() {
				    this.WAITING_LENGTH = 0;
				    this.WAITING_LENGTH_LINE_END = 1;
				    this.READING_TRUNK = 2;
				    this.WAITING_NEW_LINE = 3;
				    this.WAITING_NEW_LINE_END = 4;
				    this.FINISHED_NEW_LINE = 5;
				    this.FINISHED_NEW_LINE_END = 6;
				    this.isFinished = false;
				    this.length = 0;
				    this.content = [];
				    this.current = this.WAITING_LENGTH;
				  }
				```
			
			- TrunkBody 字符处理
				
				```javascript
				  // 字符流处理
				  receiveChar(char) {
				    if (this.current === this.WAITING_LENGTH) {
				      if (char === '\r') {
				        if (this.length === 0) {
				          this.current = this.FINISHED_NEW_LINE
				        } else {
				          this.current = this.WAITING_LENGTH_LINE_END
				        }
				      } else {
				        this.length *= 10
				        this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
				      }
				    }
				
				    else if (this.current === this.WAITING_LENGTH_LINE_END) {
				      if (char === '\n') {
				        this.current = this.READING_TRUNK
				      }
				    }
				
				    else if (this.current === this.READING_TRUNK) {
				      this.content.push(char)
				      this.length --
				      if (this.length === 0) {
				        this.current = this.WAITING_NEW_LINE
				      }
				    }
				
				    else if (this.current === this.WAITING_NEW_LINE) {
				      if (char === '\r') {
				        this.current = this.WAITING_NEW_LINE_END
				      }
				    }
				
				    else if (this.current === this.WAITING_NEW_LINE_END) {
				      if (char === '\n') {
				        this.current = this.WAITING_LENGTH
				      }
				    }
				
				    else if (this.current === this.FINISHED_NEW_LINE) {
				      if (char === '\r') {
				        this.current = this.FINISHED_NEW_LINE_END
				      }
				    }
				
				    else if (this.current === this.FINISHED_NEW_LINE_END) {
				      if (char === '\n') {
				        this.isFinished = true
				      }
				    }
		  		  }
				```
				
- 运行结果
	- ![client](http://p0.meituan.net/myvideodistribute/50256a14d9171b06c374dc7e6894efcf61275.png)
	- ![server](http://p0.meituan.net/myvideodistribute/23ed78fb0b5598952897249eb5ae2fbb29575.png)

	
## 参考文献
- [Node.js v12.16.3 Documentation](https://nodejs.org/dist/latest-v12.x/docs/api/http.html)



## 写在后面
- [完整代码地址-戳我戳我戳我](https://github.com/Ele-Peng/toy-browser)
- 祝大家多多发财