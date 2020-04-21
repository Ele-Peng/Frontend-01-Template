
## 写在前面
- 正则表达式，匹配所有 字符串 字面量


## 实践过程

- ![StringLiteral 大纲](http://p0.meituan.net/myvideodistribute/42c12116bea0d20ad46f3eaaec710ee419568.png)
- StringLiteral ::
	- DoubleStringCharacters
		- ![DoubleStringCharacters 大纲](http://p0.meituan.net/myvideodistribute/03c05dd8a9fd5b8b621593fe039e4e6c16908.png)
			- ![DoubleStringCharacter 详情](http://p0.meituan.net/myvideodistribute/ef23a0f824e9fc948b61da6c4a8d2a4729602.png)
				- ![SourceCharacter 详情](http://p0.meituan.net/myvideodistribute/9004c303c8ebdbb8e38c00e7597b2c5b10649.png)

					> \\\u[0-9a-fA-F]{4}
				- ![EscapeSequence 详情](http://p0.meituan.net/myvideodistribute/25a7c00f444aaead5b3a187d09ab280a16997.png)
					- ![CharacterEscapeSequence 详情](http://p0.meituan.net/myvideodistribute/ef30597fe4124e22ae7fcf243d9712a310845.png)
						- ![SingleEscapeCharacter 详情](http://p0.meituan.net/myvideodistribute/b495509fe89ca78a7d2f5f06831d45c79074.png)

							> '"\\\bfnrtv
						- ![NonEscapeCharacter 详情](http://p0.meituan.net/myvideodistribute/7ce330d5a54c7c8ac927771ee7a0540814453.png)
							- ![EscapeCharacter 详情](http://p1.meituan.net/myvideodistribute/f3d3a1b2fba86ebd4b8b6ab2959302e610550.png)
								
								> '"\\\bfnrtv0-9xu 
							- ![LineTerminator 详情](http://p0.meituan.net/myvideodistribute/8c027b4dfef1876ad432fd62b6ecc4a59724.png)
								
								> \n\r\u2028\u2029
						
								- ![LineTerminator 码点](http://p0.meituan.net/myvideodistribute/02a7f707581cb217ab5025d7a48e67e829247.png)
					
					- **CharacterEscapeSequence**总结为：
					
						> '"\\\bfnrtv0-9xu\n\\r\u2028\u2029
					
					- ![HexEscapeSequence 详情](http://p1.meituan.net/myvideodistribute/9207083723607a9faa4f0a560599dde17694.png)

					- **HexEscapeSequence**总结为：

						> \\\x[0-9a-fA-F]{2}
					
					- ![UnicodeEscapeSequence 详情](http://p0.meituan.net/myvideodistribute/545f52e053421a0e9c5e3b231a96276d10075.png)
						- ![Hex4Digits 详情](http://p1.meituan.net/myvideodistribute/8bb8c713ee753fd2844aea95e3ecde417620.png)
					- **UnicodeEscapeSequence**总结为：

						>  \\\u[0-9a-fA-F]{4}
						
				- **EscapeSequence**总结为：

					> ('"\\\bfnrtv0-9xu\n\\r\u2028\u2029])|(\\\x[0-9a-fA-F]{2})|(\\\u[0-9a-fA-F]{4})
					
				- ![LineContinuation 详情](http://p0.meituan.net/myvideodistribute/bd86a4d39c1ae8d719eca6afbd9dcb147948.png)
					- ![LineTerminatorSequence 详情](http://p0.meituan.net/myvideodistribute/e8b4e35d4653ecb6a0f89d848085f69b14054.png)
				- **LineContinuation**总结为：
				
					> \\\\\n\r\u\2028]2029
					
	- **DoubleStringCharacters**总结为：

		> "(?:(\\\\('"\\\bfnrtv0-9xu\n\\r\u2028\u2029])|(\\\x[0-9a-fA-F]{2})|(\\\u[0-9a-fA-F]{4}))|(\\\\\n\r\u\2028]2029))*"
		
	- SingleStringCharacters
		- ![SingleStringCharacters 大纲](http://p0.meituan.net/myvideodistribute/6d2e2b31ed15050de59907d5537b9e9219247.png)
	- **SingleStringCharacters**总结为：

		> '(?:(\\\\('"\\\bfnrtv0-9xu\n\\r\u2028\u2029])|(\\\x[0-9a-fA-F]{2})|(\\\u[0-9a-fA-F]{4}))|(\\\\\n\r\u\2028]2029))*'
		
- **StringLiteral**总结为：
	
	> (^"(?:(\\\\('"\\\bfnrtv0-9xu\n\\r\u2028\u2029])|(\\\x[0-9a-fA-F]{2})|(\\\u[0-9a-fA-F]{4}))|(\\\\\n\r\u\2028]2029))*"$)|(^'(?:(\\\\('"\\\bfnrtv0-9xu\n\\r\u2028\u2029])|(\\\x[0-9a-fA-F]{2})|(\\\u[0-9a-fA-F]{4}))|(\\\\\n\r\u\2028]2029))*'$)
	
	```javascript
	(^"(?:(\\('"\\bfnrtv0-9xu\n\\r\u2028\u2029])|(\x[0-9a-fA-F]{2})|(\u[0-9a-fA-F]{4}))|(\\\n\r\u\2028]2029))*"$)|(^'(?:(\\('"\\bfnrtv0-9xu\n\\r\u2028\u2029])|(\x[0-9a-fA-F]{2})|(\u[0-9a-fA-F]{4}))|(\\\n\r\u\2028]2029))*'$)
	```


## 写在后面
- 祝大家多多发财