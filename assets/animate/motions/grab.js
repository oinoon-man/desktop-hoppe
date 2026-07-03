(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"grab_atlas_1", frames: [[0,0,1440,1440]]},
		{name:"grab_atlas_2", frames: [[0,0,1440,1440]]},
		{name:"grab_atlas_3", frames: [[0,0,1440,1440]]}
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
	this.initialize(ss["grab_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.스탠딩2 = function() {
	this.initialize(ss["grab_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.잡1 = function() {
	this.initialize(ss["grab_atlas_3"]);
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


(lib.심볼10 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#F0CFB6").s().p("AhwEaQAUgpgTgQQgKgIgbAEQg+AHhBgKQCejNBDj3QAFgRAMgUIAXgjIA9hxQhXDcgaDwQA+AJA5gYQAZB8gpB0QBoAKBgg2QASgLARgMQgpA1g2AnQhQA6heAiQheAhhjAEQAnhEAjhGg");
	this.shape.setTransform(34.725,69);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AkSJEQgegFgHgRQgHgPAQgcIBIh/QhCAAhGgOQgYgFgHgMQgLgSBEhbQBEhbA7iFQA7iFAIgdQAJgdABgHQABgMANgKQAOgLAKgbQAKgcAxhkQAwhlApgtQAjgnArgUQAwgXAtAJQAoAIAjAgQAeAdAVArQAhBBAMBYQAIA/AABiQgCCWgUBlQgbCHhCBdQhiCJjJBPQhxAthbAAQgdAAgbgFgAikFLQATAQgUAoQgjBGgmBEQBjgEBeghQBeghBQg7QA2gnApg1QAXgeATgiQA1heAIhoIAIiCQAGhQgBgyQgEiag7hhQgegwgjgHQgigHgsAeQg7AqgzBhIgZAwIg9BxIgXAjQgMAUgFARQhED4ieDNQBCAJA9gHIAOgBQAQAAAHAGg");
	this.shape_1.setTransform(39.9812,58.4548);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#C89F92").s().p("Ah7HAQAqh0gah8Qg4AYhAgJQAajwBYjcIAagxQAzhgA6gqQAsgeAiAHQAjAHAeAwQA7BgAECaQABAygGBRIgICBQgIBpg1BeQgTAigXAeQgRAMgTAKQhQAuhYAAIgfgBg");
	this.shape_2.setTransform(51.1827,50.8048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼10, new cjs.Rectangle(0,0,80,116.9), null);


(lib.심볼6 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["grab_atlas_3"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.385,-0.02,0.02,0.385,-257.3,-231.1)).s().p("AEBTpQgbgLgSgWQgagdgEg1IgBgDQAAgBAAAAQAAAAAAAAQgBAAAAAAQAAAAAAABQAAAAgBAAQAAABAAAAQgBAAAAABQgBAAAAAAIgDABQAAAJgKACQgIABgIAFQhLAqh6gNIAAAMQABALgEAKQgCAFADANIgDAEQgCADgDADIgBADIgBACQiCAUhtgSQgHgJgMgCQgJgBgIgGQghgKgYgVQhlhfgnikQgtARg2gFIgBgDIgDgEIgBgDQAAAAgBgBQAAAAgBAAQAAAAgBAAQAAAAgBAAQACgoAOgaQAwhVgRiMIgUgEQgLgDgIgHQgcgJgPgVQgVgcgSgfQgKgigHgmQgHgdh9gMQBniGALh5IAAgDIAAgDQAAgBAAgBQAAAAAAgBQAAAAgBgBQAAAAAAAAIgDgBIAAgBQgNgBgEAIQgCAGgHABQhKATg9gfQgggMg1AWQAMhHi7AqQB4isAdiVIAag8QA5iAgaicQA7gRgChDQAfAeADgLIAIgDIAHgDIAAgDQAFgEAKgCQAFgBACgFQA5gSA1gXIgDgHQgCgHAAgIIAAgMQAKgUAMgSQASgZAggOQAvgYBAgJIABgCIAFgGIABgDIgBgEQASgLAOgLQAogkArgdQgrgPhGgRQAThFg9AQQARjNC9hPQAHAAAHgEQAPgHAUgDQA1gEAkAOIACADQAHAFAGAIQAEAHACAIQgGgBgDAGQgDAFgGABQgVAZgWAWQgyAygeBEQgEAaAAAdQABAYAEAWQAHgCADAGIABAKQAAAEADAEQBJgjBtgGQAMgSAOgRQAWgaAhgQQAbgVAxgCQAFACAAADQAEAGAFAFQADACAGAAIARAuQAHAWAIASIA9ACQAEAAADAEQABAAAAAAQABAAAAAAQAAABAAAAQAAAAAAABIADAAIALgHIAPgGIAQgLQAHgGAMgEQADgBACgEIACgBQADgBAEgBQAogaAugpQATAxAKgzQAhApAsgsQCIBzBPCUIAAACQASgBANAFQAaASAWAWQCBCBB5CLQBUAGBPANQATAdgLArQgRBDgoAwIAaBAQAxCEgaCIIgNAFQgIADgFAFQAAAEABADQAHALAFAPQACAHgCANQAHgBACAIIABAFQACAIAFgBIABAHIABAMIAAAEIAAADQAAABAAAAQAAABAAAAQAAAAABABQAAAAAAAAIAPAFIADADIABADQABAEACABIABADIAEABQAsC5AEDZQAIFHhfDkQgKABgFgEQgJgFgCAKIgDABIgDAGQAAAAAAAAQAAABAAAAQAAAAAAAAQgBAAAAABIgBADIgTAQQgIAIgOABIgHAGIgBABQgDACgDAAQgEAHgLADQgMACgIAJQhYAjhVgXQgggKgPgcQgYgygUg1QgGAIgGAHQglApg7AIQgGASgNANQgVARgbAMQgEAFgEACIgPAGQhGAwheAAQgmAAgrgIg")
	}.bind(this);
	this.shape.setTransform(117.6026,126.4983);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼6, new cjs.Rectangle(0,0,235.2,253), null);


(lib.심볼12 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.심볼6();
	this.instance.setTransform(118.8,129.55,1,1,6.9817,0,0,117.6,126.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:-4.1994,y:129.6},19,cjs.Ease.sineInOut).to({rotation:6.9817,y:129.55},20,cjs.Ease.sineInOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.3,-10.3,264.2,279.7);


(lib.심볼11 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.심볼10();
	this.instance.setTransform(45.95,21.65,1,1,4.4878,0,0,40,16.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:-12.4574,x:52.55,y:21.55},19,cjs.Ease.cubicInOut).to({rotation:4.4878,x:45.95,y:21.65},20,cjs.Ease.cubicInOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.8,-2.7,115.1,131.39999999999998);


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

	// 심볼_12
	this.instance = new lib.심볼12("synched",2);
	this.instance.setTransform(119.45,128.15,1,1,0,0,0,120.6,131.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(38).to({startPosition:0},0).to({_off:true},1).wait(1));

	// 심볼_11
	this.instance_1 = new lib.심볼11("synched",0);
	this.instance_1.setTransform(210.35,191.45,1,1,-38.2148,0,0,53.5,62.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(38).to({startPosition:38},0).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.1,-3,263.40000000000003,266.8);


(lib.심볼13 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.심볼5("synched",0);
	this.instance.setTransform(161.75,36.05,0.9195,0.9195,9.2372,0,0,160.6,26.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:26.9,rotation:-5.7048,startPosition:19},19,cjs.Ease.sineInOut).to({regY:26.8,rotation:9.2372,startPosition:0},20,cjs.Ease.sineInOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,270.7,258.5);


// stage content:
(lib.grab = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 심볼_13
	this.instance = new lib.심볼13("synched",0);
	this.instance.setTransform(154.15,139,1,1,0,0,0,135.3,129.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(40));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(168.9,159.8,120.70000000000002,108.5);
// library properties:
lib.properties = {
	id: '70A97C7DF2A61641908DA797DA19065F',
	width: 300,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/grab_atlas_1.png", id:"grab_atlas_1"},
		{src:"images/grab_atlas_2.png", id:"grab_atlas_2"},
		{src:"images/grab_atlas_3.png", id:"grab_atlas_3"}
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
an.compositions['70A97C7DF2A61641908DA797DA19065F'] = {
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