import player from "./playerScript.js";
import {
    monsterList
} from "./monsterlist.js";

const playerObj = new player();

/// labels 
var moneyLabel = document.getElementById('money');
var weaponLabel = document.getElementById('weapon');
var armorLabel = document.getElementById('armor');
var healthLabel = document.getElementById('health');
var staminaLabel = document.getElementById('stamina');
var weaponDmgLabel = document.getElementById('weapDmg');
var dmgReductLabel = document.getElementById('dmgReduction');
var noStaminaLabel = document.getElementById('noStamina');
var opponentLabel = document.getElementById('opponent');
var opponentHealthLabel = document.getElementById('opponentHealth');
var outcomeLabel = document.getElementById('outcome');

var monkeyBtn = document.getElementById('monkey');
var lionBtn = document.getElementById('lion');
var sharkBtn = document.getElementById('shark');
var humanBtn = document.getElementById('human');
var alienBtn = document.getElementById('alien');

//buttons to initiate the fight 
monkeyBtn.addEventListener('click', battleSim);
sharkBtn.addEventListener('click', battleSim);
lionBtn.addEventListener('click', battleSim);
humanBtn.addEventListener('click', battleSim);
alienBtn.addEventListener('click', battleSim);

/*we have prevent the user from clicking the same button twice, we need to do that for all of the other buttons
we need to have some type of indicator that we are current battle a monster
*/
const buttons = document.getElementsByTagName("button");



async function battleSim(event) {

    let stamina = playerObj.getStamina();
    let enemyName = event.target.attributes.value.nodeValue;
    let enemyStats;
    let enemyAttack;
    let pLabel = document.getElementById('pAttack');
    let eLabel = document.getElementById('eAttack');
    let playerHealth = playerObj.getHealth();
    let battleStatsCon = document.getElementById('battleStats');
    //getting the current since the current health is already set from the window 

    let money = playerObj.getMoney(); // getting the current money 
    let enemyDefaultHealth;

    //BATTLE PREP
    //NAME OF THE MONSTER AND HEALTH OF THE MONSTER 
    opponentLabel.innerText = enemyName;

    for (let i = 0; i < monsterList.length; i++) {
        if (enemyName == monsterList[i].enemyName) {
            enemyStats = monsterList[i];
            break;
        }
    }
    opponentHealthLabel.innerText = enemyStats.health;
    enemyDefaultHealth = enemyStats.health;

    if (stamina > 0) { //prevent the player from battling if there is no stamina

        battleStatsCon.removeAttribute('class'); //will display the battle report screen
        for (const button of buttons) {
            button.disabled = true;
        }
        /** disable all of the buttons during a battle, one battle at a time, once the battle is over all of the buttons are 
          accessible again */

        // this will cycle through the battle and will stop if the player health is not greater than 0
        //same goes for the monster health as well
        ///simulate the battle between the player and enemy 
        while (playerHealth > 0 && enemyStats.health > 0) {
            enemyAttack = Math.floor(Math.random() * 3) ///0 = normal attack 1 = critical hit 2 enemy missed
            var data = await attackInfoDisplay(enemyAttack, playerObj, enemyStats);
            playerObj.setHealth(data.playerHealth);

            opponentHealthLabel.innerText = data.enemyHealth;
            healthLabel.innerText = data.playerHealth;


            enemyStats.health = data.enemyHealth;
            playerHealth = data.playerHealth;



            eLabel.innerText = data.enemyStatement;
            pLabel.innerText = data.playerStatement;

            /*the elabel and plabel are displaying the battle information on what is happening
            this is issue is fixed but i want to at least mentioned it, when the player health was negative, the battle 
            kept progressing until the enemy was dead. 

        it seems that i didn't update the player health that was apart of the while condition, the data was set to the 
        player class, but i wasn't updating the player health variable, the labels will show that the player is dead but, 
        is continuing to battle the enemy at hand. 
        i updated the enemy health as well just in case 
            */

        }

    } else {
        noStaminaLabel.removeAttribute('class');
        noStaminaLabel.innerText = `you don't have any stamina to fight, please go sleep to regain stamina!`
        setTimeout(() => {
            battleStatsCon.setAttribute('class', "hideStamina");
            noStaminaLabel.innerText = "";
            event.target.disabled = false;
        }, 1500); //small time 1.5 seconds, i think 
    }


    eLabel.innerText = "";
    pLabel.innerText = "";
    ///introduce the clean up labels and reseting the enemy's health 
    //granting player's gold as a reward 
    if (playerHealth > enemyStats.health && stamina > 0) {

        stamina = stamina - 1;
        money = money + enemyStats.money;

        playerObj.setMoney(money);
        playerObj.setStamina(stamina);
        localStorage.setItem('money', money); ///save the money just in case the player decides to leave battleground
        localStorage.setItem('health', playerHealth);
        localStorage.setItem('stamina', stamina);
        enemyStats.health = enemyDefaultHealth; // reseting the enemy's health back
        outcomeLabel.innerText = `you have defeated ${enemyStats.enemyName} and you earned ${enemyStats.money} gold. Cleaning up the battleground please wait.......`;
        moneyLabel.innerText = money;
        staminaLabel.innerText = stamina;
        setTimeout(() => {
            battleStatsCon.setAttribute('class', "hideBattleStats");
            outcomeLabel.innerText = "";
            for (const button of buttons) {
                button.disabled = false;
            } //makes the button accessible again
        }, 3000);
    } else if (enemyStats.health > playerHealth && stamina > 0) {
        ;
        outcomeLabel.innerText = `you have defeated ${enemyStats.enemyName}, teleporting you back home.........`
        stamina = stamina - 1;
        staminaLabel.innerText = stamina;
        playerObj.setStamina(stamina);
        localStorage.setItem('stamina', stamina); //save just in case the player leaves 
        playerHealth = 0;
        healthLabel = 0;
        localStorage.setItem('health', 0);
        setTimeout(() => {
            battleStatsCon.setAttribute('class', "hideBattleStats");
            outcomeLabel.innerText = "";
            for (const button of buttons) {
                button.disabled = false;
            } //makes the button accessible again
            window.history.back(); //this should take me back to the home screen
        }, 3000); //3 second  

    }





    ///THE QUESTION IS WHERE SHOULD I CHECK IF THE PLAYER HAS THE STAMINA OR NOT BEFORE OR AFTER THE BATTLE
    //WHERE SHOULD I START SUBSTRACTING THE STAMINA 

};

