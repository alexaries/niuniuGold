var confige = require("confige");
var signIn = require("signIn");
var gameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },

        isInit:false,
        sceneType:"hall",
    },

    onLoad: function () {
    },

    onInit:function(type){
        if(type == "game")
            this.sceneType = "game";
        this.rotaryNode = this.node.getChildByName("rotaryNode");
        this.rotaryBox = this.rotaryNode.getChildByName("rotaryBox");
        this.lightAni = this.rotaryNode.getChildByName("lightNode").getComponent("cc.Animation");
        this.btnStart = this.rotaryNode.getChildByName("btnStart").getComponent("cc.Button");

        this.rotationTime = 10;
        this.isInit = true;
        this.initSignin();
        if(this.sceneType == "game")
        {
            this.rotationTime = 3;
        }
        
        this.canHide = true;
    },
    
    onBtnStartClick(){
        this.btnStart.interactable = false;
        var self = this;
        if(this.sceneType == "game")
        {
            pomelo.request("connector.entryHandler.sendData", {"code" : "lotto"}, function(data) {
                console.log(data.flag);
                if(data.flag == false)
                {   
                    console.log("已经转过了不能再转了!!!!!!");
                    self.hideLayer();
                }else{
                    cc.sys.localStorage.setItem('canUseRotary',false);
                    self.canHide = false;
                    self.rotationTest(data.flag.index,data.flag.data);
                    console.log("ready to rotate!!!!!!");
                }
            });
        }else{
            pomelo.request("connector.award.dayLotte",null, function(data) {
                console.log(data);
                if(data.flag == true)
                {   
                    cc.sys.localStorage.setItem('canUseRotary',false);
                    confige.activityActive[0] = false;
                    self.canHide = false;
                    self.rotationTest(data.index,data.data);
                    console.log("ready to rotate!!!!!!");
                }else{
                    console.log("已经转过了不能再转了!!!!!!");
                }
            });  
        }
    },

    onMaskClick:function(){
        if(this.canHide)
            this.hideLayer();
    },

    rotationTest:function(index,itemData){
        var self = this;
        // this.rotaryBox.runAction(cc.repeatForever(cc.rotateBy(1,180)));
        var oriR = 5400;
        if(this.sceneType == "game")
            oriR = 1800;
        var endR = oriR + index*45 + (3 + parseInt(Math.random()*39));
        

        var endRotate = cc.rotateBy(this.rotationTime,endR);
        endRotate.easing(cc.easeInOut(3.0));
        this.lightAni.setCurrentTime(0.2);
        // this.rotaryBox.runAction(cc.sequence(cc.rotateBy(3,3600),endRotate));
        this.rotaryBox.runAction(cc.sequence(endRotate,cc.callFunc(function(){
            
            this.scheduleOnce(function() {
                self.hideLayer();
                if(this.sceneType != "game")
                    self.parent.rewardLayer.showRotaryReward(itemData);
                self.lightAni.setCurrentTime(0.7);
            },0.5);
            this.canHide = true;
        }, this)));
    },
    
    resetData:function(){
        this.btnStart.interactable = true;
        this.rotaryBox.rotation = 0;
        this.canHide = true;
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.resetData();
        this.node.active = false;
    },

    initSignin:function(){
        this.signinNode = this.node.getChildByName("signinNode");
        this.signinNum = this.signinNode.getChildByName("signinNum").getComponent("cc.Label");
        this.signinItemList = this.signinNode.getChildByName("signinItemList");
        console.log("confige.userInfo.loginRecord===");
        console.log(confige.userInfo.loginRecord);
        var curLoginDay = confige.userInfo.loginRecord.loginDay;
        this.signinNum.string = curLoginDay;
        this.maxLoginDay = confige.userInfo.loginRecord.loginMax;
        if(this.maxLoginDay >= 2)
            this.signinItemList.getChildByName("signinItem0").getChildByName("signinGet").active = true;
        if(this.maxLoginDay >= 5)
            this.signinItemList.getChildByName("signinItem1").getChildByName("signinGet").active = true;
        if(this.maxLoginDay >= 7)
            this.signinItemList.getChildByName("signinItem2").getChildByName("signinGet").active = true;
        if(this.maxLoginDay >= 10)
            this.signinItemList.getChildByName("signinItem3").getChildByName("signinGet").active = true;
        if(this.maxLoginDay >= 15)
            this.signinItemList.getChildByName("signinItem4").getChildByName("signinGet").active = true;
    },

    checkSignInAward:function(){
        var awardData = confige.signInAward.award;
        this.parent.rewardLayer.showSignIn(awardData.type,awardData.value);
        console.log(awardData);
        this.showLayer();
    },
});