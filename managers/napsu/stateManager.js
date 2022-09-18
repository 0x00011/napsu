/**
 * Napsu - State Manager
 * Functions for handling Napsu's state, such as health, hunger, etc.
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */

const napsuLevel = document.getElementById('napsu-level');
var previousLevel = 1;

/**
 * Function for increasing Napsu's level
 * @name updateNapsuLevel
 * @param {number} amount Amount of levels [default: 0.01]
 * @returns void
 */
function updateNapsuLevel(amount = 0.01) {
	if(napsuState.level >= 125) return;
	napsuState.level += 0.01;
	updateNapsuUI();
}

/**
 * Function for upading Napsu's level UI
 * @name updateNapsuUI
 * @returns void
 */
function updateNapsuUI() {
	if(previousLevel !== Math.floor(napsuState.level)) {
		napsuLevel.innerText = Math.round(napsuState.level);
		napsuLevel.parentElement.classList.add('level-up');

		setTimeout(() => napsuLevel.parentElement.classList.remove('level-up'), 1000);
		previousLevel = Math.floor(napsuState.level);
	}
}