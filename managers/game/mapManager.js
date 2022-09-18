/**
 * Napsu - Map Manager
 * Functions for switching between maps and regions
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */

const mapElements = {
	"home": document.querySelector("map-home"),
	"market": document.querySelector("map-market"),
}

const spawnLocations = {
	"home": {
		"home": 0,
		"market": 0,
	},
	"market": {
		"home": 0,
		"market": 0,
	}
}


/**
 * Function for switching between maps
 * @name switchMap
 * @param {string} map Map name
 * @param {number} spawnX X coordinate of the spawn point
 * @returns void
 */
function switchMap(map, spawnX) {
	if(activeMap === map) return;
	console.log(activeMap, map);
	document.querySelector(`.map-${activeMap}`).classList.remove('active');
	document.querySelector(`.map-${map}`).classList.add('active');
	activeMap = map;
}


/**
 * Function for handling sign activity
 * @name handleSignActivity
 * @param {string} target Target map
 */
function handleSignActivity(target) {
	if(target === 'home') {
		stopSound("current", 1000);
		switchMap('home', spawnLocations[activeMap][target]);
		playSound("ambient-1", false);
	} else if(target === 'market') {
		stopSound("current", 1000);
		switchMap('market', spawnLocations[activeMap][target]);
		playSound("ambient-2", false);
	}
}