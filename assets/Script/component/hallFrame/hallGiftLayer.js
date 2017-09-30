var confige = require("confige");
var give = require("give");
var tipsConf = require("tips").tipsConf;
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

    onInit:function(){
        this.goldLabel = this.node.getChildByName("goldNode").getChildByName("score").getComponent("cc.Label");
        this.uidLabel = this.node.getChildByName("uidNode").getChildByName("label").getComponent("cc.EditBox");
        this.nickLabel = this.node.getChildByName("nickNode").getChildByName("label").getComponent("cc.Label");
        this.sendNumLabel = this.node.getChildByName("sendNumNode").getChildByName("label").getComponent("cc.EditBox");
        this.sendCostLabel = this.node.getChildByName("sendCostNode").getChildByName("label").getComponent("cc.Label");
        this.btnSendGift = this.node.getChildByName("btnSendGift").getComponent("cc.Button");
        this.resetData();

        this.isInit = true;
    },

    selectGift:function(event, customEventData){
        var index = parseInt(customEventData);
        this.selectID = index;
        this.sendNumLabel.string = 1;
        this.sendCostLabel.string = parseInt(this.sendNumLabel.string) * give[this.selectID].gold;
    },

    showLayer:function(curFindID){
        if(this.isInit == false)
            this.onInit();
        this.goldLabel.string = confige.curGold;
        this.node.active = true;

        if(curFindID)
        {   
            var self = this;
            self.uidLabel.string = curFindID;
            pomelo.request("monitor.handle.queryNickName", {uid : parseInt(self.uidLabel.string)}, function(data) {
                console.log(data);
                if(data.flag == false)
                {
                    console.log("查询失败！！！");
                    self.nickLabel.string = "";
                    self.btnSendGift.interactable = false;
                }else{
                    console.log("查询成功！！！");
                    self.targetID = parseInt(self.uidLabel.string);
                    self.nickLabel.string = data;
                    self.btnSendGift.interactable = true;
                }
            });   
        }
    },

    hideLayer:function(){
        this.resetData();
        this.node.active = false;
    },

    resetData:function(){
        this.uidLabel.string = "";
        this.nickLabel.string = "";
        this.sendNumLabel.string = "";
        this.sendCostLabel.string = "";

        this.btnSendGift.interactable = false;
        this.selectID = 6;
        this.targetID = 0;
        this.count = 0;
        this.sendNumLabel.string = 1;
        this.sendCostLabel.string = parseInt(this.sendNumLabel.string) * give[this.selectID].gold;
    },

    btnSendListClick:function(){
        var self = this;
        pomelo.request("connector.award.getGiveRecord",null, function(data) {
            console.log(data);
            self.parent.sendListLayer.updateData(data.data);
            self.parent.sendListLayer.showLayer();
        });
    },

    btnSendClick:function(){
        var self = this;
        pomelo.request("connector.award.give",{"giveId" : this.selectID,"targetUid" :this.targetID ,"count" : this.count}, function(data) {
            console.log(data);
            if(data.flag == true){
                self.parent.showTips("赠送成功");
                self.hideLayer();
                self.parent.userInfoLayer.hideLayer();
            }else{
                if(data.code){
                    console.log("code ===== "+ data.code);
                    console.log(tipsConf[data.code]);
                    self.parent.showNewTips(tipsConf[data.code]);
                }
                else
                    self.parent.showNewTips("赠送失败");
            }
        });
    },

    editUidEnd:function(){
        var self = this;
        pomelo.request("monitor.handle.queryNickName", {uid : parseInt(self.uidLabel.string)}, function(data) {
            console.log(data);
            if(data.flag == false)
            {
                console.log("查询失败！！！");
                self.nickLabel.string = "";
                self.btnSendGift.interactable = false;
            }else{
                console.log("查询成功！！！");
                self.targetID = parseInt(self.uidLabel.string);
                self.nickLabel.string = data;
                self.btnSendGift.interactable = true;
            }
        });   
    },

    editNumEnd:function(){
        if(this.sendNumLabel.string <= 0)
            this.sendNumLabel.string = 1;
        this.sendCostLabel.string = parseInt(this.sendNumLabel.string) * give[this.selectID].gold;
        this.count = parseInt(this.sendNumLabel.string);
    },
});
