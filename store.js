//import the player class
import player from "./playerScript.js";
//this is how you import an array
import {
    weapons
} from "./weaponlist.js";
import {
    armorList
} from "./armorlist.js";
const playerObj = new player();
//creating a weapon list



//weaponShop buttons
var openWepBtn = document.getElementById('openWeaponShop');
var closeWepBtn = document.getElementById('closeWeaponShop');
//weaponshop menu 
var weaponBox = document.getElementById('weaponBox');

//armor shop buttons
var openArmShop = document.getElementById('openArmorShop');
var closeArmShop = document.getElementById('closeArmorShop');
//armor shop menu 
var armorBox = document.getElementById('armorBox');

//adding event to the button listeners 
openWepBtn.addEventListener('click', toggleDisplay);
closeWepBtn.addEventListener('click', toggleDisplay);
openArmShop.addEventListener('click', toggleDisplay);
closeArmShop.addEventListener('click', toggleDisplay);

//armor button
var leatherBtn = document.getElementById('Leather');
var woolBtn = document.getElementById('Wool');
var steelBtn = document.getElementById('Steel');
var copperBtn = document.getElementById('Copper');
var adamBtn = document.getElementById('adam');

//event listener for the armor button
leatherBtn.addEventListener('click', checkoutArmor);
woolBtn.addEventListener('click', checkoutArmor);
steelBtn.addEventListener('click', checkoutArmor);
copperBtn.addEventListener('click', checkoutArmor);
adamBtn.addEventListener('click', checkoutArmor);


//labels
var armorLabel = document.getElementById('armor');
var moneyLabel = document.getElementById('money');
var weaponLabel = document.getElementById('weap');
var dmgReductLabel = document.getElementById('dmgReduction');
var weaponDmgLabel = document.getElementById('weapDmg');
//creating button listen to listen out for the user wants to buy from the store 
//weapon button
var batButton = document.getElementById('bat');
var crowbarButton = document.getElementById('crowbar');
var pistolButton = document.getElementById('pistol');
var shotgunButton = document.getElementById('shotgun');
var sniperButton = document.getElementById('sniper');


//button listeners to certain items on menu
batButton.addEventListener('click', checkoutWeapon);
crowbarButton.addEventListener('click', checkoutWeapon);
pistolButton.addEventListener('click', checkoutWeapon);
sniperButton.addEventListener('click', checkoutWeapon);
shotgunButton.addEventListener('click', checkoutWeapon);





//checkout handles the process of buying an item from the store
function checkoutWeapon(event) {
    let item = event.target.attributes.value.nodeValue; // grabing the item name 
    let purchaseText = document.getElementById('purchase'); // grabing the p element to give the user a status on the purchase
    let alreadyPurchasedText = document.getElementById('nonPurchase'); //grabing the p element to give the user a status on the purchase  
    let noMoney = document.getElementById('noMoney');
    let result = proccessWeaponItem(item, weapons); // this method will take in the item name and the weapon list created above
    //result will return us the results of the purchase, success or fail 
    if (result.data == "purchase") {
        purchaseText.innerText = "congratulation on purchasing the " + result.weapon;
        setTimeout(() => {
            purchaseText.innerText = "";
        }, 4000) ///clear the status box 

        updateWeaponUI(result.weapon, result.weaponDmg);
    } else if (result.data == false) {
        alreadyPurchasedText.innerText = "sorry you have already own this " + result.weapon;
        setTimeout(() => {
            alreadyPurchasedText.innerText = "";
        }, 4000) //clear the status box 

    } else if (result.afford == false) {
        noMoney.innerText = "sorry you don't have enough money to purchase " + result.weapon;
    }

}

//CHECK IF THE USER HAS ENOUGH MONEY TO PURCHASE THE ITEM IN QUESTION IN THE CHECKOUT/CHECKOUTARMOR
//checkout handles the process of buying an item from the store
function checkoutArmor(event) {
    let item = event.target.attributes.value.nodeValue; // grabing the item name 
    let purchaseText = document.getElementById('purchase'); // grabing the p element to give the user a status on the purchase
    let alreadyPurchasedText = document.getElementById('nonPurchase'); //grabing the p element to give the user a status on the purchase
    let noMoney = document.getElementById('noMoney');
    let result = proccessArmorItem(item, armorList); // this method will take in the item name and the weapon list created above
    //result will return us the results of the purchase, success or fail 
    if (result.data == "purchase") {
        purchaseText.innerText = "congratulation on purchasing the " + result.armor;
        setTimeout(() => {
            purchaseText.innerText = "";
        }, 4000) ///clear the status box 

        updateArmorUI(result.armor, result.dmgReduct);
    } else if (result.data == false) {
        alreadyPurchasedText.innerText = "sorry you have already own this " + result.armor;
        setTimeout(() => {
            alreadyPurchasedText.innerText = "";
        }, 4000) //clear the status box 

    } else if (result.afford == false) {
        noMoney.innerText = "sorry you don't have enough money to purchase the " + result.armor + " amor";
        setTimeout(() => {
            noMoney.innerText = "";
        }, 4000) //clear the status box 
    }

};




