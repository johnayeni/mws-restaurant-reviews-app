!function(r){var n={};function a(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return r[e].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.m=r,a.c=n,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(r,n,function(e){return t[e]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=11)}([function(e,t,r){e.exports=r(6)},function(e,t){function s(e,t,r,n,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void r(e)}u.done?t(s):Promise.resolve(s).then(n,a)}e.exports=function(u){return function(){var e=this,i=arguments;return new Promise(function(t,r){var n=u.apply(e,i);function a(e){s(n,t,r,a,o,"next",e)}function o(e){s(n,t,r,a,o,"throw",e)}a(void 0)})}}},function(e,t,r){var n=r(8),a=r(9),o=r(10);e.exports=function(e){return n(e)||a(e)||o()}},function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.exports=function(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}},function(h,e,t){"use strict";!function(){function i(r){return new Promise(function(e,t){r.onsuccess=function(){e(r.result)},r.onerror=function(){t(r.error)}})}function o(r,n,a){var o,e=new Promise(function(e,t){i(o=r[n].apply(r,a)).then(e,t)});return e.request=o,e}function e(e,r,t){t.forEach(function(t){Object.defineProperty(e.prototype,t,{get:function(){return this[r][t]},set:function(e){this[r][t]=e}})})}function t(t,r,n,e){e.forEach(function(e){e in n.prototype&&(t.prototype[e]=function(){return o(this[r],e,arguments)})})}function r(t,r,n,e){e.forEach(function(e){e in n.prototype&&(t.prototype[e]=function(){return this[r][e].apply(this[r],arguments)})})}function n(e,n,t,r){r.forEach(function(r){r in t.prototype&&(e.prototype[r]=function(){return e=this[n],(t=o(e,r,arguments)).then(function(e){if(e)return new u(e,t.request)});var e,t})})}function a(e){this._index=e}function u(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function c(r){this._tx=r,this.complete=new Promise(function(e,t){r.oncomplete=function(){e()},r.onerror=function(){t(r.error)},r.onabort=function(){t(r.error)}})}function f(e,t,r){this._db=e,this.oldVersion=t,this.transaction=new c(r)}function l(e){this._db=e}e(a,"_index",["name","keyPath","multiEntry","unique"]),t(a,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),n(a,"_index",IDBIndex,["openCursor","openKeyCursor"]),e(u,"_cursor",["direction","key","primaryKey","value"]),t(u,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(r){r in IDBCursor.prototype&&(u.prototype[r]=function(){var t=this,e=arguments;return Promise.resolve().then(function(){return t._cursor[r].apply(t._cursor,e),i(t._request).then(function(e){if(e)return new u(e,t._request)})})})}),s.prototype.createIndex=function(){return new a(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new a(this._store.index.apply(this._store,arguments))},e(s,"_store",["name","keyPath","indexNames","autoIncrement"]),t(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),n(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),r(s,"_store",IDBObjectStore,["deleteIndex"]),c.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},e(c,"_tx",["objectStoreNames","mode"]),r(c,"_tx",IDBTransaction,["abort"]),f.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},e(f,"_db",["name","version","objectStoreNames"]),r(f,"_db",IDBDatabase,["deleteObjectStore","close"]),l.prototype.transaction=function(){return new c(this._db.transaction.apply(this._db,arguments))},e(l,"_db",["name","version","objectStoreNames"]),r(l,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(o){[s,a].forEach(function(e){o in e.prototype&&(e.prototype[o.replace("open","iterate")]=function(){var e,t=(e=arguments,Array.prototype.slice.call(e)),r=t[t.length-1],n=this._store||this._index,a=n[o].apply(n,t.slice(0,-1));a.onsuccess=function(){r(a.result)}})})}),[a,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,r){var n=this,a=[];return new Promise(function(t){n.iterateCursor(e,function(e){e?(a.push(e.value),void 0===r||a.length!=r?e.continue():t(a)):t(a)})})})});var p={open:function(e,t,r){var n=o(indexedDB,"open",[e,t]),a=n.request;return a&&(a.onupgradeneeded=function(e){r&&r(new f(a.result,e.oldVersion,a.transaction))}),n.then(function(e){return new l(e)})},delete:function(e){return o(indexedDB,"deleteDatabase",[e])}};h.exports=p,h.exports.default=h.exports}()},function(e,t,r){var n=function(){return this||"object"==typeof self&&self}()||Function("return this")(),a=n.regeneratorRuntime&&0<=Object.getOwnPropertyNames(n).indexOf("regeneratorRuntime"),o=a&&n.regeneratorRuntime;if(n.regeneratorRuntime=void 0,e.exports=r(7),a)n.regeneratorRuntime=o;else try{delete n.regeneratorRuntime}catch(e){n.regeneratorRuntime=void 0}},function(L,e){!function(e){"use strict";var s,t=Object.prototype,c=t.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},a=r.iterator||"@@iterator",n=r.asyncIterator||"@@asyncIterator",o=r.toStringTag||"@@toStringTag",i="object"==typeof L,u=e.regeneratorRuntime;if(u)i&&(L.exports=u);else{(u=e.regeneratorRuntime=i?L.exports:{}).wrap=x;var l="suspendedStart",p="suspendedYield",h="executing",v="completed",d={},f={};f[a]=function(){return this};var y=Object.getPrototypeOf,w=y&&y(y(I([])));w&&w!==t&&c.call(w,a)&&(f=w);var b=R.prototype=m.prototype=Object.create(f);k.prototype=b.constructor=R,R.constructor=k,R[o]=k.displayName="GeneratorFunction",u.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===k||"GeneratorFunction"===(t.displayName||t.name))},u.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,R):(e.__proto__=R,o in e||(e[o]="GeneratorFunction")),e.prototype=Object.create(b),e},u.awrap=function(e){return{__await:e}},_(S.prototype),S.prototype[n]=function(){return this},u.AsyncIterator=S,u.async=function(e,t,r,n){var a=new S(x(e,t,r,n));return u.isGeneratorFunction(t)?a:a.next().then(function(e){return e.done?e.value:a.next()})},_(b),b[o]="Generator",b[a]=function(){return this},b.toString=function(){return"[object Generator]"},u.keys=function(r){var n=[];for(var e in r)n.push(e);return n.reverse(),function e(){for(;n.length;){var t=n.pop();if(t in r)return e.value=t,e.done=!1,e}return e.done=!0,e}},u.values=I,E.prototype={constructor:E,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=s,this.done=!1,this.delegate=null,this.method="next",this.arg=s,this.tryEntries.forEach(D),!e)for(var t in this)"t"===t.charAt(0)&&c.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=s)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var n=this;function e(e,t){return o.type="throw",o.arg=r,n.next=e,t&&(n.method="next",n.arg=s),!!t}for(var t=this.tryEntries.length-1;0<=t;--t){var a=this.tryEntries[t],o=a.completion;if("root"===a.tryLoc)return e("end");if(a.tryLoc<=this.prev){var i=c.call(a,"catchLoc"),u=c.call(a,"finallyLoc");if(i&&u){if(this.prev<a.catchLoc)return e(a.catchLoc,!0);if(this.prev<a.finallyLoc)return e(a.finallyLoc)}else if(i){if(this.prev<a.catchLoc)return e(a.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return e(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;0<=r;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&c.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var o=a?a.completion:{};return o.type=e,o.arg=t,a?(this.method="next",this.next=a.finallyLoc,d):this.complete(o)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),d},finish:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),D(r),d}},catch:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;D(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:I(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=s),d}}}function x(e,t,r,n){var o,i,u,s,a=t&&t.prototype instanceof m?t:m,c=Object.create(a.prototype),f=new E(n||[]);return c._invoke=(o=e,i=r,u=f,s=l,function(e,t){if(s===h)throw new Error("Generator is already running");if(s===v){if("throw"===e)throw t;return A()}for(u.method=e,u.arg=t;;){var r=u.delegate;if(r){var n=j(r,u);if(n){if(n===d)continue;return n}}if("next"===u.method)u.sent=u._sent=u.arg;else if("throw"===u.method){if(s===l)throw s=v,u.arg;u.dispatchException(u.arg)}else"return"===u.method&&u.abrupt("return",u.arg);s=h;var a=g(o,i,u);if("normal"===a.type){if(s=u.done?v:p,a.arg===d)continue;return{value:a.arg,done:u.done}}"throw"===a.type&&(s=v,u.method="throw",u.arg=a.arg)}}),c}function g(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}function m(){}function k(){}function R(){}function _(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function S(s){var t;this._invoke=function(r,n){function e(){return new Promise(function(e,t){!function t(e,r,n,a){var o=g(s[e],s,r);if("throw"!==o.type){var i=o.arg,u=i.value;return u&&"object"==typeof u&&c.call(u,"__await")?Promise.resolve(u.__await).then(function(e){t("next",e,n,a)},function(e){t("throw",e,n,a)}):Promise.resolve(u).then(function(e){i.value=e,n(i)},function(e){return t("throw",e,n,a)})}a(o.arg)}(r,n,e,t)})}return t=t?t.then(e,e):e()}}function j(e,t){var r=e.iterator[t.method];if(r===s){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=s,j(e,t),"throw"===t.method))return d;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var n=g(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,d;var a=n.arg;return a?a.done?(t[e.resultName]=a.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=s),t.delegate=null,d):a:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,d)}function O(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function D(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function E(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(O,this),this.reset(!0)}function I(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,n=function e(){for(;++r<t.length;)if(c.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=s,e.done=!0,e};return n.next=n}}return{next:A}}function A(){return{value:s,done:!0}}}(function(){return this||"object"==typeof self&&self}()||Function("return this")())},function(e,t){e.exports=function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}},function(e,t){e.exports=function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}},function(e,t,r){"use strict";r.r(t);var n,a=r(0),x=r.n(a),o=r(1),g=r.n(o),i=r(3),m=r.n(i),u=r(4),k=r.n(u),s=r(2),R=r.n(s),c=r(5),_=r.n(c),f=function(){function s(){m()(this,s)}return k()(s,null,[{key:"openDatabase",value:function(){return _.a.open("restaurants",1,function(e){e.createObjectStore("restaurants",{keyPath:"id"});var t=e.createObjectStore("reviews",{keyPath:"id"});t.createIndex("restaurant_id","restaurant_id"),t.createIndex("date","createdAt"),e.createObjectStore("offlineFavorites",{keyPath:"restaurant_id"});var r=e.createObjectStore("offlineReviews",{keyPath:"id",autoIncrement:!0});r.createIndex("restaurant_id","restaurant_id"),r.createIndex("date","createdAt")})}},{key:"getStoredRestaurants",value:(b=g()(x.a.mark(function e(){var t,r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:return r=t.transaction("restaurants"),n=r.objectStore("restaurants"),e.abrupt("return",n.getAll());case 8:case"end":return e.stop()}},e,this)})),function(){return b.apply(this,arguments)})},{key:"getStoredRestaurantById",value:(w=g()(x.a.mark(function e(t){var r,n,a;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return n=r.transaction("restaurants"),a=n.objectStore("restaurants"),e.abrupt("return",a.get(t));case 8:case"end":return e.stop()}},e,this)})),function(e){return w.apply(this,arguments)})},{key:"getStoredRestaurantReviews",value:(y=g()(x.a.mark(function e(t){var r,n,a,o;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return n=r.transaction("reviews"),a=n.objectStore("reviews"),o=a.index("restaurant_id","date"),e.abrupt("return",o.getAll(t));case 9:case"end":return e.stop()}},e,this)})),function(e){return y.apply(this,arguments)})},{key:"fetchRestaurants",value:(d=g()(x.a.mark(function e(t){var r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=[],navigator.serviceWorker)return e.next=4,s.getStoredRestaurants();e.next=5;break;case 4:r=e.sent;case 5:return 0<r.length&&t(null,r),e.prev=6,e.next=9,fetch("".concat(s.DATABASE_URL,"/restaurants"));case 9:if(200===(n=e.sent).status)return e.next=13,n.json();e.next=18;break;case 13:r=e.sent,navigator.serviceWorker&&s.addRestaurantsToIDB(r),t(null,r),e.next=19;break;case 18:t("Could not fetch restaurants",null);case 19:e.next=24;break;case 21:e.prev=21,e.t0=e.catch(6),t(e.t0,null);case 24:case"end":return e.stop()}},e,this,[[6,21]])})),function(e){return d.apply(this,arguments)})},{key:"fetchRestaurantById",value:(v=g()(x.a.mark(function e(t,r){var n,a,o;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(navigator.serviceWorker)return e.next=3,s.getStoredRestaurantById(Number(t));e.next=4;break;case 3:n=e.sent;case 4:return n&&r(null,n),e.prev=5,e.next=8,fetch("".concat(s.DATABASE_URL,"/restaurants/").concat(t));case 8:if(200===(a=e.sent).status)return e.next=12,a.json();e.next=17;break;case 12:o=e.sent,navigator.serviceWorker&&s.addRestaurantToIDB(o),r(null,o),e.next=18;break;case 17:r("Restaurant does not exist",null);case 18:e.next=23;break;case 20:e.prev=20,e.t0=e.catch(5),r(e.t0,null);case 23:case"end":return e.stop()}},e,this,[[5,20]])})),function(e,t){return v.apply(this,arguments)})},{key:"fetchRestaurantReviews",value:(h=g()(x.a.mark(function e(t,r){var n,a,o,i,u;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=[],a=[],o=[],navigator.serviceWorker)return e.next=6,s.getStoredRestaurantReviews(Number(t));e.next=10;break;case 6:return a=e.sent,e.next=9,s.getOfflineReviews(Number(t));case 9:o=e.sent;case 10:return(n=R()(a&&a).concat(R()(o&&o)))&&0<n.length&&r(null,n),e.prev=12,e.next=15,fetch("".concat(s.DATABASE_URL,"/reviews/?restaurant_id=").concat(t));case 15:if(200===(i=e.sent).status)return e.next=19,i.json();e.next=24;break;case 19:u=e.sent,navigator.serviceWorker&&s.addReviewsToIDB(u),r(null,R()(u).concat(R()(o&&o))),e.next=25;break;case 24:r("Could not fetch reviews",null);case 25:e.next=30;break;case 27:e.prev=27,e.t0=e.catch(12),r(e.t0,null);case 30:case"end":return e.stop()}},e,this,[[12,27]])})),function(e,t){return h.apply(this,arguments)})},{key:"fetchRestaurantByCuisine",value:function(n,a){s.fetchRestaurants(function(e,t){if(e)a(e,null);else{var r=t.filter(function(e){return e.cuisine_type==n});a(null,r)}})}},{key:"fetchRestaurantByNeighborhood",value:function(n,a){s.fetchRestaurants(function(e,t){if(e)a(e,null);else{var r=t.filter(function(e){return e.neighborhood==n});a(null,r)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(n,a,o){s.fetchRestaurants(function(e,t){if(e)o(e,null);else{var r=t;"all"!=n&&(r=r.filter(function(e){return e.cuisine_type==n})),"all"!=a&&(r=r.filter(function(e){return e.neighborhood==a})),o(null,r)}})}},{key:"fetchNeighborhoods",value:function(a){s.fetchRestaurants(function(e,r){if(e)a(e,null);else{var n=r.map(function(e,t){return r[t].neighborhood}),t=n.filter(function(e,t){return n.indexOf(e)==t});a(null,t)}})}},{key:"fetchCuisines",value:function(a){s.fetchRestaurants(function(e,r){if(e)a(e,null);else{var n=r.map(function(e,t){return r[t].cuisine_type}),t=n.filter(function(e,t){return n.indexOf(e)==t});a(null,t)}})}},{key:"addRestaurantsToIDB",value:(p=g()(x.a.mark(function e(t){var r,n,a;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return n=r.transaction("restaurants","readwrite"),a=n.objectStore("restaurants"),t.forEach(function(e){return a.put(e)}),a.openCursor(null,"prev").then(function(e){return e.advance(30)}).then(function e(t){if(t)return t.delete(),t.continue().then(e)}),e.abrupt("return",n.complete);case 10:case"end":return e.stop()}},e,this)})),function(e){return p.apply(this,arguments)})},{key:"addRestaurantToIDB",value:(l=g()(x.a.mark(function e(t){var r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return(n=r.transaction("restaurants","readwrite")).objectStore("restaurants").put(t),e.abrupt("return",n.complete);case 9:case"end":return e.stop()}},e,this)})),function(e){return l.apply(this,arguments)})},{key:"addReviewsToIDB",value:(f=g()(x.a.mark(function e(t){var r,n,a;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return n=r.transaction("reviews","readwrite"),a=n.objectStore("reviews"),t.forEach(function(e){return a.put(e)}),e.abrupt("return",n.complete);case 9:case"end":return e.stop()}},e,this)})),function(e){return f.apply(this,arguments)})},{key:"addReviewToIDB",value:(c=g()(x.a.mark(function e(t){var r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return(n=r.transaction("reviews","readwrite")).objectStore("reviews").put(t),e.abrupt("return",n.complete);case 9:case"end":return e.stop()}},e,this)})),function(e){return c.apply(this,arguments)})},{key:"addOfflineReview",value:(u=g()(x.a.mark(function e(t,r){var n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,navigator.serviceWorker&&window.SyncManager)return e.next=4,s.openDatabase();e.next=17;break;case 4:if(n=e.sent){e.next=7;break}return e.abrupt("return");case 7:if(n.transaction("offlineReviews","readwrite").objectStore("offlineReviews").put(t),r(null,t),"granted"!==Notification.permission)return e.next=14,s.requestNotificationPermission();e.next=14;break;case 14:navigator.serviceWorker.ready.then(function(e){return e.sync.register("syncReviews")}).catch(function(e){return console.log(e)}),e.next=18;break;case 17:s.postReview(t,r);case 18:e.next=23;break;case 20:e.prev=20,e.t0=e.catch(0),r("Error adding review!",null);case 23:case"end":return e.stop()}},e,this,[[0,20]])})),function(e,t){return u.apply(this,arguments)})},{key:"getOfflineReviews",value:(i=g()(x.a.mark(function e(t){var r,n,a,o;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return n=r.transaction("offlineReviews"),a=n.objectStore("offlineReviews"),o=a.index("restaurant_id","date"),e.abrupt("return",o.getAll(t));case 9:case"end":return e.stop()}},e,this)})),function(e){return i.apply(this,arguments)})},{key:"deleteOfflineReviewFromIDB",value:(o=g()(x.a.mark(function e(t){var r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return(n=r.transaction("offlineReviews","readwrite")).objectStore("offlineReviews").delete(t),e.abrupt("return",n.complete);case 9:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})},{key:"postReview",value:(a=g()(x.a.mark(function e(t){var r,n,a,o=arguments;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=1<o.length&&void 0!==o[1]?o[1]:function(){},e.prev=1,e.next=4,fetch("".concat(s.DATABASE_URL,"/reviews"),{method:"POST",body:JSON.stringify(t)});case 4:if(201===(n=e.sent).status)return e.next=8,n.json();e.next=11;break;case 8:return a=e.sent,r(null,a),e.abrupt("return",a);case 11:e.next=17;break;case 13:return e.prev=13,e.t0=e.catch(1),r("Error adding review",null),e.abrupt("return",e.t0);case 17:case"end":return e.stop()}},e,this,[[1,13]])})),function(e){return a.apply(this,arguments)})},{key:"addOfflineFavourite",value:(n=g()(x.a.mark(function e(t,r){var n,a,o=arguments;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=2<o.length&&void 0!==o[2]?o[2]:function(){},e.prev=1,navigator.serviceWorker&&window.SyncManager)return e.next=5,s.openDatabase();e.next=15;break;case 5:if(a=e.sent){e.next=8;break}return e.abrupt("return");case 8:a.transaction("offlineFavorites","readwrite").objectStore("offlineFavorites").put({restaurant_id:t,isFavourite:r}),n(null,"Liked"),navigator.serviceWorker.ready.then(function(e){return e.sync.register("syncFavourites")}).catch(function(e){return console.log(e)}),e.next=16;break;case 15:s.toggleRestaurantFavoriteStatus(t,r,n);case 16:e.next=21;break;case 18:e.prev=18,e.t0=e.catch(1),n(e.t0,null);case 21:case"end":return e.stop()}},e,this,[[1,18]])})),function(e,t){return n.apply(this,arguments)})},{key:"deleteOfflineFavoriteFromIDB",value:(t=g()(x.a.mark(function e(t){var r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.openDatabase();case 2:if(r=e.sent){e.next=5;break}return e.abrupt("return");case 5:return(n=r.transaction("offlineFavorites","readwrite")).objectStore("offlineFavorites").delete(t),e.abrupt("return",n.complete);case 9:case"end":return e.stop()}},e,this)})),function(e){return t.apply(this,arguments)})},{key:"toggleRestaurantFavoriteStatus",value:(r=g()(x.a.mark(function e(t,r){var n,a,o,i=arguments;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=2<i.length&&void 0!==i[2]?i[2]:function(){},e.prev=1,e.next=4,fetch("".concat(s.DATABASE_URL,"/restaurants/").concat(t,"?is_favorite=").concat(!r),{method:"PUT"});case 4:if(200===(a=e.sent).status)return e.next=8,a.json();e.next=11;break;case 8:o=e.sent,n(null,o),console.log(o);case 11:e.next=17;break;case 13:return e.prev=13,e.t0=e.catch(1),n(e.t0,null),e.abrupt("return",e.t0);case 17:case"end":return e.stop()}},e,this,[[1,13]])})),function(e,t){return r.apply(this,arguments)})},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id=".concat(e.id)}},{key:"imageUrlForRestaurant",value:function(e){return"/img/".concat(e.photograph)}},{key:"imageSrcSetForRestaurant",value:function(e){return"".concat(e,"-small.jpg 320w, ").concat(e,"-medium.jpg 480w, ").concat(e,"-large.jpg 800w")}},{key:"imageSizesForRestaurant",value:function(){return"(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"}},{key:"mapMarkerForRestaurant",value:function(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:s.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}},{key:"lazyLoadImages",value:function(){var e=[].slice.call(document.querySelectorAll("img.lazy"));if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype){var r=new IntersectionObserver(function(e,t){e.forEach(function(e){if(e.isIntersecting){var t=e.target;t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),r.unobserve(t)}})});e.forEach(function(e){r.observe(e)})}}},{key:"requestNotificationPermission",value:(e=g()(x.a.mark(function e(){return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Notification.requestPermission();case 2:if("granted"===e.sent)return e.abrupt("return",!0);e.next=5;break;case 5:return e.abrupt("return",!1);case 6:case"end":return e.stop()}},e,this)})),function(){return e.apply(this,arguments)})},{key:"DATABASE_URL",get:function(){return"http://localhost:".concat(1337)}}]),s;var e,r,t,n,a,o,i,u,c,f,l,p,h,v,d,y,w,b}(),l=function(){function r(){m()(this,r)}return k()(r,null,[{key:"getOfflineReviews",value:(o=g()(x.a.mark(function e(){var t,r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.openDatabase();case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:return r=t.transaction("offlineReviews"),n=r.objectStore("offlineReviews"),e.abrupt("return",n.getAll());case 8:case"end":return e.stop()}},e,this)})),function(){return o.apply(this,arguments)})},{key:"syncReviews",value:(a=g()(x.a.mark(function e(){var t;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.getOfflineReviews();case 2:return t=e.sent,e.abrupt("return",t.map(function(){var t=g()(x.a.mark(function e(t){var r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.id,delete t.id,e.next=4,f.postReview(t);case 4:return n=e.sent,e.next=7,f.addReviewToIDB(n);case 7:return e.next=9,f.deleteOfflineReviewFromIDB(r);case 9:return e.abrupt("return");case 10:case"end":return e.stop()}},e,this)}));return function(e){return t.apply(this,arguments)}}()));case 4:case"end":return e.stop()}},e,this)})),function(){return a.apply(this,arguments)})},{key:"getOfflineFavorites",value:(n=g()(x.a.mark(function e(){var t,r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.openDatabase();case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:return r=t.transaction("offlineFavorites"),n=r.objectStore("offlineFavorites"),e.abrupt("return",n.getAll());case 8:case"end":return e.stop()}},e,this)})),function(){return n.apply(this,arguments)})},{key:"syncFavorites",value:(e=g()(x.a.mark(function e(){var t;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.getOfflineFavorites();case 2:return t=e.sent,e.abrupt("return",t.map(function(){var t=g()(x.a.mark(function e(t){var r;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.toggleRestaurantFavoriteStatus(t.restaurant_id,t.isFavorite);case 2:return r=e.sent,e.next=5,f.addRestaurantToIDB(r);case 5:return e.next=7,f.deleteOfflineFavoriteFromIDB(t.restaurant_id);case 7:return e.abrupt("return");case 8:case"end":return e.stop()}},e,this)}));return function(e){return t.apply(this,arguments)}}()));case 4:case"end":return e.stop()}},e,this)})),function(){return e.apply(this,arguments)})},{key:"clearStore",value:(t=g()(x.a.mark(function e(t){var r,n;return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.openDatabase();case 2:return r=e.sent,(n=r.transaction(t,"readwrite")).objectStore(t).clear(),e.abrupt("return",n.complete);case 7:case"end":return e.stop()}},e,this)})),function(e){return t.apply(this,arguments)})}]),r;var t,e,n,a,o}(),p="restaurant-reviews-imgs",h=["restaurant-reviews-static-v1",p],v=["/","index.html","restaurant.html","css/styles.css","js/bundle.js","https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"];self.addEventListener("install",function(e){e.waitUntil(caches.open("restaurant-reviews-static-v1").then(function(e){return console.log("Opened cache"),e.addAll(v)}))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.filter(function(e){return e.startsWith("restaurant-reviews")&&!h.includes(e)}).map(function(e){return caches.delete(e)}))}))}),self.addEventListener("fetch",function(t){var r,n,e=new URL(t.request.url);e.origin.startsWith("https://maps.googleapis.com")||e.pathname.startsWith("/restaurants")||(e.origin!==location.origin||!e.pathname.startsWith("/img/")&&!e.pathname.startsWith("/icons/")?t.respondWith(caches.match(t.request,{ignoreSearch:!0}).then(function(e){return e||fetch(t.request)})):t.respondWith((r=t.request,n=r.url,caches.open(p).then(function(t){return t.match(n,{ignoreSearch:!0}).then(function(e){return e||fetch(r).then(function(e){return t.put(n,e.clone()),e})})}))))}),self.addEventListener("sync",(n=g()(x.a.mark(function e(t){return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:"syncFavorites"==t.tag&&t.waitUntil(l.syncFavorites().catch(function(e){t.lastChance&&l.clearStore("offlineFavorites")})),"syncReviews"==t.tag&&t.waitUntil(l.syncReviews().then(function(){self.registration.showNotification("Review Posted!")}).catch(function(e){t.lastChance?(self.registration.showNotification("Some of your reviews have failed to be posted online"),l.clearStore("offlineReviews")):self.registration.showNotification("Some reviews not be posted online, but they will be saved offline for now")}));case 2:case"end":return e.stop()}},e,this)})),function(e){return n.apply(this,arguments)}))}]);