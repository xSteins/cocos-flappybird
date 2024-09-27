import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Scoreboard')
export class Scoreboard extends Component {
    @property({type:Label})
    public currentLabel: Label;
    @property({type:Label})
    public highScore: Label;
    @property({type:Label})
    public tryLabel: Label;
    // @property({type:Node})
    // public gameOverNode: Node = null;
    // private gameOverIcon: Sprite = null;
    
    public topScore:number = 0;
    public currentScore:number;
    start() {

    }

    addScore() {
        this.updateScore(this.currentScore + 1);
    }
    updateScore(num:number){
        this.currentScore = num;
        this.currentLabel.string = (''+this.currentScore);
    }
    resetScore(num:number){
        this.updateScore(0);
        this.hideResults();
    }
    showResults(){
        this.highScore.string = 'High Score is: ' + this.topScore;
        this.highScore.node.active = true;
        this.tryLabel.node.active = true;
        // this.gameOverIcon.node.active = true;
    }
    hideResults() {
        this.highScore.node.active = false;
        this.tryLabel.node.active = false;
        // this.gameOverIcon.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


