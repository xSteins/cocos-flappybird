import {
  __private,
  _decorator,
  AudioSource,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  director,
  instantiate,
  Label,
  Node,
  Prefab,
  randomRange,
  RigidBody,
  tween,
  UIOpacity,
  Vec3
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('GameController')
export class GameController extends Component {
  public topScore: number = 0
  public currentScore: number
  public isPaused: boolean = false;
  public isMuted = false;
  public easyGame: boolean;
  public isDaylight: boolean;
  // untuk fine-tuning spawn pipanya
  private timer: number = 0;
  private targetWaktu: number = 0;
  private batasBawah: number = 5;
  private batasAtas: number = 10;
  private minimumBatasBawah: number = 1.8;
  private minimumBatasAtas: number = 2.3;
  // ini buat set 5 detik awal invicible
  private currInvicibleTime: number = 5;

  // ini properties untuk game
  @property({ type: Node })
  public ground: Node
  @property({ type: Node })
  public background: Node
  @property({ type: Node })
  public backgroundNight: Node
  @property({ type: Node })
  public canvasNode: Node
  // untuk select node bird(player)
  @property({ type: Node })
  public player: Node
  // untuk select node tryAgainPopUp
  @property({ type: Node })
  public restartMenu: Node
  // untuk select audio source saat skor ditambahin
  @property({ type: Node })
  public scoreboardNode: Node
  // buat animasi +1 
  @property({ type: Node })
  public incrementScoreAnim: Node
  // u/ store kecepatan animasi background dan animasi pipa
  public speed: number = 200
  public pipeSpeed: number = 200
  // label untuk skornya
  @property({ type: Label })
  public liveScore: Label
  @property({ type: Label })
  public endgameTopScore: Label
  @property({ type: Label })
  public endgameScore: Label
  @property({ type: Label })
  public alertLabel: Label = null;

  // prefab untuk spawn obstacle
  @property({ type: Prefab })
  public obstaclePrefab: Prefab = null;
  @property({ type: Prefab })
  public specialObsPrefab: Prefab = null;
  @property({ type: Prefab })
  public doublePrefab: Prefab = null;
  @property({ type: Prefab })
  public slowmoPrefab: Prefab = null;

  // ini buat toggle variable saja, nanti di start() variable ini yg dicek u/ set background
  toggleBackgroundTheme(event, customEventData) {
    let toggleButtonState = event.target.getComponent(Label).string
    // untuk rename backgroundnya
    if (toggleButtonState === "DAYLIGHT") {
      event.target.getComponent(Label).string = "NIGHT";
      this.isDaylight = false;
      this.activateBackground(this.isDaylight);
      localStorage.removeItem('isDaylight');
      localStorage.setItem('isDaylight', JSON.stringify(this.isDaylight));
      // console.log("night mode")
      // console.log(localStorage.getItem('isDaylight').toString())
    }
    else {
      event.target.getComponent(Label).string = "DAYLIGHT";
      this.isDaylight = true;
      this.activateBackground(this.isDaylight);
      localStorage.removeItem('isDaylight');
      localStorage.setItem('isDaylight', JSON.stringify(this.isDaylight));
      // console.log("day mode")
      // console.log(localStorage.getItem('isDaylight').toString())
    }
  }

  activateBackground(isDaylight: boolean) {
    if (isDaylight) {
      this.backgroundNight.active = false;
      this.background.active = true;
    }
    else {
      this.backgroundNight.active = true;
      this.background.active = false;
    }
  }

  // todo : fix state day & night mode masih ngebug kadang tidak tersimpan 
  startGame(event, customEventData) {
    // gunakan customEventData untuk set difficulty
    if (customEventData === 'easy') {
      this.easyGame = true;
    }
    else {
      this.easyGame = false;
    }
    // simpan nilai ke localStorage
    localStorage.removeItem('easyGame');
    localStorage.setItem('easyGame', JSON.stringify(this.easyGame));

    director.loadScene('Game')
    this.isPaused = false;
  }

  restartGame() {
    // reset score label
    this.resetScore();
    localStorage.removeItem('easyGame');
    localStorage.removeItem('isDaylight');
    director.resume();
    director.loadScene('Game')
    this.isPaused = false;
  }

  resetGame() {
    // reset state yang dipilih
    localStorage.removeItem('easyGame');
    localStorage.removeItem('isDaylight');
    director.loadScene('Startmenu')
    this.isPaused = false;
  }

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
    // animasi, cek dulu kalo paused jangan generate animasinya
    if (!this.isPaused) {
      this.showScoreAnimation(num);
    }
    // add scorenya
    this.updateScore(this.currentScore + num)
    // penambahan sfx ada di checkContactNode karena selectornya hanya bisa diakses disana, supaya tidak ribet call 2x disini
  }
  updateScore(num: number) {
    this.currentScore = num
    this.liveScore.string = this.currentScore.toString();
  }
  resetScore() {
    this.updateScore(0);
  }

  saveTopScore() {
    // pakai localStorage di web browser
    const currentTopScore = localStorage.getItem('topScore');
    if (!currentTopScore || this.currentScore > parseInt(currentTopScore)) {
      localStorage.setItem('topScore', this.currentScore.toString());
      this.topScore = this.currentScore; // update nilai di memori
    } else {
      this.topScore = parseInt(currentTopScore); // ambil dari localStorage
    }
  }

  getTopScore() {
    return localStorage.getItem('topScore').toString();
  }


  displayEndingScore() {
    // save topScorenya, display ke dua label endgame
    this.saveTopScore();
    this.endgameScore.string = this.currentScore.toString();
    this.endgameTopScore.string = this.getTopScore();
  }

  showEndGameScreen() {
    director.pause();
    this.playSound(this.restartMenu);
    this.displayEndingScore();
    // ini currentscore harus di-hide supaya gk overlap dgn tulisan game over
    this.scoreboardNode.getChildByName('CurrentScore').active = false;
    // pause game, display node restartmenu
    try {
      this.restartMenu.active = true;
      this.player.active = false;
      this.isPaused = true;
    } catch (error) {
      console.log("ERROR GAK JELAS DARI COCOS, PLAYER REFERENCE SUDAH ADA TAPI MASIH SUKA KEDETEKSI NULL")
    }
    // override manual bgm
    const bgmSource = this.canvasNode.getComponent(AudioSource);
    if (bgmSource) bgmSource.stop(); // Hentikan background music
    // reset datanya ketika restart
    localStorage.removeItem('easyGame');
    localStorage.removeItem('isDaylight');
  }

  checkContactNode(selfCollider: Collider2D, otherCollider: Collider2D) {
    if (this.isPaused === false) {
      let otherNode = otherCollider.node;
      // cek collidernya, karena dipakai untuk bird dan collider maka harus
      //  dicek dulu nama node selfCollidernya
      // ambil koordinat bird dan obstaclenya
      const birdX = selfCollider.node.position.x;
      const obstacleX = otherNode.parent.position.x;

      if (selfCollider.node.name === 'Scoreboard' &&
        (otherNode.parent.name === 'EasyObstacle' || otherNode.parent.name === 'HardObstacle')) {
        // checking tambahan untuk menghindari duplicate scoring
        if (!otherNode.parent['hasPassed'] || !otherNode.parent.parent['hasPassed']) { // edge cases untuk special obstacle
          // jika belum dilewati maka bisa add score
          // checking untuk nama parent node, kalo special langsung increment 2
          const points = (otherNode.parent.name === 'HardObstacle') ? 2 : 1;

          // cek apakah ada multiplier (contoh: double bonus)
          if (otherNode.parent.getChildByName('double')) {
            // jika double bonus aktif, kalikan skor dengan 2
            this.addScore(points * 2);
            console.log("Double Points")
            // this.setAlert("Double points")
          } else {
            this.addScore(points);
          }

          this.playSound(this.scoreboardNode);
          otherNode.parent['hasPassed'] = true; // tandain jadi true
          otherNode.parent.parent['hasPassed'] = true; // ini edge cases kalo special obstacle itu isinya 2 dalam 1 parent yg sama
        }
        // TODO FIX : untuk if ini masih ada error saat pertama kali ketemu yg edge case, setelah 1st passing sudah normal
      }
      // ini memastikan edge case saat colider seharusnya sudah lewat dia tidak akan mengakibatkan endgamescreen
      if (obstacleX < birdX) {
        if (selfCollider.node.name === 'Bird' &&
          (otherNode.parent.name === 'EasyObstacle' || otherNode.parent.name === 'HardObstacle')) {
          this.showEndGameScreen();
          // play hit sound dari obstacle (hit.ogg)
          this.playSound(otherNode.parent)
        }
      }
      // Cek apakah terkena bonus slowmo
      if (selfCollider.node.name === 'Bird' && otherNode.parent.name === 'slowmo') {
        // aktifkan slowmo effect
        this.activateSlowmo();
        console.log("SLOWMO")
        // this.setAlert("SLOWMO AKTIF");
        // otherNode.parent.destroy(); 
      }
    }
    else {
      console.log("game berhenti")
    }
  }
  activateSlowmo() {
    // simpan kecepatan asli sebelum diubah
    let originalSpeed = this.speed;
    let originalPipeSpeed = this.pipeSpeed;

    // atur kecepatan jadi /100 dari kecepatan normal
    this.speed /= 500;
    this.pipeSpeed /= 500;

    // kembali ke kecepatan semula setelah 3 detik
    setTimeout(() => {
      this.speed = originalSpeed;
      this.pipeSpeed = originalPipeSpeed;
    }, 3000);  // 3 detik slowmo
  }

  setAlert(params: string) {
    this.alertLabel.string = params;
    // reset state setelah 2 detik supaya gak ganggu tampilan
    setTimeout(() => {
      this.alertLabel.string = "";
    }, 2000);
  }


  muteGame(event, customEventData) {
    let btn = event.target.getComponent(Label);
    // tambah logic terpisah u/ set mute/unmute bgm
    const bgmSource = this.canvasNode.getComponent(AudioSource);
    // mute secara global, fungsi ini dipanggil pakai tombol di UI
    if (this.isMuted) {
      this.isMuted = false;
      btn.string = 'MUTE GAME';
      if (bgmSource) bgmSource.play();
    }
    else {
      this.isMuted = true;
      btn.string = 'UNMUTE GAME';
      if (bgmSource) bgmSource.pause();
    }
  }

  // karena state audio itu global, maka play soundnya pakai method independent dengan select nodenya dulu
  playSound(component: Node) {
    if (!this.isMuted) { // jika tidak muted, maka play lagunya
      component.getComponent(AudioSource).playOneShot(component.getComponent(AudioSource).clip);
    }
  }
  playBGM(component: Node) {
    if (!this.isMuted) { // jika tidak muted, maka play lagunya
      component.getComponent(AudioSource).play();
    }
  }
  // todo : fix suara di tombol gk keluar
  btnPlaySound() {
    if (!this.isMuted) { // jika tidak muted, maka play lagunya
      this.node.getComponent(AudioSource).playOneShot(this.node.getComponent(AudioSource).clip);
    }
  }

  updateScrollableElement(node: Node, deltaTime: number, maxMovePos: number, newVecPos: Vec3, parallaxFactor: number = 1) {
    // gunakan this.speed untuk konsistensi kecepatan
    const elementSpeed = this.speed * parallaxFactor;

    // geser nodenya
    node.translate(new Vec3(-elementSpeed * deltaTime, 0, 0));

    // reset posisi elemen jika melewati batas
    if (node.position.x <= maxMovePos) {
      node.setPosition(newVecPos);
    }
  }
  // constructor, untuk set difficulty dan tipe background ada fallback kalo error balik ke easy mode + daylight
  start() {
    this.currentScore = 0;
    // buat pipa awal untuk detik 0
    this.createPipe();
    // generate targetwaktu berdasarkan batas atas & bawah
    this.targetWaktu = randomRange(this.minimumBatasBawah, this.minimumBatasAtas);
    this.easyGame = JSON.parse(localStorage.getItem('easyGame'));
    // karena cocos tidak punya handling data antar scene, maka ambil saja dari localStorage, set ke variablenya masing-masing
    // console.log("easy : " + this.easyGame + " Theme : " + JSON.parse(localStorage.getItem('isDaylight')));
    // set daylight atau night berdasarkan data
    this.activateBackground(JSON.parse(localStorage.getItem('isDaylight')))
    // this.activateBackground(this.isDaylight)
    // ini call bgm music, supaya bisa override state dari GUI cocos
    const bgmSource = this.canvasNode.getComponent(AudioSource);
    if (!this.isMuted && bgmSource) {
      bgmSource.loop = true; // Set BGM untuk loop
      bgmSource.play();
    }
  }

  // atur reocurrence kemunculan pipa di fungsi update
  update(deltaTime: number) {
    // scoreboard colider tidak perlu timeout, karena asumsi permainan jalan terus
    let scoreboardCollider = this.scoreboardNode.getComponent(Collider2D)
    if (scoreboardCollider) {
      scoreboardCollider.on(Contact2DType.END_CONTACT, this.checkContactNode, this)
    }
    let playerCollider = this.player.getComponent(Collider2D)
    if (playerCollider) {
      // console.log(this.currInvicibleTime -= deltaTime);
      // ini untuk 5 detik awal set invicible , fungsinya dikosongin aja
      // kalo diisi tidak smooth nampilin currInvicibleTime-nya, ada delay
      if ((this.currInvicibleTime -= deltaTime) > 0) {
        // set contact callnya set isPaused = false, memastikan edge case ketika colider seharusnya tidak aktif malah aktif
        playerCollider.on(Contact2DType.BEGIN_CONTACT, () => { this.isPaused = false }, this)
        this.setAlert(`Invicible selama : ${this.currInvicibleTime.toFixed(2)}`);
      }
      else {
        playerCollider.on(Contact2DType.BEGIN_CONTACT, this.checkContactNode, this)
      }
    }


    // console.log("Pause status : " + this.isPaused);
    if (!this.isPaused) { // hanya update saat game berjalan / tidak paused
      // this.playSound(this.canvasNode);
      this.timer += deltaTime;
      // ini music kadang bisa kadang gak bisa
      // this.playBGM(this.canvasNode);
      // set di cocos dashboardnya aj untuk play & loop
      // console.log(this.isMuted);
      // if (this.isMuted) {
      //   this.canvasNode.getComponent(AudioSource).stop;
      // }
      // else {
      //   this.canvasNode.getComponent(AudioSource).play()
      // }
      // cek posisi burung jgn lebih / kurang dari 500px, jika lebih = endgame
      let birdPos = this.player.position.y;
      if (birdPos > 500 || birdPos < -500) {
        this.showEndGameScreen();
      }

      if (this.easyGame) {
        // easy mode: spawn pipe setiap 2.3 detik dengan kecepatan konstan
        if (this.timer >= 2.3) {
          this.createPipe();
          this.timer = 0;
        }
      } else {
        const speedIncrement = 200 / 30;
        this.speed = Math.min(500, this.speed + speedIncrement * deltaTime);
        this.pipeSpeed = Math.min(500, this.pipeSpeed + speedIncrement * deltaTime);
        // console.log(this.speed);
        // Generate pipa setiap 0.5 detik
        if (this.timer >= this.targetWaktu) {
          console.log("Spawn time : " + this.targetWaktu);
          // ini callback supaya dia generate pipanya random antara pipa biasa atau yang merah double
          const randomPipeType = Math.random() < 0.5 ? this.createPipe : this.createUniquePipe;
          randomPipeType.call(this); // Panggil fungsi createPipe atau createUniquePipe
          // Tetapkan target waktu baru untuk spawn berikutnya
          this.targetWaktu = randomRange(this.minimumBatasBawah, this.minimumBatasAtas);
          // console.log(this.timer, this.targetWaktu, randomPipeType);
          this.timer = 0;
        }
      }
      // karena kalo pake properties kadang tidak terupdate valuenya, hard code saja berdasarkan data berikut 
      // background 
      // parallaxFactor = 0.5 (lebih lambat drpd 1)
      // maxMovePos = -618.078
      // newVecPosX = -4.704
      // newVecPosY = 0
      // ground 
      // maxMovePos = -639.523
      // newVecPosX = -319.465
      // newVecPosY = -480
      this.updateScrollableElement(this.ground, deltaTime, -639.523, new Vec3(-319.465, -480, 0), 1); // Ground (normal speed)
      // cek tipe modenya apa
      if (this.isDaylight) {
        this.updateScrollableElement(this.background, deltaTime, -618.078, new Vec3(-4.704, 0, 0), 0.1); // Background (parallax)
      }
      else {
        this.updateScrollableElement(this.backgroundNight, deltaTime, -618.078, new Vec3(-4.704, 0, 0), 0.1); // Background (parallax)
      }
    }
  }

  createPipe() {
    // inisialisasi pipa
    let objectPipes = instantiate(this.obstaclePrefab);
    let randomY = randomRange(-270, 180);
    objectPipes.setPosition(new Vec3(385.05, randomY, 0));

    // tambah prefab
    objectPipes.setParent(this.node.getParent());
    // hirarki objek set dibelakang scoreboard supaya tidak menutupi elemen permainan lainnya
    objectPipes.setSiblingIndex(this.scoreboardNode.getSiblingIndex() - 1)

    // debug
    // const doubleBonus = instantiate(this.doublePrefab);
    // doubleBonus.setPosition(new Vec3(0, 82, 0));
    // doubleBonus.setParent(objectPipes);
    // generate bonus
    this.generateBonusElem(objectPipes);

    this.node['hasPassed'] = false;
  }

  createUniquePipe() {
    // inisialisasi pipa
    let objectPipes = instantiate(this.specialObsPrefab);
    let randomY = randomRange(-270, 180);
    objectPipes.setPosition(new Vec3(385.05, randomY, 0));

    // tambah prefab
    objectPipes.setParent(this.node.getParent());
    // hirarki objek set dibelakang scoreboard supaya tidak menutupi elemen permainan lainnya
    objectPipes.setSiblingIndex(this.scoreboardNode.getSiblingIndex() - 1)

    // debug
    // const slowmoBonus = instantiate(this.slowmoPrefab);
    // slowmoBonus.setPosition(new Vec3(56.615, 82, 0));
    // slowmoBonus.setParent(objectPipes);
    this.generateBonusElem(objectPipes);


    this.node['hasPassed'] = false;
  }
  generateBonusElem(objectPipes: Node) {
    // randomise antar 2 tipe bonus
    if (this.easyGame) {
      // kalo easy game kemunculannya 50:50 saja antar 2 ini
      if (Math.random() < 0.5) {
        const doubleBonus = instantiate(this.doublePrefab);
        doubleBonus.setPosition(new Vec3(0, 82, 0));
        doubleBonus.setParent(objectPipes);
      }
      else {
        const slowmoBonus = instantiate(this.slowmoPrefab);
        slowmoBonus.setPosition(new Vec3(56.615, 82, 0));
        slowmoBonus.setParent(objectPipes);
      }
    }
    else {
      // kalo hard game persentasenya jauh lebih rendah lagi
      if (Math.random() < 0.5) {
        // 10% dari 50%
        if (Math.random() < 0.1) {
          const doubleBonus = instantiate(this.doublePrefab);
          doubleBonus.setPosition(new Vec3(0, 82, 0));
          doubleBonus.setParent(objectPipes);
        }
      }
      else {
        // 40% dari 50%
        if (Math.random() < 0.4) {
          const slowmoBonus = instantiate(this.slowmoPrefab);
          slowmoBonus.setPosition(new Vec3(56.615, 82, 0));
          slowmoBonus.setParent(objectPipes);
        }
      }

    }
  }
}



// tugas prefab sebelumnya : timing
// console.log("Timer ", this.timer);
// this.timer += deltaTime;
// // supaya mudah debugging tanpa harus ke console, didisplay saja
// if (this.timerWaktu) {
//   this.timerWaktu.string = this.timer.toFixed(2);
// }
// if (this.timer >= this.targetWaktu) {
//   this.timer -= this.targetWaktu;
//   if (this.targetWaktu > this.minimumBatasBawah) {
//     // kurangi targetnya sebanyak increment 0.25 (penguranganJeda)
//     this.targetWaktu = Math.max(this.targetWaktu - this.penguranganJeda, this.minimumBatasBawah);
//   } else {
//     // kalo udah dibawahnya, random aja (1-2)
//     this.targetWaktu = randomRange(this.minimumBatasBawah, this.minimumBatasAtas);
//   }
// }