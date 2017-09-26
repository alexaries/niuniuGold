var goldConf = require("goldConf");
var payConf = require("payConf");
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
        this.diamondNode = this.node.getChildByName("diamondNode");
        this.initDiamondLayer();

        this.goldNode = this.node.getChildByName("goldNode");

        this.isInit = true;
    },

    onBtnDiamondClick:function(event,customEventData){
        var index = parseInt(customEventData);
        this.parent.payLayer.showWithIndex(index);
        // console.log("onBtnDiamondClick===",index);
        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "payTest", "(I)V", index);
    },

    onBtnGoldClick:function(event,customEventData){
        var self = this;
        var index = parseInt(customEventData)+1;
        console.log("onBtnGoldClick===",index);
        pomelo.request("connector.award.buyGold",{"type":index}, function(data) {
            console.log(data);
            if(data.flag == true)
            {   
                console.log("购买成功!!!!!!");
                self.parent.rewardLayer.showShopData(goldConf[index].gold,goldConf[index].give);
            }else{
                console.log("购买失败!!!!!!");
            }
        });
    },

    onBtnMaskClick:function(){
        this.hideLayer();
    },

    initDiamondLayer:function(){
        for(var i=0;i<6;i++)
        {
            this.diamondNode.getChildByName("diamondItem"+i).getChildByName("costNum").getComponent("cc.Label").string = payConf[i].payNum/100;
            this.diamondNode.getChildByName("diamondItem"+i).getChildByName("itemNum").getComponent("cc.Label").string = payConf[i].diamondNum;
        }
    },

    showLayer:function(type){  //0:diamond;1:gold
        if(this.isInit == false)
            this.onInit();
        if(type == 0)
        {
            this.diamondNode.active = true;
            this.goldNode.active = false;
        }else if(type == 1){
            this.diamondNode.active = false;
            this.goldNode.active = true;
        }
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
    },
});
