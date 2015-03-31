﻿var HANDJS=HANDJS||{};!function(){function e(){M=!0,clearTimeout(j),j=setTimeout(function(){M=!1},700)}function t(e){var t=[];if(e)for(t.unshift(e);e.parentNode;)t.unshift(e.parentNode),e=e.parentNode;return t}function n(e,n){for(var r=t(e),o=t(n),i=null;r.length>0&&r[0]==o.shift();)i=r.shift();return i}function r(e,t,r){for(var o=n(e,t),i=e,a=[];i&&i!=o;)g(i,"pointerenter")&&a.push(i),i=i.parentNode;for(;a.length>0;)r(a.pop())}function o(e,t,r){for(var o=n(e,t),i=e;i&&i!=o;)g(i,"pointerleave")&&r(i),i=i.parentNode}function i(e,t){["pointerdown","pointermove","pointerup","pointerover","pointerout"].forEach(function(n){window.addEventListener(e(n),function(e){!M&&m(e.target,n)&&t(e,n,!0)})}),void 0===window["on"+e("pointerenter").toLowerCase()]&&window.addEventListener(e("pointerover"),function(e){if(!M){var n=m(e.target,"pointerenter");n&&n!==window&&(n.contains(e.relatedTarget)||r(n,e.relatedTarget,function(n){t(e,"pointerenter",!1,n,e.relatedTarget)}))}}),void 0===window["on"+e("pointerleave").toLowerCase()]&&window.addEventListener(e("pointerout"),function(e){if(!M){var n=m(e.target,"pointerleave");n&&n!==window&&(n.contains(e.relatedTarget)||o(n,e.relatedTarget,function(n){t(e,"pointerleave",!1,n,e.relatedTarget)}))}})}if(!window.PointerEvent){Array.prototype.indexOf||(Array.prototype.indexOf=function(e){var t=Object(this),n=t.length>>>0;if(0===n)return-1;var r=0;if(arguments.length>0&&(r=Number(arguments[1]),r!=r?r=0:0!=r&&1/0!=r&&r!=-1/0&&(r=(r>0||-1)*Math.floor(Math.abs(r)))),r>=n)return-1;for(var o=r>=0?r:Math.max(n-Math.abs(r),0);n>o;o++)if(o in t&&t[o]===e)return o;return-1}),Array.prototype.forEach||(Array.prototype.forEach=function(e,t){if(!(this&&e instanceof Function))throw new TypeError;for(var n=0;n<this.length;n++)e.call(t,this[n],n,this)}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/,"")});var a=["pointerdown","pointerup","pointermove","pointerover","pointerout","pointercancel","pointerenter","pointerleave"],s=["PointerDown","PointerUp","PointerMove","PointerOver","PointerOut","PointerCancel","PointerEnter","PointerLeave"],d="touch",c="pen",f="mouse",l={},v=function(e){for(;e&&!e.handjs_forcePreventDefault;)e=e.parentNode;return!!e||window.handjs_forcePreventDefault},u=function(e,t,n,r,o){var i;if(document.createEvent?(i=document.createEvent("MouseEvents"),i.initMouseEvent(t,n,!0,window,1,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,o||e.relatedTarget)):(i=document.createEventObject(),i.screenX=e.screenX,i.screenY=e.screenY,i.clientX=e.clientX,i.clientY=e.clientY,i.ctrlKey=e.ctrlKey,i.altKey=e.altKey,i.shiftKey=e.shiftKey,i.metaKey=e.metaKey,i.button=e.button,i.relatedTarget=o||e.relatedTarget),void 0===i.offsetX&&(void 0!==e.offsetX?(Object&&void 0!==Object.defineProperty&&(Object.defineProperty(i,"offsetX",{writable:!0}),Object.defineProperty(i,"offsetY",{writable:!0})),i.offsetX=e.offsetX,i.offsetY=e.offsetY):Object&&void 0!==Object.defineProperty?(Object.defineProperty(i,"offsetX",{get:function(){return this.currentTarget&&this.currentTarget.offsetLeft?e.clientX-this.currentTarget.offsetLeft:e.clientX}}),Object.defineProperty(i,"offsetY",{get:function(){return this.currentTarget&&this.currentTarget.offsetTop?e.clientY-this.currentTarget.offsetTop:e.clientY}})):void 0!==e.layerX&&(i.offsetX=e.layerX-e.currentTarget.offsetLeft,i.offsetY=e.layerY-e.currentTarget.offsetTop)),i.isPrimary=void 0!==e.isPrimary?e.isPrimary:!0,e.pressure)i.pressure=e.pressure;else{var a=0;void 0!==e.which?a=e.which:void 0!==e.button&&(a=e.button),i.pressure=0==a?0:.5}if(i.rotation=e.rotation?e.rotation:0,i.hwTimestamp=e.hwTimestamp?e.hwTimestamp:0,i.tiltX=e.tiltX?e.tiltX:0,i.tiltY=e.tiltY?e.tiltY:0,i.height=e.height?e.height:0,i.width=e.width?e.width:0,i.preventDefault=function(){void 0!==e.preventDefault&&e.preventDefault()},void 0!==i.stopPropagation){var s=i.stopPropagation;i.stopPropagation=function(){void 0!==e.stopPropagation&&e.stopPropagation(),s.call(this)}}switch(i.pointerId=e.pointerId,i.pointerType=e.pointerType,i.pointerType){case 2:i.pointerType=d;break;case 3:i.pointerType=c;break;case 4:i.pointerType=f}r?r.dispatchEvent(i):e.target?e.target.dispatchEvent(i):e.srcElement.fireEvent("on"+w(t),i)},p=function(e,t,n,r,o){e.pointerId=1,e.pointerType=f,u(e,t,n,r,o)},h=function(e,t,n,r,o,i){var a=t.identifier+2;t.pointerId=a,t.pointerType=d,t.currentTarget=n,void 0!==r.preventDefault&&(t.preventDefault=function(){r.preventDefault()}),u(t,e,o,n,i)},g=function(e,t){return e.__handjsGlobalRegisteredEvents&&e.__handjsGlobalRegisteredEvents[t]},m=function(e,t){for(;e&&!g(e,t);)e=e.parentNode;return e?e:g(window,t)?window:void 0},E=function(e,t,n,r,o,i){m(n,e)&&h(e,t,n,r,o,i)},w=function(e){return e.toLowerCase().replace("pointer","mouse")},T=function(e,t){var n=a.indexOf(t),r=e+s[n];return r},y=function(e,t,n,r){if(void 0===e.__handjsRegisteredEvents&&(e.__handjsRegisteredEvents=[]),r){if(void 0!==e.__handjsRegisteredEvents[t])return void e.__handjsRegisteredEvents[t]++;e.__handjsRegisteredEvents[t]=1,e.addEventListener(t,n,!1)}else{if(-1!==e.__handjsRegisteredEvents.indexOf(t)&&(e.__handjsRegisteredEvents[t]--,0!=e.__handjsRegisteredEvents[t]))return;e.removeEventListener(t,n),e.__handjsRegisteredEvents[t]=0}},L=function(e,t,n){if(e.__handjsGlobalRegisteredEvents||(e.__handjsGlobalRegisteredEvents=[]),n){if(void 0!==e.__handjsGlobalRegisteredEvents[t])return void e.__handjsGlobalRegisteredEvents[t]++;e.__handjsGlobalRegisteredEvents[t]=1}else void 0!==e.__handjsGlobalRegisteredEvents[t]&&(e.__handjsGlobalRegisteredEvents[t]--,e.__handjsGlobalRegisteredEvents[t]<0&&(e.__handjsGlobalRegisteredEvents[t]=0));var r,o;switch(window.MSPointerEvent?(r=function(e){return T("MS",e)},o=u):(r=w,o=p),t){case"pointerenter":case"pointerleave":var i=r(t);void 0!==e["on"+i.toLowerCase()]&&y(e,i,function(e){o(e,t)},n)}},_=function(e){var t=e.prototype?e.prototype.addEventListener:e.addEventListener,n=function(e,n,r){-1!=a.indexOf(e)&&L(this,e,!0),void 0===t?this.attachEvent("on"+w(e),n):t.call(this,e,n,r)};e.prototype?e.prototype.addEventListener=n:e.addEventListener=n},b=function(e){var t=e.prototype?e.prototype.removeEventListener:e.removeEventListener,n=function(e,n,r){-1!=a.indexOf(e)&&L(this,e,!1),void 0===t?this.detachEvent(w(e),n):t.call(this,e,n,r)};e.prototype?e.prototype.removeEventListener=n:e.removeEventListener=n};_(window),_(window.HTMLElement||window.Element),_(document),_(HTMLBodyElement),_(HTMLDivElement),_(HTMLImageElement),_(HTMLUListElement),_(HTMLAnchorElement),_(HTMLLIElement),_(HTMLTableElement),window.HTMLSpanElement&&_(HTMLSpanElement),window.HTMLCanvasElement&&_(HTMLCanvasElement),window.SVGElement&&_(SVGElement),b(window),b(window.HTMLElement||window.Element),b(document),b(HTMLBodyElement),b(HTMLDivElement),b(HTMLImageElement),b(HTMLUListElement),b(HTMLAnchorElement),b(HTMLLIElement),b(HTMLTableElement),window.HTMLSpanElement&&b(HTMLSpanElement),window.HTMLCanvasElement&&b(HTMLCanvasElement),window.SVGElement&&b(SVGElement);var M=!1,j=-1;!function(){window.MSPointerEvent?i(function(e){return T("MS",e)},u):(i(w,p),void 0!==window.ontouchstart&&(window.addEventListener("touchstart",function(t){for(var n=0;n<t.changedTouches.length;++n){var o=t.changedTouches[n];l[o.identifier]=o.target,E("pointerover",o,o.target,t,!0),r(o.target,null,function(e){h("pointerenter",o,e,t,!1)}),E("pointerdown",o,o.target,t,!0)}e()}),window.addEventListener("touchend",function(t){for(var n=0;n<t.changedTouches.length;++n){var r=t.changedTouches[n],i=l[r.identifier];E("pointerup",r,i,t,!0),E("pointerout",r,i,t,!0),o(i,null,function(e){h("pointerleave",r,e,t,!1)})}e()}),window.addEventListener("touchmove",function(t){for(var n=0;n<t.changedTouches.length;++n){var i=t.changedTouches[n],a=document.elementFromPoint(i.clientX,i.clientY),s=l[i.identifier];s&&v(s)===!0&&t.preventDefault(),E("pointermove",i,s,t,!0),s!==a&&(s&&(E("pointerout",i,s,t,!0,a),s.contains(a)||o(s,a,function(e){h("pointerleave",i,e,t,!1,a)})),a&&(E("pointerover",i,a,t,!0,s),a.contains(s)||r(a,s,function(e){h("pointerenter",i,e,t,!1,s)})),l[i.identifier]=a)}e()}),window.addEventListener("touchcancel",function(e){for(var t=0;t<e.changedTouches.length;++t){var n=e.changedTouches[t];E("pointercancel",n,l[n.identifier],e,!0)}})))}(),void 0===navigator.pointerEnabled&&(navigator.pointerEnabled=!0,navigator.msPointerEnabled&&(navigator.maxTouchPoints=navigator.msMaxTouchPoints)),document.styleSheets&&document.addEventListener&&document.addEventListener("DOMContentLoaded",function(){if(!HANDJS.doNotProcessCSS&&void 0===document.body.style.touchAction){var e=new RegExp(".+?{.*?}","m"),t=new RegExp(".+?{","m"),n=function(n){var r=e.exec(n);if(r){var o=r[0];n=n.replace(o,"").trim();var i=t.exec(o)[0].replace("{","").trim();if(-1!=o.replace(/\s/g,"").indexOf("touch-action:none"))for(var a=document.querySelectorAll(i),s=0;s<a.length;s++){var d=a[s];void 0!==d.style.msTouchAction?d.style.msTouchAction="none":d.handjs_forcePreventDefault=!0}return n}},r=function(e){if(window.setImmediate)e&&setImmediate(r,n(e));else for(;e;)e=n(e)};try{for(var o=0;o<document.styleSheets.length;o++){var i=document.styleSheets[o];if(void 0!=i.href){var a=new XMLHttpRequest;a.open("get",i.href),a.send();var s=a.responseText.replace(/(\n|\r)/g,"");r(s)}}}catch(d){}for(var c=document.getElementsByTagName("style"),o=0;o<c.length;o++){var f=c[o],l=f.innerHTML.replace(/(\n|\r)/g,"").trim();r(l)}}},!1)}}();