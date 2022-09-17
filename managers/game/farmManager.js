/**
 * Napsu - Farm Manager
 * Functions for handling farm growth and harvesting
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */

/**
 * Function which runs in a interval and updates farm growth state
 * @name updateFarmGrowth
 */
function updateFarmGrowth() {
	if(growth >= 100 || !farmSet) {
		if(farmCooldown > 0) farmCooldown -= 1;
		return;
	};
	
	if(growth < 100) growth += napsuState.devMode ? 10 : 0.05;
	if(growth < 20) return farm.id = 'farm-state-1';
	if(growth < 40) return farm.id = 'farm-state-2';
	if(growth < 60) return farm.id = 'farm-state-3';
	if(growth < 90) return farm.id = 'farm-state-4';
	if(growth < 100) return farm.id = 'farm-state-5';
}


/**
 * Function for handling farm harvesting and farming
 * @name handleFarmActivity
 */
function handleFarmActivity() {
	if(farmSet == false && growth == 0) {
		farmSet = true; allowMove = false;
		farmCooldown = 1000;
		triggerAnimation('napsu-farm', 2000, true);
		clearBubble();
	}
	
	else if(farmSet == true && growth >= 99) {
		triggerAnimation('napsu-harvest', false);
		allowMove = false;

		setTimeout(() => {
			growth = 0;
			allowMove = true;
			farmSet = false;
			napsu.classList.remove("napsu-harvest");
			farm.id = 'farm-state-1';
			clearBubble();
		}, 2000);
	}
}


/**
 * Function for handling farm range tooltips
 * @name handleFarmTooltip
 */
function handleFarmTooltip() {
	if(farmSet) {
		if(growth >= 99) setBubble(lang["farm"]["press-to-harvest"], true); 
		if(growth < 99) setBubble(lang["farm"]["farming-in-progress"].format(Math.round(growth)), true)
	} else {
		if(farmCooldown === 0) {
			setBubble(lang["farm"]["press-to-farm"]);
		} else {
			setBubble(lang["farm"]["farm-cooldown"], true);
		}
	}
}