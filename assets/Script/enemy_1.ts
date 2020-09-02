// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class Enemy_1 extends cc.Component {

    // 随机生成敌方一号飞机的最小时间
    @property
    minDuaration: number = 0;

    // 随机生成敌方一号飞机的最大时间
    @property
    maxDuaration: number = 0;

    @property({type: cc.Prefab})
    enemy1Prefab: cc.Prefab = null;

    @property({type: cc.PolygonCollider})
    collider: cc.PolygonCollider = null;

    // 1号敌机数量
    @property
    enemyNum: number = 1;

    // 敌机1的对象池
    public EnemyPool: cc.NodePool = null;

    // 1号敌方飞机的移动速度
    @property
    speed_enemy_1: number = 10;

    // game的实例
    game = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.renderEnemy1()
        let self = this
        const canvas = cc.find('Canvas');
        this.game = canvas.getComponent('Game');
        this.node.on('boom_1', function (EventCustom:cc.Event.EventCustom) {
            // 敌机被消灭
            EventCustom.target.stopAllActions();
            self.EnemyPool.put(EventCustom.target);
            self.game.gainScore();
        })
        this.node.on('player_over', function (customEvent:cc.Event.EventCustom) {
            // 播放player被消灭的动画
            const player = cc.find('Canvas/player');
            const anim = player.getComponent(cc.Animation);
            const animState = anim.play('play_over');
            anim.on('finished', self.playerAnimFinished, self);
        })
    }

    onDestroy () {
        this.node.off('boom_1');
        this.node.off('player_over');
    }

    // 装填敌机1的对象池，渲染生成的敌机1
    renderEnemy1 () {
        this.EnemyPool = new cc.NodePool();
        for (let i = 0; i < this.enemyNum; i++) {
            let enemy: cc.Node = cc.instantiate(this.enemy1Prefab);
            this.game = enemy.getComponent('game');
            this.EnemyPool.put(enemy);
        }
        this.schedule(this.genEnemy_1, 2);
    }

    genEnemy_1 () {
        // const scene = cc.director.getScene();
        console.log(this.EnemyPool.size())
        // 敌机数量由对象池控制
        if (this.EnemyPool.size() > 0) {
            let node = this.EnemyPool.get();
            let duaration = cc.winSize.height / this.speed_enemy_1;
            // 预制体的父应该都是最外层的场景
            node.parent = this.node;
            // 50是敌机的宽度,避免超出屏幕
            node.x = this.randomRange(-cc.winSize.width / 2 + 50, cc.winSize.width / 2 - 50);
            // 在屏幕上边缘生成敌机
            node.y = cc.winSize.height/2;
            let moveTo = cc.moveTo(duaration, cc.v2(node.x, -cc.winSize.height / 2));
            let _recycle = cc.callFunc(t => {
                if (node) {
                    this.EnemyPool.put(node);
                }
            }, this)
            let sequence = cc.sequence(moveTo, _recycle);
            node.runAction(sequence);
        }
    }

    // player被消灭的动画播放完毕
    playerAnimFinished () {
        const player = cc.find('Canvas/player');
        this.restartGame();
        // cc.director.loadScene('helloworld');
    }

    // 重新开始游戏
    restartGame () {
        this.game.playBtn.parent = cc.find('Canvas');
        this.game.playBtn.x = 0;
        this.game.playBtn.y = 0;
        const player = cc.find('Canvas/player');
        const canvas = cc.find('Canvas');
        canvas.removeChild(player);
        this.unscheduleAllCallbacks();
    }

    start () {

    }

    // update (dt) {}

    // 生成一个范围中的随机数
    randomRange (min: number, max: number) {
        let _length: number = max - min
        return min + _length * Math.random()
    }
}
