import player from "./playerScript.js";


//Home script
//display the user stats 

var playerObj = new player();
var healthUI = document.getElementById('health');
var armorUI = document.getElementById('armor');
var moneyUI = document.getElementById('money');
var staminaUI = document.getElementById('stamina');
var weaponUI = document.getElementById('weapon');
var sleepBtn = document.getElementById('sleep');
var sleepingStatus = document.getElementById('sleeping');
//coming from the store the weapon, money, and armor will or not be different, we need to update those 
//elements with the proper information instead of the default information


sleepBtn.addEventListener('click', sleeping)


function sleeping (event){
let playerHealth = playerObj.getHealth();
let playerStamina = playerObj.getStamina();
/**i want to prevent the player from using this button if their health is already at 100 or stamina is at 10   */

if( playerHealth != 100 && playerStamina != 10 ){
event.target.disabled = true;
sleepingStatus.innerText = `You are currently sleeping at the moment....please wait`;
setTimeout(()=>{
sleepingStatus.innerText = "";
localStorage.setItem('health', 100);
localStorage.setItem('stamina', 10);
playerObj.setHealth(100);
playerObj.setStamina(10);
healthUI.innerText = playerObj.getHealth();
staminaUI.innerText = playerObj.getStamina();
event.target.disabled = false;
}, 2000);
}else{
    sleepingStatus.innerText = `You can not sleep, currently you have max health and max stamina`;
}
};












