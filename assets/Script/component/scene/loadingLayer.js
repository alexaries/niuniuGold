cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
    },

    onInit:function(){
        this.tipsLabel = this.node.getChildByName("tips").getComponent("cc.Label");
    },

    showLoading:function(){
        this.node.active = true;
    },

    hideLoading:function(){
        this.node.active = false;
    },

    setLoadingTips:function(tipsString){
        this.tipsLabel.string = tipsString;
    },
});
