## 写在前面
- 都说 Javascript 不是典型的面向对象编程语言，它并不具备完整的 OOP 该有的特性，它虽引进了 class 语法糖，但只是让对象原型写法更加像面向对象编程语言的写法，那面向对象到底可以理解为什么 ? 🤔 以及函数式编程思想在推什么？Javascript 定位究竟是什么？
- 简单记录一下自己关于这个问题的思考
<!-- more -->

## OOP Wikipedia
- 探讨的是面向对象
- 我们首先可以想想，我们为什么需要封装成对象？
	- 我的理解是：我们需要减少我们的操作粒度，每个操作都去落实到 bit 数据是非常庞大的，减少问题求解复杂度
	- wiki 上关于 object 特性也给到了支持
- A feature of objects is an object's procedures that can **access** and **often modify the data fields** of the object with which they are associated (objects have a notion of "this" or "self").
	- 可以和面向过程 (Procedure Oriented) 放在一起说。
	- 首先 OOP 是一个很自然的思想，在C语言中也能写出**符合**面向对象思想的代码
		
		```c
		// C语言例子
		struct Student{
		    char *name;  //姓名
		    int num;  //学号
		    int age;  //年龄
		    char group;  //所在学习小组
		    float score;  //成绩
		};
		
		char* GetStudentName(struct Student* stu)
		{
		    // 略
		}
		
		void SetStudentName(struct Student* stu, char* newName)
		{
		    // 略
		}
		
		int main()
		{
		    struct Student s1, s2, s3, s4; // 创建了多个学生
		    SetStudentName(&s1, "小明");
		    SetStudentName(&s2, "小红");
		    return 0;
		}
		```
- 其次 OOP 面向对象编程，在做一件什么事情？
	- 在面对复杂性业务需求中，面向对象思想可以将业务先进行分析，如果业务需求全新无关联，那我们可以新建一个对象，在里面封装对应的方法；如果业务需求只是一条延展线（比如特定节假日打折），那我们可以继承现有对象，并对现有对象的某些方法（discount），进行特定操作，即多态：用统一的方法对不同的对象进行同样的操作。
	
		```C++
		override fun discount(price: Double): Double {
	        if (!isCouple()) return price
	        if (price > 99) {
	            val lucky = Random().nextInt(gifts.size)
	            println("Congratulations on getting ${gifts[lucky]}!")
	        }
	        return price * 0.77
	    }
		```
		- 而面对这种频繁操作数据单元的使用面向过程编程思想，可能会在现有对象加上判断，万一节假日还要做其他的业务，判断只会越来越多。这就与我们 Nicklaus Wirth 提出的：**程序 = 数据结构 + 算法**，越来越割裂。
	- 在我现在的浅薄思考看来：面向对象编程思想比较广泛的 Object-based 实现是想先让不同对象以尽可能的统一特性进行归组，形成“大对象”，然后各个对象变成了这个大对象中衍生出来的基类，并在父类派生出来的对象中，去实现各自解决问题的具体方法。这样当我们在拿到一个问题，我们可以不用去管它的内部实现，我们根据类型就可以知道它能做什么事，这比我们手动去一步一步执行要先进点。**让对象有多态性，把不同对象以同一特性来归组，统一处理。至于所谓继承等概念，是实现的细节**。

