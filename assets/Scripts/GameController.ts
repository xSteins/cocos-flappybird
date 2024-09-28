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
  @property({ type: Player })
  public player: Player

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
  start () {
    this.speed = 200
    this.pipeSpeed = 200
  }

  startGame () {
    director.loadScene('Game')
  }
  restartGame () {
    director.loadScene('Game')
    director.resume()
  }

  checkPlayerPassedPipe (nodePipe: Node) {
    // karena burung selalu berada di koordinat 0, check kalo koordinat pipa sudah lebih kecil dari x-axis burung baru update scoringnya
    if (nodePipe.position.x <= this.passCoordinate) {
    }
  }

  addScore () {
    this.updateScore(this.currentScore + 1)
  }
  updateScore (num: number) {
    this.currentScore = num
    this.currentLabel.string = '' + this.currentScore
  }
  resetScore () {
    this.updateScore(0)
    this.node.active = true
  }

  showEndGameScreen () {
    // pause game, display node restartmenu
    director.pause()
    // this.node.active = false // hide burungnya
    this.restartMenu.active = true
    // display nilai highest score, ambil dari Scoreboard
    // this.restartGame();
    this.displayHighScore()
  }

  displayHighScore () {
    if (this.currentScore >= this.topScore) {
      this.topScore = this.currentScore
    }
    this.highScore.string = '' + this.topScore
  }

  protected onLoad (): void {
    let scene = director.getScene()

    scene.children.forEach(child => {
      if (child.name === 'Canvas') {
        let canvas = child

        // Cari node Player di bawah Canvas
        let player = canvas.getChildByName('Player')
        if (player) {
          let collider = player.getComponent(Collider2D)
          if (collider) {
            collider.on(
              Contact2DType.BEGIN_CONTACT,
              () => {
                console.log('Contact!')
              },
              this
            )
          }
        }
      }
    })
  }

  update (deltaTime: number) {
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
          if (canvasChild.name === 'Player') {
          }
        })
        // console.log(child.name)
      }
    })
  }
}
