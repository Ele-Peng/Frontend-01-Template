import {createElement, Text, Wrapper} from "./lib/createElement";
import {Timeline, Animation} from "./lib/animation";
import {ease} from "./lib/cubicBezier";

import css from "./carousel.css";

export class Carousel {
    constructor(config) {
      this.children = [];
      this.attributes = new Map();
      this.properties = new Map();
      this.timeline = null;
    }
  
    setAttribute(name, value) { //attribute
      // console.log('name', name);
      // console.log('value', value);
      this[name] = value;
      this.attributes.set(name, value);
    }
  
    appendChild(child) {
      this.children.push(child);
    }
  
    render() {
      this.timeline = new Timeline;
      this.timeline.start();
  
      let position = 0;
      let nextPicStopHandler = null;


      let children = this.data.map((url, currentPosition) => {
  
        let lastPosition = (position - 1 + this.data.length) % this.data.length;
        let nextPosition = (position + 1) % this.data.length;
        
        let offset = 0;

        let onStart = () => {
          this.timeline.pause();
            clearTimeout(nextPicStopHandler);
            let currentElement = children[currentPosition];

            let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])

            offset = currentTransformValue + 500 * currentPosition
        }

        let onPan = (event) => {
            let lastElement = children[lastPosition];
            let currentElement = children[currentPosition]
            let nextElement = children[nextPosition]

            let dx = event.clientX - event.startX;

            let  currentTransformValue = - 500 * currentPosition + offset  + dx;
            let  lastTransformValue= - 500 - 500 * lastPosition + offset + dx;
            let  nextTransformValue= 500 - 500 * nextPosition + offset + dx;

            lastElement.style.transform = `translateX(${lastTransformValue}px)`;
            currentElement.style.transform = `translateX(${currentTransformValue}px)`;
            nextElement.style.transform = `translateX(${nextTransformValue}px)`;
        }


        let onPanend = (event)=>{

            let direction = 0;
            let dx = event.clientX - event.startX;

            if(dx + offset > 250 || dx > 0 && event.isFlick){
                direction = 1;
            }else if(dx + offset < - 250 || dx < 0 && event.isFlick){
                direction = -1;
            }

            this.timeline.reset();
            this.timeline.start();

            let lastElement = children[lastPosition];
            let currentElement = children[currentPosition];
            let nextElement = children[nextPosition];

            
            let lastTransformValue  = {
                start:- 500 - 500 * lastPosition + offset + dx,
                end: - 500 - 500 * lastPosition + direction * 500
            }
            let currentTransformValue = {
                start:- 500 * currentPosition + offset  + dx,
                end:- 500 * currentPosition  + direction * 500//终止位置要到500 * x的正确位置
            }
            let nextTransformValue = {
                start:500 - 500 * nextPosition + offset + dx,
                end: 500 - 500 * nextPosition + direction * 500
            }

            let lastAnimation = new Animation(lastElement.style, 'transform', lastTransformValue.start, lastTransformValue.end, 500, 0, ease, v=>`translateX(${v}px)`);
            let currentAnimation = new Animation(currentElement.style, 'transform', currentTransformValue.start, currentTransformValue.end, 500, 0, ease, v=>`translateX(${v}px)`);
            let nextAnimation = new Animation(nextElement.style, 'transform', nextTransformValue.start, nextTransformValue.end, 500, 0, ease, v=>`translateX(${v}px)`);
            
            this.timeline.add(currentAnimation)
            this.timeline.add(nextAnimation)
            this.timeline.add(lastAnimation)
            
            position = (position - direction + this.data.length) % this.data.length;

            //继续播放下一张
            nextPicStopHandler = setTimeout(nextPic,3000);
        }

        let element = <img src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGesture={true}/>;
        console.log('element', element)
        element.style.transform = "translateX(0px);"
        element.addEventListener("dragstart", event => event.preventDefault())
        return element

      })

  
      let nextPic = () => {
        let nextPosition = (position + 1) % this.data.length;
  
        let current = children[position];
        let next = children[nextPosition];

        let currentAnimation = new Animation(
            current.style, 
            "transform", 
            - 100 * position, 
            -100 - 100 * position,
            500,
            0,
            ease,
            v => `translateX(${5 * v}px)`
        )
        let nextAnimation = new Animation(
            next.style, 
            "transform", 
            100 - 100 * nextPosition, 
            -100 * nextPosition,
            500,
            0,
            ease,
            v => `translateX(${5 * v}px)`
        )

        this.timeline.add(currentAnimation);
        this.timeline.add(nextAnimation);
  
        position = nextPosition;
        nextPicStopHandler = setTimeout(nextPic, 3000);
      }

      nextPicStopHandler = setTimeout(nextPic, 3000);
  
  
  
    //   root.addEventListener("mousedown", (event) => {
    //     let startX = event.clientX, startY = event.clientY;
  
    //     let lastPosition = (position - 1 + this.data.length) % this.data.length;
    //     let nextPosition = (position + 1) % this.data.length;
  
  
    //     let current = children[position];
    //     let last = children[lastPosition];
    //     let next = children[nextPosition];
  
    //     current.style.transition = "ease 0s";
    //     last.style.transition = "ease 0s";
    //     next.style.transition = "ease 0s";
  
    //     current.style.transform = `translateX(${- 500 * position}px)`;
    //     last.style.transform = `translateX(${- 500 - 500 * lastPosition}px)`;
    //     next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;
  
    //     let move = (event) => {
    //       current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`;
    //       last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)`;
    //       next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`;
    //       // console.log(event.clientX - startX, event.clientY - startY)
    //     }
    //     let up = (event) => {
    //       let offset = 0;
  
    //       if (event.clientX - startX > 250) {
    //         offset = 1;
    //       } else if (event.clientX - startX < -250) {
    //         offset = -1;
    //       }
  
    //       current.style.transition = "";
    //       last.style.transition = "";
    //       next.style.transition = "";
  
    //       current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
    //       last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;
    //       next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;
  
    //       position = (position - offset + this.data.length) % this.data.length;
  
    //       document.removeEventListener("mousemove", move);
    //       document.removeEventListener("mouseup", up);
    //     }
  
    //     document.addEventListener("mousemove", move);
    //     document.addEventListener("mouseup", up);
    //   })
  
      let root = <div class="carousel">
        {children}
      </div>
  
  
  
      return root;
    }
  
    mountTo(parent) {
      this.render().mountTo(parent)
    }
  
  }