const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 5,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    direction: 'right',
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
            right: {
                imageSrc: './img/samuraiMack/right/Idle.png',
                framesMax: 8
            }
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
            right: {
                imageSrc: './img/samuraiMack/right/Run.png',
                framesMax: 8
            }
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
            right: {
                imageSrc: './img/samuraiMack/right/Jump.png',
                framesMax: 2
            }
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
            right: {
                imageSrc: './img/samuraiMack/right/Fall.png',
                framesMax: 2
            }
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
            right: {
                imageSrc: './img/samuraiMack/right/Attack1.png',
                framesMax: 6,
            }
        },
        takeHit: {
            imageSrc: './img/samuraiMack/right/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/right/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 35,
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 750,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    direction: 'left',
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
            right: {
                imageSrc: './img/kenji/right/Idle.png',
                framesMax: 4,
            }
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
            right: {
                imageSrc: './img/kenji/right/Run.png',
                framesMax: 8
            }
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
            right: {
                imageSrc: './img/kenji/right/Jump.png',
                framesMax: 2
            }
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
            right: {
                imageSrc: './img/kenji/right/Fall.png',
                framesMax: 2
            }
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
            right: {
                imageSrc: './img/kenji/right/Attack1.png',
                framesMax: 4
            }
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    // Player movement
    player.velocity.x = 0;

    if (!player.isDefending) {
        if (keys.a.pressed && player.lastKey === 'a') {
            player.velocity.x = -5;
            player.switchSprite('run');
        } else if (keys.d.pressed && player.lastKey === 'd') {
            player.velocity.x = 5;
            player.switchSprite('run');
        } else {
            player.switchSprite('idle');
        }
    
        // jumping
        if (player.velocity.y < 0) {
            player.switchSprite('jump')
        } else if (player.velocity.y > 0) {
            player.switchSprite('fall')
        }
    }

    // Enemy movement
    enemy.velocity.x = 0;

    if (!enemy.isDefending) {
        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.velocity.x = -5;
            enemy.switchSprite('run');
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 5;
            enemy.switchSprite('run');
        } else {
            enemy.switchSprite('idle');
        }
    
        // enemy jumping
        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump')
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall')
        }
    }

    // Detect for collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) 
        && player.isAttacking 
        && player.frameCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // If player MISS
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    // Player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) 
        && enemy.isAttacking
        && enemy.frameCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // If enemy MISS
    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                player.direction = "right";
                player.attackBox.offset.x = 100;
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                player.direction = "left";
                player.attackBox.offset.x = -190;
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                if (!player.isDefending) {
                    player.velocity.y = -20;
                }
                break;
            case ' ':
                if (!player.isDefending) {
                    player.attack();
                }
                break;
            case 's':
                if (player.direction === "right") {
                    player.defend('attack1', 3);
                } else {
                    player.defend('attack1', 2);
                }
                break;
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                enemy.direction = "right";
                enemy.attackBox.offset.x = 70;
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                enemy.direction = "left";
                enemy.attackBox.offset.x = -170;
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowUp':
                if (!enemy.isDefending) {
                    enemy.velocity.y = -20;
                }
                break;
            case 'ArrowDown':
                if (enemy.direction === "left") {
                    enemy.defend('attack1', 0);
                } else {
                    enemy.defend('attack1', 3);
                }
                break;
            case 'Enter':
                if (!enemy.isDefending) {
                    enemy.attack();
                }
                break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            player.outDefense();
            break;
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowDown':
            enemy.outDefense();
            break;
    }
})
