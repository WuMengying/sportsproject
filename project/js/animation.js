
//1080 design scale 
var designscale = swidth/1080;
//640 design scale 
var sdesignscale = swidth/640;
//渲染动画
function transPos(x){
  return x*sdesignscale;
}
//1080
function dtransPos(x){
  return x*designscale;
}
var renderer = PIXI.autoDetectRenderer(swidth,sheight);
document.getElementById("content").appendChild(renderer.view);
var stage = new PIXI.Container();
//renderer.view.style.border = "0px dashed black";
//renderer.resize(transPos(swidth),transPos(sheight));
renderer.backgroundColor = 0xFFFFFF;
var radius = 5;

function timeline(count,a,b){
  if(count>a&&count<=b)
    return true;
  else
    return false;
}

//scene 1 variable
var btnCfm,btnClr,smalltip,canvas,canvasbg,isProgressing = false,myPersonReady = false,
 	isConfirm = false,djump = false,
 	scene_0_begin = false,
 	scene_0_end = false,
  firstDown = false,
 	count = 0,
 	myPersonTex,myPerson,
  discale = 0.05,
 	activeDrawings = false,
 	moveList = new Array(),
 	disrot = 0.15,direct = 1,timer=0;
circle = new PIXI.Graphics();
circle.zOrder = 1;
stage.addChild(circle);
PIXI.loader
  .add(["images/scene-0-canvas.png","images/canvasbg.jpg","images/confirm-1.png","images/scene-0-redraw.png","images/scene-0-tip-1.png",
    "images/title.png","images/title0.png","images/title1.png",
    "images/title2.png","images/title3.png",
    "images/title4.png","images/title5.png","images/title6.png","images/title7.png",
    "images/title8.png"
  ])//-1,
  .load(setup);

//This `setup` function will run when the image has loaded
function setup() {
    canvasbg = new PIXI.Sprite(PIXI.loader.resources["images/canvasbg.jpg"].texture);
    canvasbg.scale.x = designscale;
    canvasbg.scale.y = designscale;
    canvasbg.alpha = 1;
    canvasbg.zOrder = -2;
    canvasbg.position.x = dtransPos(0);
    canvasbg.position.y = dtransPos(0);
    stage.addChild(canvasbg);
  	canvas = new PIXI.Sprite(PIXI.loader.resources["images/scene-0-canvas.png"].texture);
  	canvas.scale.x = designscale;
  	canvas.scale.y = designscale;
  	canvas.zOrder = -1;
  	canvas.position.x = dtransPos(_canvasx);
	  canvas.position.y = dtransPos(_canvasy);
  	canvas.interactive = true;
  	this.dragging = false;
    canvas.mousedown = canvas.touchstart = function(event){
    		this.dragging = true;
    		if(!firstDown){
          count = 0;
          firstDown = true;
          scene_0_begin = true;
        }
  	};
    var leave = function(data){
        this.dragging = false;
        startpoint = undefined;
    };
	canvas.mouseup = leave;
  canvas.mouseout = leave;
  canvas.mouseupoutside = leave;
  canvas.touchend = leave;
  canvas.touchendoutside  = leave;
  canvas.touchleave = leave;
	canvas.on('mousemove', ondraw).on('touchmove', ondraw);

  stage.addChild(canvas);

  btnCfm = new PIXI.Sprite(PIXI.loader.resources["images/confirm-1.png"].texture);
  btnCfm.zOrder = 3;
  btnCfm.alpha = 0;
  btnCfm.position.x = dtransPos(_confirmx);
	btnCfm.position.y = dtransPos(_confirmy);
	btnCfm.scale.x = sdesignscale;
  btnCfm.scale.y = sdesignscale;
  btnCfm.interactive = true;
  btnCfm.buttonMode = true;
  btnCfm.on('mousedown', onConfirm);
	btnCfm.on('touchstart', onConfirm);
  stage.addChild(btnCfm);

  btnClr = new PIXI.Sprite(PIXI.loader.resources["images/scene-0-redraw.png"].texture);
  btnClr.zOrder = 3;
  btnClr.alpha = 0;
  btnClr.position.x = dtransPos(_clrx);
	btnClr.position.y = dtransPos(_clry);
	btnClr.scale.x = sdesignscale;
  btnClr.scale.y = sdesignscale;
  btnClr.interactive = true;
  btnClr.buttonMode = true;
  btnClr.on('mousedown', onClear);
	btnClr.on('touchstart', onClear);
  stage.addChild(btnClr);

  smalltip = new PIXI.Sprite(PIXI.loader.resources["images/scene-0-tip-1.png"].texture);
  smalltip.zOrder = 3;
  smalltip.alpha = 0;
  smalltip.position.x = transPos(_smallx);
	smalltip.position.y = transPos(_smally);
  smalltip.scale.x = sdesignscale;
  smalltip.scale.y = sdesignscale;
  stage.addChild(smalltip);
  var message = new PIXI.Text("当前人气："+clientCount,hotstyle);
  message.position.set(dtransPos(0),dtransPos(0));
  var msgscal = dtransPos(50)/message.height;
  message.scale.x=message.scale.y = msgscal;
  message.zOrder = 3;
  stage.addChild(message);
}

function onConfirm(){
	isConfirm = true;
	if (circle.height<transPos(_lsize)&&circle.width<transPos(_lsize)){
		smalltip.alpha = 1;
	}else{
		activeDrawings = true;

		var centerX = circle.getLocalBounds().x+circle.width/2,
			centerY = circle.getLocalBounds().y+circle.height/2;

		myPersonTex = circle.generateCanvasTexture();
		myPerson = new PIXI.Sprite(myPersonTex);
		myPerson.position.x = centerX;
		myPerson.position.y = centerY;
		myPerson.anchor.x = 0.5;
		myPerson.anchor.y = 0.5;
		myPerson.zOrder = 1;
  	stage.addChild(myPerson);
  	stage.removeChild(circle); 
    myPersonReady = true;
  	//activeDrawings = true;//make him move
  	//end scene 1
  	count = 0;
  	scene_0_end = true;
		smalltip.alpha = 0;
	}
}

function onClear(){
	circle.clear();
}
function activeDraws(){
	if (activeDrawings){
		timer = (timer+1)%8;
		if (timer!=0) return;
		myPerson.rotation = myPerson.rotation + disrot;
      myPerson.scale.y+=disrot/3;
      myPerson.scale.x+=discale/1;
    discale*=-1;
		if (direct>0){
			direct = 0;
			disrot = -0.15;
		}
		else if (direct==0&&disrot<0){
			direct = -1;			
		}
		else if (direct==0&&disrot>0){
			direct = 1;			
		}
		else if (direct<0){
			direct = 0;	
			disrot = 0.15;		
		}
  }
  else if(myPerson!=null){
    myPerson.rotation = 0;
  }
	if(moveList.length>0){
		var next = moveList.shift();
		myPerson.position.x = next.x;
		myPerson.position.y = next.y;
	}
  if(isProgressing){
    if(pro1.position.x+pro1.width/3>pro2.position.x)
      pro2.position.x+=3;
  }
  if(djump){
    timer = (timer+1)%20;
    if(timer<5)
      myPerson.position.y-=dtransPos(4);
    else if(timer<10&&timer>=5)
      myPerson.position.y+=dtransPos(4);
  }
}

function pauseDraws(v){
  activeDrawings = v;
}

function moveDraws(x,y,steps){
	speed = steps/2;
	var moveX = (x-myPerson.position.x)/steps;
	var moveY = (y-myPerson.position.y)/steps;
	for (var i = 0;i<steps;i++){
		var next = new Object();
		next.x = myPerson.position.x + moveX *i;
		next.y = myPerson.position.y + moveY *i;
		moveList.push(next);
	}
  pauseDraws(true);
}

function dropDraws(speed){
  var moveY = speed;
  var curY = myPerson.position.y;
  while(curY<sheight){
    curY+=moveY;
    var next = new Object();
    next.x = myPerson.position.x;
    next.y = curY;
    moveY+= speed;
    moveList.push(next);
  }
}

