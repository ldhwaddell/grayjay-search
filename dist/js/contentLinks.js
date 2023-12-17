(()=>{"use strict";var e,r,n,t,o,i={723:(e,r,n)=>{n.d(r,{C:()=>a});var t=function(e,r,n,t){return new(n||(n=Promise))((function(o,i){function u(e){try{c(t.next(e))}catch(e){i(e)}}function a(e){try{c(t.throw(e))}catch(e){i(e)}}function c(e){var r;e.done?o(e.value):(r=e.value,r instanceof n?r:new n((function(e){e(r)}))).then(u,a)}c((t=t.apply(e,r||[])).next())}))},o=function(e,r){var n,t,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(a){return function(c){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,a[0]&&(u=0)),u;)try{if(n=1,t&&(o=2&a[0]?t.return:a[0]?t.throw||((o=t.return)&&o.call(t),0):t.next)&&!(o=o.call(t,a[1])).done)return o;switch(t=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return u.label++,{value:a[1],done:!1};case 5:u.label++,t=a[1],a=[0];continue;case 7:a=u.ops.pop(),u.trys.pop();continue;default:if(!((o=(o=u.trys).length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){u=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){u.label=a[1];break}if(6===a[0]&&u.label<o[1]){u.label=o[1],o=a;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(a);break}o[2]&&u.ops.pop(),u.trys.pop();continue}a=r.call(e,u)}catch(e){a=[6,e],t=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},i=function(e,r,n){if(n||2===arguments.length)for(var t,o=0,i=r.length;o<i;o++)!t&&o in r||(t||(t=Array.prototype.slice.call(r,0,o)),t[o]=r[o]);return e.concat(t||Array.prototype.slice.call(r))},u="games",a=function(){function e(){}var r;return r=e,e.get=function(e){return t(void 0,void 0,void 0,(function(){return o(r,(function(r){return[2,new Promise((function(r,n){chrome.storage.local.get([e],(function(t){var o;if(chrome.runtime.lastError)n(new Error(chrome.runtime.lastError.message));else{var i=null!==(o=t[e])&&void 0!==o?o:null;r(i)}}))}))]}))}))},e.update=function(e,n){return t(void 0,void 0,void 0,(function(){return o(r,(function(r){return[2,new Promise((function(r,t){var o;chrome.storage.local.set(((o={})[e]=n,o),(function(){chrome.runtime.lastError?t(new Error(chrome.runtime.lastError.message)):r()}))}))]}))}))},e.addGames=function(e){return t(void 0,void 0,void 0,(function(){var n,t;return o(r,(function(r){switch(r.label){case 0:return e&&e.length?[4,this.get(u)]:[2];case 1:return n=r.sent()||[],t=i(i([],n,!0),e,!0),[4,this.update(u,t)];case 2:return[2,r.sent()]}}))}))},e.removeGames=function(e){return t(void 0,void 0,void 0,(function(){var n,t;return o(r,(function(r){switch(r.label){case 0:return e&&e.length?[4,this.get(u)]:[2];case 1:return n=r.sent(),t=n.filter((function(r){return!e.includes(r.id)})),[2,this.update(u,t)]}}))}))},e}()}},u={};function a(e){var r=u[e];if(void 0!==r)return r.exports;var n=u[e]={exports:{}};return i[e](n,n.exports,a),n.exports}a.d=(e,r)=>{for(var n in r)a.o(r,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},a.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),e=a(723),r=function(e,r,n,t){return new(n||(n=Promise))((function(o,i){function u(e){try{c(t.next(e))}catch(e){i(e)}}function a(e){try{c(t.throw(e))}catch(e){i(e)}}function c(e){var r;e.done?o(e.value):(r=e.value,r instanceof n?r:new n((function(e){e(r)}))).then(u,a)}c((t=t.apply(e,r||[])).next())}))},n=function(e,r){var n,t,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(a){return function(c){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,a[0]&&(u=0)),u;)try{if(n=1,t&&(o=2&a[0]?t.return:a[0]?t.throw||((o=t.return)&&o.call(t),0):t.next)&&!(o=o.call(t,a[1])).done)return o;switch(t=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return u.label++,{value:a[1],done:!1};case 5:u.label++,t=a[1],a=[0];continue;case 7:a=u.ops.pop(),u.trys.pop();continue;default:if(!((o=(o=u.trys).length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){u=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){u.label=a[1];break}if(6===a[0]&&u.label<o[1]){u.label=o[1],o=a;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(a);break}o[2]&&u.ops.pop(),u.trys.pop();continue}a=r.call(e,u)}catch(e){a=[6,e],t=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},t=function(e,o){return void 0===e&&(e=3),void 0===o&&(o=1e3),r(void 0,void 0,void 0,(function(){var r,i,u;return n(this,(function(n){switch(n.label){case 0:if(n.trys.push([0,1,,4]),r=Array.from(document.querySelectorAll(".single-game")),!(i=r.flatMap((function(e){return Array.from(e.querySelectorAll("a[href]")).map((function(e){return e.href}))})))||!i.length)throw new Error("Empty list of links received");return[2,i];case 1:return u=n.sent(),console.error("Error scraping game links: ".concat(u)),e>1?[4,(a=o,new Promise((function(e){return setTimeout(e,a)})))]:[3,3];case 2:return n.sent(),t(e-1,o),[2];case 3:throw new Error("Unable to scrape game links after ".concat(e," retries"));case 4:return[2]}var a}))}))},o=function(){return r(void 0,void 0,void 0,(function(){var r,o,i,u,a,c,s;return n(this,(function(n){switch(n.label){case 0:return n.trys.push([0,3,,4]),[4,t()];case 1:return r=n.sent(),[4,e.C.get("games")];case 2:return(o=n.sent())?(u=function(e,r){var n=new Set(r.map((function(e){return e.id})));return e.filter((function(e){return!n.has(Number(e.split("/").pop()))}))}(r,o),a=function(e,r){var n=new Set(e.map((function(e){return Number(e.split("/").pop())})));return r.filter((function(e){return!n.has(e.id)})).map((function(e){return e.id}))}(r,o),s={type:"PROCESS_LINKS",links:u},chrome.runtime.sendMessage(s),e.C.removeGames(a),[3,4]):(i={type:"PROCESS_LINKS",links:r},chrome.runtime.sendMessage(i),[2]);case 3:return c=n.sent(),console.log(c),s={type:"ERROR_SCRAPING_LINKS"},chrome.runtime.sendMessage(s),[3,4];case 4:return[2]}}))}))},window.addEventListener("load",(function(){return o()}))})();