import {
  _decorator,
  AudioSource,
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

  start() {
    // input handling langsung mengarah ke objek bird
    input.on(Input.EventType.TOUCH_START, this.moveBirdPosition, this)

  }

  moveBirdPosition() {
    this.playerMoveHeight = 340
    // tambahan sfx setiap input diterima
    this.getComponent(AudioSource).playOneShot(this.getComponent(AudioSource).clip);
  }


  update(deltaTime: number) {
    this.node.translate(new Vec3(0, this.playerMoveHeight * deltaTime, 0))
    this.playerMoveHeight -= this.gravityValue * deltaTime
  }
}