function ondraw(event){
	if(this.dragging){
        console.log("drawing...");
        var newPosition = event.data.getLocalPosition(this.parent);
        if(newPosition.x>this.x+this.width||
          newPosition.y>this.y+this.height||
          newPosition.x<this.x||
          newPosition.y<this.y
          ){
          this.dragging = false;
          startpoint = undefined;
        }else
          startDraw(newPosition);
    }
}

//canvas
var startpoint=undefined;

function draw(pos){
  if (startpoint==undefined)
    startpoint = pos;
  circle.lineStyle(dtransPos(penwidth), 0x000000, 1);
  circle.moveTo(startpoint.x, startpoint.y);
  circle.lineTo(pos.x,pos.y);
	circle.endFill();
	stage.addChild(circle);
  startpoint = pos;
}
function startDraw(e) { 
    var x = e.x;
    var y = e.y;
    draw(e);
 };
  
//Scene 1
var scene1,eye,scene1bg,scene1bg0,eyebg,pscalestep,pydiff,
    scene_1_begin=false,
    scene_1_end= false;
PIXI.loader
  .add(["images/scene1.jpg","images/scene1bg1.jpg","images/eye.png","images/who.png","images/click.png"
  ])//-1
  .load(setup1);
function setup1(){
    scene1bg = PIXI.loader.resources["images/scene1.jpg"].texture;
    scene1bg0 = PIXI.loader.resources["images/scene1bg1.jpg"].texture;
    eyebg = PIXI.loader.resources["images/eye.png"].texture;
    scene1 = new PIXI.Sprite(scene1bg0);
    scene1.zOrder = -1;
    scene1.alpha = 0;
    scene1.anchor.x = 0.5;
    scene1.position.x = dtransPos(_inix);
    scene1.position.y = dtransPos(_iniy);
    scene1.scale.x = scene1.scale.y =designscale*4;
    eye = new PIXI.Sprite(eyebg);
    eye.zOrder = 1;
    eye.alpha = 0;
    eye.position.x = dtransPos(0);
    eye.position.y = dtransPos(0);
    eye.scale.x = eye.scale.y =designscale;
}


function scene_0(){
  if(scene_0_begin){
    if (count<10){
      btnCfm.alpha+=0.1;
      btnClr.alpha+=0.1;
      count++;
    }
    else{
      scene_0_begin = false;
      count = 0;
    }
  }
  if(scene_0_end){
    if (count<10){
      btnCfm.alpha-=0.1;
      btnClr.alpha-=0.1;
      canvas.alpha-=0.1;
      count++;
    }else{
      scene_0_end = false;
      count = 0;
      preScene1();
    }
  }
}

function preScene1(){
  stage.removeChild(btnCfm);
  stage.removeChild(btnClr);
  stage.removeChild(canvas);
  stage.removeChild(canvasbg);
  stage.addChild(scene1);
  stage.addChild(eye);
  myPerson.zOrder = 1;
  myPerson.position.x = dtransPos(_mastep0x);
  myPerson.position.y = dtransPos(_mastep0y*4);
  stage.addChild(myPerson);
  //map start point
  pscalestep = (1-(dtransPos(_psize)/myPerson.height))/30;
  pydiff = dtransPos(_mastep0y*3)/30;
  scene_1_begin = true;
}

function scene_1(){
    if(scene_1_begin){
      count++;
      if(count<=10){
        scene1.alpha+=0.1;
      }else if(count==20){
        pauseDraws(false);
      }
      else if(timeline(count,100,130)){//放缩
        myPerson.scale.x = myPerson.scale.y =myPerson.scale.x -pscalestep;
        myPerson.position.y-=  pydiff;
        scene1.scale.x=scene1.scale.x-designscale*0.1;
        scene1.scale.y=scene1.scale.y-designscale*0.1;
      }else if(count==131){
        eye.alpha=1;
        djump = true;
      }else if(count==150){//show question
        scene1.anchor.x = 0;
        scene1.texture = scene1bg0;
        scene1.position.x = dtransPos(0);
        scene1.position.y = dtransPos(0);
        pauseDraws(false);
      }else if(timeline(count,160,170)){//show question
        eye.position.y+=dtransPos(-8);
        eye.position.x+=dtransPos(2);
        if(count==165)
          djump = false;
      }else if(count==172){//move draws
        pauseDraws(false);
        moveDraws(dtransPos(_mastep1x),dtransPos(_mastep1y),10);
      }else if(count==200-1){//move draws
        pauseDraws(false);
      }else if(count>=200&&count<210){//show ans1
        eye.position.y+=dtransPos(4);
        eye.position.x+=dtransPos(-4);
      }else if(count==250){//move draws
        activeDrawings = false;
        moveDraws(dtransPos(_mastep2x),dtransPos(_mastep2y),10);
      }else if(count==300-1){//move draws
        pauseDraws(false);
      }else if(count>=300&&count<310){//show ans2
        eye.position.y+=dtransPos(4);
        eye.position.x+=dtransPos(4);
      }else if(count==310){//move draws
        activeDrawings = false;
        moveDraws(dtransPos(_mastep3x),dtransPos(_mastep3y),10);
      }else if(count>500){
        console.log("end show"+count);
        count=0;
        scene_1_begin = false;
        scene_1_end = true;
      }
    }
    if(scene_1_end){
      count++;
      if(moveList.length>0)
        return;
      else{
        if(timeline(count,0,20)){
          myPerson.scale.x-=0.05;
          myPerson.scale.y-=0.05;
          myPerson.alpha-=0.05;
        }else{
          scene_1_end = false;
          count = 0;
          preScene2();
        }
      }
    }
}

//Scene 2
var phone,finger,before0,before1,before2,before3,after,moment,phonechange,
    scene_2_begin=false,
    scene_2_end= false;
PIXI.loader
  .add(["images/phone.jpg","images/finger.png","images/before0.jpg",
    "images/before1.jpg","images/before2.jpg","images/before3.jpg",
    "images/after.jpg","images/moments-0.png"
  ])//-1
  .load(setup2);
function setup2(){
    after = PIXI.Texture.fromImage("images/after.jpg");
    before0 = new PIXI.Sprite(PIXI.Texture.fromImage("images/before0.jpg"));
    before0.zOrder = 1;
    before0.alpha = 1;
    before0.position.x = dtransPos(0);
    before0.position.y = dtransPos(0);
    before0.scale.x = before0.scale.y =designscale;
    before1 = new PIXI.Sprite(PIXI.Texture.fromImage("images/before1.jpg"));
    before1.zOrder = 1;
    before1.alpha = 1;
    before1.position.x = dtransPos(0);
    before1.position.y = before0.position.y+before0.height;
    before1.scale.x = before1.scale.y =designscale;
    before2 = new PIXI.Sprite(PIXI.Texture.fromImage("images/before2.jpg"));
    before2.zOrder = 1;
    before2.alpha = 1;
    before2.position.x = dtransPos(0);
    before2.position.y = before1.position.y+before0.height;
    before2.scale.x = before2.scale.y =designscale;
    before3 = new PIXI.Sprite(PIXI.Texture.fromImage("images/before3.jpg"));
    before3.zOrder = 1;
    before3.alpha = 1;
    before3.position.x = dtransPos(0);
    before3.position.y = before2.position.y+before1.height;
    before3.scale.x = before3.scale.y =designscale;
    phonechange = designscale-dtransPos(_wechatw)/1080;
    phone = new PIXI.Sprite(PIXI.loader.resources["images/phone.jpg"].texture);
    phone.zOrder = -1;
    phone.alpha = 0;
    phone.anchor.x = phone.anchor.y = 0.5;
    phone.position.x = swidth/2;
    phone.position.y = sheight/2;
    phone.scale.x = phone.scale.y =designscale;
    before0.touchend = before0.mouseup 
    =before1.touchend = before1.mouseup 
    =before2.touchend = before2.mouseup
    =before3.touchend = before3.mouseup  = function(){
      scene_2_begin = true;
    };
    finger = new PIXI.Sprite(PIXI.loader.resources["images/finger.png"].texture);
    finger.zOrder = 1;
    finger.alpha = 0;
    finger.anchor.x = 1;
    finger.anchor.y = 0.5;
    finger.position.x = dtransPos(_fingerx);
    finger.position.y = dtransPos(_fingery);
    finger.scale.x = finger.scale.y =designscale;
    moment = new PIXI.Sprite(PIXI.loader.resources["images/moments-0.png"].texture);
    moment.zOrder = 3;
    moment.alpha = 1;
    moment.anchor.x = 1;
    var whr = moment.height/moment.width;
    moment.scale.y =dtransPos(_momenth)/moment.height;
    moment.width = 0;
    moment.interactive = true;
    moment.touchend = moment.mouseup = function(){
      stage.removeChild(moment);
      stage.removeChild()
      before3.texture = after;
      scene_2_begin = true;
      moveDraws(dtransPos(_endwechatx),dtransPos(_endwechaty)+before3.position.y,10);
      count = 3000-100;
    }
}

