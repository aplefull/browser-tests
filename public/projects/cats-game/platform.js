function platform() {
    var config = {
        width: 1600,
        height: 900,
        scale: {
            mode: Phaser.Scale.FIT,
        },
        backgroundColor: 0xc4a484,
        scene: { preload: preload, create: create, update: update },
    };

    var game = new Phaser.Game(config);

    //----- keep the tag below; it is replaced with code from the deploy script
    document.querySelectorAll("canvas").forEach((el) => el.classList.add("transition"));
    //-----

    var xOffset = 455;
    var yOffset = 130;

    platformWidth = 115;
    playerOffset = 50;

    var currentPlatform;

    var _turnNumber = 0;

    var _platformSpots = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ];

    var adjacentPlatforms = [];

    function preload() {
        this.gameWidth = this.sys.game.canvas.width;
        this.gameHeight = this.sys.game.canvas.height;

        this.load.image("background", "ui/platform_bg.png");
        this.load.image("player", "assets2/cat-main.png");
        for (let index = 0; index < 12; index++) {
            this.load.image("platform" + index, "assets2/platform3.svg");
        }
        this.load.image("goal", "assets2/GOAL.png");
        this.load.image("up", "assets2/ARROW_UP.png");
        this.load.image("left", "assets2/ARROW_LEFT.png");
        this.load.image("down", "assets2/ARROW_DOWN.png");
        this.load.image("right", "assets2/ARROW_RIGHT.png");

        this.load.audio("grinding", "assets2/sfx/grinding.mp3");
        this.load.audio("collide", "assets2/sfx/collide.mp3");
        this.load.audio("goal_Reached", "assets2/sfx/goal_Reached.mp3");
        this.load.audio("meow1", "assets2/sfx/meow1.mp3");
        this.load.audio("meow2", "assets2/sfx/meow2.mp3");
        this.load.audio("meow3", "assets2/sfx/meow3.mp3");
        this.load.audio("meow4", "assets2/sfx/meow4.mp3");
        this.load.audio("meow5", "assets2/sfx/meow5.mp3");
        this.load.audio("meow6", "assets2/sfx/meow6.mp3");
        this.load.audio("step", "assets2/sfx/step.mp3");

        var grindingSfx;
        var collideSfx;
        var goal_ReachedSfx;
        var meow1Sfx;
        var meow2Sfx;
        var meow3Sfx;
        var meow4Sfx;
        var meow5Sfx;
        var meow6Sfx;
        var stepSfx;
    }

    function create() {
        scene = this;
        this.add.image(game.canvas.width / 2, game.canvas.height / 2, "background").setScale(0.32);

        var border = this.add.rectangle(game.canvas.width / 2, game.canvas.height * 0.5, 840, 840);
        border.setStrokeStyle(2, 0x1ecfff);

        this.finishText = this.add
            .text(game.canvas.width / 2, game.canvas.height * 0.9, " ")
            .setFontSize(80)
            .setOrigin(0.5)
            .setAlpha(0);

        this.platforms = [];
        this._platformSpots = _platformSpots;

        for (let index = 0; index < 12; index++) {
            this["platform" + index] = this.add
                .image(platformWidth * 3 + xOffset, platformWidth * 3 + yOffset, "platform" + index)
                .setScale(0.5)
                .setAlpha(0.5);
            this["platform" + index].setInteractive();
            this.platforms.push(this["platform" + index]);

            this["platform" + index].on("pointerdown", function () {
                this.setTint(0xff0000);
                MovePlayerToPlatform(scene.player, scene["platform" + index]);
            });

            this["platform" + index].on("pointerup", function () {
                this.clearTint();
            });
        }

        // Move Platforms to random set up
        RandomizeStartingPlatforms();

        this.player = this.add.sprite(60, 60, "player").setScale(0.04);

        this.upArrow = this.add.image(0, 0, "up").setScale(0.3).setAlpha(0);
        this.downArrow = this.add.image(0, 0, "down").setScale(0.3).setAlpha(0);
        this.leftArrow = this.add.image(0, 0, "left").setScale(0.3).setAlpha(0);
        this.rightArrow = this.add.image(0, 0, "right").setScale(0.3).setAlpha(0);

        this.arrows = [this.upArrow, this.downArrow, this.leftArrow, this.rightArrow];

        this.upArrow.on("pointerdown", function () {
            scene.upArrow.removeInteractive();
            var xIndex = IndexFromPosition(currentPlatform.x, true);
            var yIndex = GetUp(IndexFromPosition(currentPlatform.y, false));

            MovePlayerAndPlatform(currentPlatform, scene.player, xIndex, yIndex);
        });

        this.downArrow.on("pointerdown", function () {
            scene.downArrow.removeInteractive();
            var xIndex = IndexFromPosition(currentPlatform.x, true);
            var yIndex = GetDown(IndexFromPosition(currentPlatform.y, false));

            MovePlayerAndPlatform(currentPlatform, scene.player, xIndex, yIndex);
        });

        this.leftArrow.on("pointerdown", function () {
            scene.leftArrow.removeInteractive();
            var yIndex = IndexFromPosition(currentPlatform.y, false);
            var xIndex = GetLeft(IndexFromPosition(currentPlatform.x, true));

            MovePlayerAndPlatform(currentPlatform, scene.player, xIndex, yIndex);
        });

        this.rightArrow.on("pointerdown", function () {
            scene.rightArrow.removeInteractive();
            var yIndex = IndexFromPosition(currentPlatform.y, false);
            var xIndex = GetRight(IndexFromPosition(currentPlatform.x, true));

            MovePlayerAndPlatform(currentPlatform, scene.player, xIndex, yIndex);
        });

        ///---Sound Settings
        grindingSfx = this.sound.add("grinding");
        grindingSfx.loop = true; //looping

        collideSfx = this.sound.add("collide");
        goal_ReachedSfx = this.sound.add("goal_Reached");
        meow1Sfx = this.sound.add("meow1");
        meow2Sfx = this.sound.add("meow2");
        meow3Sfx = this.sound.add("meow3");
        meow4Sfx = this.sound.add("meow4");
        meow5Sfx = this.sound.add("meow5");
        meow6Sfx = this.sound.add("meow6");
        stepSfx = this.sound.add("step");
        //--^

        MovePlayerToPlatform(this.player, this.platforms[Phaser.Math.Between(0, this.platforms.length - 1)]);
    }

    function RandomizeStartingPlatforms() {
        // Do not allow a platform to be spawned at the very center of the game or in the first ring around the center
        // [2,2],[2,3],[2,4],[3,2],[3,3],[3,4],[4,2],[4,3],[4,4]
        var lockedX = [2, 3, 4];
        var lockedY = [2, 3, 4];

        for (let index = 0; index < 12; index++) {
            // Generate random X and Y values
            var x = Phaser.Math.Between(0, 6);
            var y = Phaser.Math.Between(0, 6);

            // Check if X and Y values fall into any of the locations in the locked arrays. Decrement loop if it does
            // Check if a platform is already at the specified location. Decrement loop if it is
            if ((lockedX.includes(x) && lockedY.includes(y)) || scene._platformSpots[x][y] != null) {
                index--;
                continue;
            }
            // Place respective platform at location
            MovePlatformToSpot(scene["platform" + index], x, y);
        }
    }

    function update() {}

    function MovePlatformToSpot(platform, xCord, yCord) {
        scene._platformSpots[IndexFromPosition(platform.x, true)][IndexFromPosition(platform.y, false)] = null;
        platform.setPosition(xCord * platformWidth + xOffset, yCord * platformWidth + yOffset);
        scene._platformSpots[xCord][yCord] = platform;
    }

    function MovePlayerAndPlatform(platform, player, xCord, yCord) {
        scene.platforms.forEach((element) => {
            element.removeInteractive();
        });

        scene.arrows.forEach((element) => {
            element.setAlpha(0);
        });

        scene._platformSpots[IndexFromPosition(platform.x, true)][IndexFromPosition(platform.y, false)] = null;
        scene._platformSpots[xCord][yCord] = platform;

        tween = scene.tweens.add({
            targets: player,
            x: PositionFromIndex(xCord, true),
            y: PositionFromIndex(yCord, false) - playerOffset,
            ease: "Sine.easeIn",
            duration: 500,
        });

        tween = scene.tweens.add({
            targets: platform,
            x: PositionFromIndex(xCord, true),
            y: PositionFromIndex(yCord, false),
            ease: "Sine.easeIn",
            duration: 500,
        });

        var meowRNG = Phaser.Math.Between(1, 20); //meow chance
        var targetMeow = null;

        if (meowRNG <= 6) {
            //Can be done with arrays for cleaner look + bit faster?
            if (meowRNG == 1) {
                targetMeow = meow1Sfx;
            } else if (meowRNG == 2) {
                targetMeow = meow2Sfx;
            } else if (meowRNG == 3) {
                targetMeow = meow3Sfx;
            } else if (meowRNG == 4) {
                targetMeow = meow4Sfx;
            } else if (meowRNG == 5) {
                targetMeow = meow5Sfx;
            } else if (meowRNG == 6) {
                targetMeow = meow6Sfx;
            }
        }

        var grindingSfxrng = Phaser.Math.FloatBetween(1.1, 1.6); //randomize speed
        grindingSfx.setRate(grindingSfxrng); //set sound speed
        collideSfx.setRate(grindingSfxrng);

        grindingSfx.play();

        tween.on("complete", function () {
            grindingSfx.stop();
            collideSfx.play();
            if (targetMeow) {
                targetMeow.play();
            }

            if (currentPlatform.x == platformWidth * 3 + xOffset && currentPlatform.y == platformWidth * 3 + yOffset) {
                //scene.add.rectangle(60*3+platformEdgeOffset,60*3+platformEdgeOffset,50,50).setStrokeStyle(2,);
                goal_ReachedSfx.play();
                currentPlatform.setTintFill(0xf5c101);
                scene.finishText.setAlpha(1);
                //----- keep the below tags; they are replaced with code from the deploy script
                document.querySelectorAll("canvas").forEach((el) => el.classList.add("no-opacity"));
                changeScene();
                setTimeout(() => {
                    game.destroy(true, false);
                }, 2000);
                //-----
                return;
            }

            xIndex = IndexFromPosition(platform.x, true);
            yIndex = IndexFromPosition(platform.y, false);

            ShowLegalMoves(xIndex, yIndex);
            ShowArrowMoves(xIndex, yIndex);
        });
    }

    function MovePlayerToPlatform(player, platform) {
        currentPlatform = platform;

        scene.platforms.forEach((element) => {
            element.removeInteractive();
        });

        scene.arrows.forEach((element) => {
            element.setAlpha(0);
        });

        tween = scene.tweens.add({
            targets: player,
            x: platform.x,
            y: platform.y - playerOffset,
            ease: "Sine.easeIn",
            duration: 500,
        });

        var stepSfxRNG = Phaser.Math.FloatBetween(0.95, 1.35); //randomize speed
        stepSfx.setRate(stepSfxRNG); //set sound speed

        tween.on("complete", function () {
            scene.platforms.forEach((element) => {
                element.clearTint();
            });

            xIndex = IndexFromPosition(platform.x, true);
            yIndex = IndexFromPosition(platform.y, false);

            ShowLegalMoves(xIndex, yIndex);
            ShowArrowMoves(xIndex, yIndex);

            stepSfx.play();
        });
    }

    function ShowLegalMoves(xIndex, yIndex) {
        // scene.platforms.forEach(element => {
        //   element.removeInteractive();
        // })
        // Show up
        if (yIndex > 0 && scene._platformSpots[xIndex][yIndex - 1] != null) {
            scene._platformSpots[xIndex][yIndex - 1].setTint(0x00ff00).setInteractive();
        }
        // Show down
        if (yIndex < 6 && scene._platformSpots[xIndex][yIndex + 1] != null) {
            scene._platformSpots[xIndex][yIndex + 1].setTint(0x00ff00).setInteractive();
        }
        // Show left
        if (xIndex > 0 && scene._platformSpots[xIndex - 1][yIndex] != null) {
            scene._platformSpots[xIndex - 1][yIndex].setTint(0x00ff00).setInteractive();
        }
        // Show right
        if (xIndex < 6 && scene._platformSpots[xIndex + 1][yIndex] != null) {
            scene._platformSpots[xIndex + 1][yIndex].setTint(0x00ff00).setInteractive();
        }
    }

    function ShowArrowMoves(xIndex, yIndex) {
        var upIsNull = yIndex > 0 && scene._platformSpots[xIndex][yIndex - 1] == null;
        var downIsNull = yIndex < 6 && scene._platformSpots[xIndex][yIndex + 1] == null;
        var leftIsNull = xIndex > 0 && scene._platformSpots[xIndex - 1][yIndex] == null;
        var rightIsNull = xIndex < 6 && scene._platformSpots[xIndex + 1][yIndex] == null;

        if (upIsNull) {
            scene.upArrow.setPosition(PositionFromIndex(xIndex, true), PositionFromIndex(yIndex - 1, false));
            scene.upArrow.setAlpha(1);
            scene.upArrow.setInteractive();
        }
        if (downIsNull) {
            scene.downArrow.setPosition(PositionFromIndex(xIndex, true), PositionFromIndex(yIndex + 1, false));
            scene.downArrow.setAlpha(1);
            scene.downArrow.setInteractive();
        }
        if (leftIsNull) {
            scene.leftArrow.setPosition(PositionFromIndex(xIndex - 1, true), PositionFromIndex(yIndex, false));
            scene.leftArrow.setAlpha(1);
            scene.leftArrow.setInteractive();
        }
        if (rightIsNull) {
            scene.rightArrow.setPosition(PositionFromIndex(xIndex + 1, true), PositionFromIndex(yIndex, false));
            scene.rightArrow.setAlpha(1);
            scene.rightArrow.setInteractive();
        }
    }

    function GetUp(yIndex) {
        scene.platforms.forEach((element) => {
            element.clearTint();
        });

        var upIsNull =
            yIndex > 0 && scene._platformSpots[IndexFromPosition(currentPlatform.x, true)][yIndex - 1] == null;
        if (yIndex == 0) {
            return yIndex;
        }
        if (upIsNull) {
            yIndex--;
            return GetUp(yIndex);
        }

        return yIndex;
    }

    function GetDown(yIndex) {
        scene.platforms.forEach((element) => {
            element.clearTint();
        });

        var downIsNull =
            yIndex < 6 && scene._platformSpots[IndexFromPosition(currentPlatform.x, true)][yIndex + 1] == null;
        if (yIndex == 6) {
            return yIndex;
        }
        if (downIsNull) {
            yIndex++;
            return GetDown(yIndex);
        }

        return yIndex;
    }

    function GetLeft(xIndex) {
        scene.platforms.forEach((element) => {
            element.clearTint();
        });

        var leftIsNull =
            xIndex > 0 && scene._platformSpots[xIndex - 1][IndexFromPosition(currentPlatform.y, false)] == null;
        if (xIndex == 0) {
            return xIndex;
        }
        if (leftIsNull) {
            xIndex--;
            return GetLeft(xIndex);
        }

        return xIndex;
    }

    function GetRight(xIndex) {
        scene.platforms.forEach((element) => {
            element.clearTint();
        });

        var rightIsNull = xIndex < 6 && scene._platformSpots[xIndex + 1][yIndex] == null;
        if (xIndex == 6) {
            return xIndex;
        }
        if (rightIsNull) {
            xIndex++;
            return GetRight(xIndex);
        }

        return xIndex;
    }

    function IndexFromPosition(position, isX) {
        if (isX == true) {
            position -= xOffset;
        } else {
            position -= yOffset;
        }

        position /= platformWidth;
        return position;
    }

    function PositionFromIndex(index, isX) {
        if (isX == true) {
            return index * platformWidth + xOffset;
        } else {
            return index * platformWidth + yOffset;
        }
    }
}
