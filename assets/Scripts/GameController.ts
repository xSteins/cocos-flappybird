import { _decorator, Component, EventHandler, Node } from 'cc';
const { ccclass, property } = _decorator;

// state untuk reset scoreboard, ganti scene dll
enum GameState{
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

@ccclass('GameController')
export class GameController extends Component {
    
    start() {
        // buat listener untuk tombol
        const clickEventHandler = new EventHandler();

        // clickEventHandler.target = this.scene
    }

    setGameState (value: GameState) {
    switch(value) {
        case GameState.GS_INIT:            
            this.init();
            break;
        case GameState.GS_PLAYING:           
            // load main
            break;
        case GameState.GS_END:
            // setelah logic colision detected, load scene restartMenu dengan freeze frame
            break;
    }
}

    init() {
        // load start scene
    }

    restartMenu(){
        // load endsene
    }

    update(deltaTime: number) {
        
    }
}