function preScene2(){
  stage.removeChild(myPerson);
  stage.removeChild(scene1);
  stage.removeChild(eye);
  stage.addChild(before0);
  stage.addChild(before1);
  stage.addChild(before2);
  stage.addChild(before3);
  stage.addChild(phone);
  stage.addChild(finger);
  stage.addChild(myPerson);
  scene_2_begin = true;
  myPerson.zOrder = 2;
  myPerson.alpha = 1;

  myPerson.scale.x = myPerson.scale.y = dtransPos(_psize)/myPersonTex.height;
  myPerson.position.x = dtransPos(_photox1);
  myPerson.position.y = dtransPos(_photoy1);
}

function scene_2(){
  if(scene_2_begin){
    count++;
    if (timeline(count,0,10)){
      phone.alpha+=0.1;
      finger.alpha+=0.1;
      before0.alpha+=0.1;
    }else if(timeline(count,30,30+30)){//phone bigger
      phone.scale.x+=phonechange/30;
      phone.scale.y+=phonechange/30;
      finger.scale.x-=phonechange/30;
      finger.scale.y-=phonechange/30;
    }else if(count==62){//phone disappear
      stage.removeChild(phone);
      before0.alpha=1;
      before1.alpha=1;
      before2.alpha=1;
      before3.alpha=1;
      before1.position.y = before0.position.y+before0.height;
      activeDrawings = true;
      moveDraws(dtransPos(_photox1),dtransPos(_photoy1+100),10);
      activeDrawings = false;
      scene_2_begin = false;
      before0.interactive = true;
      before1.interactive = true;
    }else if(count==63){
      before0.interactive = false;
      before1.interactive = false;
    }else if(timeline(count,64,74)){//finger slip
      finger.rotation+=0.1;
    }else if(timeline(count,74,114)){//picture slip
      before0.position.y-=dtransPos(680)/40;//170 = 1700/10s
      before1.position.y-=dtransPos(680)/40;//170 = 1700/10s
      before2.position.y-=dtransPos(680)/40;//170 = 1700/10s
    }else if(count==115){//picture slip
      activeDrawings = false;
      finger.rotation=0;
      before3.position.y = before2.position.y+before2.height;
      before0.interactive = true;
      before1.interactive = true;
      before2.interactive = true;
      before3.interactive = true;
      scene_2_begin = false;      
    }else if(count==116){
      before0.interactive = false;
      before1.interactive = false;
      before2.interactive = false;
      before3.interactive = false;
      before3.position.y = before2.position.y+before2.height;
    }else if(timeline(count,116,126)){//finger slip
      finger.rotation+=0.1;
    }else if(timeline(count,126,166)){//picture slip
      before0.position.y-=dtransPos(916)/40;//170 = 1700/10s
      before1.position.y-=dtransPos(916)/40;//170 = 1700/10s
      before2.position.y-=dtransPos(916)/40;//170 = 1700/10s
      before3.position.y-=dtransPos(916)/40;//170 = 1700/10s
    }else if(count==167){//picture slip
      activeDrawings = false;
      before0.interactive = true;
      before1.interactive = true;
      before2.interactive = true;
      before3.interactive = true;
      scene_2_begin = false;      
      finger.rotation=0;
      before3.position.y = before2.position.y+before2.height;
      stage.removeChild(before0);
    }else if(timeline(count,168,178)){//finger slip
      finger.rotation+=0.1;
    }else if(timeline(count,178,218)){//picture slip
      before0.position.y-=dtransPos(729)/40;//170 = 1700/10s
      before1.position.y-=dtransPos(729)/40;//170 = 1700/10s
      before2.position.y-=dtransPos(729)/40;//170 = 1700/10s
      before3.position.y-=dtransPos(729)/40;//170 = 1700/10s
    }else if(count==219){//picture slip
      activeDrawings = true;
      finger.rotation=0;
      moveDraws(dtransPos(_photox1),dtransPos(_photoy1+200),10);
      scene_2_begin = false;
      before1.interactive = true;
      before2.interactive = true;
      before3.interactive = true;
    }else if(count==218){
      before0.interactive = false;
      before1.interactive = false;
      before2.interactive = false;
      before3.interactive = false;
    }else if(timeline(count,219,259)){//finger slip
      finger.rotation+=0.1;
    }else if(timeline(count,259,299)){//picture slip
      activeDrawings = true;
      before1.position.y-=dtransPos(1050)/40;//170 = 1700/10s
      before2.position.y-=dtransPos(1050)/40;//170 = 1700/10s
      before3.position.y-=dtransPos(1050)/40;//170 = 1700/10s
    }else if(count==300){//picture slip
      finger.rotation=0;
      activeDrawings = false;
      stage.removeChild(before1);
      stage.addChild(moment);
      moment.alpha = 1;
      moment.position.x = dtransPos(_momentx);
      moment.position.y = dtransPos(_momenty)+before3.position.y;
    }else if(count==301){//picture slip
      activeDrawings = true;
      myPerson.zOrder = 2;
      var desx = dtransPos(_dmomentx),
      desy = dtransPos(_dmomenty)+before3.position.y;
      moveDraws(desx,desy,10);
    }else if(timeline(count,302,312)){//show moments
      moment.scale.x+=moment.scale.y/10;
    }else if(count==313){//click finish
      activeDrawings = false;
      scene_2_begin = false;
    }else if(count>3000){
      scene_2_begin = false;
      scene_2_end = true;
    }
  }
  if(scene_2_end){
    if (count<10){
      finger.alpha-=0.1;
      before2.alpha-=0.1;
      before3.alpha-=0.1;
      count++;
    }else{
      stage.removeChild(before2);
      stage.removeChild(before3);
      stage.removeChild(finger);
      stage.removeChild(moment);
      stage.removeChild(myPerson);
      scene_2_end = false;
      preScene3();
      count = 0;
    }
  }
}

 //scene 3
var thumap,scene3,intro3,enter3,game3,weightman,btn3,endgame,outGym,clock,
  activeGym = false,
	scene_3_begin = false,
	scene_3_end = false;
PIXI.loader
  .add(["images/map.jpg","images/scene3.jpg","images/intro3.png",
    "images/enter3.png","images/game3.jpg","images/weight.png",
    "images/btn3.png","images/gameover.png","images/continue.png",
    "images/clock.png"
  ])//-1
  .load(setup3);
