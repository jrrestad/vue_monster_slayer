function  getRandomValue(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

const app = Vue.createApp({
    data () {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            battleLog: [],
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                //draw
                this.winner = "draw"
            } else if (value <= 0) {
                // player lost
                this.winner = 'monster'
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                //draw
                this.winner = "draw"
            } else if (value <= 0) {
                // monster lost
                this.winner = 'player'
            }
        },
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return {width: '0%'}
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return {width: '0%'}
            }
            return {width: this.playerHealth + '%'};
        },
        specialAttackAllowed() {
            return this.currentRound % 3 !== 0;
        },
        healAllowed() {
            return this.currentRound % 3 !== 0;
        },
    },
    methods: {
        attackEnemy() {
            var damage = getRandomValue(5, 12);
            this.monsterHealth -= damage;
            this.addBattleMsg('player', 'attack', damage)
            if (this.monsterHealth > 0) {
                this.enemyAttack()
            }
            this.currentRound++
        },
        enemyAttack() {
            var damage = getRandomValue(6, 13);
            this.playerHealth -= damage;
            this.addBattleMsg('monster', 'attack', damage)
        },
        playerSpecialAttack() {
            var damage = getRandomValue(7,14)
            this.monsterHealth -= damage;
            this.addBattleMsg('player', 'attack', damage)
            this.enemyAttack()
            this.currentRound++
        },
        playerHeal() {
            var heal = getRandomValue(7, 14)
            if (this.playerHealth + heal > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += heal
            }
            this.addBattleMsg('player', 'heal', heal)
            this.enemyAttack()
            this.currentRound++
        },
        surrender() {
            this.playerHealth = 0;
            this.winner = 'monster'
        },
        startOver() {
            this.currentRound = 0;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.battleLog = [];
        },
        addBattleMsg(who, what, value) {
            this.battleLog.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
            })
        }
    }
})

app.mount('#game')