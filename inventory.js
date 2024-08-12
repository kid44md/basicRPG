// localStorage.setItem('armor', JSON.stringify(armorlist))
const getArmor = localStorage.getItem('armor');
const getWeapon = localStorage.getItem('weapons');
const parseArmor = JSON.parse(getArmor);
const parseWeapon = JSON.parse(getWeapon);
var weaponContainer = document.getElementById('weapon-container');
var armorContainer = document.getElementById('armor-container');

/**currently I am changing weapons from equip to unequip
 * at the same time updating the localstorage and setting the weapon/armor using the player class 
 * changeArmor and changeWeapon
 */
function changeArmor(event) {
    let getArmor = localStorage.getItem('armor');
    let parseArmor = JSON.parse(getArmor);
    //if leather is selected make leather the active equipment then make wool the inactive equipment 
    for (let i = 0; i < parseArmor.length; i++) {
        if (event.target.value == parseArmor[i].armor) {
            parseArmor[i].isActive = true;
            break;
        }
    }
    /**this will continue to loop while setting all non-equip to false */
    for (let i = 0; i < parseArmor.length; i++) {
        if (event.target.value != parseArmor[i].armor) {
            parseArmor[i].isActive = false;
        }
    }
    localStorage.setItem('armor', JSON.stringify(parseArmor));
    updateInventory(parseArmor, null);
};


function changeWeapon(event) {
   
    let getWeapon = localStorage.getItem('weapons');
    let parseWeapon = JSON.parse(getWeapon);
    //if leather is selected make leather the active equipment then make wool the inactive equipment 
    for (let i = 0; i < parseWeapon.length; i++) {
        if (event.target.value == parseWeapon[i].weapon) {
            parseWeapon[i].isActive = true;
            break;
        }
    }
    
    /**this will continue to loop while setting all non-equip to false */
    for (let i = 0; i < parseWeapon.length; i++) {
        if (event.target.value != parseWeapon[i].weapon) {
            parseWeapon[i].isActive = false;
        }
    }
    localStorage.setItem('weapons', JSON.stringify(parseWeapon));
    updateInventory(null, parseWeapon);
};

/*loop through an array from the local storage. create two variable to hold dynamic html and join them together.
then put the data inside the ul html to get the desired output. i placed a conditional ternary operator to display the button if the weapon is 
not current equipped*/

function updateInventory(parseArmor, parseWeapon) {
    if (parseArmor != null && parseWeapon != null) {
        armorContainer.innerHTML = "";
        weaponContainer.innerHTML = "";
        for (let i = 0; i < parseArmor.length; i++) {
            let data = `<li><strong>Armor is: </strong><span>${parseArmor[i].armor}</span></li>` +
                `<li><strong>Damage migitation is:</strong> <span>${parseArmor[i].dmgReduct}</span></li>`;

            let text = parseArmor[i].isActive ?
                `<li><strong>Currently equiped:</strong> <span>${parseArmor[i].isActive}</span></li>` :
                `<button id='equipNewArmor' value='${parseArmor[i].armor}'>Equip Armor</button>`;

            data = data + text;

            armorContainer.innerHTML = armorContainer.innerHTML + data;
        };

        for (let i = 0; i < parseWeapon.length; i++) {
            var d = `<li><strong>Armor is: </strong><span>${parseWeapon[i].weapon}</span></li>` +
                `<li><strong>Damage migitation is:</strong> <span>${parseWeapon[i].weaponDmg}</span></li>`;

            var t = parseWeapon[i].isActive ?
                `<li><strong>Currently equiped:</strong> <span>${parseWeapon[i].isActive}</span></li>` :
                `<button id='NewWeapon' value='${parseWeapon[i].weapon}'>Equip Weapon</button>`;

            d = d + t;

            weaponContainer.innerHTML = weaponContainer.innerHTML + d;
        };


    } else if (parseArmor != null) {
        armorContainer.innerHTML = "";
        for (let i = 0; i < parseArmor.length; i++) {
            let data = `<li><strong>Armor is: </strong><span>${parseArmor[i].armor}</span></li>` +
                `<li><strong>Damage migitation is:</strong> <span>${parseArmor[i].dmgReduct}</span></li>`;

            let text = parseArmor[i].isActive ?
                `<li><strong>Currently equiped:</strong> <span>${parseArmor[i].isActive}</span></li>` :
                `<button id='equipNewArmor' value='${parseArmor[i].armor}'>Equip Armor</button>`;

            data = data + text;

            armorContainer.innerHTML = armorContainer.innerHTML + data;
        };

    } else if (parseWeapon != null) {
        weaponContainer.innerHTML = "";
        for (let i = 0; i < parseWeapon.length; i++) {
            var d = `<li><strong>Armor is: </strong><span>${parseWeapon[i].weapon}</span></li>` +
                `<li><strong>Damage migitation is:</strong> <span>${parseWeapon[i].weaponDmg}</span></li>`;

            var t = parseWeapon[i].isActive ?
                `<li><strong>Currently equiped:</strong> <span>${parseWeapon[i].isActive}</span></li>` :
                `<button id='NewWeapon' value='${parseWeapon[i].weapon}'>Equip Weapon</button>`;

            d = d + t;

            weaponContainer.innerHTML = weaponContainer.innerHTML + d;
        };

    }


/**calling the onload event when all of the html is on the page and that is ready to be used, our button are dynamically 
     * created not statically 
     */

onLoad();

};

updateInventory(parseArmor, parseWeapon);



/** the reason for putting these variables in the window.onload, is because if i don't put those variables in here
 * javascript will cause an error. 
 * once the page is fully loaded these variable will able useable 
 * 
 */

function onLoad() {
    var equipWeapBtn = document.getElementById('NewWeapon');
    var equipBtn = document.getElementById('equipNewArmor');
    equipBtn.addEventListener('click', changeArmor);
    equipWeapBtn.addEventListener('click', changeWeapon);
};



window.onload = onLoad;