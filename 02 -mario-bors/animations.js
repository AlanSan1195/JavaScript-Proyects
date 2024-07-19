export const animations = (game)=>{
    game.anims.create({
        key: "mario-walk",
        frames: game.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
        frameRate: 12,
        repeat: -1,
      });
      //sprite cuando el mario no se mueva "dibujo"
      game.anims.create({
        key: "mario-stop",
        frames: [{ key: "mario", frame: 0 }],
      });
      //1.4
      //  ponemos nuestras flechas del teclado
   
      //CREAMOS UNA NUEVA ANIMACION DE BRINCO
      game.anims.create({
        key: "mario-jump",
        frames: [{ key: "mario", frame: 5 }],
      });
      game.anims.create({
        key: "mario-dead",
        frames: [{ key: "mario", frame: 4}],
      });   
}