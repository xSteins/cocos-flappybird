import { _decorator, CCFloat, Component, Vec3 } from 'cc'
import { GameController } from './GameController'
const { ccclass, property } = _decorator

@ccclass('Obstacle')
export class Obstacle extends Component {
  public gameCtrlSpeed = new GameController()
  public gameSpeed: number

  @property({ type: CCFloat })
  public maxMovePos: number = -476.331 // +100 supaya edge case special obstale gak hilang sblum out of view

  @property({ type: CCFloat })
  public newVecPos: number = 385.05

  private maxHeightPos: number = 180
  public minHeightPos: number = -270

  // generate
  generateYPosition(): number {
    // todo : fix min max ngebug malah ngambil dari x-axis??
    // console.log('max',this.maxHeightPos)
    // console.log('min',this.minHeightPos)
    let pos =
      Math.floor(Math.random() * (this.maxHeightPos - this.minHeightPos)) +
      this.minHeightPos
    return pos
    // return Math.floor(Math.random() * (this.maxHeightPos - this.minHeightPos)) + this.minHeightPos;
  }

  resetPipe() {
    // let generateXPosition =
    //   this.node.name !== 'Obstacle' && this.node.name !== 'Obstacle2'
    //     ? this.newVecPos + 200 : this.newVecPos // ini buat cek kalo dia special obstacle, maka reset positionnya +200 dari node obstacle biasa
    this.node.setPosition(
      new Vec3(this.newVecPos, this.generateYPosition(), 0)
    )
    this.node['hasPassed'] = false
  }

  update(deltaTime: number) {
    this.gameSpeed = this.gameCtrlSpeed.speed
    this.node.translate(new Vec3(-this.gameSpeed * deltaTime, 0, 0))

    // tidak perlu reset dari self / pipanya sendiri, langsung dari gamecontroller
    // if (this.node.position.x <= this.maxMovePos) {
    //   this.resetPipe()
    // }
  }
}
