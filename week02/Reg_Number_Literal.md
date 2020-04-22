

## 写在前面
- 利用正则表达式，匹配所有 Number 字面量
<!-- more -->

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
				
				> /^0(x|X)([0-9a-fA-F])+$/
- 简单总结

	> /^(((0)|([1-9][0-9]\*))?.?([0-9]\*)((e|E)?(\\+|\\-)?([0-9]*))?)|(0(b|B)(0|1)+)|(0(O|o)[0-7]+)|(0(x|X)([0-9a-fA-F])+)$/
	
- 简化

	>  /^((((0)|([1-9]\d\*))?.?(\d\*)((e|E)?(\\+|\\-)?(\d*))?)|(0(b|B)(0|1)+)|(0(O|o)[0-7]+)|(0(x|X)([0-9a-fA-F])+))$/

  ```javascript
  /^((((0)|([1-9]\d*))?.?(\d*)((e|E)?(\+|\-)?(\d*))?)|(0(b|B)(0|1)+)|(0(O|o)[0-7]+)|(0(x|X)([0-9a-fA-F])+))$/
  ```
  
## 结果测试
- 十六进制数： 0x0233acdfACDF
	- ![十六进制数](http://p0.meituan.net/myvideodistribute/6b7064f71909191efad66a7a6899e17551930.png)
- 八进制数：0o023657
	- ![八进制数](http://p0.meituan.net/myvideodistribute/a65a14040f2a483733b92a78ca7cb76956176.png)
- 二进制数： 0b01010111
	- ![二进制数](http://p0.meituan.net/myvideodistribute/33e2f75a6f02ec627a4aa16f56c9d59251733.png)
- 浮点数：.2373736
	- ![浮点数](http://p0.meituan.net/myvideodistribute/facf9ed43fe79a6e05525c9597f1014054052.png)
- IEEE 754：1.2e+32
	- ![IEEE 754](http://p1.meituan.net/myvideodistribute/28058fac862347153c3d605fbb37272952996.png)
- 特殊情况 .0
	- ![特殊情况](http://p0.meituan.net/myvideodistribute/5d38329b0247e224ac893957ae24e9a150951.png)
	
	
## 写在后面
- 祝大家多多发财