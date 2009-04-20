YUI.add("datasource-local",function(C){var B=C.Lang,A=function(){A.superclass.constructor.apply(this,arguments);};C.mix(A,{NAME:"DataSource.Local",ATTRS:{source:{value:null}},_tId:0,issueCallback:function(F){if(F.callback){var E=F.callback.scope||this,D=(F.error&&F.callback.failure)||F.callback.success;if(D){D.apply(E,[F]);}}}});C.extend(A,C.Base,{initializer:function(D){this._initEvents();},destructor:function(){},_initEvents:function(){this.publish("request",{defaultFn:C.bind("_defRequestFn",this)});this.publish("data",{defaultFn:C.bind("_defDataFn",this)});this.publish("response",{defaultFn:C.bind("_defResponseFn",this)});},_defRequestFn:function(E){var D=this.get("source");if(B.isUndefined(D)){E.error=new Error(this.toString()+" Source undefined");}if(E.error){this.fire("error",E);}this.fire("data",C.mix({data:D},E));},_defDataFn:function(G){var E=G.data,F=G.meta,D={results:(B.isArray(E))?E:[E],meta:(F)?F:{}};this.fire("response",C.mix({response:D},G));},_defResponseFn:function(D){A.issueCallback(D);},sendRequest:function(D,F){var E=A._tId++;this.fire("request",{tId:E,request:D,callback:F});return E;}});C.namespace("DataSource").Local=A;},"@VERSION@",{requires:["base"]});YUI.add("datasource-xhr",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NAME:"DataSource.XHR",ATTRS:{io:{value:B.io}}});B.extend(A,B.DataSource.Local,{initializer:function(C){this._queue={interval:null,conn:null,requests:[]};},_queue:null,_defRequestFn:function(E){var D=this.get("source"),C={on:{success:function(H,F,G){this.fire("data",B.mix({data:F},G));},failure:function(H,F,G){G.error=new Error(this.toString()+" Data failure");this.fire("error",B.mix({data:F},G));this.fire("data",B.mix({data:F},G));}},context:this,arguments:E};this.get("io")(D,C);return E.tId;}});B.DataSource.XHR=A;},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource-cache",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"cache",NAME:"DataSourceCache",ATTRS:{}});B.extend(A,B.Cache,{initializer:function(C){this.doBefore("_defRequestFn",this._beforeDefRequestFn);this.doBefore("_defResponseFn",this._beforeDefResponseFn);},_beforeDefRequestFn:function(D){var C=(this.retrieve(D.request))||null;if(C&&C.response){this._owner.fire("response",B.mix({response:C.response},D));return new B.Do.Halt("DataSourceCache plugin halted _defRequestFn");}},_beforeDefResponseFn:function(C){this.add(C.request,C.response,(C.callback&&C.callback.argument));}});B.namespace("plugin").DataSourceCache=A;},"@VERSION@",{requires:["plugin","datasource-base","cache"]});YUI.add("datasource-jsonparser",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"parser",NAME:"DataSourceJSONParser",ATTRS:{parser:{readOnly:true,value:B.DataParser.JSON,useRef:true},schema:{}}});B.extend(A,B.Plugin,{initializer:function(C){this.doBefore("_defDataFn",this._beforeDefDataFn);},_beforeDefDataFn:function(E){var D=((this._owner instanceof B.DataSource.XHR)&&B.Lang.isString(E.data.responseText))?E.data.responseText:E.data,C=(this.get("parser").parse(this.get("schema"),D));if(!C){C={meta:{},results:D};}this._owner.fire("response",B.mix({response:C},E));return new B.Do.Halt("DataSourceJSONParser plugin halted _defDataFn");}});B.namespace("plugin").DataSourceJSONParser=A;},"@VERSION@",{requires:["plugin","datasource-base","dataparser-json"]});YUI.add("datasource-polling",function(C){var A=C.Lang,B=function(){this._intervals={};};B.prototype={_intervals:null,setInterval:function(F,E,G){var D=C.later(F,this,this.sendRequest,[E,G],true);this._intervals[D.id]=D;return D.id;},clearInterval:function(E,D){E=D||E;if(this._intervals[E]){this._intervals[E].cancel();delete this._intervals[E];}},clearAllIntervals:function(){C.each(this._intervals,this.clearInterval,this);}};C.augment(C.DataSource.Local,B);},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource",function(A){},"@VERSION@",{use:["datasource-local","datasource-xhr","datasource-cache","datasource-jsonparser","datasource-polling"]});