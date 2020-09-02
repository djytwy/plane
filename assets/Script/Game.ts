// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({type: cc.Node})
    bg1: cc.Node = null;

    @property({type: cc.Node})
    bg2: cc.Node = null;

    @property({type: cc.Node})
    player: cc.Node = null;

    @property({type: cc.Prefab})
    bulletPrefab: cc.Prefab = null;

    // 子弹的X偏移，用于发射多行的子弹
    @property
    offsetXBullet: number = 0;

    // 子弹发射的频率
    @property
    bulletRate: number = 1;

    @property
    bulletSpeed: number = 1000;

    // 子弹的对象池
    BulletPool: cc.NodePool = null;

    // 子弹的节点
    bulletNode: cc.Node = null;

    // 用于显示得分
    @property({type: cc.Label})
    scoreDisplay: cc.Label = null;

    // 初始化得分
    score = 0;

    // 预制件——重新开始（开始）按钮
    @property({type:cc.Prefab})
    prefabPlayBtn: cc.Prefab = null;

    // 预制件挂载的实例
    playBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        this.BulletPool = new cc.NodePool();
        this.move();
        this.renderBullet();
        // 初始化游戏结束按钮
        this.playBtn = cc.instantiate(this.prefabPlayBtn);
        this.playBtn.on(cc.Node.EventType.TOUCH_START, this.startGame, this);
        // 初始化得分
        this.score = 0;
        const enemy_1 = this.getComponent('enemy_1');
        enemy_1.game = this;
    }

    // 装填子弹对象池，并发射子弹
    renderBullet () {
        let bulletNum = 2;
        for (let i = 0; i < bulletNum; ++i) {
            let bullet = cc.instantiate(this.bulletPrefab); // 创建子弹的节点
            this.BulletPool.put(bullet);
        }
        this.schedule(this._emmit, this.bulletRate)
    }

    // 发射子弹的逻辑
    _emmit() {
        let node:cc.Node = null;
        if (this.BulletPool.size() > 0) {
            node = this.BulletPool.get()
        } else {
            node = cc.instantiate(this.bulletPrefab);
        }
        node.position = this.player.position;
        node.x += this.offsetXBullet;
        node.parent = this.player.parent;
        //计算子弹需要飞行的距离，飞行时间 = 距离 / 速度 (因为屏幕中心点坐标为（0，0）所以这里计算距离的时候需要除以2)
        let distance = ((cc.winSize.height) / 2 - this.player.y);
        let duration = distance / this.bulletSpeed;
        //使用moveBy动作，完成后删除子弹节点
        let finished = cc.callFunc((t) => {
            /* 
                重新加载的时候子弹可能还处于移动的状态，而这时新的对象池无法赋值进来，
                所以这里要判断一下子弹的对象池是否是null(初始值) 
            */
            if (this.BulletPool !== null) {
                this.BulletPool.put(node)
            } else {
                node.stopAllActions()
            }
        }, this);
        let moveBy = cc.moveBy(duration, cc.v2(0, distance));
        let sequence = cc.sequence(moveBy, finished);
        node.runAction(sequence);
    }


    start () {

    }

    move () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.player.x += event.getDelta().x
            this.player.y += event.getDelta().y
        }, this)
    }

    onDestroy () {
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        // node.stopAllActions();
    }

    update (dt) {
        this.bg2.y = this.bg2.y - 1;
        this.bg1.y = this.bg1.y - 1;
        if (this.bg1.y <= 0 - this.bg1.height) {
            this.bg1.y = this.bg1.height
        } else if (this.bg2.y <= 0 - this.bg2.height) {
            this.bg2.y = this.bg2.height
        }
    }

    // 得分
    gainScore () {
        this.score ++;
        this.scoreDisplay.string = this.score.toString();
    }

    // 开始游戏
    startGame () {
        this.unscheduleAllCallbacks();
        this.node.removeChild(this.playBtn);
        cc.director.loadScene("helloworld");
    }
}
