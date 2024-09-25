import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component {
    //buat edit kecepatan,batas geser gambar awal, sama posisi gambar baru
    public gameCtrlSpeed = new GameController;
    public gameSpeed: number
    @property({ type: CCFloat }) 
    public maxMovePos: number = -376.331;
    @property({ type: CCFloat }) 
    public newVecPos: number = 385.05
    @property({ type: CCFloat }) 
    public pipeWidth: number = 52

    start() {

    }

    update(deltaTime: number) {
        this.gameSpeed = this.gameCtrlSpeed.speed; // ambil value global dari controller
        console.log("CURR POS " + this.node.position.x);
        this.node.translate(new Vec3(-this.gameSpeed*deltaTime,0,0));

        // kalo sudah mendekati ujung elemen node, harus regenerate vector baru
        if (this.node.position.x <= this.maxMovePos){
            console.log("UPDATE POS " + this.node.position.x);
            this.node.setPosition(new Vec3(this.newVecPos, 0,0));
        }
    }
}


