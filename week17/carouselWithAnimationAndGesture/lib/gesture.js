// let element = document.body;

export function enableGesture(element) {
    let context = Object.create(null);

    let MOUSE_SYMBOL = Symbol("mouse");
    
    if (document.ontouchstart !== null)
        element.addEventListener("mousedown", (event) => {
            context[MOUSE_SYMBOL] = Object.create(null);
            console.log('mousedown')
            start(event, context[MOUSE_SYMBOL]);
            let mousemove = event => {
                move(event, context[MOUSE_SYMBOL]);
            }
    
            let mouseend = event => {
                end(event, context[MOUSE_SYMBOL]);
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseend);
            }
            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseup", mouseend);
        });
    
    // 有可能触发多指等
    element.addEventListener("touchstart", event => {
        console.log(event);
        for (let touch of event.changedTouches) {
            context[touch.identifier] = Object.create(null);
            start(touch, context[touch.identifier]);
        }
    });
    
    element.addEventListener("touchmove", event => {
        console.log(event);
        for (let touch of event.changedTouches) {
            move(touch, context[touch.identifier]);
        }
    });
    
    element.addEventListener("touchend", event => {
        console.log(event);
        for (let touch of event.changedTouches) {
            end(touch, context[touch.identifier]);
            delete context[touch.identifier];
        }
    });
    
    element.addEventListener("touchcancel", event => { // 系统消息近来等特殊情况 eg: alert
        console.log(event);
        for (let touch of event.changedTouches) {
            cancel(touch, context[touch.identifier]);
            delete context[touch.identifier];
        }
    });
    
    // tap
    
    // pan --> panstart panmove panend
    
    // flick
    
    // press --> pressstart pressend
    
    let start = (point, context) => {
        element.dispatchEvent(Object.assign(new CustomEvent("start"), {
            startX: point.clientX,
            startY: point.clientY,
            clientX: point.clientX,
            clientY: point.clientY,
        }))
        context.startX = point.clientX, context.startY = point.clientY;
        context.moves = [];
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.timeoutHandler = setTimeout(() => {
            if (context.isPan) {
                return;
            }
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            console.log('presstart');
            element.dispatchEvent(new CustomEvent("presstart"))
        }, 500);
    }
    
    let move = (point, context) => {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    
        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if (context.isPress) {
                console.log("presscancel")
                element.dispatchEvent(new CustomEvent("presscancel"))
            }
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            console.log('panstart');
            element.dispatchEvent(Object.assign(new CustomEvent("panstart"), {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            }))
        }
    
        if (context.isPan) {
            context.moves.push({
                dx,
                dy,
                t: Date.now()
            });
        
            context.moves = context.moves.filter(record => Date.now() - record.t < 300)
            console.log('pan');
            let e = new CustomEvent("pan");
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            })
            console.log('e', e);
            element.dispatchEvent(e);
        }
    }
    
    let end = (point, context) => {
        if (context.isPan) {
            let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
            let record = context.moves[0];
            const speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);
            console.log('speed', speed);
            let isFlick = speed > 2.5
            if (isFlick) {
                console.log("flick");
                element.dispatchEvent(Object.assign(new CustomEvent("flick"), {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed,
                }))
            }
            console.log(context.moves)
            console.log('panend');
            element.dispatchEvent(Object.assign(new CustomEvent("panend"), {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                speed,
                isFlick: isFlick
            }));
            // element.dispatchEvent(new CustomEvent("panend", {
            //     startX: context.startX,
            //     startY: context.startY,
            //     clientX: point.clientX,
            //     clientY: point.clientY,
            //     speed,
            //     isFlick: isFlick
            // }))
        }
        if (context.isTap) {
            element.dispatchEvent(new CustomEvent("tap"))
            // console.log('tap');
        }
        if (context.isPress) {
            console.log('pressend');
            element.dispatchEvent(new CustomEvent("pressend"))
        }
        clearTimeout(context.timeoutHandler);
        console.log("end", point.clientX, point.pointY);
    }
    
    let cancel = (point, context) => {
        console.log("cancel");
        element.dispatchEvent(new CustomEvent("cancel"))
        clearTimeout(context.timeoutHandler);
    }
}