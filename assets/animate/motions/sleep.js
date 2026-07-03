(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"sleep_atlas_1", frames: [[0,0,1440,1440]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.수면1 = function() {
	this.initialize(ss["sleep_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.심볼2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 레이어_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AhiC7IgDgEQgFgFACgJQABgIAHgLQBRiSA3iSQghAMhGAmQhCAkgmANQgKAEgHgBQgKgCgBgJQgBgKASgGQAogPBIgsQBIgtAngPQAcgKAKANQAGAJgEASQgEAUgPAnQgUAzgeA+Ig2BwIDCh7QAQgIAJABQAIABAEAHQAFAHgCAHQgDAKgRAKIh2BLQhGAtgyAYQgNAGgHABIgDAAQgIAAgFgEg");
	this.shape.setTransform(19.641,19.1006);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼2, new cjs.Rectangle(0,0,39.3,38.2), null);


(lib.심볼1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 레이어_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["sleep_atlas_1"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-710.5,-662.3)).s().p("EgVeAjbIgBgFQgagDgDgWQh0APhKgZQAAAFgCABQgSAJgKAPQnrgPlxiHQgtgQgegeQlLlHD2ndQgWgIg6gCQgvgYgrgaQgngHgagQQh8hPg9iKIgCgUIgShuQAHg6AMg0QA6kHCFi7QglgYgdgfQhnhrg9iTQiRhGgUjaQgVjbHSh7IBagoIAygoQAhgHAbgNQAfgdAcgiQDHjvDejaQCDgBBtAVIBGAoQAdABALATQAmAGAWAYQAjAYAPgOQAFgFADgGQAQgjAagYIBugoQFPi+INAAQAMgXAQgTQAtg3ARhTQAAgKgFgGQgMgMAHggQgXgNgPgbQiHjtjtiPQgagJgigBQAAgFgCgCQgXgNgPgUIAAgKQACg1AmgRQFBgVDRBbQAcAaAfAaQGPFUlwFmQCzAaCDBKIAAAFQAUAAAKgPQCahLDNAPQATALAQALQBBAvAeBRIAAAUQAEBWAkA2QAsguBCgYQB7hICxAWQAFAFADAGQAPAZAbAOQDOASCaBIQAlAbA1ANIBaA8QAnATAVgdQAkgJAYgVQHVgzFLChQBAAfA4AnQAUAFAPALQCjBzCYCBQA9ATBFALQAFAFACAGQAIATAFAUQACAbgNALQhWBKg/AwQAbAwAaAyQDqHOCULbQCULbubB1QgpAAgdgKIgQglQgohTgshGQjEBPiuBlQgjAjg3APQguAihAAQQj+CImCAEQAAAFgDACIgvArQhLAPg3AjQnuDco1iMQgKAAgIgEQg1gegdg4QhDgShJgMQgZgZgtgFQgZgUgbgRQhhg6AdiHQiFgug5AuIAKAUQAbA0gHBYQgFAAgBACQgRAoglASQgxgJgVATQgBATgHAMQglA7g3AoQiaA4jEAOQAAAFgDACQgHAIgKAFIgoAAg")
	}.bind(this);
	this.shape.setTransform(327.1039,318.7531);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼1, new cjs.Rectangle(0,92.1,654.2,453.4), null);


(lib.심볼3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 레이어_2
	this.instance = new lib.심볼2("synched",0);
	this.instance.setTransform(6.4,51.55,0.3252,0.3252,0,0,0,19.7,20.6);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:19.9,regY:20.9,scaleX:1.2638,scaleY:1.2638,x:28.65,y:26.4,alpha:1},13).to({alpha:0},6,cjs.Ease.cubicOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,53.2,57.3);


// stage content:
(lib.sleep = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 심볼_3
	this.instance = new lib.심볼3("synched",5);
	this.instance.setTransform(222.5,89.15,1,1,0,0,0,26.6,28.6);

	this.instance_1 = new lib.심볼3("synched",3);
	this.instance_1.setTransform(203.4,102.4,1,1,0,0,0,26.6,28.6);

	this.instance_2 = new lib.심볼3("synched",0);
	this.instance_2.setTransform(190.35,114.55,1,1,0,0,0,26.6,28.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(40));

	// 레이어_1
	this.instance_3 = new lib.심볼1();
	this.instance_3.setTransform(153.4,264.8,0.3895,0.3895,0,0,0,327.1,453.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regY:453.6,scaleX:0.4005,scaleY:0.3769,y:264.85},19,cjs.Ease.sineInOut).to({regY:453.4,scaleX:0.3895,scaleY:0.3895,y:264.8},20,cjs.Ease.sineInOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(172.4,210.6,111.99999999999997,90.1);
// library properties:
lib.properties = {
	id: '5A2DD8F61FF03D49A1184F59A4E94E1A',
	width: 300,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/sleep_atlas_1.png", id:"sleep_atlas_1"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['5A2DD8F61FF03D49A1184F59A4E94E1A'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;