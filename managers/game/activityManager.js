/**
 * Napsu - Task Manager
 * Functions for handling task related stuff
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */


/**
 * Function which runs when Napsu drinks water from the well
 * @name handleWellActivity
 */
function handleWellActivity() {
	justDrinked = true;
	triggerAnimation('napsu-water', 1000);
	clearBubble();
}


/**
 * Function which runs when Napsu is going to lay down on the bench
 * @name handleBenchActivity
 */
function handleBenchActivity() {
	triggerAnimation('napsu-sleep', false);
	clearBubble();
}


/**
 * Function for handling board activity
 * @name handleBoardActivity
 * @returns void
 */
function handleBoardActivity() {
	// Toggle board visibility
	document.querySelector('.mission-popup').classList.toggle('active');
}


/**
 * Function for toggling missoni popup visibility
 */
function toggleMissionPopup() {
	document.querySelector('.mission-popup').classList.toggle('active');
}