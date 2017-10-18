var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },
        frameUser:{
            default:null,
            type:cc.SpriteFrame
        },
        frameSys:{
            default:null,
            type:cc.SpriteFrame
        },
        mailItem:{
            default:null,
            type:cc.Node
        },
        frameDiamond:{
            default:null,
            type:cc.SpriteFrame
        },
        frameGold:{
            default:null,
            type:cc.SpriteFrame
        },
        isInit:false,
    },

    onLoad: function () {

    },

    onInit:function(){
        this.canSendState = true;
        console.log("maillayer init @@@@@@@@")
        this.mailViewContent = this.node.getChildByName("mailView").getChildByName("view").getChildByName("content");
        this.mailItemList = [];
        this.getLayer = this.node.getChildByName("getLayer");
        // this.getLayerType = this.getLayer.getChildByName("type").getComponent("cc.Label");
        this.getLayerTitle = this.getLayer.getChildByName("title").getComponent("cc.Label");
        this.getLayerSend = this.getLayer.getChildByName("send").getComponent("cc.Label");
        this.getLayerTime = this.getLayer.getChildByName("time").getComponent("cc.Label");
        this.getDesView = this.getLayer.getChildByName("desView").getComponent("cc.ScrollView");
        this.getDesContent = this.getLayer.getChildByName("desView").getChildByName("view").getChildByName("content");
        this.getDesNode = this.getDesContent.getChildByName("des");
        this.getLayerDes = this.getDesNode.getComponent("cc.Label");
        this.getLayerIcoNode = this.getLayer.getChildByName("mainIco");
        this.getLayerIco = this.getLayer.getChildByName("mainIco").getComponent("cc.Sprite");
        this.getLayerBtn = this.getLayer.getChildByName("btnGetGift");
        this.getLyaerNum = this.getLayer.getChildByName("giftNum").getComponent("cc.Label");
        this.curReadNode = null;
        this.curReadID = null;
        this.beginY = -50;
        this.offsetY = -100;

        this.isInit = true;
    },

    updateData:function(data){
        console.log(data);
        if(data.length <= 0) return;
        confige.curMailData = data;
        var self = this;
        var count = 0;
        for(var i=data.length-1;i>=0;i--)
        {
            var curData = confige.curMailData[i];
            console.log(curData);
            var newMailItem = cc.instantiate(this.mailItem);
            this.mailItemList[count] = newMailItem;
            this.mailViewContent.addChild(newMailItem);
            newMailItem.y = this.beginY + this.offsetY * count;
            count ++;

            var sendNick = newMailItem.getChildByName("nick").getComponent("cc.Label");
            var sendTime = newMailItem.getChildByName("time").getComponent("cc.Label");
            var sendType = newMailItem.getChildByName("type").getComponent("cc.Label");
            var sendIco = newMailItem.getChildByName("mainIco").getComponent("cc.Sprite");
            var getLabelNode = newMailItem.getChildByName("getLabel");
            var getBtnNode = newMailItem.getChildByName("btnGetGift");
            var getBtn = getBtnNode.getComponent("cc.Button");
            var mailMask = newMailItem.getChildByName("mask");
            var getBtn2 = newMailItem.getChildByName("getBtn").getComponent("cc.Button");

            if(curData.affix == false)
                getBtnNode.active = false;

            sendType.string = curData.title;
            sendNick.string = curData.addresser;
            sendTime.string = "发件时间: "+confige.getDateDay(curData.time)+"  "+confige.getDateTime(curData.time);
            if(curData.addresser == "系统管理员")
                sendIco.spriteFrame = this.frameSys;

            var getCallBack = function(){
                console.log("当前邮件信息======");
                console.log(getCallBack.data);
                self.curReadNode = getCallBack.node;
                self.curReadID = getCallBack.id;
                self.showGetlayer(getCallBack.data);
                // self.joinRoom(joinCallBack.id);
            };
            getCallBack.data = confige.curMailData[i];
            getCallBack.node = newMailItem;
            getCallBack.id = i;
            getBtn.node.on(cc.Node.EventType.TOUCH_END, getCallBack, self);
            getBtn2.node.on(cc.Node.EventType.TOUCH_END, getCallBack, self);
            if(curData.gainState == false)
            {
                // getBtnNode.active = true;
            // }else{
                getBtnNode.active = false;
                getLabelNode.active = true;
            }
            if(curData.readState == false)
                mailMask.active = true;
        }
        console.log("height ====== ",(50 + 100 * (count+1)));
        this.mailViewContent.height = 50 + 100 * (count+1);
    },
    
    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.parent.checkMail();
        this.node.active = false;
        for(var i in this.mailItemList)
            this.mailItemList[i].removeFromParent(true);
        this.mailItemList = {};

    },

    hideGetLayer:function(){
        this.getLayer.active = false;
    },

    getLayerBtnClick:function(){
        // for(var i=0;i<10;i++)
            // this.getLayerBtnClick2();
        var self = this;
        if(self.canSendState == false){
            console.log("拦截事件成功")
            return;
        }
        self.canSendState = false;
        pomelo.request("connector.mail.gainAffix",{"mailId" : confige.curMailData[self.curReadID].id}, function(data) {
            console.log("getMail OK");
            console.log(data);
            if(data.flag){
                self.curReadNode.getChildByName("btnGetGift").active = false;
                self.curReadNode.getChildByName("getLabel").active = true;
                confige.curMailData[self.curReadID].gainState = false;
                self.getLayerBtn.active = false;
                self.parent.rewardLayer.showMail(data.affix.value,data.affix.type);
            }
            self.canSendState = true;
        });
    },

    getLayerBtnClick2:function(){
        var self = this;
        if(self.canSendState == false){
            console.log("拦截事件成功")
            return;
        }
        self.canSendState = false;
        pomelo.request("connector.mail.gainAffix",{"mailId" : confige.curMailData[self.curReadID].id}, function(data) {
            console.log("getMail OK");
            console.log(data);
            if(data.flag){
                self.curReadNode.getChildByName("btnGetGift").active = false;
                self.curReadNode.getChildByName("getLabel").active = true;
                confige.curMailData[self.curReadID].gainState = false;
                self.getLayerBtn.active = false;
                self.parent.rewardLayer.showMail(data.affix.value,data.affix.type);
            }
            self.canSendState = true;
        });
    },

    showGetlayer:function(data){
        console.log("showGetlayer@@@@@@@@@");
        console.log(data);
        // if(data.addresser == "系统管理员")
            // this.getLayerIco.spriteFrame = this.frameSys;
        // else
            // this.getLayerIco.spriteFrame = this.frameUser;
        this.getLyaerNum.string = "";
        if(data.gainState == true)
            this.getLayerBtn.active = true;
        else 
            this.getLayerBtn.active = false;
        this.getLayerTitle.string = data.title;
        this.getLayerSend.string = "发件人: " + data.addresser;
        this.getLayerTime.string = "发件时间: " + confige.getDateDay(data.time)+"  "+confige.getDateTime(data.time);
        this.getLayerDes.string = data.content;

        
        var self = this;
        this.scheduleOnce(function() {
            console.log("this.getDesNode.height====="+self.getDesNode.height);
            if(self.getDesNode.height > 290)
            {
                self.getDesContent.height = self.getDesNode.height + 40;
                self.getDesView.vertical = true;
                console.log("1231231231231231");
            }else{
                self.getDesContent.height = 300;
                self.getDesView.vertical = false;
                console.log("222222222222222");
            }
        }, 0.05);
        
        if(confige.curMailData[this.curReadID].affix == false){
            this.getLayerBtn.active = false;
            this.getLayerIcoNode.active = false;
        }else{
            // this.getLayerBtn.active = true;
            this.getLayerIcoNode.active = true;
            if(confige.curMailData[this.curReadID].affix.type == "diamond")
                this.getLayerIco.spriteFrame = this.frameDiamond;
            if(confige.curMailData[this.curReadID].affix.type == "gold")
                this.getLayerIco.spriteFrame = this.frameGold;
            this.getLyaerNum.string = confige.curMailData[this.curReadID].affix.value;

        }
        this.getLayer.active = true;
        confige.curMailData[this.curReadID].readState = false;
        pomelo.request("connector.mail.readMail",{"mailId" : data.id}, function(data) {
            console.log("readMail OK");
        });
        this.curReadNode.getChildByName("mask").active = true;
    },
});
