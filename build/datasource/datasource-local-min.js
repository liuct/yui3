YUI.add("datasource-local",function(C){var B=C.Lang,A=function(){A.superclass.constructor.apply(this,arguments);};C.mix(A,{NAME:"DataSource.Local",ATTRS:{source:{value:null}},_tId:0,issueCallback:function(F){if(F.callback){var E=F.callback.scope||this,D=(F.error&&F.callback.failure)||F.callback.success;if(D){D.apply(E,[F]);}}}});C.extend(A,C.Base,{initializer:function(D){this._initEvents();},destructor:function(){},_initEvents:function(){this.publish("request",{defaultFn:C.bind("_defRequestFn",this)});this.publish("data",{defaultFn:C.bind("_defDataFn",this)});this.publish("response",{defaultFn:C.bind("_defResponseFn",this)});},_defRequestFn:function(E){var D=this.get("source");if(B.isUndefined(D)){E.error=new Error(this.toString()+" Source undefined");}if(E.error){this.fire("error",E);}this.fire("data",C.mix({data:D},E));},_defDataFn:function(G){var E=G.data,F=G.meta,D={results:(B.isArray(E))?E:[E],meta:(F)?F:{}};this.fire("response",C.mix({response:D},G));},_defResponseFn:function(D){A.issueCallback(D);},sendRequest:function(D,F){var E=A._tId++;this.fire("request",{tId:E,request:D,callback:F});return E;}});C.namespace("DataSource").Local=A;},"@VERSION@",{requires:["base"]});