(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"land_atlas_1", frames: [[0,0,1440,1440]]},
		{name:"land_atlas_2", frames: [[0,0,1440,1440]]},
		{name:"land_atlas_3", frames: [[0,0,1440,1440]]},
		{name:"land_atlas_4", frames: [[0,0,1440,1440]]},
		{name:"land_atlas_5", frames: [[0,0,1440,1440]]}
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



(lib.착지1 = function() {
	this.initialize(ss["land_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.착지2 = function() {
	this.initialize(ss["land_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.착지3 = function() {
	this.initialize(ss["land_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.스탠딩1 = function() {
	this.initialize(ss["land_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.스탠딩2 = function() {
	this.initialize(ss["land_atlas_5"]);
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["land_atlas_2"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.337,0,0,0.337,-233.2,-249.5)).s().p("ABqUtQgDAAgDgCQgHgEgFgGQgEgEgEgDQgDgBgCgEQjYAPjZgPIgEgDIgEgCQgFgBABgHIgCgBIAAgDQAOgZASgVQAJgLAGgOQgPgqgKguIgahrQAAAAAAAAQgBABAAAAQgBAAAAAAQgBABAAAAQgbACgUAGIgNgFIgBAAQgDgCgEAAIAAgCQgVgKgOgRQgGgIgJgHIAAAbIAAAbIAAARIgDABIAAADIgBACIgCACIAAACQgFAEgJAAQg7AAgtgbQgqgSgWgmQgxhTAPiDQhYAEg9gVIgBgCIgFgDIgCgBIgBgBIgBgDQgFABACgIQAAAAAAgBQAAAAAAAAQAAgBgBAAQAAAAAAAAIgBgCIgCgCIAAgEQAWglAdgeQBqhvAQjLQhtALhmARQgIgmgVgHQgPgKgnAAQAPgjgHgZQgtilgai5QBEARADgzQAXAZADgFQAPgEADABIATAHIAFAEIAJAMQAEADAEADQADABACAEIADAAQAFABAEADIACABQACACAEAAQARAVAKAdQAFAPAJALIAAAHQAAAAAAABQAAABAAAAQAAABAAAAQABABAAAAQAEACgCAHIAAAEIAAADQArACAtgCIAAgDIAKhnIAKhcIgfgJIghgLQgagRgUgVQgLgLgEgTQAFgDADgGQACgGAGgDQAEgCAEgDQAUgDATgFQAOgEALgIQg4gKhFgbQgpgSgZgiQgFgGhBAPQAjhEARhEQAPglAZgbQA4g9BCgyIAGgEIAGgEIACgCIACgBQAPgsARgpQAchDg+hoQBxAHAVgiQAZgFAQgsQBcAkBFAhIABgDQACgHAAgKIABgNIAAgKIADgEIADgDIAEgGIACgCIABgCQBlgbBmAeQABgDACgBQAJgCAEgFQADgEAHgCQAKgJARgBQAKgBAAgJQgfgTg9gMQAkgsiFAWQBliYB2g3IAHAAQAEgBADgDIABgBQADgBADAAIABgCQA0gXBBgJQBHgFA1APQAAAAAAABQABAAAAABQAAAAABABQAAAAAAABQACAFAEADIADACQAFADgDAHIgBADIgHAMQgDAEgFACQgEACgEAEIgGACQgJAAgFAFQgDAEgHACQgjAWAKA7Qh1AFAIBqIADAEQAEADABAGQABABAAAAQAAABAAAAQABABAAAAQABAAAAABIAGAEQBLACA+AOQBHgjBiAFQATAUAFAlQACAPgCAWQAQAKAUAGQASAGARAJIAFABIAMAFIANAEIAHADQADACACADIACABIADABQAGgEgWggQAnASgIgZQAYAKgLgoQAbAcAEgkQAMAdACgDIAFgEIAFgDIABgCQA6gdBFggQAaAiAWADQAQAZA1AOQgkAaAEAOQACAJAzgGQgZBRAlAyQAfARAeATQBkBAA9BmQAJAuATAoQguAUAsBHQhuAohfAxQAWAkAQAqQASAvALA2QAJgCAIAAIABABIAGABQAGAEAGAFQAKAKAIALQAGAHACAKIADADIAKAEIAOADQAcAcASAmQBECQAACPQg/AFgSAaQgGACgEAEQgFAFgIABQgEABgEAEQgIADgLACIgCABIgCAAIAAACIgGADIAAACIgOABQgTACgTAEQAKBXgCBiQgDELiFCKIgGABQgFABgFACIAAACIADABIAuAnQAgAbAoAVQAAABAAAAQAAAAAAABQAAAAABAAQAAAAAAAAIAFADIACABIAFABIAHAGQADADAFAAQAFACAEADQAAAAAAABQAAABAAAAQABABAAAAQAAAAAAABQAFACgCAHIgBAKIAAAHIgEAEQgIARgQAIQgKAFgJAGIgHADQg4AQg2ASQgDANACAGQAEAKgEAKQgCAFADAKIgEAEQgDADgCAHIgBAEIgEAGQhtAph7gfIgBADQgCALAEAFQACADAAAFIAAAKIgDABIAAADIgCACIgCACIAAACIgDABQgEABgBADQgBACABAEIACACIADABIAAADQABAHgDADQgBAAAAAAQAAAAgBABQAAAAAAABQAAABAAABIAAADIAAADIgEADIgBACIgCABIgCACIgBADIgGAAQgEABgCADIgCABIgGABIgBACIgMAGIgCABIgFABIgGAFQgGAGgMACQgEABgDADIgGABIgLAGIgGADIgHACIgKAFIgHADQgeADgbAAQhpAAhNgkg")
	}.bind(this);
	this.shape.setTransform(106.95,136.0483);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼10, new cjs.Rectangle(0,0,213.9,272.1), null);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["land_atlas_3"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.314,0,0,0.314,-220.5,-198.2)).s().p("AhTDpIgBgCQgJgIgGgJIAAgDQgBghARgSQAQgEADALIAAADQgBAJgGADIAAADIAAAQIAQAEQAIgHALgDIANgKQAOgEANAEQADAHAJAAQAOAMAYgJIABgCQAFgIAHgGQAPgHAGANIAAAEQgDARgJALQgKADgGAGQgiAJgWgPQgJgCgGgEQgEAGgIAAQgEAGgJAAQgMAJgQAAQgJAAgKgCgABxBuIgFgBIgHgFQgMgCgIgFQgKgGgGgIQgIgKgMgHIgBgDIgCgDIgDgEQgDgGAGAAIAAgBQDBAZCrg3QAHABgCAIQgFASgOAKIgOAKQgXASgcAOQgHAIgNAGQguASgwAAQgxAAgzgUgAlVBlIAAgCQg1gVgQg4IATAAQCPA8CrggIAAAEQgDARgJALQgRAHgMAMQgLACgIAHQgvAOgtAAQg6AAg2gXgABVAsIgBgCQgKgHAIgNQA8gDAvAJIABACQAEADgCAIQgZAKgdAAQgZAAgcgHgAjOAsQgFgFAEgDIABgBIABgCIABgCQABgBAAAAQAAAAAAAAQAAgBAAAAQAAAAAAgBIAHAAQAlgIApgEQAJABAAAIIABADIgBADIgDAEIgGACQgeALgbAAQgQAAgPgEgAj0iAIgGgDQgBgMADgHQAZg0A0gXIAMgCIANgEQAsgDAcAMIAMAKQAEADAAAGQgBAJgEAFIgLAIQgeAJghAHQgDADgDAAQgMACgEAHIgGADQgTADgMAKIgHACQgQACgJAJIgQgEgADviJIgGgDQgJgEgHgGQgMgEgQgCIAAgCIgGgCIAAgCIgNAAQgwgOgrgSQgBgMAEgHIAKgMIAGgBIAWgIQA+gBAqATIAWASQAZAUAMAfQAAAHgDADIgGAGQgRgEgSgCg")
	}.bind(this);
	this.shape.setTransform(41.1222,23.5398);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼6, new cjs.Rectangle(0,0,82.3,47.1), null);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["land_atlas_1"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.329,0,0,0.329,-232.1,-239.3)).s().p("Ap+SfIgCgDIgCgNQAAgBABgBQAAgBAAAAQAAgBAAAAQABAAAAAAQAEgCgCgHQhyhgBDAaQBDAaAgAEQgYghgRgnQgghIgghGIgUhLQgGgaADglIgBgCIgJgDIgBAAQgCgCgEAAIgCgDQgCgFgFgCQgBgBAAAAQAAAAgBAAQAAgBAAAAQAAAAAAgBQAAgGgFAAQgCAGgEAEIgMALQgFADgEAFQgIAAgHgBIgBAAQgDgCgDAAQhQAvACgmQADglATgwQgOgwAHg2QAKhOAhg5QhRAEg/AWQgYhFhJiJQhJiJCfh/QAPgFADACIASAGIAFAEQAEAHAGAFQADADAEADQADABACAEIADAAQAFABAEADIABABQADABAEAAQAQAWAKAcQAFAOAIAMIAAAHQAAAAAAABQAAABAAAAQAAABABAAQAAAAAAABQAEACgCAHIAAADIAAAEQArABArgBIAAgEIAJhmIAKhYIgegJIgggKQgYgRgVgVQgLgLgEgRQAGgEACgGQADgFAFgDIAIgFQAUgDASgFQAOgFAKgHQg3gJhDgbQgogShRgpQhSgoB5hMQAPgkAZgbQA2g6BAgyIAHgDQADgCACgCIACgCIACgBQAPgrAQgoQAshnA2haQBvgWBXApIAAgDQACgHAAgJIABgOIAAgJIADgDIADgEIAEgFIACgCIABgDQBjgaBjAeQABgEACgBQAIgCAEgEQAEgEAGgCQAKgJARgBQAJAAABgKQhCgPg0hUQg1hUDJhGIAGgBQADgBADgCIABgBQADgCADAAIABgCQAzgWA/gIQBGgFAzAOIACAEQACAFAEAEIADABQAEACgCAHIAAADIgIAMQgDAEgEADIgIAFIgHACQgIAAgEAFQgEAEgGACIhEAqQhHAqAIBnIADAEQAEADABAGQAAABABAAQAAABAAAAQAAAAABABQAAAAAAABIAHADQBIACA9APQBFgkBgAGQASATAFAkQACAPgCAWQAQAKATAFQASAGAQAJQAEAAACABIALAFIANAEIAGADIAGAEIACACIACABQANgJATgTQAPgNATgJIAGgEIAFgEIAEgDQABAAAAAAQAAgBABAAQAAAAAAAAQAAgBAAAAQBOhlBdBOQAXAiAMArQAXBLAoA3QAfARAdASQBiA/A7BkQBJBBghBPQghBPi1AoQAYAgAPArQAQAsALA0IAQgCIABABIAGABQAGAEAFAFQAKAJAIAMQAFAHACAJIAEADIAJADIANADQAdAbBqB8QBqB7jQBlQgGACgEAEQgEAFgIACQgEABgDADQgJADgLACIgBABIgCAAIgBACIgFADIgBACIgNgBQgbgBgNAMQAAA4gCA4QgCA8gTAtQAOgGAQgFQAJgDAIgGIAGgBIAKgEIANgFIABgCIAFgCIABgBIAGgDIAAgCQAbgLAXgPQAQgLANgPQAIgDAIABIABAAQADACADAAIAEAGIACABQAAAAABABQAAAAAAAAQAAABAAAAQAAAAAAABIABACIACABQAAAsgKAjQgGAZgKAVIAAACIAQAEQAGABAEADQAGApgLApQg2DMirBZQiSA4iZguQAHArgUAfQgOAVgUARQigAfiigZIgMgHQgHgFgDgKQgBgEgEgDIAAgHIgBgTQgBgKADgDQADgCAAgFIgqhGQgXgkgPguQhpgFhhATIgGADIgGAHIgDACIgCABQAIAtAMArQAKAjAHApIgEAHIAAADIgBADIgBABIgBADIgDABIgBABIgJACIAAACIgDAHIgBACIgCACIgBACIAAAEQhkAOhbAAQiGAAhwgfg")
	}.bind(this);
	this.shape.setTransform(108.107,121.382);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼5, new cjs.Rectangle(0,0,216.2,242.8), null);


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

	// 레이어_3
	this.instance = new lib.심볼6();
	this.instance.setTransform(96.8,104.15,0.9623,1.0486,0,0,0,41.2,23.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:41.1,regY:23.5,scaleX:0.9842,scaleY:1.0203,x:96.6,y:116.05},0).wait(1).to({regY:23.6,scaleX:1,scaleY:1,x:96.7,y:124.8},0).to({y:130.5},1).wait(1).to({regY:23.5,y:133.6},0).wait(1).to({y:135.4},0).wait(1).to({y:136.3},0).wait(1).to({regY:23.6,y:136.65},0).to({y:130.5},7,cjs.Ease.cubicOut).wait(6));

	// 레이어_1
	this.instance_1 = new lib.심볼10();
	this.instance_1.setTransform(109.3,272,0.964,1.0156,0,0,0,107,272);

	this.instance_2 = new lib.심볼5();
	this.instance_2.setTransform(111.8,269.9,1,1,0,0,0,108.1,242.8);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regY:272.1,scaleX:1,scaleY:0.9072,y:272.15},2).to({_off:true,regX:108.1,regY:242.8,scaleY:1,x:111.8,y:269.9},1).wait(17));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(2).to({_off:false},1).to({regX:108.2,scaleX:1.0347,scaleY:0.9778,x:111.9,y:269.95},4,cjs.Ease.cubicOut).to({regX:108.1,scaleX:1,scaleY:1,x:111.8,y:269.9},7,cjs.Ease.cubicOut).wait(6));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-4.2,223.7,276.4);


// stage content:
(lib.land = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 심볼_11
	this.instance = new lib.심볼11("synched",0);
	this.instance.setTransform(148,155.3,1,1,0,0,0,111.9,136.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(20));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(186.1,165,73.70000000000002,126.39999999999998);
// library properties:
lib.properties = {
	id: '0F289A16700CB44189DCA7ABE1BF0D0B',
	width: 300,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/land_atlas_1.png", id:"land_atlas_1"},
		{src:"images/land_atlas_2.png", id:"land_atlas_2"},
		{src:"images/land_atlas_3.png", id:"land_atlas_3"},
		{src:"images/land_atlas_4.png", id:"land_atlas_4"},
		{src:"images/land_atlas_5.png", id:"land_atlas_5"}
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
an.compositions['0F289A16700CB44189DCA7ABE1BF0D0B'] = {
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