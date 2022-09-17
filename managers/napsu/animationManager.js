/**
 * Napsu - Animation Manager
 * Functions and events for handling Napsu's animations
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */


/**
 * Function which removes all animation classes from Napsu
 * @name removeAnimations
 */
function removeAnimations() {
	napsu.classList.remove('napsu-left');
	napsu.classList.remove('napsu-right');
	napsu.classList.remove('napsu-down');
}


/**
 * Function which updates Napsu's animation state
 * @name updateAnimation
 * @todo REWRITE THIS FUNCTION
 * @param {string} anim Animation name
 * @returns 
 */
function updateAnimation(anim) {
	if(anim != lastDirection) removeAnimations();
	lastDirection = anim;
	
	if (anim === 'moveLeft') {
		napsu.classList.add('napsu-left');
		napsu.classList.add('look-left');
	} else if (anim === 'moveRight') {
		napsu.classList.add('napsu-right');
		napsu.classList.remove('look-left');
	} else if (anim === 'jumpUp') {
		if(jumpCooldown) return;
		napsu.classList.add('napsu-up');
		jumpCooldown = true;
		setTimeout(() => {
			napsu.classList.remove('napsu-up');
			jumpCooldown = false;
		}, 1000);
	} else if (anim == 'punch') {
		napsu.classList.add('napsu-punch');
		setTimeout(() => {
			napsu.classList.remove('napsu-punch');
		}, 2200);
	}
}


/**
 * Function adding animation classes to Napsu
 * @param {string} animation Name of the animation class
 * @param {*} duration Duration of the animation
 * @param {*} setMovement If true, sets movement to true after animation 
 */
function triggerAnimation(animation, duration, setMovement) {
	napsu.classList.add(animation);
	if(duration) {
		setTimeout(() => {
			napsu.classList.remove(animation)
			if(setMovement) allowMove = true;
		}, duration);
	}
}
