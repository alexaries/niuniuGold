var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad : function () {
        // this.cardFrameMap = {};
        // this.cardBackFrame = null;
        // this.isPlayer = false;
        // this.canMove = true;
        // this.cards = new Array(5);
        // this.cardsNum = new Array(5);
        // this.cards[0] = this.node.getChildByName("Card1")
        // this.cards[1] = this.node.getChildByName("Card2")
        // this.cards[2] = this.node.getChildByName("Card3")
        // this.cards[3] = this.node.getChildByName("Card4")
        // this.cards[4] = this.node.getChildByName("Card5")
        // this.cardsNum[0] = this.cardsNum[1] = this.cardsNum[2] = this.cardsNum[3] = this.cardsNum[4] = this.cardsNum[5] = 0;
        

        // this.cardsBack = new Array(5);
        // this.cardBackNode = this.node.getChildByName("CardBack");
        // this.cardsBack[0] = this.cardBackNode.getChildByName("Card1")
        // this.cardsBack[1] = this.cardBackNode.getChildByName("Card2")
        // this.cardsBack[2] = this.cardBackNode.getChildByName("Card3")
        // this.cardsBack[3] = this.cardBackNode.getChildByName("Card4")
        // this.cardsBack[4] = this.cardBackNode.getChildByName("Card5")
        
        // for(var i=0;i<5;i++)
        // {
        //     this.cards[i].opacity = 0;
        //     this.cardsBack[i].opacity = 0;
        //     this.cards[i].scaleX = 0;
        //     this.cardsBack[i].scaleX = 1;
        // }
        
        // this.cardMoveList1 = {};
        // this.cardMoveList1[0] = {x:55,y:26};
        // this.cardMoveList1[1] = {x:120,y:26};
        // this.cardMoveList1[2] = {x:15,y:-26};
        // this.cardMoveList1[3] = {x:90,y:-26};
        // this.cardMoveList1[4] = {x:165,y:-26};
        // this.cardMoveList2 = {};
        // this.cardMoveList2[0] = {x:-32,y:167};
        // this.cardMoveList2[1] = {x:32,y:167};
        // this.cardMoveList2[2] = {x:-76,y:115};
        // this.cardMoveList2[3] = {x:0,y:115};
        // this.cardMoveList2[4] = {x:76,y:115};
    },

    onInit : function () {
        this.cardFrameMap = {};
        this.cardBackFrame = null;
        this.isPlayer = false;
        this.canMove = true;
        this.cards = new Array(5);
        this.cardsNum = new Array(5);
        this.cards[0] = this.node.getChildByName("Card1")
        this.cards[1] = this.node.getChildByName("Card2")
        this.cards[2] = this.node.getChildByName("Card3")
        this.cards[3] = this.node.getChildByName("Card4")
        this.cards[4] = this.node.getChildByName("Card5")
        this.cardsNum[0] = this.cardsNum[1] = this.cardsNum[2] = this.cardsNum[3] = this.cardsNum[4] = this.cardsNum[5] = 0;
        

        this.cardsBack = new Array(5);
        this.cardBackNode = this.node.getChildByName("CardBack");
        this.cardBackNode.zIndex = 10;
        this.cardsBack[0] = this.cardBackNode.getChildByName("Card1")
        this.cardsBack[1] = this.cardBackNode.getChildByName("Card2")
        this.cardsBack[2] = this.cardBackNode.getChildByName("Card3")
        this.cardsBack[3] = this.cardBackNode.getChildByName("Card4")
        this.cardsBack[4] = this.cardBackNode.getChildByName("Card5")
        
        for(var i=0;i<5;i++)
        {
            this.cards[i].opacity = 0;
            this.cardsBack[i].opacity = 0;
            this.cards[i].scaleX = 0;
            this.cardsBack[i].scaleX = 1;
        }
        
        this.cardMoveList1 = {};
        this.cardMoveList1[0] = {x:55,y:26};
        this.cardMoveList1[1] = {x:120,y:26};
        this.cardMoveList1[2] = {x:15,y:-26};
        this.cardMoveList1[3] = {x:90,y:-26};
        this.cardMoveList1[4] = {x:165,y:-26};
        this.cardMoveList2 = {};
        this.cardMoveList2[0] = {x:-32,y:167};
        this.cardMoveList2[1] = {x:32,y:167};
        this.cardMoveList2[2] = {x:-76,y:115};
        this.cardMoveList2[3] = {x:0,y:115};
        this.cardMoveList2[4] = {x:76,y:115};
    },

    initCardWithBack : function(){
        for(var i=0;i<5;i++)
        {
            this.cardsBack[i].opacity = 255;
        }
    },
    
    setCardWithIndex : function(index, num, type){
        this.cards[index].opacity = 255;
        var curCardIndex = num + type*13;
        this.cards[index].getComponent("cc.Sprite").spriteFrame = confige.cardFrameMap[curCardIndex];
        var action2 = cc.callFunc(function() {
            var action3 = cc.scaleTo(0.2,1,1);
            this.cards[index].runAction(action3);
        }, this, 100);
        var action1 = cc.scaleTo(0.2,0,1);
        this.cardsBack[index].runAction(cc.sequence(action1,action2));
    },
    
    resetCard:function(){
        for(var i=0;i<5;i++)
        {
            this.cards[i].opacity = 0;
            this.cardsBack[i].opacity = 0;
            this.cards[i].scaleX = 0;
            this.cardsBack[i].scaleX = 1;
        }
        this.cardMoveReset();
    },

    showCardBackWithIndex:function(index){
        this.cardsBack[index].opacity = 255;
    },

    showCardBackWithCount:function(count){
        for(var i=0;i<count;i++)
            this.cardsBack[i].opacity = 255;
    },

    cardMove:function(combArray){
        if(this.canMove == false)
            return;
        this.canMove = false;
        console.log(combArray);
        if(this.isPlayer)
            this.node.runAction(cc.scaleTo(0.4,0.75));
        for(var i=0;i<5;i++)
        {
            this.cards[i].zIndex = i;
            if(this.isPlayer)
            {
                // this.cards[combArray[i]].runAction(cc.moveTo(0.4,this.cardMoveList2[4-i].x,this.cardMoveList2[4-i].y));
                // this.cards[combArray[i]].zIndex = 4-i;
                this.cards[combArray[i]].runAction(cc.sequence(cc.moveTo(0.3,this.cardMoveList2[3].x,this.cardMoveList2[3].y),
                    cc.callFunc(function(target,index){
                        this.cards[combArray[index]].zIndex = 4-index;
                    },this,i),cc.delayTime(0.2),
                    cc.moveTo(0.3,this.cardMoveList2[4-i].x,this.cardMoveList2[4-i].y)));
            }else{
                // this.cards[combArray[i]].runAction(cc.moveTo(0.4,this.cardMoveList1[4-i].x,this.cardMoveList1[4-i].y));
                // this.cards[combArray[i]].zIndex = 4-i;
                this.cards[combArray[i]].runAction(cc.sequence(cc.moveTo(0.3,this.cardMoveList1[3].x,this.cardMoveList1[3].y),
                    cc.callFunc(function(target,index){
                        this.cards[combArray[index]].zIndex = 4-index;
                    },this,i),cc.delayTime(0.2),
                    cc.moveTo(0.3,this.cardMoveList1[4-i].x,this.cardMoveList1[4-i].y)));
            }
        }
    },

    cardMovePlayer:function(){
        if(this.canMove == false)
            return;
        this.canMove = false;
        this.node.runAction(cc.spawn(cc.scaleTo(0.4,0.75),cc.moveTo(0.4,5,130)));
    },

    cardMoveReset:function(){
        for(var i=0;i<5;i++)
        {
            this.cards[i].zIndex = i;
            if(this.isPlayer)
            {
                this.cards[i].x = -170 + 85*i;
                this.cards[i].y = 0;
                console.log("fuck111111111@@@@@@@!!!!!!!!!!")
            }else{
                this.cards[i].x = 40*i;
                this.cards[i].y = 0;
                console.log("fuck222222@@@@@@@!!!!!!!!!!")
            }
        }
        this.canMove = true;
    },
});
