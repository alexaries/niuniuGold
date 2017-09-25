var tipsData = require("tips");
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
        this.isInit = true;
    },

    onBtnClickByIndex:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 0)  //create
        {
            
        }else if(index == 1){    //join
            
        }
    },


    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
    },
});
