var confige = require("confige");
var lotto = require("lotto");
var giftBag = require("giftBag");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization

    onLoad: function () {
        // cc.loader.onProgress = function(){};
        confige.loadNode.hideNode();
        confige.isGoldMode = false;
        this.topNode = this.node.getChildByName("topNode");
        this.bottomNode = this.node.getChildByName("bottomNode");

        this.newTips = this.node.getChildByName("newTips");
        this.newTipsLabel = this.newTips.getChildByName("tips").getComponent("cc.Label");

        if(cc.sys.platform == cc.sys.IPAD)
            cc.view.setDesignResolutionSize(1280,720,cc.ResolutionPolicy.EXACT_FIT);
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            this.bgNode = this.node.getChildByName("hallBg");
            this.bgNode.height = 790;
            cc.view.setDesignResolutionSize(1280,790,cc.ResolutionPolicy.EXACT_FIT);
            this.h5ShareNode = this.node.getChildByName("h5Share");
            this.h5ShareNode.opacity = 0;
            this.h5ShareNode.active = false;

            this.btn_exit = this.bottomNode.getChildByName("btn_exit").getComponent("cc.Button");
            this.btn_exit.interactable = false;
        }

        this.check_inviteCode();

        console.log("fuck hall on load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        pomelo.clientScene = this;
        confige.curGameScene = this;

        this.curGameMode = 0;
        this.cardModeLayer = this.node.getChildByName("cardModeLayer");
        this.goldModeLayer = this.node.getChildByName("goldModeLayer").getComponent("goldModeLayer");
        this.diamondModeLayer = this.node.getChildByName("diamondModeLayer").getComponent("diamondModeLayer");
        this.friendModeLayer = this.node.getChildByName("friendModeLayer").getComponent("friendModeLayer");
        this.friendModeLayer.onInit();
        this.friendModeLayer.parent = this;
        this.friendModeBg = this.node.getChildByName("friendModeBg");
        this.goldModeLayer.parent = this;
        this.diamondModeLayer.parent = this;

        this.btnReturn = this.topNode.getChildByName("btnReturn");
        this.btnShare = this.bottomNode.getChildByName("btnShare");
        this.playerNode = this.topNode.getChildByName("playerInfoNode");
        this.diamondNode = this.topNode.getChildByName("diamondNode");
        this.goldNode = this.topNode.getChildByName("goldNode");
        this.playerHead = this.playerNode.getChildByName("head").getComponent("cc.Sprite");
        this.playerNick = this.playerNode.getChildByName("name").getComponent("cc.Label");
        this.playerId = this.playerNode.getChildByName("id").getComponent("cc.Label");
        this.playerNick.string = confige.userInfo.nickname;
        this.playerId.string = confige.userInfo.uid;
        this.newMail = this.bottomNode.getChildByName("newMail");
        this.checkMail();

        this.diamondNum = this.diamondNode.getChildByName("diamondNum").getComponent("cc.Label");
        this.diamondNum.string = confige.curDiamond;
        this.goldNum = this.goldNode.getChildByName("goldNum").getComponent("cc.Label");
        this.goldNum.string = "";

        this.goldNum.string = 0;
        if(confige.curGold)
            this.goldNum.string = confige.curGold;
        
        if(confige.meWXHeadFrame != -1)
        {
            cc.log("fuck change head img");
            this.playerHead.spriteFrame = confige.meWXHeadFrame;
        }

        this.paoma = this.topNode.getChildByName("paoma").getChildByName("content").getChildByName("New Label");
        this.paomaLabel = this.paoma.getComponent("cc.Label")
        this.paomaOriText = confige.oriPaomaText;
        this.paomaLabel.string = this.paomaOriText;
        this.paomaTextList = [];
        this.paomaAddOneText(-1);

        this.noticeText = this.node.getChildByName("noticeNode").getChildByName("text").getComponent("cc.Label");
        this.onBtnShowNotice();

        this.tipsBox = this.node.getChildByName("tipsBox");
        this.tipsBoxLabel = this.tipsBox.getChildByName("tips").getComponent("cc.Label");

        this.btn_addDiamond = this.diamondNode.getChildByName("btn_addDiamond").getComponent("cc.Button");
        this.btn_addGold = this.goldNode.getChildByName("btn_addGold").getComponent("cc.Button");
        
        this.loadingLayer = this.node.getChildByName("loadingLayer").getComponent("loadingLayer");
        this.loadingLayer.onInit();

        this.webCloseLayer = this.node.getChildByName("webCloseLayer").getComponent("loadingLayer"); 
        this.webCloseLayer.onInit();

        this.shareMask = this.node.getChildByName("shareMask");
        this.shareMask.active = false;
        
        this.layerNode = this.node.getChildByName("layerNode");
        this.layerNode2 = this.node.getChildByName("layerNode2");

        this.rewardLayer = this.layerNode2.getChildByName("rewardLayer").getComponent("rewardLayer");
        this.rewardLayer.onInit();
        this.billboardLayer = this.layerNode.getChildByName("billboardLayer").getComponent("billboardLayer");
        this.billboardLayer.parent = this;
        this.rotaryLayer = this.layerNode.getChildByName("rotaryLayer").getComponent("rotaryLayer");
        this.rotaryLayer.parent = this;
        this.activityLayer = this.layerNode.getChildByName("activityLayer").getComponent("activityLayer");
        this.activityLayer.parent = this;

        this.beGiveLayer = this.layerNode2.getChildByName("beGiveLayer");
        this.giftLabel = this.beGiveLayer.getChildByName("giftLabel").getComponent("cc.Label");
        this.giftFrameList = {};
        for(var i=1;i<=7;i++)
        {
            this.giftFrameList[i] = this.beGiveLayer.getChildByName("giftNode").getChildByName("gift"+i).getComponent("cc.Sprite").spriteFrame;
        }
        this.giftItemSprite = this.beGiveLayer.getChildByName("rewardItem").getComponent("cc.Sprite");

        // if(confige.signInAward != -1)
        //     this.checkSignInAward();

        this.payLayer = this.layerNode2.getChildByName("payLayer").getComponent("payLayer");
        this.payLayer.onInit();
        this.payLayer.parent = this;

        this.shopLayer = this.layerNode2.getChildByName("shopLayer").getComponent("shopLayer");
        this.shopLayer.onInit();
        this.shopLayer.parent = this;

        this.userInfoLayer = this.layerNode2.getChildByName("userInfoLayer").getComponent("userInfoLayer");
        this.userInfoLayer.onInit("hall","user");
        this.userInfoLayer.parent = this;

        this.otherInfoLayer = this.layerNode2.getChildByName("otherInfoLayer").getComponent("userInfoLayer");
        this.otherInfoLayer.onInit("hall","other");
        this.otherInfoLayer.parent = this;

        this.hallGiftLayer = this.layerNode2.getChildByName("hallGiftLayer").getComponent("hallGiftLayer");
        this.hallGiftLayer.onInit();
        this.hallGiftLayer.parent = this;

        this.sendListLayer = this.layerNode2.getChildByName("sendListLayer").getComponent("sendListLayer");
        this.sendListLayer.onInit();
        this.sendListLayer.parent = this;

        this.mailLayer = this.layerNode2.getChildByName("mailLayer").getComponent("mailLayer");
        this.mailLayer.onInit();
        this.mailLayer.parent = this;

        // if(confige.userInfo.refreshList)
        //     {
        //         var myDate = new Date();
        //         var month = myDate.getMonth();
        //         var date = myDate.getDate();
        //         if(month < 10){
        //             month = "0"+month;
        //         }
        //         if(date < 10){
        //             date = "0"+date;
        //         }
        //         var dateString = parseInt(""+myDate.getFullYear() + month + date);
        //         var refreshDay = confige.userInfo.refreshList.bankruptTime;
        //         var refreshCount = confige.userInfo.refreshList.bankruptTimeCount;
        //         if(dateString < refreshDay)
        //             console.log("今日领取过低保！！！！！");
        //         else{
        //             console.log("可以领取低保！！！！！");
        //             if(confige.curGold <= 2000)
        //             {
        //                 var self = this;
        //                 pomelo.request("connector.award.bankruptGold",null, function(data) {
        //                     console.log(data);
        //                     if(data.flag == true)
        //                     {   
        //                         self.rewardLayer.showOrinal(data.value);
        //                     }else{
        //                         console.log("已经不能再领取了!!!!!!");
        //                         if(confige.curGold < 500)
        //                             self.shopLayer.showLayer(1);
        //                     }
        //                 });  
        //             };
        //         }
        //     }
        
        // this.rewardLayer.showAnimation();

        console.log(lotto);

        if(confige.h5RoomID != "0"){
            var roomId = parseInt(confige.h5RoomID);
            var self = this;
            var joinCallFunc = function(){
                console.log("onBtnJoinRoom joinCallFunc!!!!!");
                self.loadingLayer.showLoading();
            };
            pomelo.clientSend("join",{"roomId":roomId}, joinCallFunc);
            console.log("join room" + roomId);
            confige.h5RoomID = "0";
        }
        console.log("分享路径111111===="+confige.h5ShareUrlNew);

        this.createLayer = -1;
        this.joinLayer = -1;
        this.helpLayer = -1;

        this.settingLayer = -1;
        this.historyLayer = -1;
        this.shareLayer = -1;
        this.giftLayer = -1;
        this.roomInfoLayer = -1;

        this.createLayerLoad = false;
        this.joinLayerLoad = false;
        this.helpLayerLoad = false;

        this.settingLayerLoad = false;
        this.historyLayerLoad = false;
        this.shareLayerLoad = false;
        this.giftLayerLoad = false;
        this.roomInfoLayerLoad = false;

        this.btnAniGold = this.node.getChildByName("btn_goldMode").getChildByName("btnAni").getComponent("cc.Animation");
        this.btnAniCard = this.node.getChildByName("btn_cardMode").getChildByName("btnAni").getComponent("cc.Animation");
        this.btnAniFriend = this.node.getChildByName("btn_friendMode").getChildByName("btnAni").getComponent("cc.Animation");
        // this.btnAniMatch = this.node.getChildByName("btn_matchMode").getChildByName("btnAni").getComponent("cc.Animation");
        this.node.getChildByName("btn_goldMode").runAction(cc.repeatForever(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
            this.btnAniGold.play();
            this.btnAniCard.play();
            this.btnAniFriend.play();
        }, this))));

        // this.getRechargeInfo();

        // var myDate = new Date()
        // var month = myDate.getMonth()
        // var date = myDate.getDate()
        // if(month < 10){
        //     month = "0"+month
        // }
        // if(date < 10){
        //     date = "0"+date
        // }
        // var dateString = parseInt(""+myDate.getFullYear() + month + date)
        // console.log("dateString===",dateString);
        // console.log("recordDate===",confige.userInfo.refreshList.lottoTime);
        // if(dateString > confige.userInfo.refreshList.lottoTime && confige.userInfo.refreshList.lottoCount == 0){
        //     console.log("dateString > confige.userInfo.loginRecord.recordDate!!!!!!!")
        //     cc.sys.localStorage.setItem('canUseRotary',true);
        // }else{
        //     cc.sys.localStorage.setItem('canUseRotary',false);
        // }
        // if(cc.sys.localStorage.getItem('canUseRotary') == "true")
        // {
        //     console.log("rotaryLayer √showLayer!!!!!!!")
        //     if(confige.openGame == true){
        //         this.rotaryLayer.showLayer();
        //         confige.activityActive[0] = true;
        //     }
        // }

        confige.curSceneIndex = 1;

        this.roleAni = this.node.getChildByName("roleAni").getComponent("cc.Animation");
        this.eyeAniNode = this.node.getChildByName("eyeAni");
        this.eyeAni = this.eyeAniNode.getComponent("cc.Animation");
        this.roleOnPlay = false;
        var self = this;
        var callFunc1 = function(){
            if(self.roleOnPlay == false)
            {
                self.roleOnPlay = true;
                self.roleAni.play();
                self.eyeAniNode.runAction(cc.sequence(cc.delayTime(1.8),cc.callFunc(function(){
                    self.roleOnPlay = false;
                })));
            }
            
        };
        this.schedule(callFunc1,5);
        var callFunc2 = function(){
            if(self.roleOnPlay == false)
            {
                self.eyeAniNode.opacity = 255;
                self.roleOnPlay = true;
                self.eyeAni.play();
                self.eyeAniNode.runAction(cc.sequence(cc.delayTime(0.4),cc.callFunc(function(){
                    self.roleOnPlay = false;
                    self.eyeAniNode.opacity = 0;
                })));
            }
        };
        this.schedule(callFunc2,3);

    },
    
    start:function(){
        console.log("fuck hallscene start");
        // if(cc.sys.localStorage.getItem('canUseRotary') == "true")
        //     this.rotaryLayer.showLayer();
        if(confige.firstShowNotice == true)
        {
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
        confige.openGame = false;
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
        },this);     

        this.paoMaSeq = cc.sequence(
            paomaCurMove,
            paomaCallFunc
        );
        this.paoma.runAction(this.paoMaSeq);
    }, 

    onBtnShowLayer:function(event, customEventData){
        var index = parseInt(customEventData);
        var self = this;
        switch(index){
            case  0:
                if(self.createLayer == -1){
                    if(self.createLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/createLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.createLayer = newLayer.getComponent("createLayer");
                            self.createLayer.showLayer();
                            self.createLayer.parent = self;
                        });
                        self.createLayerLoad = true;
                    }
                }else{
                    self.createLayer.showLayer();
                }
                break;
            case  1:
                if(self.joinLayer == -1){
                    if(self.joinLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/joinLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.joinLayer = newLayer.getComponent("joinLayer");
                            self.joinLayer.showLayer();
                            self.joinLayer.parent = self;
                        });
                        self.joinLayerLoad = true;
                    }
                }else{
                    self.joinLayer.showLayer();
                }
                break;
            case  2:
                if(self.roomInfoLayer == -1){
                    if(self.roomInfoLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/roomInfoLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.roomInfoLayer = newLayer.getComponent("roomInfoLayer");
                            self.roomInfoLayer.showLayer();
                            self.roomInfoLayer.parent = self;
                        });
                        self.roomInfoLayerLoad = true;
                    }
                }else{
                    self.roomInfoLayer.showLayer();
                }
                break;
            case  3:
                if(self.shareLayer == -1){
                    if(self.shareLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/shareLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.shareLayer = newLayer.getComponent("shareLayer");
                            self.shareLayer.showLayer();
                            self.shareLayer.parent = self;
                        });
                        self.shareLayerLoad = true;
                    }
                }else{
                    self.shareLayer.showLayer();
                }
                break;
            case  4:
                if(self.historyLayer == -1){
                    if(self.historyLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/historyLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.historyLayer = newLayer.getComponent("historyLayer");
                            self.historyLayer.showLayer();
                            self.historyLayer.parent = self;
                        });
                        self.historyLayerLoad = true;
                    }
                }else{
                    self.historyLayer.showLayer();
                }
                break;
            case  5:
                this.onBtnShowNotice();
                break;
            case  6:
                break;
            case  7:
                if(self.helpLayer == -1){
                    if(self.helpLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/helpLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.helpLayer = newLayer.getComponent("helpLayer");
                            self.helpLayer.showLayer();
                            self.helpLayer.parent = self;
                        });
                        self.helpLayerLoad = true;
                    }
                }else{
                    self.helpLayer.showLayer();
                }
                break;
            case  8:
                if(self.settingLayer == -1){
                    if(self.settingLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/settingLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.settingLayer = newLayer.getComponent("settingLayer");
                            self.settingLayer.showLayer();
                            self.settingLayer.parent = self;
                        });
                        self.settingLayerLoad = true;
                    }
                }else{
                    self.settingLayer.showLayer();
                }
                break;
            case  9:
                this.onBtnGameExit();
                break;
            case  10:
                if(self.giftLayer == -1){
                    if(self.giftLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/giftLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.giftLayer = newLayer.getComponent("giftLayer");
                            self.giftLayer.showLayer();
                            self.giftLayer.parent = self;
                        });
                        self.giftLayerLoad = true;
                    }
                }else{
                    self.giftLayer.showLayer();
                }
                break;
            case 11:
                pomelo.request("connector.ranklist.getRanklist",null, function(data) {
                    console.log(data);
                    if(data.flag == true)
                        self.billboardLayer.showLayer(data.data);
                });  
                break;
            case 12:
                self.rotaryLayer.showLayer();
                break;
            case 13:
                var mailLayer = self.mailLayer;
                pomelo.request("connector.mail.getMailList",null, function(data) {
                    console.log(data);
                    console.log("将会打开邮件界面!!!");
                    mailLayer.updateData(data.data);
                    mailLayer.showLayer();
                });
                break;
            case 14:
                this.activityLayer.showLayer();
                console.log("将会打开活动界面!!!");
                break;
            case 15:
                this.userInfoLayer.showLayer("user");
                break;
        };
    },

    onBtnShowUserInfo:function(){
    },

    onBtnShowNotice:function(){
        var self = this;
        pomelo.request("connector.entryHandler.getNotify",null, function(data) {
            confige.noticeData = data;
            console.log(data);
            if(data[1])
            {
                self.noticeText.string = data[1].content;
                if(data[1].content == "")
                    self.noticeText.string = "暂无公告!";
            }else{
                self.noticeText.string = "暂无公告!";
            }
        });
    },

    updateNotice:function(data){
        self.noticeText.string = data[1].content;
        if(data[1].content == "")
            self.noticeText.string = "暂无公告!";
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

    connectCallBack:function(){

    },

    hideH5ShareNode:function(){
        this.h5ShareNode.stopAllActions();
        this.h5ShareNode.opacity = 0;
        this.h5ShareNode.active = false;
    },

    showTips:function(newTips,type){
        this.tipsBoxLabel.string = newTips;
        this.tipsBox.opacity = 0;
        this.tipsBox.active = true;
        // var tipsAction = cc.sequence(
        //     cc.fadeIn(0.5),
        //     cc.delayTime(3),
        //     cc.fadeOut(0.5)
        // );
        this.tipsBox.runAction(cc.fadeIn(0.5));

        if(type == 1)           //创建成功,隐藏界面
        {
            this.friendModeLayer.hideCreateLayer();
        }else if(type == 2){    //加入失败,清空ID
            this.friendModeLayer.cleanRoomId();
        }
    }, 

    hideTips:function(){
        this.tipsBox.stopAllActions();
        var self = this;
        this.tipsBox.runAction(cc.sequence(cc.fadeIn(0.1),cc.callFunc(function(){
            self.tipsBox.active = false;
        })));
    },
    
    btnAddDiamond:function(event, customEventData){
        var type = parseInt(customEventData);
        this.shopLayer.showLayer(type);
        return;
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
            window.open(confige.payURL);
        cc.sys.openURL(confige.payURL);
    },

    updateNick:function(){
        this.playerNick.string = confige.userInfo.nickname;
    },

    updateDiamond:function(){
        this.diamondNum.string = confige.curDiamond;
    },

    updateGold:function(){
        console.log("updateGold!!!!!!!!");
        if(this && this.goldNum)
            this.goldNum.string = ""+confige.curGold;
    },
    
    update: function (dt) {
        confige.CallGVoicePoll();
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
        //微信分享后的回调
        // if(confige.userInfo.refreshList)
        // {
        //     var myDate = new Date();
        //     var month = myDate.getMonth();
        //     var date = myDate.getDate();
        //     if(month < 10){
        //         month = "0"+month;
        //     }
        //     if(date < 10){
        //         date = "0"+date;
        //     }
        //     var dateString = parseInt(""+myDate.getFullYear() + month + date);
        //     var refreshDay = confige.userInfo.refreshList.shareTime;
        //     var refreshCount = confige.userInfo.refreshList.shareCount;
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "dateString");
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", dateString.toString());
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "refreshDay");
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", refreshDay.toString());
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "refreshCount");
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", refreshCount.toString());
        //     if(dateString < refreshDay)
        //         console.log("今日领取过分享奖励！！！！！");
        //     else{
        //         if(refreshCount == 0)
        //         {
        //             console.log("可以领取分享奖励");
        //             confige.activityActive[1] = true;
        //             this.activityLayer.showLayer(1);
        //         }
        //     }
        // }
        this.shareMask.active = false;
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
        if(this.shareLayer != -1)
        {
            this.shareLayer.shareBtn1.interactable = true;
            this.shareLayer.shareBtn2.interactable = true;
        }
    },

    WXCancle:function(){
        this.shareMask.active = false;
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();

        if(this.shareLayer != -1)
        {
            this.shareLayer.shareBtn1.interactable = true;
            this.shareLayer.shareBtn2.interactable = true;
        }
    },

    h5ShareInit:function(){
        var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', '0');
        if(confige.h5InviteCode != "0")
        {
            curShareURL += "&invite_code=" + confige.h5InviteCode;
        }
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
    },

    layerChange:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 0)
        {
            this.playerNode.x = -441;
            this.playerNode.y = -65;
            this.diamondNode.x = -54;
            this.diamondNode.y = -43;
            this.goldNode.x = 267;
            this.goldNode.y = -43;

            this.btnReturn.active = false;
            
            // if(this.curGameMode == 1)
            //     this.goldModeLayer.hideLayer();
            // else if(this.curGameMode == 2)
            //     this.cardModeLayer.active = false;
            this.goldModeLayer.hideLayer();
            this.diamondModeLayer.hideLayer();
            this.friendModeLayer.hideLayer();
            this.friendModeBg.active = false;
            this.curGameMode = 0;
        }else if(index == 1){
            this.playerNode.x = -322;
            this.playerNode.y = -65;
            this.diamondNode.x = 83;
            this.diamondNode.y = -58;
            this.goldNode.x = 410;
            this.goldNode.y = -62;

            this.btnReturn.active = true;
            this.goldModeLayer.showLayer();
            this.curGameMode = 1;
        }else if(index == 2){
            this.playerNode.x = -322;
            this.playerNode.y = -65;
            this.diamondNode.x = 83;
            this.diamondNode.y = -58;
            this.goldNode.x = 410;
            this.goldNode.y = -62;

            this.btnReturn.active = true;
            this.diamondModeLayer.showLayer();
            this.curGameMode = 2;
        }else if(index == 3){
            this.playerNode.x = -322;
            this.playerNode.y = -65;
            this.diamondNode.x = 83;
            this.diamondNode.y = -58;
            this.goldNode.x = 410;
            this.goldNode.y = -62;

            this.btnReturn.active = true;
            this.friendModeLayer.showLayer();
            this.friendModeBg.active = true;
            this.curGameMode = 3;
        }
    },

    getGiftBag:function(){
        console.log("getGiftBag begin!");
        pomelo.request("connector.award.getGiftBag",null, function(data) {
            console.log(data);
            if(data.flag == true)
            {   
                console.log("领取奖励!!!!!!");
            }else{
                console.log("已经不能再领取了!!!!!!");
            }
        });  
    },

    getRechargeInfo:function(){
        var self = this;
        console.log("getRechargeInfo begin!");
        pomelo.request("connector.award.getRechargeInfo",null, function(data) {
            console.log(data);
            if(data.flag == true)
            {   
                console.log("getRechargeInfo!!!!!!");
                var curGiftBag = data.data.curGiftBag;//当前可用获取礼包的档次
                var curValue = data.data.curValue;//在当前档次充值数值
                var allValue = data.data.allValue;//总充值数值
                var curGiftBagData = giftBag[curGiftBag];
                console.log(curGiftBagData);
                if(curValue >= curGiftBagData.RMB){
                    console.log("达到领取条件！");
                    self.getGiftBag();
                }
                else
                    console.log("未达到领取条件！");
            }else{
                console.log("已经不能再领取了!!!!!!");
            }
        });  
    },
    
    checkSignInAward:function(){
        this.rotaryLayer.onInit();
        this.rotaryLayer.checkSignInAward();
    },

    showNewTips:function(label){
        console.log("showNewTips@@@@@");
        this.newTips.stopAllActions();
        this.newTips.opacity = 0;
        this.newTips.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1.0),cc.fadeOut(0.5)));
        this.newTipsLabel.string = label;
    },

    wxLoginJavaCall:function(code){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();

        var httpCallback = function(){
            var loginJson = JSON.parse(xmlHttp.responseText);
            confige.WX_LOGIN_RETURN = loginJson;
            confige.WX_ACCESS_TOKEN = loginJson.access_token;
            confige.WX_OPEN_ID = loginJson.openid;
            confige.WX_UNIONID = loginJson.unionid;
            confige.WX_REFRESH_TOKEN = loginJson.refresh_token;
            // pomelo.clientLogin(confige.WX_OPEN_ID, confige.WX_ACCESS_TOKEN);
            pomelo.bindWX(confige.WX_OPEN_ID, confige.WX_ACCESS_TOKEN);
            cc.sys.localStorage.setItem("wxRefreshToken",loginJson.refresh_token);
            cc.sys.localStorage.setItem("wxLastLoginDay",confige.getDayCount());
        };

        this.scheduleOnce(function() {
            confige.WX_CODE = code;
            var url = confige.access_token_url;
            url = url.replace("APPID", confige.APP_ID);
            url = url.replace("SECRET", confige.SECRET);
            url = url.replace("CODE", confige.WX_CODE);
            
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.25);
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

    beGive:function(data){
        this.beGiveLayer.active = true;
        this.giftLabel.string = "玩家"+data.source+"赠送给您一个礼物!";
        this.giftItemSprite.spriteFrame = this.giftFrameList[data.giveId];

        this.giftGoldNum = data.gold;
        this.giftCharmNum = data.charm;
    },

    btnGetGift:function(){
        this.rewardLayer.showGiftData(this.giftGoldNum,this.giftCharmNum);
        this.hideBeGiveLayer();
    },

    hideBeGiveLayer:function(){
        this.beGiveLayer.active = false;
    },

    getPayOrder:function(){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();
        var game_uid = confige.userInfo.uid;
        var amount = 600; 
        var httpCallback = function(){
            var loginJson = JSON.parse(xmlHttp.responseText);
            console.log("getPayCallBack@@@@@");
            console.log(loginJson);
        };

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/gold_admin.php/api/getOrderInfo?game_uid=GAME_UID&amount=AMOUNT"
            url = url.replace("GAME_UID", game_uid);
            url = url.replace("AMOUNT", amount);
            
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.1);
    },

    checkMail:function(){
        var self = this;
        pomelo.request("connector.mail.getMailList",null, function(data) {
            console.log(data);
            console.log("checkMail!!!!!");
            confige.curMailData = data.data;
            self.newMail.active = false;
            for(var i in confige.curMailData)
            {
                if(confige.curMailData[i].readState == true || (confige.curMailData[i].affix != false && confige.curMailData[i].gainState == true))
                {
                    self.newMail.active = true;
                    return;
                }
            }
        });
    },

    check_inviteCode:function(){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();
        var httpCallback = function(){
            if (xmlHttp.readyState==4)
            {// 4 = "loaded"
                if (xmlHttp.status==200)
                {// 200 = OK
                  var curReturn = JSON.parse(xmlHttp.responseText);
                  console.log(curReturn);
                  if(curReturn.errcode == 0){
                        confige.h5InviteCode = curReturn.invite_code;
                        console.log("invite_code ===" + curReturn.invite_code);
                  }else{
                        console.log("invite_code ===0000");
                        confige.h5InviteCode = 0;
                  }
                  // self.h5ShareInit();
                }
            }
            
        };

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/niu_admin.php/Api/getInviteCode?game_uid="+confige.userInfo.playerId;
            console.log("url====="+ url);
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.1);
    },
    
});