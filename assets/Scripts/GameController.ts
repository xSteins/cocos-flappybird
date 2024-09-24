import { _decorator, Button, CCInteger, Component, director, EventHandler, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from "./Ground";
import { Background } from './Background';

// state untuk reset scoreboard, ganti scene dll
enum GameState{
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

@ccclass('GameController')
export class GameController extends Component {
    // untuk pinpoint button dari scene dengan mudah
    @property({type:Button})
    startGame: Button = null;
    @property({type:Button})
    restartGame: Button = null;
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

    
    protected onLoad(): void {
        // untuk start game
        this.startGame.node.on(Button.EventType.CLICK,()=>{
            this.startGameScene();
        });
    }
    
    gameInputListener(){
        
    }
    
    startGameScene(){
        director.loadScene('Game');
    }
    start() {
        // buat listener untuk tombol
        const clickEventHandler = new EventHandler();

        // clickEventHandler.target = this.scene
    }

    update(deltaTime: number) {
        
    }
}


