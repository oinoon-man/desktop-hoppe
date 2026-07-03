(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"standing_atlas_1", frames: [[0,0,1440,1440]]},
		{name:"standing_atlas_2", frames: [[0,0,1440,1440]]}
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
	this.initialize(ss["standing_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.스탠딩2 = function() {
	this.initialize(ss["standing_atlas_2"]);
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


(lib.심볼8 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#C89F92").s().p("AjiCGQgxgggUg1QgTgyAJhRQAEgjAIgQIAIgLQCBAPB9ghQAKAvgIAxQBcAVBhgRQBQgOBFglQgIA3gcAyQghA2gyAlQg5AohKAOQhEANhKgLQgVgCgHADQgHADgDAHQgDAHAEAGIgLAAQgyAAgtgdg");
	this.shape.setTransform(34.1804,25.842);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F0CFB6").s().p("AgqBDQAJgxgKguQh+AgiAgOQANgSATgCQAJgBAYAEQAVAEAegCQCHgEB/gxIghA0QgJAOACAIQAEANAZADQAyAGBAgDQAmgBBNgHIgCANQhFAlhQAOQgrAIgrAAQg1AAgzgMg");
	this.shape_1.setTransform(35.4,12.4179);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AjtDEQg+gjgZg7QgZg5AJhbQAEgsAMgZIACgEQARgiAfgLQARgFAaADIAsAGQAhAEA9gJQB1gTBNglQATgKAKAIQAJAHgHATQgNApgaAiQApAFA6gDIBkgIQAggCALAMQAOAOgJAiQgZBog7BAQg7BBhgAcQhRAXhjgJQACALgMAHQgHADgPABIgJAAQg/AAg2gfgAj+iGQgUADgNARIgHALQgJARgEAiQgJBQATA0QAUA0AyAgQAyAhA3gEQgEgFAEgIQADgHAGgDQAIgDAUACQBLALBDgNQBLgOA4goQAzgkAgg4QAdgxAIg2IABgOQhMAHgmACQhAACgzgGQgZgDgDgOQgCgHAJgOIAgg0Qh+AwiHAFQgeACgVgEQgUgEgJAAIgEAAg");
	this.shape_2.setTransform(34.3433,22.7682);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼8, new cjs.Rectangle(0,0,68.7,45.5), null);


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

	// 레이어_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF8F91").s().p("AgCArQgPgBgLgFQgNgGgFgNQgEgLAFgUQAEgRAHgJQAHAAAJgDIAAAAIAAAEQAAALAEAQQAEAMAGAKQADAHAEAAQADABADgDQACgCAAgDQAAgEgDgFQgFgIgDgRIAAADQAAgIAAgHQAIAEANACIAPABIACADQALAQAAANQABASgNALQgLAKgVAAIgHAAg");
	this.shape.setTransform(6.7721,8.8893);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgKBMQgTgBgOgHQgRgIgIgOQgIgPACgQQAAgNAHgQQAEgIAEgHQgLgEgEgLQgEgMAFgLQADgHAFgBQACgBADACQABAAAAABQABAAAAAAQABABAAABQAAAAAAABIgCAHQgCAFACAFQADAGAFABQAFABAJgEIANgHQAIgDAFAEIAHAGQAEADAGACQALADAOgBQAQAAAFgKQABgKADgFQADgDAFgBQAEgBAEADQAEAEABAIQABAKgGAKQgHAKgKAFIgCABQANAVgDAYQgDAcgWAOQgQALgXAAIgJgBgAgrgbQgHAJgEARQgFAUAEALQAFANANAGQALAFAPABQAaACANgMQANgLgBgSQAAgOgLgPIgCgDIgPgBQgMgCgIgEQgBAHABAIIAAgDQADAQAFAJQACAFAAAEQAAADgCACQgCADgDgBQgFAAgDgHQgGgKgEgNQgEgPAAgLIAAgEIAAAAQgJADgHAAg");
	this.shape_1.setTransform(7.6953,7.6792);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼3, new cjs.Rectangle(0,0,15.4,15.4), null);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["standing_atlas_2"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.283,0,0,0.283,-178.3,-177.9)).s().p("AkeDhQg1AEgfgNQgegNAlg8QgGgaAIgZQAbhLBJgdIAAgCQAigLAlgHIAOACQANADAKADQAggDAPAIQAPAIgDAMQgEANABABIASAcIAIAMQAwDEiJAAQgzAAhLgagABoDkQiAghAShbQARhbBCgXQBAgZAqgGIipgFQAEgBAAgFQAAgIAGgFQADgCADgEQAEgEAHgCIAugPIgLAEQgVAFgRgDIAAgCIAAgEIAAgCIAAgDIAAgDIAGgBQAZgOAjgFQAVgDAKAJIACADQAAAAAAABQAAABAAAAQAAABAAAAQAAABAAAAIgBACIgBACIgCACQBkgIBQArQAdAKARAVQASAUAHAeIAAACIgGgBQgHAAgEgEQhEgdhMgJIAIACIAMADQAVADAOAIQAPAJABAQQATAaARAcQATAegKAsQgOAbgTAVQgYAbgfASQgiANghAAQgqAAgmgVgAl8AMQgCgGAEgBQAAAAABgBQAAAAAAgBQAAAAAAgBQAAAAAAgBIAAgCIAAgDIACgBIABgCIAAgCIACAAIAAgDIAAgDIAAgDIAAgDQALgPANgMQAUgRAYgMIAGgBQAggQAqgGQA9gCAvAKQAGAGAIABQAKABAEAHIAFABIABAAIAFACIAAADQAJAAARADQARADgMAEQgLAEgDAFQh6gLhoAlIgPADIgFACIgBACIgEACIgCABIgFABIAAABQgJAGgKADQgDABgDADIgOADIgGACQgDABgBADQgDAFgEADIgCABQgDAAgBgFgAhVhYQgbgQgmgFIgBgBQgIgCgDgIIABgCQADgIAIgEQAiACAWAPQATAEAHAQQgBAJgLAAIgFAAgAAhjTQgCgFAAgGIgBgLQADgCACgCQAEgEAIgBIAAgCQAKgCAHgEQAigCAWAMQAjASALArQgBACgDACIgKAEQg4gXg/gRgAjSi5IAAgDIgDgDIgDgDQgCgKAFgFQAOgPAUgMIAFgBQAJgDAJgFQAlgFARAOIAFABIAGAFIADABQALABADAGIAAADIAAAGIAAAFQguAYg9AAIgdgBg")
	}.bind(this);
	this.shape.setTransform(38.4609,25.1135);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼2, new cjs.Rectangle(0,0,76.9,50.3), null);


