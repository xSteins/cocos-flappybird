import {
  __private,
  _decorator,
  AudioSource,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  director,
  easing,
  instantiate,
  Label,
  Node,
  Prefab,
  tween,
  UIOpacity,
  Vec3
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

  @property({ type: Label })
  public currentLabel: Label

  public topScore: number = 0
  public currentScore: number

  // constructor, inisialisasi kecepatan disini
  start() {
    this.speed = 200
    this.pipeSpeed = 200
    this.currentScore = 0;
  }

  startGame(event, customEventData) {
    director.loadScene('Game')
  }

  restartGame() {
    // reset score label
    // this.resetScore();
    director.loadScene('Game')
    director.resume()
  }

  @property({ type: Node })
  public incrementScoreAnim: Node

  showScoreAnimation(points: number) {
    const incrementScoreAnim = this.incrementScoreAnim;

    // ini buat label, tergantung parameter inputnya 1 atau 2
    const label = incrementScoreAnim.getComponent(Label);
    label.string = `+${points}`;

    // buat atur opacity, component UIOpacity didalam nodenya    
    const scoreUI = incrementScoreAnim.getComponent(UIOpacity) || incrementScoreAnim.addComponent(UIOpacity);
    scoreUI.opacity = 0;  // awalnya transparan 
    // tween untuk gerakan ke atas dan efek fade in/out
    tween(incrementScoreAnim)
      .to(1, { position: new Vec3(0, 171.721, 0) }, { easing: 'sineOut' })  // ini buat animasi naik keatas
      .call(() => {
        incrementScoreAnim.setPosition(0, -95.273, 0);  // reset posisi ke titik awal setelah naik
      })
      .start();
    // animasiin UIOpacitynya
    tween(scoreUI)
      .to(0.2, { opacity: 255 })  // fade in 0.2 detik
      .delay(0.5)                 // delay sebelum hilang
      .to(0.2, { opacity: 0 })    // fade out 0.2 detik
      .start();
  }

  // number ini harus assignable, karena kalo parent obstacle = SpecialObstacle dia harus +2 langsung
  addScore(num: number) {
    // animasi
    this.showScoreAnimation(num);
    // add scorenya
    this.updateScore(this.currentScore + num)
    // penambahan sfx ada di checkContactNode karena selectornya hanya bisa diakses disana, supaya tidak ribet call 2x disini
  }
  updateScore(num: number) {
    this.currentScore = num
    this.currentLabel.string = this.currentScore.toString();
  }
  resetScore() {
    this.updateScore(0)
  }

  showEndGameScreen() {
    // pause game, display node restartmenu
    director.pause()
    this.restartMenu.active = true
    this.player.active = false;
    this.playSound(this.restartMenu);
  }

  checkContactNode(selfCollider: Collider2D, otherCollider: Collider2D) {
    let otherNode = otherCollider.node;
    // cek collidernya, karena dipakai untuk bird dan collider maka harus
    //  dicek dulu nama node selfCollidernya
    if (selfCollider.node.name === 'Scoreboard' &&
      (otherNode.name === 'BottomPipe' || otherNode.name === 'TopPipe')) {
      // checking tambahan untuk menghindari duplicate scoring
      if (!otherNode.parent['hasPassed'] || !otherNode.parent.parent['hasPassed']) { // edge cases untuk special obstacle
        // jika belum dilewati maka bisa add score
        // checking untuk nama parent node, kalo special langsung increment 2
        const points = (otherNode.parent.name === 'SpecialObstacle') ? 2 : 1;
        this.addScore(points);
        this.playSound(this.scoreboardNode);
        otherNode.parent['hasPassed'] = true; // tandain jadi true
        otherNode.parent.parent['hasPassed'] = true; // ini edge cases kalo special obstacle itu isinya 2 dalam 1 parent yg sama
      }
      // TODO FIX : untuk if ini masih ada error saat pertama kali ketemu yg edge case, setelah 1st passing sudah normal
    }
    if (selfCollider.node.name === 'Bird' &&
      (otherNode.name === 'BottomPipe' || otherNode.name === 'TopPipe')) {
      this.showEndGameScreen();
      // play hit sound dari obstacle (hit.ogg)
      this.playSound(otherNode.parent)
    }
  }

  public isMuted = false;

  muteGame(event, customEventData) {
    let btn = event.target.getComponent(Label);
    // mute secara global, fungsi ini dipanggil pakai tombol di UI
    if (this.isMuted) {
      this.isMuted = false;
      btn.string = 'MUTE GAME';
    }
    else {
      this.isMuted = true;
      btn.string = 'UNMUTE GAME';
    }
  }

  // karena state audio itu global, maka play soundnya pakai method independent dengan select nodenya dulu
  playSound(component: Node) {
    if (!this.isMuted) { // jika tidak muted, maka play lagunya
      component.getComponent(AudioSource).playOneShot(component.getComponent(AudioSource).clip);
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