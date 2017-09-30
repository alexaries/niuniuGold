cc.Class({
    extends: cc.Component,

    properties: {
        sendItem:{
            default:null,
            type:cc.Node
        },
        parent:{
            default:null,
            type:cc.Node
        },
        isInit:false,
    },

    onLoad: function () {
        
    },

    onInit:function(){
        this.view1 = this.node.getChildByName("view1");
        this.view2 = this.node.getChildByName("view2");
        this.content1 = this.view1.getChildByName("view").getChildByName("content");
        this.content2 = this.view2.getChildByName("view").getChildByName("content");

        this.view2.active = false;
        this.itemList1 = [];
        this.itemList2 = [];
        this.beginY = 0;
        this.offsetY = -30;

        this.isInit = true;
    },

    changeView:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 1){
            this.view1.active = true;
            this.view2.active = false;
        }
        else if(index == 2){
            this.view1.active = false;
            this.view2.active = true;
        }
    },

    resetData:function(){

    },

    updateData:function(data){
        
        if(data.sendRecord.length > 0)
        {
            var count1 = 0;
            for(var i=data.sendRecord.length-1;i>=0;i--)
            {
                var curData = data.sendRecord[i];
                console.log(curData);
                var newSendItem = cc.instantiate(this.sendItem);
                this.itemList1[count1] = newSendItem;
                this.content1.addChild(newSendItem);
                newSendItem.y = this.beginY + this.offsetY * count1;
                count1++;

                newSendItem.getComponent("cc.Label").string = curData.content;
            }
            this.content1.height = 20 + 30 * (count1+1);
        }

        if(data.receiveRecord.length > 0)
        {
            var count2 = 0;
            for(var i=data.receiveRecord.length-1;i>=0;i--)
            {
                var curData = data.receiveRecord[i];
                console.log(curData);
                var newSendItem = cc.instantiate(this.sendItem);
                this.itemList2[count2] = newSendItem;
                this.content2.addChild(newSendItem);
                newSendItem.y = this.beginY + this.offsetY * count2;
                count2++;

                newSendItem.getComponent("cc.Label").string = curData.content;
            }
            this.content2.height = 50 + 30 * (count2+1);
        }
        
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        for(var i in this.itemList1)
            this.itemList1[i].removeFromParent(true);
        for(var i in this.itemList2)
            this.itemList2[i].removeFromParent(true);
        this.node.active = false;
    },
});
