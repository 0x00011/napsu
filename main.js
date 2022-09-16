const napsu = document.querySelector('#napsu');
const speech = document.querySelector('.speech');
const farm = document.querySelector('.farm');
const farmPos = farm.getBoundingClientRect();
const wellPos = document.querySelector('.well').getBoundingClientRect();
const benchPos = document.querySelector('.bench').getBoundingClientRect();
const borderPos = document.querySelector('#border-2').getBoundingClientRect();

/**
 * Todo: 
 * 	- fix bench animation (can't reanimate)
 * 	- add well drink cooldown
 * 	- add farming cooldown
 * 	- adjust farm growth
 */

var napsuState = {
	health: 100,
	thirst: 100,
	hunger: 100
}

var animationTimer = 2;
var keysPressed = { a: false, w: false, s: false, d: false };
var lastDirection = '';
var jumpCooldown = false;
var justDrinked = false;
var growth = 0;
var farmSet = false;
var allowMove = true;


function removeAnimations() {
	if(!keysPressed['a']) napsu.classList.remove('napsu-left');
	if(!keysPressed['d']) napsu.classList.remove('napsu-right');
	napsu.classList.remove('napsu-down');
}


function updateAnimation(direction) {
	if(direction != lastDirection) removeAnimations();
	if(jumpCooldown) return; // don't update animation if jump is on cooldown
	lastDirection = direction;

	if (direction === 'left') {
		napsu.classList.add('napsu-left');
		napsu.classList.add('look-left');
	} else if (direction === 'right') {
		napsu.classList.add('napsu-right');
		napsu.classList.remove('look-left');
	} else if (direction === 'up') {
		napsu.classList.add('napsu-up');
		jumpCooldown = true;
		setTimeout(() => {
			napsu.classList.remove('napsu-up');
			jumpCooldown = false;
		}, 1000);
	}
}


function moveNapsu() {
	if(!allowMove) return;
	//console.log(keysPressed)
	const distance = keysPressed['Shift'] ? 5 : 2;
	const napsuPosition = napsu.getBoundingClientRect();

	if (keysPressed['a'] && keysPressed['w'] && napsuPosition.left > 0) {
		updateAnimation('up');
		napsu.style.left = napsuPosition.left - distance + 'px';
	} else if (keysPressed['d'] && keysPressed['w'] && napsuPosition.right < window.innerWidth) {
		updateAnimation('up');
		napsu.style.left = napsuPosition.left + distance + 'px';
	} else if (keysPressed['a'] && keysPressed['s'] && napsuPosition.left > 0) {
		updateAnimation('left');
		napsu.style.left = napsuPosition.left - distance + 'px';
	} else if (keysPressed['d'] && keysPressed['s'] && napsuPosition.right < window.innerWidth) {
		updateAnimation('right');
		napsu.style.left = napsuPosition.left + distance + 'px';
	} else if (keysPressed['a'] && napsuPosition.left > 0) {
		napsu.style.left = napsuPosition.left - distance + 'px';
		updateAnimation('left');
	} else if (keysPressed['d'] && napsuPosition.right < window.innerWidth) {
		napsu.style.left = napsuPosition.left + distance + 'px';
		updateAnimation('right');
	} else if (keysPressed['w'] && napsuPosition.top > 0) {
		updateAnimation('up');
	} else {
		removeAnimations();
	}
}


function startKeyUpdate() {
	document.addEventListener('keydown', (event) => {
		keysPressed[event.key] = true;
	})

	document.addEventListener('keyup', (event) => {
		keysPressed[event.key] = false;
	})
}



document.addEventListener('keydown', (event) => {
	if (event.key === 'e') {
		const range = checkRange();
		if(range == "kaivo") {
			speech.classList.remove('speech-active');
			napsu.classList.add('napsu-water');
			justDrinked = true;
			setTimeout(() => {
				napsu.classList.remove('napsu-water');
			}, 1000);
		} else if(range == "penkki") {
			speech.classList.remove('speech-active');
			napsu.classList.add('napsu-sleep');
		} else if(range == "farmi") {
			if(farmSet == false && growth == 0) {
				speech.classList.remove('speech-active');
				napsu.classList.add('napsu-farm');
				allowMove = false;
				farmSet = true;
				setTimeout(() => {
					allowMove = true;
					napsu.classList.remove("napsu-farm");
				}, 2000);
			} else if(farmSet == true && growth >= 99) {
				speech.classList.remove('speech-active');
				napsu.classList.add('napsu-harvest');
				allowMove = false;
				setTimeout(() => {
					farmSet = false;
					allowMove = true;
					farm.id = 'farm-state-1';
					napsu.classList.remove("napsu-harvest");
					growth = 0;
				}, 2000);
			}
		}
	}
})



function checkRange() {
	const napsuPos = napsu.getBoundingClientRect();
	if (napsuPos.left > wellPos.left && napsuPos.right < wellPos.right && justDrinked === false) {
		if(!speech.classList.contains("speech-active")) {
			speech.classList.add('speech-active');
			speech.innerHTML = 'Paina <span>E</span> juodaksesi vettä kaivosta.';
		} else {
			return "kaivo";
		}
	} else if(napsuPos.left > benchPos.left && napsuPos.right < benchPos.right) {
		if(!speech.classList.contains("speech-active")) {
			speech.classList.add('speech-active');
			speech.innerHTML = 'Paina <span>E</span> mennäksesi lepäämään penkille.';
		} else {
			return "penkki";
		}
	} else if(napsuPos.left > farmPos.left && napsuPos.right < farmPos.right) {
		if(!speech.classList.contains("speech-active") && farmSet === false) {
			speech.classList.add('speech-active');
			speech.innerHTML = 'Paina <span>E</span> aloittaaksesi viljelyn.';
		} else {
			if(farmSet === true && growth < 100) {
				speech.classList.add('speech-active');
				speech.innerHTML = 'Viljely on käynnissä. Viljelys on edennyt ' + Math.round(growth) + '%.';
			} else if(farmSet === true && growth >= 99) {
				speech.classList.add('speech-active');
				speech.innerHTML = 'Viljely on valmis. Voit putsata pellon painamalla <span>E</span>.';
			}

			return "farmi";
		}
	} else if(napsuPos.left > (borderPos.left - 100)) {
		if(!speech.classList.contains("speech-active")) {
			speech.classList.add('speech-active');
			speech.innerHTML = 'Emme pääse vielä täältä pidemmälle. Ehkä joskus myöhemmin.';
			speech.classList.add('speech-left');
		} else {
			return "raja";
		}
	} else {
		speech.classList.remove('speech-left');
		speech.classList.remove('speech-active');
		napsu.classList.remove('napsu-sleep');
		napsu.classList.remove('napsu-farm');
	}
}


// Create function which updates farm growth
function updateGrowth() {
	if(growth >= 100 || !farmSet) return;
	if(growth < 100) growth += 0.1;

	//console.log(growth)

	if(growth < 20) {
		farm.id = 'farm-state-1';
	} else if(growth < 40) {
		farm.id = 'farm-state-2';
	} else if(growth < 60) {
		farm.id = 'farm-state-3';
	} else if(growth < 90) {
		farm.id = 'farm-state-4';
	} else if(growth < 100) {
		farm.id = 'farm-state-5';
	}
}


window.addEventListener('blur', () => {
	keysPressed = {
		'w': false,
		'a': false,
		's': false,
		'd': false,
		'Shift': false
	}
})


function main() {
	startKeyUpdate();

	setInterval(() => {
		moveNapsu();
		checkRange();
	}, 100);

	setInterval(() => {
		updateGrowth();
	}, 0);
}


main();