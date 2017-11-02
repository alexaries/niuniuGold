var gameData = require("gameData");
var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        sayItemPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    onDestory:function(){
    },

    onLoad: function () {
    },

    onInit:function(){
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER){
            this.node.height = 910;
            this.h5ShareNode = this.node.getChildByName("h5Share");
            this.h5ShareNode.opacity = 0;
            this.h5ShareNode.active = false;
            
            // this.h5ShareInit();
        }
        this.check_inviteCode();
        gameData.gameInfoNode = this;
        //处理当前房间信息
        this.cardMode = confige.roomData.cardMode;
        this.gameMode = confige.roomData.gameMode;
        this.bankerMode = confige.roomData.bankerMode;
        
        if(confige.roomData.initiativeFlag == true)
        {
            confige.lastFriendRoomID = confige.roomData.roomId;
            this.roomInfo = this.node.getChildByName("roomData2");
        }else{
            confige.lastFriendRoomID = -1;
            this.roomInfo = this.node.getChildByName("roomData1");
        }
        this.roomInfo.active = true;

        this.roomCurTime = confige.roomData.gameNumber;
        this.roomMaxTime = confige.roomData.maxGameNumber;  
        
        this.roomID = this.roomInfo.getChildByName("roomID").getComponent("cc.Label");
        this.roomMode = this.roomInfo.getChildByName("roomMode").getComponent("cc.Label");
        this.roomTime = this.roomInfo.getChildByName("roomTime").getComponent("cc.Label");
        this.roomTimeNode = this.roomInfo.getChildByName("nowTime");
        this.roomBasicLabel = this.roomInfo.getChildByName("roomBasic").getComponent("cc.Label");
        this.roomBasicLabel.string = "房间倍率:"+confige.roomData.rate;
        // this.roomBasicLabel.string = confige.goldType[confige.roomData.roomType];
        gameData.gameMainScene.basicScore = confige.roomData.rate;
        
        this.roomID.string = "房间号:" + confige.roomData.roomId;
        if(confige.roomData.gameMode == 1)
            this.roomMode.string = "普通牛牛";
        if(confige.roomData.gameMode == 2)
            this.roomMode.string = "明牌抢庄";
        if(confige.roomData.gameMode == 3)
            this.roomMode.string = "斗公牛";
        if(confige.roomData.gameMode == 4)
            this.roomMode.string = "通比牛牛";

        this.roomType = "";
        var newType = confige.roomData.roomType.substring(0,11);
        var newType2 = confige.roomData.roomType.substring(0,10);
        if(newType == "goldMingpai")
        {
            this.roomMode.string = "明牌抢庄";
            this.roomType = "goldMingpai";
            console.log("newType===",newType);
        }
        if(newType2 == "goldNiuNiu"){
            this.roomMode.string = "普通牛牛";
            this.roomType = "goldNiuNiu";
            console.log("newType2===",newType2);
        }

        this.joinState = confige.roomData.state;
        if(this.joinState == 1001)
            this.roomCurTime ++;
        this.roomTime.string = "第" + this.roomCurTime + "/" + this.roomMaxTime + "局";

        this.tipsBox = this.node.getChildByName("tipsBox");
        this.tipsBox2 = this.node.getChildByName("tipsBox2");
        this.tipsLabel = this.tipsBox.getChildByName("tips").getComponent("cc.Label");

        this.btn_inviteFriend = this.node.getChildByName("btn_inviteFriend");
        if(confige.roomData.initiativeFlag == true)
            this.btn_inviteFriend.active = true;
        else
            this.btn_inviteFriend.active = false;


        this.btnShowFunc = this.node.getChildByName("btnShowFunc");
        this.funcNodeShow = false;
        this.funcNode = this.node.getChildByName("funcNode");
        this.btn_close = this.funcNode.getChildByName("btn_close").getComponent("cc.Button");
        this.changeDeskBtnNode = this.funcNode.getChildByName("changeDesk");
        this.changeDeskBtn = this.changeDeskBtnNode.getComponent("cc.Button");
        this.changeDeskBtnNode.opacity = 130;

        this.matchingNode = this.node.getChildByName("matchingNode");
        // var timeLabel = this.roomInfo.getChildByName("nowTime").getComponent("cc.Label");
        // var refleshTime = function(){
        //     var timeSting = "";
        //     var myDate = new Date();
        //     var hour = myDate.getHours();
        //     var minutes = myDate.getMinutes();
        //     if(hour < 10)
        //         timeSting = timeSting + "0" + hour;
        //     else
        //         timeSting = timeSting + hour;
        //     timeSting += ":";
        //     if(minutes < 10)
        //         timeSting = timeSting + "0" + minutes;
        //     else
        //         timeSting = timeSting + minutes;

        //     timeLabel.string = timeSting;
        // };
        // refleshTime();
        // timeLabel.schedule(refleshTime,10);

        this.webCloseLayer = this.node.getChildByName("webCloseLayer").getComponent("loadingLayer");
        this.webCloseLayer.onInit();

        this.layerNode1 = this.node.getChildByName("layerNode1");
        this.layerNode2 = this.node.getChildByName("layerNode2");

        this.overLayer = -1;
        this.chatLayer = -1;       
        this.settingLayer = -1;
        this.settleLayer = -1;
        this.userInfoLayer = -1;
        this.gameGiftLayer = -1;

        this.chatLayerLoad = false;
        this.settleLayerLoad = false;
        this.userInfoLayerLoad = false;
        this.gameGiftLayerLoad = false;

        this.rotatyLayer = this.node.getChildByName("rotaryLayer").getComponent("rotaryLayer");
        this.rotatyLayer.onInit("game");
        this.rotatyLayer.parent = this;
        this.rewardLayer = this.node.getChildByName("rewardLayer").getComponent("rewardLayer");
        this.rewardLayer.onInit();

        this.userInfoLayer = this.node.getChildByName("userInfoLayer").getComponent("userInfoLayer");
        this.userInfoLayer.onInit("game");
        this.userInfoLayer.parent = this;

        this.quickStringList = {};
        this.quickStringList[0] = "快点啊,等到花儿都谢了!";
        this.quickStringList[1] = "不要吵了,不要吵了,专心玩游戏吧!";
        this.quickStringList[2] = "不要走,决战到天亮!";
        this.quickStringList[3] = "底牌亮出来绝对吓死你!";
        this.quickStringList[4] = "风水轮流转,底裤都输掉了!";

        //初始化语音模块
        this.yuyinList = [];
        this.yuyinPaly = false;
        this.sayTime = 0;
        this.sayTimeSchedule = -1;
        this.playTimeSchedule = -1;
        this.yuyinTimeOut = -1; 

        this.yuyinBtn = this.node.getChildByName("btn_yuyin");
        this.yuyinBtn.getComponent("cc.Button").interactable = false;
        // if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        // {
        //     confige.GVoiceCall.init(""+confige.userInfo.uid);//(confige.roomData.roomId*10 + gameData.gameMainScene.meChair));
        //     confige.GVoiceRoomID = "" + confige.roomData.roomId;
        //     confige.GVoiceCall.joinRoom(confige.GVoiceRoomID);
        //     var voicePath = jsb.fileUtils.getWritablePath() + 'GVoice/';
        //     if (!jsb.fileUtils.isDirectoryExist(voicePath)) {
        //         jsb.fileUtils.createDirectory(voicePath);
        //     }
        //     if(confige.curUsePlatform == 1){
        //         jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "SetVoicePath", "(Ljava/lang/String;)V", voicePath);
        //     }else if(confige.curUsePlatform == 2){
        //         console.log("231");
        //         jsb.reflection.callStaticMethod("JSCallOC", "GVoiceSetPath:",voicePath);
        //     }
        //     // confige.GVoiceCall.openListen();

        //     var self = this;
        //     this.btn_quickSay = this.node.getChildByName("btn_quickSay");
        //     var btnYY = this.yuyinBtn;
        //     var voiceMaskLayer = this.node.getChildByName("voiceMaskLayer");
        //     var voiceMaskNode1 = voiceMaskLayer.getChildByName("node1");
        //     var voiceMaskNode2 = voiceMaskLayer.getChildByName("node2");
        //     var voiceTouchBeginY = 0;
        //     var newYuyinPos = this.node.convertToWorldSpaceAR(cc.v2(btnYY.x,btnYY.y));
        //     var onSay = false;
        //     var voiceCancle = false;
        //     var sayCallBack = function(){
        //         if(onSay == true){
        //             closeMicFunc();
        //         }
        //     };
        //     var closeMicFunc = function(){
        //         if(voiceCancle == true)
        //             confige.GVoiceCall.closeMic(1);
        //         else
        //             confige.GVoiceCall.closeMic(0);
        //         voiceMaskLayer.active = false;
        //         onSay = false;
        //         self.unschedule(sayCallBack);
        //         btnYY.runAction(cc.scaleTo(0.1,1.0));
        //         self.openMusicAndSound();
        //         self.endSayTime();
        //         voiceMaskNode1.active = false;
        //         voiceMaskNode2.active = false;
        //     };
            
        //     // 添加单点触摸事件监听器
        //     var voiceListen = {
        //         event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //         onTouchBegan: function (touches, event) {
        //             if(touches.getLocationX() > newYuyinPos.x - 40 &&
        //                touches.getLocationX() < newYuyinPos.x + 40 &&
        //                touches.getLocationY() > newYuyinPos.y - 40 &&
        //                touches.getLocationY() < newYuyinPos.y + 40 
        //                 )
        //             {
        //                 cc.log('Touch Began: ' + event + "xxx===" + touches.getLocationX() + "yyy===" + touches.getLocationY());
        //                 self.closeMusicAndSound();
        //                 self.beginSayTime();
        //                 if(self.playTimeSchedule != -1)
        //                     self.unschedule(self.playTimeSchedule);
        //                 confige.GVoiceCall.openMic();
        //                 voiceMaskLayer.active = true;
        //                 voiceMaskNode1.active = true;
        //                 onSay = true;
        //                 self.scheduleOnce(sayCallBack,10);
        //                 btnYY.runAction(cc.scaleTo(0.1,0.8));
        //                 voiceTouchBeginY = touches.getLocationY();
        //                 voiceCancle = false;
        //                 return true; //这里必须要写 return true
        //             }else{
        //                 return false;
        //             }
                    
        //         },
        //         onTouchMoved: function (touches, event) {
        //             //cc.log('Touch Moved: ' + event);
        //             if(touches.getLocationY() - voiceTouchBeginY > 100)
        //             {
        //                 voiceMaskNode1.active = false;
        //                 voiceMaskNode2.active = true;
        //                 voiceCancle = true;
        //             }
        //         },
        //         onTouchEnded: function (touches, event) {
        //             cc.log('Touch Ended: ' + event);
        //             closeMicFunc();
        //         },
        //         onTouchCancelled: function (touches, event) {
        //            //cc.log('Touch Cancelled: ' + event);
        //         }
        //     };
        //     // 绑定单点触摸事件
        //     cc.eventManager.addListener(voiceListen, this.btn_quickSay);
        // }else{
        //     this.yuyinBtn.getComponent("cc.Button").interactable = false;
        //     // if(confige.curUsePlatform != 3)
        //     //     this.btn_inviteFriend.active = false;
        //     // else
        //     //     this.yuyinBtn.active = false;
        // }
    },

    //聊天模块代码,聊天的内容在msg对象中,其中sayType表示聊天模式(0快捷聊天,1快捷表情,2输入文字聊天),当sayType为0或1时,通过index去索引内容,当为2时通过string来获取内容
    // initChatLayer:function(){
    //     this.chatLayer = this.node.getChildByName("chatLayer");

    //     this.faceLayer = this.chatLayer.getChildByName("faceLayer");
    //     this.quickLayer = this.chatLayer.getChildByName("quickLayer");
    //     this.chatEdit = this.chatLayer.getChildByName("chatBox").getChildByName("chatEdit").getComponent("cc.EditBox");

        

    //     this.faceFrameMap = confige.faceFrameMap;
    // },
    
    onBtnReturnClicked:function(){
        cc.director.loadScene('HallScenePlus');
    },

    

    // onBtnShowChat:function(){
    //     this.chatLayer.active = true;
    // },

    // onBtnHideChat:function(){
    //     this.chatEdit.string = "";
    //     this.chatLayer.active = false;
    // },

    // onBtnChatLayerClick:function(event, customEventData){
    //     var clickIndex = parseInt(customEventData);
    //     if(clickIndex == 0)
    //     {
    //         this.faceLayer.active = true;
    //         this.quickLayer.active = false;
    //     }else if(clickIndex == 1){
    //         this.faceLayer.active = false;
    //         this.quickLayer.active = true;
    //     }

    //     if(clickIndex == 2)
    //     {
    //         var chatString = this.chatEdit.string;
    //         if(chatString != "")
    //             pomelo.clientSend("say",{"msg": {"sayType":2, "string": chatString}});
            
    //         console.log("say chat" + chatString);
    //         console.log("string length ====== " + chatString.length);
    //     }

    //     if(clickIndex >= 10 && clickIndex < 22)
    //     {
    //         var faceIndex = clickIndex - 10;
    //         pomelo.clientSend("say",{"msg": {"sayType":0, "index": faceIndex}});
    //         console.log("faceIndex" + faceIndex);
    //     }

    //     if(clickIndex >= 30 && clickIndex < 35)
    //     {
    //         var quickIndex = clickIndex - 30;
    //         pomelo.clientSend("say",{"msg": {"sayType":1, "index": quickIndex, "sex": confige.curSex}});
    //         console.log("quickIndex" + quickIndex);
    //     }

    //     if(clickIndex >= 2)
    //         this.onBtnHideChat();
    // },

    showSayWithMsg:function(chair,msg){
        if(msg.sayType == 100)
        {
            gameData.gamePlayerNode.showHeadFace(msg.chairBegin,msg.chairEnd,msg.index,msg.sex);
            return;
        }
        var curChair = confige.getCurChair(chair);
        
        if(msg.sayType == 255)
        {
            if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
            {
                var newYuyinData = {id:msg.id,chair:curChair.toString(),time:msg.time};
                this.addYuyinOnce(newYuyinData);
            }
            return;
        }

        var curString = "";

        if(msg.sayType == 0)
        {
            if(confige.loadFaceFrame == true)
            {
                console.log("someone say face！！！" + msg.index);
                gameData.gamePlayerNode.faceList[curChair].active = true;
                gameData.gamePlayerNode.faceList[curChair].getComponent("cc.Sprite").spriteFrame = confige.faceFrameMap[msg.index];
                gameData.gamePlayerNode.faceList[curChair].opacity = 255;
                gameData.gamePlayerNode.faceList[curChair].stopAllActions();
                gameData.gamePlayerNode.faceList[curChair].runAction(cc.sequence(cc.delayTime(1),cc.fadeOut(1.5)));
            } 
        }else if(msg.sayType == 1){
            console.log("someone say quick!!!!!" + msg.index + "sex ===" + msg.sex);
            console.log(this.quickStringList[msg.index]);
            curString = this.quickStringList[msg.index];
            if(confige.soundEnable == true)
            {
                if(msg.sex == 2)
                {
                    confige.playSoundByName("female_chat_"+msg.index);
                }else{
                    confige.playSoundByName("male_chat_"+msg.index);
                }
            }
        }else if(msg.sayType == 2){
            console.log("someone say:" + msg.string);
            curString = msg.string;
        }
        
        if(msg.sayType > 0)
        {
            gameData.gamePlayerNode.sayBoxList[curChair].active = true;
            gameData.gamePlayerNode.sayBoxLabelList[curChair].string = curString;
            gameData.gamePlayerNode.sayBoxList[curChair].width = gameData.gamePlayerNode.sayBoxLabelNodeList[curChair].width + 100;
            gameData.gamePlayerNode.sayBoxLabelNodeList[curChair].x = gameData.gamePlayerNode.sayBoxList[curChair].width/2;

            gameData.gamePlayerNode.sayBoxList[curChair].opacity = 255;
            gameData.gamePlayerNode.sayBoxList[curChair].stopAllActions();
            gameData.gamePlayerNode.sayBoxList[curChair].runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(2)));
        }
    },

    btnClickFinish:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        if(clickIndex == 0)             //show
        {
            this.tipsLabel.string = "是否要退出房间回到大厅!";
            this.tipsBox.active = true;
        }else if(clickIndex == 1) {     //send
            // if(confige.isGoldMode == true){
            //     if(this.returnType == true)
            //         confige.quitToHallScene(true);
            //     else
            //         pomelo.goldQuite();
            // }
            // else
            //     pomelo.goldQuite();
            pomelo.goldQuite();
            this.tipsBox.active = false;
        }else if(clickIndex == 2) {      //hide
            this.tipsBox.active = false;
        }        
    },

    h5ShareInit:function(){
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
        else if(confige.roomData.gameMode == 6)
            curDes += "【疯狂加倍】,";
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
            else if(confige.roomData.bankerMode == 5)
                curDes += "牛牛坐庄,";
        }
        curDes += "大家快来玩吧!";

        console.log(curTitle + curDes);

        var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', confige.roomData.roomId);
        if(confige.h5InviteCode != "0")
        {
            curShareURL += "&invite_code=" + confige.h5InviteCode;
        }
        wx.ready(function(res) {
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
        });
    },

    btnInviteFriend:function(){
        cc.log("邀请好友");
        // var curTitle = "快打开我爱牛牛和我一块玩吧~";
        var curTitle = "欢乐赢棋牌,"
        curTitle += "房间号:" + confige.roomData.roomId;

        var curDes = "";
        if(confige.roomData.roomType == "niuniu"){
            curDes += "【普通牛牛】,";
            curDes += "倍率" + confige.roomData.rate + ",";
        }else if(confige.roomData.roomType == "mingpaiqz"){
            curDes += "【明牌抢庄】,";
            curDes += "倍率" + confige.roomData.rate + ",";
        }

        if(confige.roomData.cardMode == 1)
            curDes += "暗牌,";
        else if(confige.roomData.cardMode == 2)
            curDes += "明牌,"

            if(confige.roomData.bankerMode == 1)
                curDes += "随机抢庄,";
            else if(confige.roomData.bankerMode == 2)
                curDes += "房主坐庄,";
            else if(confige.roomData.bankerMode == 3)
                curDes += "轮流坐庄,";
            else if(confige.roomData.bankerMode == 5)
                curDes += "牛牛坐庄,";

        curDes += "大家快来玩吧!";

        console.log(curTitle + curDes);

        this.btn_inviteFriend.interactable = false;

        var newShareURL = "http://update.5d8d.com:8431/goldDownload.html"
        
        if(confige.curUsePlatform == 1)
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", curTitle, curDes, newShareURL, 0);
        else if(confige.curUsePlatform == 2)
            jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",curTitle, curDes, newShareURL, 0);

        if(confige.curUsePlatform == 3)
        {
            var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', confige.roomData.roomId);
            if(confige.h5InviteCode != "0")
            {
                curShareURL += "&invite_code=" + confige.h5InviteCode;
            }
            wx.ready(function(res) {
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
            });
            this.h5ShareNode.active = true;
            this.h5ShareNode.stopAllActions();
            this.h5ShareNode.opacity = 255;
            var deactiveCall = cc.callFunc(function () {
                this.h5ShareNode.active = false;
            },this);  
            this.h5ShareNode.runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(1),deactiveCall));
        }

        var newCallBack = function(){
            newCallBack.btn.interactable = true;
        };
        newCallBack.btn = this.btn_inviteFriend;
        setTimeout(newCallBack,300);
    },
    
    showReConnect:function(){
        this.webCloseLayer.showLoading();
    },

    hideReConnect:function(){
        this.webCloseLayer.hideLoading();
    },

    btnClickRefresh:function(){
        confige.curReconnectType = confige.ON_OVER;
        confige.curGameScene.destroy();
        confige.resetGameData();
        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        {
            confige.GVoiceCall.quitRoom(confige.GVoiceRoomID);
            confige.GVoiceCall.closeListen();
        }
        confige.curReconnectType = confige.ON_HALL;
        pomelo.disconnect();
        if(confige.curUsePlatform == 3){
            window.open(confige.h5LoginUrl);
            window.close();
        }
    },

    sayWithID:function(voiceID){
        pomelo.clientSend("say",{"msg": {"sayType":255, "id": voiceID, "time": this.sayTime}});
    },

    closeMusicAndSound:function(){
        if(confige.musicEnable == true)
            cc.audioEngine.pause(confige.audioBgId);

        cc.audioEngine.pauseAll();
        this.soundEnableOri = confige.soundEnable;
        confige.soundEnable = false;
    },

    openMusicAndSound:function(){
        if(confige.musicEnable == true)
            cc.audioEngine.resume(confige.audioBgId);
        cc.audioEngine.resumeAll();
        if(this.soundEnableOri == true)
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
            gameData.gamePlayerNode.sayAniNode.addChild(newSayItem);
            newSayItem.x = gameData.gamePlayerNode.sayPosList[curYuyinData.chair].x;
            newSayItem.y = gameData.gamePlayerNode.sayPosList[curYuyinData.chair].y;
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

    hideH5ShareNode:function(){
        this.h5ShareNode.stopAllActions();
        this.h5ShareNode.opacity = 0;
        this.h5ShareNode.active = false;
    },

    onBtnPopBankerClicked:function(){
        pomelo.clientSend("downBanker");
    },

    onBtnShowLayer:function(event, customEventData,callBack){
        var index = parseInt(customEventData);
        var self = this;
        switch(index){
            case  0:
                if(self.chatLayer == -1){
                    if(self.chatLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/game/chatLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode1.addChild(newLayer);
                            self.chatLayer = newLayer.getComponent("chatLayer");
                            self.chatLayer.showLayer();
                            self.chatLayer.parent = self;
                        });
                        self.chatLayerLoad =true;
                    }
                }else{
                    self.chatLayer.showLayer();
                }
                break;
            case  1:
                if(self.settingLayer == -1){
                    if(self.settleLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/settingLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode1.addChild(newLayer);
                            self.settingLayer = newLayer.getComponent("settingLayer");
                            self.settingLayer.showLayer();
                            self.settingLayer.parent = self;
                            self.settingLayer.showRefreshBtn();
                        });
                        self.settleLayerLoad =true;
                    }
                }else{
                    self.settingLayer.showLayer();
                }
                break;
            case  2:
                if(self.userInfoLayer == -1){
                    if(self.userInfoLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/game/userInfoLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode1.addChild(newLayer);
                            self.userInfoLayer = newLayer.getComponent("userInfoLayer");
                            self.userInfoLayer.showLayer("user");
                            self.userInfoLayer.parent = self;

                            if(callBack)
                                callBack();
                        });
                        self.userInfoLayerLoad =true;
                    }
                }else{
                    self.userInfoLayer.showLayer("user");
                    if(callBack)
                            callBack();
                }
                break;
            case 3:
                if(self.userInfoLayer == -1){
                    if(self.userInfoLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/game/userInfoLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode1.addChild(newLayer);
                            self.userInfoLayer = newLayer.getComponent("userInfoLayer");
                            self.userInfoLayer.showLayer("other");
                            self.userInfoLayer.parent = self;

                            if(callBack)
                                callBack();
                        });
                        self.userInfoLayerLoad =true;
                    }
                }else{
                    self.userInfoLayer.showLayer("other");
                    if(callBack)
                            callBack();
                }
                break;
            case 4:
                this.userInfoLayer.showLayer();
                break;
        };
    },

    showOverLayer:function(data){
        var self = this;
        var overCallFunc = function(){
            console.log("overLayer.overCallFunc");
            if(self.overLayer == -1){
                cc.loader.loadRes("prefabs/game/overLayer", cc.Prefab, function (err, prefabs) {
                    var newLayer = cc.instantiate(prefabs);
                    self.layerNode2.addChild(newLayer,10);
                    self.overLayer = newLayer.getComponent("overLayer");
                    self.overLayer.showLayer();
                    self.overLayer.parent = self;
                    self.overLayer.showOverWithData(data.player);
                });
            }else{
                self.overLayer.showLayer();
                self.overLayer.showOverWithData(data.player);
            }
        };
        if(gameData.gameMainScene.waitForSettle == true && this.settleLayer != -1)
                this.settleLayer.overCallBack = overCallFunc;
        else
            overCallFunc();
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

    btnShowFuncClick:function(){
        if(this.funcNodeShow == true)
        {
            this.funcNodeShow = false;
            this.btnShowFunc.rotation = 180;
            this.funcNode.runAction(cc.scaleTo(0.2,0));
        }else{
            this.funcNodeShow = true;
            this.btnShowFunc.rotation = 0;
            this.funcNode.runAction(cc.scaleTo(0.2,1));
        }
    },

    btnReturnToHall:function(){
        confige.quitToHallScene(true);
    },

    showReturn:function(){
        this.tipsBox2.active = true;
    },

    changeDesk:function(){
        console.log("changeDesk click@@@@@@@@");
        if(gameData.gameMainScene.canChangeDesk == false)
        {
            console.log("不在空闲状态，不能换桌");
            return;
        }
        this.matchingNode.active = true;
        gameData.gamePlayerNode.changeDeskClean();
        var self = this;
        confige.isChangeDesk = true;
        pomelo.request("connector.entryHandler.sendData", {"code" : "userQuit"}, function(data) {
                console.log(data)
                if(data.flag == true)
                {
                    var curScore = gameData.gamePlayerNode.playerScoreList[gameData.gameMainScene.meChair];
                    console.log("当前剩余分数====="+curScore);
                    var changeLevel = 0;
                    if(gameData.gameMainScene.consumeType == "gold")
                    {
                        if(curScore >= confige.roomLimit.goldBasic[4]*confige.roomLimit.limitMinRate)
                            changeLevel = 5;
                        if(curScore >= confige.roomLimit.goldBasic[3]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.goldBasic[3]*confige.roomLimit.limitMaxRate)
                            changeLevel = 4;
                        if(curScore >= confige.roomLimit.goldBasic[2]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.goldBasic[2]*confige.roomLimit.limitMaxRate)
                            changeLevel = 3;
                        if(curScore >= confige.roomLimit.goldBasic[1]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.goldBasic[1]*confige.roomLimit.limitMaxRate)
                            changeLevel = 2;
                        if(curScore >= confige.roomLimit.goldBasic[0]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.goldBasic[0]*confige.roomLimit.limitMaxRate)
                            changeLevel = 1;
                    }else{
                        if(curScore >= confige.roomLimit.diamondBasic[4]*confige.roomLimit.limitMinRate)
                            changeLevel = 5;
                        if(curScore >= confige.roomLimit.diamondBasic[3]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.diamondBasic[3]*confige.roomLimit.limitMaxRate)
                            changeLevel = 4;
                        if(curScore >= confige.roomLimit.diamondBasic[2]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.diamondBasic[2]*confige.roomLimit.limitMaxRate)
                            changeLevel = 3;
                        if(curScore >= confige.roomLimit.diamondBasic[1]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.diamondBasic[1]*confige.roomLimit.limitMaxRate)
                            changeLevel = 2;
                        if(curScore >= confige.roomLimit.diamondBasic[0]*confige.roomLimit.limitMinRate && curScore <= confige.roomLimit.diamondBasic[0]*confige.roomLimit.limitMaxRate)
                            changeLevel = 1;
                    }
                    var curGameType = self.roomType+"-"+changeLevel+"-"+gameData.gameMainScene.consumeType;
                    console.log("curGameType ==== @@@@@@",curGameType);

                    var callFunc = function(){
                        pomelo.request("connector.entryHandler.sendData", {"code" : "joinMatch","params" : {
                            gameType: curGameType}}, function(data) {
                              console.log(data)
                            }
                        ); 
                    };
                    self.scheduleOnce(callFunc,2);
                }
            }
        );
    },
});