function proccessWeaponItem(_itemName, weapons) {
    let i;
    let localStorageWeapons = [];
    let money;
    let newArray;
    let data = localStorage.getItem('weapons');
    let currentPlayerMoney = playerObj.getMoney();
    for (i = 0; i < weapons.length; i++) {
        if (_itemName == weapons[i].weaponName) {
            if (weapons[i].isBought != true) {
                if (currentPlayerMoney >= weapons[i].weaponCost) {
                    money = playerObj.getMoney();
                    money = money - weapons[i].weaponCost;
                    playerObj.setMoney(money);
                    weapons[i].isBought = true; //if the player already bought this 
                    //since is being bought set to true 
                    weapons[i].isActive = true; //if this item is being used or not
                    //set isActive to be true, the player will have the item equiped 
                    //HUGE BUG BEING FIX WHEN YOU NAVIGATE THE WEBPAGE, LOCALSTORAGE GET OVERRIDDEN WITH NEW 
                    //DATA 
                    // create a if statement to see if the getItem('weapons') == null or not 
                    //if null proceed with regular functions 
                    //if not null getItem() the and push the new items into the weapon value
                    if (data != null) {
                        //use a new array to hold the data that is already inside of an array
                        newArray = JSON.parse(data);
                        newArray.push({
                            weapon: weapons[i].weaponName,
                            weaponDmg: weapons[i].weaponDmg,
                            isBought: weapons[i].isBought,
                            isActive: weapons[i].isActive
                        });
                        localStorage.setItem('weapons', JSON.stringify(newArray));
                        localStorage.setItem('money', money);
                        return {
                            data: "purchase",
                            weapon: weapons[i].weaponName,
                            weaponDmg: weapons[i].weaponDmg
                        };

                    } else {

                        //pushing player purchased items into storage
                        //isActive is a status that lets me know which item the player is using.
                        localStorageWeapons.push({
                            weapon: weapons[i].weaponName,
                            weaponDmg: weapons[i].weaponDmg,
                            isBought: weapons[i].isBought,
                            isActive: weapons[i].isActive
                        });
                        localStorage.setItem('weapons', JSON.stringify(localStorageWeapons));
                        localStorage.setItem('money', money);

                        return {
                            data: "purchase",
                            weapon: weapons[i].weaponName,
                            weaponDmg: weapons[i].weaponDmg
                        };
                    }
                } else {
                    //the current player doesn't have enough money to buy this item
                    return {
                        afford: false,
                        weapon: weapons[i].weaponName
                    };
                }

            } else {

                return {
                    data: false,
                    weapon: weapons[i].weaponName
                };
            }

        } // of _itemName == weapons[i].weaponName
    } // of for loop


};

//updating the UI after every purchase
function updateWeaponUI(_weapon, _weaponDmg) {
    let i;
    let getWeapon = localStorage.getItem('weapons');
    let data = JSON.parse(getWeapon);
    document.getElementById('money').innerText = playerObj.getMoney();
    playerObj.setWeapon(_weapon);
    playerObj.setWeaponDmg(_weaponDmg);
    weaponLabel.innerText = playerObj.getWeapon();
    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
    if (data != null) { // making the weapon that was bought the current weapon 
        for (i = 0; i < data.length; i++) {
            if (_weapon != data[i].weapon && data[i].isActive == true) {
                //i need to update the data/localstorage list 
                //the purchase weapon is the active weapon and every other weapon is not. 
                data[i].isActive = false;
                //insert the new value back into the localstorage of weapons
                localStorage.setItem('weapons', JSON.stringify(data));
            }
        }
    }
}

function updateArmorUI(_armor, _armorDmgReduct) {
    let i;
    let getArmor = localStorage.getItem('armor');
    let data = JSON.parse(getArmor);
    moneyLabel.innerText = playerObj.getMoney();
    playerObj.setArmor(_armor);
    playerObj.setArmorReduction(_armorDmgReduct);
    armorLabel.innerText = playerObj.getArmor();
    dmgReductLabel.innerText = playerObj.getArmorReduction();
    if (data != null) { // making the armor that was bought the current armor 
        for (i = 0; i < data.length; i++) {
            if (_armor != data[i].armor && data[i].isActive == true) {
                //i need to update the data/localstorage list 
                //the purchase armor is the active armor and every other armor is not. 
                data[i].isActive = false;
                //insert the new value back into the localstorage of weapons
                localStorage.setItem('armor', JSON.stringify(data));
            }
        }
    }
}

