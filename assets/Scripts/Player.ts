import { _decorator, Camera, CCInteger, Collider2D, Component, Contact2DType, input, Input, Label, Node, RenderTexture, Sprite, SpriteFrame, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;
import { GameController } from './GameController';

@ccclass('Player')
export class Player extends Component {
    // public gameController = new GameController;
    @property({ type: CCInteger })
    public gravityValue: number = 300;
    @property({ type: CCInteger })
    public playerMoveHeight: number = 500;

    start() {
        // 
        input.on(Input.EventType.TOUCH_START, this.moveBirdPosition, this);
        let collider = this.getComponent(Collider2D);
        if (collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact,this)
        }
    }
    moveBirdPosition(){
        this.playerMoveHeight = 340;
    }
    onContact(){
        alert('kena pipa');
        this.triggerGameOver();
        // console.log(this.node.name, otherCollider.node.name);
        // if (this.gameController){
        //     this.gameController.triggerGameOver();
        // }
    }

    update(deltaTime: number) {
        this.node.translate(new Vec3(0,this.playerMoveHeight*deltaTime,0));
        this.playerMoveHeight -= this.gravityValue*deltaTime

        // if (this.node.position.y <= -475){
        //     // game over
        //     this.triggerGameOver;
        // }
    }
       
    triggerGameOver(){
        // alert
        alert('game over');
    }

    
}