window.onload = updateHomeDisplay;
//Modify this to take account of the health and stamina diff
function updateHomeDisplay() {
    //grab the data from the localstorage to and update the UI

/**these two variables are the default values inside the player class, i just want those values to be 
 * stored inside the localstorage on certain routes 
 */

   let defaultWeaponArray = [{
    weapon: "stick",
    weaponDmg: 4,
    isBought: true,
    isActive: true
}];

let defaultArmorArray = [{
    armor: "shirt",
    dmgReduct: 2,
    isBought: true,
    isActive: true

}];
    let getMoney = localStorage.getItem('money');
    
    let getWeapon = localStorage.getItem('weapons');
    let getArmor = localStorage.getItem('armor');
    let getHealth = localStorage.getItem('health');
    let getStamina = localStorage.getItem('stamina');
  
    let parseMoney = JSON.parse(getMoney);
    let parseWeapon = JSON.parse(getWeapon);
    let parseArmor = JSON.parse(getArmor);
    let parseStamina = JSON.parse(getStamina);
    let parseHealth = JSON.parse(getHealth);
    let textURL = document.referrer; //get the previous location from the browser
    let storeURL = textURL.search('/storepage'); //searching store page in the URL
    let homeURL = textURL.search('/home');
    let battlegroundURL = textURL.search('/battleground');
    
    //checking to see if the user has come back from the store
    if (storeURL != -1) {
         //NOTE TO SELF TRANSFER THE LOGIC INTO A SEPARATE FUNCTIONS, LOOKS CLEANER AND MORE MANAGEABLE
        if (getMoney != null && getWeapon != null && getArmor != null && getHealth != null && getStamina != null) { //catching the most restrictive values first
            dataControllerAWMSH(getArmor, getWeapon, getMoney, getHealth, getStamina);
        } else if (getMoney != null && getWeapon != null && getHealth != null && getStamina != null) {
            dataControllerWMSH(getWeapon, getMoney, getHealth, getStamina);
        } else if (getMoney != null && getArmor != null && getHealth != null && getStamina != null) {
            dataControllerAMSH(getArmor, getMoney, getHealth, getStamina);
            /**these last two statement are dealing with the condition of that a user can go to the store and just buy a weapon 
             * or armor without heading initially to battle or going to the store (else statement) and just seeing what is available and 
             * leaving (depending on if we give the user enough gold to establish their first purchase)
             */
        }else if (getMoney != null && getWeapon != null && getArmor != null){

            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                       
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        moneyUI.innerText = playerObj.getMoney();
                        weaponUI.innerText = playerObj.getWeapon();
                        armorUI.innerText = playerObj.getArmor();
                        staminaUI.innerText = playerObj.getStamina();
                        healthUI.innerText = playerObj.getHealth();
                        break;
                    }
                }
            }



        } else if (getMoney != null && getWeapon != null) {

            
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    moneyUI.innerText = playerObj.getMoney();
                    weaponUI.innerText = playerObj.getWeapon();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    armorUI.innerText = playerObj.getArmor();
                    break;
                }
            }


        } else if (getMoney != null && getArmor != null) {
           
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    moneyUI.innerText = playerObj.getMoney();
                    armorUI.innerText = playerObj.getArmor();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    weaponUI.innerText = playerObj.getWeapon();
                    break;
                }
            }

        } else {
            //went to the store and bought nothing
            moneyUI.innerText = playerObj.getMoney();
            armorUI.innerText = playerObj.getArmor();
            staminaUI.innerText = playerObj.getStamina();
            healthUI.innerText = playerObj.getHealth();
            weaponUI.innerText = playerObj.getWeapon();
        }
    } else if (homeURL != -1) {
       

        //TAKE IN ACCOUNT OF THE HEALTH STATUS AND STAMINA STATUS
        /**grab all of the value inside the localstorage for each items  */
        if (getMoney != null && getWeapon != null && getArmor != null && getHealth != null && getStamina != null) { //catching the most restrictive values first
           
            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                       
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        moneyUI.innerText = playerObj.getMoney();
                        weaponUI.innerText = playerObj.getWeapon();
                        armorUI.innerText = playerObj.getArmor();
                        staminaUI.innerText = playerObj.getStamina();
                        healthUI.innerText = playerObj.getHealth();
                        break;
                    }
                }
            }
            /**grab all of the value inside the localstorage for each items except weapons  */
        } else if (getMoney != null && getWeapon != null && getHealth != null && getStamina != null) {
           
            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    moneyUI.innerText = playerObj.getMoney();
                    weaponUI.innerText = playerObj.getWeapon();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    armorUI.innerText = playerObj.getArmor();
                    break;
                }
            }
            /**grab all of the value inside the localstorage for each items except armor  */
        } else if (getMoney != null && getArmor != null && getHealth != null && getStamina != null) {
           
            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    moneyUI.innerText = playerObj.getMoney();
                    armorUI.innerText = playerObj.getArmor();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    weaponUI.innerText = playerObj.getWeapon();
                    break;
                }
            }

        }else if (getMoney != null && getWeapon != null && getArmor != null){

            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                       
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        moneyUI.innerText = playerObj.getMoney();
                        weaponUI.innerText = playerObj.getWeapon();
                        armorUI.innerText = playerObj.getArmor();
                        staminaUI.innerText = playerObj.getStamina();
                        healthUI.innerText = playerObj.getHealth();
                        break;
                    }
                }
            }
        }else if (getMoney != null && getWeapon != null) {

           
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    moneyUI.innerText = playerObj.getMoney();
                    weaponUI.innerText = playerObj.getWeapon();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    armorUI.innerText = playerObj.getArmor();
                    break;
                }
            }


        }else if (getMoney != null && getArmor != null) {
          
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    moneyUI.innerText = playerObj.getMoney();
                    armorUI.innerText = playerObj.getArmor();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    weaponUI.innerText = playerObj.getWeapon();
                    break;
                }
            }

        }else{
            localStorage.setItem('weapons',JSON.stringify(defaultWeaponArray));
            localStorage.setItem('armor', JSON.stringify(defaultArmorArray));
            moneyUI.innerText = playerObj.getMoney();
            armorUI.innerText = playerObj.getArmor();
            staminaUI.innerText = playerObj.getStamina();
            healthUI.innerText = playerObj.getHealth();
            weaponUI.innerText = playerObj.getWeapon();
        }
    } else if (battlegroundURL != -1) {

        if (getMoney != null && getWeapon != null && getArmor != null && getHealth != null && getStamina != null) {
            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                       
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        moneyUI.innerText = playerObj.getMoney();
                        weaponUI.innerText = playerObj.getWeapon();
                        armorUI.innerText = playerObj.getArmor();
                        staminaUI.innerText = playerObj.getStamina();
                        healthUI.innerText = playerObj.getHealth();
                        break;
                    }
                }
            }





        } else if (getMoney != null && getWeapon != null && getHealth != null && getStamina != null) {
           

            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    moneyUI.innerText = playerObj.getMoney();
                    weaponUI.innerText = playerObj.getWeapon();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    armorUI.innerText = playerObj.getArmor(); //default value for armor 
                    break;
                }
            }


        } else if (getMoney != null && getArmor != null && getHealth != null && getStamina != null) {

           
            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    moneyUI.innerText = playerObj.getMoney();
                    armorUI.innerText = playerObj.getArmor();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    weaponUI.innerText = playerObj.getWeapon(); //default value for the weapon
                    break;
                }
            }

        }else if (getMoney != null && getHealth != null && getStamina != null) {
           

            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            moneyUI.innerText = playerObj.getMoney();
            weaponUI.innerText = playerObj.getWeapon();
            armorUI.innerText = playerObj.getArmor();
            staminaUI.innerText = playerObj.getStamina();
            healthUI.innerText = playerObj.getHealth();


        } else if (getMoney != null && getWeapon != null && getArmor != null){

            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                        
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        moneyUI.innerText = playerObj.getMoney();
                        weaponUI.innerText = playerObj.getWeapon();
                        armorUI.innerText = playerObj.getArmor();
                        staminaUI.innerText = playerObj.getStamina();
                        healthUI.innerText = playerObj.getHealth();
                        break;
                    }
                }
            }



        } else if (getMoney != null && getWeapon != null) {

            
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    moneyUI.innerText = playerObj.getMoney();
                    weaponUI.innerText = playerObj.getWeapon();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    armorUI.innerText = playerObj.getArmor();
                    break;
                }
            }


        }else if (getMoney != null && getArmor != null) {
           
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    moneyUI.innerText = playerObj.getMoney();
                    armorUI.innerText = playerObj.getArmor();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    weaponUI.innerText = playerObj.getWeapon();
                    break;
                }
            }

        }else {
            /**if have no values saved in the local storage, load the default values from the player class */
            moneyUI.innerText = playerObj.getMoney();
            armorUI.innerText = playerObj.getArmor();
            staminaUI.innerText = playerObj.getStamina();
            healthUI.innerText = playerObj.getHealth();
            weaponUI.innerText = playerObj.getWeapon();

        }







    } else {
        /**when a player decides to not use a link to navigate through the pages, we will perform the same 
         * procedure without the url as the condition 
         */
        if (getMoney != null && getWeapon != null && getArmor != null && getHealth != null && getStamina != null) {

          

            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                        
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        moneyUI.innerText = playerObj.getMoney();
                        weaponUI.innerText = playerObj.getWeapon();
                        armorUI.innerText = playerObj.getArmor();
                        staminaUI.innerText = playerObj.getStamina();
                        healthUI.innerText = playerObj.getHealth();
                        break;
                    }
                }
            }





        } else if (getMoney != null && getWeapon != null && getHealth != null && getStamina != null) {
            

            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    moneyUI.innerText = playerObj.getMoney();
                    weaponUI.innerText = playerObj.getWeapon();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    armorUI.innerText = playerObj.getArmor();
                    break;
                }
            }


        } else if (getMoney != null && getArmor != null && getHealth != null && getStamina != null) {

         
            playerObj.setMoney(parseMoney);
            playerObj.setStamina(parseStamina);
            playerObj.setHealth(parseHealth);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    moneyUI.innerText = playerObj.getMoney();
                    armorUI.innerText = playerObj.getArmor();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    weaponUI.innerText = playerObj.getWeapon(); //default value for the weapon
                    break;
                }
            }

        } else if (getMoney != null && getWeapon != null && getArmor != null){

            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                for (let a = 0; a < parseArmor.length; a++) {
                    if (parseArmor[a].isActive && parseWeapon[i].isActive) {
                       
                        playerObj.setWeapon(parseWeapon[i].weapon);
                        playerObj.setArmor(parseArmor[a].armor);
                        moneyUI.innerText = playerObj.getMoney();
                        weaponUI.innerText = playerObj.getWeapon();
                        armorUI.innerText = playerObj.getArmor();
                        staminaUI.innerText = playerObj.getStamina();
                        healthUI.innerText = playerObj.getHealth();
                        break;
                    }
                }
            }
        
        
        
        
        } else if (getMoney != null && getWeapon != null) {

            
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseWeapon.length; i++) {
                if (parseWeapon[i].isActive) {
                    playerObj.setWeapon(parseWeapon[i].weapon);
                    moneyUI.innerText = playerObj.getMoney();
                    weaponUI.innerText = playerObj.getWeapon();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    armorUI.innerText = playerObj.getArmor();
                    break;
                }
            }


        }else if (getMoney != null && getArmor != null) {
           
            playerObj.setMoney(parseMoney);
            for (let i = 0; i < parseArmor.length; i++) {
                if (parseArmor[i].isActive) {
                    playerObj.setArmor(parseArmor[i].armor);
                    moneyUI.innerText = playerObj.getMoney();
                    armorUI.innerText = playerObj.getArmor();
                    staminaUI.innerText = playerObj.getStamina();
                    healthUI.innerText = playerObj.getHealth();
                    weaponUI.innerText = playerObj.getWeapon();
                    break;
                }
            }

        }else {
            /**if have no values saved in the local storage, load the default values from the player class */
            localStorage.setItem('weapons',JSON.stringify(defaultWeaponArray));
            moneyUI.innerText = playerObj.getMoney();
            armorUI.innerText = playerObj.getArmor();
            staminaUI.innerText = playerObj.getStamina();
            healthUI.innerText = playerObj.getHealth();
            weaponUI.innerText = playerObj.getWeapon();
            
        }






    }





}

