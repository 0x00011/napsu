/**
 * Napsu - Task Manager
 * Functions and events for handling music and sound effects
 * 
 * Author: Saku
 * Musics by: alkakrab @ itch.io
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */

const defaultVolume = 0.5;
var currentSound = null;

/**
 * Function for playing music and sound effects
 * @name playSound
 * @param {string} sound Sound name
 * @param {boolean} loop Loop the sound
 * @returns void
 */
function playSound(sound, loop) {
	if(loop) {
		document.querySelector(`audio[name="${sound}"]`).loop = true;
	}
	document.querySelector(`audio[name="${sound}"]`).volume = defaultVolume;
	document.querySelector(`audio[name="${sound}"]`).play();
	currentSound = sound;
}

/**
 * Function for stopping music and sound effects
 * @name stopSound
 * @param {string} sound Sound name
 * @returns void
 */
function stopSound(sound) {
	// fade audio out
	fadeAudio(sound, 1000);
}


/**
 * Function for fading audio
 * @name fadeAudio
 * @param {string} sound Sound name
 * @param {number} duration Duration of the fade
 * @param {*} callback Callback function
 * @returns void
 */
function fadeAudio(sound, duration, newAudio) {
	if(sound === "current") sound = currentSound;
	var audio = document.querySelector(`audio[name="${sound}"]`);

	// fade audio volume out until it reaches 0
	var fadeOut = setInterval(function () {
		if (audio.volume >= 0.01) {
			audio.volume = audio.volume - 0.01;
		} else {
			audio.pause();
			audio.currentTime = 0;
			clearInterval(fadeOut);
		}
	}, duration / 100);

}