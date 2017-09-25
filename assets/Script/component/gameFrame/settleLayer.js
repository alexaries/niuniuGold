var confige = require("confige");
var gameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },

        settle_perfab:{
            default:null,
            type:cc.Prefab
        },

        isInit:false,
    },

    onLoad: function () {
    },

    onInit:function(){
        this.settleCount = 0;
        this.settleList = {};
        this.oriSettlePosx = 0;
        this.oriSettlePosy = 170;
        this.oriSettlePosOffset = -60;
        
        this.niuTypeFrameMap = {};
        
        this.winIco = this.node.getChildByName("win");
        this.loseIco = this.node.getChildByName("lose");
        this.overCallBack = -1;
        this.showBeginBtnCall = -1;

        this.isInit = true;
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
    },

    addOneSettle:function(name, type, score, isFK){
        var newSettle = cc.instantiate(this.settle_perfab);
        this.node.addChild(newSettle);
        
        var newSettleS = newSettle.getComponent("settleOnce");
        newSettleS.onInit();
        newSettleS.setSettle(name, type, score);
        var newType = newSettleS.type;
        if(type != 100){
            if(isFK == 0)
                newType.spriteFrame = confige.niuTypeFrameMap[type];
            else
                newType.spriteFrame = confige.niuTypeFrameMapFK[type];
        }else{
            newType.spriteFrame = null;
        }
        newSettle.setPosition(0,this.oriSettlePosy + this.oriSettlePosOffset*this.settleCount);
        
        this.settleList[this.settleCount] = newSettle;
        this.settleCount = this.settleCount + 1;
    },
    
    show:function(win){
        this.node.active = true;
        this.winIco.active = false;
        this.loseIco.active = false;
        if(win <= 0)
        {
            this.loseIco.active = true;
        }else{
            this.winIco.active = true;
        }
    },
    
    hide:function(){
        this.node.active = false;
    },
    
    cleanData:function(){
        for(var i=0;i<this.settleCount;i++)
            this.settleList[i].destroy();
        
        this.settleCount = 0;
        this.winIco.active = false;
        this.loseIco.active = false;
    },
    
    btn_close_click:function(){
        this.cleanData();
        this.hide();
        if(this.overCallBack != -1)
            this.overCallBack();
        // else
            // this.showBeginBtnCall();
        pomelo.clientScene.onBtnReadyClicked();
        pomelo.clientScene.popBanker.active = false;
    },

});