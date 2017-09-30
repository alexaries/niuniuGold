require("pomeloClient")
var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        var loadNode = cc.find('loadNode').getComponent('loadNode'); //this.node.getChildByName("loadNode").getComponent("loadNode");
        loadNode.onInit();
        loadNode.hideNode();

        pomelo.clientScene = this;
        confige.curSceneIndex = 0;

        this.editBox = this.node.getChildByName("editBox");
        this.editBox.active = false;
        
        this.checkIco = this.node.getChildByName("check_mark");
        this.checkShow = true;
        
        this.btn_loginNode1 = this.node.getChildByName("btn_traveler");
        this.btn_loginNode2 = this.node.getChildByName("btn_weixin");
        this.btn_login1 = this.btn_loginNode1.getComponent("cc.Button");
        this.btn_login2 = this.btn_loginNode2.getComponent("cc.Button");
        
        this.loadingLayer = this.node.getChildByName("loadingLayer").getComponent("loadingLayer");
        this.loadingLayer.onInit();

        if(cc.sys.localStorage.getItem("lastLoginType") == null)
        {
            cc.sys.localStorage.setItem('lastLoginType', "traveler");   //traveler:游客;wechat:微信
        }
        if(cc.sys.localStorage.getItem("lastLoginUid") == null)
        {
            cc.sys.localStorage.setItem('lastLoginUid', 0);
        }

        if(cc.sys.localStorage.getItem("lastLoginType") == "wechat")
        {
            this.btn_loginNode1.active = false;
            this.btn_loginNode2.x = 0;
        }
        console.log("curUsePlatform === " + cc.sys.platform);
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)
        {
            confige.curUsePlatform = 0;
            this.btn_loginNode2.active = false;
            this.btn_loginNode1.x = 0;
        }else if(cc.sys.platform == cc.sys.ANDROID){
            confige.curUsePlatform = 1;
        }else if(cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD){
            confige.curUsePlatform = 2;
            if(cc.sys.platform == cc.sys.IPAD)
                cc.view.setDesignResolutionSize(1280,720,cc.ResolutionPolicy.EXACT_FIT);
        }else if(cc.sys.platform == cc.sys.MOBILE_BROWSER){
            confige.curUsePlatform = 0;
            this.btn_loginNode2.active = false;
            this.btn_loginNode1.x = 0;

            if(cc.sys.platform == cc.sys.MOBILE_BROWSER){
                this.bgNode = this.node.getChildByName("loginBg");
                this.bgNode.height = 910;
                cc.view.setDesignResolutionSize(1280,910,cc.ResolutionPolicy.EXACT_FIT);
            }
        }
        
        this.initLocalData();
        
        cc.loader.loadRes("sound/game_bgm", function (err, audio) {
            confige.audioList["bgm"] = audio;
            if(confige.musicEnable == true)
                if(confige.audioBgId == null)
                    confige.audioBgId = cc.audioEngine.play(audio,true,confige.audioVolume);
        });

        this.versionError = this.node.getChildByName("versionError");
        this.versionNum = this.node.getChildByName("versionNum").getComponent("cc.Label");
        this.versionNum.string = confige.versionCheck.split("&")[0];

        cc.log("onLoad!!!!!!!!!!!!");

        cc.sys.localStorage.setItem('currentVersion',confige.curVersion);
        console.log("currentVersion === " + cc.sys.localStorage.getItem('currentVersion'));
        this.updateLayer = this.node.getChildByName("updateLayer").getComponent("HotUpdate");
        this.updateLayer.onInit();

        if (cc.sys.isNative) {
            this.updateLayer.checkUpdate();
        }
    },
    
    start: function () {
    },

    GetRequest:function(){
        confige.h5SignURL = location.href;
        console.log("完整路径11111====="+confige.h5SignURL);
        var url = location.search; //获取url中"?"符后的字串
        console.log(url);
        var theRequest = new Object();
        var strs = [];
        if (url.indexOf("?") != -1) {   
           var str = url.substr(1);   
           strs = str.split("&");   
           for(var i = 0; i < strs.length; i ++) {   
              theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
           }   
        }   
        return theRequest;
    },

    initLocalData:function(){
        if(cc.sys.localStorage.getItem('check_invite') == null)
        {
            cc.sys.localStorage.setItem('check_invite',false);
        }
        if(cc.sys.localStorage.getItem('canUseRotary') == null)
            cc.sys.localStorage.setItem('canUseRotary',true);
        if(cc.sys.localStorage.getItem('firstOpen') == null)    //首次进入游戏
        {
            cc.sys.localStorage.setItem('firstOpen', false);
            
            var userSetting = {
                musicEnable : true,
                soundEnable : true
            };
            cc.sys.localStorage.setItem('userSetting', JSON.stringify(userSetting));
            confige.firstShowNotice = true;
        }else{
            var userSetting = JSON.parse(cc.sys.localStorage.getItem('userSetting'));
            console.log(userSetting);
            if(userSetting.musicEnable == true)
                confige.musicEnable = true;
            else if(userSetting.musicEnable == false)
                confige.musicEnable = false;

            if(userSetting.soundEnable == true)
                confige.soundEnable = true;
            else if(userSetting.soundEnable == false)
                confige.soundEnable = false;

            if(cc.sys.localStorage.getItem('lastLoginDate') != null)
            {
                var lastLoginDate = JSON.parse(cc.sys.localStorage.getItem('lastLoginDate'));
                var curDate = new Date();
                console.log(lastLoginDate);
                if( curDate.getFullYear() == lastLoginDate.year &&
                    curDate.getMonth()+1 == lastLoginDate.month &&
                    curDate.getDate() == lastLoginDate.day )
                {
                    //console.log("在同一天登陆");
                    confige.firstShowNotice = false;
                }else{
                    //console.log("不在同一天登陆");
                    confige.firstShowNotice = true;
                    cc.sys.localStorage.setItem('canUseRotary',true);
                }    
            }
        }
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

    initGameRes:function(){
        cc.loader.loadRes("frame/card/card_00", cc.SpriteFrame, function (err, spriteFrame) {
                confige.cardFrameMap[0] = spriteFrame;
        });

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
                cc.loader.loadRes("frame/card/card_" + j + t, cc.SpriteFrame,function(index){
                    return  function (err, spriteFrame) {
                        confige.cardFrameMap[index] = spriteFrame;
                    }
                }(index));
            }
        }

        for(var i=0;i<=18;i++)
        {
            cc.loader.loadRes("frame/niutype/niu_" + i, cc.SpriteFrame,function(index){
                return  function (err, spriteFrame) {
                    confige.niuTypeFrameMap[index] = spriteFrame;
                    if(index <= 10){
                        confige.niuTypeFrameMapFK[index] = spriteFrame;
                    }else{
                        switch(index){
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
            }(i));
        }

        for(var i=1;i<=12;i++)
        {
            cc.loader.loadRes("frame/face/" + i, cc.SpriteFrame, function(index){
                return function (err, spriteFrame) {
                    confige.faceFrameMap[index-1] = spriteFrame;
                }
            }(i));
        }
    },

    initGameResH5:function(){
        this.frameNode = this.H5ResNode.getChildByName("frame");
        this.cardNode = this.frameNode.getChildByName("card");
        this.faceNode = this.frameNode.getChildByName("face");
        this.niutypeNode = this.frameNode.getChildByName("niutype");

        confige.cardFrameMap[0] = this.cardNode.getChildByName("card_00").getComponent("cc.Sprite").spriteFrame;
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
                confige.cardFrameMap[index] = this.cardNode.getChildByName("card_"+j+t).getComponent("cc.Sprite").spriteFrame;
            }
        }

        for(var i=0;i<=18;i++)
        {
            var spriteFrame = this.niutypeNode.getChildByName("niu_"+i).getComponent("cc.Sprite").spriteFrame;

                    confige.niuTypeFrameMap[index] = spriteFrame;
                    if(index <= 10){
                        confige.niuTypeFrameMapFK[index] = spriteFrame;
                    }else{
                        switch(index){
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

        for(var i=1;i<=12;i++)
        {
            var spriteFrame = this.faceNode.getChildByName(""+i).getComponent("cc.Sprite").spriteFrame;

                    confige.faceFrameMap[index-1] = spriteFrame;
        }
    },

    onBtnTravelerClicked:function(){
        console.log("fuck click travler");
        // this.editBox.active = true;
        // confige.loginType = 0;

        
        this.btn_login1.interactable = false;
        var self = this;
        this.scheduleOnce(function(){
            self.btn_login1.interactable = true;
        },3)

        // pomelo.clientLogin("");
        if(cc.sys.localStorage.getItem("lastLoginUid") == 0)
        {
            pomelo.clientLogin("");
        }else{
            pomelo.clientLogin(cc.sys.localStorage.getItem("lastLoginUid"));
        }
    },
    
    onBtnUserKnowClicked:function(){
        if(this.checkShow == true)
        {
            this.checkIco.active = false;
            this.btn_login1.interactable = false;
            this.btn_login2.interactable = false;
            this.editBox.active = false;
            this.checkShow = false;
        }else{
            this.checkIco.active = true;
            this.btn_login1.interactable = true;
            this.btn_login2.interactable = true;
            this.checkShow = true;
        }
    },
    
    onBtnTestClicked:function(){
        console.log("test click test");
    },
    
    showLoading:function(){
        return;
        if(confige.curUsePlatform == 0)
            this.btn_loginNode1.active = false;
        else
            this.btn_loginNode2.active = false;
        this.loadingLayer.showLoading();
    },

    loadingFalse:function(){
        this.btn_loginNode2.active = true;
        this.loadingLayer.hideLoading();
    },

    btn_login_click:function(){
        confige.loginType = 0;
        var editString = this.editBox.getChildByName("IDEdit").getComponent("cc.EditBox").string;
        var id = parseInt(editString);
        console.log("id@@@@@@@====="+id);
        pomelo.clientLogin(id);
        
        this.showLoading();
    },

    connectCallBack:function(){
        pomelo.request("connector.entryHandler.getNotify",null, function(data) {
            confige.noticeData = data;
            var newNoticeData = JSON.stringify(data);
            var lastNoticeData = cc.sys.localStorage.getItem('lastNoticeData');
            console.log(newNoticeData);
            console.log(lastNoticeData);
            if(newNoticeData == lastNoticeData)
            {
                console.log("没有新的公告");
            }else{
                console.log("有新的公告");
                confige.firstShowNotice = true;
            }
            cc.sys.localStorage.setItem('lastNoticeData', JSON.stringify(data));
        });
    },

    onBtnWeixinClicked:function(){
        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        {
            this.showLoading();
            confige.loginType = 1;
            var lastLoginCount = 99;
            if(cc.sys.localStorage.getItem("wxLastLoginDay") != null)
            {
                lastLoginCount = confige.getDayCount() - cc.sys.localStorage.getItem("wxLastLoginDay");
            }
            if(cc.sys.localStorage.getItem('wxRefreshToken') == null || lastLoginCount >= 20 || lastLoginCount < 0)
            {
                if(confige.curUsePlatform == 1)
                {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXLogin", "()V");
                }else if(confige.curUsePlatform == 2){
                    jsb.reflection.callStaticMethod("JSCallOC", "WXLogin"); 
                }
            }else{
                confige.WX_REFRESH_TOKEN = cc.sys.localStorage.getItem('wxRefreshToken');
                var curRefreshToken = confige.WX_REFRESH_TOKEN;
                this.wxRefreshLogin();
            }
        }
        this.btn_login2.interactable = false;
        var self = this;
        this.scheduleOnce(function(){
            self.btn_login2.interactable = true;
        },3)
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
            pomelo.clientLogin(confige.WX_OPEN_ID, confige.WX_ACCESS_TOKEN);
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

    wxRefreshLogin:function(){
        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "微信刷新登陆111");
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();

        var httpCallback = function(){
            var loginJson = JSON.parse(xmlHttp.responseText);
            confige.WX_LOGIN_RETURN = loginJson;
            confige.WX_ACCESS_TOKEN = loginJson.access_token;
            confige.WX_OPEN_ID = loginJson.openid;
            confige.WX_REFRESH_TOKEN = loginJson.refresh_token;
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "WX_REFRESH_TOKEN");
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", loginJson.refresh_token);
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "WX_OPEN_ID");
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", loginJson.openid);
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "WX_ACCESS_TOKEN");
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", loginJson.access_token);
            pomelo.clientLogin(confige.WX_OPEN_ID, confige.WX_ACCESS_TOKEN);
            cc.sys.localStorage.setItem("wxRefreshToken",loginJson.refresh_token);
        };

        this.scheduleOnce(function() {
            var url = confige.refresh_token_url;
            url = url.replace("APPID", confige.APP_ID);
            url = url.replace("REFRESH_TOKEN", confige.WX_REFRESH_TOKEN);
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "refresh_token_url");
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", url);
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
    
    WXCancle:function(){
        this.btn_loginNode2.active = true;
        this.loadingLayer.hideLoading();
    },

    btnClickExit:function(){
        if(confige.curUsePlatform == 3){
            window.open(confige.h5LoginUrl);
            window.close();
        }
        else
            cc.sys.openURL(confige.shareURL);
    },

    showH5LoginError:function(){
        this.loadingLayer.active = false;
        this.h5LoginError.active = true;
    },

    showVersionError:function(){
        this.versionError.active = true;
        this.updateLayer.checkUpdate();
    },

    iosCallTest:function(string){
        cc.log("iosCallTest");
        if(typeof(string) == "string")
        {
            this.showVersionError();
        }
        this.btn_loginNode1.active = false;
        this.btn_loginNode1.active = false;
    },

    quickLoginClick:function(){
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "QuickLogin", "()V");
    },

    quickLoginCallBack:function(uid,token){
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "loginUid");
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", uid);
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "loginToken");
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", token);
    },
});