function dataControllerAWMSH(getArmor, getWeapon, getMoney, getHealth, getStamina) {
    let parseMoney = JSON.parse(getMoney);
    let parseWeapon = JSON.parse(getWeapon);
    let parseArmor = JSON.parse(getArmor);
    let parseStamina = JSON.parse(getStamina);
    let parseHealth = JSON.parse(getHealth);
    playerObj.setMoney(parseMoney);
    playerObj.setHealth(parseHealth);
    playerObj.setStamina(parseStamina);
    for (let i = 0; i < parseWeapon.length; i++) {
        for (let a = 0; a < parseArmor.length; a++) {
            if (parseArmor[a].isActive && parseWeapon[i].isActive) {
               
                playerObj.setWeapon(parseWeapon[i].weapon);
                playerObj.setArmor(parseArmor[a].armor);
                moneyUI.innerText = playerObj.getMoney();
                weaponUI.innerText = playerObj.getWeapon();
                staminaUI.innerText = playerObj.getStamina();
                healthUI.innerText = playerObj.getHealth();
                armorUI.innerText = playerObj.getArmor();
            }
        }
    }
}

function dataControllerWMSH(getWeapon, getMoney, getHealth, getStamina) {
    let parseMoney = JSON.parse(getMoney);
    let parseWeapon = JSON.parse(getWeapon);
    let parseStamina = JSON.parse(getStamina);
    let parseHealth = JSON.parse(getHealth);
    
    playerObj.setMoney(parseMoney);
    playerObj.setHealth(parseHealth);
    playerObj.setStamina(parseStamina);
    for (let i = 0; i < parseWeapon.length; i++) {
        if (parseWeapon[i].isActive) {
            playerObj.setWeapon(parseWeapon[i].weapon);
            moneyUI.innerText = playerObj.getMoney();
            weaponUI.innerText = playerObj.getWeapon();
            staminaUI.innerText = playerObj.getStamina();
            healthUI.innerText = playerObj.getHealth();
            armorUI.innerText = playerObj.getArmor();
            break;
        }
    }
}

function dataControllerAMSH(getArmor, getMoney, getHealth, getStamina) {
    let parseMoney = JSON.parse(getMoney);
    let parseArmor = JSON.parse(getArmor);
    let parseStamina = JSON.parse(getStamina);
    let parseHealth = JSON.parse(getHealth);
    
    playerObj.setMoney(parseMoney);
    playerObj.setHealth(parseHealth);
    playerObj.setStamina(parseStamina);
    for (let i = 0; i < parseArmor.length; i++) {
        if (parseArmor[i].isActive) {
            playerObj.setArmor(parseArmor[i].armor);
            moneyUI.innerText = playerObj.getMoney();
            weaponUI.innerText = playerObj.getWeapon();
            staminaUI.innerText = playerObj.getStamina();
            healthUI.innerText = playerObj.getHealth();
            armorUI.innerText = playerObj.getArmor();
            break;
        }
    }

}


/** TO DO LIST 
 * 
 * UPDATE THE UI WITH LOCAL STORAGE INFOR, HEALTH & STAMINA
 * CREATE THE SLEEP TO INSTANTLY RECOVER STAMINA/HEALTH 
 * NEXT ITERRATION MAKE IT TO WHERE THAT THEY NEED TO PAY TO SLEEP (TROLL) 
 */