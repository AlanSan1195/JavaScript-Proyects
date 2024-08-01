const ANIMACIONES = {}

export const animations = (game) => {
  game.anims.create({
    key: "mario-walk",
    frames: game.anims.generateFrameNumbers("mario-small",  { start: 1, end: 3 }),
    frameRate: 12,
    repeat: -1,
  });
  game.anims.create({
    key: "mario-stop",
    frames: [{ key: "mario-small", frame: 0 }],
  });

  game.anims.create({
    key: "mario-jump",
    frames: [{ key: "mario-small", frame: 5 }],
 

  });
  game.anims.create({
    key: "mario-dead",
    frames: [{ key: "mario-small", frame: 4 }],
  });
 
  game.anims.create({
    key: "block-shine",
    frames: game.anims.generateFrameNumbers("mistery-Blocks", {
      start: 0,
      end: 2,
    }),
    frameRate: 4,
    repeat: -1,
  });
  game.anims.create({
    key: "block-hit",
    frames: [{ key: "empty-block" }],
  });

  game.anims.create({
    key: "hongo-item",
    frames: [{ key: "hongo-xl" }],
  });
  game.anims.create({
    key: "coin-shine",
    frames: game.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
    frameRate: 11,
    repeat: -1,
  });

  game.anims.create({
    key: "mario-xl-walk",
    frames: game.anims.generateFrameNumbers('mario-xl', { start: 1, end: 3 }),
    frameRate: 12,
    repeat: -1
  })
  game.anims.create({
    key: "mario-xl-stop",
    frames: [{ key: "mario-xl", frame: 0 }],
    frameRate: 20,
  })
  game.anims.create({
    key: "mario-xl-jump",
    frames: [{ key: "mario-xl", frame: 5 }],
    
  
  });
  
  game.anims.create({
    key: "mario-xl-down",
    frames: [{ key: "mario-xl", frame: 4}],
  });



  //animaciones enemigos 
  game.anims.create({
    key: "goomba-hit",
    frames: [{ key: "goomba", frame: 2 }],
    frameRate: 2,
    repeat: -1,
  });

  game.anims.create({
    key: "goomba-walk",
    frames: game.anims.generateFrameNumbers("goomba", { start: 0, end: 1 }),
    frameRate: 3,
    repeat: -1,
  })

};
