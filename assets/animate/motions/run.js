(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"run_atlas_1", frames: [[0,0,1440,1440]]},
		{name:"run_atlas_2", frames: [[0,0,1440,1440]]},
		{name:"run_atlas_3", frames: [[0,0,1440,1440]]},
		{name:"run_atlas_4", frames: [[0,0,1440,1440]]},
		{name:"run_atlas_5", frames: [[0,0,1440,1440]]},
		{name:"run_atlas_6", frames: [[0,0,1440,1440]]}
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



(lib.걷1 = function() {
	this.initialize(ss["run_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.걷2 = function() {
	this.initialize(ss["run_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.걷3 = function() {
	this.initialize(ss["run_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.걷4 = function() {
	this.initialize(ss["run_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.스탠딩1 = function() {
	this.initialize(ss["run_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.스탠딩2 = function() {
	this.initialize(ss["run_atlas_6"]);
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
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C89F92").s().p("AjjChQhHgpg8hSQgng2g2hpQAQgYAZgSQDyBJCJAIQCWAICPgmQgQApgcAcQBSAIBXgEQAJAHASACQAeAEAIAGQhKBCg8AmQhPAyhLAPQhFAOhMgMQhGgMhEghQgQgHgJgCQgOgEgLAGQgJAFgFANIgIAXQgGAMgJAHQgHAFgGAAQgEAAgEgDg");
	this.shape.setTransform(49.9,29.162);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AkLDhQg/gug2hOQgpg6guhbQgHAFgJgCQgKgDgDgIQgFgLAKgRQAOgbAVgUQAzgvBpgPQCKgUCkAcIByAUQBCAJAygHQAugGBAgaIBsgsQAQgGANABQAQAAAHALQAIAMgIAZQgeBeg1BQQAeABAOAGQAZAKAFAUQAEAaglAgQhOBEgrAbQhtBEiGAEQiFAEhvg+QgMAagLAPQgRAUgUACIgFAAQgVAAgdgUgAlZiUQgoALgcAVQgaARgQAZQA2BoAnA2QA8BTBHApQAKAFALgIQAKgHAFgMIAIgWQAGgNAJgFQAKgGAOADQAJACAQAIQBFAhBFALQBMANBFgOQBMgQBOgyQA8glBLhEQgJgFgdgEQgTgDgJgHIgFgFQgNgRAUgjQAdgxANgZQAWgrAIgjIhSAmQguAUgmALQhhAchRgSQiagjipgCIgLAAQhMAAgwANg");
	this.shape_1.setTransform(50.2527,24.5404);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#F0CFB6").s().p("ADBBkQAcgcAQgoQiPAliWgIQiJgHjyhIQAdgVAogLQAzgOBUABQCpACCaAjQBQASBigcQAlgLAvgUIBRgmQgHAjgWArQgOAZgdAwQgTAjAMASIAGAFQgeACgeAAQg3AAg2gGg");
	this.shape_2.setTransform(52.4,14.7029);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼12, new cjs.Rectangle(0,0,100.5,49.1), null);


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
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_4"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.34,0.004,-0.004,0.34,-211.5,-232.7)).s().p("AAhDIQgKgCgGgFQhJhDgWh1IgfgHIAAgCQgQgJAAgXIAAgDQAFgJgCgOIADgCQAEgDAEgFQAPgEACAKIACABQABANgBANQAQAGANgMQAPgHAIALQAkAPAyADIBJBFQBBBAhdBaQgOAHgNAAQgRAAgOgLgAG1gWIgHgEQgGgEgHgCIgGgEQgGgGgLgCQgEgBgEgEQgngQgqgJQhSgRhbANQgcAEgdAIIgBACIgSADQgVAGAMgFIAAgHIAAgDIAAgEIAAgDIAAgDIACgCIABgCIAFgGQAAAAAAAAQAAgBABAAQAAAAABgBQAAAAABAAQAFgBgCgHIAHgBIAEgCIADgEIADgGIAOgFQABAAAAAAQABAAAAgBQAAAAABgBQAAAAAAgBIAIgGIAGgBQAGgBADgCQAFgDADgEQAEABACgCQAhgIAkgGQBcAFBAAfQADAEAEAAQAJACAEAFQAEAFAHABIAbAcIAKAKQAOAPAIATIAAADIAAADIAAADIgDABIgHgEgAhShCQgHgCgKgUIABgCQgEgCAAAIQgCAIgBgFIgCgEIgEgDQgOgLgIAAQgGAHgJgDQgJgFgEgIQhugmh/AFIAAACIgFAEQAAAAAAAAQgBAAAAAAQAAAAAAABQAAAAAAAAIgMAEQgTAHgKgLQgBgEAAgCIABgGIAEgKQACgGARgKIAVgOQAEgDAKgCQgBAAAAgBQAAAAAAAAQAAAAABAAQAAgBAAAAQAngQAngBQBaADAdAKIAjALQAFACAGAFQAFAGAKABIAgAkQAPANANASIABAOIAAAEQACAEgBAFIAAACIgHAAIgFgBIAAgCQgCgBADAJQABAGgCAAIgDgBgAAehrIABgDQAJgLAKgJQAWgTAbgMQAHAAAFADQACACAGABQAAAHgDADQgGACgBAGQgfAOgdATIgFAEIgIABQgIAAACgIgAg/hwIgFgFQgSgZgVgWIgGgCQgSgIAPgOQANACAKAFIAHADQAeAWALApQgEAHgFAAQgEAAgFgEg")
	}.bind(this);
	this.shape.setTransform(96.8438,102.8063);

	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_4"],0);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.337,0.041,-0.041,0.337,-196.4,-214.7)).s().p("ADkBSQgDgBgCgEIgBgBQgDgCgDAAQgEgHgJgDQgKgEgFgHQg7gcg9gZIgCgEIgEgHIgCgBQgBAAAAgBQAAAAAAAAQAAgBAAAAQAAAAABgBIAAgDQAAgGADgEIABgCIABgCQADABADgCQAcgPApgCQAkAFAZANIALAJQAFAFAGACIAXAcQAVAaARAeIgBAHIAAAKIgCADQAAAAAAAAQgBAAAAAAQAAABgBgBQAAAAAAAAQgKAEgJAAQgQAAgQgKgAkWgWIAAgCQgGgCACgHIgBAAIAAgDQAFgQAMgHQAKgGAIgJIARgEQAEAAADgDQAEABADgBQAYgHAbgDQA2ABAiARQAIAIAFAJQAFAKgEAFIgFACQgFACgHABQAAAAgBABQAAAAAAAAQAAABgBAAQAAAAAAAAIgGAEIgBACIgDABQgwAMg2AAQgoAAgrgHg")
	}.bind(this);
	this.shape_1.setTransform(103.6875,64.6673);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// 레이어_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_3"],0);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.32,0,0,0.32,-233.6,-241.4)).s().p("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")
	}.bind(this);
	this.shape_2.setTransform(115.7991,122.193);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼11, new cjs.Rectangle(0,0,231.6,244.4), null);


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

	// 레이어_5
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_4"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.339,0.014,-0.014,0.339,-205.4,-238)).s().p("AAZDNQgKgDgGgFQhHhFgTh2IgfgIIAAgCQgPgJAAgWIAAgDQAFgJgBgPIADgBQAEgEAEgFQAPgDACAKIACABIAAAbQAPAGANgMQAPgGAIALQAkAQAyAEIBHBHQA/BBhgBYQgNAGgMAAQgRAAgPgLgAGzgGIgHgFQgGgDgHgCIgGgFQgFgGgMgDQgEgBgDgDQgngSgqgKQhSgUhaALQgdAEgdAHIgCACIgRADQgVAFAMgFIAAgHIAAgDIAAgEIAAgDIAAgDIACgCIABgCQADgCACgEQABAAAAgBQAAAAABAAQAAgBAAAAQABAAAAAAQAGgBgCgHQADAAADgBIAFgCIADgDIADgHIAOgEQABAAAAAAQABAAAAgBQABAAAAAAQABgBAAAAIAHgHQAEABADgBQAFgBAEgCIAIgGQAEAAADgBQAggIAkgFQBdAHA+AhQADAEAEABQAJACAEAFQAEAEAHACIAaAdIAKAKQANAPAIAVIAAACIAAAEIgBACIgCABIgHgEgAhThBQgGgCgKgVIAAgCQgDgCgBAJQgBAIgCgGIgBgEIgEgCQgOgMgIAAQgGAHgJgEQgJgFgEgIQhtgoh/ACIAAACIgFACQAAAAAAAAQAAABAAAAQgBAAAAAAQAAABAAAAIgMADQgTAHgKgLIAAgHIABgFIAEgKQADgGAQgKIAVgNQAFgDAJgCQAAAAAAgBQAAAAAAAAQAAAAAAAAQABAAAAAAQAngQAoAAQBZAGAdALIAjALQAFADAFAFQAGAGAJACIAfAkQAPAOAMASQgBAHACAGIgBAEQACAEAAAFIgBACIgGAAIgGAAIAAgCQgCgCADAJQABAGgCAAIgDgBgAAfhnIAAgDQAJgKALgJQAWgSAcgMQAHABAEACQADADAGABQgBAHgDADQgGACgBAFQggAOgdASIgFAEIgHABQgJAAADgJgAg/huIgFgFQgRgagUgWIgGgCQgRgIAOgOQAOACAJAFIAHAEQAdAWAKApQgDAHgGAAQgEAAgFgEg")
	}.bind(this);
	this.shape.setTransform(106.6667,101.5675);

	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_4"],0);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.336,0.05,-0.05,0.336,-190.5,-220.1)).s().p("ADjBXQgDgBgDgFIgBgBIgGgCQgDgGgJgEQgKgEgGgHQg6geg8gbIgCgEIgEgHIgCgCIAAgCIABgEQAAgFADgEIAAgBIACgDQADABADgCQAcgOAogBQAlAGAaAOIAKAJQAFAFAGACIAWAcQAVAcAQAfIgCAGIgBAKIgBADQAAAAAAAAQgBABAAAAQAAAAgBAAQAAAAgBAAQgIADgJAAQgQAAgQgLgAkVgfIAAgCQgGgCACgHIgBgBIAAgDQAGgPALgHQALgGAJgIQAHAAAJgDQAEAAAEgDQAEABADgBQAXgGAcgDQA2ADAiASQAHAIAFAJQAFAKgEAEIgFADIgNACQAAAAAAABQAAAAAAAAQgBAAAAABQAAAAgBAAIgFAEIgCACQAAAAAAABQAAAAgBAAQAAAAgBAAQAAAAgBAAQgqAJgvAAQguAAgygJg")
	}.bind(this);
	this.shape_1.setTransform(114.2625,64.1338);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(5));

	// 심볼_6
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_2"],0);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.325,0,0,0.325,-236.9,-227.7)).s().p("ABxP7QgwgGgtgJIhMgRIgdgGQgxgohUgZQhPgYh2gQIhSgLQgSgDgpgPQgpgQgOACQgPACgDgBIgogLQgRgDgvgBQgugBA2gJQA2gJgBgDIgBgDIAAgEQAEgJAFgJQALgTAOgSIAMgQIgBgCIgSgGIgCAAQgCgCgDAAQiMAKAKg8QAJg9A7hEQgwgIg1AOIAAALIgCAaQAAAIgDAFQgCAEAAAGIgFAHIgGALIgEAFIgEAGQgLABgGACQgOAEgLgEQgEgCgCgDIgCgBIgBgCIgCgBQgCgBgDAAQgCgIgEgGQgQgUgKgZIgLgaIgDADQgGADgEAEIgDADIgNAEQgHAGgJADQgnAMgkgMIgEgFIgFgFQgCgCgCgEIgBgCIgDgBQgGg+AXgwQARgjAJgbQhCAAgwgRIgBgCIgFgCIgBgBIgDgBIAAgDIgCgBIgBgDQAAAAAAgBQAAAAAAAAQAAAAAAgBQgBAAAAAAQAAAAAAgBQgBAAAAAAQAAAAgBAAQAAAAgBAAQAAgFgagEQgagEAZgFQAagFABgCIAAgFIAAgDQAUgbAcgSQAPgKAJgNQAKAAAEgGQADgDAGgBIAHgDIAAgCIAFgDIABgCIAEgCIAJgCIABgBIAFgCIABgCIAigMQATgIASAHIgKgeQgEgLABgSQABgJgEgEQAFgqAbgVQAOgLAQgKQAGgCAFgDQAJgGAMAHQAIAEAFgKQAMgrASgkQAJgSANgNIgGgDIgJgEIgBgBIgHgBIgLgIQgZgQgNgcIgMgXQgBgRgCgKQgEgYAAgYIAAgXIACAAQgBgHAFgBIABgCIAAgCIACgCIABgCQAPgIAOgBQBCgCAwgZQAdgKAWgQIAVgRQgJhEAcg0QARghANgqQgOgzgCg+QgCgsAIgiQAGgIAGgLQAvhhCVAOQAdggAhgeQAlgiAsgbIAGgBIACgBIAFgDIABAAIAGgBQADgHAJgDQALgFAPgEQAEgBADgDQAIAAAIgDQAtgOA5gDQAvABAoAJQApAiANBAQANBAgJBIQAAAAABgBQAAAAABAAQAAAAAAAAQABAAAAAAQAugCAggNQAFgDADgGQARgYAXgSQALgIAJgJQAEAAACgCIACAAIAFgDIABgBIAGgBIAGgEIABgBIAFgDIACgBIAFgBQAEgGAJgBQAFgBAFgCIAHgGQC1grCUBCIAHAJIAHAGIADACQAEACgCAHIAAADIgDAEIgBACIgCABIgBACIgDABIgIACIgEAAIgLgBIgJAAIgVABIgTACIgGADIgBAAQgFAAgCACQAAAAAAAAQgBABAAAAQgBABAAAAQAAABAAABIABAEQADAEAIgBQAbgDAmAAIADALQAEAVg/APQgiAIg7gGQAQAFAOAHQADACACACQADAFAEACIAFAEIACACIAAACIAAAOIgBAMIgBAHIgBAHIABABIAJADIABABIAGABIAFAEIACACIACABIABABIAGACQBEgtByAMQADADAEACIAQAFIAHADIAAACQAIABADAGQACAEAFACIACABIACAAQAXAjAYAgQAOASALAUQCfgYB/A4IALALQASATAGAbQAEAQAHAMIAAADIgBACIgCACIgBACQAGAgArBeQAqBeghCLQghCJmFiGQgBA9ALAxIAJAzQCIgRgKBBQgMBBA0AiIDKgKIABADIACAHIAAADIABADIACABIAAADQgPBAgYA2QgnBYg3BGQAEAAACABQARAHAWAFQAEAAAEADQADAAACACIAKAGIAHAFIAEADIAAADQAFABgCAHQAAAAAAAAQAAABAAAAQAAAAABAAQAAAAAAABIABACIABACIAAADIAAADIgDAHIAAADIAAAEIAAADIAAADQgXAsgaAoQhNBxh6BDIAAABIgFADIgCABIgFABQhtA5ifgSIgEgGIgEgFQgDgCgBgDIgBgDIgDAAQgCAGgGAFQgJAHgKAGQgIAFgKADQhXAtiDgMIAAADIAAADIAAAEIgBACIgCACIAAACQAHAHgMAEQgMAFgKAHQgDABAAAEQgTACgPAPQgPAQggAIQgRADgVAAQgTAAgWgDg")
	}.bind(this);
	this.shape_2.setTransform(120.8084,102.2482);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(5));

	// 레이어_3
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A18281").s().p("AgiBkQghgegggiQDbA1DegBIAFAQIALAlQgmADglAAQihAAicgsgAihgpIgDgKQgCgPAFgSIAFgNQAFABAHgIQAVgSAXgJQAQgFAKADQARAGADAaQABARABAFQAEAOALACQAIABANgHQAVgNAQgCQAYgCANAPQAFAGAIAUQAHARAMAEQAKADAUgIQAggMASAMQADACAKAMQAIAJAHACQAHACALgDQAGgCAMgFQAKgDAJgBIAAAGQABAKAKAEQAHADARgEIAPgEQAIAKAHAQIALAbQj6gXjwhGgAlVgpQgJgHgHgKIACgHQAFgTAUgUQAVgWATAEQAFABALAFQAJAFAGAAQAIABAKgFIAPgJQAggTAaAAIADABIgSAdQgRAgABAaQAAAIADAJIgxAQQgVAHgMAFQglgIgagXg");
	this.shape_3.setTransform(99.8125,223.9063);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFEFEB").s().p("ADqBKQgfgGgZAOQgHgTgOgOQgPgPgTgGQgSgGgVADQgUAEgQALQgGgWgJgMQgLgQgSgEQgTgDghARIgTANIAthcQARADAgANQCfA/CJBcQgWABgSAKQgTgXgegGgAk4AcQgLgkABgyQABgUACgYIADABQBbABBMAHQAwAEAiAHQAMACAHgBIgZA0QgHgDgMAAQguACgkAcQgFADgEABQgCAAgIgCQgZgHgSAGQgXAGgXAhQgLAQgDANQgKgRgGgWg");
	this.shape_4.setTransform(92.4582,209.4375);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFD68B").s().p("AgTBJQgFgHgLgLIgtgnQDBA2DIgNIAEAUQAGAaABAWQi+gbiZgZgAiQguIgigkQgVgYgHgSQDwBHD5AWIAOAkIgIAAQjaAAjXgzgAlDhdQALgGAWgHIAwgQQAFAPAJAQIgMABIgYABIgNABQgZAAgVgFg");
	this.shape_5.setTransform(104.35,232.275);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFD5D5").s().p("ACbFMQgvgBhYgHIhFgQQAUgMAGgIQAGgGACgHIDyAsIAlAHQgvAGg3AAIgHAAgAitC0IADgZIAYAZIgEAAIgMABQgHAAgEgBgAECA1IgEgCIABgBQADgHgDgFQgDgGgMgHQhig5g+gfQhZguhOgaIgqgMIAWgtQADgGgCgEQgCgEgGABQgFACgEAEQgPARgPAdIgFgFQgEgEgOgBIhxgEQhDgDguABQgVAAgKACIAAAAQAFgwAMhAIABgDQAFABAEgEQAGgEACgMQAEgNAEgEQAFgFAOgCQBMgMBfANQA4AIBzAaQCgAkBAARQB+AhBeAoQALAFAIAHIgBADQgCACgBALQgGA8gjAvQglAxhCAcIgWAIIgGgDg");
	this.shape_6.setTransform(104.05,214.3313);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("ABHFyQhVgGhBgYQgcgKgBgRQAAgQAXgLIARgIQAKgFAFgGQgMgNg1gyIgDAEQgFAGgMABQgVABgSgFQgOgEgEgHQgFgIAEgRIAIgqIgJgLQgFADgJABQg+AGgtgLQg6gPgjgmQgfgjgMg4QgIgpAEg9QAGhOAWhVIABgCQgHgKADgOQADgPALgMQAKgLAOgGQAVgKAmgCQBHgDBYANQA4AIBmAXQCQAfBVAXQB9AiBiAoQAPAGAIAKQAIALgHAQIgDAGQAEAEAAALQAAAqgRApQgQAngeAeQgrAug/AZQAKAPAKAWQAOAeATA3QAWBCAFAoIgBADIABAJIAAAMQgBAHgDAGQgFAJgJAFQgKAEgfgFIgGgBQgcAHgxABIhOABQgvAAgfgCgAgSEhQgHAIgUAMIBFAQQBYAHAvABQA8AAAxgGIglgHIjygsQgCAHgFAGgAjHAMQgFASACAPIADAKQAHATAVAXIAiAkQAgAhAhAfIAsAnQALAKAFAHQCZAaC+AbQgBgXgFgZIgFgUIgLglIgFgQIgOgkIgKgbQgHgQgIgLIgPAFQgRAEgHgDQgKgEgBgLIAAgGQgJAAgKAEQgMAFgGACQgLADgHgCQgHgCgIgJQgKgMgDgCQgSgMggAMQgUAIgKgDQgMgEgHgRQgIgUgFgGQgNgPgXACQgQACgWANQgNAHgIgBQgLgCgEgOQgBgFgBgQQgDgagRgGQgKgDgQAFQgXAJgVASQgHAHgFAAIgFAMgAioC1QAGACAQgCIAEAAIgYgZgAlwgHQgUATgFATIgCAHQAHAJAJAIQAaAXAlAIQAbAGAggBIAZgCIALAAQgJgQgEgPQgDgJAAgIQgBgaARgfIASgeIgDAAQgaAAggATIgPAJQgKAFgIgBQgGAAgJgFQgLgFgFgBIgGgBQgQAAgSATgAhmjJQADAEgEAGIgWAtIAqAMQBOAaBZAuQA+AfBjA5QALAHADAGQADAFgDAHIgBABIAFACIAFADIAWgIQBCgcAlgxQAkgvAFg8QABgLACgCIABgDQgIgHgLgFQhegoh9ghQhBgRifgkQhzgag4gIQhggNhMAMQgOACgFAFQgEAEgDANQgDAMgFAEQgEADgGAAIAAADQgNBAgFAwIAAAAQAKgCAVAAQAugBBDADIBxAEQAOABAFAEIAEAFQAPgdAPgRQAEgEAFgCIADAAQADAAACADgAB6AaQAfAGASAXQATgKAVgBQiJhcidg/QgigNgRgDIgtBdIAUgNQAhgSATADQASAEAMARQAJAMAFAWQARgLAUgEQAUgDASAGQATAGAOAOQAPAOAGATQASgKAUAAQAJAAAJACgAmxhqQgBAyAKAlQAGAVAKARQAEgNALgPQAWghAXgHQATgGAYAIQAIACACAAQAEgBAFgEQAkgcAvgCQALAAAHADIAZg0QgHABgLgCQgjgHgwgEQhMgHhbgBIgDgBQgCAYAAAUg");
	this.shape_7.setTransform(103.6306,214.2411);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3}]}).wait(5));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,241.6,251.4);


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

	// 레이어_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_4"],0);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.338,0.034,-0.034,0.338,-201,-210.4)).s().p("ADmBOQgDgBgDgEIgBgBIgGgCQgDgGgKgEQgKgDgGgHQg8gbg8gYQgDgCAAgCIgEgHIgCgBIAAgDIAAgDQAAgGADgEIAAgBIACgDQADABACgCQAcgQAogCQAlADAaANIALAJQAFAEAHADIAWAbQAXAaARAeIgBAHIAAAKIgBACQAAABgBAAQAAAAgBAAQAAABAAAAQgBAAAAgBQgKAFgKAAQgPAAgPgKgAkXgPIAAgCQgGgCACgHIgBgBIAAgDQAEgPAMgIQAKgGAIgJQAHgBAKgDQAEAAADgDQAEAAADgBQAXgHAbgEQA3AAAjARQAHAHAFAJQAFAKgDAFIgFACIgNADQAAABAAAAQAAABAAAAQAAAAAAAAQgBAAAAAAIgFAFIgCACIgDABQg1AOg7AAQgkAAglgFg")
	}.bind(this);
	this.shape.setTransform(107.6125,63.012);

	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_4"],0);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.34,-0.003,0.003,0.34,-216.3,-228.4)).s().p("AAnDFQgKgCgGgFQhLhBgZh1QgOgEgRgCIAAgCQgPgIgBgXIAAgDQAEgJgCgPIADgCQAEgDAEgGQAPgDACAKIACAAIABAbQAPAGANgNQAPgHAJALQAkAOAzACIBKBDQBCA+hbBdQgPAHgNAAQgQAAgOgKgAG2giIgHgEQgHgDgGgCIgGgEQgGgGgMgCQgEgBgDgDQgogQgrgIQhSgQhaAQQgcAFgdAIIgBACIgRAEQgVAGALgFIAAgHIAAgEIAAgDIAAgEIAAgDIACgCIABgCIAEgGQABAAAAAAQAAgBABAAQAAgBAAAAQABAAAAAAQAGgBgDgHIAHgBIAEgDIADgDIADgHIAOgEQAAAAABgBQAAAAABAAQAAgBABAAQAAgBAAAAIAHgHIAHgBQAFgBAEgCQAFgDADgEQADABADgCQAggJAkgHQBdADBAAeQADADAEABQAJABAEAGQAEAEAHABIAcAcIAKAJQAOAPAJAUIAAACIAAAEIAAACIgDABIgHgEgAhThDQgGgCgKgUIAAgCQgDgCgBAJQgBAIgCgGIgCgEIgDgCQgOgLgIAAQgHAIgIgEQgJgFgFgHQhvgjh+AIIAAACIgFADQgBAAAAAAQAAAAAAAAQAAABAAAAQAAAAAAABIgMADQgTAIgKgLIgBgGIABgGIADgKQADgGAQgKIAUgOQAFgEAJgCQAAAAAAgBQAAAAAAAAQAAAAAAAAQABgBAAAAQAmgRAogCQBZACAdAJIAkAKQAFACAGAFQAFAFAKACIAgAiQAQAOANARQAAAHABAGIAAAEQACAEAAAFIgBACIgGABIgGgBIAAgCQgCgBADAJQACAGgDAAIgDgBgAAehvIAAgDQAJgKAKgJQAVgUAbgNQAHAAAFADQADADAGAAQgBAHgDADQgFACgBAGQggAPgbAUIgFADIgJACQgHAAACgJgAhAhxIgFgFQgTgZgVgVIgGgCQgSgHAOgPQAOACAKAFIAGADQAeAVAMAoQgDAIgFAAQgEAAgFgEg")
	}.bind(this);
	this.shape_1.setTransform(101.375,101.6087);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// 레이어_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["run_atlas_1"],0);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.327,0,0,0.327,-246.1,-243.3)).s().p("AvGQrQg9h+AWimQAKgDANACIABAAIAGABQABAHAFAEQADACACAHQAAAAAAAAQAAABAAAAQABAAAAAAQABABAAAAQAFABgCAHIA6gmQAVgPAXgNQADAAACgBIACgBIAFgCIABgBIAGgBIAHgGIAGgDIAGgCIABgCIAHgDIAMgFIABgBQADgBADAAQADgDAEgCQAKgDAHgEIAMgFIAGgDQAFgDAGgCIAFgDIABgCIAHgDIAJgDIAGgBIABgCIAGgDQAJgCAHgDIACgBIACgBIAAgRIgBgMIgBgEIgBgKQADgKAFgIQALgTAOgSIAMgRIAAgCIgTgGIgBAAQgCgCgEAAQgugZgNg3QgNgzAKgwQgwgJg1APIgBAKIgBAaQgBAJgCAFQgCAEAAAFQgDADgCAEIgGAMIgEAFIgEAFQgLABgHACQgOAFgLgEIgGgEIgBgCIgCgCIgBgBIgGgBQgCgJgEgFQgQgUgKgZIgLgaIgDACQgHADgDAEIgDADIgNAEQgHAGgKADQgnAMgkgLIgEgGIgFgFQgCgCgBgEIgCgCIgCgBQgGg+AXgxQAQgjAJgbQhCABgwgRIgBgCIgFgDIgCgBIgCgBIgBgCIgBgCIgBgCIgBgDIgDgBIAAgKIAAgJIAAgHIAAgDIAAgDQAUgcAcgTQAPgJAJgNQAKAAAEgGQADgEAGgBIAHgCIABgCIAFgDIAAgCIAEgCIAJgDIABAAIAFgDQAAAAAAAAQABAAAAAAQAAgBAAAAQAAAAAAgBIAjgMQASgHATAGIgKgcQgEgMABgSQABgIgEgFQAFgqAbgVQAOgLAQgLQAGgBAGgEQAIgFANAGQAIAFAFgKQAMgsASgkQAJgTANgNIgHgDIgJgEIgBgBQgDgCgDAAIgMgHQgYgRgOgcIgMgXQAAgQgCgLQgFgXAAgZIAAgXIACAAQAAgHAFgBIAAgCIABgCIABgCIABgCQAPgIAOgBQBDgCAwgZQAdgKAWgRIAVgQQgIg+AWgyQAOgdALggIADgBIABgBIAFgDIABgCIAAgDQgKg5gEg9QgEgxAIgnQAHgIAFgLQAwhhCWAPQAdghAggeQAmgiAtgcQADAAACgBIACgBIAFgCIABgBQADgBADAAQAEgGAIgEQALgFAQgEQAEgBADgDQAIAAAIgCQAtgOA5gEQAwABAoAJQAqAjAMA/QANBBgJBJIADgCQAugCAhgNQAFgDADgFQAQgYAYgSQALgJAJgJQAEAAACgCIACAAIAFgDIABgBQADgBADAAIAGgEIABgBIAFgDIACgBIAGgBQADgGAKgBQAFgBAEgDQAEgCADgDQC2grCUBCIAIAJIAHAGIADACQAEACgCAHIgBADIgCAEIgBACIgCACIgBABIgDABQiMAPiKAfIARACQBLAFA3AZQAEACABADQADAEAFADIAFAEIABACIABACIAAANIgBANIgBAHIgBAGIAAACIAJADIABABIAGABIAGAEIACACIABABIACABQACACAEAAQBEguBzANQADADAEACIAPAFIAHADIAAACQAJABADAGQACAEAFACIACABIACAAQAXAjAYAgQAOASALAUQCggYCAA5IALALQASATAGAaQAEARAHAMIAAADIgBADIgCABIgBADQAGAgAjBhQAjBhgvCIQgvCIlciHQgBA9ALAyIAKA0QApAdAhAmQAoAtA0AjIDLgKIABADIACAHIABADIAAACIACACIABACQgQBBgYA2QgnBYg3BHIAGABQARAIAWAEQAEAAADAEQADAAACABIALAHIAHAFIADADIABACQAFABgCAHQgBABAAAAQAAAAAAAAQAAABABAAQAAAAAAAAIACACIABACIAAAEIgBADIgCAHIgBADIAAADIAAADIAAAEQgWAsgbAnQhMBzh7BDIgBACIgFACIgBABQgDABgDAAQhtA6ifgTIgFgFIgEgFIgEgGIgBgCIgDgBQgDAHgFAEQgJAIgKAFQgJAFgKADIAAACQhEAdhPAFQAUA5ALBBQAPBYgaA+QgVAKgYgMIgOgIQgKAAgEgFIgFgFQgFgDgJAAQgYAhggAZQguAlg3AdQgDAFgGADIgIAEIgFADIgBACIgGABIgBABIgFACIgBABQgDABgDAAQgEAGgJACQgFAAgFADIgHAGQhQAThSgTIgHgEIgKgFIgGgDIAAgCQgKAAgEgFQgDgEgGgBIgHgDQgmgfgfgnQgXgegTgiIgCgBIgCgBIgFgCIgBgBQgDgBgDAAIgHgGIgFgFIgCgBQgEgBgFAAQgYAKgbAJQgFACgDAFQgYAEgVAGQgPAFgMAIIgHADIgJADIgGACIgBACIgQAFIgHAEIgGAEIgNAEIgKAFIgHAEIgGABIgBABIgFACIgBABIgGABQgEAEgEABQgJADgHAEIgMAFIgHAEIgQAGIgHADQgQALgXAGQgJADgHAGQgEAAgCABQhdAuhyAMQg/g3gnhSg")
	}.bind(this);
	this.shape_2.setTransform(118.597,120.375);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.심볼6, new cjs.Rectangle(0,0,237.2,240.8), null);


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

	// 심볼_10
	this.instance = new lib.심볼10();
	this.instance.setTransform(118.9,254.9,1,1,0,0,0,120.8,246.3);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(5).to({_off:false},0).to({regY:246.5,scaleX:1.0461,scaleY:0.9702,rotation:-1.3283,x:119.1,y:255.1},4,cjs.Ease.cubicOut).to({_off:true},1).wait(5).to({_off:false,regY:246.3,scaleX:1,scaleY:1,rotation:0,x:118.9,y:254.9},0).to({regY:246.5,scaleX:1.0461,scaleY:0.9702,rotation:-1.3283,x:119.1,y:255.1},4,cjs.Ease.cubicOut).wait(1));

	// 심볼_6
	this.instance_1 = new lib.심볼6();
	this.instance_1.setTransform(118.6,127.5,1,1,0,0,0,118.6,127.5);

	this.instance_2 = new lib.심볼11();
	this.instance_2.setTransform(115.8,122.2,1,1,0,0,0,115.8,122.2);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:118.4,regY:127.4,scaleX:0.9997,scaleY:1.0003,skewX:-2.0527,skewY:-1.8657,x:118.5,y:111.85},4,cjs.Ease.cubicOut).to({_off:true},1).wait(15));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(10).to({_off:false},0).to({regX:115.9,rotation:-3.2619,x:115.9,y:110.95},4,cjs.Ease.cubicOut).to({_off:true},1).wait(5));

	// 레이어_7
	this.instance_3 = new lib.심볼12();
	this.instance_3.setTransform(107.4,201.2,1,1,0,0,0,6.9,24.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({rotation:10.7117,x:107.45,y:184.15},4,cjs.Ease.cubicOut).to({rotation:0.7545,y:206.2},1).to({rotation:10.7117,y:212.9},4,cjs.Ease.cubicOut).to({regX:7,scaleY:0.9205,rotation:0,skewX:-169.2885,skewY:10.7117,x:112.4,y:194.25},1).to({scaleY:0.9206,skewX:-184.2873,skewY:-4.2871,x:129.45,y:183.3},4,cjs.Ease.cubicOut).to({regX:6.9,scaleY:1,rotation:0.7545,skewX:-360,skewY:0,x:107.45,y:206.2},1).to({rotation:10.7117,y:212.9},4,cjs.Ease.cubicOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.8,-19.3,257.3,280.7);


// stage content:
(lib.run = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(154.55,160.15,1,1,0,0,0,118.6,120.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(20));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(176.2,174.7,101.5,125.19999999999999);
// library properties:
lib.properties = {
	id: '731FDF231B653D4D888CD32EA550BDA8',
	width: 300,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/run_atlas_1.png", id:"run_atlas_1"},
		{src:"images/run_atlas_2.png", id:"run_atlas_2"},
		{src:"images/run_atlas_3.png", id:"run_atlas_3"},
		{src:"images/run_atlas_4.png", id:"run_atlas_4"},
		{src:"images/run_atlas_5.png", id:"run_atlas_5"},
		{src:"images/run_atlas_6.png", id:"run_atlas_6"}
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
an.compositions['731FDF231B653D4D888CD32EA550BDA8'] = {
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