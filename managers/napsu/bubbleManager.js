/**
 * Napsu - Bubble Manager
 * Functions for handling all speech bubble related stuff
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */


/**
 * Clear and hiding speech bubble
 * @name clearBubble
 */
function clearBubble() {
	speech.classList.remove('speech-active');
}


/**
 * Handle speech bubble visibility, text and position
 * @name handleBubble
 * @param {string} content Speech bubble text content 
 * @param {boolean} forceUpdate Force to update bubble content
 * @param {boolean} forceLeft Force to show bubble on left side
 */
function setBubble(content, forceUpdate, forceLeft) {
	if(forceUpdate) speech.innerHTML = content;
	if(forceLeft && !speech.classList.contains("speech-left")) {
		speech.classList.add('speech-left');
	}

	if(speech.classList.contains('speech-active')) return;
	speech.classList.add('speech-active');
	speech.innerHTML = content;
}