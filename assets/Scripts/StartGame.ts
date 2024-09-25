import { __private, _decorator, Component, director, EventMouse, EventTouch, input, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {
    start() {
        this.node.on(Node.EventType.MOUSE_DOWN, (event: EventMouse) =>{
            director.loadScene('Game');
        }, this);
    }
    onLoad() {

    }
    update(deltaTime: number) {
        
    }
}


