cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {

    },
    
    onInit: function(){
        this.name = this.node.getChildByName("name").getComponent("cc.Label");
        this.type = this.node.getChildByName("type").getComponent("cc.Sprite");
        this.scoreWNode = this.node.getChildByName("winscore");
        this.scoreLNode = this.node.getChildByName("losescore");
        this.scoreW = this.node.getChildByName("winscore").getComponent("cc.Label");
        this.scoreL = this.node.getChildByName("losescore").getComponent("cc.Label");
        this.bgW = this.node.getChildByName("winBg").getComponent("cc.Label");
        this.bgL = this.node.getChildByName("loseBg").getComponent("cc.Label");
        this.bgWNode = this.node.getChildByName("winBg");
        this.bgLNode = this.node.getChildByName("loseBg");
        this.banker = this.node.getChildByName("banker");
        this.banker.active = false;
    },
    
    setSettle: function(name, type, score){
        this.name.string = name;
        var curScore = score;
        if(parseInt(score) < 0)
        {
            this.scoreWNode.active = false;
            this.bgWNode.active = false;
            this.scoreL.string = "." + score;
        }else{
            this.scoreLNode.active = false;
            this.bgLNode.active = false;
            this.scoreW.string = "/" + score;
        }
    },
    
    getTypeFrame:function(){
        return this.type;
    }
});
