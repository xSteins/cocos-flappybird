import { __private, _decorator, Button, CCInteger, Component, director, EventHandler, EventKeyboard, input, Input, KeyCode, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from "./Ground";
import { Background } from './Background';
import { Scoreboard } from './Scoreboard';
import { Player } from './Player';

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

    // untuk select node tryAgainPopUp
    @property({type:Player})
    public tryAgainPopUp: Node | null = null;
        
    triggerGameOver() {
        if (this.tryAgainPopUp){ // cek nodenya
            this.tryAgainPopUp.active = true;
        }
        // stop animasinya
        this.speed = 0;
        this.pipeSpeed = 0;
    }
    
    start() {
        this.speed = 200;
        this.pipeSpeed = 200;
    }

    update(deltaTime: number) {
        
    }
}


