var confige = require("confige");
var gameData = require("gameData");
var give = require("give");
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
        this.selectAll = false;
        this.curGiftIndex = -1;
        this.selectChair = -1;

        this.playerNick = this.node.getChildByName("nick").getComponent("cc.Label");
        this.playerScore = this.node.getChildByName("score").getComponent("cc.Label");
        this.playerHead = this.node.getChildByName("head").getComponent("cc.Sprite");
        this.playerCharm = this.node.getChildByName("charmNum").getComponent("cc.Label");
        this.playerCharmAdd = this.node.getChildByName("charmAdd").getComponent("cc.Label");
        this.giftList = this.node.getChildByName("giftList");
        this.giftBtnList = {};
        this.giftImgList = {};
        for(var i=0;i<7;i++)
        {
            this.giftBtnList[i] = this.giftList.getChildByName("giftBox"+i);
            this.giftImgList[i] = this.giftBtnList[i].getChildByName("giftImg");
        }
        this.isInit = true;
        this.sendLock = false;
    },

    onBtnSelectAll:function(){
        if(this.selectAll)
        {
            this.selectAll = false;
        }else{
            this.selectAll = true;
        }
    },

    onBtnClickByIndex:function(event,customEventData){
        var self = this;
        var index = parseInt(customEventData);
        if(index < 10)
        {
            this.curGiftIndex = index;
            console.log("点击的礼物ID===",index);
            if(this.selectAll)
            {
                console.log("willGiveAll!!!!!");
                var curDiamondCount = confige.curDiamond;
                var curPlayerCount = gameData.gamePlayerNode.playerCount-1;
                console.log("curPlayerCount==="+curPlayerCount+"@@@"+"needDiamond==="+give[this.curGiftIndex].needDiamond);
                if(curDiamondCount >= curPlayerCount*give[this.curGiftIndex].needDiamond)
                {
                    console.log("钻石足够赠送全桌");
                    var sendChairList = [];
                    var curSendIndex = 0;
                    var curSendGiftIndex = this.curGiftIndex;
                    for(var i in confige.roomPlayer)
                        if(confige.roomPlayer[i].isActive == true && i != gameData.gamePlayerNode.meChair)
                            sendChairList.push(i);
                    console.log("赠送列表=====");
                    console.log(sendChairList);
                    if(this.sendLock == false)
                    {
                        this.sendLock = true;
                        this.sendGift(sendChairList,curSendIndex,curSendGiftIndex);
                    }
                }else{
                    console.log("钻石不足赠送全桌");
                }
                self.hideLayer();
            }else{
                pomelo.request("connector.entryHandler.sendData", {"code" : "give","params" : {
                    targetChair: self.selectChair, giveId : self.curGiftIndex }}, function(data) {
                        self.hideLayer();
                    }
                );
            }
        }

        if(index == 101)
            this.hideLayer();

        if(index == 102)
            this.selectAll = !this.selectAll;

        if(index == 103)
        {
            console.log("self.selectChair===",self.selectChair);
            pomelo.request("connector.entryHandler.sendData", {"code" : "give","params" : {
                targetChair: self.selectChair, giveId : self.curGiftIndex }}, function(data) {
                    console.log("give flag ==== : "+data.flag)
                    self.hideLayer();
                }
            );
        }
    },

    sendGift:function(sendList,curSendIndex,giftIndex){
        var self = this;
        pomelo.request("connector.entryHandler.sendData", {"code" : "give","params" : {
            targetChair: sendList[curSendIndex], giveId : giftIndex }}, function(data) {
                if(data.flag == true)
                {
                    if(curSendIndex < sendList.length-1)
                        self.sendGift(sendList,curSendIndex+1,giftIndex,self.sendGift);
                    else
                        self.sendLock = false;
                }else{
                    self.sendLock = false;
                }
            }
        );
    },
   
    setCharm:function(curCharm,addCharm){
        console.log("curCharm===@@@@@@@@",curCharm);
        if(curCharm <0 )
            this.playerCharm.string = ";"+curCharm;
        else
            this.playerCharm.string = curCharm;
        if(addCharm < 0)
            this.playerCharmAdd.string = "今日"+addCharm;
        else
            this.playerCharmAdd.string = "今日+"+addCharm;
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
        this.selectChair = -1;
    },
});