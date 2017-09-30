cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

    onInit:function(parentNode){
        this.parent = parentNode;
        this.initGameBeginAni();
        this.initGameWinAni();
        this.initGameLoseAni();

        this.initGameCoinAni();
        this.initScoreAni();
        this.initBankerAni();
    },

    initGameBeginAni:function(){
        this.beginAniNode = this.node.getChildByName("beginAniNode");
        this.beginAniLeftNode = this.beginAniNode.getChildByName("gameBegin0");
        this.beginAniRightNode = this.beginAniNode.getChildByName("gameBegin1");
        this.lightLeftNode = this.beginAniNode.getChildByName("gameBegin2");
        this.lightRightNode = this.beginAniNode.getChildByName("gameBegin3");
        this.lightRotationNode = this.beginAniNode.getChildByName("gameBegin4");
        this.lightAniNode = this.beginAniNode.getChildByName("gameBegin5");
        this.lightAnimation = this.lightAniNode.getComponent("cc.Animation");

        this.beginNodeMask = this.beginAniNode.getChildByName("mask");

        this.resetGameBeginAni();
    },

    resetGameBeginAni:function(){
        console.log("resetGameBeginAni!!!!!!!!!!!!");
        this.beginAniLeftNode.x = -800;
        this.beginAniRightNode.x = 800;
        this.lightLeftNode.x = 0;
        this.lightRightNode.x = 0;

        this.lightRotationNode.x = 270;
        this.lightRotationNode.y = -50;
        this.lightRotationNode.scale = 2;
        this.lightRotationNode.active = false;
        this.lightRotationNode.stopAllActions();
        this.lightAniNode.active = false;
        this.lightAnimation.pause();

        this.beginAniLeftNode.stopAllActions();
        this.beginAniRightNode.stopAllActions();
        this.lightLeftNode.stopAllActions();
        this.lightRightNode.stopAllActions();

        this.lightLeftNode.active = false;
        this.lightRightNode.active = false;
        this.beginNodeMask.active = false;
        this.beginAniNode.active = false;
    },

    runGameBeginAni:function(){
        var self = this;

        var action1 = cc.moveBy(0.3, 800, 0);
        action1.easing(cc.easeIn(3.0));
        var action2 = cc.moveBy(0.3, -800, 0);
        action2.easing(cc.easeIn(3.0));

        var callFunc1 = cc.callFunc(function () {
            self.lightAniNode.active = true;
            self.lightAnimation.play();
        }, this);

        var callFunc2 = cc.callFunc(function () {
            // var action3 = cc.moveBy(0.3, -800, 0);
            // action3.easing(cc.easeIn (3.0));
            // var action4 = cc.moveBy(0.3, 800, 0);
            // action4.easing(cc.easeIn (3.0));

            self.lightLeftNode.active = true;
            self.lightRightNode.active = true;

            var callFunc3 = cc.callFunc(function () {
                self.beginAniLeftNode.runAction(cc.sequence(action2,cc.callFunc(function(){
                    self.beginAniNode.runAction(cc.sequence(cc.fadeOut(0.2),cc.callFunc(function(){
                        self.resetGameBeginAni();
                        console.log("self.resetGameBeginAni();!!!!!!!!!!!!");
                    })));
                })));
                self.beginAniRightNode.runAction(action1);
                self.lightRotationNode.active = false;
            }, this);

            self.lightLeftNode.runAction(cc.sequence(action2,callFunc3));
            self.lightRightNode.runAction(action1);
        }, this);

        this.beginAniLeftNode.runAction(action1);
        this.beginAniRightNode.runAction(cc.sequence(action2,callFunc1,cc.delayTime(0.5),callFunc2));

        self.lightRotationNode.active = true;
        self.lightRotationNode.opacity = 0;
        var action5 = cc.spawn(cc.moveTo(0.2,270,-50),cc.scaleTo(0.2,1));
        action5.easing(cc.easeIn(3.0));
        self.lightRotationNode.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(function(){
            self.lightRotationNode.opacity = 255;
        }),action5,cc.rotateBy(2.5,1080)));

        this.beginAniNode.opacity = 255;
        this.beginNodeMask.active = true;
        this.beginAniNode.active = true;
    },

    initGameWinAni:function(){
        this.winAniNode = this.node.getChildByName("winAniNode");
        this.winAniLeftNode = this.winAniNode.getChildByName("winLeft");
        this.winAniRightNode = this.winAniNode.getChildByName("winRight");
        this.winImg0 = this.winAniNode.getChildByName("win0");  //皇冠
        this.winImg1 = this.winAniNode.getChildByName("win1");  //左边的字
        this.winImg2 = this.winAniNode.getChildByName("win2");  //右边的字
        this.winLightLeft = this.winAniNode.getChildByName("win3"); //左边的光
        this.winLightRight = this.winAniNode.getChildByName("win4"); //左边的光

        this.winMask = this.winAniNode.getChildByName("mask");

        this.resetGameWinAni();
    },

    resetGameWinAni:function(){
        this.winImg0.y = 500;
        this.winImg1.x = -800;
        this.winImg2.x = 800;
        this.winLightLeft.x = -800;
        this.winLightRight.x = 800;
        this.winImg0.scale = 2;

        this.winAniNode.stopAllActions();
        this.winImg0.stopAllActions();
        this.winImg1.stopAllActions();
        this.winImg2.stopAllActions();

        this.winImg0.opacity = 255;
        this.winAniLeftNode.opacity = 255;
        this.winAniRightNode.opacity = 255;
        this.winMask.opacity = 107;
        this.winAniNode.opacity = 0;
        this.winAniNode.active = false;
    }, 

    runGameWinAni:function(){
        var self = this;

        this.winAniNode.active = true;

        var action1 = cc.moveBy(0.3, 720, 0);
        action1.easing(cc.easeIn(3.0));
        var action2 = cc.moveBy(0.3, -720, 0);
        action2.easing(cc.easeIn(3.0));

        var callFunc1 = cc.callFunc(function () {
            var callFunc2 = cc.callFunc(function () {
                var action3 = cc.moveBy(0.2,0,-355);
                action3.easing(cc.easeIn(3.0));

                self.winImg0.runAction(cc.sequence(cc.spawn(action3,cc.scaleTo(0.3,1)),cc.delayTime(0.7),cc.callFunc(function () {
                        self.winImg2.runAction(action1);
                        self.winImg1.runAction(action2);
                        self.winImg0.runAction(cc.fadeOut(0.3));
                        self.winMask.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function () {
                            self.resetGameWinAni();
                            console.log("self.resetGameWinAni();!!!!!!!!!!!!");
                        })));
                        self.winAniLeftNode.runAction(cc.fadeOut(0.3));
                        self.winAniRightNode.runAction(cc.fadeOut(0.3));
                })));

                var action4 = cc.moveBy(0.7, 2000, 0);
                action4.easing(cc.easeIn(3.0));
                var action5 = cc.moveBy(0.7, -2000, 0);
                action5.easing(cc.easeIn(3.0));
                self.winLightLeft.runAction(action4);
                self.winLightRight.runAction(action5);
            });
            self.winImg1.runAction(cc.sequence(action1,callFunc2));
            self.winImg2.runAction(action2);
        });
        this.winAniNode.runAction(cc.sequence(cc.fadeIn(0.2),callFunc1));
    },  

    initGameLoseAni:function(){
        this.loseAniNode = this.node.getChildByName("loseAniNode");
        this.loseAniLeftNode = this.loseAniNode.getChildByName("loseLeft");
        this.loseAniRightNode = this.loseAniNode.getChildByName("loseRight");
        this.loseImg0 = this.loseAniNode.getChildByName("lose0");  //皇冠
        this.loseImg1 = this.loseAniNode.getChildByName("lose1");  //左边的字
        this.loseImg2 = this.loseAniNode.getChildByName("lose2");  //右边的字
        this.loseLightLeft = this.loseAniNode.getChildByName("lose3"); //左边的光
        this.loseLightRight = this.loseAniNode.getChildByName("lose4"); //左边的光

        this.loseMask = this.loseAniNode.getChildByName("mask");

        this.resetGameLoseAni();
    },

    resetGameLoseAni:function(){
        this.loseImg1.x = -800;
        this.loseImg2.x = 800;
        this.loseLightLeft.x = -800;
        this.loseLightRight.x = 800;

        this.loseAniNode.stopAllActions();
        this.loseImg0.stopAllActions();
        this.loseImg1.stopAllActions();
        this.loseImg2.stopAllActions();

        this.loseImg0.opacity = 0;
        this.loseAniLeftNode.opacity = 255;
        this.loseAniRightNode.opacity = 255;
        this.loseMask.opacity = 107;
        this.loseAniNode.opacity = 0;
        this.loseAniNode.active = false;
    }, 

    runGameLoseAni:function(){
        var self = this;

        this.loseAniNode.active = true;

        var action1 = cc.moveBy(0.3, 720, 0);
        action1.easing(cc.easeIn(3.0));
        var action2 = cc.moveBy(0.3, -720, 0);
        action2.easing(cc.easeIn(3.0));

        var callFunc1 = cc.callFunc(function () {
            var callFunc2 = cc.callFunc(function () {
                self.loseImg0.runAction(cc.sequence(cc.fadeIn(0.3),cc.delayTime(0.5),cc.callFunc(function () {
                        self.loseImg2.runAction(action1);
                        self.loseImg1.runAction(action2);
                        self.loseImg0.runAction(cc.fadeOut(0.3));
                        self.loseMask.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function () {
                            self.resetGameLoseAni();
                            console.log("self.resetGameLoseAni();!!!!!!!!!!!!");
                        })));
                        self.loseAniLeftNode.runAction(cc.fadeOut(0.3));
                        self.loseAniRightNode.runAction(cc.fadeOut(0.3));
                })));

                // var action4 = cc.moveBy(0.7, 2000, 0);
                // action4.easing(cc.easeIn(3.0));
                // var action5 = cc.moveBy(0.7, -2000, 0);
                // action5.easing(cc.easeIn(3.0));
                // self.loseLightLeft.runAction(action4);
                // self.loseLightRight.runAction(action5);
            });
            self.loseImg1.runAction(cc.sequence(action1,callFunc2));
            self.loseImg2.runAction(action2);
        });
        this.loseAniNode.runAction(cc.sequence(cc.fadeIn(0.2),callFunc1));
    },  

    initGameCoinAni:function(){
        this.coinAniPos = {};
        this.coinAniPos[0] = {x:143,y:56};
        this.coinAniPos[1] = {x:1141,y:318};
        this.coinAniPos[2] = {x:915,y:630};
        this.coinAniPos[3] = {x:633,y:630};
        this.coinAniPos[4] = {x:350,y:630};
        this.coinAniPos[5] = {x:37,y:318};

        this.coinAniNode = this.node.getChildByName("coinAniNode");
        this.coinItemOri = this.coinAniNode.getChildByName("coinItem");
        this.coinList = this.coinAniNode.getChildByName("coinList");

        this.coinType = 0;  //0:gold;1:diamond;
        if(this.parent.consumeType == "diamond")
            this.coinType = 1;
        this.winHeadAniList = this.coinAniNode.getChildByName("winHeadAniList"); 
        this.winHeadAniNodeList = {};
        this.winHeadAnimationList = {};
        this.runWinAniList = {};
        for(var i=0;i<6;i++)
        {
            this.winHeadAniNodeList[i] = this.winHeadAniList.getChildByName("winHeadAni"+i);
            this.winHeadAnimationList[i] = this.winHeadAniNodeList[i].getComponent("cc.Animation");
            this.runWinAniList[i] = false;
        }
    },

    createCoinAni:function(fromChair,toChair,num){
        if(num < 0)
            num = -num;
        if(num > 10)
            num = 10;
        var curTime = 0.3;
        var curLength = cc.pDistance(cc.v2(this.coinAniPos[fromChair].x, this.coinAniPos[fromChair].Y), cc.v2(this.coinAniPos[toChair].x, this.coinAniPos[toChair].Y));
        // console.log("curLength===",curLength);
        curTime = curLength/70*0.3;
        // console.log("curTime=====",curTime);
        if(curTime>0.6)
            curTime = 0.6;
        
        for(var i=0;i<num;i++)
        {
            var newCoinItem = cc.instantiate(this.coinItemOri);
            if(this.coinType == 1)
                newCoinItem.scale = 0.4;
            else
                newCoinItem.scale = 0.5;
            this.coinList.addChild(newCoinItem);
            newCoinItem.x = this.coinAniPos[fromChair].x;
            newCoinItem.y = this.coinAniPos[fromChair].y;

            var moveAction = cc.moveBy(curTime,(this.coinAniPos[toChair].x-this.coinAniPos[fromChair].x),(this.coinAniPos[toChair].y-this.coinAniPos[fromChair].y));
            moveAction.easing(cc.easeOut(1.5));
            newCoinItem.runAction(cc.sequence(cc.delayTime(0.1*i),moveAction,cc.callFunc(function(target, coinItem)  {
                coinItem.removeFromParent(true);
                if(this.runWinAniList[toChair] == false)
                {
                    this.runWinAniList[toChair] = true;
                    this.winHeadAniNodeList[toChair].active = true;
                    this.winHeadAnimationList[toChair].play();
                    // this.parent.gamePlayerNode.winBoxAniNodeList[toChair].active = true;
                    // this.parent.gamePlayerNode.winBoxAniList[toChair].play();
                    var targetChair = toChair;
                    this.winHeadAniNodeList[toChair].runAction(cc.sequence(cc.delayTime(0.1*num),cc.callFunc(function(target,targetChair){
                        this.winHeadAniNodeList[targetChair].stopAllActions();
                        this.runWinAniList[targetChair] = false;
                        this.winHeadAnimationList[targetChair].pause();
                        this.winHeadAniNodeList[targetChair].active = false;
                        // this.parent.gamePlayerNode.winBoxAniList[toChair].stop();
                        // this.parent.gamePlayerNode.winBoxAniNodeList[toChair].active = false;
                    },this,targetChair)));
                }
            },this,newCoinItem)));
        }

        var callFunc = function(){

        };
        this.scheduleOnce(callFunc,0.4);
    },

    initScoreAni:function(){
        this.scoreAniNode = this.node.getChildByName("scoreAniNode");
        this.scoreWinNodeList = [];
        this.scoreLoseNodeList = [];
        this.scoreWinNumList = [];
        this.scoreLoseNumList = [];
        for(var i=0;i<6;i++)
        {
            this.scoreWinNodeList[i] = this.scoreAniNode.getChildByName("win"+i);
            this.scoreLoseNodeList[i] = this.scoreAniNode.getChildByName("lose"+i);
            this.scoreWinNumList[i] = this.scoreWinNodeList[i].getChildByName("num").getComponent("cc.Label");
            this.scoreLoseNumList[i] = this.scoreLoseNodeList[i].getChildByName("num").getComponent("cc.Label");
        }

        this.resetScoreAni();
    },

    resetScoreAni:function(){
        this.scoreWinNodeList[0].y = -320;
        this.scoreWinNodeList[1].y = 10;
        this.scoreWinNodeList[2].y = 230;
        this.scoreWinNodeList[3].y = 230;
        this.scoreWinNodeList[4].y = 230;
        this.scoreWinNodeList[5].y = 10;
        this.scoreLoseNodeList[0].y = -320;
        this.scoreLoseNodeList[1].y = 10;
        this.scoreLoseNodeList[2].y = 230;
        this.scoreLoseNodeList[3].y = 230;
        this.scoreLoseNodeList[4].y = 230;
        this.scoreLoseNodeList[5].y = 10;

        for(var i=0;i<6;i++)
        {
            this.scoreWinNodeList[i].stopAllActions();
            this.scoreLoseNodeList[i].stopAllActions();
            this.scoreWinNodeList[i].active = false;
            this.scoreLoseNodeList[i].active = false;
        }
    },

    showScoreAni:function(curChair,score){
        var moveAction = cc.moveBy(0.3,0,100);
        moveAction.easing(cc.easeOut(3.0));
        if(score >= 0)
        {
            this.scoreWinNodeList[curChair].opacity = 255;
            this.scoreWinNodeList[curChair].active = true;
            this.scoreWinNumList[curChair].string = ":"+score;
            this.scoreWinNodeList[curChair].runAction(cc.sequence(moveAction,cc.delayTime(1.5),cc.fadeOut(0.2)));
        }else{
            this.scoreLoseNodeList[curChair].opacity = 255;
            this.scoreLoseNodeList[curChair].active = true;
            this.scoreLoseNumList[curChair].string = ":"+score;
            this.scoreLoseNodeList[curChair].runAction(cc.sequence(moveAction,cc.delayTime(1.5),cc.fadeOut(0.2)));
        }
    },

    initBankerAni:function(){
        this.bankerAniNode = this.node.getChildByName("bankerAniNode");
        this.bankerBoxListNode = this.bankerAniNode.getChildByName("bankerBoxList");
        this.bankerBoxList = {};
        for(var i=0;i<6;i++)
            this.bankerBoxList[i] = this.bankerBoxListNode.getChildByName("bankerBox"+i);

        this.bankerAniMask = this.bankerAniNode.getChildByName("mask");
        this.resetBankerAni();
    },

    resetBankerAni:function(){
        for(var i=0;i<6;i++){
            this.bankerBoxList[i].stopAllActions();
            this.bankerBoxList[i].opacity = 0;
        }
        this.bankerEndChair = -1;
        this.bankerBeginChair = -1;
        this.bankerRunList = [];
        this.bankerAniSchedule = -1;
        this.bankerAniMask.active = false;
    },

    bankerRunListAdd:function(newChair){
        console.log("bankerRunListAdd===",newChair);
        this.bankerRunList.push(newChair);
    },

    runBankerAni:function(endChair,cb){
        if(this.bankerRunList.length <= 1)
        {
            this.parent.showBankerAfterAni();
            this.resetBankerAni();
            cb(0);
            return;
        }
        this.bankerAniMask.active = true;
        this.bankerRunList.sort();
        this.bankerEndChair = endChair;
        this.bankerEndIndex = this.bankerRunList.indexOf(endChair);
        console.log("@@@@@runBankerAni@@@@@");
        console.log(this.bankerRunList);
        console.log("this.bankerEndChair==="+endChair);
        console.log("this.bankerEndIndex==="+this.bankerEndIndex);
        var moveStep = 6+parseInt(Math.random()*6)
        this.bankerBeginIndex = (this.bankerEndIndex + this.bankerRunList.length - (moveStep%this.bankerRunList.length - 1))%this.bankerRunList.length;
        console.log("bankerBeginIndex === ",this.bankerBeginIndex);
        var curStep = 0;
        var self = this;
        this.bankerAniSchedule = function(){
            var curAniChair = self.bankerRunList[(this.bankerBeginIndex+curStep)%this.bankerRunList.length];
            curStep ++;
            if(self.bankerBoxList[curAniChair])
            {
                self.bankerBoxList[curAniChair].stopAllActions();
                self.bankerBoxList[curAniChair].opacity = 0;
                self.bankerBoxList[curAniChair].runAction(cc.sequence(cc.fadeIn(0.2),cc.fadeOut(0.2)));
            }
            if(curStep > moveStep)
            {
                console.log("curStep > moveStep");
                self.unschedule(self.bankerAniSchedule);
                self.parent.showBankerAfterAni();
                self.resetBankerAni();
                if(cb)
                    cb(parseInt(0.2*moveStep));
            }
        };
        this.schedule(this.bankerAniSchedule,0.2,moveStep);
        this.bankerAniSchedule();
        // this.resetBankerAni();
    },
});
