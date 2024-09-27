import {
  _decorator,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  director,
  input,
  Input,
  Node,
  Vec3
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Player')
export class Player extends Component {
  @property({ type: CCInteger })
  public gravityValue: number = 300
  @property({ type: CCInteger })
  public playerMoveHeight: number = 500

  @property({ type: Node })
  public restartMenu: Node

  start () {
    // input handling langsung mengarah ke objek bird
    input.on(Input.EventType.TOUCH_START, this.moveBirdPosition, this)
    // colision handling
    let collider = this.getComponent(Collider2D)
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this)
    }
  }

  moveBirdPosition () {
    this.playerMoveHeight = 340
  }
  // saat kena pipa, aktifkan restartmenu dan pause
  onContact () {
    // pause game, display node restartmenu
    director.pause()
    this.node.active = false // hide burungnya
    this.restartMenu.active = true
    // display nilai highest score, ambil dari Scoreboard
    // this.restartGame();
  }

  update (deltaTime: number) {
    this.node.translate(new Vec3(0, this.playerMoveHeight * deltaTime, 0))
    this.playerMoveHeight -= this.gravityValue * deltaTime
  }
}
