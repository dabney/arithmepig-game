
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
	this.titleScreenSprite = null;

};

BasicGame.MainMenu.prototype = {
	create: function () {
		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		this.titleScreenSprite = this.add.sprite(0, 0, 'glitchsprites', 'blue480X320play.png');
		this.playButton = this.add.button(160, 210, 'glitchsprites', this.startGame, this, 'buttonOver.png', 'buttonOut.png', 'buttonOver.png');
		


	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.game.state.start('Game');

	}

};
