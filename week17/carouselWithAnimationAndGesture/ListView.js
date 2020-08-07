import {createElement, Text, Wrapper} from "./lib/createElement";
import {Timeline, Animation} from "./lib/animation";
import {ease} from "./lib/cubicBezier";

export class ListView {
    constructor(config) {
      this.children = [];
      this.attributes = new Map();
      this.properties = new Map();
      this.timeline = null;
      this.state = Object.create(null);
    }
  
    setAttribute(name, value) { //attribute
      // console.log('name', name);
      // console.log('value', value);
      this[name] = value;
      this.attributes.set(name, value);
    }

    getAttribute(name) {
      return this.attributes.get(name);
    }
  
    appendChild(child) {
      this.children.push(child);
    }
  
    render() {
      let data = this.getAttribute('data');

      let root = <div class="list-view" style="width: 300px;">
        {
          data.map(this.children[0]) // this.children[0] 是一个函数
        }
      </div>
  
      return root;
    }
  
    mountTo(parent) {
      this.render().mountTo(parent)
    }
  
  }