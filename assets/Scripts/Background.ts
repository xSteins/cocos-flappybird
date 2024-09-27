import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc'
const { ccclass, property } = _decorator

import { GameController } from './GameController'

@ccclass('Background')
export class Background extends Component {
  //buat edit kecepatan,batas geser gambar awal, sama posisi gambar baru
  public gameCtrlSpeed = new GameController()
  public gameSpeed: number
  @property({ type: CCFloat })
  public maxMovePos: number = -618.078
  @property({ type: CCFloat })
  public newVecPos: number = -4.704

  start () {}

  update (deltaTime: number) {
    this.gameSpeed = this.gameCtrlSpeed.speed // ambil value global dari controller
    // console.log(this.node.position.x);
    this.node.translate(new Vec3(-this.gameSpeed * deltaTime, 0, 0))

    // kalo sudah mendekati ujung elemen node, harus regenerate vector baru
    if (this.node.position.x <= this.maxMovePos) {
      // console.log("UPDATE POS " + this.node.position.x);
      this.node.setPosition(new Vec3(this.newVecPos, 0, 0))
    }
  }
}
