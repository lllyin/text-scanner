/*
* author:廖伦灵
* 时间：2017/11/22 23：32
* */
var config = {
    canvasX:10,
    canvasY:330,
    canvasWidth:350,
    canvasHeight:50,
    scanX:0,
    scanY:0,
    scanWidth:350,
    scanHeight:50
}

lyin = {
    init:function () {
        this.ndCanvas = document.createElement("canvas");
        document.body.appendChild(this.ndCanvas);
        this.ndCanvas.width = config.canvasWidth || ndPicWidth;
        this.ndCanvas.height =  config.canvasHeight || ndPicHeight;
        this.ndCanvas.style.position = "absolute";
        this.ndCanvas.style.border = "1px solid"
        this.ndCanvas.style.left = config.canvasX;
        this.ndCanvas.style.top = config.canvasY;
        this.context = this.ndCanvas.getContext("2d");

    },
    scanText:function(picObj,context){
        var picSrc; //图片地址
        if(picObj.nodeType === 1){
            picSrc = picObj.src;
        }else{
            throw "您需要传入一个图片的DOM节点";
        }

        var imgTemp = new Image;
        imgTemp.src = picSrc;
        imgTemp.onload = function () {
            this.scan(picObj,config.scanX,config.scanY,config.scanWidth,config.scanHeight);
        }.bind(this)
    },
    //扫描，的起点坐标，长宽
    scan:function (picObj,x,y,width,height) {
        this.context.clearRect(0,0,width,height)
        this.context.drawImage(picObj,x,y,width,height,0,0,config.canvasWidth,config.canvasHeight);
        //获取场景像素数据
        var imageData = this.context.getImageData(0,0,config.canvasWidth,config.canvasHeight);
        var colorData = imageData.data;
        // console.log(colorData);
        for(var i = 0,len = colorData.length;i<len;i+=4){
            // if(colorData[i]<200){
            //     console.log(i,colorData[i]);
            //     // colorData[i] = 255;
            // }
            if(colorData[i] < 200){
                colorData[i] = 255 //R
            }
            if(colorData[i+1] < 200){
                colorData[i+1] = 0 //G
            }
            if(colorData[i+2] < 200){
                colorData[i+2] = 0 //B
            }
            //     data[i]     = 225 - data[i];     // red
            //     data[i + 1] = 225 - data[i + 1]; // green
            // data[i + 2] = 225 - data[i + 2]; // blue
        }
        this.context.putImageData(imageData,0,0)
    },
    //move scan point
    moveScanPoint:function(x,y){
        config.scanX = x;
        config.scanY = y;
    },
    //change scan size
    changeScanSize:function(width,height){
        config.scanWidth = width;
        config.scanHeight = height;
    },
    //move canvas point
    moveCanvasPoint:function(x,y){
        config.canvasX = x;
        config.canvasY = y;
    },
    // change canvas size
    changeCanvasSize:function(width,height){
        config.canvasWidth = width;
        config.canvasHeight = height;
    }
}


//获取图片
var imgWrap = document.querySelector(".img-wrap");
var ndPic = document.getElementById("scan-pic");
var imgWrapLeft = imgWrap.offsetLeft;
var imgWrapTop = imgWrap.offsetTop;
var ndPicWidth = ndPic.clientWidth;
var ndPicHeight = ndPic.clientHeight;
// console.log(ndPicWidth,ndPicHeight)

//初始化
lyin.init();
lyin.scanText(ndPic);

//生成移动区域
var moveAreaWidth = 350;
var moveAreaHeight = 50;
var ndMoveArea = document.createElement("div");
ndMoveArea.style.width = moveAreaWidth +"px";
ndMoveArea.style.height = moveAreaHeight +"px";
ndMoveArea.setAttribute("class","move-area");
imgWrap.appendChild(ndMoveArea);

imgWrap.addEventListener("mousemove",function (event) {
    var x = event.pageX - imgWrapLeft;
    var y = event.pageY - imgWrapTop;
    // console.log(x,y);
    ndMoveArea.style.left = x - moveAreaWidth/2 +"px";
    ndMoveArea.style.top = y - moveAreaHeight/2 +"px";
})
imgWrap.addEventListener("mouseup",function (event) {
    var x = event.pageX - imgWrapLeft - moveAreaWidth/2>>>0;
    var y = event.pageY - imgWrapTop - moveAreaHeight/2>>>0;
    console.log("确定xy",x,y);
    ndMoveArea.style.left = x  +"px";
    ndMoveArea.style.top = y +"px";
    lyin.moveScanPoint(x,y);
    lyin.scanText(ndPic)
})


