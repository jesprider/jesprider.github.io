!function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){for(var o=0,i=["ms","moz","webkit","o"],a=0;a<i.length&&!window.requestAnimationFrame;++a)window.requestAnimationFrame=window[i[a]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i[a]+"CancelAnimationFrame"]||window[i[a]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t){var e=Date.now(),n=Math.max(0,16-(e-o)),i=window.setTimeout(function(){t(e+n)},n);return o=e+n,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)});var r=n(1);window.addEventListener("load",r.init,!1),window.addEventListener("resize",r.resize,!1)},function(t,e,n){var o=n(2),i=n(3),a=n(4),r=n(5),d=n(6),c=n(7),u=n(8),p=n(9),l=n(10),s=n(11),h=n(12);window.hookjs=window.hookjs||null;var w={WIDTH:o.width,HEIGHT:o.height,scale:1,imageScale:1,offset:{top:0,left:0},entities:[],clouds:[],nextArtifact:o.firstArtifact,blowing:!1,needTutorial:!1,score:{taps:0,hit:0,escaped:0,accuracy:0,total:0},RATIO:null,currentWidth:null,currentHeight:null,canvas:null,ctx:null,ua:null,android:null,ios:null,init:function(){function t(t){return function(e){e.preventDefault(),"touchstart"===t?i.set(w,e.touches[0]):"MSPointerDown"===t?i.set(w,e):i.set(w,e)}}var e=window.innerHeight,n=window.innerWidth;e/n>1&&767>n&&(w.WIDTH=2*n,w.HEIGHT=2*e),"?showtutorial"===document.location.search&&(w.needTutorial=!0),w.imageScale=Math.min(e/640,1),w.RATIO=w.WIDTH/w.HEIGHT,w.currentWidth=w.WIDTH,w.currentHeight=w.HEIGHT,w.canvas=document.getElementsByTagName("canvas")[0],w.canvas.width=w.WIDTH,w.canvas.height=w.HEIGHT,w.ctx=w.canvas.getContext("2d"),w.ua=navigator.userAgent.toLowerCase(),w.android=w.ua.indexOf("android")>-1?!0:!1,w.ios=w.ua.indexOf("iphone")>-1||w.ua.indexOf("ipad")>-1?!0:!1,w.balloon=new r(w),w.pump=new s(w);var o=function(t){t.preventDefault()};"ontouchstart"in window?(window.addEventListener("touchstart",t("touchstart"),!1),window.addEventListener("touchmove",o,!1),window.addEventListener("touchend",o,!1)):window.navigator&&window.navigator.msPointerEnabled?(window.addEventListener("MSPointerDown",t("MSPointerDown"),!1),window.addEventListener("MSPointerMove",o,!1),window.addEventListener("MSPointerUp",o,!1)):(window.addEventListener("mousedown",t("mousedown"),!1),window.addEventListener("mousemove",o,!1),window.addEventListener("mouseup",o,!1)),w.resize(),w.loop()},resize:function(){w.currentWidth>window.innerWidth&&(w.currentWidth=window.innerWidth,w.currentHeight=w.currentWidth/w.RATIO),(w.android||w.ios)&&(document.body.style.height=window.innerHeight+50+"px"),w.currentHeight=window.innerHeight,window.hookjs&&window.hookjs.hideLoading&&(w.currentHeight-=50),w.currentWidth=w.currentHeight*w.RATIO,w.canvas.style.width=w.currentWidth+"px",w.canvas.style.height=w.currentHeight+"px",w.scale=w.currentWidth/w.WIDTH,w.offset.top=w.canvas.offsetTop,w.offset.left=w.canvas.offsetLeft,window.setTimeout(function(){window.scrollTo(0,1)},1)},update:function(){var t,e,n=!1,r=.002*Date.now();for(w.blowing=Math.sin(r*o.timeOfBlowing)>0,w.artifactCrashed=!1,w.nextArtifact-=1,w.nextArtifact<0&&(w.clouds.length<2&&!w.needTutorial&&w.clouds.push(new h(w)),w.entities.push(new a(w)),w.score.total+=1,w.nextArtifact=100*Math.random()+100),i.tapped&&(w.score.taps+=1,w.entities.push(new d(w,i.x,i.y)),i.tapped=!1,n=!0),t=0;t<w.entities.length;t+=1)w.entities[t].update(),"artifact"===w.entities[t].type&&(n&&(hit=p(w.entities[t],{x:i.x,y:i.y,r:7}),hit&&(w.addParticles(w.entities[t],3,7),w.score.hit+=1,w.entities[t].remove=!0,w.needTutorial=!1)),w.artifactCrashed&&w.addParticles(w.entities[t],4,10)),w.entities[t].remove&&w.entities.splice(t,1);for(e=0;e<w.clouds.length;e++)w.clouds[e].update(),w.clouds[e].remove&&w.clouds.splice(e,1);w.balloon.update(),w.pump.update(),w.score.accuracy=w.score.hit/w.score.taps*100,w.score.accuracy=isNaN(w.score.accuracy)?0:~~w.score.accuracy},render:function(){var t,e;for(u.rect(w,0,0,w.WIDTH,w.HEIGHT,o.bgColor),u.rect(w,0,w.HEIGHT-o.groundWidth,w.WIDTH,o.groundUpWidth,o.groundColorUp),u.rect(w,0,w.HEIGHT-o.groundDownWidth,w.WIDTH,o.groundDownWidth,o.groundColorDown),u.rect(w,w.WIDTH/5-25*w.imageScale,w.HEIGHT-o.groundWidth-o.hoseWidth,w.WIDTH/2-w.WIDTH/5,o.hoseWidth,o.hoseColor),u.rect(w,w.WIDTH/2-25,w.HEIGHT-o.groundUpWidth-o.groundDownWidth-10,o.platformWidth,o.platformHeight,o.hoseColor),e=0;e<w.clouds.length;e++)w.clouds[e].render();for(w.needTutorial&&w.score.total>0&&(u.text(w,"Нажимай",w.WIDTH/4+70,w.HEIGHT/3,42,o.tutorialColor),u.text(w,"на предметы,",w.WIDTH/4+40,w.HEIGHT/3+48,42,o.tutorialColor),u.text(w,"чтобы не дать им",w.WIDTH/4,w.HEIGHT/3+96,42,o.tutorialColor),u.text(w,"коснуться шарика!",w.WIDTH/4-10,w.HEIGHT/3+144,42,o.tutorialColor)),w.pump.render(),w.balloon.render(),t=0;t<w.entities.length;t+=1){var n=l(w.entities[t],w.balloon,w);if(n){window.cancelAnimationFrame(w.animId);var i=~~(o.animalsNum*w.balloon.h/(w.HEIGHT-o.groundWidth-o.platformHeight-67));i=Math.min(i,o.animalsNum-1),window.location="result.html?result="+i}w.entities[t].render()}u.text(w,"Очки: "+w.score.hit,20,32,28,o.textColor),u.text(w,"Меткость: "+w.score.accuracy+"%",w.WIDTH-230,32,28,o.textColor)},loop:function(){w.animId=requestAnimationFrame(w.loop),w.update(),w.render()},addParticles:function(t,e,n){for(var o=0;7>o;o+=1)w.entities.push(new c(w,t.x,t.y,e,"rgba(255,255,255,"+(.5*Math.random()+.5)+")",n))},restart:function(){w.entities=[],w.score={taps:0,hit:0,escaped:0,accuracy:0},delete w.balloon,delete w.pump}};t.exports=w},function(t){t.exports={width:640,height:960,bgColor:"#45d4e0",groundColorUp:"#00a651",groundColorDown:"#7cc576",hoseColor:"#f26122",textColor:"#fff",tutorialColor:"#fff",groundUpWidth:10,groundDownWidth:20,groundWidth:30,hoseWidth:4,platformWidth:50,platformHeight:10,animalsNum:14,tutorialQuantity:4,firstArtifact:100,timeOfBlowing:.5,balloon:{blowingSpeed:.3,minIndex:.2,unblowingIndex:.3,waveRange:5},artifact:{speedRange:8,quantity:4,heightOfAppearing:-100,heightRange:-100,waveRange:20},pump:{animationSpeed:5,waveRange:30},cloud:{speedRange:2,quantity:2,leftRange:-200,leftOfAppearing:-300}}},function(t){t.exports={x:0,y:0,tapped:!1,set:function(t,e){var n=this;n.x=(e.pageX-t.offset.left)/t.scale,n.y=(e.pageY-t.offset.top)/t.scale,n.tapped=!0}}},function(t,e,n){var o=n(8),i=n(2);t.exports=function(t){var e=this;e.type="artifact",e.speed=Math.random()*i.artifact.speedRange+1,t.score.total<i.tutorialQuantity&&t.needTutorial&&(e.speed=1),e.remove=!1;var n=Math.floor(Math.random()*i.artifact.quantity)+1;e.pic=new Image,e.pic.src="./i/a"+n+".png",e.pic.onload=function(){e.w=e.pic.naturalWidth,e.h=e.pic.naturalHeight,e.r=Math.min(e.w,e.h)/2,e.x=Math.random()*t.WIDTH-e.w/2,e.y=Math.random()*i.artifact.heightRange+i.artifact.heightOfAppearing,e.waveRange=i.artifact.waveRange+e.w/2,e.initX=e.x},e.update=function(){var n=.002*Date.now();e.y+=e.speed,e.x=e.waveRange*Math.sin(n)+e.initX,e.y>t.HEIGHT-i.groundWidth-e.h+10&&(t.artifactCrashed=!0,t.score.escaped+=1,e.remove=!0)},e.render=function(){o.pic(t,e.pic,e.x,e.y,e.w,e.h)}}},function(t,e,n){var o=n(8),i=n(2);t.exports=function(t){var e=this;e.type="balloon",e.pic=new Image,e.pic.src="./i/shar-size-1.png";var n=i.groundUpWidth+i.groundDownWidth;e.pic.onload=function(){e.w=e.pic.naturalWidth*i.balloon.minIndex,e.h=e.pic.naturalHeight*i.balloon.minIndex,e.x=t.WIDTH/2-e.w/2,e.y=t.HEIGHT-e.h-n-10,e.ratio=e.h/e.w,e.r=e.w/2,e.initX=e.x},e.update=function(){var o=.002*Date.now();t.blowing?(e.w+=i.balloon.blowingSpeed,e.h+=e.ratio*i.balloon.blowingSpeed,e.r=e.w/2):(e.w-=i.balloon.blowingSpeed*i.balloon.unblowingIndex,e.h-=e.ratio*i.balloon.blowingSpeed*i.balloon.unblowingIndex,e.r=e.w/2),e.x=i.balloon.waveRange*Math.sin(o)+(t.WIDTH/2-e.w/2),e.y=t.HEIGHT-e.h-n-10},e.render=function(){o.pic(t,e.pic,e.x,e.y,e.w,e.h)}}},function(t,e,n){var o=n(8);t.exports=function(t,e,n){var i=this;i.type="touch",i.x=e,i.y=n,i.r=5,i.opacity=1,i.fade=.1,i.update=function(){i.opacity-=i.fade,i.remove=i.opacity<0?!0:!1},i.render=function(){o.circle(t,i.x,i.y,i.r,"rgba(0,0,255,"+i.opacity+")")}}},function(t,e,n){var o=n(8);t.exports=function(t,e,n,i,a,r){var d=this;d.x=e,d.y=n,d.r=i,d.col=a,d.dir=2*Math.random()>1?1:-1,d.vx=~~(4*Math.random())*d.dir,d.vy=~~(Math.random()*r),d.remove=!1,d.update=function(){d.x+=d.vx,d.y-=d.vy,d.vx*=.99,d.vy*=.99,d.vy-=.25,d.y>t.HEIGHT&&(d.remove=!0)},d.render=function(){o.circle(t,d.x,d.y,d.r,d.col)}}},function(t){t.exports={clear:function(){game.ctx.clearRect(0,0,game.WIDTH,game.HEIGHT)},rect:function(t,e,n,o,i,a){t.ctx.fillStyle=a,t.ctx.fillRect(e,n,o,i)},circle:function(t,e,n,o,i){t.ctx.fillStyle=i,t.ctx.beginPath(),t.ctx.arc(e,n,o,0,2*Math.PI,!0),t.ctx.closePath(),t.ctx.fill()},text:function(t,e,n,o,i,a){t.ctx.font="normal "+i+"px Helvetica",t.ctx.fillStyle=a,t.ctx.fillText(e,n,o)},pic:function(t,e,n,o,i,a){t.ctx.drawImage(e,n,o,i,a)}}},function(t){t.exports=function(t,e){var n=t.x+t.w/2,o=t.y+t.h/2,i=(n-e.x)*(n-e.x)+(o-e.y)*(o-e.y),a=(t.r+e.r)*(t.r+e.r);return a>i}},function(t,e,n){n(8);t.exports=function(t,e){var n=t.x+t.w/2,o=t.y+t.h-t.r,i=e.x+e.r,a=e.y+e.r,r=(n-i)*(n-i)+(o-a)*(o-a),d=(t.r+e.r)*(t.r+e.r);return 20>r-d}},function(t,e,n){var o=n(8),i=n(2);t.exports=function(t){var e=this;e.type="pump",e.pump1=new Image,e.pump1.src="./i/pump1.png",e.pump2=new Image,e.pump2.src="./i/pump2.png",e.pump1.onload=function(){e.pump1.w=e.pump1.naturalWidth*t.imageScale,e.pump1.h=e.pump1.naturalHeight*t.imageScale,e.pump1.dx=t.WIDTH/5-e.pump1.w/2,e.pump1.dy=t.HEIGHT-e.pump1.h-i.groundWidth},e.pump2.onload=function(){e.pump2.w=e.pump2.naturalWidth*t.imageScale,e.pump2.h=e.pump2.naturalHeight*t.imageScale,e.pump2.dx=t.WIDTH/5-e.pump2.w/2,e.pump2.dy=t.HEIGHT-e.pump2.h-i.groundWidth},e.update=function(){var n=.002*Date.now();t.blowing&&(e.pump1.dy=i.pump.waveRange*t.imageScale*Math.sin(n*i.pump.animationSpeed)+t.HEIGHT-e.pump1.h-i.groundWidth-e.pump1.w/2)},e.render=function(){o.pic(t,e.pump1,e.pump1.dx,e.pump1.dy,e.pump1.w,e.pump1.h),o.pic(t,e.pump2,e.pump2.dx,e.pump2.dy,e.pump2.w,e.pump2.h)}}},function(t,e,n){var o=n(8),i=n(2);t.exports=function(t){var e=this;e.type="cloud",e.speed=Math.random()*i.cloud.speedRange+1,t.score.total<i.tutorialQuantity&&t.needTutorial&&(e.speed=1),e.remove=!1;var n=Math.floor(Math.random()*i.cloud.quantity)+1;e.pic=new Image,e.pic.src="./i/cloud"+n+".png",e.pic.onload=function(){e.w=e.pic.naturalWidth,e.h=e.pic.naturalHeight,e.x=Math.random()*i.cloud.leftRange+i.cloud.leftOfAppearing,e.y=Math.random()*(t.HEIGHT-400)},e.update=function(){e.x+=e.speed,e.x>t.WIDTH&&(e.remove=!0)},e.render=function(){o.pic(t,e.pic,e.x,e.y,e.w,e.h)}}}]);
//# sourceMappingURL=bundle.js.map