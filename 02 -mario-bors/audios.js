

const audios = [
    {
        key: "game-over",
        path: "assets/sound/music/gameOver.mp3",
    },
    {
        key: "goomba-sound",
        path: "assets/sound/effects/goomba-stomp.wav"
    },
    {
        key: "mario-jumping",
        path: "assets/sound/effects/jump.mp3"
    },
    {
        key: "coin-sound",
        path: "assets/sound/effects/coin.mp3"
    },
    {
        key: "power-up",
        path: "assets/sound/effects/consume-powerup.mp3"
    },
    {
        key : "block-hit",
        path: "assets/sound/effects/block-bump.wav"
    }
 ];
export const iniciarAudios = ({load}) => {
  // cargar e itera los audios disponibles 
  audios.forEach(({key, path})=>{
    load.audio(key, path);
  })
};
