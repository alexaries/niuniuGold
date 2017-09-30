var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },

        billboardItem:{
            default:null,
            type:cc.Node
        },

        ico1:{
            default:null,
            type:cc.SpriteFrame
        },

        ico2:{
            default:null,
            type:cc.SpriteFrame
        },

        ico3:{
            default:null,
            type:cc.SpriteFrame
        },

        headOri:{
            default:null,
            type:cc.SpriteFrame
        },
        isInit:false,
    },

    onLoad: function () {
    },

    onInit:function(){
        this.allGoldRanklistCur = {};
        this.dayGoldRanklistCur = {};
        this.itemBeginY = -45;
        this.itemOffsetY = -90;
        this.itemList1 = {};
        this.itemList2 = {};
        this.itemCount1 = 0;
        this.itemCount2 = 0;

        this.itemView1 = this.node.getChildByName("itemView1");
        this.itemContent1 = this.itemView1.getChildByName("view").getChildByName("content");
        this.itemView2 = this.node.getChildByName("itemView2");
        this.itemContent2 = this.itemView2.getChildByName("view").getChildByName("content");

        this.btnMode1 = this.node.getChildByName("btnMode1").getComponent("cc.Button");
        this.btnMode2 = this.node.getChildByName("btnMode2").getComponent("cc.Button");
        this.modeImg10 = this.node.getChildByName("mode10");
        this.modeImg11 = this.node.getChildByName("mode11");
        this.modeImg20 = this.node.getChildByName("mode20");
        this.modeImg21 = this.node.getChildByName("mode21");
        this.showMode = 1;

        // this.userInfoLayer = this.node.getChildByName("userInfoLayer");
        // this.initUserInfo();
        this.isInit = true;
    },
    
    onBtnClickWithIndex:function(event,customEventData){
        var index = parseInt(customEventData);
        if(index == 1)
        {
            this.showMode = 1;
            this.btnMode1.interactable = false;
            this.btnMode2.interactable = true;
            this.itemView1.active = true;
            this.itemView2.active = false;
            this.modeImg21.active = false;
            this.modeImg11.active = true;
        }else if(index == 2){
            this.showMode = 2;
            this.btnMode1.interactable = true;
            this.btnMode2.interactable = false;
            this.itemView1.active = false;
            this.itemView2.active = true;
            this.modeImg21.active = true;
            this.modeImg11.active = false;
        }else if(index == 101){
            this.hideLayer();
        }
    },

    createItemWithContent1:function(data){
        for(var i in data)
        {
            this.itemCount1++;
            var newItem = cc.instantiate(this.billboardItem);
            this.itemList1[i] = newItem;
            this.itemContent1.addChild(newItem);
            newItem.y = this.itemBeginY + this.itemOffsetY * i;

            var itemHead = newItem.getChildByName("head").getComponent("cc.Sprite");
            var goldNum = newItem.getChildByName("goldNum").getComponent("cc.Label");
            var num = newItem.getChildByName("num").getComponent("cc.Label");
            var nick = newItem.getChildByName("nick").getComponent("cc.Label");
            goldNum.string = data[i].gold;
            nick.string = data[i].nickname;
            num.string = (parseInt(i)+1);
            if(data[i].head != "")
                confige.getWXHearFrameNoSave(data[i].head,itemHead);
            var crownIco = newItem.getChildByName("crownIco");
            var btnShowInfo = newItem.getChildByName("btnShowInfo").getComponent("cc.Button");
            var showCallBack = function(){
                this.showUserInfo(showCallBack.userDataCur);
            };
            btnShowInfo.node.on(cc.Node.EventType.TOUCH_START, showCallBack, this);
            showCallBack.id = i;
            showCallBack.userDataCur = data[i];

            if(parseInt(i) == 0)
            {
                crownIco.getComponent("cc.Sprite").spriteFrame = this.ico1;
                crownIco.active = true;
            }else if(parseInt(i) == 1){
                crownIco.getComponent("cc.Sprite").spriteFrame = this.ico2;
                crownIco.active = true;
            }else if(parseInt(i) == 2){
                crownIco.getComponent("cc.Sprite").spriteFrame = this.ico3;
                crownIco.active = true;
            }
        }
        this.itemContent1.height = 450 + (this.itemCount1 - 5) * 90;
    },

    createItemWithContent2:function(data){
        for(var i in data)
        {
            this.itemCount2++;
            var newItem = cc.instantiate(this.billboardItem);
            this.itemList2[i] = newItem;
            this.itemContent2.addChild(newItem);
            newItem.y = this.itemBeginY + this.itemOffsetY * i;

            var itemHead = newItem.getChildByName("head").getComponent("cc.Sprite");
            var goldNum = newItem.getChildByName("goldNum").getComponent("cc.Label");
            var num = newItem.getChildByName("num").getComponent("cc.Label");
            var nick = newItem.getChildByName("nick").getComponent("cc.Label");
            goldNum.string = data[i].gold;
            nick.string = data[i].nickname;
            num.string = (parseInt(i)+1);
            if(data[i].head != "")
                confige.getWXHearFrameNoSave(data[i].head,itemHead);
            else
                itemHead.spriteFrame = this.headOri;
            var crownIco = newItem.getChildByName("crownIco");
            var btnShowInfo = newItem.getChildByName("btnShowInfo").getComponent("cc.Button");
            var showCallBack = function(){
                this.showUserInfo(showCallBack.userDataCur);
            };
            btnShowInfo.node.on(cc.Node.EventType.TOUCH_START, showCallBack, this);
            showCallBack.id = i;
            showCallBack.userDataCur = data[i];

            if(parseInt(i) == 0)
            {
                crownIco.getComponent("cc.Sprite").spriteFrame = this.ico1;
                crownIco.active = true;
            }else if(parseInt(i) == 1){
                crownIco.getComponent("cc.Sprite").spriteFrame = this.ico2;
                crownIco.active = true;
            }else if(parseInt(i) == 2){
                crownIco.getComponent("cc.Sprite").spriteFrame = this.ico3;
                crownIco.active = true;
            }
        }
        this.itemContent2.height = 450 + (this.itemCount2 - 5) * 90;
    },

    resetContent:function(){
        for(var i in this.itemList1)
        {
            this.itemList1[i].destroy();
        }
        this.itemList1 = {};
        this.itemCount1 = 0;
        for(var i in this.itemList2)
        {
            this.itemList2[i].destroy();
        }
        this.itemList2 = {};
        this.itemCount2 = 0;
    },

    showLayer:function(data){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
        this.dayGoldRanklistCur = data.dayGoldRanklist;
        this.allGoldRanklistCur = data.allGoldRanklist;
        this.createItemWithContent1(this.dayGoldRanklistCur);
        this.createItemWithContent2(this.allGoldRanklistCur);
    },

    hideLayer:function(){
        this.node.active = false;
        this.resetContent();
    },

    showUserInfo:function(userData){
        console.log("userData ==== @@@@@");
        console.log(userData);
        this.parent.otherInfoLayer.updateDataWithBillBoard(userData);
        this.parent.otherInfoLayer.showLayer("other",userData);
        // this.parent.hallGiftLayer.showLayer(userData.uid);
        // if(userData.head != "")
        //     confige.getWXHearFrameNoSave(userData.head,this.userHead);
        // else
        //     this.userHead.spriteFrame = this.headOri;
        // this.userNick.string = userData.nickname;
        // this.userScore.string = userData.gold;
        // if(userData.charm <0 )
        //     this.userCharmCur.string = ";"+userData.charm;
        // else
        //     this.userCharmCur.string = userData.charm;
        // if(userData.dayCharm < 0)
        //     this.userCharmAdd.string = "今日"+userData.dayCharm;
        // else
        //     this.userCharmAdd.string = "今日+"+userData.dayCharm;
        // this.userInfoLayer.active = true;
        // this.selectUid = userData.uid;
    },

    // hideUserInfo:function(){
    //     this.userInfoLayer.active = false;
    // },

    // initUserInfo:function(){
    //     this.userHead = this.userInfoLayer.getChildByName("head").getComponent("cc.Sprite");
    //     this.userNick = this.userInfoLayer.getChildByName("nick").getComponent("cc.Label");
    //     this.userScore = this.userInfoLayer.getChildByName("score").getComponent("cc.Label");
    //     this.userCharmCur = this.userInfoLayer.getChildByName("charmNum").getComponent("cc.Label");
    //     this.userCharmAdd = this.userInfoLayer.getChildByName("charmAdd").getComponent("cc.Label");

    //     this.selectUid = -1;
    // },

    // userInfoClick:function(event,customEventData){
    //     var index = parseInt(customEventData);
    //     if(index >= 1 && index <= 7)
    //     {
    //         console.log("send gift"+index);
    //         var self = this;
    //         pomelo.request("connector.award.give", {"giveId" : index,"targetUid" : this.selectUid}, function(data) {
    //             console.log(data);
    //                 if(data.flag == true)
    //                 {
    //                     console.log("赠送成功@@@@@@@@@");
    //                     self.hideUserInfo();
    //                     self.parent.showNewTips("赠送成功,对方将会收到奖励");
    //                 }else{
    //                     console.log("赠送失败@@@@@@@@@");
    //                     self.hideUserInfo();
    //                     self.parent.showNewTips("赠送失败,请重新选择礼物");
    //                 }
    //             }
    //         );
    //     }
    //     if(index == 0)
    //         this.hideUserInfo();
    // },
});