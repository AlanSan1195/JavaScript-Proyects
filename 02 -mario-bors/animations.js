export const animations = (game)=>{
    game.anims.create({
        key: "mario-walk",
        frames: game.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
        frameRate: 12,
        repeat: -1,
    
      });
      game.anims.create({
        key: "mario-stop",
        frames: [{key: "mario", frame: 0}],
      });
    
      game.anims.create({
        key: "mario-jump",
        frames: [{key: "mario", frame: 5}],
        frameRate: 10,
        repeat: 1,
      });
      game.anims.create({
        key:"mario-dead",
        frames: [{key: "mario", frame: 4}],
      });
      game.anims.create({
        key: "block-shine",
        frames: game.anims.generateFrameNumbers("mistery-Blocks", { start: 0, end: 2 }),
        frameRate: 4,
        repeat: -1,
      })
      game.anims.create({
        key:"block-hit",
        frames:[{key: "empty-block"}],
      })

      game.anims.create({
        key: "hongo-item",
        frames:[{key: "hongo-xl"}], 
      })
      game.anims.create({
        key: "coin-shine",
        frames: game.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
        frameRate: 11,
        repeat: -1,
      })
}