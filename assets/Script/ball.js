
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.getComponent(cc.RigidBody).awake = true;
    },

    init: function(main){
        this.mainScene = main;
    },

    //物理碰撞检测
    onBeginContact: function(contact,selfCollider,otherCollider){
        if ( otherCollider.node.group == "dimian" ){
            cc.log("未投中篮筐,再来一次");
            this.node.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(node){
                node.destroy();
            })));
        }
    },

    //碰撞检测
    onCollisionExit: function (other, self) {
        if ( other.node.group == "kuang" ){
            if ( other.node.y > self.node.y ){
                cc.log("球进网了");
                this.mainScene.addScore(1);
            }
        }
    },

    update: function(dt){
        // if ( Math.abs( this.node.x ) > cc.visibleRect.width / 2 || this.node.y < -cc.visibleRect.height / 2 ){
        //     this.node.destroy();
        //     // cc.log("destroy");
        // }
    }
});
