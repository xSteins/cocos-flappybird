import { _decorator, Component, director, Label, Node, Sprite } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Scoreboard')
export class Scoreboard extends Component {
  @property({ type: Label })
  public currentLabel: Label
  @property({ type: Label })
  public highScore: Label
  @property({ type: Node })
  public restartMenu: Node

  public topScore: number = 0
  public currentScore: number
  start () {}

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
    this.restartMenu.active = true
    // display nilai highest score, ambil dari Scoreboard
    this.displayHighScore()
  }

  displayHighScore () {
    if (this.currentScore >= this.topScore) {
      this.topScore = this.currentScore
    }
    this.highScore.string = '' + this.topScore
  }

  update (deltaTime: number) {}
}
