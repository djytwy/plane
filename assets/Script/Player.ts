// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        // 获取到节点的动画组件
        var anim = this.getComponent(cc.Animation);
        // 获取到player的animState
        var animState = anim.play('player');
        // 设置为循环播放
        animState.wrapMode = cc.WrapMode.Loop;
        // 设置为无限循环
        animState.repeatCount = Infinity;
    }

    start () {

    }

    update (dt) {
        
    }
}