var clockTex = PIXI.Texture.fromImage("images/clock.png");
clock = new PIXI.Sprite(clockTex);
function setup3(){
    var mapTex = PIXI.loader.resources["images/map.jpg"].texture;
  	thumap = new PIXI.Sprite(mapTex);
  	thumap.zOrder = -1;
  	thumap.alpha = 0;
  	thumap.position.x = dtransPos(0);
	  thumap.position.y = dtransPos(0);
    thumap.scale.x = thumap.scale.y =designscale;

  	scene3 = new PIXI.Sprite(PIXI.loader.resources["images/scene3.jpg"].texture);
  	scene3.zOrder = 2;
  	scene3.alpha = 0;
  	scene3.position.x = dtransPos(0);
	  scene3.position.y = dtransPos(0);
    scene3.scale.x = scene3.scale.y = designscale;

    clock.zOrder = 2;
    clock.alpha = 1;
    clock.anchor.set(0.5);
    clock.position.x = dtransPos(_clockx);
    clock.position.y = dtransPos(_clocky);
    clock.scale.x = clock.scale.y = designscale;

  	intro3 = new PIXI.Sprite(PIXI.loader.resources["images/intro3.png"].texture);
  	intro3.zOrder = 3;
  	intro3.alpha = 0;
  	intro3.position.x = dtransPos(0);
	  intro3.position.y = dtransPos(0);
    intro3.scale.x =designscale;
    intro3.scale.y = designscale;

  	enter3 = new PIXI.Sprite(PIXI.loader.resources["images/enter3.png"].texture);
  	enter3.zOrder = 4;
  	enter3.alpha = 0;
  	enter3.position.x = dtransPos(_enter3x);
	  enter3.position.y = dtransPos(_enter3y);
    enter3.scale.x = designscale;
    enter3.scale.y = designscale;

    enter3.interactive = true;
    enter3.buttonMode = true;
    enter3.on('mousedown', closeGym);
    enter3.on('touchstart', closeGym);

  	game3 = new PIXI.Sprite(PIXI.loader.resources["images/game3.jpg"].texture);
  	game3.zOrder = 2;
  	game3.alpha = 0;
  	game3.position.x = dtransPos(0);
	  game3.position.y = dtransPos(0);
    game3.scale.x = designscale;
    game3.scale.y = designscale;
    game3.interactive = true;
  	game3.mousedown = game3.touchstart = function(event){
        console.log("mouse down");
        if(weightTime>0){//up
          weightup();
        }
  	};

  	game3.mouseup = game3.mouseupoutside = game3.touchend = function(data){
        if(weightTime>0){//down
          weightdown();
          weightTime--;
        }
  	};

    var weightTex = PIXI.loader.resources["images/weight.png"].texture;
  	weightman = new PIXI.Sprite(weightTex);
  	weightman.zOrder = 3;
  	weightman.alpha = 0;
    weightman.anchor.set(0.5);
  	weightman.position.x = dtransPos(_weightmanx);
	  weightman.position.y = dtransPos(_weightmany);
    weightman.scale.x = dtransPos(_weightsize)/weightTex.width;
    weightman.scale.y = dtransPos(_weightsize)/weightTex.width;

  	btn3 = new PIXI.Sprite(PIXI.loader.resources["images/btn3.png"].texture);
  	btn3.zOrder = 3;
  	btn3.alpha = 0;
  	btn3.position.x = dtransPos(_btn3x);
	  btn3.position.y = dtransPos(_btn3y);
    btn3.scale.x = designscale;
    btn3.scale.y = designscale;

    endgame = new PIXI.Sprite(PIXI.loader.resources["images/gameover.png"].texture);
    endgame.zOrder = 3;
    endgame.alpha = 0;
    endgame.position.x = dtransPos(_endgamex);
  	endgame.position.y = dtransPos(_endgamey);
    endgame.scale.x = designscale;
    endgame.scale.y = designscale;

    outGym = new PIXI.Sprite(PIXI.loader.resources["images/continue.png"].texture);
    outGym.zOrder = 3;
    outGym.alpha = 0;
    outGym.position.x = dtransPos(_btn3x);
    outGym.position.y = dtransPos(_btn3y);
    outGym.scale.x = designscale;
    outGym.scale.y = designscale;
    outGym.interactive = true;
    outGym.mousedown = outGym.touchstart = function(event){
      console.log("end weight");
      
      frozenTime(true);
      stage.removeChild(weightman);
      stage.removeChild(game3);
      stage.removeChild(endgame);
      stage.removeChild(outGym);
      myPerson.zOrder = 3;
      myPerson.alpha = 1;
      myPerson.scale.x = myPerson.scale.y = dtransPos(_psize)/myPersonTex.height;
      myPerson.position.x = dtransPos(_mstep2x);
      myPerson.position.y = dtransPos(_mstep2y);
      stage.addChild(myPerson);
      prescene4();
  };
}
//display game
function closeGym(){
  console.log("close gym");
	stage.removeChild(scene3);
	stage.removeChild(intro3);
	stage.removeChild(enter3);
  stage.addChild(game3);
  stage.addChild(weightman);
  stage.addChild(btn3);
  stage.addChild(endgame);
  myPerson.zOrder = 3;
  myPerson.alpha = 1;
  myPerson.scale.x = myPerson.scale.y = dtransPos(_weightsize)/myPersonTex.height;
  myPerson.position.x = dtransPos(_weightmanx);
  myPerson.position.y = dtransPos(_weightmany);
  stage.addChild(myPerson);
	game3.alpha = 1;
	weightman.alpha = 1;
  activeGym = true;
  scene_3_begin = false;
  count = 0;
  frozenTime(false);
}

function weightup(){
  myPerson.scale.y = dtransPos(_weightsize+100)/myPersonTex.height;
  weightman.position.y-=dtransPos(100);
}
function weightdown(){
  myPerson.scale.y = dtransPos(_weightsize)/myPersonTex.height;
  weightman.position.y+=dtransPos(100);
}
function activeGymbtn(){
  if(activeGym){
    if (count<2000&&weightTime!=0){
      if(count%10==0)
        btn3.alpha+=0.1;
      count++; 
    }else{
      count = 0;
      activeGym = false;
    }    
  }
}

function preScene3(){
    stage.removeChild(myPerson);
    stage.addChild(thumap);
    stage.addChild(scene3);
    stage.addChild(intro3);
    stage.addChild(enter3);
    myPerson.zOrder = -1;
    stage.addChild(myPerson);
    //map start point
    moveDraws(dtransPos(_mstep0x),dtransPos(_mstep0y),10);
    scene_3_begin = true;
    count = 0;
}
//0~100 show map
//100~400 move
//500~600 show gym
//600~700 show intrp
function scene_3(){
	if(scene_3_begin){
    count++;
		if (timeline(count,0,100)){
			thumap.alpha+=0.01;
		}else if (count==200){
        moveDraws(dtransPos(_mstep1x),dtransPos(_mstep1y),10);
    }else if(count==300){
      moveDraws(dtransPos(_mstep2x),dtransPos(_mstep2y),10);
    }else if(count==400){
      stage.removeChild(myPerson);
    }else if (timeline(count,400,410)){
      scene3.alpha+=0.1;
		}else if(count==411){
      stage.addChild(myPerson);
      myPerson.position.x = dtransPos(_scene0x);
      myPerson.position.y = dtransPos(_scene0y);
      moveDraws(dtransPos(_scene1x),dtransPos(_scene1y),10);
    }else if (timeline(count,500,600)){
      intro3.alpha+=0.01;
    }else if(count==601){
      pauseDraws(false);
    }else if (timeline(count,602,702-1)){
			enter3.alpha+=0.01;
		}else if(count>800){
      count=0;
      scene_3_begin = false;
    }
	}
  if(weightTime==0){
    if (count<10){
      count++;
      endgame.alpha+=0.1;
      outGym.alpha+=0.1;
    }else if (count>10){
      count=0;
      activeGym = false;
    }else{
      weightTime = -1;
      stage.removeChild(btn3);
      stage.addChild(outGym);
    }
  }
}


//Scene 4 Swim
var scene4,intro4,enter4,btn4,game4,swimman,startswim,endswim,swim1,swim2,
  is_swimming = false,sumswim=0,swap=1,swimspeed = 0,
  scene_4_begin = false,
  scene_4_inside = false,
  scene_4_end = false;
