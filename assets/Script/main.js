
cc.Class({
    extends: cc.Component,

    properties: {
        back: cc.Sprite,
        player: cc.Node,
        ballPrefab: cc.Prefab,
        force: 300,
        scoreLab: cc.Label,
        timeLabel: cc.Label,

        _playerPos: null,
        _score: 0,
        _time: 10,
        _isValue: true,
        _isStart: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

        cc.director.getPhysicsManager().enabled = true;

        this._isValue = true;
        this._isStart = false;
        this._playerPos = this.player.position;
        this._time = 10;

        this.addTouchListener();
        this.schedule(this.updateTime,1);

        this.readyAnimation();
    },

    addTouchListener: function(){
        this.back.node.on("touchstart",this.onTouchStart,this);
    },

    onTouchStart: function(event){


        if ( !this._isStart ){
            return;
        }

        var location = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos = cc.v2( location.x, location.y);
        cc.log(pos);

        var playerPos = this.player.position;
        cc.log(playerPos);

        pos = pos.sub( playerPos );

        var vec = pos.normalize();

        var playerAni = this.player.getComponent(cc.Animation);
        playerAni.play();

        this.newBall(vec);
    },

    readyAnimation: function(){
        var node = new cc.Node("hpText");
        var label = node.addComponent(cc.Label);
        this.node.addChild(node);
        node.x = 0;
        node.y = 0;
        node.color = new cc.Color(255, 255, 255);
        label.fontSize = 50;
        label.string = "预 备";
        label.lineHeight = 50;

        node.scale = 0.1;

        var self = this;
        node.runAction(cc.sequence(cc.scaleTo(0.5,1.5,1.5),cc.delayTime(0.5),cc.callFunc(function(node){
            node.scale = 0.1;
            node.getComponent(cc.Label).string = "开 始"
        }) ,cc.scaleTo(0.5,1.5,1.5), cc.delayTime(1), cc.callFunc(function(node){
            node.destroy();
            self._isStart = true;
        })));
    },

    newBall: function(vec){
        var playScale = this.player.scale;
        var playWidth = this.player.width;
        var playHeight = this.player.height;
        cc.log(playScale);
        cc.log(playWidth);
        cc.log(playHeight);

        var ball = cc.instantiate(this.ballPrefab);
        ball.position = cc.p(this.player.x + playWidth*(playScale-0.2),this.player.y+playHeight*playScale+30);
        this.node.addChild(ball);
        ball.getComponent("ball").init(this);

        ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(vec.x*this.force,vec.y*this.force);
    },

    addScore: function(score){
        if ( !this._isValue ){
            return;
        }
        this._score += score;
        this.scoreLab.string = "得分: " + this._score;
    },

    updateTime: function(dt){
        if ( !this._isStart ) return;
        if ( this._time > 0 ){
            this._time--;
            this.timeLabel.string = "时间: "+this._time;
        }else{
            this._isValue = false;
            this.unschedule(this.updateTime);
            this.addEndUI();
        }
    },

    addEndUI: function(){
        var self = this;
        cc.Loader.loadRes("prefab/UI/defen",function(err,prefab){
            if (!err){
                return;
            }

            var defen = cc.instantiate(prefab);
            this.addChild(defen);
        })
    }

    // update (dt) {},
});
