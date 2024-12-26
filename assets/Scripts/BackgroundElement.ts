import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('BackgroundElement')
export class BackgroundElement extends Component {
    // buat edit kecepatan, batas geser gambar awal, sama posisi gambar baru
    public gameCtrlSpeed = new GameController();
    public gameSpeed: number;

    // implementasi parallax pakai fine-tuning dari variable ini
    @property({ type: CCFloat })
    public parallaxFactor: number = 1;

    @property({ type: CCFloat })
    public maxMovePos: number = 0; // batas posisi geser

    @property({ type: CCFloat })
    public newVecPosX: number = 0; // posisi X baru setelah reset

    @property({ type: CCFloat })
    public newVecPosY: number = 0; // posisi Y baru setelah reset

    // value ini dimasukan ke editor langsung :
    // background 
    // parallaxFactor = 0.5 (lebih lambat drpd 1)
    // maxMovePos = -618.078
    // newVecPosX = -4.704
    // newVecPosY = 0

    // ground 
    // maxMovePos = -639.523
    // newVecPosX = -319.465
    // newVecPosY = -480
    start() {

    }

    update(deltaTime: number) {
        this.gameSpeed = this.gameCtrlSpeed.speed; // ambil value global dari controller

        // geser elemennya
        this.node.translate(new Vec3(-this.gameSpeed * deltaTime, 0, 0));

        // kalo sudah mendekati ujung elemen node, harus regenerate vector baru
        if (this.node.position.x <= this.maxMovePos) {
            this.node.setPosition(new Vec3(this.newVecPosX, this.newVecPosY, 0));
        }
    }
}


