// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class PreEnemy_1 extends cc.Component {

    // 敌机1的碰撞的标识符，避免动画没播放就回收敌机
    private enemy1CollisionFlag: Boolean = true;
    private enemy1_anim: cc.Animation = null;
    private enemy1_animState: cc.AnimationState = null;

    public onCollisionEnter (other, self) {
        if (other.node.group == 'bullet_1' && this.enemy1CollisionFlag) {
            this.enemy1CollisionFlag = false;
            // 获取到节点的动画组件
            // 触发事件(敌机被击中),emit的触发只能在这个脚本中使用，外层的监听获取不到
            this.enemy1_animState = this.enemy1_anim.play('over_enemy_1');
            this.enemy1_anim.on('finished', this.enemy1AnimFinished, this);
        } else if (other.node.group == 'player') {
            this.node.dispatchEvent(new cc.Event.EventCustom('player_over', true));
        }
    }

    // 敌机1被消灭的动画播放完毕
    private enemy1AnimFinished () {
        this.node.dispatchEvent( new cc.Event.EventCustom('boom_1', true));
        this.enemy1CollisionFlag = true;
        this.enemy1_animState.time = 0;
        this.enemy1_anim.sample('over_enemy_1');
        this.enemy1_anim.stop();
    }
    
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.enemy1_anim = this.getComponent(cc.Animation);
        this.node.parent = cc.find('Canvas/bg1');
    }

    start () {}

    // update (dt) {}
}
