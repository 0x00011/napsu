/**
 * Napsu - Main Game Manager
 * Functions for handling the game's main loop and stored variables
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 * 
 * Napsu todo: 
 * 	- fix bench animation (can't reanimate)
 * 	- add well drink cooldown
 * 	- add farming cooldown
 * 	- adjust farm growth
 * 	- fix item swapping 
 * 	- add option to choose how many items to move
 * 	- Better way of handling activity positions
 */

const napsu = document.querySelector('#napsu');
const speech = document.querySelector('.speech');
const farm = document.querySelector('.farm');
const farmPos = farm.getBoundingClientRect();
const wellPos = document.querySelector('.well').getBoundingClientRect();
const benchPos = document.querySelector('.bench').getBoundingClientRect();
const borderPos = document.querySelector('#border-2').getBoundingClientRect();
const chest = document.querySelector('.chest');
const chestPos = chest.getBoundingClientRect();
const signHomePos = document.querySelector('.sign-home').getBoundingClientRect();
const signMarketPos = document.querySelector('.sign-market').getBoundingClientRect();
const boardPos = document.querySelector('.board').getBoundingClientRect();

const lang = {
	"well": {
		"press-to-drink": "Paina <span>E</span> juodaksesi vettä kaivosta." 
	},
	"bench": {
		"press-to-lay": "Paina <span>E</span> mennäksesi lepäämään penkille."
	},
	"farm": {
		"press-to-farm": "Paina <span>E</span> aloittaaksesi maissiviljelyn.",
		"farming-in-progress": "Maissin viljely on käynnissä. Viljelys on edennyt {0}%.",
		"press-to-harvest": "Paina <span>E</span> kerätäksesi maissisadon.",
		"farm-cooldown": "Viljelit juuri, joten sinun on odotettava hetki ennen uuden maissiviljelyn aloittamista.",
		"no-seeds": "Sinulla ei ole viljelyyn tarvittavia maissin siemeniä."
	},
	"border": {
		"not-allowed": "Täällä on portti. Emme pääse ainakaan vielä pidemmälle."
	}
}

var napsuState = {
	level: 1,
	devMode: true
}
var keysPressed = { a: false, w: false, s: false, d: false };
var lastDirection = '';
var jumpCooldown = false;
var justDrinked = false;
var growth = 0;
var farmSet = false;
var farmCooldown = 0;
var allowMove = true;
var activeMap = "home";


/**
 * Function which runs when player presses E key
 * @returns void
 */
function triggerActivity() {
	const activity = checkRange();
	if(inventoryOpen && activity != "chest") return;

	if(activeMap == "home") {
		if(activity == "well") return handleWellActivity();
		if(activity == "bench") return handleBenchActivity();
		if(activity == "farm") return handleFarmActivity();
		if(activity == "chest") return toggleInventory();
		if(activity == "sign_toMarket") return handleSignActivity("market");
	}

	if(activeMap == "market") {
		if(activity == "sign_toHome") return handleSignActivity("home");
		if(activity == "board") return handleBoardActivity();
	}
}


/**
 * Function for adding click listeners for specific element
 * @name addClickListeners
 * @returns void
 */
function addClickListeners() {
	document.querySelector('#close-mission-board').addEventListener('click', () => {
		toggleMissionPopup();
	});
}


/**
 * Function which checks if player is in range of any activity
 * If player is in range of activity, it returns the activity
 * name and runs setSpeechBubble function
 * @name checkRange
 * @returns string
 */
