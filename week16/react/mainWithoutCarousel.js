function createElement(Cls, attributes, ...children) {

  let o;

  if (typeof Cls === "string") {
    o = new Wrapper(Cls);
  } else {
    o = new Cls({
      timer: {}
    });
  }



  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }

  //console.log(children);
  console.log(o);
  for (let child of children) {
    if (typeof child === "string")
      child = new Text(child);

    o.appendChild(child);
  }

  return o;
}

class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }

  setAttribute(name, value) { //attribute
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.children.push(child);

  }

  mountTo(parent) {
    parent.appendChild(this.root);

    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }

}

class MyComponent {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) { //attribute
    // this.root.setAttribute(name, value);
    this.attributes.set(name, value);
  }

  appendChild(child) {
    this.children.push(child);
  }

  set title(value) {
    this.properties.set("title", value)
  }

  render() {

    return <article>
      <h1>{this.attributes.get("title")}</h1>
      <h1>{this.properties.get("title")}</h1>
      <header>I'm a header</header>
      {this.slot}
      <footer>I'm a footer</footer>
    </article>
  }

  mountTo(parent) {
    this.slot = <div></div>
    for (let child of this.children) {
      this.slot.appendChild(child)
    }
    this.render().mountTo(parent)

  }


}


/*let component = <div id="a" cls="b" style="width:100px;height:100px;background-color:lightgreen">
        <div></div>
        <p></p>
        <div></div>
        <div></div>
    </div>*/

let component = <MyComponent title="hhhh">
  <div>text text text</div>
</MyComponent>

component.title = "hehehe"

component.mountTo(document.body);
/*
var component = createElement(
    Parent, 
    {
        id: "a",
        "class": "b"
    }, 
    createElement(Child, null), 
    createElement(Child, null), 
    createElement(Child, null)
);
*/

console.log(component);

//componet.setAttribute("id", "a");




// // 框架代码
// function createElement(Cls, attributes, ...children){

//   let o = new Cls({
//       timer: {}
//   });

//   for(let name in attributes) {
//     o.setAttribute(name, attributes[name]);
//   }

//   for(let child of children) {
//     o.children.push(child);
//   }

//   return o;
// }

// // 用户代码
// class Parent {

//   constructor(config){
//     this.children = [];
//   }

//   set class(v){ //property
//     console.log("Parent::class", v)
//   }

//   set id(v){ //property
//     console.log("Parent::id", v)
//   }

//   setAttribute(name, value) { //attribute
//     console.log(name, value);
//   }

// }

// class Child {
//   set class(v) {
//     console.log("Child: class")
//   }
// }

// let component = <Parent id="a" class="b">
//     <Child></Child>
//     <Child></Child>
//     <Child></Child>
//   </Parent>

// console.log(component)