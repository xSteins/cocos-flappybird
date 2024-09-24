import { _decorator, Component, EventMouse, input, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    start() {
        input.on(Input.EventType.TOUCH_START, this.onPlayerInput, this);
    }

    onPlayerInput() {
        // do jump here
        this.jumpByStep(1);
    }
    jumpByStep(step: number) {}

    update(deltaTime: number) {
        
    }
}