PIXI.loader
  .add(["images/scene4.jpg","images/intro4.png","images/btn4.png",
  "images/game4.jpg","images/swim1.png","images/swim2.png"])//-1
  .load(setup4);
function setup4(){
    swim1 = PIXI.loader.resources["images/swim1.png"].texture;
    swim2 = PIXI.loader.resources["images/swim2.png"].texture;
    scene4 = new PIXI.Sprite(PIXI.loader.resources["images/scene4.jpg"].texture);
    scene4.zOrder = -1;
    scene4.alpha = 0;
    scene4.position.x = dtransPos(0);
    scene4.position.y = dtransPos(0);
    scene4.scale.x = designscale;
    scene4.scale.y = designscale;
    intro4 = new PIXI.Sprite(PIXI.loader.resources["images/intro4.png"].texture);
    intro4.zOrder = -1;
    intro4.alpha = 0;
    intro4.position.x = dtransPos(_intro5x);
    intro4.position.y = dtransPos(_intro5y);
    intro4.scale.x = designscale;
    intro4.scale.y = designscale;

    enter4 = new PIXI.Sprite(PIXI.loader.resources["images/btn4.png"].texture);
    enter4.zOrder = -1;
    enter4.alpha = 0;
    enter4.position.x = dtransPos(_btn5x);
    enter4.position.y = dtransPos(_btn5y);
    enter4.scale.x = designscale;
    enter4.scale.y = designscale;
    enter4.interactive = true;
    enter4.mousedown = enter4.touchstart = function(event){
      console.log("enter ");
      count = 0;
      scene_4_begin = false;
      scene_4_inside = true;
      stage.removeChild(enter4);
      stage.removeChild(scene4);
      stage.removeChild(intro4);
      stage.addChild(game4);
    };

    game4 = new PIXI.Sprite(PIXI.loader.resources["images/game4.jpg"].texture);
    game4.zOrder = -1;
    game4.alpha = 0;
    game4.position.x = dtransPos(0);
    game4.position.y = dtransPos(0);
    game4.scale.x = designscale;
    game4.scale.y = designscale;
    game4.interactive=true;
    game4.mousedown = game4.touchstart = function(event){
      console.log("start swim");
      is_swimming= true;
    };

    game4.mouseup = game4.touchend = function(event){     
      console.log("end swim");   
      is_swimming= false;
      swimspeed = 0;
    };

    swimman = new PIXI.Sprite(swim1);
    swimman.zOrder = -1;
    swimman.alpha = 1;
    swimman.position.x = dtransPos(_swim0x);
    swimman.position.y = dtransPos(_swim0y);
    swimman.scale.x = designscale;
    swimman.scale.y = designscale;

    startswim = new PIXI.Sprite(PIXI.loader.resources["images/btn4.png"].texture);
    startswim.zOrder = -1;
    startswim.alpha = 0;
    startswim.position.x = dtransPos(_btn6x);
    startswim.position.y = dtransPos(_btn6y);
    startswim.scale.x = designscale;
    startswim.scale.y = designscale;
    startswim.interactive = true;
    startswim.mousedown = startswim.touchstart = function(event){
      count = 0;
      stage.removeChild(startswim);
      stage.addChild(swimman);
      scene_4_inside = false;
      scene_4_end = true;
      frozenTime(false);
    };
    endswim = new PIXI.Sprite(PIXI.loader.resources["images/continue.png"].texture);
    endswim.zOrder = 3;
    endswim.alpha = 1;
    endswim.position.x = dtransPos(_btn6x);
    endswim.position.y = dtransPos(_btn6y);
    endswim.scale.x = designscale;
    endswim.scale.y = designscale;
    endswim.interactive = true;
    endswim.mousedown = endswim.touchstart = function(event){
      stage.removeChild(game4);
      stage.removeChild(endswim);
      stage.removeChild(endgame);
      stage.removeChild(swimman);
      myPerson.alpha=1;
      myPerson.position.x = dtransPos(_mstep4x);
      myPerson.position.y = dtransPos(_mstep4y);
      moveDraws(dtransPos(_mstep5x),dtransPos(_mstep5y),10);
      stage.addChild(myPerson);
      prescene5();
  };

} 

function prescene4(){
  stage.addChild(scene4);
  stage.addChild(intro4);
  stage.addChild(enter4);
  count = 0;
  scene_4_begin = true;
}
function scene_4(){
  if(scene_4_begin){
    count++;
    if(count==1){
      moveDraws(dtransPos(_mstep3x),dtransPos(_mstep3y),10);
    }else if(count==200){
      stage.removeChild(myPerson);
    }else if(timeline(count,200,210)){//show bg
      scene4.alpha+=0.1;
    }else if(count==211){//draw to start
      stage.addChild(myPerson);
      myPerson.position.x = dtransPos(_scene0x);
      myPerson.position.y = dtransPos(_scene0y);
      moveDraws(dtransPos(_scene1x),dtransPos(_scene1y),10);
    }else if(timeline(count,310,320)){//show intro
      intro4.alpha+=0.1;
    }else if(count==321){
      pauseDraws(false);
    }else if(timeline(count,410,420)){//show btn
      enter4.alpha+=0.1;
    }else if(count>420){
      pauseDraws(false);
    }
  }
  if(scene_4_inside){
    count++;
    if (count==1){
      stage.removeChild(intro4);
      stage.removeChild(enter4);
      stage.removeChild(myPerson);
      stage.addChild(game4);
      stage.addChild(startswim);
    }else if(timeline(count,1,11)){//show bg
      game4.alpha+=0.1;
      startswim.alpha+=0.1;
    }else if(count>11){
      stage.removeChild(scene4);
      scene_4_inside=false;
    }
  }
  if(scene_4_end){
    if(is_swimming){
      count++;
      if(swimspeed<10)
        swimspeed++;
      sumswim+=swimspeed;
      var q= 8-swimspeed/2;
      game4.position.x-=dtransPos(swimspeed);
      if(count%q==0){
        if (swap==1){
          swimman.texture = swim2;
          swap=2;
        }
        else{
          swimman.texture = swim1;
          swap=1;
        }
      }
      if (sumswim>=_swimtarget) 
      {
        frozenTime(true);
        scene_4_end = false;
        stage.addChild(endswim);
        stage.addChild(endgame);
      }
    }
  }
}

//Scene 5
var scene5,intro5,btn5,game5,outPlay,gameOver = false,
  sumroute = 0,
  scene_5_begin = false,
  scene_5_inside = false,
  scene_5_end = false;
PIXI.loader
  .add(["images/scene5.jpg","images/intro5.png","images/btn5.png",
  "images/game5.jpg"])//-1
  .load(setup5);
function setup5(){
    scene5 = new PIXI.Sprite(PIXI.loader.resources["images/scene5.jpg"].texture);
    scene5.zOrder = -1;
    scene5.alpha = 0;
    scene5.position.x = dtransPos(0);
    scene5.position.y = dtransPos(0);
    scene5.scale.x = designscale;
    scene5.scale.y = designscale;

    intro5 = new PIXI.Sprite(PIXI.loader.resources["images/intro5.png"].texture);
    intro5.zOrder = -1;
    intro5.alpha = 0;
    intro5.position.x = dtransPos(_intro5x);
    intro5.position.y = dtransPos(_intro5y);
    intro5.scale.x = designscale;
    intro5.scale.y = designscale;

    btn5 = new PIXI.Sprite(PIXI.loader.resources["images/btn5.png"].texture);
    btn5.zOrder = -1;
    btn5.alpha = 0;
    btn5.position.x = dtransPos(_btn5x);
    btn5.position.y = dtransPos(_btn5y);
    btn5.scale.x = designscale;
    btn5.scale.y = designscale;
    btn5.interactive = true;
    btn5.mousedown = btn5.touchstart = function(event){
      count = 0;
      scene_5_begin = false;
      scene_5_inside = true;
      stage.removeChild(btn5);
      stage.removeChild(scene5);
      stage.removeChild(intro5);
      stage.addChild(game5);
      frozenTime(false);
    };

    game5 = new PIXI.Sprite(PIXI.loader.resources["images/game5.jpg"].texture);
    game5.zOrder = -1;
    game5.alpha = 0;
    game5.position.x = dtransPos(0);
    game5.position.y = dtransPos(0);
    game5.scale.x = designscale;
    game5.scale.y = designscale;


    outPlay = new PIXI.Sprite(PIXI.loader.resources["images/continue.png"].texture);
    outPlay.zOrder = 3;
    outPlay.alpha = 1;
    outPlay.position.x = dtransPos(_btn3x);
    outPlay.position.y = dtransPos(_btn3y);
    outPlay.scale.x = designscale;
    outPlay.scale.y = designscale;
    outPlay.interactive = true;
    outPlay.mousedown = outPlay.touchstart = function(event){
      stage.removeChild(game5);
      stage.removeChild(myPerson);
      stage.removeChild(outPlay);
      stage.removeChild(endgame);
      myPerson.alpha=1;
      myPerson.position.x = dtransPos(_mstep4x);
      myPerson.position.y = dtransPos(_mstep4y);
      stage.addChild(myPerson);
      prescene6();
  };
} 