function checkRange() {
	const napsuPos = napsu.getBoundingClientRect();
	const rangeValidation = {
		"well": Boolean(napsuPos.left > (wellPos.left - 20) && napsuPos.right < (wellPos.right + 20)),
		"bench": Boolean(napsuPos.left > (benchPos.left - 20) && napsuPos.right < (benchPos.right + 20)),
		"farm": Boolean(napsuPos.left > (farmPos.left - 20) && napsuPos.right < (farmPos.right + 20)),
		"chest": Boolean(napsuPos.left > (chestPos.left - 20) && napsuPos.right < (chestPos.right + 20)),
		"signHome": Boolean(napsuPos.left > (signHomePos.left - 20) && napsuPos.right < (signHomePos.right + 40)),
		"signMarket": Boolean(napsuPos.left > (signMarketPos.left - 20) && napsuPos.right < (signMarketPos.right + 40)),
		"board": Boolean(napsuPos.left > (boardPos.left - 20) && napsuPos.right < (boardPos.right + 20)),
	}

	handleChestTooltip(rangeValidation["chest"]);

	if(activeMap == "home") {
		if(rangeValidation["well"] && justDrinked === false) {
			setBubble(lang["well"]["press-to-drink"]);
			return "well";
		}
		
		if(rangeValidation["bench"]) {
			if(napsu.classList.contains('napsu-sleep')) return "bench";
			setBubble(lang["bench"]["press-to-lay"]);
			return "bench";
		}
	
		if(rangeValidation["farm"]) {
			handleFarmTooltip();
			return "farm";
		}
	
		if(rangeValidation["chest"]) {
			setBubble("Paina <span>E</span> avataksesi arkun.");
			return "chest";
		}
	
		if(rangeValidation["signHome"]) {
			setBubble("Paina <span>E</span> lähteäksesi torille.", true);
			return "sign_toMarket";
		}
		
		if(napsuPos.left > (borderPos.left - 100)) {
			setBubble(lang["border"]["not-allowed"], false, true);
			return "border";
		}
	}

	if(activeMap == "market") {
		if(rangeValidation["signMarket"]) {
			setBubble("Paina <span>E</span> palataksesi kotiin.", true);
			return "sign_toHome";
		}

		if(rangeValidation["board"]) {
			setBubble("Paina <span>E</span> lukeaksesi ilmoitustaulun.", true);
			return "board";
		}
	}

	
	removeClasses();
}


/**
 * Function which runs when player is not in range of any activity
 * It removes speech bubbles and activity-related animation classes
 * @name removeClasses
 * @returns void
 */
function removeClasses() {
	speech.classList.remove('speech-left');
	speech.classList.remove('speech-active');
	napsu.classList.remove('napsu-sleep');
	napsu.classList.remove('napsu-farm');
}


/** 
 * When page loses focus we want to stop the movement
 * This is to prevent the player from doing unexpected things
**/
window.onblur = function() {
	keysPressed = {}
}

/**
 * When player presses a key we want to add it to keysPressed object
 * So that we can check if the key is pressed or not when we need to
 */
window.onkeyup = function(e) {
	if(keysPressed['d'] && e.key == 'Shift') keysPressed['d'] = false;
	if(keysPressed['a'] && e.key == 'Shift') keysPressed['a'] = false;
	keysPressed[e.key] = false;
}

/**
 * When player releases a key we want to remove it from keysPressed object 
 */
window.onkeydown = function(e) {
	if(e.key == 'e') triggerActivity();
	if(e.key == 'g') toggleInventory();
	if(e.key == 'ArrowDown') chest.classList.toggle('chest-open');
	keysPressed[e.key] = true;
}


/**
 * Add new prototype to String object to make it easier to format strings
 * @from https://stackoverflow.com/a/3492815
 * @date 17.9.2022
 */
String.prototype.format = function() {
	var f = this;
	for(var a in arguments) {
		f = f.replace("{" + a + "}", arguments[a]);
	}
	return f;
};


// Initialize game when page DOM content has been loaded
document.addEventListener('DOMContentLoaded', () => {
	fetchInventoryStorage();
	updateInventory();
	initItemListener();
	addClickListeners();

	setInterval(() => {
		moveNapsu();
		checkRange();
		updateFarmGrowth();
	}, 50);
});