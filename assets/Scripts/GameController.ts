import {
  __private,
  _decorator,
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
import { Player } from './Player'

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

  checkPlayerPassedPipe(nodePipe: Node) {
    // karena burung selalu berada di koordinat 0, check kalo koordinat pipa sudah lebih kecil dari x-axis burung baru update scoringnya
    // Cek apakah pipa sudah lewat burung dan belum ditambahkan skornya
    if (nodePipe.position.x <= this.passCoordinate && !nodePipe['hasPassed']) {
      //cek flag hasPassed supaya skor tidak ditambah terus menerus
      this.addScore();  // Tambahkan skor
      nodePipe['hasPassed'] = true;  // set hasPassed skor tidak nambah terus
    }
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

  showEndGameScreen(player: Node) {
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

  protected onLoad(): void { }

  update(deltaTime: number) {
    // untuk update selector node pipa setiap detiknya,
    // karena koordinat selalu berubah sesuai kecepatan game
    // pass ke checkPlayerPassedPipe untuk update scoring
    let scene = director.getScene()
    scene.children.forEach(child => {
      if (child.name === 'Canvas') {
        let canvas = child
        canvas.children.forEach(canvasChild => {
          if (canvasChild.name === 'Obstacle') {
            // check position
            this.checkPlayerPassedPipe(canvasChild)
            // console.log('Obstacle1 x pos : ', canvasChild.position.x)
          }
          if (canvasChild.name === 'Obstacle2') {
            this.checkPlayerPassedPipe(canvasChild)
            // console.log('Obstacle2 x pos : ', canvasChild.position.x)
          }
        })
      }
    })
    let collider = this.player.getComponent(Collider2D)
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.showEndGameScreen, this)
    }
  }
}
