var gameData = require("gameData");
var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        diamondFrame:{
            default:null,
            type:cc.SpriteFrame
        },
    },

    onDestory:function(){
    },

    onLoad: function () {
        confige.gameBeginWait = false;
        confige.goldNotEnoughOut = false;
        gameData.gameMainScene = this;
        this.consumeType = "gold";
        var newType2 = confige.roomData.roomType.substring(confige.roomData.roomType.length-7,confige.roomData.roomType.length);
        if(newType2 == "diamond"){
            this.node.getChildByName("gameBGNode").getChildByName("gameBg").active = false;
            this.node.getChildByName("gameBGNode").getChildByName("gameBg2").active = true;
            this.consumeType = "diamond";
        }else{
            this.node.getChildByName("gameBGNode").getChildByName("gameBg").active = true;
            this.node.getChildByName("gameBGNode").getChildByName("gameBg2").active = false;
        }

        this.lottoAwardNode = this.node.getChildByName("lottoAwardNode");
        this.lottoAwardLabel = this.lottoAwardNode.getComponent("cc.Label");
        this.basicScore = confige.roomData.rate;
        confige.settleWait = false;
        confige.isChangeDesk = false;
        this.canChangeDesk = false;
        this.needToRefresh = false;

        this.gameAniNode = this.node.getChildByName("gameAniNode").getComponent("gameAniNode");
        this.gameAniNode.onInit(this);
        this.resNode = this.node.getChildByName("resNode");
        confige.h5RoomID = "0";
        this.oldPlayer = this.node.getChildByName("oldPlayer");
        this.oldPlayer.getChildByName("name").getComponent("cc.Label").string = confige.userInfo.nickname;
        this.oldPlayer.getChildByName("score").getComponent("cc.Label").string = "";

        cc.loader.onProgress = function(){};
        confige.loadNode.hideNode();

        if(cc.sys.platform == cc.sys.IPAD)
            cc.view.setDesignResolutionSize(1280,720,cc.ResolutionPolicy.EXACT_FIT);
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
            cc.view.setDesignResolutionSize(1280,910,cc.ResolutionPolicy.EXACT_FIT);
        this.gameBGNode = this.node.getChildByName("gameBGNode").getComponent("gameBGNode");
        this.gameBGNode.onInit();

        this.playerNode = this.node.getChildByName("playerNode");
        this.infoNode = this.node.getChildByName("infoNode");
        this.playerLoadOK = false;
        this.infoLoadOK = false;
        this.doLaterLoad = false;
        var self = this;
        cc.loader.loadRes("prefabs/game/goldMode/goldInfoNode", cc.Prefab, function (err, prefabs) {
            var newLayer = cc.instantiate(prefabs);
            self.infoNode.addChild(newLayer);
            self.gameInfoNode = newLayer.getComponent("gameInfoNode");
            self.gameInfoNode.onInit();
            self.infoLoadOK = true;
            if(self.playerLoadOK == true && self.infoLoadOK == true)
            {
                if(self.doLaterLoad == false)
                {
                    self.doLaterLoad = true;
                    self.loadRes1();
                }
            }
        });
        cc.loader.loadRes("prefabs/game/goldMode/goldPlayerNode", cc.Prefab, function (err, prefabs) {
            var newLayer = cc.instantiate(prefabs);
            self.playerNode.addChild(newLayer);
            self.gamePlayerNode = newLayer.getComponent("gamePlayerNode");
            self.gamePlayerNode.onInit();
            self.playerLoadOK = true;
            if(self.playerLoadOK == true && self.infoLoadOK == true)
            {
                if(self.doLaterLoad == false)
                {
                    self.doLaterLoad = true;
                    self.loadRes1();
                }
            }
            self.oldPlayer.active = false;
        });
        
        console.log("gameScene Load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    },

    start: function () {

    },
    
    loadLater:function(){
        console.log("loadLater!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        pomelo.clientScene = this;
        confige.curGameScene = this;
        
        this.sceneLoadOver = false;
        this.timeCallFunc = -1;
        this.waitForSettle = false;

        this.cardMode = confige.roomData.cardMode;
        this.gameMode = confige.roomData.gameMode;
        this.bankerMode = confige.roomData.bankerMode;
        this.time_rob = Math.ceil(confige.roomData.TID_ROB_TIME/1000);
        this.time_betting = Math.ceil(confige.roomData.TID_BETTING/1000);
        this.time_settlement = Math.ceil(confige.roomData.TID_SETTLEMENT/1000);
        this.time_waitting = Math.ceil(confige.roomData.TID_WAITING_TIME/1000);
        this.meChair = 0;
        this.curBankerChair = 0;

        this.isMingCardQZ = false;
        
        console.log("roomType======="+confige.roomData.roomType);
        
        var newType = confige.roomData.roomType.substring(0,11);
        if(newType == "goldMingpai" || confige.roomData.roomType == "mingpaiqz")
        {
            this.isMingCardQZ = true;
            this.mingcardqzBasicType = confige.roomData.basicType;
            this.initMingCardQZ();
        }else{
            this.gameMode = 1;
        }
        
        this.joinState = confige.roomData.state;
        
        this.gameBegin = false;     //本房间游戏开始
        this.gameStart = false;     //当前局游戏开始
        this.joinLate = false;
        

        this.timerItem = this.node.getChildByName("timerItem").getComponent("timerItem");
        this.timerItem.onInit();


        this.allBetNum = 0;
        this.myBetNum = 0;
        
        this.pushBanker = this.node.getChildByName("btn_pushBanker");
        this.unpushBanker = this.node.getChildByName("btn_unPushBanker");
        this.readyBtn = this.node.getChildByName("btn_ready");
        this.showCardBtn = this.node.getChildByName("btn_showMyCard");
        this.betBtnBox = this.node.getChildByName("betBtnBox");
        this.betBtn1Label = this.betBtnBox.getChildByName("bet1").getChildByName("Label").getComponent("cc.Label");
        this.betBtn2Label = this.betBtnBox.getChildByName("bet2").getChildByName("Label").getComponent("cc.Label");
        this.betBtn3Label = this.betBtnBox.getChildByName("bet3").getChildByName("Label").getComponent("cc.Label");
        this.betBtn1Label.string = 1*this.basicScore;
        this.betBtn2Label.string = 5*this.basicScore;
        this.betBtn3Label.string = 10*this.basicScore;

        this.betNumMax = 20;
        if(this.isMingCardQZ == false)
        {
            
            if(confige.roomData.basicType == 0)
            {
                this.betBtnBox.getChildByName("bet1").getChildByName("Label").getComponent("cc.Label").string = 1*this.basicScore;
                this.betBtnBox.getChildByName("bet2").getChildByName("Label").getComponent("cc.Label").string = 2*this.basicScore;
                this.betBtnBox.getChildByName("bet3").getChildByName("Label").getComponent("cc.Label").string = 3*this.basicScore;
                this.betBtnBox.getChildByName("bet4").getChildByName("Label").getComponent("cc.Label").string = 5*this.basicScore;
                this.betNumMax = 5;
                this.niuniuBetType = 0;
            }else if(confige.roomData.basicType == 1){
                this.betBtnBox.getChildByName("bet1").getChildByName("Label").getComponent("cc.Label").string = 1*this.basicScore;
                this.betBtnBox.getChildByName("bet2").getChildByName("Label").getComponent("cc.Label").string = 5*this.basicScore;
                this.betBtnBox.getChildByName("bet3").getChildByName("Label").getComponent("cc.Label").string = 10*this.basicScore;
                this.betBtnBox.getChildByName("bet4").getChildByName("Label").getComponent("cc.Label").string = 20*this.basicScore;
                this.betNumMax = 20;
                this.niuniuBetType = 1;
            }
        }

        this.gameStatus = this.node.getChildByName("gameStatus");
        this.gameStatusNew = this.node.getChildByName("gameStatusNew");
        this.gameStatusString = this.gameStatusNew.getChildByName("tipsString").getComponent("cc.Label");
        this.gameStatusTime = this.gameStatusNew.getChildByName("tipsTime").getComponent("cc.Label");

        if(this.joinState == 1001)
        {
            this.beginTimeStamp = Date.parse(new Date());
        }
        this.btnCanSend = true;

        this.openCardBox = this.node.getChildByName("openCardBox");
        this.openCardBtn1 = this.openCardBox.getChildByName("btn1");
        this.openCardBtn2 = this.openCardBox.getChildByName("btn2");
        this.openCardImg1 = this.openCardBox.getChildByName("btnImg1");
        this.openCardImg2 = this.openCardBox.getChildByName("btnImg2");

        this.tipsBox = this.node.getChildByName("tipsBox");
        this.tipsBoxLabel = this.tipsBox.getChildByName("tips").getComponent("cc.Label");
    },

    startLater: function () {
        this.gamePlayerNode.onStart();

        if(confige.curReconnectData == -1)  //是否属于重连状态
        {
            if(this.joinState == 1005)
            {
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                    }
                }
                if(this.gameMode == 1 && this.joinLate == false)
                {
                    if(confige.roomPlayer[this.meChair].isActive == true && confige.roomPlayer[this.meChair].isReady == true)
                        this.onServerRobBanker();
                    this.newDisCard(5);
                }
            }
            if(this.joinState != 1001)   //本局游戏已经开始才加入
            {
                this.gameBegin = true;
                this.gameInfoNode.btn_inviteFriend.active = false;
                // this.gameInfoNode.btn_close.interactable = false;
                console.log("本局游戏已经开始才加入,进入观战模式");
                console.log("当前参与游戏的人数===" + this.gamePlayerNode.playerCount);
                var watchPlayer = 0;
                // for(var i=0;i<this.playerCount;i++)
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == false)
                    {
                        watchPlayer ++;
                        console.log("有一个观战的玩家");
                    }
                    if(confige.roomPlayer[i].isBanker == true)
                    {
                        this.curBankerChair = i;
                        this.gamePlayerNode.playerList[confige.getCurChair(this.curBankerChair)].getChildByName("banker").active = true;
                        this.gamePlayerNode.lightBgList[confige.getCurChair(this.curBankerChair)].active = true;
                    }
                }
                this.gamePlayerNode.playerCount -= watchPlayer;
                this.readyBtn.active = false;
                this.gameStart = true;
                this.joinLate = true;
                if(this.cardMode == 2)
                {   
                    if(this.joinState == 1002)
                    {
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {   
                                var curChair = confige.getCurChair(i);
                                if(curChair != 0)
                                    this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(3);

                                if(confige.roomPlayer[i].isBanker == true)
                                {
                                    this.curBankerChair = i;
                                }
                            }
                        }
                    }
                }

                if(this.joinState == 1003)
                {
                    for(var i in confige.roomPlayer)
                    {
                        if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                        {   
                            this.gamePlayerNode.playerCardList[i] = confige.roomData.player[i].handCard;
                            this.gamePlayerNode.playerHandCardList[confige.getCurChair(i)].initCardWithBack();
                            var curChair = confige.getCurChair(i);
                            if(curChair != 0 && confige.roomPlayer[i].isShowCard == true)
                                this.gamePlayerNode.showOneCard(i);
                            this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(5);
                        }
                    }
                }

                if(this.joinState != 1005)      //非抢庄阶段，显示分数和庄家
                {
                    var curBetCount = 0;
                    for(var i in confige.roomPlayer)
                    {
                        if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                        {  
                            var curChair = confige.getCurChair(i);
                            curBetCount += confige.roomData.betList[i];
                            this.gamePlayerNode.curBetNumList[curChair] = confige.roomData.betList[i];
                            
                            // this.playerScoreList[parseInt(i)] -= confige.roomData.betList[i];
                            // this.playerInfoList[curChair].setScore(this.playerScoreList[parseInt(i)]);
                            console.log(this.gamePlayerNode.betNumLabelList);
                            this.gamePlayerNode.betNumLabelList[curChair].string = this.gamePlayerNode.curBetNumList[curChair]*this.basicScore;
                            if(confige.roomPlayer[i].isBanker == false && this.gamePlayerNode.curBetNumList[curChair] != 0)
                                this.gamePlayerNode.betNumNodeList[curChair].active = true;
                        }
                    }
                    this.allBetNum = curBetCount;
                    this.showScorePool(this.allBetNum);
                    // this.gameBGNode.betItemListAddBet(confige.getCurChair(this.curBankerChair),this.allBetNum);
                }

                if(this.isMingCardQZ)
                {
                    if(this.joinState == 1005 || this.joinState == 1002)
                    {
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                            }
                        }
                        // this.onReConnect = true;
                        // this.newDisCard(4);
                        var cardsCount = 0;
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                var curChair = confige.getCurChair(i);
                                this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(4);
                                if(confige.roomPlayer[i].handCard)
                                {
                                    var callFunc = function(){
                                        for(var i in callFunc.cards)
                                        {
                                            this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
                                        }
                                    };
                                    callFunc.cards = confige.roomPlayer[i].handCard;
                                    callFunc.curChair = curChair;
                                    this.scheduleOnce(callFunc,0.2);
                                }
                            }
                        }
                    }   
                    if(this.joinState != 1005 && this.joinState != 1001)
                    {
                        var robStateList = confige.roomData.robState;
                        for(var i in robStateList)
                        {
                            if(robStateList[i] != -1)
                            {
                                if(robStateList[i] > this.curRobMaxNum)
                                    this.curRobMaxNum = robStateList[i];
                            }
                        }
                        if(this.curRobMaxNum == 0)
                            this.curRobMaxNum = 1;
                    }
                    if(this.joinState == 1002)
                    {
                        var betList = confige.roomData.betList;
                        // for(var i in betList)
                        // {
                        //     if(i == this.meChair && i != this.curBankerChair && betList[i] == 0)
                        //     {
                        //         if(confige.roomData.lastScore[this.meChair] > 0)
                        //             this.robBetAllInBtn.interactable = true;

                        //         this.robBetAllInBtn.active = true;
                        //         this.betBtnBox.active = false;
                        //     }
                        // }   
                    }else{
                        var robStateList = confige.roomData.robState;
                        for(var i in robStateList)
                        {
                            this.gamePlayerNode.playerList[i].getChildByName("banker").active = false;
                            if(robStateList[i] != -1)
                            {
                                var curChair = confige.getCurChair(i);
                                if(robStateList[i] > this.curRobMaxNum)
                                    this.curRobMaxNum = robStateList[i];
                                if(robStateList[i] == 0)
                                    this.gamePlayerNode.noRobImgList[curChair].active = true;
                                else{
                                    this.gamePlayerNode.robNumLabelList[curChair].string = robStateList[i];
                                    this.gamePlayerNode.robNumNodeList[curChair].active = true;
                                }
                            }
                        }
                        this.statusChange(2);
                    }
                }                      
            }
        }else{
            this.recoverGame();
            confige.curReconnectData = -1;
        }
        console.log("roomId + meChair === " + (confige.roomData.roomId*10 + this.meChair));
        

        this.sceneLoadOver = true;
        
        //处理缓存的服务器消息
        confige.gameSceneLoadOver = true;
        confige.curSceneIndex = 2;
        var infoCount = confige.gameSceneLoadData.length;
        console.log(confige.gameSceneLoadData);
        for(var i=0;i<infoCount;i++)
        {
            console.log("deal once!!!!!!!!");
            var curInfo = confige.gameSceneLoadData.shift();
            pomelo.dealWithOnMessage(curInfo);
            console.log(curInfo);
        }
        confige.gameSceneLoadData = [];
        console.log(confige.gameSceneLoadData);

        if(this.consumeType == "diamond"){
            this.gameBGNode.scorePool.getChildByName("consume").getComponent("cc.Sprite").spriteFrame = this.diamondFrame;
            this.gameAniNode.coinItemOri.getComponent("cc.Sprite").spriteFrame = this.diamondFrame;
        }

        if(this.joinState == 1001)
        {
            this.gameInfoNode.changeDeskBtnNode.opacity = 255;
            if(confige.isGoldMode == true)
                this.gameInfoNode.changeDeskBtn.interactable = true;
            this.beginTimeStamp = Date.parse(new Date()) - this.beginTimeStamp;
            var newTime = Math.ceil((confige.roomData.curTime - confige.roomData.initialTime)/1000);
            var curShowTime = this.time_waitting - newTime - this.beginTimeStamp;
            console.log("timestemp===",this.beginTimeStamp);
            console.log("timestemp2222===",curShowTime);
            if(confige.roomData.initiativeFlag == false)
            {
                if(curShowTime > 1)
                    this.showGameStatusNew(0,curShowTime);
            }
        }
    },

    setBanker:function(chair){
        this.curBankerChair = chair;
    },

    showScorePool:function(score,type,bankerScore,change){
        console.log("show fuck score pool!!!!!!");
        if(this.isMingCardQZ)
        {
            this.gameBGNode.scorePool.active = true;
            this.gameBGNode.scorePoolNum = parseInt(score);
            this.gameBGNode.scorePoolLabel.string = parseInt(score)*this.basicScore;
            return;
        }
        this.gameBGNode.scorePool.active = true;
        this.gameBGNode.scorePoolLabel.string = parseInt(score)*this.basicScore;
        this.gameBGNode.scorePoolNum = parseInt(score);

        if(bankerScore)
        {
            console.log("curChair === " + this.curBankerChair + "newChiar===" + confige.getCurChair(this.curBankerChair));
            this.gamePlayerNode.playerScoreList[this.curBankerChair] = bankerScore;
            this.gamePlayerNode.playerInfoList[confige.getCurChair(this.curBankerChair)].setScore(this.gamePlayerNode.playerScoreList[this.curBankerChair]);
        }
        if(change === true)
        {
            // this.gameBGNode.betItemRemoveToBanker(confige.getCurChair(this.curBankerChair));
            var callFunc = function(){
                // this.gameBGNode.betItemListClean();
                console.log("fuck you scorePool 丢钱出去！！！！！！！！！！！！！！")
                // this.gameBGNode.betItemListAddBet(confige.getCurChair(this.curBankerChair),callFunc.score);
            };
            callFunc.score = score;
            this.scheduleOnce(callFunc,1);
        }
    },

    showGameStatus:function(index){
        return;
    },

    showGameStatusNew:function(index,times){
        this.gameStatusNew.active = true;
        if(this.gameStatusTimeSchedule)
            this.unschedule(this.gameStatusTimeSchedule);
        if(times == 0)
        {
            this.gameStatusString.string = "";
            this.gameStatusTime.string = "";
            return;
        }
        this.gameStatusNew.stopAllActions();
        this.gameStatusTime.string = times;
        switch(index){
            case 0:
                this.gameStatusString.string = "游戏即将开始:";
                break;
            case 1:
                this.gameStatusString.string = "抢庄中:";
                break;
            case 2:
                this.gameStatusString.string = "下注中:";
                break;
        }
        var repeatTimes = times;
        var self = this;
        this.gameStatusTimeSchedule = function(){
            repeatTimes--;
            if(repeatTimes<0)
            {
                self.gameStatusString.string = "";
                self.gameStatusTime.string = "";
                self.unschedule(self.gameStatusTimeSchedule);
            }else{
                self.gameStatusTime.string = repeatTimes;
            }
        };
        this.schedule(this.gameStatusTimeSchedule,1);
    },    

    hideGameStatus:function(){
        this.gameStatusNew.active = false;
    },

    addBet:function(betNum, chair){
        this.allBetNum = this.allBetNum + betNum;
        if(chair == 0)
            this.myBetNum = this.myBetNum + betNum;
        if(this.gameMode != 3)
            this.showScorePool(this.allBetNum,1);
        this.gamePlayerNode.curBetNumList[chair] += betNum;
        this.gamePlayerNode.betNumLabelList[chair].string = this.gamePlayerNode.curBetNumList[chair]*this.basicScore;
        this.gamePlayerNode.betNumNodeList[chair].active = true;
    },

    onBtnReadyClicked:function(){
        if(this.btnCanSend)
        {
            this.btnCanSend = false;
            pomelo.request("connector.entryHandler.sendData", {"code" : "ready"}, function(data) {
                console.log("flag is : "+ data.flag);
                if(data.flag == true)
                    this.readyBtn.active = false;

                this.btnCanSend = true;
            }.bind(this));
            
        }
    },
    
    onBtnBetClicked:function(event, customEventData){
        //pomelo.clientSend("bet",{"bet":1});
        var betType = parseInt(customEventData);
        var curBetNum = 1;
        if(betType == 0)
            curBetNum = 1;
        else if(betType == 1)
            curBetNum = 2;
        else if(betType == 2)
            curBetNum = 3;
        else if(betType == 3){
            curBetNum = 4;
        }

        var self = this;
        pomelo.clientSend("bet",{"bet": curBetNum},function(){
            console.log("curBetNum======"+curBetNum);
            self.betBtnBox.active = false;
        });

    },
    
    onBtnPushBankerClicked:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        this.pushBanker.active = false;
        this.unpushBanker.active = false;
        if(clickIndex == 1)
        {
            pomelo.clientSend("robBanker",{"flag" : true});
        }else if(clickIndex == 2){
            pomelo.clientSend("robBanker",{"flag" : false});
        }
    },
    
    onServerRobBanker:function(){
        this.hideRobBtn();
        this.hideBetBtn();
        // this.timerItem.setTime(this.time_rob);
        this.showGameStatusNew(1,this.time_rob-2);
        if(this.joinLate == false)
        {
            if(this.isMingCardQZ)
            {
                this.robBtnBox.active = true;
            }else{
                this.pushBanker.active = true;
                this.unpushBanker.active = true;
            }
        }
        console.log("fuck rob banker");
    },
    
    onServerRobBankerReturn:function(data){
        var curChair = confige.getCurChair(data.chair);

        if(this.isMingCardQZ)
        {
            if(data.num > this.curRobMaxNum)
                this.curRobMaxNum = data.num;
            if(data.num == 0)
                this.gamePlayerNode.noRobImgList[curChair].active = true;
            else{
                this.gamePlayerNode.robNumLabelList[curChair].string = data.num;
                this.gamePlayerNode.robNumNodeList[curChair].active = true;
                this.gameAniNode.bankerRunListAdd(curChair);
            }
        }else{
            if(data.flag == 1)
            {
                this.gamePlayerNode.isRobImgList[curChair].active = true;
                this.gameAniNode.bankerRunListAdd(curChair);
            }else if(data.flag == 2){
                this.gamePlayerNode.noRobImgList[curChair].active = true;
            } 
        }
    },

    statusChange:function(index){
        if(index === 1)
        {
            this.showGameStatusNew(2,this.time_betting);
        }
        else if(index === 2)
        {
            this.showGameStatusNew(3,0);
            this.timerItem.setTime(this.time_settlement);
        }
    },
    
    onServerReady:function(chair){
        confige.roomPlayer[confige.getOriChair(chair)].isReady = true;
        console.log(confige.getOriChair(chair) + "号玩家准备");
        this.onReConnect = false;
        this.gamePlayerNode.playerList[chair].getChildByName("isReady").active = true;
        if(this.isMingCardQZ)
        {
            this.curRobMaxNum = 0;
        }
        if(chair == 0)      //当前玩家自己
        {
            this.showCardBtn.active = false;
            this.joinLate = false;

            if(confige.roomData.gameMode != 3)
                this.gameBGNode.scorePool.active = false;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true)
                {   
                    var curChair = confige.getCurChair(i);
                    this.gamePlayerNode.playerHandCardList[curChair].resetCard();
                    this.gamePlayerNode.niuTypeBoxList[curChair].active = false;
                    this.gamePlayerNode.playerList[curChair].getChildByName("banker").active = false;
                    this.gamePlayerNode.betNumNodeList[curChair].active = false;
                    this.gamePlayerNode.betNumLabelList[curChair].string = "0";
                    this.gamePlayerNode.curBetNumList[curChair] = 0;
                    this.gamePlayerNode.lightBgList[curChair].active = false;
                    this.gamePlayerNode.isRobImgList[curChair].active = false;
                    this.gamePlayerNode.noRobImgList[curChair].active = false;
                    this.gamePlayerNode.robNumNodeList[curChair].active = false;
                }
            }
        }
    },
    
    onServerBeginBetting:function(data){
        console.log("onServerBeginBetting@@@@@@@@");
        this.hideRobBtn();
        this.hideBetBtn();
        var bankerChair = data.banker;
        var self = this;
        var callFunc = function(bankerAniTime){
            self.allBetNum = 0;
            self.myBetNum = 0;

            console.log("fuck joinLate =====!!!!!!!!!" + self.joinLate);
            self.statusChange(1);
            self.showGameStatusNew(2,self.time_betting-bankerAniTime);
            console.log(confige.roomPlayer);
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    var curIndex = confige.getCurChair(i);
                    self.gamePlayerNode.isRobImgList[curIndex].active = false;
                    self.gamePlayerNode.noRobImgList[curIndex].active = false;
                }
            }
            console.log("onServerBeginBetting111111");
            self.curBankerChair = bankerChair;
          
            if(confige.roomData.gameMode != 3)
                self.showScorePool(self.allBetNum);

            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true)
                {   
                    self.gamePlayerNode.playerList[confige.getCurChair(i)].getChildByName("banker").active = false;
                    self.gamePlayerNode.lightBgList[confige.getCurChair(i)].active = false;
                }
            }
            console.log("onServerBeginBetting222222");
            if(bankerChair != -1)
            {
                self.gamePlayerNode.playerList[confige.getCurChair(bankerChair)].getChildByName("banker").active = true;
                self.gamePlayerNode.lightBgList[confige.getCurChair(bankerChair)].active = true;
                // this.curBankerChair = confige.getCurChair(bankerChair);
            }
            if(self.isMingCardQZ)
            {
                self.robBtnBox.active = false;
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true)
                    {
                        var curChair = confige.getCurChair(i);
                        if(i != bankerChair)
                            self.gamePlayerNode.robNumNodeList[curChair].active = false;
                    }
                }
                
                if(data.lastScore[self.meChair] > 0 && self.isAllowAllin)
                    self.robBetAllInBtn.interactable = true;
            }
            console.log("onServerBeginBetting333333");
            if(self.joinLate == false)
            {
                if(self.curBankerChair != self.meChair)
                {   
                    if(self.isMingCardQZ)
                    {
                        self.robBetBtnBox.active = true;
                    }else{
                        self.betBtnBox.active = true;
                    }
                }
            }else{
                if(self.joinState == 1005 &&  self.cardMode == 2)
                {
                    for(var i in confige.roomPlayer)
                    {
                        if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                        {
                            var curChair = confige.getCurChair(i);
                            if(curChair != 0)
                            {
                                if(self.playerHandCardList && self.playerHandCardList[curChair])
                                    self.playerHandCardList[curChair].showCardBackWithCount(3);
                            }
                        }
                    }
                }
            }
            console.log("onServerBeginBetting444444");
        };
        this.gameStatusNew.active = false;
        this.gameAniNode.runBankerAni(confige.getCurChair(data.banker),callFunc);
    },

    onServerDealCard:function(handCards){
        this.gameStatusNew.active = false;
        this.hideRobBtn();
        this.hideGameStatus();
        for(var i in handCards)
        {
            if(handCards.hasOwnProperty(i))
            {
                this.gamePlayerNode.playerCardList[i] = handCards[i];
            }
        }
        this.statusChange(2);
        if(this.cardMode == 2 && this.joinLate == false)
        {
            console.log("onServerDealCard11111222");
                this.newDisCard(1);
                var callFunc = function(){
                    if(this.gameStart == true)
                        this.showOpenCard(2);
                };
                this.scheduleOnce(callFunc,0.3);
        }else if(this.isMingCardQZ){
            console.log("onServerDealCard22222");
            // if(this.onReConnect == false)
            // {
                this.newDisCard(1);
                if(this.joinLate == false)
                {
                    var callFunc = function(){
                        if(this.gameStart == true)
                        {
                            if(this.joinLate == false)
                                this.showOpenCard(2);
                        }
                    };
                    this.scheduleOnce(callFunc,0.5);
                }
            // }
        }else{
            console.log("onServerDealCard333333");
             if(this.joinLate == false)
            {
                this.newDisCard(5);
                var curChair = confige.getCurChair(this.meChair);
                var curCardData = this.gamePlayerNode.playerCardList[this.meChair];
                var callFunc = function(){
                    console.log("显示玩家明牌");
                    for(var j=0;j<3;j++)
                    {
                        var index = parseInt(j);
                        this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(index, callFunc.curCardData[index].num, callFunc.curCardData[index].type);
                    }
                    if(this.gameStart == true)
                    {
                        this.showOpenCard(1);
                        this.showOpenCard(2);
                    }
                };
                callFunc.curCardData = curCardData;
                callFunc.curChair = curChair;
                this.scheduleOnce(callFunc,0.5);
            }
        }

        if(this.onReConnect == false)
            {
                this.newDisCard(1);
                if(this.joinLate == false)
                {
                    var callFunc = function(){
                        if(this.gameStart == true)
                        {
                            if(this.joinLate == false)
                                this.showOpenCard(2);
                        }
                    };
                    this.scheduleOnce(callFunc,0.5);
                }
            }
            
        if(this.onReConnect)
        {
            var callFunc6 = function(){
                if(this.isMingCardQZ)
                {
                    for(var i in confige.roomPlayer)
                    {
                        if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                        {  
                            var curChair = confige.getCurChair(i);
                            this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithIndex(4);
                            if(this.joinLate == false)
                                this.showOpenCard(2);
                            console.log("onServerDealCard5555555555");
                        }
                    }
                }
            };
            this.scheduleOnce(callFunc6,0.3);

        }
        console.log("onServerDealCard44444");
        
        if(this.joinLate == false)
        {
            var callFunc2 = function(){
                this.showCardBtn.active = true;
            };
            this.scheduleOnce(callFunc2,0.5);
            this.betBtnBox.active = false;
            if(this.isMingCardQZ)
            {
                this.robBetBtnBox.active = false;
                this.robBetAllInBtn.interactable = false;
            }
        }
    },

    btn_showMyCard:function(){
        pomelo.clientSend("showCard");
        this.showCardBtn.active = false;

        var handCard = this.gamePlayerNode.playerCardList[this.meChair];
        var curNiuType = 0;
            
        curNiuType = confige.getNiuType(handCard);
        this.gamePlayerNode.showNiuType(0, curNiuType.type);
        this.timerItem.hideTimer();
    },
    
    showMingCard:function(cards){
        var cardsCount = 0;
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
            {
                var curChair = confige.getCurChair(i);
            }
        }
        for(var i in cards)
        {
            cardsCount ++;
        }
        
        this.newDisCard(cardsCount);

        var callFunc = function(){
            for(var i in callFunc.cards)
            {
                this.gamePlayerNode.playerHandCardList[0].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
            }
        };
        callFunc.cards = cards;
        this.scheduleOnce(callFunc,0.5);
    },

    onServerSettlement:function(data){
        this.hideBetBtn();
        this.hideRobBtn();
        this.needToRefresh = true;
        confige.settleWait = true;
        this.gameBGNode.scorePool.active = false;
        this.canChangeDesk = true;
        this.gameInfoNode.changeDeskBtnNode.opacity = 255;
        if(confige.isGoldMode == true)
            this.gameInfoNode.changeDeskBtn.interactable = true;
        // for(var i in confige.roomPlayer)
        // {
        //     if(confige.roomPlayer[i].isActive == true)
        //     {   
        //         var curChair = confige.getCurChair(i);
        //         this.gamePlayerNode.betNumNodeList[curChair].active = false;
        //         this.gamePlayerNode.robNumNodeList[curChair].active = false;
        //     }
        // }

        var self = this;
        this.scheduleOnce(function(){
            self.showGameStatusNew(0,this.time_waitting-3);
        },3);
        this.hideOpenCard(1);
        this.hideOpenCard(2);
        this.hideGameStatus()
        for(var i in confige.roomPlayer)
        {            
            if(confige.roomPlayer[i].isActive == true)            
            {
                confige.roomPlayer[i].isReady = false;
            }
            this.gamePlayerNode.isTurnImgList[i].active = false;
        };
        console.log("onServerSettlement 1111111");
        this.statusChange(0);

        console.log("onServerSettlement 222222222");
        //第一步显示玩家手牌
        for(var i in data.result)
        {
            if(data.result.hasOwnProperty(i))
            {
                this.gamePlayerNode.showOneCard(i,0,data.result[i].Comb);
            }
        }
        console.log("onServerSettlement 33333333");
        this.waitForSettle = true;
        this.showCardBtn.active = false;
        this.gameStart = false;
        this.joinLate = false;
        this.gameInfoNode.btn_close.interactable = true;
        this.timerItem.hideTimer();

        //分割筹码
        console.log("分割筹码");
        console.log(data.curScores);
        console.log("onServerSettlement 4444444");
        //第二步延迟显示结算界面
        for(var i in data.result)
        {
            if(data.curScores.hasOwnProperty(i))
            {
                if(i == this.meChair)
                {
                    if(data.curScores[i] >= 0)
                        this.gameAniNode.runGameWinAni();
                    else
                        this.gameAniNode.runGameLoseAni();
                }
            }
        }
        var self = this;

        var showSettleFunc1 = function(){
            for(var i in data.result)
            {
                if(data.curScores.hasOwnProperty(i))
                {
                    if(data.curScores[i] < 0){
                        console.log("?????!!!!!!",data.curScores[i]);
                        this.gameAniNode.createCoinAni(confige.getCurChair(i),confige.getCurChair(this.curBankerChair),data.curScores[i]);
                    }
                }
            }
        };
        this.scheduleOnce(showSettleFunc1,1);

        var showSettleFunc2 = function(){
            for(var i in data.result)
            {
                if(data.curScores.hasOwnProperty(i))
                {
                    if(data.curScores[i] >= 0)
                        this.gameAniNode.createCoinAni(confige.getCurChair(this.curBankerChair),confige.getCurChair(i),data.curScores[i]);
                }
            }
        };
        this.scheduleOnce(showSettleFunc2,2);

        var showSettleFunc3 = function(){
            for(var i in data.result)
            {
                if(data.curScores.hasOwnProperty(i))
                    this.gameAniNode.showScoreAni(confige.getCurChair(i),data.curScores[i]);
            }
            for(var i in data.result)
            {
                if(data.result.hasOwnProperty(i))
                {
                    this.gamePlayerNode.playerScoreList[i] = data.realScores[i];
                    this.gamePlayerNode.playerInfoList[confige.getCurChair(i)].setScore(this.gamePlayerNode.playerScoreList[i]);
                }
            }
        };
        this.scheduleOnce(showSettleFunc3,3);

        var showSettleFunc4 = function(){
            this.gameAniNode.resetScoreAni();

            confige.settleWait = false;
            var infoCount = confige.settleWaitData.length;
            console.log(confige.settleWaitData);
            for(var i=0;i<infoCount;i++)
            {
                console.log("deal user join or leave once!!!!!!!!");
                var curInfo = confige.settleWaitData.shift();
                pomelo.dealWithOnMessage(curInfo);
            }
            confige.settleWaitData = [];

            this.needToRefresh = false;
        };
        this.scheduleOnce(showSettleFunc4,5);
        console.log("onServerSettlement 55555555");
        if(this.gameInfoNode.roomCurTime < this.gameInfoNode.roomMaxTime)
            this.gameInfoNode.roomCurTime ++;
        this.gameInfoNode.roomTime.string = "第" + this.gameInfoNode.roomCurTime + "/" + this.gameInfoNode.roomMaxTime + "局";
            
        this.waitForSettle = false;
    },

    resetScene:function(){
        this.pushBanker.active = false;
        this.unpushBanker.active = false;
        this.showCardBtn.active = false;
        this.betBtnBox.active = false;
        this.timerItem.active = false;
    },

    //根据重连数据重现游戏状态
    recoverGame:function(){
        this.onReConnect = true;
        console.log("处理重连数据");
        console.log("当前参与游戏的人数===" + this.gamePlayerNode.playerCount);
        var watchPlayer = 0;
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == false)
            {   
                watchPlayer ++;
                if(i == this.meChair)
                    this.joinLate = true;
                console.log("有一个观战的玩家");
            }
        }
        this.gamePlayerNode.playerCount -= watchPlayer;

        console.log("on recoverGame() !!!!!!!!!!!!!");
        this.gameInfoNode.roomMaxTime = confige.curReconnectData.roomInfo.maxGameNumber;
        //重置场景
        this.resetScene();
        console.log(confige.roomPlayer);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(confige.roomPlayer[i].isReady == true)
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));

                if(confige.roomPlayer[i].isOnline == false)
                    this.gamePlayerNode.leaveNodeList[confige.getCurChair(i)].active = true;
                else
                    this.gamePlayerNode.leaveNodeList[confige.getCurChair(i)].active = false;
            }
        }
        //重现当前玩家分数和显示庄家
        // console.log(confige.roomPlayer);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(this.gamePlayerNode.playerActiveList[confige.getCurChair(i)] == false)
                {
                    console.log("this.playerActiveList === addone");
                    this.gamePlayerNode.addOnePlayer(confige.roomPlayer[i]);
                }
                this.gamePlayerNode.playerScoreList[i] = confige.curReconnectData.roomInfo.player[i].score - confige.curReconnectData.betList[i];
                this.gamePlayerNode.playerInfoList[confige.getCurChair(i)].setScore(this.gamePlayerNode.playerScoreList[i]);
                if(confige.curReconnectData.roomInfo.player[i].isBanker == true)
                {
                    this.gamePlayerNode.playerList[confige.getCurChair(i)].getChildByName("banker").active = true;
                    this.gamePlayerNode.lightBgList[confige.getCurChair(i)].active = true;
                    this.curBankerChair = i;//confige.getCurChair(i);
                    console.log("重连时庄家==="+this.curBankerChair);
                }
            }
        }
        //重现下注金额
        if(confige.curReconnectData.state != 1001)
        {
            var curBetCount = 0;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    var curChair = confige.getCurChair(i);
                    if(curChair == 0)
                    {
                        this.myBetNum = confige.curReconnectData.betList[i];
                    }
                    curBetCount += confige.curReconnectData.betList[i];
                    this.gamePlayerNode.curBetNumList[curChair] = confige.curReconnectData.betList[i];
                    this.gamePlayerNode.betNumLabelList[curChair].string = this.gamePlayerNode.curBetNumList[curChair]*this.basicScore;
                    if(confige.roomPlayer[i].isBanker == false && this.gamePlayerNode.curBetNumList[curChair] != 0)
                        this.gamePlayerNode.betNumNodeList[curChair].active = true;
                }
            }
            this.allBetNum = curBetCount;
            this.showScorePool(this.allBetNum);
            // this.gameBGNode.betItemListAddBet(confige.getCurChair(this.curBankerChair),this.allBetNum);
            this.readyBtn.active = false;

            //重现当前局数显示
            this.gameInfoNode.roomCurTime = confige.curReconnectData.roomInfo.gameNumber;
            this.gameInfoNode.roomTime.string = "第" + this.gameInfoNode.roomCurTime + "/" + this.gameInfoNode.roomMaxTime + "局";
            console.log("重连"+ this.gameInfoNode.roomTime.string);
            this.gameBegin = true;
            // this.gameInfoNode.btn_close.interactable = false;
            this.gameInfoNode.btn_inviteFriend.active = false;
        }else{
            //重现当前局数显示
            this.gameInfoNode.roomCurTime = confige.curReconnectData.roomInfo.gameNumber + 1;
            this.gameInfoNode.roomTime.string = "第" + this.gameInfoNode.roomCurTime + "/" + this.gameInfoNode.roomMaxTime + "局";
            console.log("重连"+ this.gameInfoNode.roomTime.string);
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    this.gamePlayerNode.playerList[confige.getCurChair(i)].getChildByName("isReady").active = true;
                    if(i == this.meChair)
                        this.readyBtn.active = false;
                }
            }
        }

        switch(confige.curReconnectData.state){
            case 1001:      //空闲阶段
                // this.statusChange(0);
                if(this.curBankerChair != -1){
                    this.gamePlayerNode.playerList[this.curBankerChair].getChildByName("banker").active = false;
                    this.gamePlayerNode.lightBgList[this.curBankerChair].active = false;
                }
                this.gameInfoNode.changeDeskBtnNode.opacity = 255;
                if(confige.isGoldMode == true)
                    this.gameInfoNode.changeDeskBtn.interactable = true;
                break;
            case 1002:      //下注阶段
                // this.statusChange(1);
                if(this.curBankerChair != this.meChair && this.joinLate == false)
                {
                    if(!this.isMingCardQZ)
                        this.betBtnBox.active = true;
                }
                break;
            case 1003:      //发牌阶段
                // this.statusChange(2);
                console.log("case 1003:!!!!!!!!");
                // console.log(confige.roomPlayer);
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        this.gamePlayerNode.playerCardList[i] = confige.curReconnectData.roomInfo.player[i].handCard;
                        console.log("取出玩家的牌数据" + i)
                        console.log(this.gamePlayerNode.playerCardList[i]);
                        this.gamePlayerNode.playerHandCardList[confige.getCurChair(i)].initCardWithBack();
                        if(confige.roomPlayer[i].isShowCard == true)
                            this.gamePlayerNode.showOneCard(i);
                    }
                }
                if(this.joinLate == false)
                {
                    this.gamePlayerNode.showOneCard(this.meChair,-1);
                    this.btn_showMyCard();
                }
                //this.showCardBtn.active = true;
                break;
            case 1004:      //结算阶段
                // this.statusChange(0);
                break;
            case 1005:      //抢庄阶段
                if(this.gameMode == 1)
                {
                    var curPlayerData = confige.curReconnectData.roomInfo.player[this.meChair]
                    if(curPlayerData.isActive == true && curPlayerData.isReady == true)
                    {
                        this.onServerRobBanker();
                        this.newDisCard(4);
                        var cardsCount = 0;

                        var curChair = confige.getCurChair(this.meChair);
                        if(curPlayerData.handCard)
                        {
                            var callFunc = function(){
                                for(var i in callFunc.cards)
                                {
                                    this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
                                }
                            };
                            callFunc.cards = curPlayerData.handCard;
                            callFunc.curChair = curChair;
                            this.scheduleOnce(callFunc,0.2);
                        }
                    }
                }
                break;
            case 1006:
                break;
        }
        
        if(this.cardMode == 2)          //明牌处理
        {
            if(confige.curReconnectData.state == 1002 && this.joinLate == false)
            {
                if(this.isMingCardQZ != true)
                    this.showMingCard(confige.curReconnectData.roomInfo.player[this.meChair].handCard);
            }
        }

       if(this.gameMode == 4)  //开船模式
            var dfsdfsdfsd = 0;

        if(this.gameInfoNode.roomCurTime != 0)
        {
            this.gameInfoNode.btn_inviteFriend.active = false;
            this.gameBegin = true;
        }


        if(this.isMingCardQZ)
        {
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                }
            }
            var curState = confige.curReconnectData.state;
            if(curState != 1005 && curState != 1001)
            {
                var robStateList = confige.curReconnectData.roomInfo.robState;
                for(var i in robStateList)
                {
                    if(robStateList[i] != -1)
                    {
                        if(robStateList[i] > this.curRobMaxNum)
                            this.curRobMaxNum = robStateList[i];
                    }
                }
                if(this.curRobMaxNum == 0)
                    this.curRobMaxNum = 1;
            }
            if(curState == 1005 || curState == 1002)
            {
                // this.newDisCard(4);
                var cardsCount = 0;
                for(var i in confige.curReconnectData.roomInfo.player)
                {
                    var curPlayerData = confige.curReconnectData.roomInfo.player[i]
                    if(curPlayerData.isActive == true && curPlayerData.isReady == true)
                    {
                        var curChair = confige.getCurChair(i);
                        this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(4);
                        if(curPlayerData.handCard)
                        {
                            var callFunc = function(){
                                for(var i in callFunc.cards)
                                {
                                    this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
                                }
                            };
                            callFunc.cards = curPlayerData.handCard;
                            callFunc.curChair = curChair;
                            this.scheduleOnce(callFunc,0.2);
                        }
                    }
                }
                if(curState == 1002)
                {
                    var betList = confige.curReconnectData.betList;
                    for(var i in betList)
                    {
                        if(i == this.meChair && i != this.curBankerChair && betList[i] == 0)
                        {
                            if(confige.curReconnectData.roomInfo.lastScore[this.meChair] > 0 && this.isAllowAllin)
                                this.robBetAllInBtn.interactable = true;

                            this.robBetBtnBox.active = true;
                            this.betBtnBox.active = false;
                        }
                    }   
                }else{
                    var robStateList = confige.curReconnectData.roomInfo.robState;
                    for(var i in robStateList)
                    {
                        this.gamePlayerNode.playerList[i].getChildByName("banker").active = false;
                        if(robStateList[i] != -1)
                        {
                            var curChair = confige.getCurChair(i);
                            if(robStateList[i] > this.curRobMaxNum)
                                this.curRobMaxNum = robStateList[i];
                            if(robStateList[i] == 0)
                                this.gamePlayerNode.noRobImgList[curChair].active = true;
                            else{
                                this.gamePlayerNode.robNumLabelList[curChair].string = robStateList[i];
                                this.gamePlayerNode.robNumNodeList[curChair].active = true;
                            }
                        }else{
                            if(parseInt(i) == this.meChair)
                                this.robBtnBox.active = true;
                        }
                    }
                }
            }   
        }

        confige.curReconnectData = -1;
    },

    connectCallBack:function(){

    },

    onNewGameStart:function(){
        this.hideRobBtn();
        this.hideBetBtn();
        if(this.needToRefresh == true){
            console.log("@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!@@@@@@!!!!!!@@@@@!@!@!@!@##############@#!@#@!#!@#!@#!@#!@#!@#!@#");
            // this.gameInfoNode.btnClickRefresh();
        }
        this.goldReady();

        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(confige.roomPlayer[i].isReady == true)
                {
                    console.log("激活"+i+"号玩家发牌器");
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                }
                this.gamePlayerNode.playerList[confige.getCurChair(i)].getChildByName("banker").active = false;
            }
        }
        this.gameBegin = true;
        this.gameStart = true;
        this.meGiveUp = false;
        this.canChangeDesk = false;
        this.gameInfoNode.changeDeskBtnNode.opacity = 130;
        this.gameInfoNode.changeDeskBtn.interactable = false;
        this.newResetCard();
        console.log("onNewGameStart");
        for(var i=0;i<6;i++)
        {
            this.gamePlayerNode.playerList[i].getChildByName("isReady").active = false;
        }
        this.gameInfoNode.btn_inviteFriend.active = false;
        // this.gameInfoNode.btn_close.interactable = false;
        this.gamePlayerNode.playerCount = this.gamePlayerNode.newPlayerCount;
        this.gamePlayerNode.noShowCardCount = this.gamePlayerNode.playerCount;
        if(confige.roomData.gameMode != 3)
            this.showScorePool(0);
    },

    onNewGameBegin:function(data){
        this.gameStart = true;
        this.gamePlayerNode.playerCount = this.gamePlayerNode.newPlayerCount;
        console.log("onNewGameBegin" + this.gamePlayerNode.playerCount);
        this.allBetNum = 0;
        if(this.isMingCardQZ)
        {
            this.newDisCard(4);
            var cardsCount = 0;
            for(var i in data.player)
            {
                if(data.player[i].isActive == true && data.player[i].isReady == true && data.player[i].handCard)
                {
                    var curChair = confige.getCurChair(i);
                    var callFunc = function(){
                        for(var i in callFunc.cards)
                        {
                            this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
                        }
                    };
                    callFunc.cards = data.player[i].handCard;
                    callFunc.curChair = curChair;
                    this.scheduleOnce(callFunc,0.5);
                }
            }
        }
        this.showScorePool(this.allBetNum);
    },

    update: function (dt) {
        confige.CallGVoicePoll();
    },

    newDisCard:function(times){
        if(times == 1)
            this.gamePlayerNode.cardItemList.disCardOneRound();
        else
            this.gamePlayerNode.cardItemList.disCardWithRoundTime(times);
    },

    newResetCard:function(){
        this.gamePlayerNode.cardItemList.resetCardList();
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(confige.roomPlayer[i].isReady == true)
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
            }
        }
    },

    showOpenCard:function(index){
        this.openCardBox.active = true;
        var moveAction = cc.repeatForever(cc.sequence(cc.moveBy(0.5,cc.p(0,20)),cc.moveBy(0.5,cc.p(0,-20))));
        if(index == 1)
        {
            this.openCardBtn1.active = true;
            this.openCardImg1.active = true;
            this.openCardImg1.y = -280;
            this.openCardImg1.runAction(moveAction);
        }else if(index == 2){
            this.openCardBtn2.active = true;
            this.openCardImg2.active = true;
            this.openCardImg2.y = -280;
            this.openCardImg2.runAction(moveAction);
        }
    },

    hideOpenCard:function(index){
        this.openCardBox.active = true;
        if(index == 1)
        {
            this.openCardBtn1.active = false;
            this.openCardImg1.active = false;            
            this.openCardImg1.stopAllActions();
        }else if(index == 2){
            this.openCardBtn2.active = false;
            this.openCardImg2.active = false;            
            this.openCardImg2.stopAllActions();
        }
    },

    btnOpenCard:function(event,customEventData){
        var index = parseInt(customEventData);
        if(index == 1)
        {
            this.hideOpenCard(1);
            this.gamePlayerNode.playerHandCardList[confige.getCurChair(this.meChair)].setCardWithIndex(3, this.gamePlayerNode.playerCardList[this.meChair][3].num, this.gamePlayerNode.playerCardList[this.meChair][3].type);
        }else if(index == 2){
            this.hideOpenCard(2);
            this.gamePlayerNode.playerHandCardList[confige.getCurChair(this.meChair)].setCardWithIndex(4, this.gamePlayerNode.playerCardList[this.meChair][4].num, this.gamePlayerNode.playerCardList[this.meChair][4].type);
        }
    },

    openShare:function(){
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
    },

    WXCancle:function(){
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
    },

    initMingCardQZ:function(){
        this.isAllowAllin = true;
        this.isAllowAllin = confige.roomData.allowAllin;

        this.isMingCardQZ = true;
        this.mingcardqzLayer = this.node.getChildByName("mingcardqzLayer");
        this.mingcardqzLayer.active = true;
        this.robBtnBox = this.mingcardqzLayer.getChildByName("robBtnBox");
        this.robBetBtnBox = this.mingcardqzLayer.getChildByName("betBtnBox");
        this.mpqzBetNum1 = 0;
        this.mpqzBetNum2 = 0;
        this.mpqzBetNum2 = 0;
        switch(this.mingcardqzBasicType)
        {
            case 1:
                this.mpqzBetNum1 = 1;
                this.mpqzBetNum2 = 2;
                break;
            case 2:
                this.mpqzBetNum1 = 2;
                this.mpqzBetNum2 = 4;
                break;
            case 3:
                this.mpqzBetNum1 = 4;
                this.mpqzBetNum2 = 8;
                break;
            case 4:
                this.mpqzBetNum1 = 1;
                this.mpqzBetNum2 = 3;
                this.mpqzBetNum3 = 5;
                this.robBetBtnBox.getChildByName("bet3").active = true;
                this.robBetBtnBox.getChildByName("bet1").x = -225;
                this.robBetBtnBox.getChildByName("bet2").x = -75;
                this.robBetBtnBox.getChildByName("bet3").x = 75;
                this.robBetBtnBox.getChildByName("bet4").x = 225;
                break;
            case 5:
                this.mpqzBetNum1 = 2;
                this.mpqzBetNum2 = 4;
                this.mpqzBetNum3 = 6;
                this.robBetBtnBox.getChildByName("bet3").active = true;
                this.robBetBtnBox.getChildByName("bet1").x = -225;
                this.robBetBtnBox.getChildByName("bet2").x = -75;
                this.robBetBtnBox.getChildByName("bet3").x = 75;
                this.robBetBtnBox.getChildByName("bet4").x = 225;
                break;
        }
        this.robBetBtnBox.getChildByName("bet1").getChildByName("Label").getComponent("cc.Label").string = this.mpqzBetNum1*this.basicScore;
        this.robBetBtnBox.getChildByName("bet2").getChildByName("Label").getComponent("cc.Label").string = this.mpqzBetNum2*this.basicScore;
        this.robBetBtnBox.getChildByName("bet3").getChildByName("Label").getComponent("cc.Label").string = this.mpqzBetNum3*this.basicScore;
        this.curRobMaxNum = 0;
        this.robBetAllInBtn = this.robBetBtnBox.getChildByName("bet4").getComponent("cc.Button");
        // this.robMaxNumNode = this.gameBGNode.mainBg.getChildByName("curRobNum");
        // this.robMaxNumLabel = this.robMaxNumNode.getChildByName("robMaxNum").getComponent("cc.Label");

        // this.robBetNumNode = this.robMaxNumNode.getChildByName("curBet");
        // this.robBetNumLabel = this.robBetNumNode.getChildByName("robBetNum").getComponent("cc.Label");
        if(this.isAllowAllin == false)
        {
            this.robBetBtnBox.getChildByName("bet3").active = false;
            console.log("不允许推注！！！！！！");
        }
    },

    btnClickRobBox:function(event,customEventData){
        var index = parseInt(customEventData);
        switch(index){
            case 1:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 1});
                break;
            case 2:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 2});
                break;
            case 3:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 3});
                break;
            case 4:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 4});
                break;
            case 0:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 0});
                break;
            case 11:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : this.mpqzBetNum1});
                break;
            case 12:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : this.mpqzBetNum2});
                break;
            case 13:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : this.mpqzBetNum3});
            case 14:
                pomelo.clientSend("useCmd",{"cmd" : "allIn"});
                break;
        }
        this.robBtnBox.active = false;
        this.robBetBtnBox.active = false;
        this.robBetAllInBtn.interactable = false;
    },

    showReConnect:function(){
        gameData.gameInfoNode.showReConnect();
        console.log("showReConnect!!!!!!!!!");
    },

    hideReConnect:function(){
        gameData.gameInfoNode.hideReConnect();
        console.log("hideReConnect!!!!!!!!!");
    },

    sayWithID:function(voiceID){
        pomelo.clientSend("say",{"msg": {"sayType":255, "id": voiceID, "time": this.gameInfoNode.sayTime}});
    },

    loadRes1:function(){
        var self = this;
        var onLoadNext = false;
        var loadCard = false;
        var loadNiutype = false;
        //cardFrame
        cc.loader.loadRes("prefabs/game/cardNode", cc.Prefab, function (err, prefabs) {
            var newNode = cc.instantiate(prefabs);
            self.resNode.addChild(newNode);
            confige.cardFrameMap[0] = newNode.getChildByName("card_00").getComponent("cc.Sprite").spriteFrame;
            for(var j=0;j<4;j++)
            {
                for(var i=1;i<=13;i++)
                {
                    var t = i;
                    if(i == 10)
                        t = 'a';
                    else if(i == 11)
                        t = 'b';
                    else if(i == 12)
                        t = 'c';
                    else if(i == 13)
                        t = 'd';
                    var index = i + j*13;
                    confige.cardFrameMap[index] = newNode.getChildByName("card_"+j+t).getComponent("cc.Sprite").spriteFrame;
                }
            }
            loadCard = true;
            if(loadCard == true && loadNiutype == true)
            {
                if(onLoadNext == false)
                {
                    onLoadNext = true;
                    self.loadLater();
                    self.startLater();
                    self.loadRes2();
                }
            }
        });
        
        
        //niutypeFrame
        cc.loader.loadRes("prefabs/game/niutypeNode", cc.Prefab, function (err, prefabs) {
            var newNode = cc.instantiate(prefabs);
            self.resNode.addChild(newNode);
            for(var i=0;i<=18;i++)
            {
                var spriteFrame = newNode.getChildByName("niu_"+i).getComponent("cc.Sprite").spriteFrame;
                confige.niuTypeFrameMap[i] = spriteFrame;
                if(i <= 10){
                    confige.niuTypeFrameMapFK[i] = spriteFrame;
                }else{
                    switch(i){
                        case 12:
                            confige.niuTypeFrameMapFK[15] = spriteFrame;
                            break;
                        case 13:
                            confige.niuTypeFrameMapFK[16] = spriteFrame;
                            break;
                        case 14:
                            confige.niuTypeFrameMapFK[14] = spriteFrame;
                            break;
                        case 15:
                            confige.niuTypeFrameMapFK[11] = spriteFrame;
                            break;
                        case 16:
                            confige.niuTypeFrameMapFK[12] = spriteFrame;
                            break;
                        case 17:
                            confige.niuTypeFrameMapFK[13] = spriteFrame;
                            break;
                        case 18:
                            confige.niuTypeFrameMapFK[17] = spriteFrame;
                            break;
                    }
                }
            }
            loadNiutype = true;
            if(loadCard == true && loadNiutype == true)
            {
                if(onLoadNext == false)
                {
                    onLoadNext = true;
                    self.loadLater();
                    self.startLater();
                    self.loadRes2();
                }
            }
        });
    },

    loadRes2:function(){
        var self = this;
        //faceFrame
        cc.loader.loadRes("prefabs/game/faceNode", cc.Prefab, function (err, prefabs) {
            var newNode = cc.instantiate(prefabs);
            self.resNode.addChild(newNode);
            for(var i=1;i<=12;i++)
            {
                confige.faceFrameMap[i-1] = newNode.getChildByName(""+i).getComponent("cc.Sprite").spriteFrame;
            }
            confige.loadFaceFrame = true;
        });
        //faceAni
        // cc.loader.loadRes("prefabs/game/faceAniNode", cc.Prefab, function (err, prefabs) {
        //     var newNode = cc.instantiate(prefabs);
        //     self.resNode.addChild(newNode);
        //     for(var i=1;i<=6;i++)
        //         confige.faceAniMap[i] = newNode.getChildByName("faceAni"+i);
        //     confige.loadFaceAni = true;
        // });

        this.initAudio();
    },

    initAudio:function(){
        for(var i=0;i<8;i++)
        {
            cc.loader.loadRes("sound/0/chat" + (i+1),function(index){
                return  function (err, audio) {
                    var curIndex = "female_" + "chat_" + index;
                    confige.audioList[curIndex] = audio;
                }
            }(i));

            cc.loader.loadRes("sound/1/chat" + (i+1),function(index){
                return  function (err, audio) {
                    var curIndex = "male_" + "chat_" + index;
                    confige.audioList[curIndex] = audio;
                }
            }(i));
        }

        for(var i=0;i<6;i++)
        {
            cc.loader.loadRes("sound/F_" + (i+1),function(index){
                return  function (err, audio) {
                    var curIndex = "female_" + "face_" + index;
                    confige.audioList[curIndex] = audio;
                }
            }(i+1));

            cc.loader.loadRes("sound/M_" + (i+1),function(index){
                return  function (err, audio) {
                    var curIndex = "male_" + "face_" + index;
                    confige.audioList[curIndex] = audio;
                }
            }(i+1));
        }
        for(var i=0;i<7;i++)
        {
            cc.loader.loadRes("sound/" + (i+1),function(index){
                return  function (err, audio) {
                    var curIndex = "face_" + index;
                    confige.audioList[curIndex] = audio;
                }
            }(i+1));
        }

        for(var i=0;i<=18;i++)
        {
            cc.loader.loadRes("sound/0/type" + i,function(index){
                return  function (err, audio) {
                    var curIndex = "female_" + "type_" + index;
                    confige.audioList[curIndex] = audio;
                }
            }(i));

            cc.loader.loadRes("sound/1/type" + i,function(index){
                return  function (err, audio) {
                    var curIndex = "male_" + "type_" + index;
                    confige.audioList[curIndex] = audio;
                }
            }(i));
        }

        cc.loader.loadRes("sound/fapai", function (err, audio) {
            confige.audioList["fapai"] = audio;
        });
    },

    showGoldQuit:function(){
        console.log("showGoldQuit!@!!!!@@!@!@!@@");
        if(confige.isChangeDesk == false)
            confige.quitToHallScene(true);
    },

    btnClickTips:function(){
        cc.director.loadScene('HallScenePlus');
        if(confige.curGameScene.gameInfoNode.yuyinTimeOut != -1)
            clearTimeout(confige.curGameScene.gameInfoNode.yuyinTimeOut);
        confige.curGameScene.destroy();
        confige.resetGameData();
        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        {
            confige.GVoiceCall.quitRoom(confige.GVoiceRoomID);
            confige.GVoiceCall.closeListen();
        }
    },

    goldReady:function(){
        this.onReConnect = false;
        if(this.isMingCardQZ)
        {
            this.curRobMaxNum = 0;
        }

        this.showCardBtn.active = false;
        this.joinLate = false;
        if(confige.roomData.gameMode != 3)
            this.gameBGNode.scorePool.active = false;
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {   
                confige.roomPlayer[i].isReady = true;
                var curChair = confige.getCurChair(i);
                this.gamePlayerNode.playerHandCardList[curChair].resetCard();
                if(curChair == 0)
                {
                    this.gamePlayerNode.playerHandCardList[curChair].node.scale = 1.5;
                    // this.gamePlayerNode.playerHandCardList[curChair].node.x = -250;
                    this.gamePlayerNode.playerHandCardList[curChair].node.y = 22;
                }
                this.gamePlayerNode.niuTypeBoxList[curChair].active = false;
                this.gamePlayerNode.playerList[curChair].getChildByName("banker").active = false;
                this.gamePlayerNode.betNumNodeList[curChair].active = false;
                this.gamePlayerNode.betNumLabelList[curChair].string = "0";
                this.gamePlayerNode.curBetNumList[curChair] = 0;
                this.gamePlayerNode.lightBgList[curChair].active = false;
                this.gamePlayerNode.isRobImgList[curChair].active = false;
                this.gamePlayerNode.noRobImgList[curChair].active = false;
                this.gamePlayerNode.robNumNodeList[curChair].active = false;
            }
        }

        confige.gameBeginWait = true;
        var callFunc = function(){
            confige.gameBeginWait = false;
            var infoCount = confige.gameBeginWaitData.length;
            console.log(confige.gameBeginWaitData);
            for(var i=0;i<infoCount;i++)
            {
                console.log("deal gameBeginWaitData once!!!!!!!!");
                var curInfo = confige.gameBeginWaitData.shift();
                pomelo.dealWithOnMessage(curInfo);
                console.log(curInfo);
            }
            confige.gameBeginWaitData = [];
        };
        this.gameAniNode.scheduleOnce(callFunc,2)
        this.gameAniNode.runGameBeginAni();
        this.timerItem.hideTimer();
        this.gameStatusNew.active = false;
    },

    showGoldGameBegin:function(){

    },

    showBankerAfterAni:function(){
        if(this.gamePlayerNode.playerList[confige.getCurChair(this.curBankerChair)])
        {
            this.gamePlayerNode.playerList[confige.getCurChair(this.curBankerChair)].getChildByName("banker").active = true;
            this.gamePlayerNode.lightBgList[confige.getCurChair(this.curBankerChair)].active = true;
        }else{
            console.log("@@@@@@@@@@@@@@@@e13123123123123123131312313123@@@@@@@@@@@@@@@@3131231231231231231232313123123123123ds3312312@@@@@@@@@@@@3123123313123");
        }
    },

    takeOutBasic:function(curRate){
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                this.gamePlayerNode.playerScoreList[i] -= curRate;
                this.gamePlayerNode.playerInfoList[confige.getCurChair(i)].setScore(this.gamePlayerNode.playerScoreList[i]);
                this.gameAniNode.showScoreAni(confige.getCurChair(i),-curRate);
            }
        }
    },

    lottoAward:function(lottoData){
        //cmd: "lottoAward", type: "gold", value: 888, chair: 0, score: 5888
        if(lottoData.type == this.consumeType)
        {
            this.gamePlayerNode.playerScoreList[lottoData.chair] = lottoData.score;
            this.gamePlayerNode.playerInfoList[confige.getCurChair(lottoData.chair)].setScore(this.gamePlayerNode.playerScoreList[lottoData.chair]);
        }else{
            console.log("获得奖励，但是与当前游戏类型不一致");
        }
        if(lottoData.chair == this.meChair)
        {
            var awardType = "金币";
            if(lottoData.type == "diamond")
                awardType = "钻石";
            this.lottoAwardLabel.string = "获得"+awardType+"奖励"+lottoData.value;
            this.lottoAwardNode.opacity = 0;
            this.scheduleOnce(function(){
                this.lottoAwardNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5)));
            },3);
        }
        
    },

    showLotto:function(){
        this.gameInfoNode.rotatyLayer.showLayer();
    },

    showTips:function(newTips){
        this.tipsBoxLabel.string = newTips;
        this.tipsBox.active = true;
    },

    hideTips:function(){
        this.tipsBox.active = false;
    },

    hideRobBtn:function(){
        this.pushBanker.active = false;
        this.unpushBanker.active = false;
        if(this.isMingCardQZ)
            this.robBtnBox.active = false;
    },

    hideBetBtn:function(){
        if(this.isMingCardQZ)
        {
            this.robBetBtnBox.active = false;
        }else{
            this.betBtnBox.active = false;
        }
    },
});