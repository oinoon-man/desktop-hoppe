(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"fall_atlas_1", frames: [[0,0,1440,1440]]},
		{name:"fall_atlas_2", frames: [[0,0,1440,1440]]},
		{name:"fall_atlas_3", frames: [[0,0,1440,1440]]},
		{name:"fall_atlas_4", frames: [[0,0,1440,1440]]},
		{name:"fall_atlas_5", frames: [[0,0,1440,1440]]},
		{name:"fall_atlas_6", frames: [[0,0,1440,1440]]}
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



(lib.a1 = function() {
	this.initialize(ss["fall_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.a2 = function() {
	this.initialize(ss["fall_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.a3 = function() {
	this.initialize(ss["fall_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.a4 = function() {
	this.initialize(ss["fall_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.b6 = function() {
	this.initialize(ss["fall_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.추락1 = function() {
	this.initialize(ss["fall_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["fall_atlas_5"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.36,0,0,0.36,-254,-264.5)).s().p("AGxWPQg4gRgngTIgIgEQgHgDgEgHQgiAIgbgMQgEgBgCgDQgFgIgKgCQgDgHgDgFQgHgMgFgMIgBgCQgKgCgEAIIgVAAIgNgJQgbgTgLghQgNAIgMgFQgbgCgYgSQgSgOAPgRQgIACgKgFQgIgFgDgKQgJgcgFghIAAgCQgFADgJgBQgEgDgCgEIgIgLQgDgJACgEQAEgJAAgKQgRgCgIgJIgCgPQgCgOAAgOQgDgCgCgDQgDgGgGgEQgygKgWgYQgXgYBmggQiMAaiYAOQgsAbgEgEQgDgDAUgVQiXCPi8hjQhhAShLhWQhMhWAikuQBAAKADgGQABgGgjglQA5AZACgFIgMgOQgUgXgQgcQAAAHgDAGIgEAMQgiAJgmgUQgDgFgGgEQhBgjgJhdQg/gTAFhwQAFhwEfhCQh9gKg1hlQg1hmC1hDIC0hDQhcglgMh0QgDgJACgEQAEgIAEgEQALgEAOAAQAEACACADQAFAGAHAEQBHg/AXAwQAHgBAGgEQAbgRAVgYIgJgRQgYg5gwgtQB4i0A7iaQBTjWB5isQATgCAOAFQA/gUBWA+QBVA+AKDYQBFAPA1gLIgCAAQh5kbEhhbQAVgCALAJQAXAaAPCAQAPB/jBBpQAhAQAjgCQB7iKCihkIAGgEIAIgLIAEgCQAOgDAIgJQAMgKAMAKQAEAEACAGQAEAJBTgGQhNAuAHAjQAzDlAGEPQAGAHAMAAQB0AdBTBnQBTBniVCBQAhAQAuACIAFAHQADAFgBAKQgDAJgGAGQgUAVgRAWQgYALgbAKIABACIA2APQArALAqB9QArB7AMCbQADAAACACQALAJAQAEQAZANAdAIIAFAHQACAEAAAIQAAAGgCAEQgNAVgVAMIhSAcQgBANACAJQARBxgzBAIgCABQgbAYgkAOQgJAJgQACQBHAhgBCAQgCB/i7CtQgJAOgJgOIgDgEIgEgEQiagQh/g7QgDAAgDgCQgFgCgDgDQiDA/h8hUQAEADgJALQAlAAgMAKQgNAKAEAEQADAEAKAEIAIAHQAGAEAEAHIABAHQADANgLgCQAWAVAgAMIAHACQAMACADAKQAhAMAgANQADACABADIAGAKQAlAMBEACIACADIABAHQA/gFAiAYQAEAXAdgCIAGAFIAQANIAGAKQAEAJgHAGQAAALAFAGQAMAPgCAdQADAKABAXQAAAXgsAJQgaACgcAGQgpA8gtAAQgKAAgKgDg")
	}.bind(this);
	this.shape.setTransform(110.4316,142.5405);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,220.9,285.1);


// stage content:
(lib.fall = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.심볼1("synched",0);
	this.instance.setTransform(145.35,150.7,1,1,0,0,0,110.4,142.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:110.5,regY:142.7,scaleX:1.0331,scaleY:0.9481,x:145.45,y:150.8},4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(181.3,158.1,78.19999999999999,135.1);
// library properties:
lib.properties = {
	id: '2647B2B4E4AA4442B54BE1DF74B11112',
	width: 300,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/fall_atlas_1.png", id:"fall_atlas_1"},
		{src:"images/fall_atlas_2.png", id:"fall_atlas_2"},
		{src:"images/fall_atlas_3.png", id:"fall_atlas_3"},
		{src:"images/fall_atlas_4.png", id:"fall_atlas_4"},
		{src:"images/fall_atlas_5.png", id:"fall_atlas_5"},
		{src:"images/fall_atlas_6.png", id:"fall_atlas_6"}
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
an.compositions['2647B2B4E4AA4442B54BE1DF74B11112'] = {
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