(()=>{"use strict";var e=["area","base","basefont","bgsound","br","col","command","embed","frame","hr","image","img","input","isindex","keygen","link","menuitem","meta","nextid","param","source","track","wbr"],r=/\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g,t=function(t){var n={type:"tag",name:"",voidElement:!1,attrs:{},children:[]},a=t.match(/<\/?([^\s]+?)[/\s>]/);if(a&&(n.name=a[1],n.voidElement=e.includes(a[1])||"/"===t.charAt(t.length-2),n.name.startsWith("!--"))){var i=t.indexOf("--\x3e");return{type:"comment",comment:-1!==i?t.slice(4,i):""}}for(var s=new RegExp(r),c=null;null!==(c=s.exec(t));)if(c[0].trim())if(c[1]){var o=c[1].trim(),l=[o,""];o.indexOf("=")>-1&&(l=o.split("=")),n.attrs[l[0]]=l[1],s.lastIndex--}else c[2]&&(n.attrs[c[2]]=c[3].trim().substring(1,c[3].length-1));return n},n=/<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g,a=/^\s*$/,i=Object.create(null),s=function(e,r,t,n){return new(t||(t=Promise))((function(a,i){function s(e){try{o(n.next(e))}catch(e){i(e)}}function c(e){try{o(n.throw(e))}catch(e){i(e)}}function o(e){var r;e.done?a(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(s,c)}o((n=n.apply(e,r||[])).next())}))},c=function(e,r){var t,n,a,i,s={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(o){return function(c){if(t)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(s=0)),s;)try{if(t=1,n&&(a=2&c[0]?n.return:c[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,c[1])).done)return a;switch(n=0,a&&(c=[2&c[0],a.value]),c[0]){case 0:case 1:a=c;break;case 4:return s.label++,{value:c[1],done:!1};case 5:s.label++,n=c[1],c=[0];continue;case 7:c=s.ops.pop(),s.trys.pop();continue;default:if(!((a=(a=s.trys).length>0&&a[a.length-1])||6!==c[0]&&2!==c[0])){s=0;continue}if(3===c[0]&&(!a||c[1]>a[0]&&c[1]<a[3])){s.label=c[1];break}if(6===c[0]&&s.label<a[1]){s.label=a[1],a=c;break}if(a&&s.label<a[2]){s.label=a[2],s.ops.push(c);break}a[2]&&s.ops.pop(),s.trys.pop();continue}c=r.call(e,s)}catch(e){c=[6,e],n=0}finally{t=a=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,o])}}},o=/^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/,l=function(e){return"tag"===e.type&&"input"===e.name&&null!=e.attrs&&void 0!==e.attrs.readonly&&"string"==typeof e.attrs.value},u=function(e){return s(void 0,void 0,void 0,(function(){var r,s,o,u,f;return c(this,(function(c){switch(c.label){case 0:return c.trys.push([0,3,,4]),[4,fetch(e)];case 1:return 200!==(r=c.sent()).status?(console.error("Invalid status response code for link: ".concat(e,". Status code: ").concat(r.status)),[2,null]):[4,r.text()];case 2:return s=c.sent(),o=function(e,r){void 0===r&&(r={}),r||(r={}),r.components||(r.components=i);var s,c=[],o=[],l=-1,u=!1;if(0!==e.indexOf("<")){var f=e.indexOf("<");c.push({type:"text",content:-1===f?e:e.substring(0,f)})}return e.replace(n,(function(n,i){if(u){if(n!=="</"+s.name+">")return"";u=!1}var f,p="/"!==n.charAt(1),h=n.startsWith("\x3c!--"),d=i+n.length,m=e.charAt(d);if(h){var v=t(n);return l<0?(c.push(v),c):((f=o[l])&&f.children&&Array.isArray(f.children)&&f.children.push(v),c)}if(p&&(l++,"tag"===(s=t(n)).type&&s.name&&r.components&&r.components[s.name]&&(s.type="component",u=!0),!s.voidElement&&!u&&m&&"<"!==m&&Array.isArray(s.children)&&s.children.push({type:"text",content:e.slice(d,e.indexOf("<",d))}),0===l&&c.push(s),(f=o[l-1])&&f.children&&f.children.push(s),o[l]=s),(!p||s.voidElement)&&(l>-1&&(s.voidElement||s.name===n.slice(2,-1))&&(l--,s=-1===l?c:o[l]),!u&&"<"!==m&&m)){f=-1===l?c:o[l].children;var y=e.indexOf("<",d),g=e.slice(d,-1===y?void 0:y);a.test(g)&&(g=" "),(y>-1&&l+f.length>=0||" "!==g)&&f&&Array.isArray(f)&&f.push({type:"text",content:g})}})),c}(s),u=function(e){for(var r=[],t=function(e,r,t){if(t||2===arguments.length)for(var n,a=0,i=r.length;a<i;a++)!n&&a in r||(n||(n=Array.prototype.slice.call(r,0,a)),n[a]=r[a]);return e.concat(n||Array.prototype.slice.call(r))}([],e,!0);t.length>0;){var n=t.pop();n&&(l(n)&&r.push(n.attrs.value),n.children&&t.push.apply(t,n.children))}return r}(o),[2,{gameId:Number(e.split("/").pop()),referee1:u[5],referee2:u[4],linesPerson1:u[3],linesPerson2:u[2],timeKeeper1:u[1],timeKeeper2:u[0]}];case 3:return f=c.sent(),console.error("Error fetching game data for link: ".concat(e),f),[2,null];case 4:return[2]}}))}))};chrome.runtime.onMessage.addListener((function(e,r,t){switch(e.type){case"CHECK_VALID_URL":return s(void 0,void 0,void 0,(function(){var e,r,t;return c(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),e={active:!0,currentWindow:!0},[4,chrome.tabs.query(e)];case 1:return[2,{isValidUrl:!!(r=n.sent()[0])&&!!(a=r.url)&&o.test(a)}];case 2:return t=n.sent(),console.error("Error checking if the tab URL is valid:",t),[2,{isValidUrl:!1}];case 3:return[2]}var a}))})).then((function(e){return t(e)})).catch((function(e){console.error("Error checking active tab URL: ",e),t({isValidUrl:!1})})),!0;case"PROCESS_LINKS":var n=e.links;return n&&n.length?(t({requestRescrape:!1}),function(e){return s(void 0,void 0,void 0,(function(){var r,t,n,a,i;return c(this,(function(s){switch(s.label){case 0:r=5,t=[],n=[],a=function(a){var i,s,o;return c(this,(function(c){switch(c.label){case 0:i=e.slice(a,a+r),c.label=1;case 1:return c.trys.push([1,3,,4]),[4,Promise.all(i.map((function(e){return u(e)})))];case 2:return s=c.sent(),t.push.apply(t,s.filter((function(e){return null!==e}))),n.push.apply(n,i.filter((function(e,r){return null===s[r]}))),[3,4];case 3:return o=c.sent(),console.error("Error with a chunk:",i,o),n.push.apply(n,i),[3,4];case 4:return[2]}}))},i=0,s.label=1;case 1:return i<e.length?[5,a(i)]:[3,4];case 2:s.sent(),s.label=3;case 3:return i+=r,[3,1];case 4:return[2,n]}}))}))}(n).then((function(e){console.log(e)})).catch((function(e){console.error("Error processing links: ",e)})),!0):(console.warn("Empty list of game links received. Requesting re-scrape"),void t({requestRescrape:!0}));case"ERROR_SCRAPING_LINKS":return console.error("Unable to scrape game links. Please refresh page"),!0}}))})();