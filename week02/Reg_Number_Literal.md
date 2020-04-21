
## 写在前面
- 利用正则表达式，匹配所有 Number 字面量


## 实践过程

- ![NumbericLiteral 大纲](http://p1.meituan.net/myvideodistribute/fcc73488cd245a6c48cf067a6dc7641e16278.png)
- NumericLiteral :: 
	- DecimalLiteral
		- ![DecimalLiteral 大纲](http://p0.meituan.net/myvideodistribute/94398bab367ca56c0aa2435de753041520532.png)
			- ![DecimalLiteral 详情](http://p0.meituan.net/myvideodistribute/40d13f93242ff1f9321411cc7886586f52608.png)
			- DecimalIntegerLiteral . DecimalDigits(opt) ExponentPart(opt)
				- DecimalIntegerLiteral
					
					> (0)
					
					> ([1-9][0-9]*)
				- .
					> .
				- DecimalDigits
					> [0-9]*
				- ExponentPart
					> (e|E)(\\+|\\-)?([0-9])*
				- 可以推导出
					> /^((0)|([1-9][0-9]\*))?.?([0-9]\*)((e|E)?(\\+|\\-)?([0-9]*))?$/
			- . DecimalDigits ExponentPart(opt)
				- 可以推导出
					
					> /^**((0)|([1-9][0-9]\*))?**.?([0-9]\*)(((e|E)?(\\+|\\-)?([0-9])\*)\*)$/
			- DecimalIntegerLiteral ExponentPart(opt)
			
				> /^((0)|([1-9][0-9]\*))?**.?**([0-9]*)((e|E)?(\\+|\\-)?([0-9]\*))?$/
			- 最终
			
				> /^((0)|([1-9][0-9]\*))?.?([0-9]\*)((e|E)?(\\+|\\-)?([0-9]*))?$/

	- BinaryIntegerLiteral 
		- ![BinaryIntegerLiteral 大纲](http://p1.meituan.net/myvideodistribute/5a2e4c4c84c80cf794281290420928d78942.png)
			- ![BinaryIntegerLiteral 详情](http://p0.meituan.net/myvideodistribute/22c6b076cfe8b42d71003893bed4059512350.png)

				> /^0(b|B)(0|1)+$/
	- OctalIntegerLiteral 
		- ![OctalIntegerLiteral 大纲](http://p1.meituan.net/myvideodistribute/40145f430e5560e16f117863419eceea12195.png)
			- ![OctalIntegerLiteral 详情](http://p0.meituan.net/myvideodistribute/3049a1ac2a5071c0bcebae1e31db9a5512369.png)
				
				> /^0(O|o)[0-7]+$/
	- HexIntegerLiteral
		- ![HexIntegerLiteral 大纲](http://p1.meituan.net/myvideodistribute/cfe61ed151be1f9e1ab58a860cc6c8638397.png)
			- ![HexIntegerLiteral 详情](http://p0.meituan.net/myvideodistribute/75544696fc619ce55f6555d0fddd5a0617749.png)
				
				> /^0(x|X)(([0-9])|([a-f])|([A-F]))+$/
- 简单总结

	> /^(((0)|([1-9][0-9]\*))?.?([0-9]\*)((e|E)?(\\+|\\-)?([0-9]*))?)|(0(b|B)(0|1)+)|(0(O|o)[0-7]+)|(0(x|X)(([0-9])|([a-f])|([A-F]))+)$/
	
- 简化

	>  /^(((0)|([1-9]\d\*))?.?(\d\*)((e|E)?(\\+|\\-)?(\d*))?)|(0(b|B)(0|1)+)|(0(O|o)[0-7]+)|(0(x|X)((\d)|([a-f])|([A-F]))+)$/
	
	
## 写在后面
- 祝大家多多发财