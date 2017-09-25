var confige = require("confige");
var lotto = require("lotto");
cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },

        itemImg0:{
            default:null,
            type:cc.SpriteFrame
        },

        itemImg1:{
            default:null,
            type:cc.SpriteFrame
        },

        itemImg2:{
            default:null,
            type:cc.SpriteFrame
        },

        itemImg3:{
            default:null,
            type:cc.SpriteFrame
        },

        itemImg4:{
            default:null,
            type:cc.SpriteFrame
        },
        isInit:false,
    },

    onLoad: function () {
    },

    onInit:function(){
        this.aniTitle = this.node.getChildByName("rewardTitle").getComponent("cc.Animation");
        this.aniLight = this.node.getChildByName("rewardLight").getComponent("cc.Animation");
        this.rewardItem = this.node.getChildByName("rewardItem");
        this.rewardItemSprite = this.rewardItem.getComponent("cc.Sprite");
        this.rewardStringNode = this.node.getChildByName("rewardString");
        this.rewardString = this.rewardStringNode.getComponent("cc.Label");
        this.frameList = {};
        this.frameList[0] = this.itemImg0;
        this.frameList[1] = this.itemImg1;
        this.frameList[2] = this.itemImg2;
        this.frameList[3] = this.itemImg3;
        this.frameList[4] = this.itemImg4;

        this.isInit = true;
        this.resetState();
    },

    showRotaryReward:function(itemData){
        this.node.active = true;
        console.log(itemData);
        this.rewardItemSprite.spriteFrame = this.frameList[itemData.id];
        this.aniTitle.play();
        this.aniLight.play();
        this.rewardItem.runAction(cc.scaleTo(0.2,1));
        this.rewardStringNode.runAction(cc.scaleTo(0.2,1));
        
        this.rewardString.string = "恭喜获得"+itemData.name+itemData.value+"!";
        // switch(itemData.id){
        //     case 1:
        //         this.rewardString = "恭喜获得"+itemData.name+itemData.value+"!";
        //         break;
        //     case 2:
        //         break;
        //     case 3:
        //         break;
        //     case 4:
        //         break;
        // }

        var self = this;
        this.scheduleOnce(function() {
            self.hideLayer();
        },3);
        this.scheduleOnce(function() {
            self.canHide = true;
        },1);
    },

    showOrinal:function(goldNum){
        this.rewardItemSprite.spriteFrame = this.frameList[0];
        this.rewardString.string = "获得"+goldNum+"救济金!";
        this.showAni();
    },

    showSignIn:function(type,num){
        if(type == "gold")
        {
            this.rewardItemSprite.spriteFrame = this.frameList[0];
            this.rewardString.string = "本次签到获得"+num+"金币!";
        }
        this.showAni();
    },

    showShareAward:function(type,num){
        if(type == "gold")
        {
            this.rewardItemSprite.spriteFrame = this.frameList[0];
            this.rewardString.string = "每日首次分享获得"+num+"金币!";
        }
        this.showAni();
    },

    showShopData:function(goldNum,giveNum){
        this.rewardItemSprite.spriteFrame = this.frameList[0];
        if(giveNum == 0)
            this.rewardString.string = "恭喜您成功兑换"+goldNum+"金币!";
        else
            this.rewardString.string = "恭喜您成功兑换"+goldNum+"金币,"+"赠送"+giveNum+"金币!";
        this.showAni();
    },

    showGiftData:function(gold,charm){
        this.rewardItemSprite.spriteFrame = this.frameList[0];

        if(charm < 0)
            this.rewardString.string = "恭喜您获得"+gold+"金币,魅力值"+charm;
        else
            this.rewardString.string = "恭喜您获得"+gold+"金币,魅力值+"+charm;

        this.showAni();
    },

    showAni:function(){
        this.node.active = true;
        this.aniTitle.play();
        this.aniLight.play();
        this.rewardItem.runAction(cc.scaleTo(0.2,1));
        this.rewardStringNode.runAction(cc.scaleTo(0.2,1));
        
        this.canHide = true;
        // var self = this;
        // this.scheduleOnce(function() {
        //     self.hideLayer();
        // },2);
        // this.scheduleOnce(function() {
        //     self.canHide = true;
        // },1);
    },

    resetState:function(){
        this.rewardItem.scale = 2;
        this.rewardStringNode.scale = 2;
        this.canHide = false;

        this.rewardString.string = "";
    },
    
    onBtnMaskClick:function(){
        if(this.canHide)
            this.hideLayer();
    },

    showLayer:function(data){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.resetState();
        this.node.active = false;
    },
});