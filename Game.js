
BasicGame.Game = function (game) {

};



BasicGame.Game.prototype = {
	equationObjects: [],
	solutionObjects: [],
	flippedTileCount: 0,
	BUBBLEVELOCITY: 25,
	NUMBEROFEQUATIONS: 8,
	draggingInProgress: false,
	currentDraggedItem: null,
    score: 0,
    scoreText: null,
    globalGameObject: null,

	create: function () {
		this.globalGameObject = this;
		var currentEquationObject;
		var currentSolutionObject;
        var solutionObjectPositions=[];
		var objectCount = 0;
       // console.log('create:this.BUBBLEVELOCITY: ' + this.BUBBLEVELOCITY);
        this.world.width = 480;

        this.add.sprite(0,0, 'glitchsprites', 'arithmepigbackground.png');


        for (var i = 0; i < this.NUMBEROFEQUATIONS/2; i++) {
			for (var j = 2; j > 0; j--) {

                currentEquationObject = this.add.sprite(-75*this.NUMBEROFEQUATIONS/2 + i*100 - j*50, 320-j*50, 'glitchsprites');
                this.equationObjects[objectCount] = currentEquationObject;
                currentEquationObject.anchor.setTo(0.5, 0.5);
                currentEquationObject.animations.add('walk', Phaser.Animation.generateFrameNames('pigwalk_', 1, 24, '.png', 4));
                currentEquationObject.animations.play('walk', 20, true);
                currentEquationObject.body.velocity.x = 30;
                currentEquationObject.outOfBoundsKill = true;
                currentEquationObject.a = Math.ceil(Math.random() * 10);
				currentEquationObject.b = Math.ceil(Math.random() * 10);
				currentEquationObject.value = currentEquationObject.a * currentEquationObject.b;
                currentEquationObject.stillActive = true;
				currentEquationObject.textObject = this.add.bitmapText(currentEquationObject.x - 10, currentEquationObject.y, currentEquationObject.a +' X '+ currentEquationObject.b,{ font: "18px Arial", fill: "#ffffff", align: "center" });
				currentEquationObject.textObject.anchor.setTo(0.5, 0.5);
                currentEquationObject.parentGame = this;


				objectCount++;
				}
			}
        // Create an array of possible positions for the solution sprites
        for (var x = 100; x <= 385; x += 35)
        {
            for (var y = 20; y <= 90; y += 35)
            {
                solutionObjectPositions.push({x: x, y: y});
            }
        }

			for (i = 0; i < this.NUMBEROFEQUATIONS; i++) {
                //console.log('position: '+ solutionObjectPositions[i].x + ', ' + solutionObjectPositions[i].y);
                var randomPosition = solutionObjectPositions.splice(Math.floor(Math.random()*solutionObjectPositions.length), 1);
                //console.log(randomPosition);
                //console.log('position: '+ randomPosition[0].x + ', ' + randomPosition[0].y);

                currentSolutionObject = this.add.sprite(randomPosition[0].x, randomPosition[0].y, 'glitchsprites', 'apple__x1_iconic_png_1354829396.png');
                this.solutionObjects[i] =  currentSolutionObject;
                //currentSolutionObject = this.solutionObjects.create(Math.random() * 320 + 50, Math.random() * 100 + 32, 'glitchsprites', 'apple__x1_iconic_png_1354829396.png');
                currentSolutionObject.anchor.setTo(0.5, 0.5);
				currentSolutionObject.value = this.equationObjects[i].value;
				currentSolutionObject.inputEnabled = true;
				currentSolutionObject.input.enableDrag(true, false, true, 1, null, null);
				currentSolutionObject.input.useHandCursor = true;
				currentSolutionObject.outOfBoundsKill = true;
				currentSolutionObject.events.onDragStart.add(this.dragStarted, this, currentSolutionObject);
				currentSolutionObject.events.onDragStop.add(this.dragReleased, this, currentSolutionObject);
                currentSolutionObject.textObject = this.add.bitmapText(currentSolutionObject.x - 3, currentSolutionObject.y + 3, ''+currentSolutionObject.value,{ font: "18px Arial", fill: "#ffffff", align: "left" });
                //currentSolutionObject.textObject = this.add.text(currentSolutionObject.x, currentSolutionObject.y, ''+currentSolutionObject.value,{ font: "16px Arial", fill: "#ffffff", align: "left" });
                currentSolutionObject.textObject.anchor.setTo(0.5, 0.5);
			}
        this.add.sprite(400,10, 'glitchsprites', 'pig_in_fence.png');

        this.scoreText = this.add.bitmapText(440,23, ''+ this.score, { font: '18px Arial', align: 'center' });
       this.scoreText.anchor.setTo(0.5,.5);
        this.playAgainButton = this.add.button(160, 210, 'glitchsprites', this.refreshGame, this, 'buttonOver.png', 'buttonOut.png', 'buttonOver.png');
        this.playAgainButton.kill();
    },


	update: function () {
	if (this.flippedTileCount === this.NUMBEROFEQUATIONS) {
        this.flippedTileCount=0;
        this.playAgainButton.revive();
       // window.setTimeout(this.refreshGame, 1500);
		}

        else {
        var numberDead = 0;
    for (var i=0; i < this.NUMBEROFEQUATIONS; i++) {

        if (this.equationObjects[i].alive !== true) {
            numberDead++;
        }
        if (numberDead === this.NUMBEROFEQUATIONS)  {
            //console.log('all dead');
            this.flippedTileCount=0;
            this.playAgainButton.revive();
            //window.setTimeout(this.refreshGame, 1500);

        }
    }


		 if (this.draggingInProgress == true && this.currentDraggedItem) {
             //console.log('dragging');
             //this.currentDraggedItem.textObject.reset(this.currentDraggedItem.x - 5, this.currentDraggedItem.y);
             this.currentDraggedItem.textObject.x = this.currentDraggedItem.x - 5;
             this.currentDraggedItem.textObject.y = this.currentDraggedItem.y;
            // this.currentDraggedItem.zIndex = 0;

		}
	for (var i=0; i < this.NUMBEROFEQUATIONS; i++) {
        this.equationObjects[i].textObject.x = this.equationObjects[i].x - 10;
		}
        }
	},
	
	checkForMatch: function(currentEquationObject, currentSolutionObject) {
       // console.log('checkForMatch');
        //console.log(this);
        //console.log(currentEquationObject);
        //console.log(currentSolutionObject);
       // if (Phaser.Rectangle.contains(currentEquationObject.body, currentSolutionObject.x, currentSolutionObject.y)) {
           if (Phaser.Rectangle.intersects(currentSolutionObject.body, currentEquationObject.body)) {
    //console.log('Phaser.Rectangle.intersects is true');
		if (currentEquationObject.value === currentSolutionObject.value) {
			currentSolutionObject.kill();
			currentSolutionObject.textObject.setText('');
            currentEquationObject.stillActive = false;
            currentEquationObject.body.velocity.x = 0;
            currentEquationObject.scale.setTo(.6,.6);
            currentEquationObject.textObject.setText('');
            this.physics.moveToXY(currentEquationObject, 460, 20, 120);
            currentEquationObject.update = function() {
               // console.log('dead eq obj update')
                if (this.body.y < 25) {
                    if (this.alive)  {
                        this.parentGame.flippedTileCount++;
                        this.parentGame.score++;
                        this.parentGame.scoreText.setText(''+this.parentGame.score);
                        this.kill();

                    }
                }
                else {
                    this.angle += 4;
                }

            };



            /*
            for (var scaleFactor = .99; scaleFactor >= .30; scaleFactor = scaleFactor - .05) {
                       console.log('scale by: ' + scaleFactor);
            currentEquationObject.angle += 20;
                window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(scaleFactor,scaleFactor);}, 10);
            }
            */
            /*
            window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(.8,.8);}, 200);
            window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(.7,.7);}, 200);
            window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(.6,.6);}, 200);
            window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(.5,.5);}, 200);
            window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(.4,.4);}, 200);
            window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(.3,.3);}, 200);
            */
            /*
            for (var i=1; i <= 10; i++) {
                window.setTimeout(function scaleIt() {currentEquationObject.scale.setTo(1/i, 1/i);}, 100);
            }
            */
			//currentEquationObject.kill();



        }
		else {
			//currentSolutionObject.body.velocity.y = this.BUBBLEVELOCITY;
		}
	}
	else {
		//currentSolutionObject.body.velocity.y = this.BUBBLEVELOCITY;
		}
	},
	
	dragStarted: function (draggedObject) {
        //console.log('dragstarted:this.BUBBLEVELOCITY: ' + game.BUBBLEVELOCITY);

        //console.log('this.draggingInProgress: '+ this.draggingInProgress);
       // console.log('in dragStarted');

       // console.log(this);
        //console.log(draggedObject);
        this.globalGameObject.draggingInProgress = true;
        this.globalGameObject.currentDraggedItem = draggedObject;
       // this.scoreText.setText(''+5);

	},

	dragReleased: function (releasedObject) {
        var currentEquationSprite;
       // console.log('in dragReleased');
        //console.log(this);
       // console.log(releasedObject);
       // console.log('dragreleased:this.BUBBLEVELOCITY: ' + this.BUBBLEVELOCITY);

        //console.log('in dragReleased');
        this.globalGameObject.draggingInProgress = false;
        this.globalGameObject.currentDraggedItem = null;
		for (var k = 0; k < this.globalGameObject.NUMBEROFEQUATIONS; k++) {
		//console.log('trying box '+k);
            //console.log(this.equationObjects[k]);
            currentEquationSprite =   this.equationObjects[k];
            if (currentEquationSprite.stillActive){
            this.globalGameObject.checkForMatch(currentEquationSprite, releasedObject);
            }
		}
	},
	
	refreshGame: function (pointer) {
        //console.log('refreshGame:this.BUBBLEVELOCITY: ' + this.BUBBLEVELOCITY);
        var currentEquationObject;
        var currentSolutionObject;
        var solutionObjectPositions=[];
        var objectCount = 0;
        console.log('playAgainButton: '+ this.playAgainButton);
        this.playAgainButton.kill();
        this.playAgainButton.visible = false;

        for (var i = 0; i < this.NUMBEROFEQUATIONS/2; i++) {
            for (var j = 2; j > 0; j--) {
                console.log('refreshGame - equationObject ' + objectCount)
                 currentEquationObject = this.equationObjects[objectCount];
                currentEquationObject.reset(-75*this.NUMBEROFEQUATIONS/2 + i*100 - j*50, 320-j*50);
                console.log('in refreshGame obj is alive: ' + currentEquationObject.alive)
                currentEquationObject.body.velocity.x = 30;
                currentEquationObject.a = Math.ceil(Math.random() * 10);
                currentEquationObject.b = Math.ceil(Math.random() * 10);
                currentEquationObject.value = currentEquationObject.a * currentEquationObject.b;
                currentEquationObject.stillActive = true;
                currentEquationObject.textObject.x = currentEquationObject.x - 10;
                currentEquationObject.textObject.y = currentEquationObject.y;
                currentEquationObject.textObject.setText(currentEquationObject.a +' X '+ currentEquationObject.b);
                currentEquationObject.update = function() {};
                currentEquationObject.scale.setTo(1,1);
                currentEquationObject.angle = 0;

                objectCount++;
            }
        }
        // Create an array of possible positions for the solution sprites
        for (var x = 100; x <= 385; x += 35)
        {
            for (var y = 20; y <= 90; y += 35)
            {
                solutionObjectPositions.push({x: x, y: y});
            }
        }


        for (var i = 0; i < this.NUMBEROFEQUATIONS; i++) {
            //console.log('position: '+ solutionObjectPositions[i].x + ', ' + solutionObjectPositions[i].y);
            var randomPosition = solutionObjectPositions.splice(Math.floor(Math.random()*solutionObjectPositions.length), 1);
            //console.log(randomPosition);
            //console.log('position: '+ randomPosition[0].x + ', ' + randomPosition[0].y);
            currentSolutionObject =   this.solutionObjects[i];
             currentSolutionObject.reset(randomPosition[0].x, randomPosition[0].y);

            //currentSolutionObject = this.solutionObjects.create(Math.random() * 320 + 50, Math.random() * 100 + 32, 'glitchsprites', 'apple__x1_iconic_png_1354829396.png');

            currentSolutionObject.value = this.equationObjects[i].value;
            currentSolutionObject.textObject.x = currentSolutionObject.x - 3;
            currentSolutionObject.textObject.y = currentSolutionObject.y + 3;
            currentSolutionObject.textObject.setText(''+currentSolutionObject.value);
            //currentSolutionObject.textObject = this.add.text(currentSolutionObject.x, currentSolutionObject.y, ''+currentSolutionObject.value,{ font: "16px Arial", fill: "#ffffff", align: "left" });

        }


	},



	quitGame: function (pointer) {
        //console.log('quitGame:this.BUBBLEVELOCITY: ' + this.BUBBLEVELOCITY);

        //	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.

        this.game.state.start('MainMenu');

	}

};
