//Get/set the health //int
//Get/set the armor //string 
//Get/set the money //int
//Get/set the stamina //int 
//Get/set the weapon //string
//get/set the weapon dmg





export default class player {
    constructor() {
        this.health = 100;
        this.armor = "shirt";
        this.armorDamageReduction = 2;
        this.money = 20;
        this.stamina = 10;
        this.weapon = "stick";
        this.weaponDmg = 4;
    }
    //HEALTH
    getHealth() {
        return this.health;

    }
    setHealth(health) {
        this.health = health;
    }
    //ARMOR
    getArmor() {
        return this.armor;
    }
    setArmor(armor) {
        this.armor = armor;
    }
    //Money
    getMoney() {
        return this.money;
    }
    setMoney(money) {
        this.money = money;
    }
    //stamina
    getStamina() {
        return this.stamina;
    }
    setStamina(stamina) {
        this.stamina = stamina;
    }
    //weapon
    getWeapon() {
        return this.weapon;
    }
    setWeapon(weapon) {
        this.weapon = weapon;
    }
    // set damage 
    getWeaponDmg() {
        return this.weaponDmg;
    }
    setWeaponDmg(weapondmg) {
        this.weaponDmg = weapondmg;
    }
      // set damage 
      getArmorReduction() {
        return this.armorDamageReduction;
    }
    setArmorReduction(_armorDmgReduct) {
        this.armorDamageReduction = _armorDmgReduct;
    }

}