## prototype-based programming
- Languages with abstract data type support which may be used to **resemble OO programming**, but **without all features of object-orientation**. This includes object-based and **prototype-based languages**. Examples: JavaScript, Lua, Modula-2, CLU.
- The Document Object Model of HTML, XHTML, and XML documents on the Internet has bindings to the popular JavaScript/ECMAScript language. **JavaScript is perhaps the best known prototype-based programming language, which employs cloning from prototypes rather than inheriting from a class (contrast to class-based programming)**. 
- 我们在大概了解了 OOP 思想后，我们可以继续看看 OOP编程思想的另一种实现“类OOP”--基于原型编程 Javascript 实现
- 我们可以先从 ECMA-262 规范中找到关于 Object 的定义
	- "Objects are created by using constructors in **new expressions**."
	- "Each constructor is a function that has a property named **'prototype' that is used to implement prototype-based inheritance and shared properties**."
	- "Every object created by a constructor has an implicit reference (called the object's prototype) to the value of its constructor's 'prototype' property. Furthermore, a prototype may have a non-null implicit reference to its prototype, and so on; this is called the prototype chain. When a reference is made to a property in an object, that reference is to the property of that name in the first object in the prototype chain that contains a property of that name. In other words, first the object mentioned directly is examined for such a property; if that object contains the named property, that is the property to which the reference refers; if that object does not contain the named property, the prototype for that object is examined next; and so on."
	- ![ECMA原型链](http://p0.meituan.net/myvideodistribute/54f432d1395e59da48e0e7935ffd7665110363.png)
- 同时 Douglas Crockford 关于 [prototypal inheritance](https://crockford.com/javascript/prototypal.html)

	```javascript
	function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
	```
	- "The object function untangles JavaScript's constructor pattern, achieving true prototypal inheritance. It takes an old object as a parameter and returns an empty new object that inherits from the old one. If we attempt to obtain a member from the new object, and it lacks that key, then the old object will supply the member. Objects inherit from objects."
	- "What could be more object oriented than that?" 😝
- 也有新的对 Object 的思考
	- "In JavaScript, **an object is an associative array**, augmented with a prototype (see below); each string key provides the name for an object property, and there are two syntactical ways to specify such a name: dot notation (obj.x = 10) and bracket notation (obj['x'] = 10). A property may be added, rebound, or deleted at run-time. Most properties of an object (and any property that belongs to an object's prototype inheritance chain) can be enumerated using a for...in loop."

## Functional programming
- Functional programming has its origins in lambda calculus.It is a programming paradigm —- a style of building the structure and elements of computer programs -- that treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.
- One of the key motivations for the development of functional programming is making a program easier to understand by eliminating changes in state that **do not depend on function inputs** which are called side effects.
- side effects include modifying a non-local variable, modifying a static local variable, modifying a mutable argument passed by reference, performing I/O or calling other side-effect functions.
- referential transparency
	- the same language expression can result in different values at different times depending on the state of the executing program.
	- Consider C assignment statement x = x * 10, this changes the value assigned to the variable x. Let us say that the initial value of x was 1, then two consecutive evaluations of the variable x yields 10 and 100 respectively. Clearly, replacing x = x * 10 with either 10 or 100 gives a program with different meaning, and so the expression is not referentially transparent. In fact, assignment statements are never referentially transparent.
	- Absence of side effects is a necessary, but not sufficient, condition for referential transparency. **Referential transparency means that an expression (such as a function call) can be replaced with its value**. This requires that the expression is pure, that is to say the expression must be deterministic (always give the same value for the same input) and side-effect free.

## 个人总结
- Javasript 说它是基于面向对象的编程语言是不严谨的，准确的说他是面向对象的编程语言，的基于原型实现的编程语言。

## All Objects in Javascript
- 可参考[ECMA-Script 262 Chapter18.3 Constructor Properties of the Global Object P399](https://www.ecma-international.org/publications/standards/Ecma-262.htm) 

	| 基本类型|  Error  | 数据结构 & 内置对象  | TypedArray |
	| --- | --- | --- | --- |
	| Boolean | Error | Array | Float32Array |
	| Number | EvalError |	ArrayBuffer |	 Float64Array |
	| Object | RangeError | DataView | Int8Array |
	| String | ReferenceError | Date | Int16Array |
	| Symbol | SyntaxError | Function | Int32Array |
	|  | TypeError | Map | Uint8Array |
	|  | URIError | Promise | Uint8ClampedArray |
	|  |  | Proxy | Uint16Array |
	|  |  | RegExp | Uint32Array |
	|  |  |Set |  |
	|  |  | SharedArrayBuffer |  |
	|  |  | WeakMap |  |
	|  |  | WeakSet |  |


## 参考文献
- [引入 Javascript 对象](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects)
- [Flaws of Object Oriented Modeling](https://software.intel.com/en-us/blogs/2008/08/22/flaws-of-object-oriented-modeling/)
- [learn object oriented thinking & programming](https://books.google.com/books?id=xb-sAQAAQBAJ&printsec=frontcover&dq=isbn:9788090466180&hl=zh-CN&sa=X&ved=0ahUKEwiG-8y8qdroAhWmUt8KHey5Dl0Q6AEIKDAA#v=onepage&q&f=false)
- [Obejct thinking](https://books.google.com/books?id=WzsFCAAAQBAJ&printsec=frontcover&dq=isbn:9780735619654&hl=zh-CN&sa=X&ved=0ahUKEwiqzaPSqNroAhVvUd8KHc80CYEQ6AEIKDAA#v=onepage&q&f=false)
- [Javascript Object-orientation (prototype-based)](https://en.wikipedia.org/wiki/JavaScript)
- [Introduction to Object Oriented Programming Concepts (OOP) and More](https://www.codeproject.com/Articles/22769/Introduction-to-Object-Oriented-Programming-Concep)
- [Functional_programming wikipedia](https://en.wikipedia.org/wiki/Functional_programming)
- [Side effect wikipedia](https://en.wikipedia.org/wiki/Side_effect_(computer_science))
- [Object-oriented programming wikipedia](https://en.wikipedia.org/wiki/Object-oriented_programming)


## 写在后面
- 有对 Object 以及对 reference 产生的 side effects 
新的认识
- 闭包 closure
	- A nested function is a function defined within another function. It is created each time the outer function is invoked. In addition, each nested function forms a lexical closure: The lexical scope of the outer function (including any constant, local variable, or argument value) becomes part of the internal state of each inner function object, even after execution of the outer function concludes.
- 祝大家多多发财