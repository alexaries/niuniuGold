var gameData = require("gameData");
var confige = require("confige");
var FKLogic = require("FengKuangLogic");
var give = require("give");
cc.Class({
    extends: cc.Component,

    properties: {
        headOri:{
            default:null,
            type:cc.SpriteFrame
        },
    },

    onLoad: function () {
    },
    
    onInit:function(){
        gameData.gamePlayerNode = this;
        this.meChair = 0;
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
        
        if(gameData.gameMainScene.consumeType == "diamond"){
            for(var i =0;i<6;i++)
                this.playerList[i].getChildByName("coin").active = false;
        }else{
            for(var i =0;i<6;i++)
                this.playerList[i].getChildByName("diamond").active = false;
        }

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
            this.playerHandCardList[i].onInit();
            if(i == 0)
                this.playerHandCardList[i].isPlayer = true;
            console.log("this.playerHandCardList load ++++",i);
            this.playerInfoList[i] = this.playerList[i].getChildByName("Player").getComponent("playerInfo");
            this.playerInfoList[i].onInit();
        }
        this.playerInfoList[0].setName(confige.userInfo.nickname);
        this.playerInfoList[0].setScore("");

        this.niuTypeBoxList = {};
        this.niuTypeBoxYList = {};
        for(var i=0;i<6;i++)
        {
            this.niuTypeBoxList[i] = this.node.getChildByName("niuTypeList").getChildByName("niuTypeBox"+(i+1));
            this.niuTypeBoxYList[i] = this.niuTypeBoxList[i].y;
        }

        // this.winBoxAniList = {};
        // this.winBoxAniNodeList = {};
        this.betNumNodeList = {};
        this.betNumLabelList = {};
        this.curBetNumList = {};
        this.isRobImgList = {};
        this.noRobImgList = {};
        this.lightBgList = {};
        this.isTurnImgList = {};
        this.leaveNodeList = {};
        this.robNumNodeList = {};
        this.robNumLabelList = {};
        
        for(var i=0;i<6;i++)
        {
            // this.winBoxAniNodeList[i] = this.playerList[i].getChildByName("winBoxAni");
            // this.winBoxAniList[i] = this.winBoxAniNodeList[i].getComponent("cc.Animation");
            this.betNumNodeList[i] = this.playerList[i].getChildByName("betNode");
            this.betNumLabelList[i] = this.betNumNodeList[i].getChildByName("betNum").getComponent("cc.Label");
            this.curBetNumList[i] = 0;
            this.isRobImgList[i] = this.playerList[i].getChildByName("isRob");
            this.noRobImgList[i] = this.playerList[i].getChildByName("noRob");
            this.lightBgList[i] = this.playerList[i].getChildByName("lightBg");
            this.isTurnImgList[i] = this.playerList[i].getChildByName("isTurn");
            this.leaveNodeList[i] = this.playerList[i].getChildByName("leaveNode");
            this.robNumNodeList[i] = this.playerList[i].getChildByName("headRobNumBg");
            this.robNumLabelList[i] = this.robNumNodeList[i].getChildByName("robNum").getComponent("cc.Label");
        }

        this.cardItemList = this.node.getChildByName("cardList").getComponent("cardList");
        this.cardItemList.onInit();

        this.userInfoBtnList = this.node.getChildByName("userInfoBtnList");
        this.selectHead = -1;

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
        
        this.charmCurList = {};
        this.charmAddList = {};
        for(var i=0;i<6;i++)
        {
            this.sayBoxLabelNodeList[i] = this.sayBoxList[i].getChildByName("text");
            this.sayBoxLabelList[i] = this.sayBoxLabelNodeList[i].getComponent("cc.Label");
            this.charmCurList[i] = 0;
            this.charmAddList[i] = 0;
        }

        this.sayBoxList[1].rotationY = 180;
        this.sayBoxLabelNodeList[1].rotationY = 180;

        this.faceList = {};
        this.faceList[0] = this.sayNode.getChildByName("face1");
        this.faceList[1] = this.sayNode.getChildByName("face2");
        this.faceList[2] = this.sayNode.getChildByName("face3");
        this.faceList[3] = this.sayNode.getChildByName("face4");
        this.faceList[4] = this.sayNode.getChildByName("face5");
        this.faceList[5] = this.sayNode.getChildByName("face6");

        this.sayAniNode = this.node.getChildByName("sayAniNode");
        this.sayPosList = {};
        this.sayPosList[0] = cc.v2(187,167);
        this.sayPosList[1] = cc.v2(1190,444);
        this.sayPosList[2] = cc.v2(1090,650);
        this.sayPosList[3] = cc.v2(755,650);
        this.sayPosList[4] = cc.v2(425,650);
        this.sayPosList[5] = cc.v2(126,444);

        this.faceBeginPosList = {};
        this.faceBeginPosList[0] = cc.v2(83,74);
        this.faceBeginPosList[1] = cc.v2(1195,400);
        this.faceBeginPosList[2] = cc.v2(855,653);
        this.faceBeginPosList[3] = cc.v2(570,653);
        this.faceBeginPosList[4] = cc.v2(287,653);
        this.faceBeginPosList[5] = cc.v2(91,400);

        this.giftAniNode = this.node.getChildByName("giftAniNode");
        for(var i=1;i<=7;i++)
            confige.faceAniMap[i] = this.giftAniNode.getChildByName("giftAniNode"+i);
    },

    onStart:function(){
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
                    gameData.gameMainScene.meChair = this.meChair;
                    gameData.gameMainScene.gameRotatyCount = newPlayerInfo.gameCount;
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
                    }
                }
            }
        }
        
        if(this.playerCount == 6)
            gameData.gameMainScene.gameInfoNode.btn_inviteFriend.active = false;

        this.newPlayerCount = this.playerCount;
    },

    addOnePlayer:function(playerData){
        var curIndex = confige.getCurChair(playerData.chair);
        this.playerList[curIndex].active = true;
        this.playerList[curIndex].stopAllActions();
        this.playerList[curIndex].opacity = 0;
        this.playerList[curIndex].runAction(cc.fadeIn(0.5));

        this.playerInfoList[curIndex].setName(playerData.playerInfo.nickname);
        this.playerInfoList[curIndex].setScore(playerData.score);
        //
        this.charmCurList[curIndex] = playerData.charm;
        var myDate = new Date()
        var dateString = parseInt(""+myDate.getFullYear() + myDate.getMonth() + myDate.getDate())
        if(dateString == playerData.playerInfo.charmTime)
            this.charmAddList[curIndex] = playerData.playerInfo.charmValue;
        else 
            this.charmAddList[curIndex] = 0;

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
        {
            this.playerList[curIndex].getChildByName("isReady").active = true;
            console.log("isReady.active = true");
        }else{
            console.log("isReady.active = false");
        }
        
        confige.roomPlayer[playerData.chair] = playerData;
        confige.curPlayerData[curIndex] = playerData;
        this.newPlayerCount ++;
        console.log("addOnePlayer() this.newPlayerCount ==== " + this.newPlayerCount);
        confige.curPlayerCount ++;

        if(this.newPlayerCount == 6)
            gameData.gameMainScene.gameInfoNode.btn_inviteFriend.active = false;
        this.playerActiveList[curIndex] = true;

        this.leaveNodeList[curIndex].active = false;
    },

    playerQuit:function(chair){
        console.log("playerQuit -------------------" + chair);
        var curIndex = confige.getCurChair(chair);
        console.log("playerQuit curIndex -------------------" + chair);
        this.playerList[curIndex].stopAllActions();
        this.playerList[curIndex].opacity = 255;
        this.playerList[curIndex].runAction(cc.fadeOut(0.5));

        // this.playerList[curIndex].active = false;

        this.niuTypeBoxList[curIndex].active = false;
        this.niuTypeBoxList[curIndex].opacity = 0;
        confige.roomPlayer[chair].isActive = false;
        confige.roomData.player[chair].isActive = false;
        confige.curPlayerData[curIndex] = confige.roomPlayer[chair];
        this.playerHandCardList[curIndex].resetCard();
        this.playerCardList[chair] = null;
        
        this.newPlayerCount --;
        confige.curPlayerCount --;
        if(this.newPlayerCount < 6)
            if(confige.roomData.initiativeFlag == true)
                gameData.gameMainScene.gameInfoNode.btn_inviteFriend.active = true;

        confige.WXHeadFrameList[curIndex+1] = null;
        this.playerInfoList[curIndex].setHeadSpriteFrame("");
        this.playerActiveList[curIndex] = false;

        this.leaveNodeList[curIndex].active = false;
    },

    showNiuType:function(chair, type, doCardMove){
        if(chair == 0 && type > 10)
        {
            console.log("出现特殊牌型@@@@@@@");
            gameData.gameMainScene.gameRotatyCount += 5;
        }
        if(this.niuTypeBoxList[chair].active == true)
            return;
        this.niuTypeBoxList[chair].active = true;
        this.niuTypeBoxList[chair].opacity = 0;
        var curNiuTypeNode = this.niuTypeBoxList[chair].getChildByName("niuImg");
        if(gameData.gameMainScene.isFengKuang)
            curNiuTypeNode.getComponent("cc.Sprite").spriteFrame = confige.niuTypeFrameMapFK[type];
        else
            curNiuTypeNode.getComponent("cc.Sprite").spriteFrame = confige.niuTypeFrameMap[type];

        curNiuTypeNode.scale = 3;
        var curNiuTypeAni = this.niuTypeBoxList[chair].getChildByName("bgAni").getComponent("cc.Animation");
        if(chair == 0)
        {
            this.niuTypeBoxList[chair].runAction(cc.sequence(cc.delayTime(1),cc.fadeIn(0.3),cc.callFunc(function(){
                curNiuTypeNode.runAction(cc.sequence(cc.scaleTo(0.3,1),cc.callFunc(function(){
                    curNiuTypeAni.play();
                })));
            })));
        }else{
            this.niuTypeBoxList[chair].runAction(cc.sequence(cc.delayTime(1),cc.fadeIn(0.3),cc.callFunc(function(){
                curNiuTypeNode.runAction(cc.sequence(cc.scaleTo(0.3,1),cc.callFunc(function(){
                    curNiuTypeAni.play();
                })));
            })));
        }

        var curSex = 0;
        if(confige.roomPlayer[confige.getOriChair(chair)].playerInfo)
            curSex = parseInt(confige.roomPlayer[confige.getOriChair(chair)].playerInfo.sex);

        if(confige.soundEnable == true)
        {
            if(gameData.gameMainScene.isFengKuang)
            {
                var curType = 0;
                if(type >= 0 && type <= 10)
                    curType = type;
                else{
                    switch(type){
                        case 11:
                            curType = 15;
                            break;
                        case 12:
                            curType = 16;
                            break;
                        case 13:
                            curType = 17;
                            break;
                        case 14:
                            curType = 14;
                            break;
                        case 15:
                            curType = 12;
                            break;
                        case 16:
                            curType = 13;
                            break;
                        case 17:
                            curType = 18;
                            break;
                    }
                }
                if(curSex == 2)
                {
                    confige.playSoundByName("female_type_"+curType);
                }else{
                    confige.playSoundByName("male_type_"+curType);
                }
                console.log("curType====!!!!!" + curType);
            }else{
                if(curSex == 2)
                {
                    confige.playSoundByName("female_type_"+type);
                }else{
                    confige.playSoundByName("male_type_"+type);
                }
            }
        }
    },

    showOneCard:function(chair,callType,comb){
        var curChair = confige.getCurChair(chair);
        this.betNumNodeList[curChair].active = false;
        this.robNumNodeList[curChair].active = false;

        if(curChair == 0)
        {
            gameData.gameMainScene.hideOpenCard(1);
            gameData.gameMainScene.hideOpenCard(2);
        }
        if(gameData.gameMainScene.joinLate == true && curChair == 0)
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
        var doCardMove = false;
        if(comb)
        {
            if(JSON.stringify(comb) != "{}")
            { 
                var callFunc = function(){
                    callFunc.curHandCard.cardMove(callFunc.comb);
                };
                callFunc.curHandCard = this.playerHandCardList[curChair];
                callFunc.comb = comb;
                this.scheduleOnce(callFunc,0.5);
                console.log("@@@@@show card move action@@@@@"+curChair+"@@@@@oriChair==="+chair);
                doCardMove = true;
            }else{
                if(curChair == 0){
                    console.log("this.playerHandCardList00000!!!!!!!")
                    this.playerHandCardList[curChair].cardMovePlayer();
                    // this.playerHandCardList[curChair].node.runAction(cc.spawn(cc.scaleTo(0.4,0.75),cc.moveTo(0.4,5,130)));
                }
            }
        }

        if(callType == -1)
            return;
        if(curCardNum == 5)
        {
            var curNiuType = 0;
            if(gameData.gameMainScene.isFengKuang)
                curNiuType = FKLogic.getType(handCard);
            else
                curNiuType = confige.getNiuType(handCard);
            this.showNiuType(curChair, curNiuType.type, doCardMove);
        }  
    },

    userDisconne:function(chair){
        this.leaveNodeList[chair].active = true;
    },

    userReconnection:function(chair){
        this.leaveNodeList[chair].active = false;
    },

    showHeadFace:function(chairBegin,chairEnd,index,sex){
        console.log("showHeadFace  chairBegin=" + chairBegin + "chairEnd=" + chairEnd + "index=" + index);
        var newFaceAni = cc.instantiate(confige.faceAniMap[index]);

        newFaceAni.x = this.faceBeginPosList[chairBegin].x;
        newFaceAni.y = this.faceBeginPosList[chairBegin].y;

        console.log("newFaceAni.x===" + newFaceAni.x);
        console.log("newFaceAni.y===" + newFaceAni.y);
        this.userInfoBtnList.addChild(newFaceAni);
        var action1 = cc.moveTo(0.5, cc.p(this.faceBeginPosList[chairEnd].x, this.faceBeginPosList[chairEnd].y));
        var action2 = cc.callFunc(function () {
            if(index == 1 || index == 4){
                newFaceAni.getChildByName("bg").opacity = 255;
                newFaceAni.getChildByName("bg").runAction(cc.rotateBy(1,720));
            }
            if(index == 7){
                newFaceAni.y = newFaceAni.y - 50;
            }
            newFaceAni.getChildByName("ani").getComponent("cc.Animation").play();
        }, this);

        var action3 = -1;
        if(index == 1 || index == 4)
            action3 = cc.delayTime(1);
        else
            action3 = cc.delayTime(0.5);
        var action4 = cc.fadeOut(0.5);
        var action5 = cc.callFunc(function () {
            newFaceAni.destroy();
        }, this);
        var betMoveAction = cc.sequence(action1,action2,action3,action4,action5);

        newFaceAni.runAction(betMoveAction);
    },

    updateScoreByChair:function(chair,score){
        this.playerScoreList[parseInt(chair)] = score;
        this.playerInfoList[confige.getCurChair(chair)].setScore(score);
    },

    btn_showUserInfo:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        if(clickIndex == 0)
        {
            gameData.gameInfoNode.onBtnShowLayer(-1,2);
            return;
        }
        var oriChair = confige.getOriChair(clickIndex);
        var self = this;
        if(confige.roomPlayer[oriChair].isActive == true)
        {
            var newCallBack = function(){
                gameData.gameInfoNode.userInfoLayer.updateData(confige.roomPlayer[oriChair]);
                // console.log("gameGiftLayer curplayer info:");
                // console.log(confige.roomPlayer[oriChair]);
                // gameData.gameInfoNode.gameGiftLayer.playerNick.string = confige.roomPlayer[oriChair].playerInfo.nickname;
                // gameData.gameInfoNode.gameGiftLayer.playerScore.string = self.playerScoreList[oriChair];
                // console.log("setCharm!!!!!!!!!!!!!!!!");
                // console.log(""+self.charmCurList[clickIndex]+"@@@@@@@@@@@@@@@@@"+self.charmAddList[clickIndex]);
                // gameData.gameInfoNode.gameGiftLayer.setCharm(self.charmCurList[clickIndex],self.charmAddList[clickIndex]);
                // console.log(confige.WXHeadFrameList);
                // if(confige.WXHeadFrameList[clickIndex+1])
                //     gameData.gameInfoNode.gameGiftLayer.playerHead.spriteFrame = confige.WXHeadFrameList[clickIndex+1];
                // else 
                //     gameData.gameInfoNode.gameGiftLayer.playerHead.spriteFrame = self.headOri;
                // gameData.gameInfoNode.gameGiftLayer.selectChair = oriChair;
            };
            gameData.gameInfoNode.onBtnShowLayer(-1,3,newCallBack);
        }
    },

    showGive:function(data){
        // cmd: "give", chair: 0, targetChair: 1, giveId: 7, gold: 1000
        if(gameData.gameMainScene.consumeType == "gold")
        {
            this.playerScoreList[data.targetChair] += data.gold;
            this.playerInfoList[confige.getCurChair(data.targetChair)].setScore(this.playerScoreList[data.targetChair]);
        }
        var curChair = confige.getCurChair(data.targetChair);
        this.charmCurList[curChair] += give[data.giveId].charm;
        this.charmAddList[curChair] += give[data.giveId].charm;
        this.showHeadFace(confige.getCurChair(data.chair),curChair,data.giveId);
    },

    changeDeskClean:function(){
        for(var i=1;i<6;i++)
            this.playerList[i].runAction(cc.fadeOut(0.3));
        this.playerHandCardList[0].resetCard();
        for(var i=0;i<6;i++)
        {
            this.niuTypeBoxList[i].runAction(cc.fadeOut(0.3));
        }
    },
});