// this handles the attack phase 
function attackInfoDisplay(attack, playerObj, enemyStats) {
    let playerHealth = playerObj.getHealth();
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            if (attack == 0) {
                playerHealth = playerHealth - enemyStats.damage;
                enemyStats.health = enemyStats.health - playerObj.getWeaponDmg();
                resolve({
                    playerHealth: playerHealth,
                    enemyHealth: enemyStats.health,
                    enemyStatement: `${enemyStats.enemyName} has dealt ${enemyStats.damage}`,
                    playerStatement: `player has dealt ${playerObj.getWeaponDmg()} damage`
                });
            } else if (attack == 1) {
                playerHealth = playerHealth - enemyStats.damage;
                enemyStats.health = enemyStats.health - playerObj.getWeaponDmg();
                resolve({
                    playerHealth: playerHealth,
                    enemyHealth: enemyStats.health,
                    enemyStatement: `${enemyStats.enemyName} dealt a critical attack!!!  + ${enemyStats.criticalHit}`,
                    playerStatement: `player has dealt ${playerObj.getWeaponDmg()} damage`
                });
            } else if (attack == 2) {
                resolve({
                    playerHealth: playerHealth,
                    enemyHealth: enemyStats.health,
                    enemyStatement: `${enemyStats.enemyName} has missed `,
                    playerStatement: `No damage taken`
                });
            }
        }, 2000);
    });


};





