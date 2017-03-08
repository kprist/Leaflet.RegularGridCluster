!function(e,t){"use strict";function i(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}function i(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}L.RegularGridClusterCell=L.Polygon.extend({options:{weight:1,fillOpacity:.6,clickable:!1,color:"grey",lineJoin:"miter",fillRule:"evenodd",strokeLocation:"inside"},initialize:function(e,t){this.options=L.extend(this.options,t),L.Util.setOptions(this,this.options),L.Polygon.prototype.initialize.call(this,e,this.options)}}),L.regularGridClusterCell=function(e,t){return new L.RegularGridClusterCell(e,t)},L.RegularGridClusterGrid=L.FeatureGroup.extend({options:{},initialize:function(e){this.controller=e.controller,this.options=L.extend(this.options,e),L.Util.setOptions(this,e),L.FeatureGroup.prototype.initialize.call(this,{features:[]},e)},render:function(e,t){},addLayer:function(e){L.FeatureGroup.prototype.addLayer.call(this,e)},truncate:function(){this.clearLayers()}}),L.regularGridClusterGrid=function(e){return new L.RegularGridClusterGrid(e)},L.RegularGridClusterMarker=L.CircleMarker.extend({options:{radius:10},initialize:function(e,t){this.options=L.extend(this.options,t),L.Util.setOptions(this,t),L.CircleMarker.prototype.initialize.call(this,e,t)}}),L.regularGridClusterMarker=function(e,t){return new L.RegularGridClusterMarker(e,t)},L.RegularGridClusterMarkersGroup=L.FeatureGroup.extend({options:{},initialize:function(e){this.controller=e.controller,this.options=L.extend(this.options,e),L.Util.setOptions(this,e),L.FeatureGroup.prototype.initialize.call(this,{features:[]},e)},render:function(e,t){},addLayer:function(e){L.FeatureGroup.prototype.addLayer.call(this,e)},truncate:function(){this.clearLayers()}}),L.regularGridClusterMarkersGroup=function(e){return new L.RegularGridClusterMarkersGroup(e)},L.RegularGridClusterText=L.Marker.extend({options:{},initialize:function(e,t){this.options=L.extend(this.options,t),L.Util.setOptions(this,t);var i=JSON.stringify(t).substring(1,JSON.stringify(t).length-2).replace(/,/g,";").replace(/\"/g,"");t.icon=L.divIcon({html:'<span class="regular-grid-text-html" style="'+i+' ; text-align: center">'+this.options.text+"</span>",iconSize:[0,0],iconAnchor:[t.anchorOffsetX||-10,t.anchorOffsetY||-30],className:"regular-grid-text-marker"}),L.Marker.prototype.initialize.call(this,e,t)}}),L.regularGridClusterText=function(e,t){return new L.RegularGridClusterText(e,t)},L.RegularGridClusterTextsGroup=L.FeatureGroup.extend({options:{},initialize:function(e){this.controller=e.controller,this.options=L.extend(this.options,e),L.Util.setOptions(this,e),L.FeatureGroup.prototype.initialize.call(this,{features:[]},e)},render:function(e,t){},addLayer:function(e){L.FeatureGroup.prototype.addLayer.call(this,e)},truncate:function(){this.clearLayers()}}),L.regularGridClusterTextsGroup=function(e){return new L.RegularGridClusterTextsGroup(e)},L.RegularGridCluster=L.GeoJSON.extend({options:{gridBoundsPadding:.1,gridMode:"square",cellSize:1e4,showGrid:!0,showMarkers:!0,showTexts:!0,zoomShowElements:10,zoomHideGrid:10,indexSize:12,rules:{},trackingTime:!0},initialize:function(e){this.options=L.extend(this.options,e),this.lastelmid=0,this.elementDisplayed=!1,L.Util.setOptions(this,e),this._actions=[],this._elements={},this._displayedElements=L.featureGroup([]),this._cells=[],this._grid=new L.regularGridClusterGrid({controller:this}),this._markers=new L.regularGridClusterMarkersGroup({controller:this}),this._texts=new L.regularGridClusterTextsGroup({controller:this}),L.FeatureGroup.prototype.initialize.call(this,{features:[]},e)},onAdd:function(e){var t=this;this._map=e,this._grid.addTo(this._map),this._markers.addTo(this._map),this._texts.addTo(this._map),this._addAction(function(){t.refresh()},"zoomend"),this._index(),this.refresh()},_addAction:function(e,t){this._actions.push({callback:e,type:t}),this._map.on(t,e)},_unregisterActions:function(){var e=this;this._actions.map(function(t){e._map.off(t.type,t.callback)})},addLayer:function(e){this.addLayers([e])},addLayers:function(e){var t=this;e.map(function(e){return t._addElement(e)}),this._map&&(this._index(),this.refresh())},unregister:function(){this._unregisterActions(),this._truncateLayers()},_addElement:function(e){this._elements[this.lastelmid]={id:this.lastelmid,latlng:e.marker.getLatLng(),properties:e.properties,marker:e.marker},this.lastelmid++},_index:function(){var e=[];e.push(new Date),this._indexCells(),e.push(new Date),this._indexElements(),e.push(new Date),this.options.trackingTime&&(console.log("//////////////////////////////////"),console.log("cells indexed in    "+(e[1].valueOf()-e[0].valueOf())+"ms"),console.log("elements indexed in "+(e[2].valueOf()-e[1].valueOf())+"ms"),console.log("indexing took       "+(e[2].valueOf()-e[0].valueOf())+"ms"),console.log("//////////////////////////////////"))},_getElementsCollection:function(){var e=this;return Object.keys(this._elements).map(function(t){return{id:e._elements[t].id,g:e._elements[t].latlng,i:e._elements[t].index}})},_getElementMarkers:function(){var e=this;return Object.keys(this._elements).map(function(t){return e._elements[t].marker})},_displayElements:function(){var e=this;this.elementDisplayed||(this._displayedElements.clearLayers(),this.elementDisplayed=!0,this._getElementMarkers().map(function(t){console.log(t),e._displayedElements.addLayer(t)}),this._displayedElements.addTo(this._map))},_hideElements:function(){this.elementDisplayed&&(this.elementDisplayed=!1,this._displayedElements.clearLayers())},refresh:function(){this._renderElements(),this._renderComponents()},_renderElements:function(){this._map.getZoom()>=this.options.zoomShowElements?(console.log("elements will be displayed"),this._displayElements()):this._hideElements()},_renderComponents:function(){if(this._map.getZoom()<this.options.zoomHideGrid){console.log("grid components will be displayed"),this._truncateLayers();var e=[];e.push(new Date),this._prepareCells(),e.push(new Date),this._findElements(),e.push(new Date),this._buildGrid(),e.push(new Date),this._buildMarkers(),e.push(new Date),this._buildTexts(),e.push(new Date),this.options.trackingTime&&(console.log("********************"),console.log("cells prepared in "+(e[1].valueOf()-e[0].valueOf())+"ms"),console.log("elements found in "+(e[2].valueOf()-e[1].valueOf())+"ms"),console.log("grid built in     "+(e[3].valueOf()-e[2].valueOf())+"ms"),console.log("markers built in  "+(e[4].valueOf()-e[3].valueOf())+"ms"),console.log("texts built in    "+(e[5].valueOf()-e[4].valueOf())+"ms"),console.log(this._cells.length+" cells refreshed in "+(e[5].valueOf()-e[0].valueOf())+"ms"),console.log("********************"))}else console.log("grid will be hidden"),this._truncateLayers()},_truncateLayers:function(){this._grid.truncate(),this._markers.truncate(),this._texts.truncate()},_buildGrid:function(){this.options.rules.grid&&this.options.showGrid&&(this._visualise("grid"),this._cells.forEach(function(e){if(this._cellIsNotEmpty(e)){var t=new L.regularGridClusterCell(e.path,e.options.grid);this._grid.addLayer(t)}}.bind(this)),this._grid.addTo(this._map))},_buildMarkers:function(){var e=this;this.options.rules.markers&&this.options.showMarkers&&(this._visualise("markers"),this._cells.map(function(t){if(e._cellIsNotEmpty(t)){var i=[t.y+t.h/2,t.x+t.w/2],n=new L.regularGridClusterMarker(i,t.options.markers);e._markers.addLayer(n)}}),this._markers.addTo(this._map))},_buildTexts:function(){var e=this;this.options.rules.texts&&this.options.showTexts&&(this._visualise("texts"),this._cells.map(function(t){if(e._cellIsNotEmpty(t)){var i=[t.y+t.h/2,t.x+t.w/2],n=new L.regularGridClusterText(i,t.options.texts);e._texts.addLayer(n)}}),this._texts.addTo(this._map))},_indexCells:function(){var e=this._gridOrigin(),t=this._gridExtent().getNorthEast(),i=t.lng,n=t.lat,r=e.lng,s=e.lat,l=this.options.indexSize,a=(i-r)/l,o=(n-s)/l;this._indexedCells={};for(var u=0,d=r;d<i;d+=a)for(var f=s;f<n;f+=o){var c=L.latLngBounds([f,d],[f+o,d+a]);this._indexedCells[u]={b:c,cs:[]},u+=1}},_indexElements:function(){var e=this;this._getElementsCollection().map(function(t){for(var i in e._indexedCells)if(e._indexedCells[i].b.contains(t.g)){e._elements[t.id].index=i;break}})},_indexedCellsCollection:function(){var e=this;return Object.keys(this._indexedCells).map(function(t){return e._indexedCells[t]})},_truncateIndexedCells:function(){this._indexedCellsCollection().map(function(e){e.cs=[]})},_prepareCells:function(){this._cells=[],this._truncateIndexedCells();for(var e=1,t=this._cellSize(),i=this._gridOrigin(),n=this._gridExtent().getNorthEast(),r=n.lng,s=n.lat,l=i.lng,a=i.lat,o=1,u=t/111319,d=this._indexedCellsCollection(),f=function(e,t){d.map(function(i){i.b.overlaps(t)&&i.cs.push(e)})};a<s;){var c=this._cellHeightAtY(a,t);for("hexagon"==this.options.gridMode&&o%2&&(l-=u/2);l<r;){var h={id:e,x:l,y:a,h:c,w:u,options:{grid:{},markers:{},texts:{}},elms:[]},p=L.latLngBounds([a,l],[a+c,l+u]);h.path=this._buildPathOperations[this.options.gridMode].call(this,h),this._cells.push(h),f(h,p),e++,l+=u}l=i.lng,a+="hexagon"==this.options.gridMode?.75*c:c,o+=1}},_findElements:function(){var e=this;this._getElementsCollection().map(function(t){var i=t.id,n=t.g.lng,r=t.g.lat;e._indexedCells[t.i].cs.map(function(t){e._elmInsideOperations[e.options.gridMode].call(e,n,r,t)&&t.elms.push(i)})})},_cellIsNotEmpty:function(e){return 0!==e.elms.length},_visualise:function(e){var t=this;this.options.rules[e]&&Object.keys(this.options.rules[e]).map(function(i){var n=t.options.rules[e][i];"text"==i?(t._cellsValues(n.method,n.attribute),t._cells.map(function(e){t._cellIsNotEmpty(e)&&(e.options.texts.text=e.value)})):t._isDynamicalRule(n)?(t._cellsValues(n.method,n.attribute),t._applyOptions(e,n.scale,n.style,i)):t._cells.map(function(r){t._cellIsNotEmpty(r)&&(r.options[e][i]=n)})})},_applyOptions:function(e,t,n,r){var s=this,l=this._cellValues(!0).sort(function(e,t){return e-t}),a=n.length;"continuous"===t&&(a-=1);var o=Math.max.apply(Math,i(l)),u=Math.min.apply(Math,i(l)),d=[];if("size"!=t)for(var f=Math.floor(l.length/a),c=1;c!=a;c++)d.push(l[f*c]);this._scaleOperations[t]&&this._cells.map(function(i){s._isDefined(i.value)&&(i.options[e][r]=s._scaleOperations[t](s,i.value,u,o,a,d,n))})},_cellsValues:function(e,t){var i=this;this._cells.map(function(n){if(i._cellIsNotEmpty(n)){var r=void 0;"count"!==e&&(r=i._cellAttrValues(n,t)),n.value=i._methodOperations[e](i,n,r)}})},_cellValues:function(e){return e?this._cells.filter(function(e){return void 0!==e.value&&!isNaN(e.value)}).map(function(e){return e.value}):this._cells.map(function(e){return e.value})},_cellAttrValues:function(e,t){var i=this;return e.elms.map(function(e){return i._elements[e].properties[t]})},_isDynamicalRule:function(e){return e.method&&e.scale&&e.style},_cellSize:function(){return this.options.cellSize*Math.pow(2,10-this._mapZoom())},_gridOrigin:function(){return this._gridExtent().getSouthWest()},_gridExtent:function(){return this._getBounds().pad(this.options.gridBoundsPadding)},_getBounds:function(){return L.latLngBounds(this._getGeometries())},_getGeometries:function(){return this._getElementsCollection().map(function(e){return e.g})},_mapZoom:function(){return!!this._map&&this._map.getZoom()},_cellHeightAtY:function(e,t){return t/111319},_deltaHeightAtY:function(e){return Math.abs(1/Math.cos(e*Math.PI/180))},_isDefined:function(e){return!(!e&&0!==e)},_isNumber:function(e){return!isNaN(parseFloat(e))&&isFinite(e)}}),L.regularGridCluster=function(e){return new L.RegularGridCluster(e)},L.RegularGridCluster.include({colors:{aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4","indianred ":"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"},_colorNameToHex:function(e){return void 0!==this.colors[e.toLowerCase()]&&this.colors[e.toLowerCase()].substring(1)},_hex:function(e){return e=e.toString(16),1==e.length?"0"+e:e},_validateColor:function(e){return e.indexOf("#")==-1?this._colorNameToHex(e):e.substring(1)},_colorMix:function(e,t,i){e=this._validateColor(e),t=this._validateColor(t);var n=Math.floor(parseInt(e.substring(0,2),16)*i+parseInt(t.substring(0,2),16)*(1-i)),r=Math.floor(parseInt(e.substring(2,4),16)*i+parseInt(t.substring(2,4),16)*(1-i)),s=Math.floor(parseInt(e.substring(4,6),16)*i+parseInt(t.substring(4,6),16)*(1-i));return"#"+this._hex(n)+this._hex(r)+this._hex(s)}}),L.RegularGridCluster.include({_math_max:function(e){return Math.max.apply(Math,i(e))},_math_min:function(e){return Math.min.apply(Math,i(e))},_math_mode:function(e){if(0===e.length)return null;for(var t={},i=e[0],n=1,r=0;r<e.length;r++){var s=e[r];s&&(null===t[s]?t[s]=1:t[s]++,t[s]>n&&(i=s,n=t[s]))}return i},_math_mean:function(e){return e.reduce(function(e,t){return e+t},0)/e.length},_math_sum:function(e){return e.reduce(function(e,t){return e+t},0)},_math_median:function(e){e.sort(function(e,t){return e-t});var t=Math.floor(e.length/2);return e.length%2?e[t]:(e[t-1]+e[t])/2}}),L.RegularGridCluster.include({_scaleOperations:{size:function(e,t,i,n,r,s,l){var a=n-i,o=r-1;return t<n&&(o=Math.floor((t-i)/a*r)),l[o]},quantile:function(e,t,i,n,r,s,l){var a=0;return s.map(function(e,i){t>e&&(a=parseInt(i)+1)}),l[a]},continuous:function(e,t,i,n,r,s,l){var a=0;s.map(function(e,i){t>e&&(a=parseInt(i)+1)});var o=s.slice(0);o.push(n),o.unshift(i);var u=(t-o[a])/(o[a+1]-o[a]),d=l[a],f=l[a+1];return e._isNumber(d)?d+u*(f-d):e._colorMix(f,d,u)}},_methodOperations:{count:function(e,t,i){return t.elms.length},mean:function(e,t,i){return e._math_mean(i)},median:function(e,t,i){return e._math_median(i)},mode:function(e,t,i){return e._math_mode(i)},max:function(e,t,i){return e._math_max(i)},min:function(e,t,i){return e._math_min(i)},sum:function(e,t,i){return e._math_sum(i)}},_elmInsideOperations:{square:function(e,t,i){var n=i.x,r=i.x+i.w,s=i.y,l=i.y+i.h;return e>n&&t>s&&e<r&&t<l},hexagon:function(e,t,i){var n=i.x,r=i.x+i.w,s=i.y,l=i.y+i.h;if(e>n&&t>s&&e<r&&t<l){var a=s+1*i.h/4,o=s+3*i.h/4;if(t>a&&t<o)return!0;var u=e-n,d=t-s;return d>i.h/4*3&&(d=i.h-d),u>i.w/2&&(u=i.w-u),d/(i.h/4)+u/(i.w/2)>1}return!1}},_buildPathOperations:{square:function(e){return[[e.y,e.x],[e.y,e.x+e.w],[e.y+e.h,e.x+e.w],[e.y+e.h,e.x],[e.y,e.x]]},hexagon:function(e){return[[e.y+e.h/4,e.x],[e.y,e.x+e.w/2],[e.y+e.h/4,e.x+e.w],[e.y+e.h/4*3,e.x+e.w],[e.y+e.h,e.x+e.w/2],[e.y+e.h/4*3,e.x],[e.y+e.h/4,e.x]]}}}),t[""]=e}({},function(){return this}());