function prescene5(){
  stage.addChild(scene5);
  stage.addChild(intro5);
  stage.addChild(btn5);
  count = 0;
  scene_5_begin = true;
}
function scene_5(){
  if(scene_5_begin){
    count++;
    if(count==1){
      moveDraws(dtransPos(_mstep4x),dtransPos(_mstep4y),10);
    }else if(count==100){
      stage.removeChild(myPerson);
    }else if(timeline(count,100,200)){//show bg
      scene5.alpha+=0.01;
    }else if(count==201){//draw to start
      stage.addChild(myPerson);
      myPerson.position.x = dtransPos(_scene0x);
      myPerson.position.y = dtransPos(_scene0y);
      moveDraws(dtransPos(_scene1x),dtransPos(_scene1y),10);
    }else if(timeline(count,210,220)){//show intro
      intro5.alpha+=0.1;
    }else if(count==230){//show btn
      pauseDraws(false);
    }else if(timeline(count,310,320)){//show btn
      btn5.alpha+=0.1;
    }else if(count>320){
      scene_5_begin = false;
    }
  }
  if(scene_5_inside){
    count++;
    if (count==1){
      stage.removeChild(scene5);
      stage.removeChild(intro5);
      stage.removeChild(btn5);
      stage.removeChild(myPerson);
      pauseDraws(true);
      var next = game5arr.shift();
      myPerson.position.x = dtransPos(next.x);
      myPerson.position.y = dtransPos(next.y);
      myPerson.interactive = true;
      stage.addChild(myPerson);
      activeDrawings = true;
      myPerson.dragging = false;
      myPerson.on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);
    }else if(timeline(count,1,11)){//show bg
      game5.alpha+=0.1;
    }else if(count>11){
      scene_5_inside = false;
      game5.interactive = true;
      activeDrawings = false;
    }
  }
}

function onDragStart(event)
{
  if(!gameOver){
    myPerson.dragging = true;
    pauseDraws(true);
  }
}

function onDragEnd(event)
{
  if(!gameOver){
    myPerson.dragging = false;
    pauseDraws(false);
    if (game5arr.length==0){
      stage.removeChild(myPerson);
      stage.addChild(endgame);
      stage.addChild(outPlay);
      gameOver = true;
      frozenTime(true);
    }
  }
}
function isNear(a,b){
  if(Math.abs(a.x-b.x)<dtransPos(500)&&Math.abs(a.y-b.y)<dtransPos(500))
    return true;
  else
    return false;
}
function onDragMove(event)
{
    if (myPerson.dragging)
    {
        var newPosition = event.data.getLocalPosition(this.parent);
        if(!isNear(newPosition,myPerson.position)) return;
        if(game5arr.length>0){
          var next = game5arr.shift();
          myPerson.position.x = dtransPos(next.x);
          myPerson.position.y = dtransPos(next.y);
        }else{
          stage.removeChild(myPerson);
          stage.addChild(endgame);
          stage.addChild(outPlay);
          gameOver = true;
          this.dragging = false;
          frozenTime(true);
        }
    }
}


//Scene 6
var scene6,intro6,enter6,btn6,game6,ballman,ball,endball,startball,bat,batman,pro1,pro2,btn60,
  ballList = new Array(),batJump = new Array(),ballJump = new Array(),press1=0,press2=0,isbad=true,
  scene_6_begin = false,
  scene_6_inside = false,
  scene_6_end = false;

var pro1Tex = PIXI.Texture.fromImage("images/pro1.png");
pro1 = new PIXI.Sprite(pro1Tex);
var pro2Tex = PIXI.Texture.fromImage("images/pro2.png");
pro2 = new PIXI.Sprite(pro2Tex);

PIXI.loader
  .add(["images/scene6.jpg","images/intro6.png","images/btn6.png","images/btn60.png",
  "images/game6.jpg","images/ball0.png","images/ball1.png","images/bat.png"])//-1
  .load(setup6);
