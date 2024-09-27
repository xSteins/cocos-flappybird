import { _decorator, CCFloat, CCInteger, Component, Node, Vec3 } from 'cc'
import { GameController } from './GameController'
const { ccclass, property } = _decorator

@ccclass('Obstacle')
export class Obstacle extends Component {
  //buat edit kecepatan,batas geser gambar awal, sama posisi gambar baru
  public gameCtrlSpeed = new GameController()
  public gameSpeed: number
  // buat batas generate posisi x-axis dari vector
  @property({ type: CCFloat })
  public maxMovePos: number = -376.331
  @property({ type: CCFloat })
  public newVecPos: number = 385.05

  // buat batas randomize posisi y-axis vector
  private maxHeightPos: number = 180
  public minHeightPos: number = -270

  // generate
  generateYPosition (): number {
    // todo : fix min max ngebug malah ngambil dari x-axis??
    // console.log('max',this.maxHeightPos)
    // console.log('min',this.minHeightPos)
    let pos =
      Math.floor(Math.random() * (this.maxHeightPos - this.minHeightPos)) +
      this.minHeightPos
    return pos
    // return Math.floor(Math.random() * (this.maxHeightPos - this.minHeightPos)) + this.minHeightPos;
  }

  update (deltaTime: number) {
    this.gameSpeed = this.gameCtrlSpeed.speed // ambil value global dari controller
    // console.log("CURR POS " + this.node.position.x);
    this.node.translate(new Vec3(-this.gameSpeed * deltaTime, 0, 0))

    // kalo sudah mendekati ujung elemen node, harus regenerate vector baru
    if (this.node.position.x <= this.maxMovePos) {
      // console.log("UPDATE POS " + this.node.position.y);
      this.node.setPosition(
        new Vec3(this.newVecPos, this.generateYPosition(), 0)
      )
    }
  }
}
// scale dari pipa ini bisa diadjust untuk atur difficulty (to be implemented)
// selector untuk pipa atas dan bawah
// @property({ type: Node }) public topPipe: Node = null;
// @property({ type: Node }) public bottomPipe: Node = null;
// untuk adjust tinggi pipa atas dan bawah
// @property({ type: CCFloat }) public minYScale: number = 0.5;
// @property({ type: CCFloat }) public maxYScale: number = 1.5;
