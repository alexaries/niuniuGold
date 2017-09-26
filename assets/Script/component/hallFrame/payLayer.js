var payConf = require("payConf");
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
        this.itemDes = this.node.getChildByName("itemDes").getComponent("cc.Label");    //钻石 X96
        this.itemCost = this.node.getChildByName("itemCost").getComponent("cc.Label");  //¥ 20.00
        this.curPayNum = 0;
        this.curDiamondNum = 0;

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "payInit", "()V");

        this.isInit = true;
    },


    payTypeClick:function(event, customEventData){
        var index = parseInt(customEventData);
        

        // if(index == 1)
        // {
        //     //WX
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "payTypeClick");
        //     // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "payTest", "(II)V",this.curPayNum,this.curDiamondNum);
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "payTest", "(II)V",this.curPayNum,this.curDiamondNum);
        // }else if(index == 2){
        //     //AL
        // }else if(index == 3){
        //     //QQ
        // }

        this.getPayOrder(index);
    },

    btnCloseClick:function(){
        this.itemDes.string = "";
        this.itemCost.string = "";
        this.hideLayer();
    },

    showWithIndex:function(index){
        this.curDiamondNum = payConf[index].diamondNum;
        this.curPayNum = payConf[index].payNum;
        this.itemDes.string = "钻石 X" + payConf[index].diamondNum;
        if(payConf[index].payNum%100 == 0)
            this.itemCost.string = "¥ " + (payConf[index].payNum/100) + ".00";
        else
            this.itemCost.string = "¥ " + (payConf[index].payNum/100);
        
        this.showLayer();
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
    },

    createXMLHttpRequest:function() {  
        var xmlHttp;  
        if (window.XMLHttpRequest) {  
            xmlHttp = new XMLHttpRequest();  
            if (xmlHttp.overrideMimeType)  
                xmlHttp.overrideMimeType('text/xml');  
        } else if (window.ActiveXObject) {  
            try {  
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
            } catch (e) {  
                try {  
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
                } catch (e) {  
                }  
            }  
        } 
        return xmlHttp;  
    },

    getPayOrder:function(curPayType){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();
        var game_uid = confige.userInfo.uid;
        var amount = self.curPayNum; 
        var httpCallback = function(){
            var curReturn = JSON.parse(xmlHttp.responseText);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", JSON.stringify(curReturn));
            if(curReturn.code == 1){
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "payWithType", "(IIILjava/lang/String;)V",curPayType,self.curPayNum,self.curDiamondNum,curReturn.order_id);
            }
        };

        var url = "http://pay.5d8d.com/gold_admin.php/api/getOrderInfo?game_uid=GAME_UID&amount=AMOUNT"
        url = url.replace("GAME_UID", game_uid);
        url = url.replace("AMOUNT", amount);
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", url);
            
        xmlHttp.onreadystatechange = httpCallback;
        xmlHttp.open("GET", url, true);// 异步处理返回   
        xmlHttp.setRequestHeader("Content-Type",  
            "application/x-www-form-urlencoded;");  
        xmlHttp.send();
    },
});
