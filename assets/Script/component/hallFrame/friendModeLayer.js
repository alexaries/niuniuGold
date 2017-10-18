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
        var self = this;
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
            console.log("this.basicType === ",this.basicType);
            console.log("this.expendMode === ",this.expendMode);
            this.saveRoomInfo();
            pomelo.request("connector.entryHandler.sendData", {"code" : "createInitiativeRoom","params" : {
                gameType:this.gameType,rate:this.curRate,cardMode:this.cardMode,bankerMode:this.bankerMode,basicType:this.basicType,coverCharge:this.expendMode}}, function(data) {
                    console.log("create room OK@@@@@@@@@@");
                    console.log(data);
                    if(data.flag == false)
                        if(data.msg.msg)
                            self.parent.showTips(tipsConf[data.msg.msg]);
                }
            ); 
        }
    },

    initCreateLayer:function(){
        
        this.gameModeSelect = this.createLayer.getChildByName("gameModeSelect");
        this.cardModeSelect = this.createLayer.getChildByName("cardModeSelect");
        this.bankerModeSelect = this.createLayer.getChildByName("bankerModeSelect");
        this.basicModeSelect = this.createLayer.getChildByName("basicModeSelect");
        this.basicModeSelect2 = this.createLayer.getChildByName("basicModeSelect2");
        this.rateModeSelect = this.createLayer.getChildByName("rateModeSelect");
        this.expendModeSelect = this.createLayer.getChildByName("expendModeSelect");
        this.enterLimitLabel = this.createLayer.getChildByName("enterLimit").getChildByName("limitNum").getComponent("cc.Label");
        this.leaveLimitLabel = this.createLayer.getChildByName("leaveLimit").getChildByName("limitNum").getComponent("cc.Label");

        this.rateBasicList = [];
        this.rateBasicList[0] = 100;
        this.rateBasicList[1] = 500;
        this.rateBasicList[2] = 1000;

        this.rateEditBox = this.rateModeSelect.getChildByName("rateEditBox").getComponent("cc.EditBox");

        this.initCreateData();
    },

    initCreateData:function(){
        console.log("initCreateData@@@@@@@@@@@@")
        if(cc.sys.localStorage.getItem('roomInfo') == null)    //首次进入游戏
        {   
            this.curRoomInfo = {
                gameType : "niuniu",
                rate : 10,
                cardMode : 1,
                bankerMode : 1,
                basicType : 0,
                expendMode : 1
            };
            cc.sys.localStorage.setItem('roomInfo', JSON.stringify(this.curRoomInfo));
        }else{
            this.curRoomInfo = JSON.parse(cc.sys.localStorage.getItem('roomInfo'));
            if(this.curRoomInfo.rate == null)
            {
                this.curRoomInfo = {
                    gameType : "niuniu",
                    rate : 10,
                    cardMode : 1,
                    bankerMode : 1,
                    basicType : 0,
                    expendMode : 1
                };
                cc.sys.localStorage.setItem('roomInfo', JSON.stringify(this.curRoomInfo));
            }
            if(this.curRoomInfo.rate222 == null)
            {
                console.log("fuck nullllllllllll@@@@@@@")
            }
        }

        this.gameType = this.curRoomInfo.gameType;
        this.rate = this.curRoomInfo.rate;
        this.cardMode = this.curRoomInfo.cardMode;
        this.bankerMode = this.curRoomInfo.bankerMode;
        this.basicType = this.curRoomInfo.basicType;
        this.expendMode = this.curRoomInfo.expendMode;
        console.log(this.curRoomInfo);
        this.curRate = this.rate;
        this.rateEditBox.string = this.curRate;
        this.enterLimitLabel.string = this.curRate*100;
        this.leaveLimitLabel.string = this.curRate*50

        this.gameModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
        this.gameModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        if(this.gameType == "niuniu")
            this.gameModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        else
            this.gameModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;

        this.cardModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
        this.cardModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        if(this.cardMode == 1)
            this.cardModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        else
            this.cardModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;

        this.bankerModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
        this.bankerModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        this.bankerModeSelect.getChildByName("toggle3").getComponent("cc.Toggle").isChecked = false;
        this.bankerModeSelect.getChildByName("toggle4").getComponent("cc.Toggle").isChecked = false;
        if(this.bankerMode == 1)
            this.bankerModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        else if(this.bankerMode == 3)
            this.bankerModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
        else if(this.bankerMode == 5)
            this.bankerModeSelect.getChildByName("toggle4").getComponent("cc.Toggle").isChecked = true;

        if(this.basicType == 4 || this.basicType == 5)
        {
            this.basicModeSelect.active = false;
            this.basicModeSelect2.active = true;
        }
        this.basicModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
        this.basicModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        this.basicModeSelect2.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
        this.basicModeSelect2.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        if(this.basicType == 0)
            this.basicModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        else if(this.basicType == 1)
            this.basicModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
        else if(this.basicType == 4)
            this.basicModeSelect2.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        else if(this.basicType == 5)
            this.basicModeSelect2.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;

        this.expendModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
        this.expendModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        if(this.expendMode == 1)
            this.expendModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        else if(this.expendMode == 2)
            this.expendModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
    },

    saveRoomInfo:function(){
        console.log("saveRoomInfo@@@@@@@@@@@@")
        this.curRoomInfo = {
            gameType : this.gameType,
            rate : this.curRate,
            cardMode : this.cardMode,
            bankerMode : this.bankerMode,
            basicType : this.basicType,
            expendMode : this.expendMode
        };
        cc.sys.localStorage.setItem('roomInfo', JSON.stringify(this.curRoomInfo));
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
                if(data.flag == false)
                        if(data.msg.msg){
                            self.parent.showTips(tipsConf[data.msg.msg]);
                            self.cleanRoomId();
                        }
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
                var self = this;
                var roomId = parseInt(this.joinRoomID);
                pomelo.request("connector.entryHandler.sendData", {"code" : "joinInitiativeRoom","params" : {
                    roomId: roomId}}, function(data) {
                        console.log("join room OK@@@@@@@@@@");
                        console.log(data);
                        if(data.flag == false)
                            if(data.msg.msg){
                                self.parent.showTips(tipsConf[data.msg.msg]);
                                self.cleanRoomId();
                            }
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
        if(index == 0){
            this.gameType = "niuniu";
            this.basicModeSelect.active = true;
            this.basicModeSelect2.active = false;
            this.basicType = 0;
            this.basicModeSelect.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            this.basicModeSelect.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        }
        else if(index == 1){
            this.gameType = "mingpaiqz";
            this.basicModeSelect.active = false;
            this.basicModeSelect2.active = true;
            this.basicType = 4;
            this.basicModeSelect2.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            this.basicModeSelect2.getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
        }
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
    selectExpendMode:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("selectExpendMode   =====   "+index);
        this.expendMode = index;
    },
    selectRateMode:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("selectRateMode   =====   "+index);
        this.rate = index;
        this.enterLimitLabel.string = this.rateBasicList[index]*100;
        this.leaveLimitLabel.string = this.rateBasicList[index]*50;
    },
    rateEditBegin:function(){

    },
    rateEditEnd:function(){
        console.log("rateEditEnd@@@@@@@@@@@")
        var newRate = parseInt(this.rateEditBox.string);
        if(this.rateEditBox.string == "")
            this.rateEditBox.string = 10;
            
        if(newRate < 10)
            this.rateEditBox.string = 10;
        else if(newRate > 5000)
            this.rateEditBox.string = 5000;
        this.curRate = parseInt(this.rateEditBox.string);
        this.enterLimitLabel.string = this.curRate*100;
        this.leaveLimitLabel.string = this.curRate*50;
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
        this.cleanRoomId();
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
