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

    onInit:function(){
        this.activityCount = 2;
        this.activityBtnList = {};
        this.activityBtnListNode = this.node.getChildByName("activityBtnList");
        this.activityViewList = {};
        this.activityViewListNode = this.node.getChildByName("activityViewList");
        for(var i=0;i<this.activityCount;i++)
        {
            this.activityBtnList[i] = this.activityBtnListNode.getChildByName("btn"+i);
            this.activityViewList[i] = this.activityViewListNode.getChildByName("view"+i);
        }
        console.log(this.activityBtnList);
        console.log(this.activityViewList);
        this.curShowIndex = 0;
        this.isInit = true;
    },
    
    activityBtnClick:function(event, customEventData){
        var index = parseInt(customEventData);
        console.log("index@@@@@@@====",index);
        if(index == this.curShowIndex)
            return;
        this.activityBtnList[this.curShowIndex].getChildByName("activityBtn0").active = true;
        this.activityBtnList[this.curShowIndex].getChildByName("activityBtn1").active = false;
        this.activityBtnList[this.curShowIndex].getChildByName("title").color = new cc.Color(255,255,255);
        this.activityViewList[this.curShowIndex].active = false;

        this.activityBtnList[index].getChildByName("activityBtn0").active = false;
        this.activityBtnList[index].getChildByName("activityBtn1").active = true;
        this.activityBtnList[index].getChildByName("title").color = new cc.Color(0,0,0);
        this.activityViewList[index].active = true;
        this.curShowIndex = index;
    },

    activityViewClick:function(event, customEventData){
        var self = this;
        var index = parseInt(customEventData);
        switch(index)
        {
            case 0:
                this.hideLayer();
                this.parent.rotaryLayer.showLayer();
                console.log("前往转盘");
                break;
            case 1:
                console.log("获取分享奖励");
                pomelo.request("connector.award.shareAward",null, function(data) {
                    console.log(data);
                    if(data.flag == true)
                    {   
                        self.parent.rewardLayer.showShareAward(data.award,data.value);
                        confige.activityActive[1] = false;
                        self.activityViewList[1].getChildByName("btn").getComponent("cc.Button").interactable = false;
                        console.log("分享奖励测试1111!!!!!!");
                    }else{
                        console.log("分享奖励测试2222!!!!!!");
                    }
                });
                break;
        }
    },

    checkActivityStatu:function(){
        for(var i=0;i<this.activityCount;i++)
        {
            if(confige.activityActive[i] == true)
                this.activityViewList[i].getChildByName("btn").getComponent("cc.Button").interactable = true;
            else
                this.activityViewList[i].getChildByName("btn").getComponent("cc.Button").interactable = false;
            if(i == 0)
            {
                this.activityViewList[i].getChildByName("btn").active = false;
                this.activityViewList[i].getChildByName("tips2").active = true;
            }

        }
    },

    resetData:function(){
    
    },

    showLayer:function(index){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
        if(index)
            this.activityBtnClick(-1,index);
        this.checkActivityStatu();
    },

    hideLayer:function(){
        this.node.active = false;
    },
});