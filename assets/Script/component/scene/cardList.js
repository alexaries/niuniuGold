var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        cardItem:{
            default:null,
            type:cc.Node
        },

        handCard0:{
            default:null,
            type:cc.Node
        },

        handCard1:{
            default:null,
            type:cc.Node
        },

        handCard2:{
            default:null,
            type:cc.Node
        },

        handCard3:{
            default:null,
            type:cc.Node
        },

        handCard4:{
            default:null,
            type:cc.Node
        },

        handCard5:{
            default:null,
            type:cc.Node
        },
        
    },

    // use this for initialization
    onLoad: function () {

    },

    onInit:function(){
        this.cardItemList = {};
        this.cardItemCount = 0;
        
        
        
        this.playerActiveList = {};
        this.handCardPosList =  {};
        this.handCardList = {};
        
        this.handCardList[0] = this.handCard0.getComponent("handCards");
        this.handCardList[1] = this.handCard1.getComponent("handCards");
        this.handCardList[2] = this.handCard2.getComponent("handCards");
        this.handCardList[3] = this.handCard3.getComponent("handCards");
        this.handCardList[4] = this.handCard4.getComponent("handCards");
        this.handCardList[5] = this.handCard5.getComponent("handCards");
        if(confige.isGoldMode == true)
        {
            this.mainPlayerScale = 1.5;
            this.otherPlayerScale = 0.75;
            for(var i=0;i<6;i++){
                this.handCardPosList[i] = {};
                this.playerActiveList[i] = false;
                for(var j=0;j<5;j++)
                {
                    switch(i){
                        case 0:
                        this.handCardPosList[i][j] = {x:-250 + j*85*this.mainPlayerScale,y:-259.5};
                        break;
                        case 1:
                        this.handCardPosList[i][j] = {x:314 + j*40*this.otherPlayerScale,y:-20};
                        break;
                        case 2:
                        this.handCardPosList[i][j] = {x:229 + j*40*this.otherPlayerScale,y:166};
                        break;
                        case 3:
                        this.handCardPosList[i][j] = {x:-53 + j*40*this.otherPlayerScale,y:166};
                        break;
                        case 4:
                        this.handCardPosList[i][j] = {x:-335 + j*40*this.otherPlayerScale,y:166};
                        break;
                        case 5:
                        this.handCardPosList[i][j] = {x:-423.3 + j*40*this.otherPlayerScale,y:-20};
                        break;
                    }
                }
            }
        }else{
            this.mainPlayerScale = 1.2;
            this.otherPlayerScale = 0.54;
            for(var i=0;i<6;i++){
                this.handCardPosList[i] = {};
                this.playerActiveList[i] = false;
                for(var j=0;j<5;j++)
                {
                    switch(i){
                        case 0:
                        this.handCardPosList[i][j] = {x:-190 + j*80*this.mainPlayerScale,y:-265};
                        break;
                        case 1:
                        this.handCardPosList[i][j] = {x:414 + j*40*this.otherPlayerScale,y:12.2};
                        break;
                        case 2:
                        this.handCardPosList[i][j] = {x:290 + j*40*this.otherPlayerScale,y:180};
                        break;
                        case 3:
                        this.handCardPosList[i][j] = {x:-44 + j*40*this.otherPlayerScale,y:180};
                        break;
                        case 4:
                        this.handCardPosList[i][j] = {x:-378 + j*40*this.otherPlayerScale,y:180};
                        break;
                        case 5:
                        this.handCardPosList[i][j] = {x:-500 + j*40*this.otherPlayerScale,y:12.2};
                        break;
                    }
                }
            }
        }
        
        this.disRoundCount = 0;
    },

    resetCardList:function(){
        for(var i=0;i<6;i++){
            this.playerActiveList[i] = false;
        }
        for(var i=0;i<this.cardItemCount;i++)
            this.cardItemList[i].destroy();
        this.cardItemCount = 0;
        this.disRoundCount = 0;
    },

    activePlayer:function(index){
        this.playerActiveList[index] = true;
    },

    deActivePlayer:function(index){
        console.log("deActivePlayer"+index);
        this.playerActiveList[index] = false;
    },

    disCardOneRound:function(){
        console.log("@@@@cardList->disCardOneRound()");
        var disCount = 0;
        var disMax = 6;
        this.disRoundCount ++;
        var curRoundCount = this.disRoundCount - 1;
        var callBack = function(){
            if(this.playerActiveList[disCount] == true)
            {
                var newCardItem = cc.instantiate(this.cardItem);
                this.node.addChild(newCardItem);
                newCardItem.active = true;
                newCardItem.x = -545;
                newCardItem.y = 190;
                this.cardItemList[this.cardItemCount] = newCardItem;
                this.cardItemCount ++;
                
                var action1 = cc.moveTo(0.2, cc.p(this.handCardPosList[disCount][curRoundCount].x, this.handCardPosList[disCount][curRoundCount].y));
                var scaleNum = 1;
                if(disCount == 0)
                    scaleNum = this.mainPlayerScale;
                else
                    scaleNum = this.otherPlayerScale;
                var action2 = cc.scaleTo(0.2,scaleNum);
                var self = this
                var action3 = (function(disCount,curRoundCount,self) {
                   return cc.callFunc(function () {
                    newCardItem.active = false;
                    self.handCardList[disCount].showCardBackWithIndex(curRoundCount);
                }, self)
                })(disCount,curRoundCount,self)

                newCardItem.runAction(cc.sequence(cc.spawn(action1,action2), cc.delayTime(0.1),action3));
            }            
            disCount ++;
            if(disCount == 6)
            {
                this.unschedule(callBack);
            }
        };

        this.schedule(callBack,0.03);
    },

    disCardWithRoundTime:function(rountTime){
        console.log("@@@@cardList->disCardWithRoundTime()"+rountTime);
        var callTime = 0;
        var callMax = rountTime;
        var callBack2 = function(){
            this.disCardOneRound();
            callTime ++;
            if(callTime == callMax)
                this.unschedule(callBack2);
        };
        this.schedule(callBack2,0.05);
    },

});
