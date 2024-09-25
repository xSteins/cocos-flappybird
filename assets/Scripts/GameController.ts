import { __private, _decorator, Button, CCInteger, Component, director, EventHandler, EventKeyboard, input, Input, KeyCode, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from "./Ground";
import { Background } from './Background';
import { Scoreboard } from './Scoreboard';
import { Player } from './Player';

// state untuk reset scoreboard, ganti scene dll
enum GameState{
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

@ccclass('GameController')
export class GameController extends Component {
    // untuk pinpoint button dari scene dengan mudah
    @property({type:Node})
    restartGame: Node = null;
    // untuk import elemen ground supaya bisa dikontrol speednya
    @property({type:Component})
    public ground:Ground;
    @property({type:Component})
    public Background:Background;

    // u/ store kecepatan animasi background dan animasi pipa
    @property({type:CCInteger})
    public speed: number = 200;
    @property({type:CCInteger})
    public pipeSpeed: number = 200;

    // store score dari Score.ts
    @property({type:Scoreboard})
    public result: Scoreboard;

    // untuk select node bird(player)
    @property({type:Player})
    public player: Player;
    
    protected onLoad(): void {

        // untuk start game
        // this.startGame.node.on(Button.EventType.CLICK,()=>{
        //     this.startGameScene();
        // });
    }
    
    gameInputListener(){
        input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
    }
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.gameOver();
                break;
            case KeyCode.KEY_S:
                this.result.addScore();
                break;
            case KeyCode.KEY_A:
                this.gameOver();
                break;
            case KeyCode.KEY_D:
                this.start();
                break;
        
            default:
                break;
        }
    }
    gameOver() {
        // stop animasinya
        this.speed = 0;
        this.pipeSpeed = 0;
        this.result.showResults; // display hasil skor saat ini
    }
    
    start() {
        this.speed = 200;
        this.pipeSpeed = 200;
        // this.
    }

    update(deltaTime: number) {
        
    }
}


