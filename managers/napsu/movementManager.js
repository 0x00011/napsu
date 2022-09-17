/**
 * Napsu - Movement Manager
 * Functions and events for handling Napsu's movement
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */

/**
 * Function which runs in tickspeed -interval and moves Napsu if needed
 * @name moveNapsu
 * @returns 
 */
function moveNapsu() {
	if(!allowMove || inventoryOpen) return;
	var distance = keysPressed['Shift'] ? 10 : 5;
	if(napsuState.devMode) distance = keysPressed['Shift'] ? 30 : 15;
	const napsuPosition = napsu.getBoundingClientRect();

	if(napsuState.devMode) {
		if(keysPressed['ArrowUp']) {
			updateAnimation('punch');
		}
	}

	if(keysPressed['w']) {
		updateAnimation('jumpUp');
	} else if(keysPressed['a']) {
		if(!napsuPosition.left > 0) return; 
		napsu.style.left = (napsuPosition.left - distance) + 'px';
		if(keysPressed['w']) return updateAnimation('jumpUp');
		updateAnimation('moveLeft');
	} else if(keysPressed['d']) {
		if(napsuPosition.left >= (borderPos.left - 50)) return;
		napsu.style.left = (napsuPosition.left + distance) + 'px';
		if(keysPressed['w']) return updateAnimation('jumpUp');
		updateAnimation('moveRight');
	} else {
		removeAnimations();
	}
}