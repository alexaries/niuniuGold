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

    onInit:function(sceneType){
        this.userID = this.node.getChildByName("playerInfoNode").getChildByName("id").getComponent("cc.Label");
        this.userHead = this.node.getChildByName("playerInfoNode").getChildByName("head").getComponent("cc.Sprite");
        this.userNick = this.node.getChildByName("playerInfoNode").getChildByName("name").getComponent("cc.Label");
        this.userGold = this.node.getChildByName("goldNode").getChildByName("goldNum").getComponent("cc.Label");
        this.userDiamond = this.node.getChildByName("diamondNode").getChildByName("diamondNum").getComponent("cc.Label");
        this.userCharmCur = this.node.getChildByName("charmNode").getChildByName("charmNum").getComponent("cc.Label");
        this.userCharmAdd = this.node.getChildByName("charmAddNode").getChildByName("charmAdd").getComponent("cc.Label");

        this.btnWXLink = this.node.getChildByName("btnWXLink");
        this.wxLinkIco = this.node.getChildByName("wxLinkIco");

        if(confige.meWXHeadFrame != -1)
        {
            this.userHead.spriteFrame = confige.meWXHeadFrame;
        }
        this.userNick.string = confige.userInfo.nickname;
        this.userID.string = confige.userInfo.uid;

        this.sceneType = sceneType;
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

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;

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
    },

    hideLayer:function(){
        this.node.active = false;
    },
});