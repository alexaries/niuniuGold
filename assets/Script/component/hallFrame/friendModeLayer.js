var tipsData = require("tips");
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
        this.btnCreate = this.node.getChildByName("btnCreate");
        this.btnJoin = this.node.getChildByName("btnJoin");
        this.createLayer = this.node.getChildByName("createLayer");
        this.joinLayer = this.node.getChildByName("joinLayer");

        this.initCreateLayer();
        this.initJoinLayer();

        this.isInit = true;
    },

    onBtnClickByIndex:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 0)  //create
        {
            this.createLayer.active = true;
            this.btnCreate.stopAllActions();
            this.btnJoin.stopAllActions();
            this.btnCreate.runAction(cc.scaleTo(0.3,0));
            this.btnJoin.runAction(cc.scaleTo(0.3,0));
        }else if(index == 1){    //join
            this.joinLayer.active = true;
            this.btnCreate.stopAllActions();
            this.btnJoin.stopAllActions();
            this.btnCreate.runAction(cc.scaleTo(0.3,0));
            this.btnJoin.runAction(cc.scaleTo(0.3,0));
        }else if(index == 2){    //create
            console.log("willCreateRoom")
            pomelo.request("connector.entryHandler.sendData", {"code" : "createInitiativeRoom","params" : {
                gameType:this.gameType,rate:this.rate,cardMode:this.cardMode,bankerMode:this.bankerMode,basicType:this.basicType}}, function(data) {
                    console.log("create room OK@@@@@@@@@@");
                    console.log(data);
                }
            ); 
        }
    },

    initCreateLayer:function(){
        this.gameType = "niuniu";
        this.rate = 0;
        this.cardMode = 2;
        this.bankerMode = 1;
        this.basicType = 0;
        this.gameModeSelect = this.createLayer.getChildByName("gameModeSelect");
        this.cardModeSelect = this.createLayer.getChildByName("cardModeSelect");
        this.bankerModeSelect = this.createLayer.getChildByName("bankerModeSelect");
        this.basicModeSelect = this.createLayer.getChildByName("basicModeSelect");
        this.rateModeSelect = this.createLayer.getChildByName("rateModeSelect");
        this.enterLimitLabel = this.createLayer.getChildByName("enterLimit").getChildByName("limitNum").getComponent("cc.Label");
        this.leaveLimitLabel = this.createLayer.getChildByName("leaveLimit").getChildByName("limitNum").getComponent("cc.Label");

        this.rateBasicList = [];
        this.rateBasicList[0] = 10;
        this.rateBasicList[1] = 50;
        this.rateBasicList[2] = 100;
        this.enterLimitLabel.string = this.rateBasicList[this.rate]*100;
        this.leaveLimitLabel.string = this.rateBasicList[this.rate]*50
    },

    initJoinLayer:function(){
        this.joinRoomID = "";
        this.roomNumNode = this.joinLayer.getChildByName("roomNumList");
        this.roomNumList = {};
        for(var i=1;i<=6;i++)
            this.roomNumList[i] = this.roomNumNode.getChildByName("num"+i).getComponent("cc.Label");
        this.curRoomIDCount = 0;
    },

    onBtnJoinRoom:function(curRoomID){
        if(curRoomID)
            this.joinRoomID = curRoomID;
        var roomId = parseInt(this.joinRoomID);
        var self = this;
        var joinCallFunc = function(){
            console.log("onBtnJoinRoom joinCallFunc!!!!!");
            self.parent.loadingLayer.showLoading();
        };
        pomelo.request("connector.entryHandler.sendData", {"code" : "joinInitiativeRoom","params" : {
            roomId: roomId}}, function(data) {
                console.log("join room OK@@@@@@@@@@");
                console.log(data);
            }
        ); 
        console.log("join room" + roomId);
    },

    onBtnJoinNum:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index >= 0 && index <= 9)
        {
            if(this.curRoomIDCount < 6)
            {
                this.joinRoomID += customEventData;
                this.curRoomIDCount ++;
                this.roomNumList[this.curRoomIDCount].string = index;
            }
            if(this.curRoomIDCount == 6)
            {
                var roomId = parseInt(this.joinRoomID);
                pomelo.request("connector.entryHandler.sendData", {"code" : "joinInitiativeRoom","params" : {
                    roomId: roomId}}, function(data) {
                        console.log("join room OK@@@@@@@@@@");
                        console.log(data);
                    }
                ); 
            }
        }
        else if(index == 10){
            if(this.curRoomIDCount != 0)
            {
                this.joinRoomID = this.joinRoomID.substring(0,this.joinRoomID.length-1)
                this.roomNumList[this.curRoomIDCount].string = "";
                this.curRoomIDCount --;
            }
        }
        else if(index == 11){
            this.joinRoomID = "";
            this.curRoomIDCount = 0;
            for(var i=1;i<=6;i++)
                this.roomNumList[i].string = "";
        }
    },

    selectGameMode:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("selectGameMode   =====   "+index);
        if(index == 0)
            this.gameType = "niuniu";
        else if(index == 1)
            this.gameType = "mingpaiqz";
    },
    selectCardMode:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("selectCardMode   =====   "+index);
        this.cardMode = index;
    },
    selectBankerMode:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("selectBankerMode   =====   "+index);
        this.bankerMode = index;
    },
    selectBasicMode:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("selectBasicMode   =====   "+index);
        this.basicType = index;
    },
    selectRateMode:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("selectRateMode   =====   "+index);
        this.rate = index;
        this.enterLimitLabel.string = this.rateBasicList[index]*100;
        this.leaveLimitLabel.string = this.rateBasicList[index]*50;
    },

    cleanRoomId:function(){
        this.joinRoomID = "";
        this.curRoomIDCount = 0;
        for(var i=1;i<=6;i++)
           this.roomNumList[i].string = "";
    },

    hideCreateLayer:function(){
        this.createLayer.active = false;
        this.btnCreate.stopAllActions();
        this.btnJoin.stopAllActions();
        this.btnCreate.runAction(cc.scaleTo(0.3,1));
        this.btnJoin.runAction(cc.scaleTo(0.3,1));
    },

    hideJoinLayer:function(){
        this.joinLayer.active = false;
        this.btnCreate.stopAllActions();
        this.btnJoin.stopAllActions();
        this.btnCreate.runAction(cc.scaleTo(0.3,1));
        this.btnJoin.runAction(cc.scaleTo(0.3,1));
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