function setup6(){
    scene6 = new PIXI.Sprite(PIXI.loader.resources["images/scene6.jpg"].texture);
    scene6.zOrder = -1;
    scene6.alpha = 0;
    scene6.position.x = dtransPos(0);
    scene6.position.y = dtransPos(0);
    scene6.scale.x = designscale;
    scene6.scale.y = designscale;
    intro6 = new PIXI.Sprite(PIXI.loader.resources["images/intro6.png"].texture);
    intro6.zOrder = -1;
    intro6.alpha = 0;
    intro6.position.x = dtransPos(_intro5x);
    intro6.position.y = dtransPos(_intro5y);
    intro6.scale.x = designscale;
    intro6.scale.y = designscale;

    enter6 = new PIXI.Sprite(PIXI.loader.resources["images/enter3.png"].texture);
    enter6.zOrder = -1;
    enter6.alpha = 0;
    enter6.position.x = dtransPos(_btn5x);
    enter6.position.y = dtransPos(_btn5y);
    enter6.scale.x = designscale;
    enter6.scale.y = designscale;
    enter6.interactive = true;
    enter6.mousedown = enter6.touchstart = function(event){
      count = 0;
      scene_6_begin = false;
      scene_6_inside = true;
      stage.removeChild(enter6);
      stage.removeChild(scene6);
      stage.removeChild(intro6);
      stage.addChild(game6);
      frozenTime(false);
    };

    game6 = new PIXI.Sprite(PIXI.loader.resources["images/game6.jpg"].texture);
    game6.zOrder = -1;
    game6.alpha = 0;
    game6.position.x = dtransPos(0);
    game6.position.y = dtransPos(0);
    game6.scale.x = designscale;
    game6.scale.y = designscale;
    ballman = new PIXI.Sprite(PIXI.loader.resources["images/ball0.png"].texture);
    ballman.zOrder = -1;
    ballman.alpha = 1;
    ballman.position.x = dtransPos(_man6x);
    ballman.position.y = dtransPos(_man6y);
    ballman.scale.x = designscale;
    ballman.scale.y = designscale;
    ball = new PIXI.Sprite(PIXI.loader.resources["images/ball1.png"].texture);
    ball.zOrder = -1;
    ball.alpha = 1;
    ball.anchor.x = 0.5;
    ball.anchor.y = 0.5;
    ball.position.x = dtransPos(_batx);
    ball.position.y = dtransPos(_baty);
    ball.scale.x = designscale;
    ball.scale.y = designscale;
    bat = new PIXI.Sprite(PIXI.loader.resources["images/bat.png"].texture);
    bat.zOrder = -1;
    bat.alpha = 1;
    bat.position.x = dtransPos(_batx);
    bat.position.y = dtransPos(_baty);
    bat.scale.x = designscale;
    bat.scale.y = designscale;

    startball = new PIXI.Sprite(PIXI.loader.resources["images/btn6.png"].texture);
    startball.zOrder = -1;
    startball.alpha = 0;
    startball.position.x = dtransPos(_btn6x);
    startball.position.y = dtransPos(_btn6y);
    startball.scale.x = designscale;
    startball.scale.y = designscale;
    startball.interactive = true;
    startball.mousedown = startball.touchstart = function(event){
      console.log("start ball");
      press1 = new Date().getTime();
      count = 0;
      scene_6_inside = false;
      scene_6_end = true;
      swimspeed = 0;
      startprogress(true);
    };
    startball.mouseup = startball.touchend = function(event){
      press2 = new Date().getTime();
      var hit = Math.ceil((press2-press1)/100);
      console.log("time "+hit);
      if(hit<5||hit>30){
        isbad= true;
        badplay(hit);
      }
      else{
        isbad=false;
        playerJump(false);
      }
      stage.removeChild(startball);
      startprogress(false);
    };

    var proscale = 732/124;
    pro1.zOrder = 2;
    pro1.alpha = 1;
    pro1.anchor.set(0.5);
    pro1.position.x = startball.position.x+startball.width/2;
    pro1.position.y = startball.position.y+startball.height+dtransPos(50);
    pro1.width = dtransPos(400);
    pro1.height = pro1.width/proscale;


    pro2.zOrder = 2;
    pro2.alpha = 1;
    pro2.anchor.set(0.5);
    pro2.position.x = pro1.position.x-pro1.width/7;
    pro2.position.y = startball.position.y+startball.height+dtransPos(50);
    pro2.width = pro2.height = pro1.height/2;


    btn60 = new PIXI.Sprite(PIXI.loader.resources["images/btn60.png"].texture);
    btn60.zOrder = 3;
    btn60.anchor.x = 0.5;
    btn60.alpha = 0;
    btn60.position.x = dtransPos(_endgamex)+endgame.width/2;
    btn60.position.y = dtransPos(_endgamey);
    btn60.scale.x = designscale;
    btn60.scale.y = designscale;

    endball = new PIXI.Sprite(PIXI.loader.resources["images/continue.png"].texture);
    endball.zOrder = 3;
    endball.alpha = 1;
    endball.position.x = dtransPos(_btn6x);
    endball.position.y = dtransPos(_btn6y);
    endball.scale.x = designscale;
    endball.scale.y = designscale;
    endball.interactive = true;
    endball.mousedown = endball.touchstart = function(event){
      console.log("end game6");
      stage.removeChild(game6);
      stage.removeChild(endball);
      stage.removeChild(endgame);
      stage.removeChild(ball);
      stage.removeChild(ballman);
      stage.removeChild(bat);
      stage.removeChild(batman);
      stage.removeChild(thumap);
      myPerson.alpha=1;
      myPerson.position.x = dtransPos(_mstep4x);
      myPerson.position.y = dtransPos(_mstep4y);
      stage.addChild(myPerson);
      prescene7();
  };

} 

  function startprogress(start) {
    if(start){
      pro2.position.x = pro1.position.x-pro1.width/2;
      stage.addChild(pro1);
      stage.addChild(pro2);
      isProgressing = true;
    }else{
      isProgressing = false;
      stage.removeChild(pro1);
      stage.removeChild(pro2);
    }
}

function prescene6(){
  stage.addChild(scene6);
  stage.addChild(intro6);
  stage.addChild(enter6);
  count = 0;
  scene_6_begin = true;
}
function scene_6(){
  if(scene_6_begin){
    count++;
    if(count==1){
      moveDraws(dtransPos(_mstep5x),dtransPos(_mstep5y),10);
    }else if(count==100){
      moveDraws(dtransPos(_mstep6x),dtransPos(_mstep6y),10);
    }else if(count==200){
      moveDraws(dtransPos(_mstep7x),dtransPos(_mstep7y),10);
    }else if(count==300){
      stage.removeChild(myPerson);
    }else if(timeline(count,300,310)){//show bg
      scene6.alpha+=0.1;
    }else if(count==311){//draw to start
      stage.addChild(myPerson);
      myPerson.position.x = dtransPos(_scene0x);
      myPerson.position.y = dtransPos(_scene0y);
      moveDraws(dtransPos(_scene1x),dtransPos(_scene1y),10);
    }else if(timeline(count,400,410)){//show intro
      intro6.alpha+=0.1;
    }else if(count==420){
      pauseDraws(false);
    }else if(timeline(count,510,520)){//show btn
      enter6.alpha+=0.1;
    }else if(count>700){
      scene_6_begin = false;
    }
  }
  if(scene_6_inside){
    count++;
    if (count==1){
      stage.removeChild(scene6);
      stage.removeChild(intro6);
      stage.removeChild(enter6);
      stage.removeChild(myPerson);
      stage.addChild(game6);
      stage.addChild(startball);
      batman = new PIXI.Sprite(myPersonTex);
      batman.alpha = 1;
      batman.anchor.x = 0.5;
      batman.scale.x = batman.scale.y = myPerson.scale.x;
      batman.position.x = bat.position.x+bat.width/2;
      batman.position.y = bat.position.y+bat.height;
      stage.addChild(ball);
      stage.addChild(bat);
      stage.addChild(ballman);
      stage.addChild(batman);
      stage.addChild(btn60);
      frozenTime(false);
    }else if(timeline(count,10,20)){//show bg
      game6.alpha+=0.1;
      btn60.alpha+=0.1;
      startball.alpha+=0.1;
    }else if(count>20)
      scene_6_inside = false;
  }
  if(scene_6_end){
    if(count<3&&!isbad){
      if(batJump.length>0){
        var pos = batJump.shift();
        bat.position.y+=dtransPos(pos.y); 
        batman.position.y+=dtransPos(pos.y); 
        if(batJump.length==0)
          moveBall(1);
      }else if(ballJump.length>0){
        var pos = ballJump.shift();
        bat.position.y+=dtransPos(pos.y); 
        batman.position.y+=dtransPos(pos.y); 
        if(ballJump.length==0)
          moveBall(2);
      }else if(ballList.length>0){
        var pos = ballList.shift();
        ball.position.x =  dtransPos(pos.x);
        ball.position.y =  dtransPos(pos.y);
        if(ballList.length==0){
          if(pos.x<=_ball6x)//left
            playerJump(true);
          else{
            playerJump(false);
            count++;
          }
        }  
      }
    }else if(count<3&&isbad){
      if(ballJump.length>0){
        var pos = ballJump.shift();
        bat.position.y+=dtransPos(pos.y); 
        batman.position.y+=dtransPos(pos.y); 
      }else if(ballList.length>0){
        var pos = ballList.shift();
        ball.position.x =  dtransPos(pos.x);
        ball.position.y =  dtransPos(pos.y);  
      }else{
        batman.position.x = bat.position.x+bat.width/2;
        batman.position.y = bat.position.y+bat.height;
        bat.position.x = dtransPos(_batx);
        bat.position.y = dtransPos(_baty);
        stage.addChild(startball);
      }
    }else{
      stage.addChild(endball);
      stage.removeChild(btn60);
      stage.addChild(endgame);
      scene_6_end = false;
      frozenTime(true);
    }
  }
}
function badplay(speed){
  for(var i=0;i<5;i++){
    var pos = new Object();
    pos.x = 0;
    pos.y = -5;
    ballJump.push(pos); 
  }
  for(var i=0;i<5;i++){
    var pos = new Object();
    pos.x = 0;
    pos.y = 5;
    ballJump.push(pos); 
  }
  var nowX,nowY;
    nowX = _batx;
    nowY = _baty;

  var moveX = -speed,
    moveY = -speed;

  for(var i=0;i<10;i++){
    var pos = new Object();
    nowX = pos.x = nowX+moveX;
    nowY = pos.y = nowY+moveY;
    ballList.push(pos);
  }
  while(nowX>0&&nowY<_ground6y){
    var pos = new Object();
    nowX = pos.x = nowX+moveX;
    nowY = pos.y = nowY+10;
    ballList.push(pos);
  }
}
function playerJump(left){
  if(left){
    for(var i=0;i<5;i++){
      var pos = new Object();
      pos.x = 0;
      pos.y = -5;
      ballJump.push(pos); 
    }
    for(var i=0;i<5;i++){
      var pos = new Object();
      pos.x = 0;
      pos.y = 5;
      ballJump.push(pos); 
    }
  }else{
    for(var i=0;i<5;i++){
      var pos = new Object();
      pos.x = 0;
      pos.y = -5;
      batJump.push(pos); 
    }
    for(var i=0;i<5;i++){
      var pos = new Object();
      pos.x = 0;
      pos.y = 5;
      batJump.push(pos); 
    }
  }
}
function moveBall(dir){
  var nowX,nowY;
  if (dir==1){
    nowX = _batx;
    nowY = _baty;
  }else{
    nowX = _ball6x;
    nowY = _ball6y;
  }

  var moveX = (_ball61x-nowX)/10,
    moveY = (_ball61y-nowY)/10;

  for(var i=0;i<10;i++){
    var pos = new Object();
    nowX = pos.x = nowX+moveX;
    nowY = pos.y = nowY+moveY;
    ballList.push(pos);
  }
  for(var i=0;i<10;i++){
    var pos = new Object();
    nowX = pos.x = nowX+moveX;
    nowY = pos.y = nowY-moveY;
    ballList.push(pos);
  }
}

