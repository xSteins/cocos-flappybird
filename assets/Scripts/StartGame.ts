import { __private, _decorator, Component, director, EventMouse, EventTouch, input, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {
    start() {
        input.on(Input.EventType.TOUCH_START, this.moveScene, this);
    }
    moveScene(){
        director.loadScene('Game');
    }
    update(deltaTime: number) {
        
    }
}


