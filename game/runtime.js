const fs = require("fs");
const uuid = require('uuid/v4');

const types = [
    'paladin',
    'swordsman',
    'mage'
];

const progress = [
    {
        required: 10,
        backgrounds: [
            'windows',
            'cave'
        ],
        enemies: [
           'spider',
           'alien'
        ],
        healthMin: 1000,
        healthMax: 1100
    },
    {
        required: 1,
        background: [
            'fire'
        ],
        enemies: [
           'small_domino'
        ],
        healthMin: 5000,
        healthMax: 6000
    },
    {
        required: 10,
        background: [
            'castle'
        ],
        enemies: [
            'worm',
            'alien',
            'spider',
        ],
        healthMin: 2000,
        healthMax: 2500
    }
];

const skills = [
    {
        'paladin': {
            0: {
                name: 'pummel',
                cooldown: 0,
                damage: 2,
            },
            1: {
                name: 'protect',
                cooldown: 20,
                damage: 0,
            },
        },
        'swordsman': {
            0: [
                {
                    name: 'slash',
                    cooldown: 0,
                    damage: 2
                },
            ],
            1: [
                {
                    name: 'cleave',
                    cooldown: 15,
                    damage: 70
                },
            ]
        },
        'mage': {
            0: [
                {
                    name: 'lightning bolt',
                    cooldown: 0,
                    damage: 1
                },
                {
                    name: 'heal',
                    cooldown: 10,
                    damage: -10
                },
            ],
            2: [
                {
                    name: 'fireball',
                    cooldown: 20,
                    damage: 50
                },
            ],
            3: [
                {
                    name: 'tornado',
                    cooldown: 15,
                    damage: 45
                },
            ]
        },
    }
];

class Runtime {
    constructor() {
        this.defaults();
        let runtime = this;
        fs.readFile('runtime.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            let json = JSON.parse(data);
            runtime.load(json);
            console.log("Loaded!");
        });
    }

    defaults() {
        this.players = [];
    }

    load(json) {
        if (json.players !== undefined) this.players = json.players;
    }

    save() {
        let json = JSON.stringify(this);
        fs.writeFile('runtime.json', json, 'utf8', function () {});
    }

    get(id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }

        return null;
    }

    quit(id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                this.players.splice(i, 1);
            }
        }
    }

    join(res, id, name = undefined, type = undefined) {
        if (id !== undefined) {
            let found = this.get(id);
            if (found) {
                console.log("NOTICE: Reconnected " + found.name);
                return found;
            }
        }

        if (typeof name != "string") {
            console.log("WARNING: Player name not a string!");
            res.clearCookie('id');
            res.redirect("/");
            return undefined;
        }

        if (name.length < 3) {
            console.log("WARNING: Player name not long enough!");
            res.clearCookie('id');
            res.redirect("/");
            return undefined;
        }

        if (!types.includes(type)) {
            console.log("WARNING: Player incorrect class!");
            res.clearCookie('id');
            res.redirect("/");
            return undefined;
        }

        let player = {
            id: uuid(),
            name: name.substring(0, 12),
            level: 1,
            clicks: 0,
            type: type
        };

        this.players.push(player);
        res.cookie('id', player.id);
        console.log("NOTICE: Connected " + player.name);

        return player;
    }
}

module.exports = Runtime;