function proccessArmorItem(_itemName, armor) {
    let i;
    let localStorageWeapons = [];
    let money;
    let newArray;
    let data = localStorage.getItem('armor');
    let currentPlayerMoney = playerObj.getMoney();
    for (i = 0; i < armor.length; i++) {
        if (_itemName == armor[i].armorName) {
            if (armor[i].isBought != true) {

                if (currentPlayerMoney >= armor[i].Cost) {

                    money = playerObj.getMoney();
                    money = money - armor[i].Cost;
                    playerObj.setMoney(money);
                    armor[i].isBought = true; //if the player already bought this 
                    //since is being bought set to true 
                    armor[i].isActive = true; //if this item is being used or not
                    //set isActive to be true, the player will have the item equiped 

                    //HUGE BUG BEING FIX WHEN YOU NAVIGATE THE WEBPAGE, LOCALSTORAGE GET OVERRIDDEN WITH NEW 
                    //DATA 
                    // create a if statement to see if the getItem('weapons') == null or not 
                    //if null proceed with regular functions 
                    //if not null getItem() the and push the new items into the weapon value  
                    if (data != null) {
                        //use a new array to hold the data that is already inside of an array
                        newArray = JSON.parse(data);
                        newArray.push({
                            armor: armor[i].armorName,
                            dmgReduct: armor[i].dmgReduct,
                            isBought: armor[i].isBought,
                            isActive: armor[i].isActive
                        });
                        localStorage.setItem('armor', JSON.stringify(newArray));
                        localStorage.setItem('money', money);
                        return {
                            data: "purchase",
                            armor: armor[i].armorName,
                            dmgReduct: armor[i].dmgReduct
                        };

                    } else {
                        //pushing player purchased items into storage
                        //isActive is a status that lets me know which item the player is using.
                        localStorageWeapons.push({
                            armor: armor[i].armorName,
                            dmgReduct: armor[i].dmgReduct,
                            isBought: armor[i].isBought,
                            isActive: armor[i].isActive
                        });
                        localStorage.setItem('armor', JSON.stringify(localStorageWeapons));
                        localStorage.setItem('money', money);
                        return {
                            data: "purchase",
                            armor: armor[i].armorName,
                            dmgReduct: armor[i].dmgReduct
                        };

                    }
                } else {
                    //the current player doesn't have enough money to buy this item
                    return {
                        afford: false,
                        armor: armor[i].armorName
                    };
                }

            } else {
                return {
                    data: false,
                    armor: armor[i].armorName
                };
            }

        }

    }


};







//update local variables based onload
function updateWeapList(data) {
    let a;
    let b;
    //making sure that the right item is diplay to the user when the user returns to the store again 
    //making sure that certain items are already bought from the last time that they came to the store. 
    for (a = 0; a < data.length; a++) {
        for (b = 0; b < weapons.length; b++) {
            if (data[a].weapon == weapons[b].weaponName) {

                if (data[a].isBought) {
                    weapons[b].isBought = data[a].isBought;
                    if (data[a].isActive) {
                        weapons[b].isActive = data[a].isActive;
                    }
                }


            }
        }
    }
}

function updateArmorList(data) {
    let a;
    let b;
    for (a = 0; a < data.length; a++) {
        for (b = 0; b < armorList.length; b++) {
            if (data[a].armor == armorList[b].armorName) {
                if (data[a].isBought) {
                    armorList[b].isBought = data[a].isBought;
                    if (data[a].isActive) {
                        armorList[b].isActive = data[a].isActive;
                    }
                }
            }
        }
    }
}




function toggleDisplay(event) {

    //event.target.value = openWeaponShop
    if (event.target.value == "openWeaponShop") {
        weaponBox.removeAttribute('class'); //menu display 
        closeWepBtn.removeAttribute('class'); // close shop button display 
        openArmShop.setAttribute('class', 'closeStore'); //open button display are hidden
        openWepBtn.setAttribute('class', 'closeStore');
        // we don't need to add the close armor shop button because default it is hidden already 
        ///set attributes to the armor buttons
        // give it the feel of us enter a store
        //remove the attribute of closeWeaponShop (button)
        //event.target.value = closeWeaponShop
    } else if (event.target.value == "closeWeaponShop") { // back at the main menu for the shop 
        openWepBtn.removeAttribute('class'); //shop open shop button
        closeWepBtn.setAttribute('class', 'closeStore');
        weaponBox.setAttribute('class', 'closeStore');
        openArmShop.removeAttribute('class');
        //return us to the main menu 
        //both the shop for weapons/armor will be available 
        //close weapon/armor shop will be hidden or unavailable 
        //event.target.value = openArmorShop
    } else if (event.target.value == "openArmorShop") {
        //repeat the steps for open weapon shop
        armorBox.removeAttribute('class'); //menu display 
        closeArmShop.removeAttribute('class'); // close shop button display 
        openArmShop.setAttribute('class', 'closeStore'); //open button display are hidden
        openWepBtn.setAttribute('class', 'closeStore')
    } else if (event.target.value = "closeArmorShop") {
        //repeat the steps for the close weapon shop 

        openWepBtn.removeAttribute('class'); //shop open shop button
        closeArmShop.setAttribute('class', 'closeStore');
        armorBox.setAttribute('class', 'closeStore');
        openArmShop.removeAttribute('class');
    }
    //event.target.value = closeWeaponShop
    //event.target.value = openArmorShop
    //event.target.value = closeArmorShop

}



