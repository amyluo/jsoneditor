/*

 This json editor is open sourced with the intention to use the editor as 
 a component in your own application. Not to just copy and monetize the editor
 as it is.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy 
 of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under
 the License.

 Copyright (c) 2011-2012 Jos de Jong, http://jsoneditoronline.org

 @author  Jos de Jong, <wjosdejong@gmail.com>
 @date    2012-04-21
*/
if(!Array.prototype.indexOf)Array.prototype.indexOf=function(a){for(var b=0;b<this.length;b++)if(this[b]==a)return b;return-1};var JSON;JSONEditor=function(a,b){if(!JSON)throw Error("Your browser does not support JSON. \n\nPlease install the newest version of your browser.\n(all modern browsers support JSON).");if(!a)throw Error("No container element provided.");this.container=a;this._createFrame();this._createTable();this.set(b||{})};JSONEditor.focusNode=void 0;
JSONEditor.prototype.set=function(a){this.content.removeChild(this.table);this._setRoot(new JSONEditor.Node({value:a}));this.node.expand(!1);this.content.appendChild(this.table)};JSONEditor.prototype.get=function(){JSONEditor.focusNode&&JSONEditor.focusNode.blur();return this.node?this.node.getValue():{}};JSONEditor.prototype.clear=function(){this.node&&(this.node.collapse(),this.tbody.removeChild(this.node.getDom()),delete this.node)};
JSONEditor.prototype._setRoot=function(a){this.clear();this.node=a;this.tbody.appendChild(a.getDom())};JSONEditor.prototype.expandAll=function(){this.node&&(this.content.removeChild(this.table),this.node.expand(),this.content.appendChild(this.table))};JSONEditor.prototype.collapseAll=function(){this.node&&(this.content.removeChild(this.table),this.node.collapse(),this.content.appendChild(this.table))};
JSONEditor.Node=function(a){this.dom={};this.expanded=!1;a&&a instanceof Object?(this.setField(a.field,a.fieldEditable),this.setValue(a.value)):(this.setField(),this.setValue())};JSONEditor.Node.prototype.setField=function(a,b){this.field=a;this.fieldEditable=b==!0};JSONEditor.Node.prototype.getField=function(){if(this.field===void 0)this.field=this._getDomField();return this.field};
JSONEditor.Node.prototype.setValue=function(a){var b=this.childs;if(b)for(;b.length;)this.removeChild(b[0]);this.type=this._getType(a);if(this.type=="array"){this.childs=[];for(var c=0,d=a.length;c<d;c++)b=new JSONEditor.Node({value:a[c]}),this.appendChild(b);this.value=""}else if(this.type=="object"){this.childs=[];for(c in a)a.hasOwnProperty(c)&&(b=new JSONEditor.Node({field:c,value:a[c]}),this.appendChild(b));this.value=""}else this.childs=void 0,this.value=a};
JSONEditor.Node.prototype.getValue=function(){if(this.type=="array"){for(var a=[],b=this.childs,c=0,d=b.length;c<d;c++)a.push(b[c].getValue());return a}else if(this.type=="object"){a={};b=this.childs;c=0;for(d=b.length;c<d;c++){var f=b[c];a[f.getField()]=f.getValue()}return a}else{if(this.value===void 0)this.value=this._getDomValue();return this.value}};JSONEditor.Node.prototype.getLevel=function(){return this.parent?this.parent.getLevel()+1:0};
JSONEditor.Node.prototype.clone=function(){var a=new JSONEditor.Node;a.type=this.type;a.field=this.field;a.fieldHTML=this.fieldHTML;a.fieldEditable=this.fieldEditable;a.value=this.value;a.valueHTML=this.valueHTML;a.expanded=this.expanded;if(this.childs){for(var b=this.childs,c=[],d=0,f=b.length;d<f;d++){var e=b[d].clone();e.parent=a;c.push(e)}a.childs=c}else a.childs=void 0;return a};
JSONEditor.Node.prototype.expand=function(a){if(this.childs){this.expanded=!0;if(this.dom.expand)this.dom.expand.className="jsoneditor-expanded";this.showChilds();var b=this.childs;if(a!=!1)for(var c=0,d=b.length;c<d;c++)b[c].expand(a)}};JSONEditor.Node.prototype.collapse=function(a){if(this.childs){this.hideChilds();var b=this.childs;if(a!=!1)for(var c=0,d=b.length;c<d;c++)b[c].collapse(a);if(this.dom.expand)this.dom.expand.className="jsoneditor-collapsed";this.expanded=!1}};
JSONEditor.Node.prototype.showChilds=function(){var a=this.childs;if(a&&this.expanded){var b=this.dom.tr,c=b.parentNode;if(c){var d=this.getAppend();(b=b.nextSibling)?c.insertBefore(d,b):c.appendChild(d);for(var b=0,f=a.length;b<f;b++){var e=a[b];c.insertBefore(e.getDom(),d);e.showChilds()}}}};JSONEditor.Node.prototype.hide=function(){var a=this.dom.tr,b=a?a.parentNode:void 0;b&&b.removeChild(a);this.hideChilds()};
JSONEditor.Node.prototype.hideChilds=function(){var a=this.childs;if(a&&this.expanded){var b=this.getAppend();b.parentNode&&b.parentNode.removeChild(b);for(var b=0,c=a.length;b<c;b++)a[b].hide()}};
JSONEditor.Node.prototype.appendChild=function(a){if(this.type=="array"||this.type=="object"){a.parent=this;a.fieldEditable=this.type=="object";if(this.type=="array")a.index=this.childs.length;this.childs.push(a);if(this.expanded){var b=a.getDom(),c=this.getAppend(),d=c?c.parentNode:void 0;c&&d&&d.insertBefore(b,c);this._updateStatus(a.index);a.showChilds()}a.updateDom()}};
JSONEditor.Node.prototype.moveBefore=function(a,b){if(this.type=="array"||this.type=="object"){var c=this.dom.tr?this.dom.tr.parentNode:void 0;if(c){var d=document.createElement("tr");d.style.height=c.clientHeight+"px";c.appendChild(d)}var f=a.parent;f&&f.removeChild(a);b instanceof JSONEditor.AppendNode?this.appendChild(a):this.insertBefore(a,b);c&&c.removeChild(d)}};
JSONEditor.Node.prototype.insertBefore=function(a,b){if(this.type=="array"||this.type=="object"){if(b==this.append)a.parent=this,a.fieldEditable=this.type=="object",this.childs.push(a);else{var c=this.childs.indexOf(b);if(c==-1)throw Error("Node not found");a.parent=this;a.fieldEditable=this.type=="object";this.childs.splice(c,0,a)}if(this.expanded){var d=a.getDom(),f=b.getDom(),e=f?f.parentNode:void 0;f&&e&&e.insertBefore(d,f);a.showChilds()}a.updateDom();this._updateStatus(c)}};
JSONEditor.Node.prototype.focus=function(){if(this.dom.tr&&this.dom.tr.parentNode){var a=this.fieldEditable?this.dom.field:this.dom.value;a&&a.focus()}};JSONEditor.Node.prototype.blur=function(){this._getDomValue(!0);this._getDomField(!0)};JSONEditor.Node.prototype._duplicate=function(a){this.insertBefore(a.clone(),a)};JSONEditor.Node.prototype.containsNode=function(a){if(this==a)return!0;var b=this.childs;if(b)for(var c=0,d=b.length;c<d;c++)if(b[c].containsNode(a))return!0;return!1};
JSONEditor.Node.prototype._move=function(a,b){if(a!=b){if(a.containsNode(this))throw Error("Cannot move a field into a child of itself");a.parent&&a.parent.removeChild(a);var c=a.clone();a.clearDom();b?this.insertBefore(c,b):this.appendChild(c)}};JSONEditor.Node.prototype.removeChild=function(a){if(this.childs){var b=this.childs.indexOf(a);if(b!=-1)return a.hide(),a=this.childs.splice(b,1)[0],this._updateStatus(b),a}};
JSONEditor.Node.prototype._changeType=function(a){var b=this.type;if((a=="string"||a=="auto")&&(b=="string"||b=="auto"))this.type=a;else{var c=this.dom.tr?this.dom.tr.parentNode:void 0,d;d=(d=this.expanded?this.getAppend():this.getDom())&&d.parentNode?d.nextSibling:void 0;this.hide();this.clearDom();this.type=a;if(a=="object"){if(!this.childs)this.childs=[];for(var f=this.childs,e=0,g=f.length;e<g;e++){var h=f[e];h.clearDom();delete h.index;h.fieldEditable=!0;if(h.field==void 0)h.field=e}if(b=="string"||
b=="auto")this.expanded=!0}else if(a=="array"){if(!this.childs)this.childs=[];f=this.childs;e=0;for(g=f.length;e<g;e++)h=f[e],h.clearDom(),h.fieldEditable=!1,h.index=e;this._updateStatus();if(b=="string"||b=="auto")this.expanded=!0}else this.expanded=!1;c&&(d?c.insertBefore(this.getDom(),d):c.appendChild(this.getDom()));this.showChilds()}if(a=="auto"||a=="string")this.value=a=="string"?String(this.value):this._stringCast(String(this.value)),this.focus();this.updateDom()};
JSONEditor.Node.prototype._getDomValue=function(a){if(this.dom.value&&this.type!="array"&&this.type!="object")this.valueHTML=this.dom.value.innerHTML;if(this.valueHTML!=void 0)try{this.value=this.type=="string"?this._unescape(this._stripHTML(this.valueHTML)):this._stringCast(this._unescape(this._stripHTML(this.valueHTML)))}catch(b){if(this.value=void 0,a!=!0)throw b;}};
JSONEditor.Node.prototype._updateDomValue=function(){var a=this.dom.value;if(a){var b=this.value,c=this.type=="auto"?typeof b:this.type,d="";c=="string"?d="green":c=="number"?d="red":c=="boolean"?d="blue":this.type=="object"||this.type=="array"?d="":b===null?d="purple":b===void 0&&(d="green");a.style.color=d;String(this.value)==""&&this.type!="array"&&this.type!="object"?JSONEditor.addClassName(a,"jsoneditor-empty"):JSONEditor.removeClassName(a,"jsoneditor-empty");JSONEditor.stripFormatting(a)}};
JSONEditor.Node.prototype._updateDomField=function(){var a=this.dom.field;a&&(String(this.field)==""?JSONEditor.addClassName(a,"jsoneditor-empty"):JSONEditor.removeClassName(a,"jsoneditor-empty"),JSONEditor.stripFormatting(a))};JSONEditor.Node.prototype._getDomField=function(a){if(this.dom.field&&this.fieldEditable)this.fieldHTML=this.dom.field.innerHTML;if(this.fieldHTML!=void 0)try{this.field=this._unescape(this._stripHTML(this.fieldHTML))}catch(b){if(this.field=void 0,a!=!0)throw b;}};
JSONEditor.Node.prototype.clearDom=function(){this.dom={}};
JSONEditor.Node.prototype.getDom=function(){var a=this.dom;if(a.tr)return a.tr;a.tr=document.createElement("tr");a.tr.className="jsoneditor-tr";a.tr.node=this;var b=document.createElement("td");b.className="jsoneditor-td";b.title="Move field (drag and drop)";a.drag=this._createDomDragArea();a.drag&&b.appendChild(a.drag);a.tr.appendChild(b);b=document.createElement("td");b.className="jsoneditor-td";a.tr.appendChild(b);a.expand=this._createDomExpandButton();a.field=this._createDomField();a.value=this._createDomValue();
a.tree=this._createDomTree(a.expand,a.field,a.value);b.appendChild(a.tree);b=document.createElement("td");b.className="jsoneditor-td jsoneditor-td-edit";a.tr.appendChild(b);a.type=this._createDomTypeButton();b.appendChild(a.type);b=document.createElement("td");b.className="jsoneditor-td jsoneditor-td-edit";a.tr.appendChild(b);a.duplicate=this._createDomDuplicateButton();a.duplicate&&b.appendChild(a.duplicate);b=document.createElement("td");b.className="jsoneditor-td jsoneditor-td-edit";a.tr.appendChild(b);
a.remove=this._createDomRemoveButton();a.remove&&b.appendChild(a.remove);this._updateStatus();this.updateDom();return a.tr};
JSONEditor.Node.prototype._onDragStart=function(a){a=a||window.event;JSONEditor.focusNode&&JSONEditor.focusNode.blur();var b=this;if(!this.mousemove)this.mousemove=JSONEditor.Events.addEventListener(document,"mousemove",function(a){b._onDrag(a)});if(!this.mouseup)this.mouseup=JSONEditor.Events.addEventListener(document,"mouseup",function(a){b._onDragEnd(a)});JSONEditor.freezeHighlight=!0;this.oldCursor=document.body.style.cursor;document.body.style.cursor="move";JSONEditor.Events.preventDefault(a)};
JSONEditor.Node.prototype._onDrag=function(a){var a=a||window.event,b=this.dom.tr,c=JSONEditor.getAbsoluteTop(b),d=b.offsetHeight,f=a.pageY||a.clientY+document.body.scrollTop;if(f<c){for(var c=b.previousSibling,b=JSONEditor.getAbsoluteTop(c),e=JSONEditor.getNodeFromTarget(c);c&&f<b;)e=JSONEditor.getNodeFromTarget(c),c=c.previousSibling,b=JSONEditor.getAbsoluteTop(c);if(e)c=e.dom.tr,b=JSONEditor.getAbsoluteTop(c),f>b+d&&(e=void 0);e&&e.parent&&e.parent.moveBefore(this,e)}else if(e=(d=this.append?this.append.getDom():
this.dom.tr)?d.nextSibling:void 0){for(var d=JSONEditor.getAbsoluteTop(e),b=void 0,e=e.nextSibling,g=JSONEditor.getAbsoluteTop(e),g=e?g-d:0;e&&f>c+g;)b=JSONEditor.getNodeFromTarget(e),e=e.nextSibling,g=JSONEditor.getAbsoluteTop(e),g=e?g-d:0;b&&b.parent&&b.parent.moveBefore(this,b)}JSONEditor.Events.preventDefault(a)};
JSONEditor.Node.prototype._onDragEnd=function(a){a=a||window.event;document.body.style.cursor=this.oldCursor;delete JSONEditor.freezeHighlight;delete this.oldCursor;this.setHighlight(!1);this.mousemove&&(JSONEditor.Events.removeEventListener(document,"mousemove",this.mousemove),delete this.mousemove);this.mouseup&&(JSONEditor.Events.removeEventListener(document,"mouseup",this.mouseup),delete this.mouseup);JSONEditor.Events.preventDefault(a)};
JSONEditor.Node.prototype._createDomDragArea=function(){if(this.parent){var a=document.createElement("button");a.className="jsoneditor-dragarea";return a}};JSONEditor.Node.prototype._createDomField=function(){return document.createElement("div")};
JSONEditor.Node.prototype.setHighlight=function(a){if(!JSONEditor.freezeHighlight&&this.dom.tr){this.dom.tr.className="jsoneditor-tr"+(a?" jsoneditor-tr-highlight":"");this.append&&this.append.setHighlight(a);var b=this.childs;if(b)for(var c=0,d=b.length;c<d;c++)b[c].setHighlight(a)}};
JSONEditor.Node.prototype.updateDom=function(){var a=this.dom.tree;if(a)a.style.marginLeft=this.getLevel()*24+"px";if(a=this.dom.field)this.fieldEditable==!0?(a.contentEditable="true",a.spellcheck=!1,a.className="jsoneditor-field"):a.className="jsoneditor-readonly",a.innerHTML=this._escape(this.index!=void 0?this.index:this.field!=void 0?this.field:this.type=="array"||this.type=="object"?this.type:"field");this._updateDomField();this._updateDomValue();if(this.childs)for(var a=this.childs,b=0,c=a.length;b<
c;b++)a[b].updateDom();this.append&&this.append.updateDom()};
JSONEditor.Node.prototype._updateStatus=function(a){var b=this.dom.value,c=this.childs;if(b&&c){var d=c.length;if(this.type=="array"){b.innerHTML="["+d+"]";for(var a=a>0?a:0,f=c.length;a<f;a++){var e=c[a];e.index=a;if(e=e.dom.field)e.innerHTML=a}}else if(this.type=="object"){b.innerHTML="{"+d+"}";a=a>0?a:0;for(f=c.length;a<f;a++)if(e=c[a],e.index!=void 0){delete e.index;if(e.field==void 0)e.field="field";e.updateDom()}}b.title=this.type+" containing "+d+" items"}};
JSONEditor.Node.prototype._createDomValue=function(){var a;this.type=="array"?(a=document.createElement("div"),a.className="jsoneditor-readonly",a.innerHTML="[...]"):this.type=="object"?(a=document.createElement("div"),a.className="jsoneditor-readonly",a.innerHTML="{...}"):(a=document.createElement("div"),a.contentEditable="true",a.spellcheck=!1,a.className="jsoneditor-value",a.innerHTML=this._escape(this.value));return a};
JSONEditor.Node.prototype._createDomExpandButton=function(){var a=document.createElement("button");this.type=="array"||this.type=="object"?(a.className=this.expanded?"jsoneditor-expanded":"jsoneditor-collapsed",a.title="Click to expand/collapse this field. \nCtrl+Click to expand/collapse including all childs."):(a.className="jsoneditor-invisible",a.title="");return a};
JSONEditor.Node.prototype._createDomTree=function(a,b,c){var d=this.dom,f=document.createElement("table"),e=document.createElement("tbody");f.style.borderCollapse="collapse";f.appendChild(e);var g=document.createElement("tr");e.appendChild(g);e=document.createElement("td");e.className="jsoneditor-td-tree";g.appendChild(e);e.appendChild(a);d.tdExpand=e;a=document.createElement("td");a.className="jsoneditor-td-tree";g.appendChild(a);a.appendChild(b);d.tdField=a;b=document.createElement("td");b.className=
"jsoneditor-td-tree";g.appendChild(b);if(this.type!="object"&&this.type!="array")b.appendChild(document.createTextNode(":")),b.className="jsoneditor-separator";d.tdSeparator=b;b=document.createElement("td");b.className="jsoneditor-td-tree";g.appendChild(b);b.appendChild(c);d.tdValue=b;return f};
JSONEditor.Node.prototype.onEvent=function(a){var b=a.type,c=a.target||a.srcElement,d=this.dom,f=this,e=this.type=="array"||this.type=="object",g=d.value;if(c==g)switch(b){case "focus":JSONEditor.focusNode=this;break;case "change":case "blur":case "keyup":this._getDomValue(!0);this._updateDomValue();break;case "cut":case "paste":setTimeout(function(){f._getDomValue(!0);f._updateDomValue()},1)}var h=d.field;if(c==h)switch(b){case "focus":JSONEditor.focusNode=this;break;case "change":case "blur":case "keyup":this._getDomField(!0);
this._updateDomField();break;case "cut":case "paste":setTimeout(function(){f._getDomField(!0);f._updateDomField()},1)}if(c==d.drag)switch(b){case "mousedown":this._onDragStart(a);break;case "mouseover":this.setHighlight(!0);break;case "mouseout":this.setHighlight(!1)}c==d.expand&&b=="click"&&e&&this._onExpand(a);if(c==d.duplicate)switch(b){case "click":this.parent._duplicate(this);break;case "mouseover":this.setHighlight(!0);break;case "mouseout":this.setHighlight(!1)}if(c==d.remove)switch(b){case "click":this.parent.removeChild(this);
break;case "mouseover":this.setHighlight(!0);break;case "mouseout":this.setHighlight(!1)}if(c==d.type)switch(b){case "click":this._onTypeButton(a);break;case "mouseover":this.setHighlight(!0);break;case "mouseout":this.setHighlight(!1)}if(c==d.tree.parentNode)switch(b){case "click":(a.offsetX!=void 0?a.offsetX<(this.getLevel()+1)*24:a.clientX<JSONEditor.getAbsoluteLeft(d.tdSeparator))||e?h&&(JSONEditor.setEndOfContenteditable(h),h.focus()):g&&(JSONEditor.setEndOfContenteditable(g),g.focus())}if(c==
d.tdExpand&&!e||c==d.tdField||c==d.tdSeparator)switch(b){case "click":h&&(JSONEditor.setEndOfContenteditable(h),h.focus())}};JSONEditor.Node.prototype._onExpand=function(a){a=a||window.event;if(a=a.ctrlKey){var b=this.dom.tr.parentNode,c=b.parentNode,d=c.scrollTop;c.removeChild(b)}this.expanded?this.collapse(a):this.expand(a);if(a)c.appendChild(b),c.scrollTop=d};
JSONEditor.Node.types=[{value:"array",className:"jsoneditor-option-array",title:'Field type "array". An array contains an ordered collection of values.'},{value:"auto",className:"jsoneditor-option-auto",title:'Field type "auto". The field type is automatically determined from the value and can be a string, number, boolean, or null.'},{value:"object",className:"jsoneditor-option-object",title:'Field type "object". An object contains an unordered set of key/value pairs.'},{value:"string",className:"jsoneditor-option-string",
title:'Field type "string". Field type is not determined from the value, but always returned as string.'}];JSONEditor.Node.prototype._createDomTypeButton=function(){var a=document.createElement("button");a.className="jsoneditor-type-"+this.type;a.title="Change field type";return a};
JSONEditor.Node.prototype._onTypeButton=function(a){JSONEditor.Events.stopPropagation(a);var b=this.dom.type,c=this,a=JSONEditor.getAbsoluteLeft(b),d=JSONEditor.getAbsoluteTop(b)+b.clientHeight;JSONEditor.showDropDownList({x:a,y:d,node:c,value:c.type,values:JSONEditor.Node.types,className:"jsoneditor-select",optionSelectedClassName:"jsoneditor-option-selected",optionClassName:"jsoneditor-option",callback:function(a){c._changeType(a);b.className="jsoneditor-type-"+c.type}})};
JSONEditor.showDropDownList=function(a){var b=document.createElement("div");b.className=a.className||"";b.style.position="absolute";b.style.left=(a.x||0)+"px";b.style.top=(a.y||0)+"px";for(var c=0;c<a.values.length;c++){var d=a.values[c],f=d.value||String(d),e="jsoneditor-option "+(d.className||"");f==a.value&&(e+=" "+a.optionSelectedClassName);var g=document.createElement("div");g.className=e;if(d.title)g.title=d.title;g.innerHTML=f;g.onmousedown=function(b){return function(){a.callback(b)}}(d.value);
b.appendChild(g)}document.body.appendChild(b);a.node.setHighlight(!0);JSONEditor.freezeHighlight=!0;var h=JSONEditor.Events.addEventListener(document,"mousedown",function(){JSONEditor.freezeHighlight=!1;a.node.setHighlight(!1);document.body.removeChild(b);JSONEditor.Events.removeEventListener(document,"mousedown",h)})};JSONEditor.Node.prototype.getAppend=function(){if(!this.append)this.append=new JSONEditor.AppendNode,this.append.parent=this;return this.append.getDom()};
JSONEditor.Node.prototype._createDomRemoveButton=function(){if(this.parent&&(this.parent.type=="array"||this.parent.type=="object")){var a=document.createElement("button");a.className="jsoneditor-remove";a.title="Remove field (including all its childs)";return a}};
JSONEditor.Node.prototype._createDomDuplicateButton=function(){if(this.parent&&(this.parent.type=="array"||this.parent.type=="object")){var a=document.createElement("button");a.className="jsoneditor-duplicate";a.title="Duplicate field (including all childs)";return a}};JSONEditor.Node.prototype._getType=function(a){return a instanceof Array?"array":a instanceof Object?"object":typeof a=="string"&&typeof this._stringCast(a)!="string"?"string":"auto"};
JSONEditor.Node.prototype._stringCast=function(a){var b=a.toLowerCase(),c=Number(a),d=parseFloat(a);return a==""?"":b=="null"?null:b=="true"?!0:b=="false"?!1:!isNaN(c)&&!isNaN(d)?c:a};JSONEditor.Node.prototype._escape=function(a){a=String(a).replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;");a=JSON.stringify(a);return a.substring(1,a.length-1)};JSONEditor.Node.prototype._unescape=function(a){return JSON.parse('"'+a+'"').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ")};
JSONEditor.Node.prototype._stripHTML=function(a){return a.replace(/<(?:.|\n)*?>/gm,"")};JSONEditor.AppendNode=function(){this.dom={}};JSONEditor.AppendNode.prototype=new JSONEditor.Node;function newTd(a){var b=document.createElement("td");b.className=a||"";return b}
JSONEditor.AppendNode.prototype.getDom=function(){if(this.dom.tr)return this.dom.tr;var a=document.createElement("tr");a.appendChild(newTd("jsoneditor-td"));a.node=this;var b=document.createElement("td");a.appendChild(b);b.className="jsoneditor-td";var c=document.createElement("button");c.className="jsoneditor-append";c.title="Append a field";this.dom.append=c;b.appendChild(c);a.appendChild(newTd("jsoneditor-td jsoneditor-td-edit"));a.appendChild(newTd("jsoneditor-td jsoneditor-td-edit"));a.appendChild(newTd("jsoneditor-td jsoneditor-td-edit"));
this.dom.tr=a;this.dom.td=b;this.updateDom();return a};JSONEditor.AppendNode.prototype.updateDom=function(){var a=this.dom.td;if(a)a.style.paddingLeft=this.getLevel()*24+26+"px"};JSONEditor.AppendNode.prototype.onEvent=function(a){var b=a.type;if((a.target||a.srcElement)==this.dom.append)switch(b){case "click":a=new JSONEditor.Node({field:"field",value:"value"});this.parent.appendChild(a);this.parent.setHighlight(!1);a.focus();break;case "mouseover":this.parent.setHighlight(!0);break;case "mouseout":this.parent.setHighlight(!1)}};
JSONEditor.prototype._createFrame=function(){this.container.innerHTML="";this.frame=document.createElement("div");this.frame.className="jsoneditor-frame";this.container.appendChild(this.frame);var a=this,b=function(a){var a=a||window.event,b=JSONEditor.getNodeFromTarget(a.target||a.srcElement);if(b)b.onEvent(a)};this.frame.onclick=b;this.frame.onchange=b;this.frame.onfocus=b;this.frame.onblur=b;this.frame.onkeyup=b;this.frame.oncut=b;this.frame.onpaste=b;this.frame.onmousedown=b;this.frame.onmouseup=
b;this.frame.onmouseover=b;this.frame.onmouseout=b;this.head=document.createElement("table");this.head.className="jsoneditor-menu";b=document.createElement("tbody");this.head.appendChild(b);var c=document.createElement("tr");b.appendChild(c);b=document.createElement("td");b.className="jsoneditor-menu";c.appendChild(b);a=this;c=document.createElement("button");c.innerHTML="Expand All";c.onclick=function(){a.expandAll()};b.appendChild(c);c=document.createElement("button");c.innerHTML="Collapse All";
c.onclick=function(){a.collapseAll()};b.appendChild(c);this.frame.appendChild(this.head)};
JSONEditor.prototype._createTable=function(){var a=document.createElement("div");a.className="jsoneditor-content-outer";this.content=document.createElement("div");this.content.className="jsoneditor-content";a.appendChild(this.content);this.table=document.createElement("table");this.table.className="jsoneditor-table";this.content.appendChild(this.table);if(JSONEditor.getInternetExplorerVersion()==8)this.content.style.overflow="scroll";var b;this.colgroupContent=document.createElement("colgroup");b=
document.createElement("col");b.width="24px";this.colgroupContent.appendChild(b);b=document.createElement("col");this.colgroupContent.appendChild(b);b=document.createElement("col");b.width="24px";this.colgroupContent.appendChild(b);b=document.createElement("col");b.width="24px";this.colgroupContent.appendChild(b);b=document.createElement("col");b.width="24px";this.colgroupContent.appendChild(b);this.table.appendChild(this.colgroupContent);this.tbody=document.createElement("tbody");this.table.appendChild(this.tbody);
this.frame.appendChild(a)};JSONEditor.getNodeFromTarget=function(a){for(;a;){if(a.node)return a.node;a=a.parentNode}};
JSONFormatter=function(a){if(!JSON)throw Error("Your browser does not support JSON. \n\nPlease install the newest version of your browser.\n(all modern browsers support JSON).");this.container=a;this.width=a.clientWidth;this.height=a.clientHeight;this.frame=document.createElement("div");this.frame.className="jsoneditor-frame";this.head=document.createElement("table");this.head.className="jsoneditor-menu";a=document.createElement("tbody");this.head.appendChild(a);var b=document.createElement("tr");
a.appendChild(b);a=document.createElement("td");a.className="jsoneditor-menu";b.appendChild(a);b=document.createElement("button");b.innerHTML="Format";b.title="Format JSON data, with proper indentation and line feeds";b.className="jsoneditor-button";a.appendChild(b);var c=document.createElement("button");c.innerHTML="Compact";c.title="Compact JSON data, remove all whitespaces";c.className="jsoneditor-button";a.appendChild(c);this.frame.appendChild(this.head);this.content=document.createElement("div");
this.content.className="jsonformatter-content";this.frame.appendChild(this.content);this.textarea=document.createElement("textarea");this.textarea.className="jsonformatter-textarea";this.textarea.spellcheck=!1;this.content.appendChild(this.textarea);var d=this.textarea,f=this;b.onclick=function(){try{d.value=JSON.stringify(JSON.parse(d.value),null,"  ")}catch(a){f.onError(a)}};c.onclick=function(){try{d.value=JSON.stringify(JSON.parse(d.value))}catch(a){f.onError(a)}};this.container.appendChild(this.frame)};
JSONFormatter.prototype.onError=function(){};JSONFormatter.prototype._checkChange=function(){var a=this.textarea.value;if(a!=this.lastContent&&(this.lastContent=a,formatter.onChangeCallback))formatter.onChangeCallback()};JSONFormatter.prototype.set=function(a){this.textarea.value=JSON.stringify(a,null,"  ")};JSONFormatter.prototype.get=function(){return JSON.parse(this.textarea.value)};JSONEditor.Events={};
JSONEditor.Events.addEventListener=function(a,b,c,d){return a.addEventListener?(d===void 0&&(d=!1),b==="mousewheel"&&navigator.userAgent.indexOf("Firefox")>=0&&(b="DOMMouseScroll"),a.addEventListener(b,c,d),c):(d=function(){return c.call(a,window.event)},a.attachEvent("on"+b,d),d)};
JSONEditor.Events.removeEventListener=function(a,b,c,d){a.removeEventListener?(d===void 0&&(d=!1),b==="mousewheel"&&navigator.userAgent.indexOf("Firefox")>=0&&(b="DOMMouseScroll"),a.removeEventListener(b,c,d)):a.detachEvent("on"+b,c)};JSONEditor.Events.stopPropagation=function(a){if(!a)a=window.event;a.stopPropagation?a.stopPropagation():a.cancelBubble=!0};JSONEditor.Events.preventDefault=function(a){if(!a)a=window.event;a.preventDefault?a.preventDefault():a.returnValue=!1};
JSONEditor.getAbsoluteLeft=function(a){for(var b=0;a!=null;)b+=a.offsetLeft,b-=a.scrollLeft,a=a.offsetParent;!document.body.scrollLeft&&window.pageXOffset&&(b-=window.pageXOffset);return b};JSONEditor.getAbsoluteTop=function(a){for(var b=0;a!=null;)b+=a.offsetTop,b-=a.scrollTop,a=a.offsetParent;!document.body.scrollTop&&window.pageYOffset&&(b-=window.pageYOffset);return b};JSONEditor.addClassName=function(a,b){var c=a.className;if(c.indexOf(b)==-1)c+=" "+b,a.className=c};
JSONEditor.removeClassName=function(a,b){var c=a.className;if(c.indexOf(b)!=-1)c=c.replace(b,""),c=c.replace(/  /g,""),a.className=c};JSONEditor.stripFormatting=function(a){for(var a=a.childNodes,b=0,c=a.length;b<c;b++){var d=a[b];d.style&&d.removeAttribute("style");var f=d.attributes;if(f)for(var e=0,g=f.length;e<g;e++){var h=f[e];h.specified==!0&&d.removeAttribute(h.name)}JSONEditor.stripFormatting(d)}};
JSONEditor.setEndOfContenteditable=function(a){var b;document.createRange?(b=document.createRange(),b.selectNodeContents(a),b.collapse(!1),a=window.getSelection(),a.removeAllRanges(),a.addRange(b)):document.selection&&(b=document.body.createTextRange(),b.moveToElementText(a),b.collapse(!1),b.select())};JSONEditor.getInternetExplorerVersion=function(){var a=-1;navigator.appName=="Microsoft Internet Explorer"&&/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)!=null&&(a=parseFloat(RegExp.$1));return a};
JSONEditor.ieVersion=JSONEditor.getInternetExplorerVersion();
