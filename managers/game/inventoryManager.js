/**
 * Napsu - Inventory Manager
 * Handle inventories and items
 * 
 * Author: Saku
 * Version: 1.0.0
 * Repository: https://github.com/0x00011/napsu
 */

const inventoryChestSide = document.querySelector('.inventory-chest-side');

var inventoryOpen = false;
var chestNearby = false;
var inventories = {
	"backpack": {
		"name": "Reppu",
		"maxitems": 5,
		"items": {
			"book": {
				"icon": "book.png",
				"name": "Ohjekirja",
				"description": "Lue tietoja ja ohjeita jotka ovat annettu Napsulle.",
				"count": 1
			}
		}
	},
	"chest": {
		"name": "Arkku",
		"maxitems": 15,
		"items": {
			"tomato": {
				"icon": "tomato.png",
				"name": "Tomaatti",
				"description": "Tomaatit ovat hyvä myyntiväline. Niistä maksetaan torilla hyvä hinta.",
				"count": 4
			},
			"cornseeds": {
				"icon": "cornseeds.png",
				"name": "Maissin siemeniä",
				"description": "Siemenpussin avulla voit kasvattaa pellollasi yhden satsin omaa viljelystäsi.",
				"count": 1
			}	
		}
	}
}



const availableItems = {
	"corn": {
		"itemIcon": "corn.png",
		"itemName": "Maissi",
		"itemDescription": "Maissi on hyvä vilja syötäväksi tai myytäväksi, jota voit viljellä pellollasi."
	},
	"tomato": {
		"itemIcon": "tomato.png",
		"itemName": "Tomaatti",
		"itemdescription": "Tomaatit ovat hyvä myyntiväline. Niistä maksetaan torilla hyvä hinta."
	},
}



/**
 * Add items to specific inventory
 * @name addItemToInventory
 * @param {string} inventoryId
 * @param {string} itemId
 * @param {itemCount} itemCount
 * @returns void
 */
function addItemToInventory(inventoryId, itemId, itemCount) {
	const { itemIcon, itemName, itemDescription } = availableItems[itemId];
	
	if(inventories[inventoryId].items[itemId] == undefined) {
		inventories[inventoryId].items[itemId] = {
			"icon": itemIcon,
			"name": itemName,
			"description": itemDescription,
			"count": itemCount
		}
	} else {
		inventories[inventoryId].items[itemId].count += itemCount;
	}

	updateInventory();
}

/**
 * Remove items from specific inventory
 * @name removeItemFromInventory
 * @param {string} inventoryId
 * @param {string} itemId
 * @param {itemCount} itemCount
 * @returns void
 */
function removeItemFromInventory(inventoryId, itemId, itemCount) {
	if(inventories[inventoryId].items[itemId] == undefined) return;
	if(inventories[inventoryId].items[itemId] < itemCount) return;
	inventories[inventoryId].items[itemId] -= itemCount;

	updateInventory();
}


/**
 * Move item from one inventory to another
 * @name moveItemFromTo
 * @param {string} fromId
 * @param {string} toId
 * @param {string} itemId
 * @param {number} itemCount
 * @returns void
 */
function moveItemFromTo(fromId, toId, itemId, itemCount) {
	if(inventories[fromId].items[itemId] == undefined) return console.log('Item not found in inventory');
	if(inventories[fromId].items[itemId] < itemCount) return console.log('Not enough items in inventory');
	
	// If itemCount is -1 (Shift has been held down when moving item), move all items
	if(itemCount === -1) itemCount = inventories[fromId].items[itemId].count;

	if(inventories[toId].items[itemId] == undefined) {
		inventories[toId].items[itemId] = {
			"icon": inventories[fromId].items[itemId].icon,
			"name": inventories[fromId].items[itemId].name,
			"description": inventories[fromId].items[itemId].description,
			"count": itemCount
		}
	} else {
		inventories[toId].items[itemId].count += itemCount;
	}

	if((inventories[fromId].items[itemId].count - itemCount) <= 0) {
		delete inventories[fromId].items[itemId];
	} else {
		inventories[fromId].items[itemId].count -= itemCount;
	}

	updateInventory();
}


