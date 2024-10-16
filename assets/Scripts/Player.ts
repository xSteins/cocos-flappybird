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
  public playerMoveHeight: number = 340

  @property({ type: Node })
  public restartMenu: Node

  start() {
    // input handling langsung mengarah ke objek bird
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
  }

  onTouchStart() {
    this.moveBirdPosition()
  }

  moveBirdPosition() {
    // untuk gerakin playernya
    this.playerMoveHeight = 340;
    // tambahan sfx setiap input diterima
    this.getComponent(AudioSource).playOneShot(this.getComponent(AudioSource).clip);
  }

  generateUpdatePosition(deltaTime: number) {
    // ini untuk diupdate incremental berdasarkan waktu (todo)
    // saat ini dipake untuk checking supaya birdnya tidak loncat keatas dan langsung gameover
    return deltaTime * this.playerMoveHeight;
  }

  update(deltaTime: number) {
    // console.log(this.node.getPosition())
    // console.log("update ", this.generateUpdatePosition(deltaTime))
    // console.log("gravity ", this.playerMoveHeight - this.gravityValue * deltaTime)
    if (this.generateUpdatePosition(deltaTime) < 100) {
      this.node.translate(new Vec3(0, this.generateUpdatePosition(deltaTime), 0))
    }
    this.playerMoveHeight -= this.gravityValue * deltaTime
  }
}
