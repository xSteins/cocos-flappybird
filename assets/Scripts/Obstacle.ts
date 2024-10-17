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
      // kalo pipa spesial, override this.newVecPosnya
      let generateXPosition = (this.node.name !== 'Obstacle') && (this.node.name !== 'Obstacle2') ? this.newVecPos + 200 : this.newVecPos;
      this.node.setPosition(
        new Vec3(generateXPosition, this.generateYPosition(), 0)
      );
      this.node['hasPassed'] = false;
    }

    update(deltaTime: number) {
      this.gameSpeed = this.gameCtrlSpeed.speed // ambil value global dari controller
      // console.log("CURR POS " + this.node.position.x);
      this.node.translate(new Vec3(-this.gameSpeed * deltaTime, 0, 0))

      // kalo sudah mendekati ujung elemen node, harus regenerate vector baru
      if (this.node.position.x <= this.maxMovePos) {
        this.resetPipe()
      }
    }
  }