import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Scoreboard')
export class Scoreboard extends Component {
    @property({type:Label})
    public currentLabel: Label;
    @property({type:Label})
    public highScore: Label;
    @property({type:Label})
    public tryLabel: Label;

    public topScore:number = 0;
    public currentScore:number;
    start() {

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
    }
    hideResults() {
        this.highScore.node.active = false;
        this.tryLabel.node.active = false;
    }

    

    update(deltaTime: number) {
        
    }
}