window.onload = loadShop;
//update the UI when the user enters the shop
//using localstorage as a place to store data 
//like in a video game 
function loadShop() {
    let getWeapon = localStorage.getItem('weapons');
    let getArmor = localStorage.getItem('armor');
    let getMoney = localStorage.getItem('money');

    let parseData = JSON.parse(getWeapon); //parse the data in array like format weapon
    let parseArmData = JSON.parse(getArmor); //parse the data in array like format armor
    //checking if the localstorage is null 

    if (getMoney != null && getWeapon != null && getArmor != null) {
        playerObj.setMoney(getMoney);
        moneyLabel.innerText = playerObj.getMoney();
        for (let i = 0; i < parseData.length; i++) {
            if (parseData[i].isActive) {
                playerObj.setWeapon(parseData[i].weapon);
                playerObj.setWeaponDmg(parseData[i].weaponDmg); //setting the active weapon on the player
                weaponLabel.innerText = playerObj.getWeapon();// showing the active weapon in your inventory
                weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                break;
            }
        }
        for (let i = 0; i < parseArmData.length; i++) {
            if (parseArmData[i].isActive) {
               
                playerObj.setArmor(parseArmData[i].armor); //setting the active armor on the player
                playerObj.setArmorReduction(parseArmData[i].dmgReduct);
                armorLabel.innerText = playerObj.getArmor(); // showing the active armor in your inventory
                dmgReductLabel.innerText = playerObj.getArmorReduction();
                break;
            }
        }
        updateWeapList(parseData);
        updateArmorList(parseArmData);
    } else if (getMoney != null && getWeapon != null) {
        playerObj.setMoney(getMoney);
        moneyLabel.innerText = playerObj.getMoney();
        for (let i = 0; i < parseData.length; i++) {
            if (parseData[i].isActive) {
                playerObj.setWeapon(parseData[i].weapon); //setting the active weapon on the player
                playerObj.setWeaponDmg(parseData[i].weaponDmg);
                weaponLabel.innerText = playerObj.getWeapon(); // showing the active weapon in your inventory
                weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                break;
            }
        }
        updateWeapList(parseData);
    } else if (getArmor != null && getMoney != null) {
        playerObj.setMoney(getMoney);
        document.getElementById('money').innerText = playerObj.getMoney();
        for ( let i = 0; i < parseArmData.length; i++) {
            if (parseArmData[i].isActive) {
              
                playerObj.setArmor(parseArmData[i].armor); //setting the active armor on the player
                playerObj.setArmorReduction(parseArmData[i].dmgReduct);
                armorLabel.innerText = playerObj.getArmor(); // showing the active armor in your inventory
                dmgReductLabel.innerText = playerObj.getArmorReduction();
                break;
            }
        }
        updateArmorList(parseArmData);
    } else if (getMoney != null) {
        playerObj.setMoney(getMoney);
        moneyLabel.innerText = playerObj.getMoney();//50
        armorLabel.innerText = playerObj.getArmor(); //shirt
        weaponLabel.innerText = playerObj.getWeapon(); //stick
        armorLabel.innerText = playerObj.getArmor();
        weaponDmgLabel.innerText = playerObj.getWeaponDmg();
        dmgReductLabel.innerText = playerObj.getArmorReduction();
    } else {
     
        ///non-update values default values
        moneyLabel.innerText = playerObj.getMoney(); //50
        armorLabel.innerText = playerObj.getArmor(); //shirt
        weaponLabel.innerText = playerObj.getWeapon(); //stick
        weaponDmgLabel.innerText = playerObj.getWeaponDmg();
        dmgReductLabel.innerText = playerObj.getArmorReduction();
    }

}

/**NOTE TO SELF START THE PLAYER OFF WITH AT LEAST 5 OR 10 GOLD */