/**	
 * Get inventory item count by id
 * @name getInventoryItemCount
 * @param {string} inventoryId
 * @param {string} itemId
 * @returns {number} Item count
 */
function getInventoryItemCount(inventoryId, itemId) {
	if(inventories[inventoryId].items[itemId] == undefined) return 0;
	return inventories[inventoryId].items[itemId].count;
}


/**
 * Create new inventory item element and return it
 * @name createItemElement
 * @param {object} item Stored inventory item object
 * @returns 
 */
function createItemElement(itemId, item) {
	const element = document.createElement('div');
	element.classList.add('inventory-item');
	element.id = itemId;

	element.innerHTML += `
		<div class="inventory-item-image">
			<img src="./assets/items/${item.icon}" alt="Item">
		</div>
		<div class="inventory-item-info">
			<h3 class="inventory-item-name">${item.name}</h3>
			<p class="inventory-item-description">${item.description}</p>
		</div>
		<div class="inventory-item-count">
			${item.count}
		</div>
	`;

	return element;
}



/**
 * Update inventory data to local storage
 * @name updateInventoryStorage
 * @returns void
 */
function updateInventoryStorage() {
	localStorage.setItem('inventories', JSON.stringify(inventories));
}


/**
 * Fetch inventory data from local storage
 * @name fetchInventoryStorage
 * @returns void
 */
function fetchInventoryStorage() {
	if(napsuState.devMode) return;
	
	const storage = localStorage.getItem('inventories');
	if(storage == null) return inventories;
	inventories = JSON.parse(storage);
}



/**
 * Add item element to it's type-inventory
 * @param {string} type 
 * @param {Element} itemElem 
 */
function setItemInventory(type, itemElem) {
	document.querySelector(`.inventory-${type}`).appendChild(itemElem);
}


/**
 * Clear all inventory items from DOM
 * @name clearInventory
 * @returns void
 */
function clearInventory() {
	document.querySelectorAll('.inventory-item').forEach(item => {
		item.remove();
	});
}


/**
 * Loop through stored inventories
 */
function updateInventory() {
	clearInventory();
	updateInventoryStorage();

	for(const [id, inventory] of Object.entries(inventories)) {
		for(const [itemId, itemObject] of Object.entries(inventory.items)) {
			// Create item element and add it to it's parent inventory
			setItemInventory(id, createItemElement(itemId, itemObject));
		}
	}
}


/**
 * Setup item click event handler
 * @name initItemListener
 */
function initItemListener() {
	document.addEventListener('click', function(e) {
		e.preventDefault();		
		if(!chestNearby) return;

		if(e.target.classList.contains('inventory-item')) {
			if(e.target.parentElement.classList.contains('inventory-backpack')) {
				moveItemFromTo('backpack', 'chest', e.target.id, keysPressed['Shift'] ? -1 : 1);
				return;
			} else {
				moveItemFromTo('chest', 'backpack', e.target.id, keysPressed['Shift'] ? -1 : 1);
				return;
			}
		}
	});

	document.querySelector('#closeInventory').addEventListener('click', function(e) {
		e.preventDefault();
		toggleInventory();
	});
}


/**
 * Function for toggling inventory visibility
 * @name toggleInventory
 */
function toggleInventory() {
	inventoryOpen = !inventoryOpen;

	document.querySelector('.inventory').classList.toggle('inventory-active');
	if(inventoryOpen && chestNearby) {
		chest.classList.add('chest-open');
	} else {
		chest.classList.remove('chest-open');
	} 
}


/**
 * Function for handling nearby chest activity 
 * @name handleChestTooltip
 */
function handleChestTooltip(inRange) {
	if(inRange) {
		inventoryChestSide.classList.add('chest-nearby');
		chestNearby = true;
	} else {
		inventoryChestSide.classList.remove('chest-nearby');
		chestNearby = false;
	}
}