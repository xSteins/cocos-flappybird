import { __private, _decorator, CCInteger, Component, director, Node } from 'cc'
const { ccclass, property } = _decorator

import { Ground } from './Ground'
import { Background } from './Background'
import { Scoreboard } from './Scoreboard'
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

  // store score dari Score.ts
  @property({ type: Scoreboard })
  public result: Scoreboard

  // untuk select node bird(player)
  @property({ type: Player })
  public player: Player

  // untuk select node tryAgainPopUp
  @property({ type: Node })
  public restartMenu: Node

  start () {
    this.speed = 200
    this.pipeSpeed = 200
  }

  chekcPlayerPassedPipe () {
    // const playerPos = this.player.node.getPosition().x
    // this.node.children.forEach(element => {
    // });
  }

  update (deltaTime: number) {}

  restartGame () {
    director.loadScene('Game')
    director.resume()
  }
}
