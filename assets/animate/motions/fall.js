(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"fall_atlas_1", frames: [[0,0,1440,1440]]},
		{name:"fall_atlas_2", frames: [[0,0,1440,1440]]},
		{name:"fall_atlas_3", frames: [[0,0,1440,1440]]}
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



(lib.스탠딩1 = function() {
	this.initialize(ss["fall_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.스탠딩2 = function() {
	this.initialize(ss["fall_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.추락1 = function() {
	this.initialize(ss["fall_atlas_3"]);
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


(lib.심볼5 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["fall_atlas_3"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.353,0,0,0.353,-262.5,-245.4)).s().p("AJqUNIgBgDIgGgEQiTgdiHgYQg/gjhOgDQhFgehJgbIgYgHQgEgHgKAAIgVgOIgcgLQiKAJibAeIAAACQgDADgEACQkEArj4AUIgDgCQgGgCgBgGQgIgDhLhlQhKhlCZi+IgOgLQgrgagYgsIgBADQgVAigfAaQgPAAgKgDQglAPgggtQghgtBViQIACgEQAXg2AfgsIgDgFQgwhRAphmQgyAQg/gJIgEgDQgVgWALgmQAHh1CCgVQARAHgDgOQgMiPCLADQABABAAAAQABABAAAAQAAABAAAAQABAAAAABQAEAHAHADIAAAHQABAMAHAGQAAgEABgCQAYgrAbgnIgugLIgOgKQg6gbgQhFIADgEQACgIAGgFQAkgJAbgQQAOgCAIgJQAxgYAjgnQgKgFgLAMIgcAKQh3AvhrgyQhlg4gMiRQAPiWBihCIC/gOQBGg3BDg6QALAAADgHQANgDAJgHQCvhUgfCTQAagbAfgWQgCgCgrhNQgqhOBXgzQCIgyBSBjQAOACAIAJQBOgIAOAVIACgvQAFh3DEhtQAQAAAJAIIACADIAFAVQAAAEAUAwQAVAwhFBNIgDAEQgJAZgNAUQB5hXB3BJQALAIAKAKQAAAAABABQAAAAAAABQAAAAABAAQAAABAAAAQABAMAEAJQAHAHAfA8QAfA8iPASQAsAMApAQQAVASARAEQAcgVAdgSQBFgXAoAsIACgDQgIgOgBgWIADgEIAEgHQBPg3BUBFQAOAJAKAMIAPAEIACAEQAEAHABAKQAsgTBEgCQAzAmB2C/QB2C/kpBRQgvASgpAHQAAAEACACQAiAuAGBLQAWAIAYAGIABADQAwAkASBDQApADAaASQCMgIgfBuIABAGQACAJABAJIgBAHQgHAYgRAPQgcAJggAFQAAAEACACQAlAzAABYIgDAEIgLARQg3ALgvgZIgBAHQgHAagOAUQAKACAPABQA4gGBICPQBICPkBDeQgYANgngDIAAgCQgNgCgBgNQgBAIAHBcQAHBihzBeQBACyiLgdQgKALgVAAIgEgBg")
	}.bind(this);
	this.shape.setTransform(112.4802,129.354);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// 레이어_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F0CFB6").s().p("Ah9CtQh2gThpg1QgZgLgKgCQgKgBgJADQgJADgFAIQgDADgHAXQgFAPgKACQgKABgLgNQhKhMgYhmQgEgSADgJQADgJAPgLQBThBA/gQQAlgKAvACQAdAAA4AHQE2AkDVADQBjABApAGQBOALAzAiIjtCeQgTANgJAEQgQAJgOACQgUADgmgIIhbgUQgQgDgHADQgMAEgBAQQgBAOAIAOIAOAYQAHAPgCALQg4AIg2AAQg+AAg/gKg");
	this.shape_1.setTransform(142.3433,239.6162);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AglDdQi4gHijhZQgRAzgiACQgYAAgZgdQhGhQgWhlQgOACgJgNQgJgNACgOQAEgWAdgXQBVhJBUgWQAzgNBDADQAlACBTAKQDwAfDLACQBuACArAFQBVAKA7AgQAjAUgBAYQgBASgbAUQhEAziYBhQgqAagZAIQgiAKgrgHQgdgEgxgPQABAJAFANIAIAWQADAMgBALQgCANgIAHQgJAIgXABQhFAEgwAAIgggBgAl8BaQAKACAZALQBpA1B2ATQB3ATB0gRQACgLgHgPIgOgYQgIgOABgOQABgQAMgEQAHgDAQADIBbAUQAmAIAUgDQAOgCAQgJQAJgEATgNIDtieQgzgihOgLQgpgGhjgBQjVgDk2gkQg4gHgdAAQgvgCglAKQg/AQhTBBQgPALgDAJQgDAJAEASQAYBmBKBMQALANAKgBQAKgCAFgPQAHgXADgDQAFgIAJgDQAHgCAHAAIAFAAg");
	this.shape_2.setTransform(142.0492,239.4485);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼5, new cjs.Rectangle(0,0,225,261.6), null);


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
	this.instance = new lib.심볼5();
	this.instance.setTransform(151.6,165.65,1,1,0,0,0,115,145.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:115.1,regY:145.8,scaleX:1.0264,scaleY:0.9598,x:151.75,y:165.75,mode:"synched",startPosition:0},4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(183.6,170,80.9,111.60000000000002);
// library properties:
lib.properties = {
	id: '287DAD9BC72920458635DE5845D21273',
	width: 300,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/fall_atlas_1.png", id:"fall_atlas_1"},
		{src:"images/fall_atlas_2.png", id:"fall_atlas_2"},
		{src:"images/fall_atlas_3.png", id:"fall_atlas_3"}
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
an.compositions['287DAD9BC72920458635DE5845D21273'] = {
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