(lib.심볼9 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.심볼8();
	this.instance.setTransform(9.5,22.8,1,1,0,0,0,8.4,22.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:8.5,rotation:17.9608,x:9.6},2,cjs.Ease.sineInOut).to({regX:8.4,rotation:0,x:9.5},2,cjs.Ease.sineInOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5.5,-1.5,79.4,64.5);


(lib.심볼4 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.심볼3();
	this.instance.setTransform(6.55,4.8,1,1,0,0,0,6.2,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:1.0649,scaleY:0.8349,x:6.6},2,cjs.Ease.cubicInOut).to({scaleX:1,scaleY:1,x:6.55},2,cjs.Ease.cubicInOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,16.4,15.4);


(lib.심볼7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 심볼_4
	this.instance = new lib.심볼4("synched",0);
	this.instance.setTransform(62.95,102.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(40));

	// 레이어_2
	this.instance_1 = new lib.심볼2("synched",0);
	this.instance_1.setTransform(72.7,95.75,0.9944,0.9944,0,0,0,35.8,39.9);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C89F92").s().p("ACKAGIgVgDQATgIAVABQAbACAOAPIg8gHgAiUgLQAfgGAWAQIgnAHQghAHgdAAQAWgTAagFg");
	this.shape.setTransform(73.45,67.7663);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("ACnCyQg9gFgtgfQgIgHACgFQgKgDAAgFQABgFAFgBQADgBAFABIBlAKQA1AEAqAAIAFAAIAEAAQAmgBAdgGQAKgCAFABQAJADgCAIQgBAEgEACQgCAHgKAFQgYALghAHQgtALgoAAIgbgCgAkZCVQgggKgWgOQgKgEgCgIQgEgCgBgFQgBgHAKgCQAFgCAKADQAcAJAmAEIAEAAIAFABQAqAFA1AAIBlgBQAGAAACABQAFABAAAFQAAAGgKACQABAFgJAGQgvAag+ABQgzAAg7gUgABRBtQgFgBgBgEQAAgFAFgDIAIgBIAzgEQALAAAEAEQAFAFgEAFQgEAFgLAAIgzABQgEAAgEgCgAhWBsIgzgFQgLgCgDgEQgEgGAFgFQAEgEALACIAyAIIAJADQAEACgBAFQAAAEgFABIgFABIgDAAgADYhtQgUgGgmgHQgqgHgRgFIgHgDQgCgEACgDIABgCQABgDAGgFQAKgFALgFQAUgHATAAQAgACAYAVIAIAJIACAHQAFABADADQAGADgCAIQgCAHgHABIgDABIgKgBgAB2iRIAWADIA7AHQgOgQgagCIgGAAQgTAAgQAIgAjOh0QgOgCgDgHQgCgIAIgIQAOgRAZgKQAcgMAYABQAdADASAUQADgBADABQADABACACQAFAFgFAHQgDACgFACIgkALQgUAGgYACQgSADgQAAIgQgBgAiTigQgZAFgXATQAdAAAhgGIAngIQgQgMgUAAQgIAAgJACg");
	this.shape_1.setTransform(73.3345,82.6998);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).to({state:[{t:this.instance_1}]},20).to({state:[{t:this.instance_1}]},3).to({state:[{t:this.shape_1},{t:this.shape}]},1).to({state:[{t:this.shape_1},{t:this.shape}]},2).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(20).to({startPosition:0},0).to({regY:40,scaleY:0.3103,y:98.5},3,cjs.Ease.cubicIn).to({_off:true},1).wait(3).to({_off:false},0).to({regY:39.9,scaleY:0.9944,y:95.75},5,cjs.Ease.cubicOut).wait(1).to({regX:38.5,regY:25.1,x:75.4,y:81},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regX:35.8,regY:39.9,x:72.7,y:95.75},0).wait(1));

	// 레이어_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["standing_atlas_1"],0);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.291,0,0,0.291,-193.5,-216.3)).s().p("ABNR6IgJgHQgDgCAAgGIAAgJQgDgGgCAJIgDAEIgEAFQjNAejJgSQgFgBgCgEIgCgFQgCgDAAgFQAAgEABgEQADgIAHgFIAGgIIAGgBQADAAACgCIABgDIAAgDQgBglgFgeQgaiOgPiXIAAgCQgUADgJgHQACAGgDADIgHAEIgGAFIgMACQgWACgKgKIgPgDQgggIgXgPQgagLgTgQQgrgjgWg3QgIAOgJANQgIAKgKAHIgRgBIgGgCQgMgRhKgnQhKgngJiGQgJiIDJiNQgNgigFgnQgZisA/hwQgfgFgUgQQgkgcgRgvQACgJgDgEQgCgEAAgGIAAgJIADgCIACgBIABgCIACgBIAAgCIAXgHQANgEALgHIALgEIABAAQACgCADAAIgDgCQgFgGgIgCQgEgBgDgDQgLgCgHgGQgFgFgJgCQgUgRgPgWQhHhnBEhpQAGAAACgDIAEgFIADgDIAGgDIAOgHIAGgFIALgEIABgBIAFgBQAHgIANgEQAagIAYgMIAOgEIACgBIACgBIAagvQAhg/Aqg0QAvgNAmASIAAACIALAFIAGACQAGAFAHACIATAIQAFgHAJgDQAJgCAGgGIAPgDIAGgDQgDgcAGgTQAFgQAJgJQBMgUA6AiIAFABIABABIAFACIAAACIAGABIAHADIAIAFIAAgCQAhgHAcgMQgkgNgUg/QgVg/CHggIABgCQAjgQAqgIQAoABAdANQADADAEACIAHAEIAHAGIADAGIADAFIACABIAAACIAAAGIAAADIAAADIAAADIAAADIgDACIgCABIgBACIgCABIAAADIgXAHQgGADgGAEQgLACgHAGQgGAFgIACIgnAhQgWAVgFAnQAwAGApAOIABACIABACIACABIABACIABACQBZggBnAGIAFADIAGAFIADADQAEAWABAWQABAQgGAKIABACQAJACAGADQAFADAGACIAFADIAEAFIABABIABACQAMgGAKgHQAHgGAJgEQBHgiBNAZQBwghgjAyQgjAyAOAXQAKAEAIAHIALAHIALABIABABIAFABQAXAYAeAQQB3BBACCoIgBABIgMAVQgEAHgJADIgBAIIgBAEIgBADIAAACIgDACQgHABgEAEQgDAEgGABIgdAXQgXASgaAOQgMBRAZB7QAZB6CJCIQCKCIjRDgQgDADgBAEIgEAIIgDAGIgGABQgMACgIgDIgXgTQgFgFgEgFQgOASgMAVQg0BThNA6IgFABQgIAEgJgGIgEgFIgZAYQgPARgYAIIAAACIgFACIgBABIgFABIgBACQgKAFgQgBIgFgEIgDgFIgBgCIgCgBQAFA6AJAzQAeCjACCtQgDAKgKAFQgEACgJABQhcAoh7AAQg3AAg9gIg")
	}.bind(this);
	this.shape_2.setTransform(87.7107,115.4024);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(40));

	// 심볼_9
	this.instance_2 = new lib.심볼9("synched",4);
	this.instance_2.setTransform(146.8,185.2,1,1,0,0,0,35.3,26);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(40));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,182.1,230.8);


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

	// 심볼_7
	this.instance = new lib.심볼7("synched",0);
	this.instance.setTransform(87.7,230.8,1,1,0,0,0,87.7,230.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:1.0354,scaleY:0.9827,y:230.85,startPosition:9},9,cjs.Ease.cubicInOut).to({scaleX:1,scaleY:1,y:230.8,startPosition:19},10,cjs.Ease.cubicInOut).to({scaleX:1.0355,scaleY:0.9822,x:87.75,startPosition:29},10,cjs.Ease.cubicInOut).to({scaleX:1,scaleY:1,x:87.7,startPosition:39},10,cjs.Ease.cubicInOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.1,0,188.6,231);


// stage content:
(lib.standing = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(150.85,159.9,1.2149,1.2149,0,0,0,87.7,115.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(40));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(190.5,169.6,79.10000000000002,130.50000000000003);
// library properties:
lib.properties = {
	id: 'D662FBD8605A664EA97C4A28D7E2DC0A',
	width: 300,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/standing_atlas_1.png", id:"standing_atlas_1"},
		{src:"images/standing_atlas_2.png", id:"standing_atlas_2"}
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
an.compositions['D662FBD8605A664EA97C4A28D7E2DC0A'] = {
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