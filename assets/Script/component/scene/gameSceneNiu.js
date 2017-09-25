var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        betItemPrefab:{
            default:null,
            type:cc.Prefab
        },

        sayItemPrefab:{
            default:null,
            type:cc.Prefab
        },

        betItemFrame0:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame1:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame2:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame3:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame4:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame5:{
            default:null,
            type:cc.SpriteFrame
        },
    },

    // use this for initialization
    onLoad: function () {
        console.log("gameScene Load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        this.yuyinList = [];
        this.yuyinPaly = false;
        this.sayTime = 0;
        this.sayTimeSchedule = -1;
        this.playTimeSchedule = -1;
        this.yuyinTimeOut = -1; 

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
        
        this.meChair = 0;
        this.curBankerChair = -1;

        this.isZhajinniu = false;
        this.isMingCardQZ = false;
        
        this.noShowCardCount = 0;       //当前有多少人开牌
        this.playerCount = 0;           //当前参与游戏的人数,加入新玩家时该数字不会变,等新的一局开始时才会改变
        this.newPlayerCount = 0;
        this.playerList = {};
        this.playerList[0] = this.node.getChildByName("GamePlayer1");
        this.playerList[1] = this.node.getChildByName("GamePlayer2");
        this.playerList[2] = this.node.getChildByName("GamePlayer3");
        this.playerList[3] = this.node.getChildByName("GamePlayer4");
        this.playerList[4] = this.node.getChildByName("GamePlayer5");
        this.playerList[5] = this.node.getChildByName("GamePlayer6");
        
        this.playerActiveList = {};
        this.playerCardList = {};
        this.playerHandCardList = {};
        this.playerInfoList = {};
        
        this.playerScoreList = {};
        for(var i=0;i<6;i++)
        {
            this.playerActiveList[i] = false;
            this.playerScoreList[i] = 0;
            this.playerHandCardList[i] = this.playerList[i].getChildByName("HandCards").getComponent("handCards");    
            // this.playerHandCardList[i].hideCard();
            this.playerInfoList[i] = this.playerList[i].getChildByName("Player").getComponent("playerInfo");
            this.playerInfoList[i].onInit();
        }
        // this.playerActiveList[0] = true;
        this.playerInfoList[0].setName(confige.userInfo.nickname);
        this.playerInfoList[0].setScore(confige.userInfo.diamond);
        
        this.allBetNum = 0;
        this.myBetNum = 0;
        
        this.pushBanker = this.node.getChildByName("btn_pushBanker");
        this.unpushBanker = this.node.getChildByName("btn_unPushBanker");
        this.popBanker = this.node.getChildByName("btn_popBanker");
        this.readyBtn = this.node.getChildByName("btn_ready");
        this.showCardBtn = this.node.getChildByName("btn_showMyCard");
        this.betBtnBox = this.node.getChildByName("betBtnBox");
        this.betNumMax = 20;
        
        this.settleLayer = this.node.getChildByName("settleLayer").getComponent("settleLayer");
        this.settleLayer.onInit();
        this.settleLayer.hide();
        var self = this;
        this.settleLayer.showBeginBtnCall = function(){
            self.readyBtn.active = true;
        };
        
        this.overLayer = this.node.getChildByName("overLayer").getComponent("overLayer");
        this.overLayer.onInit();

        this.overMask = this.node.getChildByName("overMask");
        
        this.gameStatus = this.node.getChildByName("gameStatus");
        this.gameStatusList = {};
        for(var i=1;i<=5;i++)
        {
            this.gameStatusList[i] = this.gameStatus.getChildByName("tips" + i);
        }
        // this.ipTipsList = {};
        // this.ipTipsList[01] = this.node.getChildByName("ipTips1");
        // this.ipTipsList[11] = this.node.getChildByName("ipTips2");
        // this.ipTipsList[21] = this.node.getChildByName("ipTips3");
        // this.ipTipsList[31] = this.node.getChildByName("ipTips4");
        
        console.log("confige.roomData.gameNumber === " + confige.roomData.gameNumber);
        this.roomCurTime = confige.roomData.gameNumber;
        console.log("this.roomCurTime === " + this.roomCurTime);
        this.roomMaxTime = confige.roomData.maxGameNumber;  
        this.roomInfo = this.node.getChildByName("roomData");
        this.roomID = this.roomInfo.getChildByName("roomID").getComponent("cc.Label");
        this.roomMode = this.roomInfo.getChildByName("roomMode").getComponent("cc.Label");
        this.roomTime = this.roomInfo.getChildByName("roomTime").getComponent("cc.Label");
        this.roomTimeNode = this.roomInfo.getChildByName("nowTime");
        
        this.roomID.string = "房间号:" + confige.roomData.roomId;
        if(confige.roomData.gameMode == 1)
            this.roomMode.string = "普通牛牛";
        if(confige.roomData.gameMode == 2)
            this.roomMode.string = "明牌牛牛";
        if(confige.roomData.gameMode == 3)
            this.roomMode.string = "斗公牛";
        if(confige.roomData.gameMode == 4)
            this.roomMode.string = "通比牛牛";

        if(confige.roomData.roomType == "zhajinniu")
        {
            this.roomMode.string = "炸金牛";
            this.isZhajinniu = true;
            this.zhajinniuRoundTime = confige.roomData.TID_ZHAJINNIU/1000;
            console.log("this.zhajinniuRoundTime +++" + this.zhajinniuRoundTime);
        }


        this.mainBg = this.node.getChildByName("mainBg");
        this.scorePool = this.mainBg.getChildByName("scorePool");
        this.scorePoolLabel = this.scorePool.getChildByName("score").getComponent("cc.Label");
        this.scorePoolNum = 0;

        if(confige.roomData.roomType == "mingpaiqz")
        {
            this.roomMode.string = "明牌抢庄";
            this.isMingCardQZ = true;
            this.mingcardqzBasic = confige.roomData.basic;
            this.initMingCardQZ();
        }
        
        console.log("fuck !!!!!!===" + this.roomCurTime);
        this.joinState = confige.roomData.state;
        if(this.joinState == 1001)
            this.roomCurTime ++;
        this.roomTime.string = "第" + this.roomCurTime + "/" + this.roomMaxTime + "局";
        console.log("fuck room time string === " + this.roomTime.string);
        this.gameBegin = false;     //本房间游戏开始
        this.gameStart = false;     //当前局游戏开始
        this.joinLate = false;
        

        this.timerItem = this.node.getChildByName("timerItem").getComponent("timerItem");
        this.timerItem.onInit();

        this.initChatLayer();        //初始化快捷聊天的内容
        // if(confige.roomData.gameMode == 3)
        // {
        //     this.scorePoolImg = this.scorePool.getChildByName("scorePool");
        //     this.scorePoolImg.active = true;
        // }else{
        //     this.allBetImg = this.scorePool.getChildByName("allBet");
        //     this.allBetImg.active = true;
        //     this.scorePoolNum = 0;
        //     this.scorePool.y = 0;
        // }

        this.niuTypeBoxList = {};
        this.niuTypeBoxList[0] = this.node.getChildByName("niuTypeList").getChildByName("niuTypeBox1");
        this.niuTypeBoxList[1] = this.node.getChildByName("niuTypeList").getChildByName("niuTypeBox2");
        this.niuTypeBoxList[2] = this.node.getChildByName("niuTypeList").getChildByName("niuTypeBox3");
        this.niuTypeBoxList[3] = this.node.getChildByName("niuTypeList").getChildByName("niuTypeBox4");
        this.niuTypeBoxList[4] = this.node.getChildByName("niuTypeList").getChildByName("niuTypeBox5");
        this.niuTypeBoxList[5] = this.node.getChildByName("niuTypeList").getChildByName("niuTypeBox6");

        this.btnCanSend = true;

        this.settingLayer = this.node.getChildByName("settingLayer").getComponent("settingLayer");
        this.settingLayer.onInit();

        this.finishLayer = this.node.getChildByName("finishLayer").getComponent("finishLayer");
        this.finishLayer.onInit();

        this.tipsBox = this.node.getChildByName("tipsBox");
        this.tipsLabel = this.tipsBox.getChildByName("tips").getComponent("cc.Label");

        this.betNumNodeList = {};
        this.betNumLabelList = {};
        this.curBetNumList = {};
        this.isRobImgList = {};
        this.noRobImgList = {};
        this.lightBgList = {};
        this.watchCardImgList = {};
        this.failureImgList = {};
        this.discardImgList = {};
        this.isTurnImgList = {};
        this.leaveNodeList = {};
        this.robNumNodeList = {};
        this.robNumLabelList = {};
        
        for(var i=0;i<6;i++)
        {
            this.betNumNodeList[i] = this.playerList[i].getChildByName("betNode");
            this.betNumLabelList[i] = this.betNumNodeList[i].getChildByName("betNum").getComponent("cc.Label");
            this.curBetNumList[i] = 0;
            this.isRobImgList[i] = this.playerList[i].getChildByName("isRob");
            this.noRobImgList[i] = this.playerList[i].getChildByName("noRob");
            this.lightBgList[i] = this.playerList[i].getChildByName("lightBg");
            this.watchCardImgList[i] = this.playerList[i].getChildByName("watchCard");
            this.failureImgList[i] = this.playerList[i].getChildByName("failure");
            this.discardImgList[i] = this.playerList[i].getChildByName("discard");
            this.isTurnImgList[i] = this.playerList[i].getChildByName("isTurn");
            this.leaveNodeList[i] = this.playerList[i].getChildByName("leaveNode");
            this.robNumNodeList[i] = this.playerList[i].getChildByName("headRobNumBg");
            this.robNumLabelList[i] = this.robNumNodeList[i].getChildByName("robNum").getComponent("cc.Label");
        }

        this.betItemListAll = {};
        this.betItemNomalList1 = {};
        this.betItemNomalList2 = {};
        this.betItemNomalList3 = {};
        this.betItemCount = 0;
        this.betBeginPosList = {};
        this.betBeginPosList[0] = cc.v2(116,83);
        this.betBeginPosList[1] = cc.v2(1226,362);
        this.betBeginPosList[2] = cc.v2(970,650);
        this.betBeginPosList[3] = cc.v2(640,650);
        this.betBeginPosList[4] = cc.v2(305,650);
        this.betBeginPosList[5] = cc.v2(58,360);
        this.betFrameList = {};
        this.betFrameList[0] = this.betItemFrame0;
        this.betFrameList[1] = this.betItemFrame1;
        this.betFrameList[2] = this.betItemFrame2;
        this.betFrameList[3] = this.betItemFrame3;
        this.betFrameList[4] = this.betItemFrame4;
        this.betFrameList[5] = this.betItemFrame5;

        this.sayAniNode = this.node.getChildByName("sayAniNode");
        this.sayPosList = {};
        this.sayPosList[0] = cc.v2(187,167);
        this.sayPosList[1] = cc.v2(1190,444);
        this.sayPosList[2] = cc.v2(1090,650);
        this.sayPosList[3] = cc.v2(755,650);
        this.sayPosList[4] = cc.v2(425,650);
        this.sayPosList[5] = cc.v2(126,444);
        // for(var i=0;i<4i++)
        // {
        //     var headX = this.playerList[i].getChildByName("playerBg").x;
        //     var headY = this.playerList[i].getChildByName("playerBg").y;
        //     this.betBeginPosList[i] = this.node.convertToWorldSpaceAR(cc.v2(headX,headY));
        //     console.log("this.betBeginPosList[i]. pos ====");
        //     console.log(this.betBeginPosList[i]);
        // }
        this.btn_inviteFriend = this.node.getChildByName("btn_inviteFriend");
        this.btn_close = this.node.getChildByName("btn_close").getComponent("cc.Button");
        this.userInfoLayer = this.node.getChildByName("userInfoLayer");
        this.userInfoNick = this.userInfoLayer.getChildByName("nick").getComponent("cc.Label");
        this.userInfoID = this.userInfoLayer.getChildByName("id").getComponent("cc.Label");
        this.userInfoIP = this.userInfoLayer.getChildByName("ip").getComponent("cc.Label");

        this.faceAniList = {};
        for(var i=1;i<=6;i++)
            this.faceAniList[i] = this.userInfoLayer.getChildByName("faceAni"+i);
        var timeLabel = this.roomInfo.getChildByName("nowTime").getComponent("cc.Label");
        var refleshTime = function(){
            var timeSting = "";
            var myDate = new Date();
            var hour = myDate.getHours();
            var minutes = myDate.getMinutes();
            if(hour < 10)
                timeSting = timeSting + "0" + hour;
            else
                timeSting = timeSting + hour;
            timeSting += ":";
            if(minutes < 10)
                timeSting = timeSting + "0" + minutes;
            else
                timeSting = timeSting + minutes;

            timeLabel.string = timeSting;
        };
        refleshTime();
        timeLabel.schedule(refleshTime,10);

        this.cardItemList = this.node.getChildByName("cardList").getComponent("cardList");
        this.cardItemList.onInit();
        // for(var i=0;i<6;i++)
        //     this.cardItemList.activePlayer(i);

        this.webCloseLayer = this.node.getChildByName("webCloseLayer").getComponent("loadingLayer");
        this.webCloseLayer.onInit();

        this.openCardBox = this.node.getChildByName("openCardBox");
        this.openCardBtn1 = this.openCardBox.getChildByName("btn1");
        this.openCardBtn2 = this.openCardBox.getChildByName("btn2");
        this.openCardImg1 = this.openCardBox.getChildByName("btnImg1");
        this.openCardImg2 = this.openCardBox.getChildByName("btnImg2");

        this.userInfoBtnList = this.node.getChildByName("userInfoBtnList");
        this.selectHead = -1;

        this.betBtnBoxS = this.node.getChildByName("betBtnBoxS");
        this.betSlider = this.betBtnBoxS.getChildByName("slider").getComponent("cc.Slider");
        this.betSliderLight = this.betBtnBoxS.getChildByName("slider").getChildByName("light").getComponent("cc.Sprite");

        this.betSliderNumList = {};
        // for(var i=0;i<6;i++)
        // {  
        //     var curName = "curNum"+i;
        //     console.log(curName);
        //     this.betSliderNumList[i] = this.betBtnBoxS.getChildByName("numList").getChildByName(curName).getComponent("cc.Label");
        // }
        this.betSliderNumList[0] = this.betBtnBoxS.getChildByName("numList").getChildByName("curNum1").getComponent("cc.Label");
        this.betSliderNumList[1] = this.betBtnBoxS.getChildByName("numList").getChildByName("curNum2").getComponent("cc.Label");
        this.betSliderNumList[2] = this.betBtnBoxS.getChildByName("numList").getChildByName("curNum3").getComponent("cc.Label");
        this.betSliderNumList[3] = this.betBtnBoxS.getChildByName("numList").getChildByName("curNum4").getComponent("cc.Label");
        this.betSliderNumList[4] = this.betBtnBoxS.getChildByName("numList").getChildByName("curNum5").getComponent("cc.Label");
        this.betSliderNumList[5] = this.betBtnBoxS.getChildByName("numList").getChildByName("curNum6").getComponent("cc.Label");

        this.curSliderNum = 0;
        this.curSliderNumLabel = this.betBtnBoxS.getChildByName("slider").getChildByName("handle").getChildByName("curNum").getComponent("cc.Label");
        this.curSliderNumMin = 0;
        this.curSliderNumMax = 0;
    },
    
    setBanker:function(chair){
        this.curBankerChair = chair;
    },

    showScorePool:function(score,type,bankerScore,change){
        console.log("show fuck score pool!!!!!!");
        if(this.isMingCardQZ)
        {
            this.robBetNumLabel.string = score;
            return;
        }
        this.scorePool.active = true;
        this.scorePoolLabel.string = score + ";<";
        this.scorePoolNum = parseInt(score);

        if(bankerScore)
        {
            console.log("curChair === " + this.curBankerChair + "newChiar===" + confige.getCurChair(this.curBankerChair));
            this.playerScoreList[this.curBankerChair] = bankerScore;
            this.playerInfoList[confige.getCurChair(this.curBankerChair)].setScore(this.playerScoreList[this.curBankerChair]);
        }
        if(change === true)
        {
            this.betItemRemoveToBanker(confige.getCurChair(this.curBankerChair));
            var callFunc = function(){
                this.betItemListClean();
                console.log("fuck you scorePool 丢钱出去！！！！！！！！！！！！！！")
                this.betItemListAddBet(confige.getCurChair(this.curBankerChair),callFunc.score);
            };
            callFunc.score = score;
            this.scheduleOnce(callFunc,0.5);
        }
    },

    showGameStatus:function(index){
        this.gameStatus.active = true;
        for(var i=1;i<=5;i++)
            this.gameStatusList[i].active = false;
        if(index == 2)
        {
            this.gameStatus.active = false;
        }else{
            this.gameStatusList[index].active = true;
        }
    },

    hideGameStatus:function(){
        this.gameStatus.active = false;
    },

    start: function () {
        console.log("gameScene Start!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        this.playerList[0].active = false;
        this.playerList[1].active = false;
        this.playerList[2].active = false;
        this.playerList[3].active = false;
        this.playerList[4].active = false;
        this.playerList[5].active = false;
        
        //console.log(confige.roomPlayer);
        if(confige.roomPlayer != -1)
        {
            for(var i in confige.roomPlayer)
            {
                var newPlayerInfo = confige.roomPlayer[i];
                if(newPlayerInfo.uid == confige.userInfo.uid)
                {
                    this.meChair = parseInt(i);
                    confige.meChair = this.meChair;
                }
                confige.curPlayerMax ++;
            }
            for(var k in confige.roomPlayer)
            {
                if(confige.roomPlayer.hasOwnProperty(k))
                {
                    var curIndex = confige.getCurChair(parseInt(k));
                    var newPlayerInfo = confige.roomPlayer[k];
                    confige.curPlayerData[curIndex] = newPlayerInfo;
                    if(newPlayerInfo.isActive == true)
                    {
                        this.addOnePlayer(newPlayerInfo);
                        this.playerCount ++;
                        if(newPlayerInfo.isOnline == false)
                            this.leaveNodeList[confige.getCurChair(k)].active = true;
                        // this.playerInfoList[curIndex].setName(newPlayerInfo.playerInfo.nickname);
                        // this.playerInfoList[curIndex].setScore(newPlayerInfo.score);
                        // this.playerScoreList[parseInt(k)] = newPlayerInfo.score;
                        // this.playerList[curIndex].active = true;
                        // 
                        // confige.curPlayerCount ++;
                        // if(newPlayerInfo.isReady == true && confige.curReconnectData == -1 && confige.roomPlayer.state == 1001)
                        //     this.playerList[curIndex].getChildByName("isReady").active = true;
                        // var self = this;
                        // if(newPlayerInfo.playerInfo.head != "")
                        // {
                        //     var newCallBack = function(index){
                        //         self.playerInfoList[index].setHeadSpriteFrame(confige.WXHeadFrameList[index+1]);
                        //     };
                        //     confige.getWXHearFrame(newPlayerInfo.playerInfo.head, curIndex+1, function(curIndex){
                        //         return function(){
                        //             newCallBack(curIndex)
                        //         } 
                        //     }(curIndex) );
                        // }
                    }
                }
            }
        }
        
        if(this.playerCount == 6)
            this.btn_inviteFriend.active = false;
        //this.ipChecking();

        this.newPlayerCount = this.playerCount;
        
        if(this.isZhajinniu == true)
        {
            this.initZhajinniuLayer();
        }

        if(confige.curReconnectData == -1)  //是否属于重连状态
        {
            if(this.joinState == 1005)
            {
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        this.cardItemList.activePlayer(confige.getCurChair(i));
                    }
                }
            }
            if(this.joinState != 1001)   //本局游戏已经开始才加入
            {
                this.gameBegin = true;
                this.btn_inviteFriend.active = false;
                this.btn_close.interactable = false;
                console.log("本局游戏已经开始才加入,进入观战模式");
                console.log("当前参与游戏的人数===" + this.playerCount);
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
                        this.playerList[confige.getCurChair(this.curBankerChair)].getChildByName("banker").active = true;
                        this.lightBgList[confige.getCurChair(this.curBankerChair)].active = true;
                    }
                }
                this.playerCount -= watchPlayer;
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
                                    this.playerHandCardList[curChair].showCardBackWithCount(3);

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
                            this.playerCardList[i] = confige.roomData.player[i].handCard;
                            this.playerHandCardList[confige.getCurChair(i)].initCardWithBack();
                            var curChair = confige.getCurChair(i);
                            if(curChair != 0 && confige.roomPlayer[i].isShowCard == true)
                                this.showOneCard(i);
                            this.playerHandCardList[curChair].showCardBackWithCount(5);
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
                            this.curBetNumList[curChair] = confige.roomData.betList[i];
                            
                            // this.playerScoreList[parseInt(i)] -= confige.roomData.betList[i];
                            // this.playerInfoList[curChair].setScore(this.playerScoreList[parseInt(i)]);

                            this.betNumLabelList[curChair].string = this.curBetNumList[curChair] + "分";
                            if(confige.roomPlayer[i].isBanker == false)
                                this.betNumNodeList[curChair].active = true;
                        }
                    }
                    this.allBetNum = curBetCount;
                    this.showScorePool(this.allBetNum);
                    this.betItemListAddBet(confige.getCurChair(this.curBankerChair),this.allBetNum);
                }

                if(this.isZhajinniu == true)
                {
                    var curCardNum = 0;
                    if(confige.roomData.curRound == 0)
                    {   
                        curCardNum = 3;
                    }else if(confige.roomData.curRound == 1){
                        curCardNum = 4;
                    }else if(confige.roomData.curRound == 2){
                        curCardNum = 5;
                    }else if(confige.roomData.curRound == 3){
                        curCardNum = 5;
                    }
                    this.curRound = confige.roomData.curRound;
                    this.setRoundTime(confige.roomData.curRound + 1);
                    var curBetCount = 0;
                    console.log("curCardNum=====" + curCardNum);
                    for(var i in confige.roomPlayer)
                    {
                        if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                        {   
                            var curChair = confige.getCurChair(i);

                            // this.playerScoreList[parseInt(i)] -= this.zhajinniuBasic;
                            // this.playerInfoList[curChair].setScore(this.playerScoreList[parseInt(i)]);

                            this.playerHandCardList[curChair].resetCard();
                            for(var j=0;j<curCardNum;j++)
                                this.playerHandCardList[curChair].showCardBackWithIndex(j);
                            if(this.cardMode == 2)
                            {
                                var curCardData = confige.roomData.player[i].handCard;
                                for(var k in curCardData)
                                {
                                    var index = parseInt(k);
                                    this.playerHandCardList[curChair].setCardWithIndex(index, curCardData[index].num, curCardData[index].type);
                                }
                            }

                            if(confige.roomData.player[i].isShowCard == true)
                            {
                                this.lookCardList[curChair] = true;
                                this.watchCardImgList[curChair].active = true;
                            }

                            if(confige.roomData.player[i].isNoGiveUp == false)
                            {
                                this.loseList[curChair] = true;
                                this.loseNodeList[curChair].active = true;
                                this.giveUpList[curChair] = true;
                                this.discardImgList[curChair].active = true;
                                this.watchCardImgList[curChair].active = false;
                            }

                            curBetCount += confige.roomData.betList[i];
                            this.curBetNumList[curChair] = confige.roomData.betList[i];
                            this.betNumLabelList[curChair].string = this.curBetNumList[curChair] + "分";
                            this.betNumNodeList[curChair].active = true;
                        }
                    }
                    this.allBetNum = curBetCount;
                    this.showScorePool(this.allBetNum);
                    var curPlayerChair = confige.getCurChair(confige.roomData.curPlayer);
                    this.changeArrow(curPlayerChair);
                }
                if(this.isMingCardQZ)
                {
                    if(this.joinState == 1005 || this.joinState == 1002)
                    {
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                this.cardItemList.activePlayer(confige.getCurChair(i));
                            }
                        }
                        this.onReConnect = true;
                        // this.newDisCard(4);
                        var cardsCount = 0;
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                var curChair = confige.getCurChair(i);
                                this.playerHandCardList[curChair].showCardBackWithCount(4);
                                console.log("重连直接显示玩家盖着的牌" + i);
                                if(confige.roomPlayer[i].handCard)
                                {
                                    var callFunc = function(){
                                        for(var i in callFunc.cards)
                                        {
                                            this.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
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
                        this.robMaxNumNode.active = true;
                        this.robMaxNumLabel.string = this.curRobMaxNum + ";<";
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
                            this.playerList[i].getChildByName("banker").active = false;
                            if(robStateList[i] != -1)
                            {
                                var curChair = confige.getCurChair(i);
                                if(robStateList[i] > this.curRobMaxNum)
                                    this.curRobMaxNum = robStateList[i];
                                if(robStateList[i] == 0)
                                    this.noRobImgList[curChair].active = true;
                                else{
                                    this.robNumLabelList[curChair].string = ">?;"+robStateList[i];
                                    this.robNumNodeList[curChair].active = true;
                                }
                            }
                        }
                        this.statusChange(2);
                    }
                }                      
            }
        }else{
            this.onReConnect = true;
            console.log("处理重连数据");
            console.log("当前参与游戏的人数===" + this.playerCount);
            var watchPlayer = 0;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == false)
                {   
                    watchPlayer ++;
                    console.log("有一个观战的玩家");
                }
            }
            this.playerCount -= watchPlayer;
            this.recoverGame();
            confige.curReconnectData = -1;
        }
        console.log("roomId + meChair === " + (confige.roomData.roomId*10 + this.meChair));
        this.yuyinBtn = this.node.getChildByName("btn_yuyin");
        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        {
            confige.GVoiceCall.init(""+confige.userInfo.uid);//(confige.roomData.roomId*10 + this.meChair));
            confige.GVoiceRoomID = "" + confige.roomData.roomId;
            confige.GVoiceCall.joinRoom(confige.GVoiceRoomID);
            var voicePath = jsb.fileUtils.getWritablePath() + 'GVoice/';
            if (!jsb.fileUtils.isDirectoryExist(voicePath)) {
                jsb.fileUtils.createDirectory(voicePath);
            }
            if(confige.curUsePlatform == 1){
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "SetVoicePath", "(Ljava/lang/String;)V", voicePath);
            }else if(confige.curUsePlatform == 2){
                jsb.reflection.callStaticMethod("JSCallOC", "GVoiceSetPath:",voicePath);
            }
            // confige.GVoiceCall.openListen();

            var self = this;
            this.btn_quickSay = this.node.getChildByName("btn_quickSay");
            var btnYY = this.yuyinBtn;
            var voiceMaskLayer = this.node.getChildByName("voiceMaskLayer");
            var voiceMaskNode1 = voiceMaskLayer.getChildByName("node1");
            var voiceMaskNode2 = voiceMaskLayer.getChildByName("node2");
            var voiceTouchBeginY = 0;
            var newYuyinPos = this.node.convertToWorldSpaceAR(cc.v2(btnYY.x,btnYY.y));
            var onSay = false;
            var voiceCancle = false;
            var sayCallBack = function(){
                if(onSay == true){
                    closeMicFunc();
                }
            };
            var closeMicFunc = function(){
                if(voiceCancle == true)
                    confige.GVoiceCall.closeMic(1);
                else
                    confige.GVoiceCall.closeMic(0);
                voiceMaskLayer.active = false;
                onSay = false;
                self.unschedule(sayCallBack);
                btnYY.runAction(cc.scaleTo(0.1,1.0));
                self.openMusicAndSound();
                self.endSayTime();
                voiceMaskNode1.active = false;
                voiceMaskNode2.active = false;
            };
            
            // 添加单点触摸事件监听器
            var voiceListen = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function (touches, event) {
                    if(touches.getLocationX() > newYuyinPos.x - 40 &&
                       touches.getLocationX() < newYuyinPos.x + 40 &&
                       touches.getLocationY() > newYuyinPos.y - 40 &&
                       touches.getLocationY() < newYuyinPos.y + 40 
                        )
                    {
                        cc.log('Touch Began: ' + event + "xxx===" + touches.getLocationX() + "yyy===" + touches.getLocationY());
                        self.closeMusicAndSound();
                        self.beginSayTime();
                        if(self.playTimeSchedule != -1)
                            self.unschedule(self.playTimeSchedule);
                        confige.GVoiceCall.openMic();
                        voiceMaskLayer.active = true;
                        voiceMaskNode1.active = true;
                        onSay = true;
                        self.scheduleOnce(sayCallBack,10);
                        btnYY.runAction(cc.scaleTo(0.1,0.8));
                        voiceTouchBeginY = touches.getLocationY();
                        voiceCancle = false;
                        return true; //这里必须要写 return true
                    }else{
                        return false;
                    }
                    
                },
                onTouchMoved: function (touches, event) {
                    //cc.log('Touch Moved: ' + event);
                    if(touches.getLocationY() - voiceTouchBeginY > 100)
                    {
                        voiceMaskNode1.active = false;
                        voiceMaskNode2.active = true;
                        voiceCancle = true;
                    }
                },
                onTouchEnded: function (touches, event) {
                    cc.log('Touch Ended: ' + event);
                    closeMicFunc();
                },
                onTouchCancelled: function (touches, event) {
                   //cc.log('Touch Cancelled: ' + event);
                }
            };
            // 绑定单点触摸事件
            cc.eventManager.addListener(voiceListen, this.btn_quickSay);
        }else{
            this.yuyinBtn.getComponent("cc.Button").interactable = false;
            this.btn_inviteFriend.active = false;
        }

        this.sceneLoadOver = true;
        
        // var testSch = function(){
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
    },
    
    ipChecking:function(){
        for(var i=0;i<this.playerCount;i++)
        {
            if(typeof(confige.curPlayerData[i].ip) == "undefined") 
                continue;
            for(var j=0; j<this.playerCount;j++)
            {   
                if(typeof(confige.curPlayerData[j].ip) == "undefined") 
                    continue;
                if(i != j && confige.curPlayerData[i].ip == confige.curPlayerData[j].ip)
                    var iii = 0;
                    //this.ipTipsList[i].active = true;
            }
        }
    },
    
    addOnePlayer:function(playerData){
        var curIndex = confige.getCurChair(playerData.chair);
        console.log("addOnePlayer!!!!!chair ===== " + curIndex);
        console.log(playerData);
        this.playerInfoList[curIndex].setName(playerData.playerInfo.nickname);
        this.playerInfoList[curIndex].setScore(playerData.score);
        //
        var self = this;
        if(playerData.playerInfo.head != "")
        {
            var newCallBack = function(index){
                self.playerInfoList[index].setHeadSpriteFrame(confige.WXHeadFrameList[index+1]);
            };
            confige.getWXHearFrame(playerData.playerInfo.head, curIndex+1, function(curIndex){
                return function(){
                    newCallBack(curIndex)
                } 
            }(curIndex) );
        }
        if(playerData.score)
            this.playerScoreList[parseInt(playerData.chair)] = playerData.score;

        if(playerData.isReady == true && confige.roomPlayer.state == 1001)// confige.curReconnectData == -1 && )
            this.playerList[curIndex].getChildByName("isReady").active = true;
        this.playerList[curIndex].active = true;
        confige.roomPlayer[playerData.chair] = playerData;
        confige.curPlayerData[curIndex] = playerData;
        this.newPlayerCount ++;
        console.log("addOnePlayer() this.newPlayerCount ==== " + this.newPlayerCount);
        confige.curPlayerCount ++;
        // this.ipChecking();

        if(this.newPlayerCount == 6)
            this.btn_inviteFriend.active = false;
        this.playerActiveList[curIndex] = true;
    },

    playerQuit:function(chair){
        console.log("playerQuit -------------------" + chair);
        var curIndex = confige.getCurChair(chair);
        this.playerList[curIndex].active = false;

        confige.roomPlayer[chair].isActive = false;
        confige.roomData.player[chair].isActive = false;
        confige.curPlayerData[curIndex] = confige.roomPlayer[chair];
        
        this.newPlayerCount --;
        confige.curPlayerCount --;
        if(this.newPlayerCount < 6)
            this.btn_inviteFriend.active = true;
        this.playerActiveList[curIndex] = false;
    },
    
    addBet:function(betNum, chair){
        // this.playerScoreList[confige.getOriChair(chair)] -= betNum;
        // this.playerInfoList[chair].setScore(this.playerScoreList[confige.getOriChair(chair)]);
        
        this.betItemListAddBet(chair,betNum);
        if(this.isZhajinniu)
        {
            this.allBetNum += betNum;
            this.curBetNumList[chair] += betNum;
            this.betNumLabelList[chair].string = this.curBetNumList[chair].toString() + "分";
            this.showScorePool(this.allBetNum,1);
            return;
        }
        this.allBetNum = this.allBetNum + betNum;
        if(chair == 0)
            this.myBetNum = this.myBetNum + betNum;
        if(this.gameMode != 3)
            this.showScorePool(this.allBetNum,1);
        this.curBetNumList[chair] += betNum;
        this.betNumLabelList[chair].string = this.curBetNumList[chair].toString() + "分";
    },
    
    onBtnVoiceClick:function(event, customEventData){

    },

    onBtnSettingClicked:function(){
        this.settleLayer.addOneSettle(11,1,1234);
    },
    
    onBtnReturnClicked:function(){
        cc.director.loadScene('HallScene');
    },
    
    onBtnReadyClicked:function(){
        if(this.btnCanSend)
        {
            this.btnCanSend = false;
            pomelo.request("connector.entryHandler.sendData", {"code" : "ready"}, function(data) {
                console.log("flag is : "+ data.flag);
                if(data.flag == true)
                {
                    if(this.isZhajinniu)
                    {
                        this.readyBtn.active = false;
                        for(var i=0;i<6;i++)
                        {
                            this.lookCardList[i] = false;
                            this.giveUpList[i] = false;
                            this.loseList[i] = false;
                            this.loseNodeList[i].active = false;
                            this.watchCardImgList[i].active = false;
                            this.failureImgList[i].active = false;
                            this.discardImgList[i].active = false;
                            // this.isTurnImgList[i].active = false;
                        }
                    }else{
                        console.log("fuck onBtnReadyClicked !!!!!!!!!");
                        this.readyBtn.active = false;
                    }
                }
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
            curBetNum = 5;
        else if(betType == 2)
            curBetNum = 10;
        else if(betType == 3)
        {
            if(this.gameMode == 3)          //斗公牛模式特殊处理
            {
                curBetNum = Math.min(Math.floor(this.scorePoolNum/(this.playerCount-1)), 40) - this.myBetNum;
                console.log("new curBetNum ===== " + curBetNum);
            }
            else
                curBetNum = this.betNumMax - this.myBetNum;
        }
        if(betType == 100)
        {
            this.betBtnBoxS.active = false;
            curBetNum = this.curSliderNum;
        }
        pomelo.clientSend("bet",{"bet": curBetNum});
    },
    
    onBtnPushBankerClicked:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        this.pushBanker.active = false;
        this.unpushBanker.active = false;
        if(clickIndex == 1)
        {
            this.showGameStatus(3);
            pomelo.clientSend("robBanker",{"flag" : true});
        }else if(clickIndex == 2){
            this.showGameStatus(3);
            pomelo.clientSend("robBanker",{"flag" : false});
        }
    },
    
    onBtnPopBankerClicked:function(){
        pomelo.clientSend("downBanker");
    },

    downBanker:function(data){
        this.popBanker.active = false;
        this.showScorePool(data.bonusPool,0);
        this.playerList[confige.getCurChair(data.chair)].getChildByName("banker").active = false;
        this.lightBgList[confige.getCurChair(data.chair)].active = false;
        this.playerList[confige.getCurChair(data.banker)].getChildByName("banker").active = true;
        this.lightBgList[confige.getCurChair(data.banker)].active = true;
        if(this.gameMode == 3)
        {
            this.betItemRemoveToBanker(confige.getCurChair(data.chair));
        } 
        if(data.oldBankerScore)
        {
            this.playerScoreList[data.chair] = data.oldBankerScore;
            this.playerInfoList[confige.getCurChair(data.chair)].setScore(this.playerScoreList[data.chair]);
        }
        if(data.bankerScore)
        {
            this.curBankerChair = data.banker;
            this.playerScoreList[this.curBankerChair] = data.bankerScore;
            this.playerInfoList[confige.getCurChair(this.curBankerChair)].setScore(this.playerScoreList[this.curBankerChair]);
        }
    },
    
    onServerRobBanker:function(){
        this.timerItem.setTime(this.time_rob);
        if(this.isMingCardQZ)
            this.showGameStatus(2);
        else
            this.showGameStatus(1);
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
                this.noRobImgList[curChair].active = true;
            else{
                this.robNumLabelList[curChair].string = ">?;"+data.num;
                this.robNumNodeList[curChair].active = true;
            }
        }else{
            if(data.flag == 1)
            {
                this.isRobImgList[curChair].active = true;
            }else if(data.flag == 2){
                this.noRobImgList[curChair].active = true;
            } 
        }
    },

    statusChange:function(index){
        if(this.isZhajinniu)
        {
            return;
        }
        else if(index === 1)
        {
            this.timerItem.setTime(this.time_betting);
        }
        else if(index === 2)
        {
            this.timerItem.setTime(this.time_settlement);
        }
    },
    
    onServerReady:function(chair){
        this.onReConnect = false;
        this.playerList[chair].getChildByName("isReady").active = true;
        this.failureImgList[chair].active = false;
        this.watchCardImgList[chair].active = false;
        this.discardImgList[chair].active = false;
        if(this.isMingCardQZ)
        {
            this.robMaxNumNode.active = false;
            this.curRobMaxNum = 0;
        }
        if(chair == 0)      //当前玩家自己
        {
            if(this.gameMode != 3)
                this.betItemListClean();
            this.showGameStatus(5);
            if(confige.roomData.gameMode != 3)
                this.scorePool.active = false;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true)
                {   
                    confige.roomPlayer[i].isReady = true;
                    var curChair = confige.getCurChair(i);
                    this.playerHandCardList[curChair].resetCard();
                    this.niuTypeBoxList[curChair].active = false;
                    this.playerList[curChair].getChildByName("banker").active = false;
                    this.betNumNodeList[curChair].active = false;
                    this.betNumLabelList[curChair].string = "0" + "分";
                    this.curBetNumList[curChair] = 0;
                    this.lightBgList[curChair].active = false;
                    this.isRobImgList[curChair].active = false;
                    this.noRobImgList[curChair].active = false;
                    this.robNumNodeList[curChair].active = false;
                }
            }
        }
    },
    
    onServerBeginBetting:function(data){
        var bankerChair = data.banker;
        this.popBanker.active = false;
        this.allBetNum = 0;
        this.myBetNum = 0;

        console.log("fuck joinLate =====!!!!!!!!!" + this.joinLate);
        this.statusChange(1);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
            {
                var curIndex = confige.getCurChair(i);
                this.isRobImgList[curIndex].active = false;
                this.noRobImgList[curIndex].active = false;
                if(i != bankerChair)     //庄家不显示分数框
                {
                    this.betNumNodeList[curIndex].active = true;
                }
                if(this.isZhajinniu == false)
                {
                    if(i != bankerChair)
                    {
                        this.betNumLabelList[curIndex].string = "0" + "分";
                        this.curBetNumList[curIndex] = 0;
                    }
                }
            }
        }
        this.curBankerChair = bankerChair;
        if(bankerChair == this.meChair)
            this.showGameStatus(4);
        else
            this.showGameStatus(2);
      
        if(confige.roomData.gameMode != 3)
            this.showScorePool(this.allBetNum);

        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {   
                this.playerList[confige.getCurChair(i)].getChildByName("banker").active = false;
                this.lightBgList[confige.getCurChair(i)].active = false;
            }
        }

        if(bankerChair != -1)
        {
            this.playerList[confige.getCurChair(bankerChair)].getChildByName("banker").active = true;
            this.lightBgList[confige.getCurChair(bankerChair)].active = true;
            // this.curBankerChair = confige.getCurChair(bankerChair);
        }
        if(this.isMingCardQZ)
        {
            this.robBtnBox.active = false;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true)
                {
                    var curChair = confige.getCurChair(i);
                    this.robNumNodeList[curChair].active = false;
                }
            }
            if(this.curRobMaxNum == 0)
            {
                this.robMaxNumLabel.string = "1;<";
            }else{
                this.robMaxNumLabel.string = this.curRobMaxNum + ";<";
            }
            
            this.robMaxNumNode.active = true;
            if(data.lastScore[this.meChair] > 0 && this.isAllowAllin)
                this.robBetAllInBtn.interactable = true;
        }
        
        if(this.joinLate == false)
        {
            this.pushBanker.active = false;
            this.unpushBanker.active = false;
            if(this.curBankerChair != this.meChair)
            {   
                if(this.gameMode == 3)
                {
                    console.log("this.scorePoolNum==="+this.scorePoolNum);
                    console.log("this.playerCount==="+this.playerCount);
                    var curMin = Math.max(Math.floor(this.scorePoolNum / this.playerCount / 5), 1);// - this.myBetNum;
                    var curMax = Math.min(Math.floor(this.scorePoolNum/(this.playerCount-1)), 40); - this.myBetNum;
                    console.log("curMax ===== " + curMax);
                    this.showSlider(curMin,curMax);
                }
                else if(this.isMingCardQZ)
                {
                    this.robBetBtnBox.active = true;
                }else{
                    this.betBtnBox.active = true;
                }
            }
        }else{
            if(this.joinState == 1005 &&  this.cardMode == 2)
            {
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        var curChair = confige.getCurChair(i);
                        if(curChair != 0)
                            this.playerHandCardList[curChair].showCardBackWithCount(3);
                    }
                }
            }
        }
    },
    
    onServerDealCard:function(handCards){
        this.hideGameStatus();
        for(var i in handCards)
        {
            if(handCards.hasOwnProperty(i))
            {
                this.playerCardList[i] = handCards[i];
            }
        }
        this.statusChange(2);
        if(this.cardMode == 2 && this.joinLate == false)
        {
            console.log("onServerDealCard11111");
            this.newDisCard(1);
            var callFunc = function(){
                if(this.gameStart == true)
                    this.showOpenCard(2);
            };
            this.scheduleOnce(callFunc,0.3);
        }else if(this.isMingCardQZ){
            console.log("onServerDealCard22222");
            this.newDisCard(1);
            var callFunc = function(){
                if(this.gameStart == true)
                {
                    this.showOpenCard(2);
                }
            };
            this.scheduleOnce(callFunc,0.5);
        }else{
            console.log("onServerDealCard333333");
            this.newDisCard(5);
            var curChair = confige.getCurChair(this.meChair);
            var curCardData = this.playerCardList[this.meChair];
            var callFunc = function(){
                console.log("显示玩家明牌");
                for(var j=0;j<3;j++)
                {
                    var index = parseInt(j);
                    this.playerHandCardList[callFunc.curChair].setCardWithIndex(index, callFunc.curCardData[index].num, callFunc.curCardData[index].type);
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
        if(this.onReConnect)
        {
            if(this.isMingCardQZ)
            {
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {  
                        var curChair = confige.getCurChair(i);
                        this.playerHandCardList[curChair].showCardBackWithIndex(4);
                        this.showOpenCard(2);
                        console.log("onServerDealCard5555555555");
                    }
                }
            }
        }
        console.log("onServerDealCard44444");
        
        if(this.joinLate == false)
        {
            var callFunc2 = function(){
                this.showCardBtn.active = true;
            };
            this.scheduleOnce(callFunc2,0.5);
            this.betBtnBox.active = false;
            this.betBtnBoxS.active = false;
            if(this.isMingCardQZ)
            {
                this.robBetBtnBox.active = false;
                this.robBetAllInBtn.interactable = false;
            }
        }
    },
    
    showNiuType:function(chair, type){
        if(this.niuTypeBoxList[chair].active == true)
            return;
        this.niuTypeBoxList[chair].active = true;
        this.niuTypeBoxList[chair].opacity = 0;
        this.niuTypeBoxList[chair].getChildByName("niuImg").getComponent("cc.Sprite").spriteFrame = confige.niuTypeFrameMap[type];
        this.niuTypeBoxList[chair].runAction(cc.fadeIn(1));
        console.log("male_type_" + type);
        if(confige.soundEnable == true)
            cc.audioEngine.play(confige.audioList["male_type_"+type],false,confige.audioVolume);
    },

    showOneCard:function(chair,callType){
        var curChair = confige.getCurChair(chair);
        if(curChair == 0)
        {
            this.hideOpenCard(1);
            this.hideOpenCard(2);
        }
        if(this.joinLate == true && curChair == 0)
            return;

        var handCard = this.playerCardList[chair];
        // for(var i=0;i<5;i++)
        var curCardNum = 0;
        for(var i in handCard)
        {
            if(handCard[i])
            {
                curCardNum ++;
                this.playerHandCardList[curChair].setCardWithIndex(i, handCard[i].num, handCard[i].type);
            }
        }

        if(callType == -1)
            return;
        if(curCardNum == 5)
        {
            var curNiuType = confige.getNiuType(handCard);
            this.showNiuType(curChair, curNiuType.type);
        }  
    },

    btn_showMyCard:function(){
        pomelo.clientSend("showCard");
        this.showCardBtn.active = false;

        var handCard = this.playerCardList[this.meChair];
        var curNiuType = confige.getNiuType(handCard);
        this.showNiuType(0, curNiuType.type);
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
                this.playerHandCardList[0].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
            }
        };
        callFunc.cards = cards;
        this.scheduleOnce(callFunc,0.5);
    },
    
    onServerSettlement:function(data){
        this.hideOpenCard(1);
        this.hideOpenCard(2);
        this.hideGameStatus();
        // if(this.gameMode != 3)      //
        //     this.betItemListClean();
        console.log("onServerSettlement 1111111");
        if(this.isZhajinniu)
        {  
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer.hasOwnProperty(i))
                {
                    if(confige.roomPlayer[i] && confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        this.playerCardList[i] = data.player[i].handCard;
                    }                   
                }
            }
            this.hideDoBtnLayer();
            this.hideArrow();
            this.btnWatchCard.active = false;
            this.setRoundTime(0);
        }
        this.statusChange(0);

        console.log("onServerSettlement 222222222");
        //第一步显示玩家手牌
        for(var i in data.result)
        {
            if(data.result.hasOwnProperty(i))
            {
                if(this.isZhajinniu)
                {
                    if(data.player[i])
                    {
                        this.showOneCard(i);
                    }
                }else{
                    this.showOneCard(i);
                }
            }
        }
        console.log("onServerSettlement 33333333");
        this.waitForSettle = true;
        this.showCardBtn.active = false;
        this.gameStart = false;
        this.joinLate = false;
        this.btn_close.interactable = true;
        this.timerItem.hideTimer();

        //分割筹码
        console.log("分割筹码");
        console.log(data.curScores);
        if(this.gameMode == 4 || this.isZhajinniu == true)  //通比或者炸金牛
        {
            for(var i in data.curScores)
            {
                if(data.curScores[i] > 0)
                    this.betItemRemove(confige.getCurChair(i),data.curScores[i] + this.curBetNumList[confige.getCurChair(i)]);
            }
            for(var i=0;i<this.betItemCount;i++)
                this.betItemListAll[i].opacity = 0;
        }
        
        if(this.gameMode == 1 || this.isMingCardQZ)
        {
            this.betItemRemoveToBanker(confige.getCurChair(this.curBankerChair));

            var sendBetFunc = function(){
                this.betItemSendFromBanker(data.curScores,confige.getCurChair(this.curBankerChair));
            };

            this.scheduleOnce(sendBetFunc,0.25);
        }

        if(this.gameMode == 3)
        {
            for(var i in data.curScores)
            {
                if(data.curScores[i] >= 0)
                {
                    if(parseInt(i) != this.curBankerChair)
                    {
                        var sendBetFunc3 = function(){
                            console.log("confige.getCurChair(i)="+sendBetFunc3.chair+"data.curScores[i]"+sendBetFunc3.score);
                            this.betItemRemove(sendBetFunc3.chair,sendBetFunc3.score);
                        };
                        sendBetFunc3.chair = confige.getCurChair(i);
                        sendBetFunc3.score = data.curScores[i] + this.curBetNumList[confige.getCurChair(i)];
                        this.scheduleOnce(sendBetFunc3,0.5);
                    }
                }else if(data.curScores[i] < 0){
                    var award = data.result[i];
                    var addNum = (-data.curScores[i]) - this.curBetNumList[confige.getCurChair(i)];
                    console.log("parseInt(i)="+parseInt(i)+"this.curBankerChair"+this.curBankerChair+"parseInt(i) != this.curBankerChair"+(parseInt(i) != this.curBankerChair));
                    if(addNum != 0 && (parseInt(i) != this.curBankerChair))
                    {
                        console.log("fuck you 丟錢出來!!!!!!!!");
                        this.betItemListAddBet(confige.getCurChair(i), addNum);
                    }
                }
            }
        }
        console.log("onServerSettlement 4444444");
        //第二步延迟显示结算界面
        var showSettleFunc = function(){
            this.settleLayer.show(data.curScores[this.meChair]);
            for(var i in data.result)
            {
                if(data.result.hasOwnProperty(i))
                {
                    var niuType = data.result[i].type;
                    if(this.isZhajinniu)
                    {
                        if(data.player[i])// && data.player[i].isNoGiveUp == false)
                        {
                            var handCardCount = 0;
                            for(var z in data.player[i].handCard)
                            {
                                if(data.player[i].handCard.hasOwnProperty(z) && data.player[i].handCard[z])
                                    handCardCount ++;
                            }
                            if(handCardCount < 5)
                            {
                                console.log(i + "号玩家弃牌了");
                                niuType = 100;
                            }
                        }
                    }
                    this.settleLayer.addOneSettle(confige.roomData.player[i].playerInfo.nickname, niuType, data.curScores[i]);
                    this.playerScoreList[i] = data.realScores[i];
                    this.playerInfoList[confige.getCurChair(i)].setScore(this.playerScoreList[i]);
                }
            }
            
            console.log("onServerSettlement 55555555");
            // this.readyBtn.active = true;       //点击开始游戏直接准备,不需要显示准备按钮了
            if(this.roomCurTime < this.roomMaxTime)
                this.roomCurTime ++;
            this.roomTime.string = "第" + this.roomCurTime + "/" + this.roomMaxTime + "局";
            
            for(var i in confige.roomPlayer)
            {            
                if(confige.roomPlayer[i].isActive == true)            
                {
                    confige.roomPlayer[i].isReady = false;
                }
                this.isTurnImgList[i].active = false;
            }
            if(this.curBankerChair == this.meChair && this.gameMode == 3)        //本局庄家是自己的话
            {
                if(data.bankerTime >= 3) 
                {
                    this.popBanker.active = true;
                }
            }
            this.waitForSettle = false;

            // if(this.gameMode != 3)
            //     this.betItemListClean();
        };
        if(this.isZhajinniu)
            this.scheduleOnce(showSettleFunc,2.5);
        else
            this.scheduleOnce(showSettleFunc,1.5);
    },
    
    // onServeCurBanker:function(){
        
    // },
    
    showOverLayer:function(data){
        // 
        // var mask = this.node.getChildByName("touchMask").getComponent("cc.Button")
        var self = this;
        var overCallFunc = function(){
            console.log("overLayer.overCallFunc");
            // for(var i in data.player)
            // {
            //     var newPlayerData = data.player[i];
            //     if(newPlayerData.isActive == true)
            //     {
            //         var master = false;
            //         if(i === 0)
            //             master = true;
            //         self.overLayer.addOneOverData(newPlayerData,master);
            //     }
            // }
            self.overMask.active = true;
            self.overLayer.showOverWithData(data.player);
            self.overLayer.node.active = true;
        };
        if(this.waitForSettle == true)
            this.settleLayer.overCallBack = overCallFunc;
            //self.scheduleOnce(overCallFunc, 6);
        else
            overCallFunc();
    },
    
    othersShowCard:function(){
        console.log("fuck????????????????");
    },
    onTest:function(){
        console.log("fuck test ！！！！！！！！！！！！");
    },

    //触摸吞噬层,用于处理点击空白区域隐藏内容
    onClickTouchMask:function(){
        // if(this.showSayBox == true)
        //     this.btn_showQuickSay();
    },
    //聊天模块代码,聊天的内容在msg对象中,其中sayType表示聊天模式(0快捷聊天,1快捷表情,2输入文字聊天),当sayType为0或1时,通过index去索引内容,当为2时通过string来获取内容
    initChatLayer:function(){
        this.chatLayer = this.node.getChildByName("chatLayer");

        this.faceLayer = this.chatLayer.getChildByName("faceLayer");
        this.quickLayer = this.chatLayer.getChildByName("quickLayer");
        this.chatEdit = this.chatLayer.getChildByName("chatBox").getChildByName("chatEdit").getComponent("cc.EditBox");

        this.quickStringList = {};
        this.quickStringList[0] = "快点啊,等到花儿都谢了!";
        this.quickStringList[1] = "不要吵了,不要吵了,专心玩游戏吧!";
        this.quickStringList[2] = "不要走,决战到天亮!";
        this.quickStringList[3] = "底牌亮出来绝对吓死你!";
        this.quickStringList[4] = "风水轮流转,底裤都输掉了!";

        this.sayBoxList = {};
        this.sayBoxLabelNodeList = {};
        this.sayBoxLabelList = {};
        this.sayNode = this.node.getChildByName("sayList");
        this.sayBoxList[0] = this.sayNode.getChildByName("sayBox1");
        this.sayBoxList[1] = this.sayNode.getChildByName("sayBox2");
        this.sayBoxList[2] = this.sayNode.getChildByName("sayBox3");
        this.sayBoxList[3] = this.sayNode.getChildByName("sayBox4");
        this.sayBoxList[4] = this.sayNode.getChildByName("sayBox5");
        this.sayBoxList[5] = this.sayNode.getChildByName("sayBox6");
        
        for(var i=0;i<6;i++)
        {
            this.sayBoxLabelNodeList[i] = this.sayBoxList[i].getChildByName("text");
            this.sayBoxLabelList[i] = this.sayBoxLabelNodeList[i].getComponent("cc.Label");
        }
        // this.sayBoxTest = this.node.getChildByName("sayBox");
        // this.sayBoxLabel = this.sayBoxTest.getChildByName("text");

        this.sayBoxList[1].rotationY = 180;
        this.sayBoxLabelNodeList[1].rotationY = 180;

        this.faceList = {};
        this.faceList[0] = this.sayNode.getChildByName("face1");
        this.faceList[1] = this.sayNode.getChildByName("face2");
        this.faceList[2] = this.sayNode.getChildByName("face3");
        this.faceList[3] = this.sayNode.getChildByName("face4");
        this.faceList[4] = this.sayNode.getChildByName("face5");
        this.faceList[5] = this.sayNode.getChildByName("face6");

        this.faceFrameMap = confige.faceFrameMap;
    },

    onBtnShowChat:function(){
        this.chatLayer.active = true;
    },

    onBtnHideChat:function(){
        this.chatEdit.string = "";
        this.chatLayer.active = false;
    },

    onBtnChatLayerClick:function(event, customEventData){
        var clickIndex = parseInt(customEventData);
        if(clickIndex == 0)
        {
            this.faceLayer.active = true;
            this.quickLayer.active = false;
        }else if(clickIndex == 1){
            this.faceLayer.active = false;
            this.quickLayer.active = true;
        }

        if(clickIndex == 2)
        {
            var chatString = this.chatEdit.string;
            if(chatString != "")
                pomelo.clientSend("say",{"msg": {"sayType":2, "string": chatString}});
            
            console.log("say chat" + chatString);
            console.log("string length ====== " + chatString.length);
            // this.sayBoxLabel.getComponent("cc.Label").string = chatString;
            // console.log("sayBoxLabel w ====== " + this.sayBoxLabel.width);
            // this.sayBoxTest.width = this.sayBoxLabel.width + 100;
            // this.sayBoxLabel.x = this.sayBoxTest.width/2;
        }

        if(clickIndex >= 10 && clickIndex < 22)
        {
            var faceIndex = clickIndex - 10;
            pomelo.clientSend("say",{"msg": {"sayType":0, "index": faceIndex}});
            console.log("faceIndex" + faceIndex);
        }

        if(clickIndex >= 30 && clickIndex < 35)
        {
            var quickIndex = clickIndex - 30;
            pomelo.clientSend("say",{"msg": {"sayType":1, "index": quickIndex, "sex": confige.curSex}});
            console.log("quickIndex" + quickIndex);
        }

        if(clickIndex >= 2)
            this.onBtnHideChat();
    },

    showSayWithMsg:function(chair,msg){
        if(msg.sayType == 100)
        {
            this.showHeadFace(msg.chairBegin,msg.chairEnd,msg.index,msg.sex);
            return;
        }
        var curChair = confige.getCurChair(chair);
        
        if(msg.sayType == 255)
        {
            if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
            {
                var newYuyinData = {id:msg.id,chair:curChair.toString(),time:msg.time};
                this.addYuyinOnce(newYuyinData);
                // if(confige.curUsePlatform == 1)
                // {
                //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceDownloadVoice", "(Ljava/lang/String;Ljava/lang/String;)V", msg.id, curChair.toString());
                // }else if(confige.curUsePlatform == 2){
                //     jsb.reflection.callStaticMethod("JSCallOC", "GVoiceDownloadVoice:andChair:",msg.id,curChair.toString());
                // }
                // this.closeMusicAndSound();
                // if(this.playTimeSchedule != -1)
                //     this.unschedule(this.playTimeSchedule);
                // this.playTimeSchedule = function(){
                //     this.openMusicAndSound();
                // };
                // this.scheduleOnce(this.playTimeSchedule, (msg.time+1));

                // var newSayItem = cc.instantiate(this.sayItemPrefab);
                // this.sayAniNode.addChild(newSayItem);
                // newSayItem.x = this.sayPosList[curChair].x;
                // newSayItem.y = this.sayPosList[curChair].y;
                // var sayDestory = cc.callFunc(function () {
                //     newSayItem.destroy();
                // }, this);
                // newSayItem.runAction(cc.sequence(cc.delayTime(msg.time+1), sayDestory));
            }
            
            return;
        }

        var curString = "";

        if(msg.sayType == 0)
        {
            console.log("someone say face！！！" + msg.index);
            this.faceList[curChair].active = true;
            this.faceList[curChair].getComponent("cc.Sprite").spriteFrame = this.faceFrameMap[msg.index];
            this.faceList[curChair].opacity = 255;
            this.faceList[curChair].stopAllActions();
            this.faceList[curChair].runAction(cc.sequence(cc.delayTime(1),cc.fadeOut(1.5)));
        }else if(msg.sayType == 1){
            console.log("someone say quick!!!!!" + msg.index + "sex ===" + msg.sex);
            console.log(this.quickStringList[msg.index]);
            curString = this.quickStringList[msg.index];
            if(confige.soundEnable == true)
            {
                if(msg.sex == 2)
                {
                    cc.audioEngine.play(confige.audioList["female_chat_"+msg.index],false,confige.audioVolume);
                }else{
                    cc.audioEngine.play(confige.audioList["male_chat_"+msg.index],false,confige.audioVolume);
                }
            }
        }else if(msg.sayType == 2){
            console.log("someone say:" + msg.string);
            curString = msg.string;
        }
        
        if(msg.sayType > 0)
        {
            this.sayBoxList[curChair].active = true;
            this.sayBoxLabelList[curChair].string = curString;
            this.sayBoxList[curChair].width = this.sayBoxLabelNodeList[curChair].width + 100;
            this.sayBoxLabelNodeList[curChair].x = this.sayBoxList[curChair].width/2;

            this.sayBoxList[curChair].opacity = 255;
            this.sayBoxList[curChair].stopAllActions();
            this.sayBoxList[curChair].runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(2)));
        }
    },


    showSettingLayer:function(){
        this.settingLayer.showSetting();
    },

    resetScene:function(){
        this.pushBanker.active = false;
        this.unpushBanker.active = false;
        this.popBanker.active = false;
        this.readyBtn.active = true;
        this.showCardBtn.active = false;
        this.betBtnBox.active = false;
        this.betBtnBoxS.active = false;
        this.timerItem.active = false;
    },

    //根据重连数据重现游戏状态
    recoverGame:function(){
        console.log("on recoverGame() !!!!!!!!!!!!!");
        this.roomMaxTime = confige.curReconnectData.roomInfo.maxGameNumber;
        //重置场景
        this.resetScene();
        
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(confige.roomPlayer[i].isReady == true)
                    this.cardItemList.activePlayer(confige.getCurChair(i));

                if(confige.roomPlayer[i].isOnline == false)
                    this.leaveNodeList[confige.getCurChair(i)].active = true;
                else
                    this.leaveNodeList[confige.getCurChair(i)].active = false;
            }
        }
        //重现当前玩家分数和显示庄家
        // console.log(confige.roomPlayer);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(this.playerActiveList[confige.getCurChair(i)] == false)
                {
                    console.log("this.playerActiveList === addone");
                    this.addOnePlayer(confige.roomPlayer[i]);
                }
                this.playerScoreList[i] = confige.curReconnectData.roomInfo.player[i].score - confige.curReconnectData.betList[i];
                // if(this.isZhajinniu)
                    // this.playerScoreList[i] -= this.zhajinniuBasic;
                this.playerInfoList[confige.getCurChair(i)].setScore(this.playerScoreList[i]);
                if(confige.curReconnectData.roomInfo.player[i].isBanker == true)
                {
                    this.playerList[confige.getCurChair(i)].getChildByName("banker").active = true;
                    this.lightBgList[confige.getCurChair(i)].active = true;
                    this.curBankerChair = i;//confige.getCurChair(i);
                    console.log("重连时庄家==="+this.curBankerChair);
                    if(this.curBankerChair == this.meChair && this.gameMode == 3)        //本局庄家是自己的话
                    {
                        if(confige.curReconnectData.roomInfo.bankerTime >= 3)
                        {
                            this.popBanker.active = true;
                        }
                    }
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
                    this.curBetNumList[curChair] = confige.curReconnectData.betList[i];
                    this.betNumLabelList[curChair].string = this.curBetNumList[curChair] + "分";
                    if(confige.roomPlayer[i].isBanker == false)
                        this.betNumNodeList[curChair].active = true;
                }
            }
            this.allBetNum = curBetCount;
            this.showScorePool(this.allBetNum);
            this.betItemListAddBet(confige.getCurChair(this.curBankerChair),this.allBetNum);
            this.readyBtn.active = false;

            //重现当前局数显示
            this.roomCurTime = confige.curReconnectData.roomInfo.gameNumber;
            this.roomTime.string = "第" + this.roomCurTime + "/" + this.roomMaxTime + "局";
            console.log("重连"+ this.roomTime.string);
            this.gameBegin = true;
            this.btn_close.interactable = false;
            this.btn_inviteFriend.active = false;
        }else{
            //重现当前局数显示
            this.roomCurTime = confige.curReconnectData.roomInfo.gameNumber + 1;
            this.roomTime.string = "第" + this.roomCurTime + "/" + this.roomMaxTime + "局";
            console.log("重连"+ this.roomTime.string);
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    this.playerList[confige.getCurChair(i)].getChildByName("isReady").active = true;
                    if(i == this.meChair)
                        this.readyBtn.active = false;
                }
            }
        }

        switch(confige.curReconnectData.state){
            case 1001:      //空闲阶段
                // this.statusChange(0);
                if(this.curBankerChair != -1){
                    this.playerList[this.curBankerChair].getChildByName("banker").active = false;
                    this.lightBgList[this.curBankerChair].active = false;
                }
                break;
            case 1002:      //下注阶段
                // this.statusChange(1);
                if(this.curBankerChair != this.meChair)
                {
                    if(!this.isMingCardQZ)
                    {
                        if(this.gameMode == 3)
                        {
                            var curMin = Math.max(Math.floor(confige.curReconnectData.bonusPool / this.playerCount / 5), 1);// - this.myBetNum;
                            var curMax = Math.min(Math.floor(confige.curReconnectData.bonusPool/(this.playerCount-1)), 40); - this.myBetNum;
                            console.log("curMax ===== " + curMax);
                            this.showSlider(curMin,curMax);
                        }else{
                            this.betBtnBox.active = true;
                        }
                    }
                }
                break;
            case 1003:      //发牌阶段
                // this.statusChange(2);
                console.log("case 1003:!!!!!!!!");
                console.log(confige.roomPlayer);
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true)
                    {
                        this.playerCardList[i] = confige.curReconnectData.roomInfo.player[i].handCard;
                        console.log("取出玩家的牌数据" + i)
                        console.log(this.playerCardList[i]);
                        this.playerHandCardList[confige.getCurChair(i)].initCardWithBack();
                        if(confige.roomPlayer[i].isShowCard == true)
                            this.showOneCard(i);
                    }
                }

                this.showOneCard(this.meChair,-1);
                this.btn_showMyCard();
                //this.showCardBtn.active = true;
                break;
            case 1004:      //结算阶段
                // this.statusChange(0);
                break;
            case 1005:      //抢庄阶段
                // this.statusChange(1);
                //this.pushBanker.active = true;
                break;
            case 1006:
                break;
        }

        if(this.cardMode == 2)          //明牌处理
        {
            if(confige.curReconnectData.state == 1002)
                this.showMingCard(confige.curReconnectData.roomInfo.player[this.meChair].handCard);
        }

        if(this.gameMode == 3)          //斗公牛模式
        {
            if(this.onReConnect == true)
                this.showScorePool(confige.curReconnectData.bonusPool,0,false,true);
            else
                this.showScorePool(confige.curReconnectData.bonusPool,0);

        }else if(this.gameMode == 4){   //通比模式

        }

        if(this.roomCurTime != 1)
        {
            this.btn_inviteFriend.active = false;
            this.gameBegin = true;
        }else{
            console.log("fuck roomCurTime === " + this.roomCurTime);
        }

        console.log("this.gameBegin======??????" + this.gameBegin);

        if(this.isZhajinniu)
        {
            if(confige.curReconnectData.state == 1001)
            {
                confige.curReconnectData = -1;
                return;
            }
            console.log("特殊处理炸金牛的重连");
            console.log("this.playerCount ===== " + this.playerCount);
            if(this.isZhajinniu == true)
            {
                this.hideDoBtnLayer();
                this.curRound = confige.curReconnectData.roomInfo.curRound;
                var curCardNum = 0;
                if(this.curRound == 0)
                {   
                    curCardNum = 3;
                }else if(this.curRound == 1){
                    curCardNum = 4;
                }else if(this.curRound == 2){
                    curCardNum = 5;
                }else if(this.curRound == 3){
                    curCardNum = 5;
                }
                this.setRoundTime(this.curRound + 1);
                console.log("curCardNum=====" + curCardNum);
                var curBetCount = 0;
                var meGiveUp = false;
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        var curChair = confige.getCurChair(i);
                        this.playerHandCardList[curChair].resetCard();
                        for(var j=0;j<curCardNum;j++)
                            this.playerHandCardList[curChair].showCardBackWithIndex(j);
                        if(this.cardMode == 2)
                        {
                            var curCardData = confige.curReconnectData.roomInfo.player[i].handCard;
                            for(var k in curCardData)
                            {
                                var index = parseInt(k);
                                this.playerHandCardList[curChair].setCardWithIndex(index, curCardData[index].num, curCardData[index].type);
                            }
                        }

                        if(confige.curReconnectData.roomInfo.player[i].isShowCard == true)
                        {
                            this.lookCardList[curChair] = true;
                            this.watchCardImgList[curChair].active = true;
                            if(curChair == 0)
                                this.isWatchCard = true;
                        }
                        if(confige.curReconnectData.roomInfo.player[i].isNoGiveUp == false)
                        {
                            this.loseList[curChair] = true;
                            this.loseNodeList[curChair].active = true;
                            this.giveUpList[curChair] = true;
                            this.discardImgList[curChair].active = true;
                            this.watchCardImgList[curChair].active = false;
                            if(curChair == 0)
                                meGiveUp = true;
                        }
                        curBetCount += confige.curReconnectData.betList[i];
                        this.curBetNumList[curChair] = confige.curReconnectData.betList[i];
                        this.betNumLabelList[curChair].string = this.curBetNumList[curChair] + "分";
                    }
                }

                if(this.cardMode == 2 || this.isWatchCard == true)
                {
                    this.btnWatchCard.active = false;
                }else{
                    if(meGiveUp == true)
                    {
                        this.btnWatchCard.active = false;
                        // console.log("this.btnWatchCard.active = false;")
                    }
                    else{
                        this.btnWatchCard.active = true;
                        // console.log("this.btnWatchCard.active = true;")
                    }
                }

                this.allBetNum = curBetCount;
                this.showScorePool(this.allBetNum);
                this.betItemListAddBet(confige.getCurChair(this.curBankerChair),this.allBetNum);

                var curPlayerChair = confige.getCurChair(confige.curReconnectData.roomInfo.curPlayer);
                this.changeArrow(curPlayerChair);
                if(this.isWatchCard == true)
                {
                    var curCardData = confige.curReconnectData.roomInfo.player[this.meChair].handCard;
                    for(var k in curCardData)
                    {
                        var index = parseInt(k);
                        this.playerHandCardList[0].setCardWithIndex(index, curCardData[index].num, curCardData[index].type);
                    }
                }
                if(this.cardMode == 1 && this.isWatchCard == true)
                    this.changeBetNum(1);
                if(curPlayerChair == 0)
                {
                    this.showDoBtnLayer(confige.curReconnectData.roomInfo.curBet);
                    if(this.curRound != 2)
                        this.hideBtnCompare();
                }else{
                    this.hideDoBtnLayer();
                }
            }
        }
        if(this.isMingCardQZ)
        {
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    this.cardItemList.activePlayer(confige.getCurChair(i));
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
                this.robMaxNumNode.active = true;
                this.robMaxNumLabel.string = this.curRobMaxNum + ";<";
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
                        this.playerHandCardList[curChair].showCardBackWithCount(4);
                        console.log("重连直接显示玩家盖着的牌" + i);
                        if(curPlayerData.handCard)
                        {
                            var callFunc = function(){
                                for(var i in callFunc.cards)
                                {
                                    this.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
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
                        this.playerList[i].getChildByName("banker").active = false;
                        if(robStateList[i] != -1)
                        {
                            var curChair = confige.getCurChair(i);
                            if(robStateList[i] > this.curRobMaxNum)
                                this.curRobMaxNum = robStateList[i];
                            if(robStateList[i] == 0)
                                this.noRobImgList[curChair].active = true;
                            else{
                                this.robNumLabelList[curChair].string = ">?;"+robStateList[i];
                                this.robNumNodeList[curChair].active = true;
                            }
                        }else{
                            if(parseInt(i) == this.meChair)
                                this.robBtnBox.active = true;
                        }
                    }
                    // this.statusChange(2);
                }
            }   
        }

        confige.curReconnectData = -1;
    },

    connectCallBack:function(){

    },

    //炸金牛模式的处理
    initZhajinniuLayer:function(){
        console.log("炸金牛模式的处理 ！！！！！！！！！！！");
        this.zhajinniuLayer = this.node.getChildByName("zhajinniuLayer");
        // this.zhajinniuScoreList = {};
        // this.zhajinniuScoreList[0] = this.zhajinniuLayer.getChildByName("bet0");
        // this.zhajinniuScoreList[1] = this.zhajinniuLayer.getChildByName("bet1");
        // this.zhajinniuScoreList[2] = this.zhajinniuLayer.getChildByName("bet2");
        // this.zhajinniuScoreList[3] = this.zhajinniuLayer.getChildByName("bet3");
        // this.zhajinniuScoreList[4] = this.zhajinniuLayer.getChildByName("bet4");
        // this.zhajinniuScoreList[5] = this.zhajinniuLayer.getChildByName("bet5");
        // this.zhajinniuNumList = {};
        // this.zhajinniuNumList[0] = this.zhajinniuScoreList[0].getChildByName("betNum").getComponent("cc.Label");
        // this.zhajinniuNumList[1] = this.zhajinniuScoreList[1].getChildByName("betNum").getComponent("cc.Label");
        // this.zhajinniuNumList[2] = this.zhajinniuScoreList[2].getChildByName("betNum").getComponent("cc.Label");
        // this.zhajinniuNumList[3] = this.zhajinniuScoreList[3].getChildByName("betNum").getComponent("cc.Label");
        // this.zhajinniuNumList[4] = this.zhajinniuScoreList[4].getChildByName("betNum").getComponent("cc.Label");
        // this.zhajinniuNumList[5] = this.zhajinniuScoreList[5].getChildByName("betNum").getComponent("cc.Label");
        // this.zhajinniuCurBetNum = {};
        // this.zhajinniuCurBetNum[0] = 0;
        // this.zhajinniuCurBetNum[1] = 0;
        // this.zhajinniuCurBetNum[2] = 0;
        // this.zhajinniuCurBetNum[3] = 0;
        // this.zhajinniuCurBetNum[4] = 0;
        // this.zhajinniuCurBetNum[5] = 0;

        this.doBtnLayer = this.zhajinniuLayer.getChildByName("doBtnLayer");
        this.zhaBetBtnBox = this.doBtnLayer.getChildByName("betBtnBox");
        this.btnAbandonCard = this.doBtnLayer.getChildByName("abandonCard");
        this.btnCompareCard = this.doBtnLayer.getChildByName("compareCard");
        this.btnWatchCard = this.zhajinniuLayer.getChildByName("watchCard");
        this.compareBtnBox = this.zhajinniuLayer.getChildByName("compareBtnBox");

        this.zhaBetList = {};
        this.zhaBetList[1] = this.zhaBetBtnBox.getChildByName("bet1");
        this.zhaBetList[2] = this.zhaBetBtnBox.getChildByName("bet2");
        this.zhaBetList[3] = this.zhaBetBtnBox.getChildByName("bet3");
        this.zhaBetList[4] = this.zhaBetBtnBox.getChildByName("bet4");
        this.zhaBetList[5] = this.zhaBetBtnBox.getChildByName("bet5");

        this.zhajinniuLayer.active = true;
        // for(var i in this.zhajinniuScoreList)
        // {
        //     if(this.zhajinniuScoreList.hasOwnProperty(i))
        //     {
        //         if(parseInt(i) < this.playerCount)
        //             this.zhajinniuScoreList[confige.getCurChair(i)].active = true;
        //     }
        // }
        this.curRound = 0;
        this.isWatchCard = false;
        this.meGiveUp = false;

        this.lookCardList = {};
        this.giveUpList = {};
        this.loseList = {};
        for(var i=0;i<6;i++)
        {
            this.lookCardList[i] = false;
            this.giveUpList[i] = false;
            this.loseList[i] = false;
        }

        this.compareBtnList = {};
        this.compareBtnList[1] = this.compareBtnBox.getChildByName("compare1");
        this.compareBtnList[2] = this.compareBtnBox.getChildByName("compare2");
        this.compareBtnList[3] = this.compareBtnBox.getChildByName("compare3");
        this.compareBtnList[4] = this.compareBtnBox.getChildByName("compare4");
        this.compareBtnList[5] = this.compareBtnBox.getChildByName("compare5");

        this.loseNodeList = {};
        this.loseNodeList[0] = this.zhajinniuLayer.getChildByName("lose0");
        this.loseNodeList[1] = this.zhajinniuLayer.getChildByName("lose1");
        this.loseNodeList[2] = this.zhajinniuLayer.getChildByName("lose2");
        this.loseNodeList[3] = this.zhajinniuLayer.getChildByName("lose3");
        this.loseNodeList[4] = this.zhajinniuLayer.getChildByName("lose4");
        this.loseNodeList[5] = this.zhajinniuLayer.getChildByName("lose5");

        this.zhajinniuBasic = confige.roomData.basic;
        console.log("fuck 炸金牛基础分数"+this.zhajinniuBasic);
        this.roomTimeNode.active = false;
        this.roundTime = this.roomInfo.getChildByName("nowRound").getComponent("cc.Label");

        this.pkLayer = this.zhajinniuLayer.getChildByName("pkLayer");
        this.pk1 = this.pkLayer.getChildByName("pk1");
        this.pk2 = this.pkLayer.getChildByName("pk2");
        this.pk1Head = this.pk1.getChildByName("head").getComponent("cc.Sprite");
        this.pk1Name = this.pk1.getChildByName("name").getComponent("cc.Label");
        this.pk1Win = this.pk1.getChildByName("pkWin");
        this.pk1Lose = this.pk1.getChildByName("pkLose");
        this.pk2Head = this.pk2.getChildByName("head").getComponent("cc.Sprite");
        this.pk2Name = this.pk2.getChildByName("name").getComponent("cc.Label");
        this.pk2Win = this.pk2.getChildByName("pkWin");
        this.pk2Lose = this.pk2.getChildByName("pkLose");
        this.pkImg = this.pkLayer.getChildByName("pkImg");
    },

    setRoundTime:function(number){
        if(number == 0)
        {
            this.roundTime.string = "";
        }else{
            switch(number){
                case 1:
                this.roundTime.string = "第一轮";
                break;
                case 2:
                this.roundTime.string = "第二轮";
                break;
                case 3:
                this.roundTime.string = "第三轮";
                break;
                case 4:
                this.roundTime.string = "第四轮";
                break;
            };
        }
    },

    changeArrow:function(index){
        this.hideArrow();
        this.isTurnImgList[index].active = true;
        this.isTurnImgList[index].opacity = 255;
        this.isTurnImgList[index].runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.3,100),cc.fadeTo(0.3,255))));
    },

    hideArrow:function(){
        for(var i=0;i<6;i++)
        {
            this.isTurnImgList[i].stopAllActions();
            this.isTurnImgList[i].active = false;
        }
    },

    showDoBtnLayer:function(curBet){
        this.doBtnLayer.active = true;
        for(var i=1;i<curBet;i++)
        {
            this.zhaBetList[i].getComponent("cc.Button").interactable = false;
        }
    },

    hideDoBtnLayer:function(){
        this.doBtnLayer.active = false;
        this.btnCompareCard.active = true;
        for(var i=1;i<=5;i++)
        {
            this.zhaBetList[i].getComponent("cc.Button").interactable = true;
        }
    },

    hideBtnCompare:function(){
        this.btnCompareCard.active = false;
    },

    showCompareLayer:function(){
        console.log("showCompareLayer begin");
        this.compareBtnBox.active = true;
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer.hasOwnProperty(i)){
                if(confige.roomPlayer[i] && confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    var curIndex = confige.getCurChair(i);
                    if(curIndex != 0 &&
                       this.giveUpList[curIndex] == false &&
                       this.loseList[curIndex] == false)
                    {
                        console.log("showCompareLayer" + i);
                        this.compareBtnList[curIndex].active = true;
                        this.lightBgList[curIndex].active = true;
                        this.lightBgList[curIndex].runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.5,100),cc.fadeTo(0.5,255))));
                    }
                }               
            }
        }
    },
    hideCompareLayer:function(){
        this.compareBtnBox.active = false;
        for(var i=1;i<6;i++)
        {
            this.compareBtnList[i].active = false;
            this.lightBgList[i].stopAllActions();
            this.lightBgList[i].active = false;
        }
    },
    changeBetNum:function(type){
        if(type == 0)
        {
            this.zhaBetList[1].getChildByName("Label").getComponent("cc.Label").string = 1;
            this.zhaBetList[2].getChildByName("Label").getComponent("cc.Label").string = 2;
            this.zhaBetList[3].getChildByName("Label").getComponent("cc.Label").string = 3;
            this.zhaBetList[4].getChildByName("Label").getComponent("cc.Label").string = 4;
            this.zhaBetList[5].getChildByName("Label").getComponent("cc.Label").string = 5;
        }else if(type == 1){
            this.zhaBetList[1].getChildByName("Label").getComponent("cc.Label").string = 2;
            this.zhaBetList[2].getChildByName("Label").getComponent("cc.Label").string = 4;
            this.zhaBetList[3].getChildByName("Label").getComponent("cc.Label").string = 6;
            this.zhaBetList[4].getChildByName("Label").getComponent("cc.Label").string = 8;
            this.zhaBetList[5].getChildByName("Label").getComponent("cc.Label").string = 10;
        }
    },

    onBtnClickZhaLayer:function(event, customEventData){
        console.log("clickIndex" + customEventData);
        var clickIndex = parseInt(customEventData);
        switch(clickIndex){
            //下注按钮
            case 1:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 1});
                this.hideDoBtnLayer();
                break;
            case 2:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 2});
                this.hideDoBtnLayer();
                break;
            case 3:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 3});
                this.hideDoBtnLayer();
                break;
            case 4:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 4});
                this.hideDoBtnLayer();
                break;
            case 5:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 5});
                this.hideDoBtnLayer();
                break;
            //下注之外的操作
            case 11:    //弃牌
                pomelo.clientSend("useCmd",{"cmd" : "giveUp"});
                this.hideDoBtnLayer();
                break;
            case 12:    //比牌
                this.showCompareLayer();
                break;
            case 13:    //看牌
                pomelo.clientSend("useCmd",{"cmd" : "look"});
                break;  
            //比牌选择座位按钮
            case 21:
                console.log("compare with chair ===== " + confige.getOriChair(1));
                pomelo.clientSend("useCmd",{"cmd" : "compare","target" : confige.getOriChair(1)});
                this.hideCompareLayer();
                this.hideDoBtnLayer();
                break;
            case 22:
                console.log("compare with chair ===== " + confige.getOriChair(2));
                pomelo.clientSend("useCmd",{"cmd" : "compare","target" : confige.getOriChair(2)});
                this.hideCompareLayer();
                this.hideDoBtnLayer();
                break;
            case 23:
                console.log("compare with chair ===== " + confige.getOriChair(3));
                pomelo.clientSend("useCmd",{"cmd" : "compare","target" : confige.getOriChair(3)});
                this.hideCompareLayer();
                this.hideDoBtnLayer();
                break;
            case 24:
                console.log("compare with chair ===== " + confige.getOriChair(4));
                pomelo.clientSend("useCmd",{"cmd" : "compare","target" : confige.getOriChair(4)});
                this.hideCompareLayer();
                this.hideDoBtnLayer();
                break;
            case 25:
                console.log("compare with chair ===== " + confige.getOriChair(5));
                pomelo.clientSend("useCmd",{"cmd" : "compare","target" : confige.getOriChair(5)});
                this.hideCompareLayer();
                this.hideDoBtnLayer();
                break;
        }
    },

    onServerZhaCall:function(data){
        switch(data.cmd){
            case "curRound":
                console.log("当前进行到第" + data.curRound + "轮");
                this.curRound = data.curRound;
                this.setRoundTime((this.curRound+1));
                //this.hideArrow();
                this.hideDoBtnLayer();
                switch(this.curRound){
                    case 0:
                        if(this.joinLate == false)
                            this.newDisCard(3);
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                console.log("显示玩家暗牌");
                                var curChair = confige.getCurChair(i);
                                
                                if(this.cardMode == 2)
                                {
                                    this.playerCardList[this.meChair] = data.cards;
                                    var curCardData = data.cards[i];
                                    var callFunc = function(){
                                        console.log("显示玩家明牌");
                                        for(var j in callFunc.curCardData)
                                        {
                                            var index = parseInt(j);
                                            this.playerHandCardList[callFunc.curChair].setCardWithIndex(index, callFunc.curCardData[index].num, callFunc.curCardData[index].type);
                                        }
                                    };
                                    callFunc.curCardData = curCardData;
                                    callFunc.curChair = curChair;
                                    this.scheduleOnce(callFunc,0.5);
                                }
                            }
                        }
                        break;
                    case 1:
                        if(this.joinLate == false)
                            this.newDisCard(1);
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                var curChair = confige.getCurChair(i);
                                if(this.giveUpList[curChair] == false && (this.joinLate == true || this.onReConnect == true))
                                    this.playerHandCardList[curChair].showCardBackWithIndex(3);
                            }
                        }
                        console.log("this.lookCardList[this.meChair]===" + this.lookCardList[this.meChair]);
                        if(this.cardMode == 2 && this.meGiveUp == false)
                        {
                            console.log(this.playerCardList[this.meChair]);
                            if(data.card)
                            {
                                this.playerCardList[this.meChair][3] = data.card;
                                var callFunc2 = function(){
                                    this.showOpenCard(1);
                                };
                                this.scheduleOnce(callFunc2,0.3);
                            }
                        }
                        if(this.lookCardList[this.meChair])
                        {
                            if(data.card)
                            {
                                var callFunc = function(){
                                    this.playerHandCardList[confige.getCurChair(this.meChair)].setCardWithIndex(3, callFunc.data.card.num, callFunc.data.card.type);
                                }
                                callFunc.data = data;
                                this.scheduleOnce(callFunc,0.5);
                            }
                        }
                        break;
                    case 2:
                        if(this.joinLate == false)
                            this.newDisCard(1);
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                var curChair = confige.getCurChair(i);
                                if(this.giveUpList[curChair] == false && (this.joinLate == true || this.onReConnect == true))
                                    this.playerHandCardList[curChair].showCardBackWithIndex(4);
                           }
                        }
                        console.log("this.lookCardList[this.meChair]===" + this.lookCardList[this.meChair]);
                        
                        if(this.cardMode == 2 && this.meGiveUp == false)
                        {
                            console.log(this.playerCardList[this.meChair]);
                            if(data.card)
                            {
                                this.playerCardList[this.meChair][4] = data.card;
                                var callFunc2 = function(){
                                    this.showOpenCard(2);
                                };
                                this.scheduleOnce(callFunc2,0.3);
                            }
                        }
                        if(this.lookCardList[this.meChair])
                        {
                            if(data.card)
                            {
                                var callFunc = function(){
                                    this.playerHandCardList[confige.getCurChair(this.meChair)].setCardWithIndex(4, callFunc.data.card.num, callFunc.data.card.type);
                                }
                                callFunc.data = data;
                                this.scheduleOnce(callFunc,0.5);
                            }
                        }
                        break;
                    case 3:
                        break;
                }
                break;
            case "nextPlayer":
                console.log("当前进行操作的玩家座位是" + data.chair);
                var curChair = confige.getCurChair(data.chair);
                this.changeArrow(curChair);                
                if(curChair == 0)
                {
                    if(this.zhajinniuRoundTime > 10)
                    {
                        var self = this;
                        self.timeCallFunc = function(){
                            console.log("nextPlayer.timeCallFunc!!!!!!!!!!!!!!");
                            self.timerItem.setTime(10);
                        };
                        this.scheduleOnce(self.timeCallFunc, (this.zhajinniuRoundTime-10));
                        console.log("this.timerItem.scheduleOnce");   
                    }else{
                        this.timerItem.setTime(this.zhajinniuRoundTime);
                    }
                    
                    this.showGameStatus(2);
                    this.showDoBtnLayer(data.curBet);
                    
                    if(this.curRound != 2)
                        this.hideBtnCompare();
                }else{
                    if(this.timeCallFunc != -1)
                    {
                        this.timerItem.hideTimer();
                        this.unschedule(this.timeCallFunc);
                    }
                    this.showGameStatus(4);
                    this.hideDoBtnLayer();
                }
                break; 
            case "lookCard":
                var curChair = confige.getCurChair(data.chair);
                this.watchCardImgList[curChair].active = true;
                if(data.handCard)
                {
                    if(curChair == 0)
                    {
                        this.lookCardList[this.meChair] = true;
                        this.isWatchCard = true;
                        this.changeBetNum(1);
                        this.btnWatchCard.active = false;
                        this.hideOpenCard(1);
                        this.hideOpenCard(2);
                    }
                    for(var l in data.handCard)
                    {
                        var index = parseInt(l);
                        this.playerHandCardList[curChair].setCardWithIndex(index, data.handCard[index].num, data.handCard[index].type);
                    }
                }
                break;
            case "compare":
                var fromChair = confige.getCurChair(data.chair);
                var targetChair = confige.getCurChair(data.target);
                var curWinChair = confige.getCurChair(data.winPlayer);
                var curLoseChair = (fromChair == curWinChair) ? targetChair : fromChair;

                this.showPK(data.chair,data.target,data.winPlayer);
                if(curLoseChair == 0)
                {
                    this.meGiveUp = true;
                    this.hideOpenCard(1);
                    this.hideOpenCard(2);
                }
                this.loseList[curLoseChair] = true;
                this.loseNodeList[curLoseChair].active = true;
                this.watchCardImgList[curLoseChair].active = false;
                this.failureImgList[curLoseChair].active = true;
                this.cardItemList.deActivePlayer(curLoseChair);
                if(data.handCard)
                {
                    this.playerCardList[this.meChair] = data.handCard;
                    this.showOneCard(this.meChair);
                    this.btnWatchCard.active = false;
                }
                break;
            case "giveUp":
                var curChair = confige.getCurChair(data.chair);
                this.giveUpList[curChair] = true;
                this.loseNodeList[curChair].active = true;
                this.watchCardImgList[curChair].active = false;
                this.discardImgList[curChair].active = true;
                this.cardItemList.deActivePlayer(curChair);
                if(curChair == 0)
                {
                    this.btnWatchCard.active = false;
                    this.timerItem.hideTimer();
                    this.meGiveUp = true;
                    this.hideOpenCard(1);
                    this.hideOpenCard(2);
                }
                for(var g in data.handCard)
                {
                    var index = parseInt(g);
                    if(data.handCard[g])
                        this.playerHandCardList[0].setCardWithIndex(index, data.handCard[index].num, data.handCard[index].type);
                }
                break;
            }   
    },

    onNewGameStart:function(){
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                this.cardItemList.activePlayer(confige.getCurChair(i));
                this.playerList[confige.getCurChair(i)].getChildByName("banker").active = false;
            }
        }
        this.gameBegin = true;
        this.gameStart = true;
        this.meGiveUp = false;
        this.newResetCard();
        console.log("onNewGameStart");
        for(var i=0;i<6;i++)
        {
            this.playerList[i].getChildByName("isReady").active = false;
        }
        this.btn_inviteFriend.active = false;
        this.btn_inviteFriend.active = false;
        this.btn_close.interactable = false;
        this.playerCount = this.newPlayerCount;
        this.noShowCardCount = this.playerCount;
        if(confige.roomData.gameMode != 3)
            this.showScorePool(0);
    },

    onNewGameBegin:function(data){
        this.gameStart = true;
        this.playerCount = this.newPlayerCount;
        console.log("onNewGameBegin" + this.playerCount);
        this.allBetNum = 0;
        if(this.isZhajinniu)
        {
            this.changeBetNum(0);
            this.isWatchCard = false;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true)
                {
                    var curChair = confige.getCurChair(i);
                    console.log("onNewGameBegin" + curChair + "score===" + data.betList[i]);

                    this.playerList[curChair].getChildByName("isReady").active = false;
                    this.betNumNodeList[curChair].active = true;
                    this.curBetNumList[curChair] = data.betList[i];
                    this.betNumLabelList[curChair].string = this.curBetNumList[curChair].toString() + "分";
                    this.allBetNum += data.betList[i];

                    // this.playerScoreList[i] -= this.zhajinniuBasic;
                    // this.playerInfoList[confige.getCurChair(i)].setScore(this.playerScoreList[i]);
                }
            }
            if(this.cardMode == 1)
            {
                this.btnWatchCard.active = true;
            }
        }
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
                            this.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
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

    btnClickFinish:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        if(clickIndex == 0)             //show
        {
            if(this.gameBegin == true)
            {
                this.tipsLabel.string = "是否要发起解散房间请求！";
            }else{
                this.tipsLabel.string = "是否要退出房间回到大厅！";
            }
            this.tipsBox.active = true;
        }else if(clickIndex == 1) {     //send
            if(this.gameBegin == true)
            {
                console.log("send finish");
                pomelo.request("connector.entryHandler.sendFrame", {"code" : "finish"}, function(data) {
                    console.log("finish flag is : "+ data.flag)
                    // if(data.flag == true)
                }
                );
            }else{
                console.log("send userQuit");
                pomelo.request("connector.entryHandler.sendFrame", {"code" : "userQuit"}, function(data) {
                    console.log("userQuit flag is : "+ data.flag)
                    if(data.flag == true)
                    {
                        cc.director.loadScene('HallScene');
                        if(confige.curGameScene.yuyinTimeOut != -1)
                            clearTimeout(confige.curGameScene.yuyinTimeOut);
                        confige.curGameScene.destroy();
                        confige.resetGameData();
                        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
                        {
                            confige.GVoiceCall.quitRoom(confige.GVoiceRoomID);
                            confige.GVoiceCall.closeListen();
                        }
                    }
                }
                );
            }
            this.tipsBox.active = false;
        }else if(clickIndex == 2) {      //hide
            this.tipsBox.active = false;
        }        
    },

    onServerShowFinish:function(data){
        console.log("onServerShowFinish()");
        console.log(confige.roomPlayer);
        console.log(this.newPlayerCount);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                var userNick = confige.roomPlayer[i].playerInfo.nickname;
                this.finishLayer.setPlayerName(i,userNick);
            }
        }
        this.finishLayer.showPlayer(this.newPlayerCount);
        this.finishLayer.runTime(180);
        this.finishLayer.showFinishLayer();
    },

    onServerResponseFinish:function(data){
        if(data.chair == this.meChair)
            this.finishLayer.hideAllBtn();
        var curType = 0;
        if(data.result == true)
            curType = 1;
        else if(data.result == false)
            curType = 2;
        this.finishLayer.setPlayerType(data.chair,curType);
    },

    onServerEndFinish:function(){
        this.finishLayer.hideFinishLayer();
    },

    betItemListAddBet:function(chair,betNum){
        console.log("betItemListAddBet" + chair);
        for(var i=0;i<betNum;i++)
        {
            var newBetItem = cc.instantiate(this.betItemPrefab);
            newBetItem.getComponent("cc.Sprite").spriteFrame = this.betFrameList[3];//[Math.floor(Math.random()*100)%6];
            this.mainBg.addChild(newBetItem);
            newBetItem.x = this.betBeginPosList[chair].x;
            newBetItem.y = this.betBeginPosList[chair].y;
            // var newBetItemLabel = newBetItem.getChildByName("num").getComponent("cc.Label");
            // newBetItemLabel.string = betNum;
            this.betItemListAll[this.betItemCount] = newBetItem;
            this.betItemCount ++;
            var betMoveAction = cc.spawn(cc.moveTo(0.3, cc.p(630 - 100 + Math.random()*220, 360 - 50 + Math.random()*100)),
                                         cc.rotateBy(0.3, 1080 + Math.random()*200));
            betMoveAction.easing(cc.easeOut(2.0 + Math.random()*0.5));
            newBetItem.runAction(betMoveAction);
        }
    },

    betItemListClean:function(){
        for(var i in this.betItemListAll)
        {
            this.betItemListAll[i].destroy();
        }
        this.betItemCount = 0;
        this.betItemListAll = {};
    },

    betItemRemove:function(chair,num){
        console.log("当前还剩下"+this.betItemCount+"个筹码！！!!!!");
        console.log("betItemRemove" + chair + "num===" + num);
        for(var i=0;i<num;i++)
        {
            this.betItemCount --;
            if(this.betItemCount < 0)
                continue;
            var curBetItem = this.betItemListAll[this.betItemCount];
            curBetItem.stopAllActions();

            var betMoveAction = cc.spawn(cc.moveTo(0.3, cc.p(this.betBeginPosList[chair].x, this.betBeginPosList[chair].y)),
                                         cc.rotateBy(0.3, 1080 + Math.random()*200));
            var betDestory = cc.callFunc(function () {
                curBetItem.opacity = 0;
            }, this);
            curBetItem.runAction(cc.sequence(betMoveAction, betDestory));
        }
        // if(this.gameMode == 3)
        // {
        //     if(this.betItemCount <= 6 && this.betItemCount != 0)
        //     {
        //         this.betItemRemoveToBanker(confige.getCurChair(this.curBankerChair));
        //     }
        // }
    },

    betItemRemoveToBanker:function(bankerChair){
        console.log("betItemRemoveToBanker" + bankerChair);
        if(bankerChair == -1)
            bankerChair = 0;
        console.log(this.betItemListAll);
        console.log("this.betItemCount==="+this.betItemCount);
        for(var i=0;i<this.betItemCount;i++)
        {
            var curBetItem = this.betItemListAll[i];
            var betMoveAction = cc.spawn(cc.moveTo(0.2, cc.p(this.betBeginPosList[bankerChair].x, this.betBeginPosList[bankerChair].y)),
                                         cc.rotateBy(0.2, 1080 + Math.random()*200));
            var betDestory = cc.callFunc(function () {
                curBetItem.opacity = 0;
            }, this);
            curBetItem.runAction(cc.sequence(betMoveAction, betDestory));
        }
        // for(var i in this.betItemListAll)
        // {
        //     var curBetItem = this.betItemListAll[i];
        //     var betMoveAction = cc.spawn(cc.moveTo(0.2, cc.p(this.betBeginPosList[bankerChair].x, this.betBeginPosList[bankerChair].y)),
        //                                  cc.rotateBy(0.2, 1080 + Math.random()*200));
        //     var betDestory = cc.callFunc(function () {
        //         curBetItem.opacity = 0;
        //     }, this);
        //     curBetItem.runAction(cc.sequence(betMoveAction, betDestory));
        // }
    },

    betItemSendFromBanker:function(scoreList,bankerChair){
        console.log("betItemSendFromBanker");
        var curBetCount = 0;
        for(var i in scoreList)
            if(scoreList[i] > 0)
                curBetCount += scoreList[i];
        for(var i=0;i<curBetCount;i++)
        {
            var newBetItem = cc.instantiate(this.betItemPrefab);
            newBetItem.getComponent("cc.Sprite").spriteFrame = this.betFrameList[3];//[Math.floor(Math.random()*100)%6];
            this.mainBg.addChild(newBetItem);
            newBetItem.x = this.betBeginPosList[bankerChair].x;
            newBetItem.y = this.betBeginPosList[bankerChair].y;
            this.betItemListAll[this.betItemCount] = newBetItem;
            this.betItemCount ++;
        }
        var self = this;
        for(var i in scoreList)
            if(scoreList[i] > 0)
            {
                for(var j=0;j<scoreList[i];j++)
                {   
                    self.betItemCount --;
                    if(self.betItemCount < 0)
                        continue;
                    var sendBetOnceFunc = function(){
                        var betMoveAction = cc.spawn(cc.moveTo(0.2, cc.p(self.betBeginPosList[confige.getCurChair(sendBetOnceFunc.i)].x, self.betBeginPosList[confige.getCurChair(sendBetOnceFunc.i)].y)),
                                                     cc.rotateBy(0.2, 1080 + Math.random()*200));
                        var betDestory = cc.callFunc(function () {
                            sendBetOnceFunc.curBetItem.opacity = 0;
                        }, this);

                        var moveActionPlus = cc.sequence(betMoveAction, betDestory);
                        moveActionPlus.easing(cc.easeOut(1.0));

                        sendBetOnceFunc.curBetItem.runAction(moveActionPlus);
                    };
                    sendBetOnceFunc.curBetItem = self.betItemListAll[self.betItemCount];
                    sendBetOnceFunc.i = i;
                    this.scheduleOnce(sendBetOnceFunc, Math.random() * 0.5);//Math.floor(Math.random()*100));
                }
            }
    },

    btnInviteFriend:function(){
        cc.log("邀请好友");
        // var curTitle = "快打开我爱牛牛和我一块玩吧~";
        var curTitle = "我爱牛牛,"
        curTitle += "房间号:" + confige.roomData.roomId;

        var curDes = "";
        if(confige.roomData.gameMode == 1)
            curDes += "【普通牛牛】,";
        else if(confige.roomData.gameMode == 3)
            curDes += "【斗公牛】,";
        else if(confige.roomData.gameMode == 4)
            curDes += "【通比牛牛】,";
        else{
            if(confige.roomData.roomType == "zhajinniu"){
                curDes += "【炸金牛】,";
                curDes += "底分" + confige.roomData.basic + ",";
            }
            else if(confige.roomData.roomType == "mingpaiqz"){
                curDes += "【明牌抢庄】,";
                curDes += "底分" + confige.roomData.basic + "/" + (confige.roomData.basic*2) + ",";
            }
        } 

        curDes += confige.roomData.maxGameNumber + "局,";

        if(confige.roomData.cardMode == 1)
            curDes += "暗牌,";
        else if(confige.roomData.cardMode == 2)
            curDes += "明牌,"

        if(confige.roomData.gameMode == 1)
        {
            if(confige.roomData.bankerMode == 1)
                curDes += "随机抢庄,";
            else if(confige.roomData.bankerMode == 2)
                curDes += "房主坐庄,";
            else if(confige.roomData.bankerMode == 3)
                curDes += "轮流坐庄,";
        }
        curDes += "大家快来玩吧!";

        console.log(curTitle + curDes);

        this.btn_inviteFriend.interactable = false;

        if(confige.curUsePlatform == 1)
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", curTitle, curDes, confige.shareURL, 0);
        else if(confige.curUsePlatform == 2)
            jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",curTitle, curDes, confige.shareURL, 0);

        var newCallBack = function(){
            newCallBack.btn.interactable = true;
        };
        newCallBack.btn = this.btn_inviteFriend;
        setTimeout(newCallBack,300);
    },
    
    hideUserInfoLayer:function(){
        this.selectHead = -1;
        this.userInfoLayer.active = false;
    },

    userDisconne:function(chair){
        this.leaveNodeList[chair].active = true;
    },

    userReconnection:function(chair){
        this.leaveNodeList[chair].active = false;
    },

    update: function (dt) {
        confige.CallGVoicePoll();
    },

    btnTest:function(event,customEventData){
        var index = parseInt(customEventData);
        if(index == 1)
        {
            this.cardItemList.disCardOneRound();
        }else if(index == 2){
            this.cardItemList.disCardWithRoundTime(5);
        }else if(index == 3){
            this.cardItemList.resetCardList();
        }
    },

    newDisCard:function(times){
        if(times == 1)
            this.cardItemList.disCardOneRound();
        else
            this.cardItemList.disCardWithRoundTime(times);
    },

    newResetCard:function(){
        this.cardItemList.resetCardList();
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                this.cardItemList.activePlayer(confige.getCurChair(i));
            }
        }
    },

    showPK:function(player1,player2,win){
        this.pkLayer.active = true;
        this.pk1.x = -700;
        this.pk2.x = 700;
        this.pk1.opacity = 255;
        this.pk2.opacity = 255;
        this.pkLayer.opacity = 255;
        this.pkImg.opacity = 255;
        this.pk1Win.opacity = 255;
        this.pk2Win.opacity = 255;
        this.pk1Win.active = false;
        this.pk2Win.active = false;
        this.pk1Lose.active = false;
        this.pk2Lose.active = false;

        this.pk1Name.string = confige.roomPlayer[player1].playerInfo.nickname;
        this.pk2Name.string = confige.roomPlayer[player2].playerInfo.nickname;
        this.pk1Head.spriteFrame = confige.WXHeadFrameList[confige.getCurChair(player1)+1];
        this.pk2Head.spriteFrame = confige.WXHeadFrameList[confige.getCurChair(player2)+1];

        var action1 = cc.moveTo(0.3,cc.p(0,0));
        var action2 = cc.fadeOut(0.3);

        var hideCallBack = function(){
            this.hidePK();
        };

        if(player1 == win)
        {
            // this.pk1Win.active = true;
            // this.pk2Lose.active = true;
            this.pk1.runAction(cc.sequence(cc.moveTo(0.3,cc.p(-250,0)),cc.delayTime(1),action1));
            this.pk2.runAction(cc.sequence(cc.moveTo(0.3,cc.p(250,0)),cc.delayTime(1),action2));
        }else{
            // this.pk2Win.active = true;
            // this.pk1Lose.active = true;
            this.pk1.runAction(cc.sequence(cc.moveTo(0.3,cc.p(-250,0)),cc.delayTime(1),action2));
            this.pk2.runAction(cc.sequence(cc.moveTo(0.3,cc.p(250,0)),cc.delayTime(1),action1));
        }

        this.scheduleOnce(hideCallBack,2);

        var hidePkImg = function(){
            this.pkImg.runAction(cc.fadeOut(0.5));
            if(player1 == win)
            {
                this.pk1Win.active = true;
            }else{
                this.pk2Win.active = true;
            }
        };
        this.scheduleOnce(hidePkImg,1);
    },

    hidePK:function(){
        var hideCallBack = cc.callFunc(function () {
            this.pkLayer.active = false;
        }, this);
        this.pkLayer.runAction(cc.sequence(cc.fadeOut(0.5),hideCallBack));
    },

    showReConnect:function(){
    	if(this.webCloseLayer && this.webCloseLayer.showLoading)
        	this.webCloseLayer.showLoading();
    },

    hideReConnect:function(){
    	if(this.webCloseLayer && this.webCloseLayer.showLoading)
        	this.webCloseLayer.hideLoading();
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
            this.playerHandCardList[confige.getCurChair(this.meChair)].setCardWithIndex(3, this.playerCardList[this.meChair][3].num, this.playerCardList[this.meChair][3].type);
        }else if(index == 2){
            this.hideOpenCard(2);
            this.playerHandCardList[confige.getCurChair(this.meChair)].setCardWithIndex(4, this.playerCardList[this.meChair][4].num, this.playerCardList[this.meChair][4].type);
        }
    },

    btnClickHeadFace:function(event,customEventData){
        var index = parseInt(customEventData);
        if(this.selectHead != -1)
            pomelo.clientSend("say",{"msg": {"sayType":100, "chairBegin":this.meChair, "chairEnd":this.selectHead,"index":index,"sex":confige.curSex}});
        this.hideUserInfoLayer();
    },

    btn_showUserInfo:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        var oriChair = confige.getOriChair(clickIndex);
        if(confige.roomPlayer[oriChair].isActive == true)
        {
            this.userInfoNick.string = confige.roomPlayer[oriChair].playerInfo.nickname;
            this.userInfoID.string = "ID:" + confige.roomPlayer[oriChair].playerInfo.uid;
            var ipString = confige.roomPlayer[oriChair].ip;
            ipString = ipString.substring(7, ipString.length);
            this.userInfoIP.string = "IP:" + ipString;
            this.userInfoLayer.active = true;
            this.selectHead = oriChair;
        }
    },

    showHeadFace:function(chairBegin,chairEnd,index,sex){
        console.log("showHeadFace  chairBegin=" + chairBegin + "chairEnd=" + chairEnd + "index=" + index);
        var newFaceAni = cc.instantiate(this.faceAniList[index]);
        newFaceAni.scale = 0.7;
        newFaceAni.x = this.betBeginPosList[confige.getCurChair(chairBegin)].x;
        newFaceAni.y = this.betBeginPosList[confige.getCurChair(chairBegin)].y;
        if(confige.soundEnable == true)
        {
            if(sex == 2)
            {
                cc.audioEngine.play(confige.audioList["female_face_"+index],false,confige.audioVolume);
            }else{
                cc.audioEngine.play(confige.audioList["male_face_"+index],false,confige.audioVolume);
            }
        }
        console.log("newFaceAni.x===" + newFaceAni.x);
        console.log("newFaceAni.y===" + newFaceAni.y);
        this.userInfoBtnList.addChild(newFaceAni);
        var action1 = cc.moveTo(0.3, cc.p(this.betBeginPosList[confige.getCurChair(chairEnd)].x, this.betBeginPosList[confige.getCurChair(chairEnd)].y));
        var action2 = cc.callFunc(function () {
            if(confige.soundEnable == true)
            {
                if(index == 3)
                {
                    if(sex == 2)
                        cc.audioEngine.play(confige.audioList["face_3"],false,confige.audioVolume);
                    else
                        cc.audioEngine.play(confige.audioList["face_7"],false,confige.audioVolume);
                }else{
                    cc.audioEngine.play(confige.audioList["face_"+index],false,confige.audioVolume);
                }
            }
            newFaceAni.getComponent("cc.Animation").play("faceAni"+index);
        }, this);
        var action3 = cc.delayTime(1);
        var action4 = cc.fadeOut(0.3);
        var action5 = cc.callFunc(function () {
            newFaceAni.destroy();
        }, this);
        var betMoveAction = cc.sequence(action1,action2,action3,action4,action5);

        newFaceAni.runAction(betMoveAction);
    },

    openShare:function(){
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
    },

    WXCancle:function(){
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
    },

    onSliderMove:function(slider, customEventData){
        var curPercent = this.betSlider.progress;
        this.betSliderLight.fillRange = curPercent;

        this.curSliderNum = Math.floor(this.curSliderNumMin + (this.curSliderNumMax-this.curSliderNumMin)*curPercent);
        this.curSliderNumLabel.string = this.curSliderNum;
    },

    showSlider:function(min,max){
        var sub = max - min;        
        for(var i=0;i<6;i++)
            this.betSliderNumList[i].string = (min + sub*0.2*i).toFixed(1);

        this.curSliderNumMin = min;
        this.curSliderNumMax = max;
        this.curSliderNum = min;
        this.curSliderNumLabel.string = this.curSliderNum;
        this.betSlider.progress = 0;
        this.betSliderLight.fillRange = 0;
        this.betBtnBoxS.active = true;
    },

    initMingCardQZ:function(){
        this.isAllowAllin = true;
        this.isAllowAllin = confige.roomData.allowAllin;

        this.isMingCardQZ = true;
        this.mingcardqzLayer = this.node.getChildByName("mingcardqzLayer");
        this.mingcardqzLayer.active = true;
        this.robBtnBox = this.mingcardqzLayer.getChildByName("robBtnBox");
        this.robBetBtnBox = this.mingcardqzLayer.getChildByName("betBtnBox");
        this.robBetBtnBox.getChildByName("bet1").getChildByName("Label").getComponent("cc.Label").string = this.mingcardqzBasic;
        this.robBetBtnBox.getChildByName("bet2").getChildByName("Label").getComponent("cc.Label").string = this.mingcardqzBasic*2;
        this.curRobMaxNum = 0;
        this.robBetAllInBtn = this.robBetBtnBox.getChildByName("bet3").getComponent("cc.Button");
        this.robMaxNumNode = this.mainBg.getChildByName("curRobNum");
        this.robMaxNumLabel = this.robMaxNumNode.getChildByName("robMaxNum").getComponent("cc.Label");

        this.robBetNumNode = this.robMaxNumNode.getChildByName("curBet");
        this.robBetNumLabel = this.robBetNumNode.getChildByName("robBetNum").getComponent("cc.Label");
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
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : this.mingcardqzBasic});
                break;
            case 12:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : this.mingcardqzBasic*2});
                break;
            case 13:
                pomelo.clientSend("useCmd",{"cmd" : "allIn"});
                break;
        }
        this.robBtnBox.active = false;
        this.robBetBtnBox.active = false;
        this.robBetAllInBtn.interactable = false;
    },

    updateScoreByChair:function(chair,score){
        this.playerScoreList[parseInt(chair)] = score;
        this.playerInfoList[confige.getCurChair(chair)].setScore(score);
    },

    btnClickRefresh:function(){
        confige.curReconnectType = confige.ON_OVER;
        // cc.director.loadScene('HallScene');
        this.showReConnect();
        confige.curGameScene.destroy();
        confige.resetGameData();
        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        {
            confige.GVoiceCall.quitRoom(confige.GVoiceRoomID);
            confige.GVoiceCall.closeListen();
        }
        confige.curReconnectType = confige.ON_HALL;
        pomelo.disconnect();
        pomelo.reConnet();
    },

    sayWithID:function(voiceID){
        pomelo.clientSend("say",{"msg": {"sayType":255, "id": voiceID, "time": this.sayTime}});
    },

    closeMusicAndSound:function(){
        if(confige.musicEnable == true)
            cc.audioEngine.pause(confige.audioBgId);

        cc.audioEngine.pauseAll();
        confige.soundEnable = false;
    },

    openMusicAndSound:function(){
        if(confige.musicEnable == true)
            cc.audioEngine.resume(confige.audioBgId);
        cc.audioEngine.resumeAll();
        confige.soundEnable = true;
    },

    beginSayTime:function(){
        this.sayTime = 0;
        var self = this;
        this.sayTimeSchedule = function(){
            self.sayTime += 0.1;
        };
        this.schedule(this.sayTimeSchedule,0.1);
    },

    endSayTime:function(){
        this.unschedule(this.sayTimeSchedule);
    },

    addYuyinOnce:function(data){
        if(data)
        {
            this.yuyinList.push(data);
        }

        if(this.yuyinPaly == true)
        {
            return;
        }else{
            this.playYuyin();
        }
        // var yuyinDelate = cc.delayTime(0);
        // var finished = function(){//cc.callFunc(function () {
        //     if(this.yuyinList.length != 0)
        //     {
        //         var curYuyinData = this.yuyinList[this.yuyinList.length-1];
        //         this.yuyinList.pop();
        //         this.yuyinPaly = true;

        //         if(confige.curUsePlatform == 1)
        //         {
        //             jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceDownloadVoice", "(Ljava/lang/String;Ljava/lang/String;)V", curYuyinData.id, curYuyinData.chair);
        //         }else if(confige.curUsePlatform == 2){
        //             jsb.reflection.callStaticMethod("JSCallOC", "GVoiceDownloadVoice:andChair:",curYuyinData.id,curYuyinData.chair);
        //         }
        //         this.closeMusicAndSound();
        //         if(this.playTimeSchedule != -1)
        //             this.unschedule(this.playTimeSchedule);
        //         this.playTimeSchedule = function(){
        //             this.openMusicAndSound();
        //         };
        //         this.scheduleOnce(this.playTimeSchedule, (curYuyinData.time+1));

        //         var newSayItem = cc.instantiate(this.sayItemPrefab);
        //         this.sayAniNode.addChild(newSayItem);
        //         newSayItem.x = this.sayPosList[curYuyinData.chair].x;
        //         newSayItem.y = this.sayPosList[curYuyinData.chair].y;
        //         var sayDestory = cc.callFunc(function () {
        //             newSayItem.destroy();
        //         }, this);
        //         newSayItem.runAction(cc.sequence(cc.delayTime(curYuyinData.time+1), sayDestory));

        //         cc.log("fuck time =================================");
        //         cc.log(curYuyinData.tame);
        //         yuyinDelate = cc.delayTime(curYuyinData.time+1);
        //     }else{
        //         this.yuyinBtn.stopAllActions();
        //         this.yuyinPaly = false;
        //     }
        // }.bind(this);
        
        // var yuyinCallFunc = cc.callFunc(function () {
        //     finished();
        //     this.yuyinSeq = cc.sequence(
        //         yuyinDelate,
        //         yuyinCallFunc
        //     );
        //     this.yuyinBtn.runAction(this.yuyinSeq);
        //     //console.log("newnewnew    curMoveX = " + this.paomaCurMoveX + "      curMoveT = " + this.paomaCurMoveT);
        // },this);     

        // this.yuyinSeq = cc.sequence(
        //     yuyinDelate,
        //     yuyinCallFunc
        // );

        // this.yuyinBtn.runAction(this.yuyinSeq);
    },

    playYuyin:function(){
        if(this.yuyinList.length != 0)
        {
            var curYuyinData = this.yuyinList[0];
            this.yuyinList.shift();
            this.yuyinPaly = true;

            if(confige.curUsePlatform == 1)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceDownloadVoice", "(Ljava/lang/String;Ljava/lang/String;)V", curYuyinData.id, curYuyinData.chair);
            }else if(confige.curUsePlatform == 2){
                jsb.reflection.callStaticMethod("JSCallOC", "GVoiceDownloadVoice:andChair:",curYuyinData.id,curYuyinData.chair);
            }
            this.closeMusicAndSound();
            if(this.playTimeSchedule != -1)
                this.unschedule(this.playTimeSchedule);
            this.playTimeSchedule = function(){
                this.openMusicAndSound();
            };
            this.scheduleOnce(this.playTimeSchedule, (curYuyinData.time+1));

            var newSayItem = cc.instantiate(this.sayItemPrefab);
            this.sayAniNode.addChild(newSayItem);
            newSayItem.x = this.sayPosList[curYuyinData.chair].x;
            newSayItem.y = this.sayPosList[curYuyinData.chair].y;
            var sayDestory = cc.callFunc(function () {
                newSayItem.destroy();
            }, this);
            newSayItem.runAction(cc.sequence(cc.delayTime(curYuyinData.time+1), sayDestory));
            this.yuyinTimeOut = setTimeout(this.playYuyin.bind(this), (curYuyinData.time+1)*1000);
        }else{
            this.yuyinBtn.stopAllActions();
            this.yuyinPaly = false;
        }
    },

});
