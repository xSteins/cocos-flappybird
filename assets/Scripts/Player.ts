import {
  _decorator,
  AudioSource,
  CCInteger,
  Component,
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

  @property({ type: CCInteger })
  private maxFallRotation: number = -36; // angle burung ke bawah
  @property({ type: CCInteger })
  private upwardRotation: number = 20; // ini angle untuk tiap rotasi ke atas

  // untuk animasi naik turun burung, buffer time ini supaya gak langsung ganti rotasi burungnya
  private bufferTime: number = 0.2;
  private bufferTimer: number = 0;
  private isFalling: boolean = false;

  onTouchStart() {
    this.moveBirdPosition();
    this.bufferTimer = this.bufferTime; // update timer ke default 0.3
  }

  moveBirdPosition() {
    this.node.setRotationFromEuler(0, 0, this.upwardRotation); // kasih rotasi ke atas
    this.isFalling = false; // reset setiap ada input
    // untuk gerakin playernya
    this.playerMoveHeight = 340;
    // tambahan sfx setiap input diterima
    this.getComponent(AudioSource).playOneShot(this.getComponent(AudioSource).clip);
  }

  generateUpdatePosition(deltaTime: number) {
    return deltaTime * this.playerMoveHeight;
  }

  update(deltaTime: number) {
    // handling posisi burung, ambil currpos
    const currPos = this.node.getPosition();
    const yAxisPos = currPos.y + this.generateUpdatePosition(deltaTime);

    // update burung supaya update keatas berdasar kalkulasi yAxisPos
    this.node.setPosition(new Vec3(currPos.x, yAxisPos, currPos.z));

    // mekanisme gravitasi
    this.playerMoveHeight -= this.gravityValue * deltaTime;

    // cek burungnya turun gak
    if (this.playerMoveHeight < 0) {
      this.isFalling = true;
    }
    // ini edge case kalo buffernya gak habis2 (buat bikin burungnya turun)
    if (this.bufferTimer > 0) {
      this.bufferTimer -= deltaTime;
    }
    // rotasi burung setelah buffer (burungnya selesai naik)
    if (this.bufferTimer <= 0 && this.isFalling) {
      this.node.setRotationFromEuler(0, 0, this.maxFallRotation);
    }
  }
}
