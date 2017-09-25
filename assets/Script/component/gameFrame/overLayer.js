var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        overData_perfab:{
            default:null,
            type:cc.Prefab
        },
        isInit:false,
        shareTitle:"",
        shareDes:"",
    },

    // use this for initialization
    onLoad: function () {
        
    }, 
    
    onInit:function(){
        this.oriPosx = -525;
        this.oriPosy = 190;
        this.posxOffset = 210;
        
        this.overDataCount = 0;
        this.shareBtn = this.node.getChildByName("btn_other").getComponent("cc.Button");
        confige.curOverLayer = this;
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            this.node.height = 790;
            this.bgNode = this.node.getChildByName("gameOverBg");
            this.bgNode.height = 790;
            this.itemNode = this.node.getChildByName("itemNode");
            this.h5ShareNode = this.node.getChildByName("h5Share");
            this.h5ShareNode.opacity = 0;
            this.h5ShareNode.active = false;
            // this.shareBtnNode = this.node.getChildByName("btn_other");
            // this.shareBtnNode.active = false;
        }
        this.isInit = true;
    },
    
    addOneOverData:function(playerData,master){
        //console.log(playerData);
        var newOverData = cc.instantiate(this.overData_perfab);
        this.itemNode.addChild(newOverData);
        
        var newOverDataS = newOverData.getComponent("overDataOnce");
        newOverDataS.onInit();
        
        var newName = "nick";
        var niuTypeCount1=0,niuTypeCount2=0,niuTypeCount3=0,niuTypeCount4=0,niuTypeCount5=0,niuTypeCount6=0;
        for(var i in playerData.cardsList)
        {
            var newType = playerData.cardsList[i].type;
            if(newType === 0)//无牛
            {
                niuTypeCount6 = niuTypeCount6 + 1;
            }else{//有牛 
                niuTypeCount5 = niuTypeCount5 + 1;
                
                if(newType == 14)//小
                    niuTypeCount1 = niuTypeCount1 + 1;
                else if(newType == 11 || newType == 12)//花
                    niuTypeCount2 = niuTypeCount2 + 1;
                else if(newType == 13)//炸弹
                    niuTypeCount3 = niuTypeCount3 + 1;
                else if(newType == 10)//牛牛
                    niuTypeCount4 = niuTypeCount4 + 1;
            }
        }
        var oriChair = confige.getCurChair(playerData.chair);
        if(confige.WXHeadFrameList[oriChair+1])
            newOverDataS.head.spriteFrame = confige.WXHeadFrameList[oriChair+1];
        newOverDataS.nameL.string = playerData.playerInfo.nickname;
        newOverDataS.IDL.string = playerData.uid;
        newOverDataS.num0.string = playerData.bankerCount;
        newOverDataS.num1.string = niuTypeCount1;
        newOverDataS.num2.string = niuTypeCount2;
        newOverDataS.num3.string = niuTypeCount3;
        newOverDataS.num4.string = niuTypeCount4;
        newOverDataS.num5.string = niuTypeCount5;
        newOverDataS.num6.string = niuTypeCount6;
        newOverDataS.setScore(playerData.score);
        if(master == true)
            newOverDataS.showMaster();

        
        this.newOverDataList[playerData.chair] = newOverDataS;
        // if(playerData.score < 0)
        //     newOverDataS.loseIco.active = true;
        // else
        //     newOverDataS.winIco.active = true;
        newOverData.setPosition(this.oriPosx + this.posxOffset*this.overDataCount,this.oriPosy);
        this.overDataCount = this.overDataCount + 1;
    },
    
    showOverWithData:function(playerData){
        this.newOverDataList = {};
        this.maxScore = 0;
        this.maxChair = -1;
        for(var i in playerData)
        {
            this.newOverDataList[i] = {};
            var newPlayerData = playerData[i];
            if(newPlayerData.isActive == true)
            {
                var master = false;
                if(i === 0)
                    master = true;
                this.addOneOverData(newPlayerData,master);
                if(newPlayerData.score > this.maxScore)
                {
                    this.maxScore = newPlayerData.score;
                    this.maxChair = newPlayerData.chair;
                }
            }
        }

        for(var i in playerData)
        {
            var newPlayerData = playerData[i];
            if(newPlayerData.isActive == true && newPlayerData.chair != this.maxChair)
            {
                this.shareDes += "【"+newPlayerData.playerInfo.nickname+"】:"+newPlayerData.score+";";
            }
        }
        
        if(this.maxChair != -1)
        {
            this.newOverDataList[this.maxChair].winIco.active = true;
            this.shareTitle = "★大赢家【"+playerData[this.maxChair].playerInfo.nickname+"】 : "+playerData[this.maxChair].score;
        }

        if(cc.sys.platform == cc.sys.MOBILE_BROWSER){

            // html2canvas(document.body, {  
            //     allowTaint: true,  
            //     taintTest: false,  
            //     onrendered: function(canvas) {  
            //         canvas.id = "GameCanvas";  
            //         //document.body.appendChild(canvas);  
            //         //生成base64图片数据  
            //         var dataUrl = canvas.toDataURL();  
            //         var newImg = document.createElement("img");  
            //         newImg.src =  dataUrl;  
            //         console.log("dataUrl === "+ dataUrl);
            //         document.body.appendChild(newImg);

            //         var self = this;
            //         console.log("H5分享给好友");
            //         var curShareURL = dataUrl;
            //         wx.onMenuShareAppMessage({
            //             title: self.shareTitle,
            //             desc: self.shareDes,
            //             link: curShareURL,
            //             imgUrl: confige.h5ShareIco,
            //             trigger: function(res) {},
            //             success: function(res) {},
            //             cancel: function(res) {},
            //             fail: function(res) {}
            //         });
            //         console.log("H5分享到朋友圈2222222");
            //         wx.onMenuShareTimeline({
            //             title: self.shareTitle,
            //             desc: self.shareDes,
            //             link: curShareURL,
            //             imgUrl: confige.h5ShareIco,
            //             trigger: function(res) {},
            //             success: function(res) {},
            //             cancel: function(res) {},
            //             fail: function(res) {}
            //         });
            //     }
            // });


            var self = this;
            console.log("H5分享给好友");
            var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', '0');
            if(confige.h5InviteCode != "0")
            {
                curShareURL += "&invite_code=" + confige.h5InviteCode;
            }
            wx.onMenuShareAppMessage({
                title: self.shareTitle,
                desc: self.shareDes,
                link: curShareURL,
                imgUrl: confige.h5ShareIco,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });
            console.log("H5分享到朋友圈2222222");
            wx.onMenuShareTimeline({
                title: self.shareTitle,
                desc: self.shareDes,
                link: curShareURL,
                imgUrl: confige.h5ShareIco,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });
        }
    },

    onBtnStartGameClick:function(){
        confige.curOverLayer = -1;
        confige.quitToHallScene(true);
    },
    
    onBtnOtherClick:function(){
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER){
            var self = this;
            console.log("H5分享给好友");
            var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', '0');
            if(confige.h5InviteCode != "0")
            {
                curShareURL += "&invite_code=" + confige.h5InviteCode;
            }
            wx.onMenuShareAppMessage({
                title: self.shareTitle,
                desc: self.shareDes,
                link: curShareURL,
                imgUrl: confige.h5ShareIco,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });
            console.log("H5分享到朋友圈2222222");
            wx.onMenuShareTimeline({
                title: self.shareTitle,
                desc: self.shareDes,
                link: curShareURL,
                imgUrl: confige.h5ShareIco,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });

            this.h5ShareNode.active = true;
            this.h5ShareNode.stopAllActions();
            this.h5ShareNode.opacity = 255;
            var deactiveCall = cc.callFunc(function () {
                this.h5ShareNode.active = false;
            },this);
            this.h5ShareNode.runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(1),deactiveCall));
        }
        if (!cc.sys.isNative) return;
        let dirpath = jsb.fileUtils.getWritablePath() + 'ScreenShoot/';
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }
        let name = 'ScreenShoot-' + (new Date()).valueOf() + '.png';
        let filepath = dirpath + name;
        let size = cc.winSize;
        let rt = cc.RenderTexture.create(size.width, size.height);
        cc.director.getScene()._sgNode.addChild(rt);
        rt.setVisible(false);
        rt.begin();
        cc.director.getScene()._sgNode.visit();
        rt.end();
        rt.saveToFile('ScreenShoot/' + name, cc.ImageFormat.PNG, true, function() {
            cc.log('save succ');
            rt.removeFromParent();
            if(confige.curUsePlatform == 1)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "filepath222==="+filepath);
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShareScreenPath", "(Ljava/lang/String;)V", filepath);
            }else if(confige.curUsePlatform == 2){
                jsb.reflection.callStaticMethod("JSCallOC","WXShareScreenWithPath:",filepath);
            }
        });

        this.shareBtn.interactable = false;
    },

    openShare:function(){
        this.shareBtn.interactable = true;
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
        this.selectHead = -1;
    },

    hideH5ShareNode:function(){
        this.h5ShareNode.stopAllActions();
        this.h5ShareNode.opacity = 0;
        this.h5ShareNode.active = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