var scene7,people7,road7,
  scene_7_begin = false,
  scene_7_inside = false,
  scene_7_end = false;
PIXI.loader
  .add(["images/scene7.jpg","images/people7.png","images/road7.jpg"])//-1
  .load(setup7);
var style = {
  font : 'bold italic 100px',
  fill : '#FF0000',
  stroke : '#4a1850',
  strokeThickness : 5,
  dropShadow : false,
  dropShadowColor : '#000000',
  dropShadowAngle : Math.PI / 6,
  dropShadowDistance : 6,
  wordWrap : false,
  wordWrapWidth : 440
};
var hotstyle = {
  font : 'bold italic 100px',
  fill : '#FFFFff',
  stroke : '#4a1850',
  strokeThickness : 5,
  dropShadow : false,
  dropShadowColor : '#000000',
  dropShadowAngle : Math.PI / 6,
  dropShadowDistance : 6,
  wordWrap : false,
  wordWrapWidth : 440
};
function setup7(){
    scene7 = new PIXI.Sprite(PIXI.loader.resources["images/scene7.jpg"].texture);
    scene7.zOrder = -1;
    scene7.alpha = 1;
    scene7.position.x = dtransPos(0);
    scene7.position.y = dtransPos(0);
    scene7.scale.x = designscale;
    scene7.scale.y = designscale;
    people7 = new PIXI.Sprite(PIXI.loader.resources["images/people7.png"].texture);
    people7.zOrder = -1;
    people7.alpha = 1;
    people7.anchor.y=1;
    people7.position.x = dtransPos(_people7x);
    people7.position.y = dtransPos(_people7y);
    people7.scale.x = designscale*2;
    people7.scale.y = designscale*2;
    road7 = new PIXI.Sprite(PIXI.loader.resources["images/road7.jpg"].texture);
    road7.zOrder = -1;
    road7.alpha = 1;
    road7.position.x = dtransPos(_road7x);
    road7.position.y = dtransPos(_road7y);
    road7.scale.x = designscale;
    road7.scale.y = designscale;
}

function prescene7(){
  stage.addChild(scene7);
  stage.addChild(road7);
  stage.addChild(myPerson);
  stage.addChild(people7);
  count = 0;
  scene_7_begin = true;
  myPerson.position.x = dtransPos(_scene7x);
  myPerson.position.y = dtransPos(_scene7y);
  myPerson.anchor.set(0.5);
}

function scene_7(){
  if(scene_7_begin){
    count++;
    if(count==1){
      activeDrawings = true;
      moveDraws(dtransPos(_scene7x2),dtransPos(_scene7y2),10);
    }else if(timeline(count,100,400)){
      scene7.position.x-=swidth/300;
    }else if(count==401){
      activeDrawings = false;
    }else if(timeline(count,410,610)){
      people7.position.x-=swidth/200;
      road7.position.x-=swidth/200;
      if(people7.position.x<=myPerson.position.x-myPerson.width){
        myPerson.position.x-=swidth/200;
        activeDrawings = true;
      }
    }else if(count==611){
      stage.removeChild(myPerson);
      stage.removeChild(people7);
      stage.removeChild(road7);
    }else if(timeline(count,612,712)){
      scene7.alpha-=0.01;
      addNew();
    }else if(timeline(count,713,813)){
      addNew();
    }else if(count>814){
      stage.removeChild(scene7);
      scene_7_begin=false;
      count = 0;
      success();
      activeDrawings = false;
    }
  }
}

var tick = 0;
function addNew(){
  tick++;
  if(tick<200&&tick%4==0){
      var pic = Math.floor(Math.random() * 5);
      var dude = PIXI.Sprite.fromImage('images/color'+pic+'.png');
      dude.anchor.set(0.5);
      dude.alpha = Math.random();
      dude.scale.x = dude.scale.y =1.5;
      dude.position.x = Math.floor(Math.random() * swidth);
      dude.position.y = Math.floor(Math.random() * sheight);
      stage.addChild(dude);
  }
}

var time1=0,time2=0;
function frozenTime(va){
  if(va){
    time2 = new Date().getTime();
    myscore+=time2-time1;
    isForzen = true;
    stage.removeChild(clock);
  }
  else{
    time1 = new Date().getTime();
    stage.addChild(clock);
    isForzen = false;
  }
}

function showEnd(){
  var level = myscore/20000;
  if (level<20)
    level = 1;
  else if (level>40)
    level = 3;
  else
    level = 2;
  var pic = Math.floor(Math.random() * _anum);
  var title0 = new PIXI.Sprite(PIXI.loader.resources["images/title.png"].texture);
  title0.zOrder = 3;
  title0.alpha = 1;
  title0.position.x = 0;
  title0.position.y = 0;
  title0.scale.x = title0.scale.y = designscale;
  stage.addChild(title0);
  var title1 = new PIXI.Sprite(PIXI.loader.resources["images/title"+pic+".png"].texture);
  title1.zOrder = 3;
  title1.alpha = 1;
  title1.anchor.set(0.5);
  title1.position.x = swidth/2;
  title1.position.y = dtransPos(1208);
  title1.scale.x = title1.scale.y = designscale;
  stage.addChild(title1);
  var message1 = new PIXI.Text(successCount,style);
  message1.position.set(dtransPos(409),dtransPos(471));
  var msgscal = dtransPos(80)/message1.height;
  message1.scale.x=message1.scale.y = msgscal;
  message1.anchor.set(0.5);
  message1.zOrder = 3;
  stage.addChild(message1);
  var message = new PIXI.Text((myscore/1000).toFixed(2),style);
  message.position.set(dtransPos(516),dtransPos(590));
  var msgscal = dtransPos(80)/message.height;
  message.scale.x=message.scale.y = msgscal;
  message.anchor.set(0.5);
  message.zOrder = 3;
  imagetrans = "images/title"+level+"-"+pic+".png";
  document.title = words[pic];
  shareTimeline();
  sharefriend();
  stage.addChild(message);
}

animate();
function animate(){
 scene_0();//control scene_1;
 activeDraws();//control person
 scene_1();
 scene_2();
 scene_3();
 scene_4();
 scene_5();
 scene_6();
 scene_7();
 clock.rotation+=0.1;
 activeGymbtn();
 renderer.render(stage);
 requestAnimationFrame(animate);
}

function destroyAll(){
    //移除全部精灵
  stage.removeChildren();
    //移除整个舞台的引用
  stage.removeStageReference();
}