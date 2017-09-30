var tipsConf = require("tips").tipsConf;
var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },
        isInit:false,
    },

    onLoad: function () {

    },

    onInit:function(){
        this.curGameType = "goldNiuNiu";

        this.niuniuNode = this.node.getChildByName("niuniuNode");
        this.mingcardNode = this.node.getChildByName("mingcardNode");
        this.btnNiuniu = this.niuniuNode.getChildByName("btn").getComponent("cc.Button");
        this.btnMingcard = this.mingcardNode.getChildByName("btn").getComponent("cc.Button");
        this.btnNiuniuBox = this.niuniuNode.getChildByName("chooseBox");
        this.btnMingcardBox = this.mingcardNode.getChildByName("chooseBox");

        this.btnNiuniuBox.active = true;
        this.btnMingcardBox.active = true;
        this.btnNiuniuBox.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.3,100),cc.fadeTo(0.3,255))));
        this.btnMingcardBox.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.3,100),cc.fadeTo(0.3,255))));

        this.btnMingcardBox.active = false;
        this.btnNiuniuBox.active = false;

        this.matchingNode = this.node.getChildByName("matchingNode");
        this.matchTips = this.matchingNode.getChildByName("tips").getComponent("cc.Label");
        this.matchTips0 = this.matchingNode.getChildByName("tips0").getComponent("cc.Label");

        this.levelNode = this.node.getChildByName("levelNode");
        this.levelMask = this.levelNode.getChildByName("mask");
        this.levelMask.opacity = 0;

        this.btnLevelList = {};
        for(var i=0;i<5;i++)
            this.btnLevelList[i] = this.levelNode.getChildByName("btnLevel"+i);
        // this.btnLevel1 = this.levelNode.getChildByName("btnLevel1");
        // this.btnLevel2 = this.levelNode.getChildByName("btnLevel2");
        // this.btnLevel3 = this.levelNode.getChildByName("btnLevel3");
        // this.btnLevel4 = this.levelNode.getChildByName("btnLevel4");
        // this.btnLevel5 = this.levelNode.getChildByName("btnLevel5");
        this.setLimit();

        this.curMatchTime = 0;
        this.timeUpdate = -1;
        this.isInit = true;

        this.curMode = 0;

        this.levelPosList = {};
        this.levelPosList[1] = {x:-270,y:0};
        this.levelPosList[2] = {x:270,y:0};
        this.levelPosList[3] = {x:-500,y:0};
        this.levelPosList[4] = {x:-250,y:0};
        this.levelPosList[5] = {x:0,y:0};
        this.levelPosList[6] = {x:250,y:0};
        this.levelPosList[7] = {x:500,y:0};
    },

    changeGameType:function(event, customEventData){
        console.log("changeGameType===="+customEventData);
        var index = parseInt(customEventData);
        if(index == 1)
        {
            this.curMode = 1;
            this.btnNiuniuBox.active = true;
            this.btnMingcardBox.active = false;
            this.showLevelNode(this.curMode);
        }else if(index == 2){
            this.curMode = 2;
            this.btnMingcardBox.active = true;
            this.btnNiuniuBox.active = false;
            this.showLevelNode(this.curMode);
        }
    },

    setLimit:function(){
        for(var i=0;i<5;i++)
        {
            var limitMin = this.btnLevelList[i].getChildByName("limitMin").getComponent("cc.Label");
            var limitMax = this.btnLevelList[i].getChildByName("limitMax").getComponent("cc.Label");
            limitMin.string = confige.roomLimit.goldBasic[i]*confige.roomLimit.limitMinRate;
            if(i != 4)
                limitMax.string = confige.roomLimit.goldBasic[i]*confige.roomLimit.limitMaxRate;
        }

        // this.limitMin1 = this.btnLevel1.getChildByName("limitMin").getComponent("cc.Label");
        // this.limitMax1 = this.btnLevel1.getChildByName("limitMax").getComponent("cc.Label");
        // this.limitMin2 = this.btnLevel2.getChildByName("limitMin").getComponent("cc.Label");
        // this.limitMax2 = this.btnLevel2.getChildByName("limitMax").getComponent("cc.Label");
        // this.limitMin3 = this.btnLevel3.getChildByName("limitMin").getComponent("cc.Label");
        // this.limitMax3 = this.btnLevel3.getChildByName("limitMax").getComponent("cc.Label");

        // this.limitMin1.string = confige.roomLimit.goldBasic[0]*confige.roomLimit.limitMinRate;
        // this.limitMin2.string = confige.roomLimit.goldBasic[1]*confige.roomLimit.limitMinRate;
        // this.limitMin3.string = confige.roomLimit.goldBasic[2]*confige.roomLimit.limitMinRate;
        // this.limitMax1.string = confige.roomLimit.goldBasic[0]*confige.roomLimit.limitMaxRate;
        // this.limitMax2.string = confige.roomLimit.goldBasic[1]*confige.roomLimit.limitMaxRate;
        // this.limitMax3.string = confige.roomLimit.goldBasic[2]*confige.roomLimit.limitMaxRate;
    },

    showLevelNode:function(showType){
        if(showType == 1)
        {
            for(var i=0;i<5;i++)
            {
                this.btnLevelList[i].x = this.levelPosList[1].x;
                this.btnLevelList[i].y = this.levelPosList[1].y;
                this.btnLevelList[i].scale = 0;
            }
            // this.btnLevel1.x = this.levelPosList[1].x;
            // this.btnLevel1.y = this.levelPosList[1].y;
            // this.btnLevel1.scale = 0;
            // this.btnLevel2.x = this.levelPosList[1].x;
            // this.btnLevel2.y = this.levelPosList[1].y;
            // this.btnLevel2.scale = 0;
            // this.btnLevel3.x = this.levelPosList[1].x;
            // this.btnLevel3.y = this.levelPosList[1].y;
            // this.btnLevel3.scale = 0;
        }else if(showType == 2){
            for(var i=0;i<5;i++)
            {
                this.btnLevelList[i].x = this.levelPosList[2].x;
                this.btnLevelList[i].y = this.levelPosList[2].y;
                this.btnLevelList[i].scale = 0;
            }
        }
        this.levelCanHide = true;
        this.levelNode.active = true;
        this.levelMask.getComponent("cc.Button").interactable = false;
        var self = this;
        this.levelMask.runAction(cc.sequence(cc.fadeTo(0.3,111),cc.callFunc(function(){
            self.levelMask.getComponent("cc.Button").interactable = true;
        })));
        for(var i=0;i<5;i++)
        {
            this.btnLevelList[i].runAction(cc.spawn(cc.scaleTo(0.3,0.8),cc.moveTo(0.3,this.levelPosList[3+i].x,this.levelPosList[3+i].y)));
        }
        // this.btnLevel1.runAction(cc.spawn(cc.scaleTo(0.3,0.8),cc.moveTo(0.3,this.levelPosList[3].x,this.levelPosList[3].y)));
        // this.btnLevel2.runAction(cc.spawn(cc.scaleTo(0.3,0.8),cc.moveTo(0.3,this.levelPosList[4].x,this.levelPosList[4].y)));
        // this.btnLevel3.runAction(cc.spawn(cc.scaleTo(0.3,0.8),cc.moveTo(0.3,this.levelPosList[5].x,this.levelPosList[5].y)));

        this.niuniuNode.active = false;
        this.mingcardNode.active = false;
        this.parent.btnReturn.active = false;
    },

    hideLevelNode:function(){
        if(this.levelCanHide == true)
            this.levelCanHide = false;
        else
            return;
        var self = this;
        this.levelMask.runAction(cc.sequence(cc.fadeTo(0.3,111),cc.callFunc(function () {
            self.levelNode.active = false;
            self.niuniuNode.active = true;
            self.mingcardNode.active = true;
        })));
        if(this.curMode == 1)
        {
            for(var i=0;i<5;i++)
            {
                this.btnLevelList[i].runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[1].x,this.levelPosList[1].y)));
            }
            // this.btnLevel1.runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[1].x,this.levelPosList[1].y)));
            // this.btnLevel2.runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[1].x,this.levelPosList[1].y)));
            // this.btnLevel3.runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[1].x,this.levelPosList[1].y)));
        }else{
            for(var i=0;i<5;i++)
            {
                this.btnLevelList[i].runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[2].x,this.levelPosList[2].y)));
            }
            // this.btnLevel1.runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[2].x,this.levelPosList[2].y)));
            // this.btnLevel2.runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[2].x,this.levelPosList[2].y)));
            // this.btnLevel3.runAction(cc.spawn(cc.scaleTo(0.3,0),cc.moveTo(0.3,this.levelPosList[2].x,this.levelPosList[2].y)));
        }

        this.btnMingcardBox.active = false;
        this.btnNiuniuBox.active = false;
        this.parent.btnReturn.active = true;
    },
    selectGameLevel:function(event, customEventData){
        console.log("changeGameType===="+customEventData);
        var index = parseInt(customEventData);
        if(index == 1)
        {
            if(this.curMode == 1){
                this.curGameType = "goldNiuNiu-1-gold";
                this.matchTips0.string = "普通牛牛新手场";
            }
            else{
                this.curGameType = "goldMingpai-1-gold";
                this.matchTips0.string = "明牌抢庄新手场";
            }
            this.beginMatch();
        }else if(index == 2){
            if(this.curMode == 1){
                this.curGameType = "goldNiuNiu-2-gold";
                this.matchTips0.string = "普通牛牛初级场";
            }
            else{
                this.curGameType = "goldMingpai-2-gold";
                this.matchTips0.string = "明牌抢庄初级场";
            }
            this.beginMatch();
        }else if(index == 3){
            if(this.curMode == 1){
                this.curGameType = "goldNiuNiu-3-gold";
                this.matchTips0.string = "普通牛牛中级场";
            }
            else{
                this.curGameType = "goldMingpai-3-gold";
                this.matchTips0.string = "明牌抢庄中级场";
            }
            this.beginMatch();
         }else if(index == 14){
            if(this.curMode == 1){
                this.curGameType = "goldNiuNiu-4-gold";
                this.matchTips0.string = "普通牛牛高级场";
            }
            else{
                this.curGameType = "goldMingpai-4-gold";
                this.matchTips0.string = "明牌抢庄高级场";
            }
            this.beginMatch();
         }else if(index == 15){
            if(this.curMode == 1){
                this.curGameType = "goldNiuNiu-5-gold";
                this.matchTips0.string = "普通牛牛至尊场";
            }
            else{
                this.curGameType = "goldMingpai-5-gold";
                this.matchTips0.string = "明牌抢庄至尊场";
            }
            this.beginMatch();
        }else if(index == 4){
            this.beginMatch();
        }else if(index == 5){
            this.hideLevelNode();
        }
    },

    beginMatch:function(){
        var self = this;
        pomelo.request("connector.entryHandler.sendData", {"code" : "joinMatch","params" : {
            gameType: self.curGameType}}, function(data) {
                console.log(data);
                if(data.flag == true)
                {
                    self.hideLevelNode();
                    if(self.timeUpdate != -1)
                        self.unschedule(self.timeUpdate);
                    self.matchingNode.active = true;
                    self.parent.btnReturn.active = false;
                    self.curMatchTime = 0;
                    self.matchTips.string = "匹配中:0";
                
                    self.timeUpdate = function () {
                        self.curMatchTime++;
                        self.matchTips.string = "匹配中:"+self.curMatchTime;
                    };
                    self.schedule(self.timeUpdate, 1);
                }
                if(data.msg){
                    self.parent.showNewTips(tipsConf[data.msg.msg]);
                    if(data.msg.code && data.msg.code == "reconnection"){
                        confige.curReconnectData = data.msg.data;
                        confige.roomData = data.msg.data.roomInfo;
                        confige.roomPlayer = data.msg.data.roomInfo.player;
                        confige.roomId = data.msg.data.roomInfo.roomId;

                            //自动跳转游戏场景并恢复数据
                            confige.gameSceneLoadOver = false;
                            confige.gameSceneLoadData = [];
                            confige.isGoldMode = true;
                            if(confige.isGoldMode == true)
                                cc.director.loadScene('GoldScene');
                            confige.curReconnectType = confige.ON_GAME;
                    }
                }
            }
        ); 
    },

    cancleMatch:function(){
        var self = this;
        pomelo.request("connector.entryHandler.sendData", {"code" : "leaveMatch","params" : {
            gameType: self.curGameType}}, function(data) {
              console.log("goldLeave flag is : "+data.flag)
              // if(data.flag == true)
              // {
              //   self.matchingNode.active = false;
              // }
              self.matchingNode.active = false;
              self.parent.btnReturn.active = true;
            }
        );   
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
    },
});
