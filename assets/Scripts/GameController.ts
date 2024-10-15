import {
  __private,
  _decorator,
  AudioSource,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  director,
  Label,
  Node
} from 'cc'
const { ccclass, property } = _decorator

import { Ground } from './Ground'
import { Background } from './Background'

@ccclass('GameController')
export class GameController extends Component {
  // untuk pinpoint button dari scene dengan mudah
  // import elemen ground supaya bisa dikontrol speednya
  @property({ type: Component })
  public ground: Ground
  @property({ type: Component })
  public Background: Background

  // u/ store kecepatan animasi background dan animasi pipa
  @property({ type: CCInteger })
  public speed: number = 200
  @property({ type: CCInteger })
  public pipeSpeed: number = 200

  // untuk select node bird(player)
  @property({ type: Node })
  public player: Node

  // untuk select node tryAgainPopUp
  @property({ type: Node })
  public restartMenu: Node

  // untuk select audio source saat skor ditambahin
  @property({ type: Node })
  public scoreboardNode: Node

  private passCoordinate: number = -86.06
  @property({ type: Label })
  public currentLabel: Label
  @property({ type: Label })
  public highScore: Label

  public topScore: number = 0
  public currentScore: number

  // constructor, inisialisasi kecepatan disini
  start() {
    this.speed = 200
    this.pipeSpeed = 200
    this.currentScore = 0;
  }

  startGame() {
    director.loadScene('Game')
  }
  restartGame() {
    // reset score label
    // this.resetScore();
    director.loadScene('Game')
    director.resume()
  }

  addScore() {
    this.updateScore(this.currentScore + 1)
  }
  updateScore(num: number) {
    this.currentScore = num
    this.currentLabel.string = this.currentScore.toString();
  }
  resetScore() {
    this.updateScore(0)
  }

  showEndGameScreen() {
    // this.currentLabel.string = '';
    // pause game, display node restartmenu
    director.pause()
    // this.node.active = false // hide burungnya
    this.restartMenu.active = true
    this.player.active = false;
    // display nilai highest score, ambil dari Scoreboard
    this.displayHighScore()
  }

  displayHighScore() {
    if (this.currentScore >= this.topScore) {
      this.topScore = this.currentScore
    }
    this.highScore.string = this.topScore.toString();
  }
  checkContactNode(selfCollider: Collider2D, otherCollider: Collider2D) {
    let otherNode = otherCollider.node;
    // cek collidernya, karena dipakai untuk bird dan collider maka harus
    //  dicek dulu nama node selfCollidernya
    if (selfCollider.node.name === 'Scoreboard' &&
      (otherNode.name === 'BottomPipe' || otherNode.name === 'TopPipe')) {
      // checking tambahan untuk menghindari duplicate scoring
      if (!otherNode.parent['hasPassed']) { // jika belum dilewati maka bisa add score
        this.addScore();
        otherNode.parent['hasPassed'] = true; // tandain jadi true
        // penambahan sfx tiap kali collider skor selesai kontak dengan pipa
        this.scoreboardNode.getComponent(AudioSource).playOneShot(this.scoreboardNode.getComponent(AudioSource).clip);
      }
    }
    if (selfCollider.node.name === 'Bird' &&
      (otherNode.name === 'BottomPipe' || otherNode.name === 'TopPipe')) {
      this.showEndGameScreen();
    }
  }

  update(deltaTime: number) {
    let playerCollider = this.player.getComponent(Collider2D)
    if (playerCollider) {
      playerCollider.on(Contact2DType.BEGIN_CONTACT, this.checkContactNode, this)
    }
    let scoreboardCollider = this.scoreboardNode.getComponent(Collider2D)
    if (scoreboardCollider) {
      scoreboardCollider.on(Contact2DType.END_CONTACT, this.checkContactNode, this)
    }
  }
}
// deprecated, cek pipa sudah dilewati atau tidak langsung saja pakai collider
// checkPlayerPassedPipe(nodePipe: Node) {
//   // karena burung selalu berada di koordinat 0, check kalo koordinat pipa sudah lebih kecil dari x-axis burung baru update scoringnya
//   // Cek apakah pipa sudah lewat burung dan belum ditambahkan skornya
//   if (nodePipe.position.x <= this.passCoordinate && !nodePipe['hasPassed']) {
//     //cek flag hasPassed supaya skor tidak ditambah terus menerus
//     this.addScore();  // Tambahkan skor
//     // buat play sound kalau skornya ditambahin
//     nodePipe['hasPassed'] = true;  // set hasPassed skor tidak nambah terus
//     this.scoreboardNode.getComponent(AudioSource).playOneShot(this.scoreboardNode.getComponent(AudioSource).clip);
//   }
// }
// deprecated :
// untuk update selector node pipa setiap detiknya,
    // karena koordinat selalu berubah sesuai kecepatan game
    // pass ke checkPlayerPassedPipe untuk update scoring
    // let scene = director.getScene()
    // scene.children.forEach(child => {
    //   if (child.name === 'Canvas') {
    //     let canvas = child
    //     canvas.children.forEach(canvasChild => {
    //       if (canvasChild.name === 'Obstacle') {
    //         // check position
    //         this.checkPlayerPassedPipe(canvasChild)
    //         // console.log('Obstacle1 x pos : ', canvasChild.position.x)
    //       }
    //       if (canvasChild.name === 'Obstacle2') {
    //         this.checkPlayerPassedPipe(canvasChild)
    //         // console.log('Obstacle2 x pos : ', canvasChild.position.x)
    //       }
    //     })
    //   }
    // })