window.onload = updateBattleDisplay;
//Modify this to take account of the health and stamina diff
function updateBattleDisplay() {
    //NOTE TO SELF TRANSFER THE LOGIC INTO A SEPARATE FUNCTIONS, LOOKS CLEANER AND MORE MANAGEABLE 
    //grab the data from the localstorage to and update the UI
    let getMoney = localStorage.getItem('money');
    let getWeapon = localStorage.getItem('weapons');
    let getArmor = localStorage.getItem('armor');
    let getHealth = localStorage.getItem('health');
    let getStamina = localStorage.getItem('stamina');
    let parseMoney = JSON.parse(getMoney);
    let parseWeapon = JSON.parse(getWeapon);
    let parseArmor = JSON.parse(getArmor);
    let parseHealth = JSON.parse(getHealth);
    let parseStamina = JSON.parse(getStamina);
    let textURL = document.referrer; //get the previous location from the browser
    let homeURL = textURL.search('/home');

    //checking to see if the user has come back from the store
    if (homeURL != -1) {
        if (getMoney != null && getWeapon != null && getArmor != null && getHealth != null & getStamina != null) {
            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {

                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        playerObj.setWeaponDmg(parseWeapon[i].weaponDmg);
                        playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                        moneyLabel.innerText = playerObj.getMoney();
                        weaponLabel.innerText = playerObj.getWeapon();
                        armorLabel.innerText = playerObj.getArmor();
                        healthLabel.innerText = playerObj.getHealth();
                        staminaLabel.innerText = playerObj.getStamina();
                        weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                        dmgReductLabel.innerText = playerObj.getArmorReduction();
                        break;
                    }
                }
            }
        } else if (getMoney != null && getWeapon != null && getHealth != null && getStamina != null) {

            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    playerObj.setWeaponDmg(parseWeapon[i].weaponDmg)
                    moneyLabel.innerText = playerObj.getMoney();
                    weaponLabel.innerText = playerObj.getWeapon();
                    healthLabel.innerText = playerObj.getHealth();
                    staminaLabel.innerText = playerObj.getStamina();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    armorLabel.innerText = playerObj.getArmor();
                    break;
                }
            }
        } else if (getMoney != null && getArmor != null && getHealth != null && getStamina != null) {

            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                    moneyLabel.innerText = playerObj.getMoney();
                    armorLabel.innerText = playerObj.getArmor();
                    healthLabel.innerText = playerObj.getHealth();
                    staminaLabel.innerText = playerObj.getStamina();
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    weaponLabel.innerText = playerObj.getWeapon();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                    break;
                }
            }

        } else if (getMoney != null && getStamina != null && getHealth != null) {
            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            moneyLabel.innerText = playerObj.getMoney();
            healthLabel.innerText = playerObj.getHealth();
            staminaLabel.innerText = playerObj.getStamina();
            weaponDmgLabel.innerText = playerObj.getWeaponDmg();
            dmgReductLabel.innerText = playerObj.getArmorReduction();
            weaponLabel.innerText = playerObj.getWeapon();
            armorLabel.innerText = playerObj.getArmor();
            /**This else if statement is for if the player has enough money to buy both a cheap weapon and armor  */
        } else if (getMoney != null && getWeapon != null && getArmor != null) { ///////
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        playerObj.setWeaponDmg(parseWeapon[i].weaponDmg);
                        playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                        moneyLabel.innerText = playerObj.getMoney();
                        weaponLabel.innerText = playerObj.getWeapon();
                        armorLabel.innerText = playerObj.getArmor();
                        healthLabel.innerText = playerObj.getHealth();
                        staminaLabel.innerText = playerObj.getStamina();
                        weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                        dmgReductLabel.innerText = playerObj.getArmorReduction();
                        break;
                    }
                }
            }
            /**these two last else if statements deals with the fact if the player wants to buy armor or 
             * weapon without fighting, losing health or stamina, this is based on the initial amount of gold i 
             * provide the players */
        } else if (getMoney != null && getWeapon != null) {
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    playerObj.setWeaponDmg(parseWeapon[i].weaponDmg)
                    moneyLabel.innerText = playerObj.getMoney();
                    weaponLabel.innerText = playerObj.getWeapon();
                    healthLabel.innerText = playerObj.getHealth();
                    staminaLabel.innerText = playerObj.getStamina();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    armorLabel.innerText = playerObj.getArmor();
                    break;
                }
            }

        } else if (getMoney != null && getArmor != null) {
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                    moneyLabel.innerText = playerObj.getMoney();
                    armorLabel.innerText = playerObj.getArmor();
                    healthLabel.innerText = playerObj.getHealth();
                    staminaLabel.innerText = playerObj.getStamina();
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    weaponLabel.innerText = playerObj.getWeapon();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();

                    break;
                }
            }

        } else {
            //assuming that the player has not bought anything yet. 
            moneyLabel.innerText = playerObj.getMoney();
            armorLabel.innerText = playerObj.getArmor();
            weaponLabel.innerText = playerObj.getWeapon();
            healthLabel.innerText = playerObj.getHealth();
            staminaLabel.innerText = playerObj.getStamina();
            weaponDmgLabel.innerText = playerObj.getWeaponDmg();

        }



    } else {
        /**The reason for this statement is that what if the player types in the background link from the store page
                the data will not load if coming from the store instead of the home link.  */
        if (getMoney != null && getWeapon != null && getArmor != null && getHealth != null & getStamina != null) {
            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                        playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        playerObj.setWeaponDmg(parseWeapon[i].weaponDmg);
                        moneyLabel.innerText = playerObj.getMoney();
                        weaponLabel.innerText = playerObj.getWeapon();
                        armorLabel.innerText = playerObj.getArmor();
                        healthLabel.innerText = playerObj.getHealth();
                        staminaLabel.innerText = playerObj.getStamina();
                        weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                        dmgReductLabel.innerText = playerObj.getArmorReduction();
                        break;
                    }
                }
            }
            /** this is when people start to manual input the link inside the url bar instead of using the actual links */
        } else if (getMoney != null && getWeapon != null && getHealth != null && getStamina != null) {

            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    playerObj.setWeaponDmg(parseWeapon[i].weaponDmg)
                    moneyLabel.innerText = playerObj.getMoney();
                    weaponLabel.innerText = playerObj.getWeapon();
                    healthLabel.innerText = playerObj.getHealth();
                    staminaLabel.innerText = playerObj.getStamina();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    break;
                }
            }
        } else if (getMoney != null && getArmor != null && getHealth != null && getStamina != null) {

            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                    moneyLabel.innerText = playerObj.getMoney();
                    armorLabel.innerText = playerObj.getArmor();
                    healthLabel.innerText = playerObj.getHealth();
                    staminaLabel.innerText = playerObj.getStamina();
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    weaponLabel.innerText = playerObj.getWeapon();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                    break;
                }
            }
            /**if statement for money health stamina  */
        } else if (getMoney != null && getStamina != null && getHealth != null) {
            playerObj.setMoney(parseMoney);
            playerObj.setHealth(parseHealth);
            playerObj.setStamina(parseStamina);
            moneyLabel.innerText = playerObj.getMoney();
            healthLabel.innerText = playerObj.getHealth();
            staminaLabel.innerText = playerObj.getStamina();
            dmgReductLabel.innerText = playerObj.getArmorReduction();
            weaponLabel.innerText = playerObj.getWeapon();
            weaponDmgLabel.innerText = playerObj.getWeaponDmg();
            armorLabel.innerText = playerObj.getArmor();


            /**person has bought a armor with their starter gold  */
        } else if (getMoney != null && getWeapon != null && getArmor != null) { ///////
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        playerObj.setWeaponDmg(parseWeapon[i].weaponDmg);
                        playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                        moneyLabel.innerText = playerObj.getMoney();
                        weaponLabel.innerText = playerObj.getWeapon();
                        armorLabel.innerText = playerObj.getArmor();
                        healthLabel.innerText = playerObj.getHealth();
                        staminaLabel.innerText = playerObj.getStamina();
                        weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                        dmgReductLabel.innerText = playerObj.getArmorReduction();
                        break;
                    }
                }
            }
        } else if (getMoney != null && getArmor != null) {
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    playerObj.setArmorReduction(parseArmor[i].dmgReduct);
                    moneyLabel.innerText = playerObj.getMoney();
                    armorLabel.innerText = playerObj.getArmor();
                    healthLabel.innerText = playerObj.getHealth(); //default health 
                    staminaLabel.innerText = playerObj.getStamina(); //default stamina 
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    weaponLabel.innerText = playerObj.getWeapon();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                    break;
                }
            }
            /**person has bought a weapon with their starter gold  */
        } else if (getMoney != null && getWeapon != null) {

            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    playerObj.setWeaponDmg(parseWeapon[i].weaponDmg)
                    moneyLabel.innerText = playerObj.getMoney();
                    weaponLabel.innerText = playerObj.getWeapon();
                    healthLabel.innerText = playerObj.getHealth();
                    staminaLabel.innerText = playerObj.getStamina();
                    weaponDmgLabel.innerText = playerObj.getWeaponDmg();
                    dmgReductLabel.innerText = playerObj.getArmorReduction();
                    armorLabel.innerText = playerObj.getArmor();
                    break;
                }
            }


        } else {
            //assuming that the player has not bought anything yet. 
            //default values 
            moneyLabel.innerText = playerObj.getMoney();
            armorLabel.innerText = playerObj.getArmor();
            weaponLabel.innerText = playerObj.getWeapon();
            healthLabel.innerText = playerObj.getHealth();
            staminaLabel.innerText = playerObj.getStamina();
            weaponDmgLabel.innerText = playerObj.getWeaponDmg();
            dmgReductLabel.innerText = playerObj.getArmorReduction();

        }
    }
};


//PREVENTIVE MEASURES 
//IF PLAYER'S HEALTH GOES TO ZERO 
//SEND PLAYER HOME, CHECK THE PLAYER HEALTH, IF HEALTH < 0, START THE AUTOMATIC SLEEP
//THEN I WON'T NEED TO KEEP THE PLAYER FROM ENTERING THIS PAGE IF THEY HAVE LOW HEALTH
//THEY CAN ENTER THIS PAGE WITH NO STAMINA BUT THEY ARE NOT ABLE TO FIGHT 
/** ADD THE DAMAGE REDUCTION FROM THE ARMOR */