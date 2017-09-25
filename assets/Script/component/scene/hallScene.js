var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        
        history_item:{
            default:null,
            type:cc.Prefab
        },
        roomInfo_item:{
            default:null,
            type:cc.Prefab
        },

        roomInfo_item1:{
            default:null,
            type:cc.Prefab
        },

        roomInfo_item2:{
            default:null,
            type:cc.Prefab
        },
    },

    // use this for initialization

    onLoad: function () {
        cc.loader.onProgress = function(){};
        confige.loadNode.hideNode();

        if(cc.sys.platform == cc.sys.IPAD)
            cc.view.setDesignResolutionSize(1280,720,cc.ResolutionPolicy.EXACT_FIT);
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            this.bgNode = this.node.getChildByName("hallBg");
            this.bgNode.height = 910;
            cc.view.setDesignResolutionSize(1280,910,cc.ResolutionPolicy.EXACT_FIT);
            this.h5ShareNode = this.node.getChildByName("h5Share");
            this.h5ShareNode.opacity = 0;
            this.h5ShareNode.active = false;
        }

        this.topNode = this.node.getChildByName("topNode");
        this.bottomNode = this.node.getChildByName("bottomNode");
        console.log("fuck hall on load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        pomelo.clientScene = this;
        confige.curGameScene = this;
        confige.curSceneIndex = 1;
        
        this.player = this.bottomNode.getChildByName("Player").getComponent("playerInfo");
        this.player.onInit();
        
        this.player.setName(confige.userInfo.nickname);
        this.player.setScore(confige.curDiamond);
        this.diamondNum = this.topNode.getChildByName("diamondNum").getComponent("cc.Label");
        this.diamondNum.string = confige.curDiamond;
        if(confige.meWXHeadFrame != -1)
        {
            cc.log("fuck change head img");
            this.player.setHeadSpriteFrame(confige.meWXHeadFrame);
        }
        this.playerID = this.bottomNode.getChildByName("Player").getChildByName("id").getComponent("cc.Label");
        this.playerID.string = confige.userInfo.playerId;
        this.joinRoomID = "";
        this.joinRoomIDLabel = this.node.getChildByName("joinLayer").getChildByName("New Label").getComponent("cc.Label");
        
        if(cc.sys.localStorage.getItem('roomInfo') == null)    //首次进入游戏
        {   
            this.curRoomInfo = {
                cardMode : 1,
                gameMode : 1,
                bankerMode : 1,
                consumeMode : 2,
                gameTime : 10,
                playerNum : 4,
                halfwayEnter : true,
                allowAllin : true,
                allowFK : true,
                allowWait : true,
                gameType : "niuniu",
                basicScore : 1
            };
            cc.sys.localStorage.setItem('roomInfo', JSON.stringify(this.curRoomInfo));
        }else{
            this.curRoomInfo = JSON.parse(cc.sys.localStorage.getItem('roomInfo'));
        }
        
        this.createRoomLayer = this.node.getChildByName("createLayer");
        this.allowJoinCheck = this.createRoomLayer.getChildByName("allowJoin").getChildByName("check_mark");
        this.allowAllinNode = this.createRoomLayer.getChildByName("allowAllin");
        this.allowFKNode = this.createRoomLayer.getChildByName("allowFK");
        this.allowWaitNode = this.createRoomLayer.getChildByName("allowWait");
        this.allowWaitCheck = this.createRoomLayer.getChildByName("allowWait").getChildByName("check_mark");
        this.allowFKCheck = this.createRoomLayer.getChildByName("allowFK").getChildByName("check_mark");
        this.allowAllinCheck = this.allowAllinNode.getChildByName("check_mark");
        this.initCreateRoomLayer();
        this.resumeRoomInfo();

        this.joinRoomLayer = this.node.getChildByName("joinLayer");
        this.bankerModeBox = this.createRoomLayer.getChildByName("bankerMode")

        this.paoma = this.topNode.getChildByName("paoma").getChildByName("content").getChildByName("New Label");
        this.paomaLabel = this.paoma.getComponent("cc.Label")
        this.paomaOriText = confige.oriPaomaText;
        this.paomaLabel.string = this.paomaOriText;
        this.paomaTextList = [];
        this.paomaAddOneText(-1);

        this.noticeLayer = this.node.getChildByName("noticeLayer").getComponent("noticeLayer");
        this.noticeLayer.onInit();

        this.helpLayer = this.node.getChildByName("helpLayer");
        this.helpContent = this.helpLayer.getChildByName("helpScrollView").getChildByName("view").getChildByName("content");

        this.settingLayer = this.node.getChildByName("settingLayer").getComponent("settingLayer");
        this.settingLayer.onInit();

        this.initHistoryLayer();

        this.roomNumNode = this.joinRoomLayer.getChildByName("roomNumList");
        this.roomNumList = {};
        for(var i=1;i<=6;i++)
            this.roomNumList[i] = this.roomNumNode.getChildByName("num"+i).getComponent("cc.Label");
        this.curRoomIDCount = 0;

        this.shareLayer = this.node.getChildByName("shareLayer");
        this.shareBtn1 = this.shareLayer.getChildByName("btnShareSession").getComponent("cc.Button");
        this.shareBtn2 = this.shareLayer.getChildByName("btnShareTimeline").getComponent("cc.Button");

        this.tipsBox = this.node.getChildByName("tipsBox");
        this.tipsBoxLabel = this.tipsBox.getChildByName("tips").getComponent("cc.Label");

        this.basicScoreBox = this.createRoomLayer.getChildByName("basicScore");
        // if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        // {
            this.btn_addDiamond = this.topNode.getChildByName("btn_addDiamond").getComponent("cc.Button");
            this.btn_addDiamond.interactable = true;
        // }

        this.btn_invite = this.bottomNode.getChildByName("btn_invite").getComponent("cc.Button");
        this.inviteLayer = this.node.getChildByName("inviteLayer");
        this.inviteEdit = this.inviteLayer.getChildByName("inviteNum").getComponent("cc.EditBox");

        // this.userInfoLayer = this.node.getChildByName("userInfoLayer");
        // this.userInfoLayerName = this.userInfoLayer.getChildByName("nick").getComponent("cc.Label");
        // this.userInfoLayerID = this.userInfoLayer.getChildByName("id").getComponent("cc.Label");
        // this.userInfoLayerIP = this.userInfoLayer.getChildByName("ip").getComponent("cc.Label");

        // this.userInfoLayerName.string = confige.userInfo.nickname;
        // this.userInfoLayerID.string = "ID:" + confige.userInfo.playerId;
        // this.userInfoLayerIP.string = "IP:" + confige.userInfo.playerId;

        if(confige.playerLimits >= 1)
        {
            this.btn_gift = this.bottomNode.getChildByName("btn_gift");
            this.btn_gift.active = true;
        }
        this.giftLayer = this.node.getChildByName("giftLayer");
        this.giftID = this.giftLayer.getChildByName("sendID").getComponent("cc.EditBox");
        this.giftNum = this.giftLayer.getChildByName("sendNum").getComponent("cc.EditBox");
        this.giftName = this.giftLayer.getChildByName("findName").getComponent("cc.Label");
        this.giftSendBtn = this.giftLayer.getChildByName("btnOK").getComponent("cc.Button");
        this.giftSendBtn.interactable = false;
        this.giftSendNick = "";

        this.loadingLayer = this.node.getChildByName("loadingLayer").getComponent("loadingLayer");
        this.loadingLayer.onInit();

        if(confige.loginType == 1)
            this.check_invite();

        this.webCloseLayer = this.node.getChildByName("webCloseLayer").getComponent("loadingLayer"); 
        this.webCloseLayer.onInit();

        if(cc.sys.localStorage.getItem('check_invite') == false)
            this.btn_invite.interactable = false;

        this.roomInfoLayer = this.node.getChildByName("roomInfoLayer");
        this.roomInfoContent = this.roomInfoLayer.getChildByName("roomList").getChildByName("view").getChildByName("content");
        this.roomInfoItemList = {};
        this.roomInfoItemBeginY = -60;
        this.roomInfoItemOffsetY = -100;

        this.roomInfoData = {};
        this.shareMask = this.node.getChildByName("shareMask");
        this.shareMask.active = false;

        this.roomInfoLayerNew = this.node.getChildByName("roomInfoLayerNew");
        this.roomInfoLayerContent1 = this.roomInfoLayerNew.getChildByName("roomInfoView").getChildByName("view").getChildByName("content");
        this.roomInfoLayer2 = this.roomInfoLayerNew.getChildByName("infoLayer2");
        this.roomInfoLayerContent2 = this.roomInfoLayer2.getChildByName("roomList").getChildByName("view").getChildByName("content");
        this.roomInfoItemList1 = [];
        this.roomInfoItemList2 = [];
        if(confige.h5RoomID != "0"){
            this.onBtnJoinRoom(confige.h5RoomID);
            confige.h5RoomID = "0";
        }
        console.log("分享路径111111===="+confige.h5ShareUrlNew);
    },
    
    start:function(){
        console.log("fuck hallscene start");
        //pomelo.request("connector.entryHandler.test",null,null);

        if(confige.firstShowNotice == true)
        {
            console.log("fuck firstShowNotice!!!!!!!");
            this.onBtnShowNotice();
            confige.firstShowNotice = false;
            var curDate = new Date();
            var lastLoginDate = {
                year : curDate.getFullYear(),
                month : curDate.getMonth() + 1,
                day : curDate.getDate()
            }
            cc.sys.localStorage.setItem('lastLoginDate', JSON.stringify(lastLoginDate));
        }

        var infoCount = confige.hallSceneLoadData.length;
        console.log(confige.hallSceneLoadData);
        for(var i=0;i<infoCount;i++)
        {
            console.log("deal once!!!!!!!!");
            var curInfo = confige.hallSceneLoadData.shift();
            pomelo.dealWithOnNotify(curInfo);
            console.log(curInfo);
        }
        confige.hallSceneLoadData = [];
    },

    paomaAddOneText:function(textData,paomaTime){
        if(textData != -1)
        {
            this.paomaTextList.push(textData);
            this.paoma.x = 500;
            this.paomaLabel.string = textData;
            console.log("curPaomaString = " + textData);
            this.paoma.stopAllActions();
        }

        var paomaCurMoveX = -(this.paoma.width + 500 + 700);
        var paomaCurMoveT = 15;
        var paomaCurMove = cc.moveBy(paomaCurMoveT, paomaCurMoveX, 0);

        var finished = function(){//cc.callFunc(function () {
            if(this.paomaTextList.length == 0)
            {
                this.paomaLabel.string = this.paomaOriText;
            }else{
                this.paomaLabel.string = this.paomaTextList[this.paomaTextList.length-1];
                this.paomaTextList.pop();
            }
            this.paoma.x = 500;
            paomaCurMoveX = -(this.paoma.width + 500 + 700);
            paomaCurMoveT = (-paomaCurMoveX) / 200 + 2;
            if(paomaCurMoveT < 10)
                paomaCurMoveT = 10;
            if(paomaTime)
            {
                var setX = cc.callFunc(function () {
                    this.paoma.x = 500;
                },this);
                var moveAction = cc.moveBy(paomaCurMoveT, paomaCurMoveX, 0);
                paomaCurMove = cc.repeat(cc.sequence(setX, moveAction), paomaTime);
            }else{
                paomaCurMove = cc.moveBy(paomaCurMoveT, paomaCurMoveX, 0);
            }
            //console.log("curMoveX = " + this.paomaCurMoveX + "      curMoveT = " + this.paomaCurMoveT);
        }.bind(this);//, this);
        
        finished();

        var paomaCallFunc = cc.callFunc(function () {
            this.paoma.stopAllActions();
            finished();
            this.paoMaSeq = cc.sequence(
                paomaCurMove,
                paomaCallFunc
            );
            this.paoma.runAction(this.paoMaSeq);
            //console.log("newnewnew    curMoveX = " + this.paomaCurMoveX + "      curMoveT = " + this.paomaCurMoveT);
        },this);     

        this.paoMaSeq = cc.sequence(
            paomaCurMove,
            paomaCallFunc
        );
        this.paoma.runAction(this.paoMaSeq);
    }, 

    onBtnHideLayer:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 0)
        {
            this.inviteEdit.string = "";
            this.inviteLayer.active = false;
        }
        // }else if(index == 1){
        //     //this.giftLayer.active = false;
        // }else if(index == 2){
        //     this.userInfoLayer.active = false;
        // }
    },

    onBtnInviteCancle:function(){
        this.inviteEdit.string = "";
        this.inviteLayer.active = false;
    },

    onBtnShowInvite:function(){
        this.inviteLayer.active = true;
    },

    onBtnGitfLayer:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        var self = this;
        if(clickIndex == 0) //show
        {
            this.giftLayer.active = true;
        }else if(clickIndex == 1){  //find
            console.log("onBtnGitfLayer find")
            var curUid = parseInt(this.giftID.string);
            pomelo.request("monitor.handle.queryNickName", {uid : curUid}, function(data) {
                console.log(data);
                if(data.flag == false)
                {
                    console.log("查询失败！！！");
                    self.giftSendBtn.interactable = false;
                    self.showTips("查询失败！请输入正确的玩家ID");
                    self.giftID.string = "";
                }else{
                    console.log("查询成功！！！");
                    self.giftName.string = data;
                    self.giftSendNick = data;
                    self.giftSendBtn.interactable = true;
                }
            });   
        }else if(clickIndex == 2){  //send
            console.log("onBtnGitfLayer send")
            var curUid = parseInt(this.giftID.string);
            var curDiamond = parseInt(this.giftNum.string);
            pomelo.request("monitor.handle.giveDiamond", {target : curUid,diamond : curDiamond}, function(data) {
                if(data && data.flag == true)
                {
                    console.log("赠送成功！！！");
                    self.showTips("向["+self.giftSendNick+"]赠送["+curDiamond+"]钻石成功");
                    self.cleanGiftLayer();
                }else{
                    if(data)
                        self.showTips(data);
                    else
                        self.showTips("赠送失败,请重新输入赠送信息");
                    console.log("赠送失败！！！");
                    
                    self.cleanGiftLayer();
                }
            });
        }else if(clickIndex == 3){  //cancle
            this.cleanGiftLayer();    
        }
    },

    cleanGiftLayer:function(){
        this.giftSendBtn.interactable = false;
        this.giftID.string = "";
        this.giftNum.string = "";
        this.giftName.string = "";
        this.giftLayer.active = false;
    },

    onBtnShowUserInfo:function(){
        // this.userInfoLayer.active = true;
    },

    onBtnShowHelp:function(){
        this.helpLayer.active = true;
    },
    
    onBtnHideHelp:function(){
        this.helpLayer.active = false;
        this.helpContent.y = 250;
    },

    onBtnShowSetting:function(){
        this.settingLayer.showSetting();
    },

    onBtnShowNotice:function(){
        var self = this;
        pomelo.request("connector.entryHandler.getNotify",null, function(data) {
            confige.noticeData = data;
            console.log(data);
            self.noticeLayer.addNotice(data);
            self.noticeLayer.showLayer();
        });
    },
    
    onBtnJoinGame:function(){
        
    },
    
    onBtnJoinRoom:function(curRoomID){
        if(curRoomID)
            this.joinRoomID = curRoomID;
        var roomId = parseInt(this.joinRoomID);
        var self = this;
        var joinCallFunc = function(){
            console.log("onBtnJoinRoom joinCallFunc!!!!!");
            self.loadingLayer.showLoading();
        };
        pomelo.clientSend("join",{"roomId":roomId}, joinCallFunc);
        console.log("join room" + roomId);
    },
    
    onBtnCreateRoom:function(event, customEventData){
        var index = parseInt(customEventData);
        // if(this.gameMode > 2 && this.gameMode != 6 && this.gameMode != 101)
            // this.bankerMode = 2;

        var createType = "newRoom";
        if(index == 0){
            console.log("创建房间并成为房主");
            createType = "newRoom";
            var self = this;
            var joinCallFunc = function(){
                self.loadingLayer.showLoading();
            };
            var gjoin = function() { 
              pomelo.request("connector.entryHandler.sendData", {"code" : "joinMatch","params" : {
                gameType: "goldMingpai"}}, function(data) {
                  console.log("flag is : "+data.flag)
                }
              );           
            }
            // pomelo.clientCreateRoom(this.gameMode, this.bankerMode, this.consumeMode, this.gameTime, this.cardMode, this.playerNum, this.gameType, this.basicScore, createType, this.halfwayEnter,this.allowAllin,this.allowFK,this.allowWait,joinCallFunc);
        }else if(index == 1){
            console.log("创建房间但是不加入");
            createType = "agency";
            pomelo.clientCreateRoom(this.gameMode, this.bankerMode, this.consumeMode, this.gameTime, this.cardMode, this.playerNum, this.gameType, this.basicScore, createType, this.halfwayEnter,this.allowAllin,this.allowFK,this.allowWait);
        }
        this.saveRoomInfo();
    },

    initCreateRoomLayer:function(){
        this.createLayer1 = this.createRoomLayer.getChildByName("childLayer1");
        this.createLayer2 = this.createRoomLayer.getChildByName("childLayer2");
        this.bankerModeNode = this.createLayer1.getChildByName("bankerMode");
        this.playerNumNode = this.createLayer1.getChildByName("playerNum");
        this.expend11 = this.createLayer1.getChildByName("expendMode").getChildByName("expend1").getComponent("cc.Label");
        this.expend12 = this.createLayer1.getChildByName("expendMode").getChildByName("expend2").getComponent("cc.Label");
        this.expend13 = this.createLayer1.getChildByName("expendMode").getChildByName("expend3").getComponent("cc.Label");
        this.expend21 = this.createLayer2.getChildByName("expendMode").getChildByName("expend1").getComponent("cc.Label");
        this.expend22 = this.createLayer2.getChildByName("expendMode").getChildByName("expend2").getComponent("cc.Label");
        this.expend23 = this.createLayer2.getChildByName("expendMode").getChildByName("expend3").getComponent("cc.Label");
        this.btnLight1 = this.createRoomLayer.getChildByName("btn_gameType1").getChildByName("light");
        this.btnLight2 = this.createRoomLayer.getChildByName("btn_gameType2").getChildByName("light");
        this.btnLight3 = this.createRoomLayer.getChildByName("btn_gameType3").getChildByName("light");
        this.btnLight4 = this.createRoomLayer.getChildByName("btn_gameType4").getChildByName("light");
        this.btnLight5 = this.createRoomLayer.getChildByName("btn_gameType5").getChildByName("light");
        this.btnLight6 = this.createRoomLayer.getChildByName("btn_gameType6").getChildByName("light");

        this.resetToggleList = {};
        this.resetToggleList[0] = this.createLayer1.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[1] = this.createLayer1.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[2] = this.createLayer1.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[3] = this.createLayer1.getChildByName("bankerMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[4] = this.createLayer1.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[5] = this.createLayer2.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[6] = this.createLayer2.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[7] = this.createLayer2.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[8] = this.createLayer2.getChildByName("basicScore");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[9] = this.createLayer2.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[10] = this.createLayer2.getChildByName("basicScore2");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[11] = this.createLayer2.getChildByName("bankerMode");
        // this.resetCreateRoomData();
        // this.showCreateRoomType(1);
        // this.showRoomExpend();
    },

    resetCreateRoomData:function(){
        //resetData 切换模式时重置
        this.cardMode = 1;
        this.gameMode = 1;
        this.bankerMode = 1;
        this.consumeMode = 2;
        this.gameTime = 10;
        this.playerNum = 4;
        this.diamondExpend = 4;
        this.basicScore = 1;

        for(var i in this.resetToggleList)
            this.resetToggleList[i].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;

        this.createLayer1.active = false;
        this.createLayer2.active = false;
        this.btnLight1.active = false;
        this.btnLight2.active = false;
        this.btnLight3.active = false;
        this.btnLight4.active = false;
        this.btnLight5.active = false;
        this.btnLight6.active = false;
    },

    showCreateRoomType:function(type){
        this.allowAllinNode.active = false;
        this.allowFKNode.active = false;
        this.resetToggleList[11].active = false;
        if(type == 4)
        {
            this.createLayer2.active = true;
            this.btnLight4.active = true;
            this.resetToggleList[8].active = true;
            this.resetToggleList[10].active = false;
        }else if(type == 5){
            this.createLayer2.active = true;
            this.btnLight5.active = true;
            this.resetToggleList[10].active = true;
            this.resetToggleList[11].active = true;
            this.resetToggleList[8].active = false;
            this.allowAllinNode.active = true;
        }else{
            this.createLayer1.active = true;
            if(type == 1)
            {
                this.bankerModeNode.active = true;
                this.playerNumNode.y = -100;
                this.btnLight1.active = true;
            }else if(type == 6){
                this.bankerModeNode.active = true;
                this.playerNumNode.y = -100;
                this.btnLight6.active = true;
                this.allowFKNode.active = true;
            }else{
                this.bankerModeNode.active = false;
                this.playerNumNode.y = -20;
                if(type == 2)
                {
                    this.btnLight2.active = true;
                }else{
                    this.btnLight3.active = true;
                }
            }
        }
    },
    
    showRoomExpend:function(){
        var curExpend1 = 0;
        var curExpend2 = 0;
        var curExpend3 = 0;
        curExpend1 = Math.ceil(this.playerNum*this.gameTime/10);
        curExpend2 = Math.ceil(this.gameTime/10);
        curExpend3 = Math.ceil(this.playerNum*this.gameTime/10);

        if(this.gameMode == 100)
        {
            this.expend21.string = "(钻石" + curExpend1 + ")";
            this.expend22.string = "(钻石" + curExpend2 + ")";
            this.expend23.string = "(钻石" + curExpend3 + ")";
        }else{
            this.expend11.string = "(钻石" + curExpend1 + ")";
            this.expend12.string = "(钻石" + curExpend2 + ")";
            this.expend13.string = "(钻石" + curExpend3 + ")";
        }
    },

    onChooseGameMode:function(event, customEventData){
        this.resetCreateRoomData();
        console.log("gameMode" + customEventData);
        this.gameMode = parseInt(customEventData);
        if(this.gameMode == 1)
            this.showCreateRoomType(1);
        else if(this.gameMode == 3)
            this.showCreateRoomType(3);
        else if(this.gameMode == 4)
            this.showCreateRoomType(2);
        else if(this.gameMode == 100)
            this.showCreateRoomType(4);
        else if(this.gameMode == 101)
            this.showCreateRoomType(5);
        else if(this.gameMode == 6)
            this.showCreateRoomType(6);
        this.gameType = "niuniu";
        if(this.gameMode == 100)
        {
            this.gameType = "zhajinniu";
        }else if(this.gameMode == 101){
            this.gameType = "mingpaiqz";
        }else if(this.gameMode == 6){
            this.gameType = "fengkuang";
        }

        this.showRoomExpend();
    },
    
    onChooseBankerMode:function(event, customEventData){
        console.log("banker!!!!!!!!!!" + customEventData);
        this.bankerMode = parseInt(customEventData);
    },
    
    onChooseConsumeMode:function(event, customEventData){
        console.log("consumeMode" + customEventData);
        this.consumeMode = parseInt(customEventData);
        //this.showRoomExpend();
    },
    
    onChooseGameTime:function(event, customEventData){
        console.log("gameTime" + customEventData);
        this.gameTime = parseInt(customEventData);
        this.showRoomExpend();
    },

    onChooseCardMode:function(event, customEventData){
        console.log("cardMode" + customEventData);
        this.cardMode = parseInt(customEventData);
    },

    onChoosePlayerNum:function(event, customEventData){
        console.log("playerNum" + customEventData);
        this.playerNum = parseInt(customEventData);
        this.showRoomExpend();
    },

    onChooseBasicScore:function(event, customEventData){
        console.log("basicScore" + customEventData);
        this.basicScore = parseInt(customEventData);
    },

    changeDiamondExpendNum:function(){
        if(this.consumeMode == 2)
            this.diamondExpend = 3*this.gameTime/10;//Math.ceil(this.playerNum*this.gameTime/10;;
        else if(this.consumeMode == 1)
            this.diamondExpend = Math.ceil(this.gameTime/10);
        else if(this.consumeMode == 3)
            this.diamondExpend = 3*this.gameTime/10;//Math.ceil(this.playerNum*this.gameTime/10);
    },
    
    onBtnCreateOrJoin:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 1)
        {
            this.createRoomLayer.active = true;
        }
        else
            this.joinRoomLayer.active = true;
    },
    
    onBtnRemoveLayer:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 1)
            this.createRoomLayer.active = false;
        else{
            this.joinRoomLayer.active = false;
            this.joinRoomID = "";
            this.curRoomIDCount = 0;
            for(var i=1;i<=6;i++)
                this.roomNumList[i].string = "";
        }
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
                pomelo.clientSend("join",{"roomId":roomId});
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
        
        this.joinRoomIDLabel.string = this.joinRoomID;
    },

    cleanRoomId:function(){
        this.joinRoomID = "";
        this.curRoomIDCount = 0;
        for(var i=1;i<=6;i++)
           this.roomNumList[i].string = "";
    },

    onBtnGameExit:function(event, customEventData){   
        if(confige.curUsePlatform == 3){
            confige.curGameScene.destroy();
            window.close();
        }
        cc.director.end();
        console.log("game exit->run()");
        if(confige.curUsePlatform == 2)
            jsb.reflection.callStaticMethod("JSCallOC","GameExit");
        //可能需要针对不同的平台做不同的处理，并且在end之前要向服务器发送下线
    },

    initHistoryLayer:function(){
        this.historyLayer = this.node.getChildByName("historyLayer");

        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            this.historyLayer.height = 910;
            this.hisBg1 = this.historyLayer.getChildByName("bg1");
            this.hisBg2 = this.historyLayer.getChildByName("bg2");
            this.hisBg1.height = 910;
            this.hisBg2.height = 910;
        }

        this.historyContent = this.historyLayer.getChildByName("historyScrollView").getChildByName("view").getChildByName("content");
        
        this.historyNotice = this.historyLayer.getChildByName("notice");

        this.historyItemBeginY = -135;
        this.historyItemOffsetY = -245;

        this.historyItemList = {};
        this.updateHistory();
    },

    onBtnShowHistory:function(){
        this.historyLayer.active = true;
    },

    onBtnHideHistory:function(){
        this.historyLayer.active = false;
    },

    connectCallBack:function(){

    },

    showOrHideShareLayer:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 0)
            this.shareLayer.active = false;
        else if(index == 1)
            this.shareLayer.active = true;
    },

    onBtnWXShare:function(event, customEventData){
        cc.log("fuck weixin share!!!!!!!!");
        this.shareBtn1.interactable = false;
        this.shareBtn2.interactable = false;
        var index = parseInt(customEventData);
        if(index == 0){
            cc.log("分享给好友");
            if(confige.curUsePlatform == 1)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", confige.shareTitle, confige.shareDes, confige.shareURL, 0);
            }else if(confige.curUsePlatform == 2){
                jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",confige.shareTitle, confige.shareDes, confige.shareURL, 0);
            }
        }else if(index == 1){
            cc.log("分享到朋友圈");
            if(confige.curUsePlatform == 1)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", confige.shareTitle, confige.shareDes, confige.shareURL, 1);
            }else if(confige.curUsePlatform == 2){
                jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",confige.shareTitle, confige.shareDes, confige.shareURL, 1);
            }
        }
        if(confige.curUsePlatform == 3)
        {
            var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', '0');
            // wx.ready(function(res) {
                console.log("H5分享给好友");
                wx.onMenuShareAppMessage({
                    title: confige.shareTitle,
                    desc: confige.shareDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
                console.log("H5分享到朋友圈2222222");
                wx.onMenuShareTimeline({
                    title: confige.shareTitle,
                    desc: confige.shareDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
            // });            
            this.shareBtn1.interactable = true;
            this.shareBtn2.interactable = true;

            this.h5ShareNode.active = true;
            this.h5ShareNode.stopAllActions();
            this.h5ShareNode.opacity = 255;
            var deactiveCall = cc.callFunc(function () {
                this.h5ShareNode.active = false;
            },this);  
            this.h5ShareNode.runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(1),deactiveCall));
        }
        this.shareLayer.active = false;
        cc.log("weixin share call end");
    },

    hideH5ShareNode:function(){
        this.h5ShareNode.stopAllActions();
        this.h5ShareNode.opacity = 0;
        this.h5ShareNode.active = false;
    },

    showTips:function(newTips,type){
        this.tipsBoxLabel.string = newTips;
        this.tipsBox.active = true;
        this.tipsBox.opacity = 0;
        var tipsAction = cc.sequence(
            cc.fadeIn(0.5),
            cc.delayTime(3),
            cc.fadeOut(0.5)
        );
        this.tipsBox.runAction(cc.fadeIn(0.5));

        if(type == 1)           //创建成功,隐藏界面
        {
            this.createRoomLayer.active = false;
        }else if(type == 2){    //加入失败,清空ID
            this.cleanRoomId();
        }
    }, 

    hideTips:function(){
        this.tipsBox.stopAllActions();
        this.tipsBox.opacity = 0;
        this.tipsBox.active = false;
    },
    
    btnAddDiamond:function(){
        // cc.sys.openURL(confige.payURL);
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();

        var httpCallback = function(){
            if (xmlHttp.readyState==4)
              {// 4 = "loaded"
              if (xmlHttp.status==200)
                {// 200 = OK
                    
                }
              else
                {
                    console.log("Problem retrieving XML data");
                }
              }
            
        };

        xmlHttp.open("GET", url, true);  
        xmlHttp.responseType = "blob";//这里是关键，它指明返回的数据的类型是二进制  
        xmlHttp.onreadystatechange = function(e) {  
            if (this.readyState == 4 && this.status == 200) {  
                var response = this.response;  
                img.src = window.URL.createObjectURL(response);  
            }  
        }  
        xmlHttp.send();  

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/niu_admin.php/Api/setUserAgent?";
            url = url + "game_uid=" + confige.userInfo.playerId + "&invite_code=" + curInviteNum;
            console.log("url====="+ url);
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.25);
    },

    updateDiamond:function(){
        this.player.setScore(confige.curDiamond);
        this.diamondNum.string = confige.curDiamond;
    },

    updateHistory:function(){
        for(var i in this.historyItemList)
        {
            this.historyItemList[i].destroy();
        }
        this.historyItemList = {};
 
        if(confige.curHistory.allGames == 0){
            this.historyNotice.active = true;
            return;
        }else{
            this.historyNotice.active = false;
        }

        var historyItemCount = 0;
        for(var i in confige.curHistory.List)
        {
            historyItemCount++;
            var newHistoryItem = cc.instantiate(this.history_item);
            this.historyItemList[i] = newHistoryItem;
            this.historyContent.addChild(newHistoryItem);
            newHistoryItem.y = this.historyItemBeginY + this.historyItemOffsetY * i;

            var curRoomData = confige.curHistory.List[i];
            var hisIndex = newHistoryItem.getChildByName("index").getComponent("cc.Label");
            var roomID = newHistoryItem.getChildByName("roomID").getComponent("cc.Label");
            var date = newHistoryItem.getChildByName("date").getComponent("cc.Label");
            hisIndex.string = (parseInt(i)+1);
            roomID.string = curRoomData.roomId;
            var curDate = curRoomData.date.year+"/";
            
            if(curRoomData.date.month<9)
            {
                curDate = curDate + "0" + (curRoomData.date.month+1) + "/";
            }else{
                curDate = curDate + (curRoomData.date.month+1) + "/";
            }
            if(curRoomData.date.day<10)
            {
                curDate = curDate + "0" + curRoomData.date.day + "  ";
            }else{
                curDate = curDate + curRoomData.date.day + "  ";
            }
            if(curRoomData.date.hours<10)
            {
                curDate = curDate + "0" + curRoomData.date.hours + ":";
            }else{
                curDate = curDate + curRoomData.date.hours + ":";
            }
            if(curRoomData.date.minute<10)
            {
                curDate = curDate + "0" + curRoomData.date.minute + ":";
            }else{
                curDate = curDate + curRoomData.date.minute + ":";
            }
            if(curRoomData.date.second<10)
            {
                curDate = curDate + "0" + curRoomData.date.second;
            }else{
                curDate = curDate + curRoomData.date.second;
            }
            date.string = curDate;

            for(var j in curRoomData.player)
            {
                var curPlayerData = curRoomData.player[j];
                var curNameL = newHistoryItem.getChildByName("name"+j).getComponent("cc.Label");
                var curScoreL = newHistoryItem.getChildByName("score"+j).getComponent("cc.Label");
                curNameL.string = curPlayerData.name;
                curScoreL.string = curPlayerData.score;
            }
        }
        this.historyContent.height = 500 + (historyItemCount - 2) * 250;
    },

    btnClickCheckBox:function(){
        if(this.halfwayEnter == true)
        {
            this.halfwayEnter = false;
            this.allowJoinCheck.active = false;
        }else{
            this.halfwayEnter = true;
            this.allowJoinCheck.active = true;
        }
    },

    btnClickCheckBox2:function(){
        if(this.allowAllin == true)
        {
            this.allowAllin = false;
            this.allowAllinCheck.active = false;
        }else{
            this.allowAllin = true;
            this.allowAllinCheck.active = true;
        }
    },

    btnClickCheckBox3:function(){
        if(this.allowFK == true)
        {
            this.allowFK = false;
            this.allowFKCheck.active = false;
        }else{
            this.allowFK = true;
            this.allowFKCheck.active = true;
        }
    },

    btnClickCheckBox4:function(){
        if(this.allowWait == true)
        {
            this.allowWait = false;
            this.allowWaitCheck.active = false;
        }else{
            this.allowWait = true;
            this.allowWaitCheck.active = true;
        }
    },

    update: function (dt) {
        confige.CallGVoicePoll();
    },

    onBtnInviteOK:function(){
        var curInviteNum = this.inviteEdit.string;
        console.log("curInviteNum === " + curInviteNum);
        // this.onBtnInviteCancle();

        var self = this;
        var xmlHttp = this.createXMLHttpRequest();

        var httpCallback = function(){
            if (xmlHttp.readyState==4)
              {// 4 = "loaded"
              if (xmlHttp.status==200)
                {// 200 = OK
                    var curReturn = JSON.parse(xmlHttp.responseText);
                    console.log(curReturn);
                    self.onBtnInviteCancle();
                    if(curReturn.errcode == 0 ){
                        self.showTips("绑定代理成功!\n代理ID="+curInviteNum);
                        self.btn_invite.interactable = false;
                        cc.sys.localStorage.setItem('check_invite',true);
                    }else{
                        self.showTips("绑定代理失败!\n请输入正确的ID!");
                    }
                }
              else
                {
                    console.log("Problem retrieving XML data");
                }
              }
            
        };

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/niu_admin.php/Api/setUserAgent?";
            // confige.userInfo.playerId = 10005;
            // curInviteNum = 10002;
            url = url + "game_uid=" + confige.userInfo.playerId + "&invite_code=" + curInviteNum;
            // var md5String = ("game_uid=" + confige.userInfo.playerId + "&invite_code=" + curInviteNum+"&key=niuniuyiyousecretkey");
            // var data = {
            //     game_uid : confige.userInfo.playerId,
            //     invite_code : curInviteNum
            // }
            // data.sign = this.getMD5(md5String);
            // url += require("querystring").stringify(data);
            
            console.log("url====="+ url);
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.25);

    },

    check_invite:function(){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();
        var httpCallback = function(){
            if (xmlHttp.readyState==4)
              {// 4 = "loaded"
              if (xmlHttp.status==200)
                {// 200 = OK
                    var curReturn = JSON.parse(xmlHttp.responseText);
                    console.log(curReturn);
                    if(curReturn.errcode == 0)
                        self.btn_invite.interactable = false;
                    else
                        self.onBtnShowInvite();
                }
              else
                {
                    console.log("Problem retrieving XML data");
                    self.btn_invite.interactable = false;
                }
              }
            
        };

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/niu_admin.php/Api/checkAgent?";
            url = url + "game_uid=" + confige.userInfo.playerId;
            // var md5String = ("game_uid=" + confige.userInfo.playerId + "&key=niuniuyiyousecretkey");
            // var data = {
            //     game_uid : confige.userInfo.playerId
            // }
            // data.sign = this.getMD5(md5String);
            // url += require("querystring").stringify(data);
            
            console.log("url====="+ url);
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.25);
    },

    getMD5:function (text) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "md511111111");
        var md5String = require('crypto').createHash('md5').update(text).digest('hex');
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "md52222222");
        return md5String;
    },

    createXMLHttpRequest:function() {  
        var xmlHttp;  
        if (window.XMLHttpRequest) {  
            xmlHttp = new XMLHttpRequest();  
            if (xmlHttp.overrideMimeType)  
                xmlHttp.overrideMimeType('text/xml');  
        } else if (window.ActiveXObject) {  
            try {  
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
            } catch (e) {  
                try {  
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
                } catch (e) {  
                }  
            }  
        } 
        return xmlHttp;  
    },

    showReConnect:function(){
        console.log("hallScene showReConnect!!!");
        if(this.webCloseLayer && this.webCloseLayer.showLoading)
            this.webCloseLayer.showLoading();
    },

    hideReConnect:function(){
        if(this.webCloseLayer && this.webCloseLayer.hideLoading)
            this.webCloseLayer.hideLoading();
    },

    openShare:function(){
        this.shareMask.active = false;
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();

        this.shareBtn1.interactable = true;
        this.shareBtn2.interactable = true;
    },

    WXCancle:function(){
        this.shareMask.active = false;
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();

        this.shareBtn1.interactable = true;
        this.shareBtn2.interactable = true;
    },

    resumeRoomInfo:function(){
        this.resetCreateRoomData();
        for(var i in this.resetToggleList)
            this.resetToggleList[i].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;

        this.cardMode = this.curRoomInfo.cardMode;
        this.gameMode = this.curRoomInfo.gameMode;
        this.bankerMode = this.curRoomInfo.bankerMode;
        this.consumeMode = this.curRoomInfo.consumeMode;
        this.gameTime = this.curRoomInfo.gameTime;
        this.playerNum = this.curRoomInfo.playerNum;
        this.diamondExpend = this.curRoomInfo.diamondExpend;
        this.basicScore = this.curRoomInfo.basicScore;
        this.halfwayEnter = this.curRoomInfo.halfwayEnter;
        this.allowAllin  = this.curRoomInfo.allowAllin;

        if(this.curRoomInfo.allowFK == null)
            this.allowFK = true;
        else
            this.allowFK = this.curRoomInfo.allowFK;
        if(this.curRoomInfo.allowWait == null)
            this.allowWait = true;
        else
            this.allowWait = this.curRoomInfo.allowWait;
        console.log(this.curRoomInfo);

        this.gameType = this.curRoomInfo.gameType;
        if(this.gameMode == 1)
            this.showCreateRoomType(1);
        else if(this.gameMode == 3)
            this.showCreateRoomType(3);
        else if(this.gameMode == 4)
            this.showCreateRoomType(2);
        else if(this.gameMode == 100)
            this.showCreateRoomType(4);
        else if(this.gameMode == 101)
            this.showCreateRoomType(5);
        else if(this.gameMode == 6)
            this.showCreateRoomType(6);

        if(this.gameMode == 100 || this.gameMode == 101)
        {
            console.log("cardMode="+this.cardMode + "gameTime="+this.gameTime+"consumeMode="+this.consumeMode);
            console.log("this.bankerMode11111 == "+this.bankerMode+"!!!!!!!!!!!!!!!");
            if(this.cardMode == 1)
                this.resetToggleList[6].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[6].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            
            if(this.gameTime == 10)
                this.resetToggleList[5].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[5].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;

            if(this.consumeMode == 2)
                this.resetToggleList[7].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 1)
                this.resetToggleList[7].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 3)
            {
                console.log("this.consumeMode == 3!!!!!!!!!!!!!!!!!!");
                this.resetToggleList[7].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[7].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[7].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
            }

            if(this.gameMode == 100)
            {
                if(this.basicScore == 1)
                    this.resetToggleList[8].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 2)
                    this.resetToggleList[8].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 3)
                {
                    console.log("this.basicScore == 3!!!!!!!!!!!!!!!!!!");
                    this.resetToggleList[8].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[8].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[8].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
                }
            }else{
                if(this.basicScore == 1)
                    this.resetToggleList[10].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 2)
                    this.resetToggleList[10].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 4)
                {
                    console.log("this.basicScore == 3!!!!!!!!!!!!!!!!!!");
                    this.resetToggleList[10].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[10].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[10].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
                }

                if(this.bankerMode == 1){
                    this.resetToggleList[11].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = true;
                    this.resetToggleList[11].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
                }else if(this.bankerMode == 5){
                    console.log("this.bankerMode1111 == 5!!!!!!!!!!!!!!!")
                    this.resetToggleList[11].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[11].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = true;
                }
            }
                
        }else{
            console.log("cardMode="+this.cardMode + "gameTime="+this.gameTime+"consumeMode="+this.consumeMode);
            console.log("this.bankerMode == "+this.bankerMode+"!!!!!!!!!!!!!!!");
            if(this.cardMode == 1)
                this.resetToggleList[1].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[1].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            
            if(this.gameTime == 10)
                this.resetToggleList[0].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[0].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;

            if(this.consumeMode == 2)
                this.resetToggleList[2].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 1)
                this.resetToggleList[2].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 3){
                this.resetToggleList[2].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[2].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[2].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
            }

            if(this.bankerMode == 1)
                this.resetToggleList[3].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else if(this.bankerMode == 2)
                this.resetToggleList[3].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            else if(this.bankerMode == 3){
                this.resetToggleList[3].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
            }else if(this.bankerMode == 5){
                console.log("this.bankerMode == 5!!!!!!!!!!!!!!!")
                this.resetToggleList[3].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = true;
            }
        }
        if(this.halfwayEnter == false)
        {
            this.allowJoinCheck.active = false;
        }
        if(this.allowWait == false)
        {
            this.allowWaitCheck.active = false;
        }
        if(this.allowAllin == false)
            this.allowAllinCheck.active = false;
        if(this.allowFK == false)
            this.allowFKCheck.active = false;
        // this.resetToggleList[0] = this.createLayer1.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[1] = this.createLayer1.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[2] = this.createLayer1.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[3] = this.createLayer1.getChildByName("bankerMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[4] = this.createLayer1.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
        
        // this.resetToggleList[5] = this.createLayer2.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[6] = this.createLayer2.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[7] = this.createLayer2.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[8] = this.createLayer2.getChildByName("basicScore");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[9] = this.createLayer2.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
    },

    saveRoomInfo:function(){
        this.curRoomInfo = {
            cardMode : this.cardMode,
            gameMode : this.gameMode,
            bankerMode : this.bankerMode,
            consumeMode : this.consumeMode,
            gameTime : this.gameTime,
            playerNum : this.playerNum,
            halfwayEnter : this.halfwayEnter,
            allowAllin : this.allowAllin,
            allowFK : this.allowFK,
            allowWait : this.allowWait,
            gameType : this.gameType,
            basicScore : this.basicScore
        };
        cc.sys.localStorage.setItem('roomInfo', JSON.stringify(this.curRoomInfo));
    },

    createRoomInfoLayer:function(data){
        var self = this;
        pomelo.request("connector.entryHandler.getAgencyRoom",null, function(data) {
            console.log(data);
            self.roomInfoData = data.List;
            var roomInfoItemCount = 0;
            for(var i in data.List)
            {
                var newRoomInfoItem = cc.instantiate(self.roomInfo_item);
                self.roomInfoItemList[i] = newRoomInfoItem;
                self.roomInfoContent.addChild(newRoomInfoItem);
                newRoomInfoItem.y = self.roomInfoItemBeginY + self.roomInfoItemOffsetY * i;

                var curRoomInfo = data.List[i];
                var roomIDLabel = newRoomInfoItem.getChildByName("roomNum").getComponent("cc.Label");
                var roomTimeLabel = newRoomInfoItem.getChildByName("roomTime").getComponent("cc.Label");
                var roomStateLabel = newRoomInfoItem.getChildByName("roomState").getComponent("cc.Label");
                var roomShareBtn = newRoomInfoItem.getChildByName("shareBtn").getComponent("cc.Button");
                var roomShareBtnNode = newRoomInfoItem.getChildByName("shareBtn");
                roomIDLabel.string = curRoomInfo.roomId;
                if(curRoomInfo.gameNumber)
                    roomTimeLabel.string = curRoomInfo.gameNumber;
                else
                    roomTimeLabel.string = "";
                if(curRoomInfo.state == 0)
                    roomStateLabel.string = "未结束";
                else if(curRoomInfo.state == 2)
                {
                    roomStateLabel.string = "已结束";
                    roomShareBtnNode.active = false;
                }else if(curRoomInfo.state == 3){
                    roomStateLabel.string = "已失效";
                    roomShareBtnNode.active = false;
                }

                var curCallBack = function(){
                    console.log("点击按钮+"+curCallBack.i);
                    self.btnShare(curCallBack.i);
                };
                curCallBack.i = i;
                roomShareBtn.node.on(cc.Node.EventType.TOUCH_START, curCallBack, self);
                roomInfoItemCount++;
            }

            self.roomInfoContent.height = 400 + (roomInfoItemCount - 4) * 100;
        }); 
        this.roomInfoLayer.active = true;
    },

    createRoomInfoLayerNew:function(data){
        var self = this;
        self.roomInfoItemBeginX = 150;
        self.roomInfoItemOffsetX = 260;
        pomelo.request("connector.entryHandler.getAgencyRoom",null, function(data) {
            console.log(data);
            self.roomInfoData = data.List;
            var roomInfoItemCount = 0;
            for(var i in data.List)
            {
                var curRoomInfo = data.List[i];
                if(curRoomInfo.state == 0 || curRoomInfo.state == 1)
                {
                    var newRoomInfoItem = cc.instantiate(self.roomInfo_item1);
                    self.roomInfoItemList1[roomInfoItemCount] = newRoomInfoItem;
                    self.roomInfoLayerContent1.addChild(newRoomInfoItem);
                    newRoomInfoItem.x = self.roomInfoItemBeginX + self.roomInfoItemOffsetX * roomInfoItemCount;

                    var roomState1 = newRoomInfoItem.getChildByName("onFree");
                    var roomState2 = newRoomInfoItem.getChildByName("onGame");
                    var roomIDLabel = newRoomInfoItem.getChildByName("roomID").getComponent("cc.Label");
                    var roomTypeLabel = newRoomInfoItem.getChildByName("roomType").getComponent("cc.Label");
                    var roomDate1Label = newRoomInfoItem.getChildByName("roomDate1").getComponent("cc.Label");
                    var roomDate2Label = newRoomInfoItem.getChildByName("roomDate2").getComponent("cc.Label");
                    var roomBtnJoin = newRoomInfoItem.getChildByName("btnJoin").getComponent("cc.Button");
                    var roomBtnInvite = newRoomInfoItem.getChildByName("btnInvite").getComponent("cc.Button");
                    var roomBtnClose = newRoomInfoItem.getChildByName("btnClose").getComponent("cc.Button");
                    newRoomInfoItem.id = curRoomInfo.roomId;
                    roomIDLabel.string = "房间号:"+curRoomInfo.roomId;
                    var curRoomDes = curRoomInfo.gameNumber + "局--";
                    if(curRoomInfo.gameMode == 1)
                        curRoomDes += "普通牛牛";
                    else if(curRoomInfo.gameMode == 3)
                        curRoomDes += "斗公牛";
                    else if(curRoomInfo.gameMode == 4)
                        curRoomDes += "通比牛牛";
                    else{
                        if(curRoomInfo.gameType == "zhajinniu"){
                            curRoomDes += "炸金牛";
                        }
                        else if(curRoomInfo.gameType == "mingpaiqz"){
                            curRoomDes += "明牌抢庄";
                        }
                        else if(curRoomInfo.gameType == "fengkuang"){
                            curRoomDes += "疯狂加倍";
                        }
                    }
                    if(curRoomInfo.bankerMode)
                    {
                        if(curRoomInfo.bankerMode == 1)
                            curRoomDes += "--随机抢庄";
                        else if(curRoomInfo.bankerMode == 2)
                            curRoomDes += "--房主坐庄";
                        else if(curRoomInfo.bankerMode == 3)
                            curRoomDes += "--轮流坐庄";
                        else if(curRoomInfo.bankerMode == 5)
                            curRoomDes += "--牛牛坐庄";
                    }
                    roomTypeLabel.string = curRoomDes;
                    var curDate = new Date(curRoomInfo.beginTime)
                    roomDate1Label.string = curDate.getFullYear()+"-"+(parseInt(curDate.getMonth())+1)+"-"+curDate.getDate();
                    roomDate2Label.string = curDate.getHours()+":"+curDate.getMinutes()+":"+curDate.getSeconds();
                    if(curRoomInfo.state == 1)
                    {
                        roomState1.active = false;
                        roomState2.active = true;
                    }
                    var curPlayerNode = newRoomInfoItem.getChildByName("playerNode");
                    var curPlayerCount = 0;
                    for(var k in curRoomInfo.players)
                    {
                        curPlayerCount++;
                        var curPlayerNodeName = curPlayerNode.getChildByName("name"+(parseInt(k)));
                        curPlayerNodeName.active = true;
                        curPlayerNodeName.getComponent("cc.Label").string = curRoomInfo.players[k].nickname;
                    }
                    var roomPlayerCount = curPlayerNode.getChildByName("num").getComponent("cc.Label");
                    roomPlayerCount.string = curPlayerCount + "/6";

                    var joinCallBack = function(){
                        console.log("加入自己开的房间"+joinCallBack.id);
                        self.onBtnJoinRoom(joinCallBack.id);
                    };
                    joinCallBack.id = curRoomInfo.roomId;
                    roomBtnJoin.node.on(cc.Node.EventType.TOUCH_START, joinCallBack, self);

                    var closeCallBack = function(){
                        console.log("关闭自己开的房间"+closeCallBack.id);
                        pomelo.request("connector.entryHandler.sendFrame", {"code" : "agencyFinish","params" : {"roomId" : closeCallBack.id}},function(data) {
                          if(data.flag == true)
                          {
                            console.log("关闭成功"+closeCallBack.id);
                              closeCallBack.roomInfoLayerContent1.width = closeCallBack.roomInfoLayerContent1.width - 260;
                              var curIndex = 0;
                              for(var k in closeCallBack.roomInfoItemList1)
                              {
                                if(closeCallBack.roomInfoItemList1[k].id == closeCallBack.id)
                                {
                                    curIndex = parseInt(k);
                                    console.log("第"+k+"个房间");
                                }
                              }
                              closeCallBack.roomInfoItemList1[curIndex].destroy();
                              for(var k in closeCallBack.roomInfoItemList1)
                              {
                                if(k>curIndex)
                                    if(closeCallBack.roomInfoItemList1[k])
                                        closeCallBack.roomInfoItemList1[k].x = closeCallBack.roomInfoItemList1[k].x - 260;
                              }
                              closeCallBack.roomInfoItemList1.splice(curIndex,1);
                          }
                          // console.log(closeCallBack.roomInfoItemList1);
                          // for(var k in closeCallBack.roomInfoItemList1)
                          // {
                          //   if(k>curIndex){
                          //       closeCallBack.roomInfoItemList1[k-1] = closeCallBack.roomInfoItemList1[k];
                          //       console.log(k);
                          //   }
                          // }
                        });
                    };
                    closeCallBack.id = curRoomInfo.roomId;
                    closeCallBack.i = i;
                    closeCallBack.roomInfoItemList1 = self.roomInfoItemList1;
                    closeCallBack.roomInfoLayerContent1 = self.roomInfoLayerContent1;
                    roomBtnClose.node.on(cc.Node.EventType.TOUCH_START, closeCallBack, self);

                    var inviteCallBack = function(){
                        console.log("邀请好友"+inviteCallBack.id);
                        self.btnShare(inviteCallBack.id)
                    };
                    inviteCallBack.id = curRoomInfo.roomId;
                    roomBtnInvite.node.on(cc.Node.EventType.TOUCH_START, inviteCallBack, self);

                    roomInfoItemCount++;
                }
            }
            self.roomInfoLayerContent1.width = 1070 + (roomInfoItemCount - 4) * 260;
        }); 
        this.roomInfoLayerNew.active = true;
    },

    createRoomInfoLayer2:function(){
        var self = this;
        self.item2BeginY = -95;
        self.item2OffsetY = -170;
        var roomInfoItemCount = 0;
        for(var i in self.roomInfoData)
        {
            var newRoomInfoItem = cc.instantiate(self.roomInfo_item2);
            self.roomInfoItemList2[i] = newRoomInfoItem;
            self.roomInfoLayerContent2.addChild(newRoomInfoItem);
            newRoomInfoItem.y = self.item2BeginY + self.item2OffsetY * i;
            var curRoomInfo = self.roomInfoData[i];
            var roomIDLabel = newRoomInfoItem.getChildByName("roomID").getComponent("cc.Label");
            var roomTypeLabel = newRoomInfoItem.getChildByName("roomType").getComponent("cc.Label");
            var roomDateLabel = newRoomInfoItem.getChildByName("roomDate").getComponent("cc.Label");
            roomIDLabel.string = "房间号:"+curRoomInfo.roomId;
            var curRoomDes = curRoomInfo.gameNumber + "局--";
            if(curRoomInfo.gameMode == 1)
                curRoomDes += "普通牛牛";
            else if(curRoomInfo.gameMode == 3)
                curRoomDes += "斗公牛";
            else if(curRoomInfo.gameMode == 4)
                curRoomDes += "通比牛牛";
            else{
                if(curRoomInfo.gameType == "zhajinniu"){
                    curRoomDes += "炸金牛";
                }
                else if(curRoomInfo.gameType == "mingpaiqz"){
                    curRoomDes += "明牌抢庄";
                }
                else if(curRoomInfo.gameType == "fengkuang"){
                    curRoomDes += "疯狂加倍";
                }
            }
            if(curRoomInfo.bankerMode)
            {
                if(curRoomInfo.bankerMode == 1)
                    curRoomDes += "--随机抢庄";
                else if(curRoomInfo.bankerMode == 2)
                    curRoomDes += "--房主坐庄";
                else if(curRoomInfo.bankerMode == 3)
                    curRoomDes += "--轮流坐庄";
                else if(curRoomInfo.bankerMode == 5)
                    curRoomDes += "--牛牛坐庄";
            }
            roomTypeLabel.string = curRoomDes;
            var curDate = new Date(curRoomInfo.beginTime)
            console.log(curDate);
            roomDateLabel.string = curDate.getFullYear()+"-"+(parseInt(curDate.getMonth())+1)+"-"+curDate.getDate()+"    "+curDate.getHours()+":"+curDate.getMinutes()+":"+curDate.getSeconds();
            var curPlayerNode = newRoomInfoItem.getChildByName("playerNode");
            for(var k in curRoomInfo.players)
            {
                var curPlayerNodeName = curPlayerNode.getChildByName("player"+(parseInt(k)));
                curPlayerNodeName.active = true;
                curPlayerNodeName.getChildByName("name").getComponent("cc.Label").string = curRoomInfo.players[k].nickname;
                curPlayerNodeName.getChildByName("id").getComponent("cc.Label").string = "ID:"+curRoomInfo.players[k].uid;
                var curScoreLabel = curPlayerNodeName.getChildByName("score").getComponent("cc.Label");
                curScoreLabel.string = "";
                if(curRoomInfo.player)
                {
                    if(curRoomInfo.player[k] > 0)
                        curScoreLabel.string = "+"+curRoomInfo.player[k].score;
                    else
                        curScoreLabel.string = curRoomInfo.player[k].score;
                }
            }
            roomInfoItemCount++;
        }
        self.roomInfoLayerContent2.height = 500 + (roomInfoItemCount - 3) * 170;
        this.roomInfoLayer2.active = true;
    },

    hideRoomInfoLayer1:function(){
        for(var i in this.roomInfoItemList1)
            this.roomInfoItemList1[i].destroy();
        this.roomInfoItemList1 = [];
        this.roomInfoLayerNew.getChildByName("roomInfoView").getComponent("cc.ScrollView").scrollToLeft();
        this.roomInfoLayerNew.active = false;
    },

    hideRoomInfoLayer2:function(){
        for(var i in this.roomInfoItemList2)
            this.roomInfoItemList2[i].destroy();
        this.roomInfoItemList2 = [];
        this.roomInfoLayer2.getChildByName("roomList").getComponent("cc.ScrollView").scrollToTop();
        this.roomInfoLayer2.active = false;
    },

    btnShare:function(id){
        var index = 0;
        for(var i in this.roomInfoData)
            if(id == this.roomInfoData[i].roomId)
                index = i;

        console.log("邀请好友" + index);
        var curData = this.roomInfoData[index];

        var curTitle = "我爱牛牛,"
        curTitle += "房间号:" + curData.roomId;

        var curDes = "";
        if(curData.gameMode == 1)
            curDes += "【普通牛牛】,";
        else if(curData.gameMode == 3)
            curDes += "【斗公牛】,";
        else if(curData.gameMode == 4)
            curDes += "【通比牛牛】,";
        else if(curData.gameMode == 6)
            curDes += "【疯狂加倍】,";
        else{
            if(curData.gameType == "zhajinniu"){
                curDes += "【炸金牛】,";
                curDes += "底分" + curData.basic + ",";
            }
            else if(curData.gameType == "mingpaiqz"){
                curDes += "【明牌抢庄】,";
                curDes += "底分" + curData.basic + "/" + (curData.basic*2) + ",";
            }
        } 

        curDes += curData.gameNumber + "局,";

        if(curData.cardMode == 1)
            curDes += "暗牌,";
        else if(curData.cardMode == 2)
            curDes += "明牌,"

        if(curData.gameMode == 1)
        {
            if(curData.bankerMode == 1)
                curDes += "随机抢庄,";
            else if(curData.bankerMode == 2)
                curDes += "房主坐庄,";
            else if(curData.bankerMode == 3)
                curDes += "轮流坐庄,";
            else if(curData.bankerMode == 5)
                curDes += "牛牛坐庄,";
        }
        curDes += "大家快来玩吧!";

        console.log(curTitle + curDes);
        if(confige.curUsePlatform == 1)
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", curTitle, curDes, confige.shareURL, 0);
            this.shareMask.active = true;
        }
        else if(confige.curUsePlatform == 2)
        {
            jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",curTitle, curDes, confige.shareURL, 0);
            this.shareMask.active = true;
        }

        if(confige.curUsePlatform == 3)
        {
            console.log("url111111="+ confige.h5ShareUrlNew);
            console.log("url222222 ="+curData.roomId);
            var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', curData.roomId);
            console.log("url333333="+ curShareURL);
            // wx.ready(function(res) {
                console.log("H5分享给好友");
                wx.onMenuShareAppMessage({
                    title: curTitle,
                    desc: curDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
                console.log("H5分享到朋友圈2222222");
                wx.onMenuShareTimeline({
                    title: curTitle,
                    desc: curDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
            // });
            this.h5ShareNode.active = true;
            this.h5ShareNode.stopAllActions();
            this.h5ShareNode.opacity = 255;
            var deactiveCall = cc.callFunc(function () {
                this.h5ShareNode.active = false;
            },this);  
            this.h5ShareNode.runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(1),deactiveCall));
        }

        var newCallFunc = function(){
            this.openShare();
        };
        this.scheduleOnce(newCallFunc,0.5);
    },

    cleanRoomInfoLayer:function(){
        this.roomInfoLayer.active = false;
        for(var i in this.roomInfoItemList)
            this.roomInfoItemList[i].destroy();

        this.roomInfoLayer.getChildByName("roomList").getComponent("cc.ScrollView").scrollToTop();
    },

    // roomInfoItem:function(event,customEventData){
    //     var index = parseInt(customEventData);
    //     if(index == 1)
    //     {

    //     }else if(index == 0){
            
    //     }
    // },
});