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
        if(cc.sys.localStorage.getItem('roomInfo') == null)    //首次进入游戏
        {   
            this.curRoomInfo = {
                cardMode : 1,
                gameMode : 1,
                bankerMode : 1,
                consumeMode : 2,
                gameTime : 10,
                playerNum : 4,
                halfwayEnter : true,
                allowAllin : true,
                allowFK : true,
                allowWait : true,
                gameType : "niuniu",
                basicScore : 1
            };
            cc.sys.localStorage.setItem('roomInfo', JSON.stringify(this.curRoomInfo));
        }else{
            this.curRoomInfo = JSON.parse(cc.sys.localStorage.getItem('roomInfo'));
        }

        this.allowJoinCheck = this.node.getChildByName("allowJoin").getChildByName("check_mark");
        this.allowAllinNode = this.node.getChildByName("allowAllin");
        this.allowFKNode = this.node.getChildByName("allowFK");
        this.allowWaitNode = this.node.getChildByName("allowWait");
        this.allowWaitCheck = this.node.getChildByName("allowWait").getChildByName("check_mark");
        this.allowFKCheck = this.node.getChildByName("allowFK").getChildByName("check_mark");
        this.allowAllinCheck = this.allowAllinNode.getChildByName("check_mark");
        this.initCreateRoomLayer();
        this.resumeRoomInfo();
        this.bankerModeBox = this.node.getChildByName("bankerMode");
        this.basicScoreBox = this.node.getChildByName("basicScore");
        this.isInit = true;
    },

    initCreateRoomLayer:function(){
        this.createLayer1 = this.node.getChildByName("childLayer1");
        this.createLayer2 = this.node.getChildByName("childLayer2");
        this.bankerModeNode = this.createLayer1.getChildByName("bankerMode");
        this.playerNumNode = this.createLayer1.getChildByName("playerNum");
        this.expend11 = this.createLayer1.getChildByName("expendMode").getChildByName("expend1").getComponent("cc.Label");
        this.expend12 = this.createLayer1.getChildByName("expendMode").getChildByName("expend2").getComponent("cc.Label");
        this.expend13 = this.createLayer1.getChildByName("expendMode").getChildByName("expend3").getComponent("cc.Label");
        this.expend21 = this.createLayer2.getChildByName("expendMode").getChildByName("expend1").getComponent("cc.Label");
        this.expend22 = this.createLayer2.getChildByName("expendMode").getChildByName("expend2").getComponent("cc.Label");
        this.expend23 = this.createLayer2.getChildByName("expendMode").getChildByName("expend3").getComponent("cc.Label");
        this.btnLight1 = this.node.getChildByName("btn_gameType1").getChildByName("light");
        this.btnLight2 = this.node.getChildByName("btn_gameType2").getChildByName("light");
        this.btnLight3 = this.node.getChildByName("btn_gameType3").getChildByName("light");
        this.btnLight4 = this.node.getChildByName("btn_gameType4").getChildByName("light");
        this.btnLight5 = this.node.getChildByName("btn_gameType5").getChildByName("light");
        this.btnLight6 = this.node.getChildByName("btn_gameType6").getChildByName("light");

        this.resetToggleList = {};
        this.resetToggleList[0] = this.createLayer1.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[1] = this.createLayer1.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[2] = this.createLayer1.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[3] = this.createLayer1.getChildByName("bankerMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[4] = this.createLayer1.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[5] = this.createLayer2.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[6] = this.createLayer2.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[7] = this.createLayer2.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[8] = this.createLayer2.getChildByName("basicScore");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[9] = this.createLayer2.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[10] = this.createLayer2.getChildByName("basicScore2");//.getChildByName("toggle1").getComponent("cc.Toggle");
        this.resetToggleList[11] = this.createLayer2.getChildByName("bankerMode");
        // this.resetCreateRoomData();
        // this.showCreateRoomType(1);
        // this.showRoomExpend();
    },

    resumeRoomInfo:function(){
        this.resetCreateRoomData();
        for(var i in this.resetToggleList)
            this.resetToggleList[i].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;

        this.cardMode = this.curRoomInfo.cardMode;
        this.gameMode = this.curRoomInfo.gameMode;
        this.bankerMode = this.curRoomInfo.bankerMode;
        this.consumeMode = this.curRoomInfo.consumeMode;
        this.gameTime = this.curRoomInfo.gameTime;
        this.playerNum = this.curRoomInfo.playerNum;
        this.diamondExpend = this.curRoomInfo.diamondExpend;
        this.basicScore = this.curRoomInfo.basicScore;
        this.halfwayEnter = this.curRoomInfo.halfwayEnter;
        this.allowAllin  = this.curRoomInfo.allowAllin;

        if(this.curRoomInfo.allowFK == null)
            this.allowFK = true;
        else
            this.allowFK = this.curRoomInfo.allowFK;
        if(this.curRoomInfo.allowWait == null)
            this.allowWait = true;
        else
            this.allowWait = this.curRoomInfo.allowWait;
        console.log(this.curRoomInfo);

        this.gameType = this.curRoomInfo.gameType;
        if(this.gameMode == 1)
            this.showCreateRoomType(1);
        else if(this.gameMode == 3)
            this.showCreateRoomType(3);
        else if(this.gameMode == 4)
            this.showCreateRoomType(2);
        else if(this.gameMode == 100)
            this.showCreateRoomType(4);
        else if(this.gameMode == 101)
            this.showCreateRoomType(5);
        else if(this.gameMode == 6)
            this.showCreateRoomType(6);

        if(this.gameMode == 100 || this.gameMode == 101)
        {
            console.log("cardMode="+this.cardMode + "gameTime="+this.gameTime+"consumeMode="+this.consumeMode);
            console.log("this.bankerMode11111 == "+this.bankerMode+"!!!!!!!!!!!!!!!");
            if(this.cardMode == 1)
                this.resetToggleList[6].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[6].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            
            if(this.gameTime == 10)
                this.resetToggleList[5].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[5].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;

            if(this.consumeMode == 2)
                this.resetToggleList[7].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 1)
                this.resetToggleList[7].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 3)
            {
                console.log("this.consumeMode == 3!!!!!!!!!!!!!!!!!!");
                this.resetToggleList[7].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[7].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[7].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
            }

            if(this.gameMode == 100)
            {
                if(this.basicScore == 1)
                    this.resetToggleList[8].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 2)
                    this.resetToggleList[8].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 3)
                {
                    console.log("this.basicScore == 3!!!!!!!!!!!!!!!!!!");
                    this.resetToggleList[8].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[8].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[8].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
                }
            }else{
                if(this.basicScore == 1)
                    this.resetToggleList[10].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 2)
                    this.resetToggleList[10].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
                else if(this.basicScore == 4)
                {
                    console.log("this.basicScore == 3!!!!!!!!!!!!!!!!!!");
                    this.resetToggleList[10].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[10].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[10].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
                }

                if(this.bankerMode == 1){
                    this.resetToggleList[11].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = true;
                    this.resetToggleList[11].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
                }else if(this.bankerMode == 5){
                    console.log("this.bankerMode1111 == 5!!!!!!!!!!!!!!!")
                    this.resetToggleList[11].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                    this.resetToggleList[11].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = true;
                }
            }
                
        }else{
            console.log("cardMode="+this.cardMode + "gameTime="+this.gameTime+"consumeMode="+this.consumeMode);
            console.log("this.bankerMode == "+this.bankerMode+"!!!!!!!!!!!!!!!");
            if(this.cardMode == 1)
                this.resetToggleList[1].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[1].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            
            if(this.gameTime == 10)
                this.resetToggleList[0].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else
                this.resetToggleList[0].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;

            if(this.consumeMode == 2)
                this.resetToggleList[2].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 1)
                this.resetToggleList[2].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            else if(this.consumeMode == 3){
                this.resetToggleList[2].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[2].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[2].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
            }

            if(this.bankerMode == 1)
                this.resetToggleList[3].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
            else if(this.bankerMode == 2)
                this.resetToggleList[3].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = true;
            else if(this.bankerMode == 3){
                this.resetToggleList[3].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = true;
            }else if(this.bankerMode == 5){
                console.log("this.bankerMode == 5!!!!!!!!!!!!!!!")
                this.resetToggleList[3].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle2").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle3").getComponent("cc.Toggle").isChecked = false;
                this.resetToggleList[3].getChildByName("toggle4").getComponent("cc.Toggle").isChecked = true;
            }
        }
        if(this.halfwayEnter == false)
        {
            this.allowJoinCheck.active = false;
        }
        if(this.allowWait == false)
        {
            this.allowWaitCheck.active = false;
        }
        if(this.allowAllin == false)
            this.allowAllinCheck.active = false;
        if(this.allowFK == false)
            this.allowFKCheck.active = false;
        // this.resetToggleList[0] = this.createLayer1.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[1] = this.createLayer1.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[2] = this.createLayer1.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[3] = this.createLayer1.getChildByName("bankerMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[4] = this.createLayer1.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
        
        // this.resetToggleList[5] = this.createLayer2.getChildByName("gameTime");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[6] = this.createLayer2.getChildByName("mingCardMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[7] = this.createLayer2.getChildByName("expendMode");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[8] = this.createLayer2.getChildByName("basicScore");//.getChildByName("toggle1").getComponent("cc.Toggle");
        // this.resetToggleList[9] = this.createLayer2.getChildByName("playerNum");//.getChildByName("toggle1").getComponent("cc.Toggle");
    },

    saveRoomInfo:function(){
        this.curRoomInfo = {
            cardMode : this.cardMode,
            gameMode : this.gameMode,
            bankerMode : this.bankerMode,
            consumeMode : this.consumeMode,
            gameTime : this.gameTime,
            playerNum : this.playerNum,
            halfwayEnter : this.halfwayEnter,
            allowAllin : this.allowAllin,
            allowFK : this.allowFK,
            allowWait : this.allowWait,
            gameType : this.gameType,
            basicScore : this.basicScore
        };
        cc.sys.localStorage.setItem('roomInfo', JSON.stringify(this.curRoomInfo));
    },

    onBtnCreateRoom:function(event, customEventData){
        var index = parseInt(customEventData);
        // if(this.gameMode > 2 && this.gameMode != 6 && this.gameMode != 101)
            // this.bankerMode = 2;

        var createType = "newRoom";
        if(index == 0){
            console.log("创建房间并成为房主");
            createType = "newRoom";
            var self = this;
            var joinCallFunc = function(){
                self.parent.loadingLayer.showLoading();
            };
            // pomelo.goldJoin();
            pomelo.clientCreateRoom(this.gameMode, this.bankerMode, this.consumeMode, this.gameTime, this.cardMode, this.playerNum, this.gameType, this.basicScore, createType, this.halfwayEnter,this.allowAllin,this.allowFK,this.allowWait,joinCallFunc);
        }else if(index == 1){
            console.log("创建房间但是不加入");
            createType = "agency";
            var self = this;
            var createCallFunc = function(){
                self.parent.onBtnShowLayer(-1,2);
            };
            // pomelo.goldLeave();
            pomelo.clientCreateRoom(this.gameMode, this.bankerMode, this.consumeMode, this.gameTime, this.cardMode, this.playerNum, this.gameType, this.basicScore, createType, this.halfwayEnter,this.allowAllin,this.allowFK,this.allowWait,createCallFunc);
        }
        this.saveRoomInfo();
    },

    resetCreateRoomData:function(){
        //resetData 切换模式时重置
        this.cardMode = 1;
        this.gameMode = 1;
        this.bankerMode = 1;
        this.consumeMode = 2;
        this.gameTime = 10;
        this.playerNum = 4;
        this.diamondExpend = 4;
        this.basicScore = 1;

        for(var i in this.resetToggleList)
            this.resetToggleList[i].getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;

        this.createLayer1.active = false;
        this.createLayer2.active = false;
        this.btnLight1.active = false;
        this.btnLight2.active = false;
        this.btnLight3.active = false;
        this.btnLight4.active = false;
        this.btnLight5.active = false;
        this.btnLight6.active = false;
    },

    showCreateRoomType:function(type){
        this.allowAllinNode.active = false;
        this.allowFKNode.active = false;
        this.resetToggleList[11].active = false;
        if(type == 4)
        {
            this.createLayer2.active = true;
            this.btnLight4.active = true;
            this.resetToggleList[8].active = true;
            this.resetToggleList[10].active = false;
        }else if(type == 5){
            this.createLayer2.active = true;
            this.btnLight5.active = true;
            this.resetToggleList[10].active = true;
            this.resetToggleList[11].active = true;
            this.resetToggleList[8].active = false;
            this.allowAllinNode.active = true;
        }else{
            this.createLayer1.active = true;
            if(type == 1)
            {
                this.bankerModeNode.active = true;
                this.playerNumNode.y = -100;
                this.btnLight1.active = true;
            }else if(type == 6){
                this.bankerModeNode.active = true;
                this.playerNumNode.y = -100;
                this.btnLight6.active = true;
                this.allowFKNode.active = true;
            }else{
                this.bankerModeNode.active = false;
                this.playerNumNode.y = -20;
                if(type == 2)
                {
                    this.btnLight2.active = true;
                }else{
                    this.btnLight3.active = true;
                }
            }
        }
    },

    showRoomExpend:function(){
        var curExpend1 = 0;
        var curExpend2 = 0;
        var curExpend3 = 0;
        curExpend1 = Math.ceil(this.playerNum*this.gameTime/10);
        curExpend2 = Math.ceil(this.gameTime/10);
        curExpend3 = Math.ceil(this.playerNum*this.gameTime/10);

        if(this.gameMode == 100)
        {
            this.expend21.string = "(钻石" + curExpend1 + ")";
            this.expend22.string = "(钻石" + curExpend2 + ")";
            this.expend23.string = "(钻石" + curExpend3 + ")";
        }else{
            this.expend11.string = "(钻石" + curExpend1 + ")";
            this.expend12.string = "(钻石" + curExpend2 + ")";
            this.expend13.string = "(钻石" + curExpend3 + ")";
        }
    },

    onChooseGameMode:function(event, customEventData){
        this.resetCreateRoomData();
        console.log("gameMode" + customEventData);
        this.gameMode = parseInt(customEventData);
        if(this.gameMode == 1)
            this.showCreateRoomType(1);
        else if(this.gameMode == 3)
            this.showCreateRoomType(3);
        else if(this.gameMode == 4)
            this.showCreateRoomType(2);
        else if(this.gameMode == 100)
            this.showCreateRoomType(4);
        else if(this.gameMode == 101)
            this.showCreateRoomType(5);
        else if(this.gameMode == 6)
            this.showCreateRoomType(6);
        this.gameType = "niuniu";
        if(this.gameMode == 100)
        {
            this.gameType = "zhajinniu";
        }else if(this.gameMode == 101){
            this.gameType = "mingpaiqz";
        }else if(this.gameMode == 6){
            this.gameType = "fengkuang";
        }

        this.showRoomExpend();
    },
    
    onChooseBankerMode:function(event, customEventData){
        console.log("banker!!!!!!!!!!" + customEventData);
        this.bankerMode = parseInt(customEventData);
    },
    
    onChooseConsumeMode:function(event, customEventData){
        console.log("consumeMode" + customEventData);
        this.consumeMode = parseInt(customEventData);
        //this.showRoomExpend();
    },
    
    onChooseGameTime:function(event, customEventData){
        console.log("gameTime" + customEventData);
        this.gameTime = parseInt(customEventData);
        this.showRoomExpend();
    },

    onChooseCardMode:function(event, customEventData){
        console.log("cardMode" + customEventData);
        this.cardMode = parseInt(customEventData);
    },

    onChoosePlayerNum:function(event, customEventData){
        console.log("playerNum" + customEventData);
        this.playerNum = parseInt(customEventData);
        this.showRoomExpend();
    },

    onChooseBasicScore:function(event, customEventData){
        console.log("basicScore" + customEventData);
        this.basicScore = parseInt(customEventData);
    },

    btnClickCheckBox:function(){
        if(this.halfwayEnter == true)
        {
            this.halfwayEnter = false;
            this.allowJoinCheck.active = false;
        }else{
            this.halfwayEnter = true;
            this.allowJoinCheck.active = true;
        }
    },

    btnClickCheckBox2:function(){
        if(this.allowAllin == true)
        {
            this.allowAllin = false;
            this.allowAllinCheck.active = false;
        }else{
            this.allowAllin = true;
            this.allowAllinCheck.active = true;
        }
    },

    btnClickCheckBox3:function(){
        if(this.allowFK == true)
        {
            this.allowFK = false;
            this.allowFKCheck.active = false;
        }else{
            this.allowFK = true;
            this.allowFKCheck.active = true;
        }
    },

    btnClickCheckBox4:function(){
        if(this.allowWait == true)
        {
            this.allowWait = false;
            this.allowWaitCheck.active = false;
        }else{
            this.allowWait = true;
            this.allowWaitCheck.active = true;
        }
    },
    
    changeDiamondExpendNum:function(){
        if(this.consumeMode == 2)
            this.diamondExpend = 3*this.gameTime/10;//Math.ceil(this.playerNum*this.gameTime/10;;
        else if(this.consumeMode == 1)
            this.diamondExpend = Math.ceil(this.gameTime/10);
        else if(this.consumeMode == 3)
            this.diamondExpend = 3*this.gameTime/10;//Math.ceil(this.playerNum*this.gameTime/10);
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
