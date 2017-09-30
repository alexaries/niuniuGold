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

    onInit:function(sceneType,userType,data){
        this.userID = this.node.getChildByName("playerInfoNode").getChildByName("id").getComponent("cc.Label");
        this.userHead = this.node.getChildByName("playerInfoNode").getChildByName("head").getComponent("cc.Sprite");
        this.userNick = this.node.getChildByName("playerInfoNode").getChildByName("name").getComponent("cc.Label");
        this.userGold = this.node.getChildByName("goldNode").getChildByName("goldNum").getComponent("cc.Label");
        this.userSign = this.node.getChildByName("playerInfoNode").getChildByName("userSign").getComponent("cc.Label");
        this.userSignEditNode = this.node.getChildByName("playerInfoNode").getChildByName("signEdit");
        this.userSignEdit = this.node.getChildByName("playerInfoNode").getChildByName("signEdit").getComponent("cc.EditBox");
        this.userDiamond = this.node.getChildByName("diamondNode").getChildByName("diamondNum").getComponent("cc.Label");
        this.userCharmCur = this.node.getChildByName("charmNode").getChildByName("charmNum").getComponent("cc.Label");
        this.userCharmAdd = this.node.getChildByName("charmAddNode").getChildByName("charmAdd").getComponent("cc.Label");

        this.btnWXLink = this.node.getChildByName("btnWXLink");
        this.wxLinkIco = this.node.getChildByName("wxLinkIco");

        this.showGiftType = 0;
        this.sceneType = sceneType;
        if(userType == "user")
            this.userType = "user";
        else
            this.userType = "other";
        if(this.userType == "user")
        {
            if(confige.meWXHeadFrame != -1)
            {
                this.userHead.spriteFrame = confige.meWXHeadFrame;
            }
            this.userNick.string = confige.userInfo.nickname;
            this.userID.string = confige.userInfo.uid;
            this.userSign.string = confige.curSignature;
            if(cc.sys.localStorage.getItem('lastLoginType') == "traveler")
            {
                this.btnWXLink.active = true;
                this.wxLinkIco.active = false;
                if(this.sceneType == "game")
                    this.btnWXLink.getComponent("cc.Button").interactable = false;
            }else{
                this.btnWXLink.active = false;
                this.wxLinkIco.active = true;
            }
        }else{
            console.log("other data === ");
            console.log(data);
        }
        
        this.isInit = true;
    },

    btnWXLinkClick:function(){
        if(confige.curUsePlatform == 1)
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXLogin", "()V");
        }else if(confige.curUsePlatform == 2){
            jsb.reflection.callStaticMethod("JSCallOC", "WXLogin"); 
        }
    }, 

    btnSendGiftClick:function(){
        console.log("btnSendGiftClick@@@@@@@@");
        if(this.showGiftType == 0)
            this.parent.hallGiftLayer.showLayer();
        else if(this.showGiftType == 1)
            this.parent.hallGiftLayer.showLayer(this.showGiftUid);
    },

    btnChangeSign:function(){
        console.log("btnChangeSign@@@@@@@@");
        this.userSignEditNode.active = true;
        this.userSignEdit.setFocus();
        this.userSign.string = "";
        this.userSignEdit.string = "";
    },

    editBegin:function(){
        console.log("editBegin@@@@@@@@");
    },

    editEnd:function(){
        var self = this;
        console.log("editEnd@@@@@@@@");
        this.userSign.string = this.userSignEdit.string;
        pomelo.request("connector.account.changeSignature",{signature:this.userSignEdit.string}, function(data) {
            console.log("更换签名成功");
            confige.curSignature = self.userSign.string;
        });
              
        this.userSignEditNode.active = false;
    },

    showLayer:function(userType,data){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;

        if(userType == "user")
        {
            if(confige.meWXHeadFrame != -1)
            {
                this.userHead.spriteFrame = confige.meWXHeadFrame;
            }
            this.userNick.string = confige.userInfo.nickname;
            this.userID.string = confige.userInfo.uid;
            this.userSign.string = confige.curSignature;
            this.userGold.string = confige.curGold;
            this.userDiamond.string = confige.curDiamond;
            if(confige.curCharmNum <0 )
                this.userCharmCur.string = ";"+confige.curCharmNum;
            else
                this.userCharmCur.string = confige.curCharmNum;
            if(confige.curCharmAdd < 0)
                this.userCharmAdd.string = "今日"+confige.curCharmAdd;
            else
                this.userCharmAdd.string = "今日+"+confige.curCharmAdd;
        }else{
            console.log("other data === ");
            console.log(data);
        }
        
    },

    updateDataWithBillBoard:function(data){
        this.showGiftType = 1;
        console.log("updateDataWithBillBoard");
        console.log(data);
        var curPlayerData = data;
        this.showGiftUid = data.uid;
        if(confige.meWXHeadFrame != -1)
        {
            confige.getWXHearFrameNoSave(curPlayerData.head,this.userHead);
        }
        this.userGold.string = curPlayerData.gold;
        // this.userDiamond.string = curPlayerData.diamond;
        this.userSign.string = curPlayerData.signature;
        this.userNick.string = curPlayerData.nickname;
        if(curPlayerData.charm <0 )
            this.userCharmCur.string = ";"+curPlayerData.charm;
        else
            this.userCharmCur.string = curPlayerData.charm;
        if(curPlayerData.dayCharm < 0)
            this.userCharmAdd.string = "今日"+curPlayerData.dayCharm;
        else
            this.userCharmAdd.string = "今日+"+curPlayerData.dayCharm;
    },

    updateData:function(data){
        console.log("other data === ");
        console.log(data);
        var curPlayerData = data.playerInfo;
        if(confige.meWXHeadFrame != -1)
        {
            confige.getWXHearFrameNoSave(curPlayerData.head,this.userHead);
        }
        this.userGold.string = curPlayerData.gold;
        // this.userDiamond.string = curPlayerData.diamond;
        this.userSign.string = curPlayerData.signature;
        this.userNick.string = curPlayerData.nickname;
        if(curPlayerData.charm <0 )
            this.userCharmCur.string = ";"+curPlayerData.charm;
        else
            this.userCharmCur.string = curPlayerData.charm;
        if(curPlayerData.refreshList.charmValue < 0)
            this.userCharmAdd.string = "今日"+curPlayerData.refreshList.charmValue;
        else
            this.userCharmAdd.string = "今日+"+curPlayerData.refreshList.charmValue;
    },

    hideLayer:function(){
        this.node.active = false;
    },
});