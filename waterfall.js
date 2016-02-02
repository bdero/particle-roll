
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}
	
	game_canvas=document.getElementById( "GameCanvas" );
	
	game_console=document.getElementById( "GameConsole" );

	try{
	
		bbInit();
		bbMain();
		
		if( game_runner!=null ) game_runner();
		
	}catch( err ){
	
		showError( err );
	}
}

//Globals
var game_canvas;
var game_console;
var game_runner;

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n[sounds/effects/blip1.mp3];type=audio/mpeg;\n[sounds/effects/blip1.ogg];type=audio/ogg;length=1108;hertz=22050;\n[sounds/effects/blip1.wav];type=audio/x-wav;length=1108;hertz=22050;\n[sounds/effects/blip2.mp3];type=audio/mpeg;\n[sounds/effects/blip2.ogg];type=audio/ogg;length=1013;hertz=22050;\n[sounds/effects/blip2.wav];type=audio/x-wav;length=1013;hertz=22050;\n[sounds/effects/blip3.mp3];type=audio/mpeg;\n[sounds/effects/blip3.ogg];type=audio/ogg;length=794;hertz=22050;\n[sounds/effects/blip3.wav];type=audio/x-wav;length=794;hertz=22050;\n[sounds/effects/blip4.mp3];type=audio/mpeg;\n[sounds/effects/blip4.ogg];type=audio/ogg;length=1365;hertz=22050;\n[sounds/effects/blip4.wav];type=audio/x-wav;length=1365;hertz=22050;\n[sounds/effects/blip5.mp3];type=audio/mpeg;\n[sounds/effects/blip5.ogg];type=audio/ogg;length=1413;hertz=22050;\n[sounds/effects/blip5.wav];type=audio/x-wav;length=1413;hertz=22050;\n[sounds/effects/hit1.mp3];type=audio/mpeg;\n[sounds/effects/hit1.ogg];type=audio/ogg;length=12837;hertz=22050;\n[sounds/effects/hit1.wav];type=audio/x-wav;length=12837;hertz=22050;\n[sounds/effects/hit2.mp3];type=audio/mpeg;\n[sounds/effects/hit2.ogg];type=audio/ogg;length=12045;hertz=22050;\n[sounds/effects/hit2.wav];type=audio/x-wav;length=12045;hertz=22050;\n[sounds/effects/hit3.mp3];type=audio/mpeg;\n[sounds/effects/hit3.ogg];type=audio/ogg;length=13564;hertz=22050;\n[sounds/effects/hit3.wav];type=audio/x-wav;length=13564;hertz=22050;\n[sounds/effects/hit4.mp3];type=audio/mpeg;\n[sounds/effects/hit4.ogg];type=audio/ogg;length=12637;hertz=22050;\n[sounds/effects/hit4.wav];type=audio/x-wav;length=12637;hertz=22050;\n[sounds/effects/hit5.mp3];type=audio/mpeg;\n[sounds/effects/hit5.ogg];type=audio/ogg;length=12558;hertz=22050;\n[sounds/effects/hit5.wav];type=audio/x-wav;length=12558;hertz=22050;\n";

//${METADATA_END}
function getMetaData( path,key ){	
	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

function loadString( path ){
	if( path=="" ) return "";
//${TEXTFILES_BEGIN}
		return "";

//${TEXTFILES_END}
}

function loadImage( path,onloadfun ){
	var ty=getMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;

	var image=new Image();
	
	image.meta_width=parseInt( getMetaData( path,"width" ) );
	image.meta_height=parseInt( getMetaData( path,"height" ) );
	image.onload=onloadfun;
	image.src="data/"+path;
	
	return image;
}

function loadAudio( path ){
	var audio=new Audio( "data/"+path );
	return audio;
}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	var str="";
	push_err();
	err_stack.reverse();
	for( var i=0;i<err_stack.length;++i ){
		str+=err_stack[i]+"\n";
	}
	err_stack.reverse();
	pop_err();
	return str;
}

function print( str ){
	if( game_console ){
		game_console.value+=str+"\n";
	}
	if( window.console!=undefined ){
		window.console.log( str );
	}
}

function showError( err ){
	if( err.length ) alert( "Monkey runtime error: "+err+"\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index>=0 && index<arr.length ) return arr;
	error( "Array index out of range" );
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_starts_with( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_ends_with( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

var dead=false;

var KEY_LMB=1;
var KEY_RMB=2;
var KEY_MMB=3;
var KEY_TOUCH0=0x180;

function eatEvent( e ){
	if( e.stopPropagation ){
		e.stopPropagation();
		e.preventDefault();
	}else{
		e.cancelBubble=true;
		e.returnValue=false;
	}
}

function keyToChar( key ){
	switch( key ){
	case 8:
	case 9:
	case 13:
	case 27:
	case 32:
		return key;
	case 33:
	case 34:
	case 35:
	case 36:
	case 37:
	case 38:
	case 39:
	case 40:
	case 45:
		return key | 0x10000;
	case 46:
		return 127;
	}
	return 0;
}

//***** gxtkApp class *****

function gxtkApp(){

	this.graphics=new gxtkGraphics( this,game_canvas );
	this.input=new gxtkInput( this );
	this.audio=new gxtkAudio( this );

	this.loading=0;
	this.maxloading=0;

	this.updateRate=0;
	
	this.startMillis=(new Date).getTime();
	
	this.suspended=false;
	
	var app=this;
	var canvas=game_canvas;
	
	function gxtkMain(){
		canvas.onkeydown=function( e ){
			app.input.OnKeyDown( e.keyCode );
			var chr=keyToChar( e.keyCode );
			if( chr ) app.input.PutChar( chr );
			if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
		}

		canvas.onkeyup=function( e ){
			app.input.OnKeyUp( e.keyCode );
		}

		canvas.onkeypress=function( e ){
			if( e.charCode ){
				app.input.PutChar( e.charCode );
			}else if( e.which ){
				app.input.PutChar( e.which );
			}
		}

		canvas.onmousedown=function( e ){
			switch( e.button ){
			case 0:app.input.OnKeyDown( KEY_LMB );break;
			case 1:app.input.OnKeyDown( KEY_MMB );break;
			case 2:app.input.OnKeyDown( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseup=function( e ){
			switch( e.button ){
			case 0:app.input.OnKeyUp( KEY_LMB );break;
			case 1:app.input.OnKeyUp( KEY_MMB );break;
			case 2:app.input.OnKeyUp( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseout=function( e ){
			app.input.OnKeyUp( KEY_LMB );
			app.input.OnKeyUp( KEY_MMB );
			app.input.OnKeyUp( KEY_RMB );
			eatEvent( e );
		}

		canvas.onmousemove=function( e ){
			var x=e.clientX+document.body.scrollLeft;
			var y=e.clientY+document.body.scrollTop;
			var c=canvas;
			while( c ){
				x-=c.offsetLeft;
				y-=c.offsetTop;
				c=c.offsetParent;
			}
			app.input.OnMouseMove( x,y );
			eatEvent( e );
		}

		canvas.onfocus=function( e ){
			//app.InvokeOnResume();
		}
		
		canvas.onblur=function( e ){
			//app.InvokeOnSuspend();
		}

		canvas.focus();

		app.InvokeOnCreate();
		app.InvokeOnRender();
	}
	
	game_runner=gxtkMain;
}

var timerSeq=0;

gxtkApp.prototype.SetFrameRate=function( fps ){

	var seq=++timerSeq;
	
	if( !fps ) return;
	
	var app=this;
	var updatePeriod=1000.0/fps;
	var nextUpdate=(new Date).getTime()+updatePeriod;
	
	function timeElapsed(){
		if( seq!=timerSeq ) return;

		var time;		
		var updates=0;

		for(;;){
			nextUpdate+=updatePeriod;

			app.InvokeOnUpdate();
			if( seq!=timerSeq ) return;
			
			if( nextUpdate>(new Date).getTime() ) break;
			
			if( ++updates==7 ){
				nextUpdate=(new Date).getTime();
				break;
			}
		}
		app.InvokeOnRender();
		if( seq!=timerSeq ) return;
			
		var delay=nextUpdate-(new Date).getTime();
		setTimeout( timeElapsed,delay>0 ? delay : 0 );
	}
	
	setTimeout( timeElapsed,updatePeriod );
}

gxtkApp.prototype.IncLoading=function(){
	++this.loading;
	if( this.loading>this.maxloading ) this.maxloading=this.loading;
	if( this.loading==1 ) this.SetFrameRate( 0 );
}

gxtkApp.prototype.DecLoading=function(){
	--this.loading;
	if( this.loading!=0 ) return;
	this.maxloading=0;
	this.SetFrameRate( this.updateRate );
}

gxtkApp.prototype.GetMetaData=function( path,key ){
	return getMetaData( path,key );
}

gxtkApp.prototype.Die=function( err ){
	dead=true;
	this.audio.OnSuspend();
	showError( err );
}

gxtkApp.prototype.InvokeOnCreate=function(){
	if( dead ) return;
	
	try{
		this.OnCreate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnUpdate=function(){
	if( dead || this.suspended || !this.updateRate || this.loading ) return;
	
	try{
		this.input.BeginUpdate();
		this.OnUpdate();		
		this.input.EndUpdate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnSuspend=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.suspended=true;
		this.OnSuspend();
		this.audio.OnSuspend();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnResume=function(){
	if( dead || !this.suspended ) return;
	
	try{
		this.audio.OnResume();
		this.OnResume();
		this.suspended=false;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnRender=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.graphics.BeginRender();
		if( this.loading ){
			this.OnLoading();
		}else{
			this.OnRender();
		}
		this.graphics.EndRender();
	}catch( ex ){
		this.Die( ex );
	}
}

//***** GXTK API *****

gxtkApp.prototype.GraphicsDevice=function(){
	return this.graphics;
}

gxtkApp.prototype.InputDevice=function(){
	return this.input;
}

gxtkApp.prototype.AudioDevice=function(){
	return this.audio;
}

gxtkApp.prototype.AppTitle=function(){
	return document.URL;
}

gxtkApp.prototype.LoadState=function(){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var bits=document.cookie.split( ";" )
		if( bits.length!=1 ) return "";
		bits=bits[0].split( "=" );
		if( bits.length!=2 || bits[0]!=".mojostate" ) return "";
		return unescape( bits[1] );
	}else{
		var state=localStorage.getItem( ".mojostate@"+document.URL );
		if( state ) return state;
	}
	return "";
}

gxtkApp.prototype.SaveState=function( state ){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var exdate=new Date();
		exdate.setDate( exdate.getDate()+3650 );
		document.cookie=".mojostate="+escape( state )+"; expires="+exdate.toUTCString()
	}else{
		localStorage.setItem( ".mojostate@"+document.URL,state );
	}
}

gxtkApp.prototype.LoadString=function( path ){
	return loadString( path );
}

gxtkApp.prototype.SetUpdateRate=function( fps ){
	this.updateRate=fps;
	
	if( !this.loading ) this.SetFrameRate( fps );
}

gxtkApp.prototype.MilliSecs=function(){
	return ((new Date).getTime()-this.startMillis)|0;
}

gxtkApp.prototype.Loading=function(){
	return this.loading;
}

gxtkApp.prototype.OnCreate=function(){
}

gxtkApp.prototype.OnUpdate=function(){
}

gxtkApp.prototype.OnSuspend=function(){
}

gxtkApp.prototype.OnResume=function(){
}

gxtkApp.prototype.OnRender=function(){
}

gxtkApp.prototype.OnLoading=function(){
}

//***** gxtkGraphics class *****

function gxtkGraphics( app,canvas ){
	this.app=app;
	this.canvas=canvas;
	this.gc=canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1.0;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.gc.save();
}

gxtkGraphics.prototype.EndRender=function(){
	this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.canvas.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.canvas.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	
	var app=this.app;
	
	function onloadfun(){
		app.DecLoading();
	}

	app.IncLoading();

	var image=loadImage( path,onloadfun );
	if( image ) return new gxtkSurface( image,this );

	app.DecLoading();
	return null;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<6 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tgc=this.tmpCanvas.getContext( "2d" );
	
	tgc.globalCompositeOperation="copy";

	tgc.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tgc.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tgc.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

//***** Class gxtkInput *****

function gxtkInput( app ){
	this.app=app;
	this.keyStates=new Array( 512 );
	this.charQueue=new Array( 32 );
	this.charPut=0;
	this.charGet=0;
	this.mouseX=0;
	this.mouseY=0;
	this.joyX=0;
	this.joyY=0;
	this.joyZ=0;
	this.accelX=0;
	this.accelY=0;
	this.accelZ=0;
	for( var i=0;i<512;++i ){
		this.keyStates[i]=0;
	}
}

gxtkInput.prototype.BeginUpdate=function(){
}

gxtkInput.prototype.EndUpdate=function(){
	for( var i=0;i<512;++i ){
		this.keyStates[i]&=0x100;
	}
	this.charGet=0;
	this.charPut=0;
}

gxtkInput.prototype.OnKeyDown=function( key ){
	if( (this.keyStates[key]&0x100)==0 ){
		this.keyStates[key]|=0x100;
		++this.keyStates[key];	
	}
}

gxtkInput.prototype.OnKeyUp=function( key ){
	this.keyStates[key]&=0xff;
}

gxtkInput.prototype.PutChar=function( char ){
	if( this.charPut-this.charGet<32 ){
		this.charQueue[this.charPut & 31]=char;
		this.charPut+=1;
	}
}

gxtkInput.prototype.OnMouseMove=function( x,y ){
	this.mouseX=x;
	this.mouseY=y;
}

//***** GXTK API *****

gxtkInput.prototype.SetKeyboardEnabled=function( enabled ){
	return 0;
}

gxtkInput.prototype.KeyDown=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] >> 8;
	}
	return 0;
}

gxtkInput.prototype.KeyHit=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] & 0xff;
	}
	return 0;
}

gxtkInput.prototype.GetChar=function(){
	if( this.charPut!=this.charGet ){
		var char=this.charQueue[this.charGet & 31];
		this.charGet+=1;
		return char;
	}
	return 0;
}

gxtkInput.prototype.MouseX=function(){
	return this.mouseX;
}

gxtkInput.prototype.MouseY=function(){
	return this.mouseY;
}

gxtkInput.prototype.JoyX=function( index ){
	return this.joyX;
}

gxtkInput.prototype.JoyY=function( index ){
	return this.joyY;
}

gxtkInput.prototype.JoyZ=function( index ){
	return this.joyZ;
}

gxtkInput.prototype.TouchX=function( index ){
	return this.mouseX;
}

gxtkInput.prototype.TouchY=function( index ){
	return this.mouseY;
}

gxtkInput.prototype.AccelX=function(){
	return 0;
}

gxtkInput.prototype.AccelY=function(){
	return 0;
}

gxtkInput.prototype.AccelZ=function(){
	return 0;
}


//***** gxtkChannel class *****
function gxtkChannel(){
	this.audio=null;
	this.sample=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
}

//***** gxtkAudio class *****
function gxtkAudio( app ){
	this.app=app;
	this.okay=typeof(Audio)!="undefined";
	this.nextchan=0;
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.OnSuspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.pause();
	}
}

gxtkAudio.prototype.OnResume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	var audio=loadAudio( path );
	if( audio ) return new gxtkSample( audio );
	return null;
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];
	
	if( chan.sample==sample && chan.audio ){	//&& !chan.audio.paused ){
		chan.audio.loop=(flags&1)!=0;
		chan.audio.volume=chan.volume;
		try{
			chan.audio.currentTime=0;
		}catch(ex){
		}
		chan.audio.play();
		return;
	}

	if( chan.audio ) chan.audio.pause();
	
	var audio=sample.AllocAudio();
	
	if( audio ){
		for( var i=0;i<33;++i ){
			if( this.channels[i].audio==audio ){
				this.channels[i].audio=null;
				break;
			}
		}
		audio.loop=(flags&1)!=0;
		audio.volume=chan.volume;
		audio.play();
	}
	
	chan.audio=audio;
	chan.sample=sample;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.pause();
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio && !chan.audio.paused && !chan.audio.ended ) return 1;
	return 0;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.MusicState=function(){

	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){

	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.insts=new Array( 8 );
	this.insts[0]=audio;
}

gxtkSample.prototype.Discard=function(){
	if( this.audio ){
		this.audio=null;
		for( var i=0;i<8;++i ){
			this.insts[i]=null;
		}
	}
}

gxtkSample.prototype.AllocAudio=function(){
	for( var i=0;i<8;++i ){
		var audio=this.insts[i];
		if( audio ){
			//Ok, this is ugly but seems to work best...no idea how/why!
			if( audio.paused ){
				if( audio.currentTime==0 ) return audio;
				audio.currentTime=0;
			}else if( audio.ended ){
				audio.pause();
			}
		}else{
			audio=new Audio( this.audio.src );
			this.insts[i]=audio;
			return audio;
		}
	}
	return null;
}
var diddy = new Object();

diddy.systemMillisecs=function(){
	return new Date().getTime();
};

diddy.flushKeys=function(){
	for( var i = 0; i < 512; ++i )
	{
		bb_input_device.keyStates[i]=0;
	}
};

diddy.getUpdateRate=function(){
	return bb_app_device.updateRate;
};

diddy.showMouse=function()
{
	document.getElementById("GameCanvas").style.cursor='default';
}
diddy.setGraphics=function(w, h)
{
	var canvas=document.getElementById( "GameCanvas" );
	canvas.width  = w;
	canvas.height = h;
	//return window.innerHeight;
}
diddy.setMouse=function(x, y)
{
}
diddy.showKeyboard=function()
{
}
diddy.launchBrowser=function(address)
{
	window.open(address);
}
diddy.launchEmail=function(email, subject, text)
{
	location.href="mailto:"+email+"&subject="+subject+"&body="+text+"";
}

diddy.realMod=function(value, amount)
{
	return value % amount;
}
diddy.startVibrate=function(millisecs)
{
}
diddy.stopVibrate=function()
{
}

diddy.getDayOfMonth=function(){
	return new Date().getDate();
}

diddy.getDayOfWeek=function(){
	return new Date().getDay()+1;
}

diddy.getMonth=function(){
	return new Date().getMonth()+1;
}

diddy.getYear=function(){
	return new Date().getFullYear();
}

diddy.getHours=function(){
	return new Date().getHours();
}

diddy.getMinutes=function(){
	return new Date().getMinutes();
}

diddy.getSeconds=function(){
	return new Date().getSeconds();
}

diddy.getMilliSeconds=function(){
	return new Date().getMilliseconds();
}

diddy.startGps=function(){

}
diddy.getLatitiude=function(){
	return ""
}
diddy.getLongitude=function(){
	return ""
}
diddy.showAlertDialog=function(title, message)
{
}
diddy.getInputString=function()
{
	return "";
}

diddy.hideMouse=function()
{
	document.getElementById("GameCanvas").style.cursor= "url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
}
function bb_app_App(){
	Object.call(this);
}
function bb_app_new(){
	bb_app_device=bb_app_new2.call(new bb_app_AppDevice,this);
	return this;
}
bb_app_App.prototype.bbm_OnCreate=function(){
	return 0;
}
bb_app_App.prototype.bbm_OnUpdate=function(){
	return 0;
}
bb_app_App.prototype.bbm_OnSuspend=function(){
	return 0;
}
bb_app_App.prototype.bbm_OnResume=function(){
	return 0;
}
bb_app_App.prototype.bbm_OnRender=function(){
	return 0;
}
bb_app_App.prototype.bbm_OnLoading=function(){
	return 0;
}
function bb_framework_DiddyApp(){
	bb_app_App.call(this);
	this.bb_exitScreen=null;
	this.bb_screenFade=null;
	this.bb_images=null;
	this.bb_sounds=null;
	this.bb_inputCache=null;
	this.bb_virtualResOn=true;
	this.bb_mouseX=0;
	this.bb_mouseY=0;
	this.bb_FPS=60;
	this.bb_useFixedRateLogic=false;
	this.bb_frameRate=200.0;
	this.bb_ms=0.0;
	this.bb_numTicks=.0;
	this.bb_lastNumTicks=.0;
	this.bb_lastTime=.0;
	this.bb_currentScreen=null;
	this.bb_debugOn=false;
	this.bb_musicFile="";
	this.bb_musicOkay=0;
	this.bb_musicVolume=100;
	this.bb_mojoMusicVolume=1.0;
	this.bb_soundVolume=100;
	this.bb_drawFPSOn=false;
	this.bb_tmpMs=.0;
	this.bb_maxMs=50;
	this.bb_debugKeyOn=false;
	this.bb_debugKey=112;
	this.bb_mouseHit=0;
	this.bb_nextScreen=null;
}
bb_framework_DiddyApp.prototype=extend_class(bb_app_App);
function bb_framework_new(){
	bb_app_new.call(this);
	this.bb_exitScreen=bb_framework_new3.call(new bb_framework_ExitScreen);
	this.bb_screenFade=bb_framework_new4.call(new bb_framework_ScreenFade);
	this.bb_images=bb_framework_new5.call(new bb_framework_ImageBank);
	this.bb_sounds=bb_framework_new7.call(new bb_framework_SoundBank);
	this.bb_inputCache=bb_inputcache_new.call(new bb_inputcache_InputCache);
	return this;
}
bb_framework_DiddyApp.prototype.bbm_SetScreenSize=function(bbt_w,bbt_h){
	bb_framework_SCREEN_WIDTH=bbt_w;
	bb_framework_SCREEN_HEIGHT=bbt_h;
	bb_framework_SCREEN_WIDTH2=bb_framework_SCREEN_WIDTH/2.0;
	bb_framework_SCREEN_HEIGHT2=bb_framework_SCREEN_HEIGHT/2.0;
	bb_framework_SCREENX_RATIO=(bb_framework_DEVICE_WIDTH)/bb_framework_SCREEN_WIDTH;
	bb_framework_SCREENY_RATIO=(bb_framework_DEVICE_HEIGHT)/bb_framework_SCREEN_HEIGHT;
	if(bb_framework_SCREENX_RATIO!=1.0 || bb_framework_SCREENY_RATIO!=1.0){
		this.bb_virtualResOn=true;
	}
}
bb_framework_DiddyApp.prototype.bbm_ResetFixedRateLogic=function(){
	this.bb_ms=1000.0/this.bb_frameRate;
	this.bb_numTicks=0.0;
	this.bb_lastNumTicks=1.0;
	this.bb_lastTime=(bb_app_Millisecs());
	if(bb_framework_dt!=null){
		bb_framework_dt.bb_delta=1.0;
	}
}
bb_framework_DiddyApp.prototype.bbm_OnCreate=function(){
	bb_framework_DEVICE_WIDTH=bb_graphics_DeviceWidth();
	bb_framework_DEVICE_HEIGHT=bb_graphics_DeviceHeight();
	this.bbm_SetScreenSize((bb_framework_DEVICE_WIDTH),(bb_framework_DEVICE_HEIGHT));
	this.bb_mouseX=((bb_input_MouseX()/bb_framework_SCREENX_RATIO)|0);
	this.bb_mouseY=((bb_input_MouseY()/bb_framework_SCREENY_RATIO)|0);
	bb_random_Seed=diddy.systemMillisecs();
	bb_framework_dt=bb_framework_new8.call(new bb_framework_DeltaTimer,(this.bb_FPS));
	bb_app_SetUpdateRate(this.bb_FPS);
	bb_framework_Cache();
	if(this.bb_useFixedRateLogic){
		this.bbm_ResetFixedRateLogic();
	}
	return 0;
}
bb_framework_DiddyApp.prototype.bbm_DrawDebug=function(){
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_framework_Draw(0,0,0.0,0.0);
	var bbt_y=10;
	var bbt_gap=10;
	bb_graphics_DrawText("Screen             = "+this.bb_currentScreen.bb_name,0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Delta              = "+bb_functions_FormatNumber(bb_framework_dt.bb_delta,2,0,0),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Frame Time         = "+String(bb_framework_dt.bb_frametime),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Screen Width       = "+String(bb_framework_SCREEN_WIDTH),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Screen Height      = "+String(bb_framework_SCREEN_HEIGHT),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("VMouseX            = "+String(this.bb_mouseX),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("VMouseY            = "+String(this.bb_mouseY),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("MouseX             = "+String(bb_input_MouseX()),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("MouseY             = "+String(bb_input_MouseY()),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Music File         = "+this.bb_musicFile,0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("MusicOkay          = "+String(this.bb_musicOkay),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Music State        = "+String(bb_audio_MusicState()),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Music Volume       = "+String(this.bb_musicVolume),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Mojo Music Volume  = "+String(this.bb_mojoMusicVolume),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Sound Volume       = "+String(this.bb_soundVolume),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
	bb_graphics_DrawText("Sound Channel      = "+String(bb_framework_channel),0.0,(bbt_y),0.0,0.0);
	bbt_y+=bbt_gap;
}
bb_framework_DiddyApp.prototype.bbm_DrawFPS=function(){
	bb_graphics_DrawText(String(bb_framework_totalFPS),0.0,0.0,0.0,0.0);
}
bb_framework_DiddyApp.prototype.bbm_OnRender=function(){
	bb_framework_Update();
	if(this.bb_virtualResOn){
		bb_graphics_PushMatrix();
		bb_graphics_Scale(bb_framework_SCREENX_RATIO,bb_framework_SCREENY_RATIO);
	}
	this.bb_currentScreen.bbm_Render();
	if(this.bb_virtualResOn){
		bb_graphics_PopMatrix();
	}
	this.bb_currentScreen.bbm_ExtraRender();
	if(this.bb_screenFade.bb_active){
		this.bb_screenFade.bbm_Render();
	}
	this.bb_currentScreen.bbm_DebugRender();
	if(this.bb_debugOn){
		this.bbm_DrawDebug();
	}
	if(this.bb_drawFPSOn){
		this.bbm_DrawFPS();
	}
	return 0;
}
bb_framework_DiddyApp.prototype.bbm_OverrideUpdate=function(){
}
bb_framework_DiddyApp.prototype.bbm_SetMojoMusicVolume=function(bbt_volume){
	if(bbt_volume<0.0){
		bbt_volume=0.0;
	}
	if(bbt_volume>1.0){
		bbt_volume=1.0;
	}
	this.bb_mojoMusicVolume=bbt_volume;
	bb_audio_SetMusicVolume(this.bb_mojoMusicVolume);
}
bb_framework_DiddyApp.prototype.bbm_Update=function(bbt_fixedRateLogicDelta){
	bb_framework_dt.bbm_UpdateDelta();
	if(this.bb_useFixedRateLogic){
		bb_framework_dt.bb_delta=bbt_fixedRateLogicDelta;
	}
	this.bb_inputCache.bbm_ReadInput();
	this.bb_inputCache.bbm_HandleEvents(this.bb_currentScreen);
	if(this.bb_debugKeyOn){
		if((bb_input_KeyHit(this.bb_debugKey))!=0){
			this.bb_debugOn=!this.bb_debugOn;
		}
	}
	this.bb_mouseX=((bb_input_MouseX()/bb_framework_SCREENX_RATIO)|0);
	this.bb_mouseY=((bb_input_MouseY()/bb_framework_SCREENY_RATIO)|0);
	this.bb_mouseHit=bb_input_MouseHit(0);
	if(this.bb_screenFade.bb_active){
		this.bb_screenFade.bbm_Update2();
	}
	this.bb_currentScreen.bbm_Update2();
}
bb_framework_DiddyApp.prototype.bbm_OnUpdate=function(){
	this.bbm_OverrideUpdate();
	if(this.bb_useFixedRateLogic){
		var bbt_now=bb_app_Millisecs();
		if((bbt_now)<this.bb_lastTime){
			this.bb_numTicks=this.bb_lastNumTicks;
		}else{
			this.bb_tmpMs=(bbt_now)-this.bb_lastTime;
			if(this.bb_tmpMs>(this.bb_maxMs)){
				this.bb_tmpMs=(this.bb_maxMs);
			}
			this.bb_numTicks=this.bb_tmpMs/this.bb_ms;
		}
		this.bb_lastTime=(bbt_now);
		this.bb_lastNumTicks=this.bb_numTicks;
		for(var bbt_i=1;(bbt_i)<=Math.floor(this.bb_numTicks);bbt_i=bbt_i+1){
			this.bbm_Update(1.0);
		}
		var bbt_re=diddy.realMod(this.bb_numTicks,1.0);
		if(bbt_re>0.0){
			this.bbm_Update(bbt_re);
		}
	}else{
		this.bbm_Update(0.0);
	}
	return 0;
}
function bb_main_Game(){
	bb_framework_DiddyApp.call(this);
	this.bb_vrm=null;
	this.bb_parser=null;
}
bb_main_Game.prototype=extend_class(bb_framework_DiddyApp);
function bb_main_new(){
	bb_framework_new.call(this);
	return this;
}
bb_main_Game.prototype.bbm_LoadSFX=function(){
	var bbt_sfxNames=["blip","hit"];
	bb_sound_sfxRepo=new_array_array(bbt_sfxNames.length);
	for(var bbt_i=0;bbt_i<bb_sound_sfxRepo.length;bbt_i=bbt_i+1){
		bb_sound_sfxRepo[bbt_i]=new_object_array(5);
		for(var bbt_j=0;bbt_j<bb_sound_sfxRepo[bbt_i].length;bbt_j=bbt_j+1){
			var bbt_name=bbt_sfxNames[bbt_i]+String(bbt_j+1);
			this.bb_sounds.bbm_Load2("effects/"+bbt_name,"",false);
			bb_sound_sfxRepo[bbt_i][bbt_j]=this.bb_sounds.bbm_Find(bbt_name);
		}
	}
}
bb_main_Game.prototype.bbm_OnCreate=function(){
	bb_framework_DiddyApp.prototype.bbm_OnCreate.call(this);
	bb_graphics_SetBlend(1);
	bb_app_SetUpdateRate(60);
	this.bb_vrm=bb_virtual_new.call(new bb_virtual_VirtualResolutionManager,(this),bb_essentials_new.call(new bb_essentials_Vector2,800.0,600.0),bb_essentials_new.call(new bb_essentials_Vector2,(bb_framework_DEVICE_WIDTH),(bb_framework_DEVICE_HEIGHT)),2);
	this.bb_vrm.bbm_AdjustScreenSize(2,800.0,600.0);
	this.bb_parser=bb_xml_new.call(new bb_xml_XMLParser);
	this.bbm_LoadSFX();
	bb_main_screens=[(bb_splashscreen_new.call(new bb_splashscreen_SplashScreen)),(bb_gamescreen_new.call(new bb_gamescreen_GameScreen))];
	bb_main_screens[0].bbm_PreStart();
	return 0;
}
function bb_app_AppDevice(){
	gxtkApp.call(this);
	this.bb_app=null;
	this.bb_updateRate=0;
}
bb_app_AppDevice.prototype=extend_class(gxtkApp);
function bb_app_new2(bbt_app){
	this.bb_app=bbt_app;
	bb_graphics_SetGraphicsContext(bb_graphics_new.call(new bb_graphics_GraphicsContext,this.GraphicsDevice()));
	bb_input_SetInputDevice(this.InputDevice());
	bb_audio_SetAudioDevice(this.AudioDevice());
	return this;
}
function bb_app_new3(){
	return this;
}
bb_app_AppDevice.prototype.OnCreate=function(){
	bb_graphics_SetFont(null,32);
	return this.bb_app.bbm_OnCreate();
}
bb_app_AppDevice.prototype.OnUpdate=function(){
	return this.bb_app.bbm_OnUpdate();
}
bb_app_AppDevice.prototype.OnSuspend=function(){
	return this.bb_app.bbm_OnSuspend();
}
bb_app_AppDevice.prototype.OnResume=function(){
	return this.bb_app.bbm_OnResume();
}
bb_app_AppDevice.prototype.OnRender=function(){
	bb_graphics_BeginRender();
	var bbt_r=this.bb_app.bbm_OnRender();
	bb_graphics_EndRender();
	return bbt_r;
}
bb_app_AppDevice.prototype.OnLoading=function(){
	bb_graphics_BeginRender();
	var bbt_r=this.bb_app.bbm_OnLoading();
	bb_graphics_EndRender();
	return bbt_r;
}
bb_app_AppDevice.prototype.SetUpdateRate=function(bbt_hertz){
	gxtkApp.prototype.SetUpdateRate.call(this,bbt_hertz);
	this.bb_updateRate=bbt_hertz;
	return 0;
}
function bb_graphics_GraphicsContext(){
	Object.call(this);
	this.bb_device=null;
	this.bb_defaultFont=null;
	this.bb_font=null;
	this.bb_firstChar=0;
	this.bb_matrixSp=0;
	this.bb_ix=1.0;
	this.bb_iy=.0;
	this.bb_jx=.0;
	this.bb_jy=1.0;
	this.bb_tx=.0;
	this.bb_ty=.0;
	this.bb_tformed=0;
	this.bb_matDirty=0;
	this.bb_color_r=.0;
	this.bb_color_g=.0;
	this.bb_color_b=.0;
	this.bb_alpha=.0;
	this.bb_blend=0;
	this.bb_scissor_x=.0;
	this.bb_scissor_y=.0;
	this.bb_scissor_width=.0;
	this.bb_scissor_height=.0;
	this.bb_matrixStack=new_number_array(192);
}
function bb_graphics_new(bbt_device){
	this.bb_device=bbt_device;
	return this;
}
function bb_graphics_new2(){
	return this;
}
var bb_graphics_context;
function bb_graphics_SetGraphicsContext(bbt_gc){
	bb_graphics_context=bbt_gc;
	return 0;
}
var bb_input_device;
function bb_input_SetInputDevice(bbt_dev){
	bb_input_device=bbt_dev;
	return 0;
}
var bb_audio_device;
function bb_audio_SetAudioDevice(bbt_dev){
	bb_audio_device=bbt_dev;
	return 0;
}
var bb_app_device;
function bb_framework_Screen(){
	Object.call(this);
	this.bb_name="";
}
function bb_framework_new2(){
	return this;
}
bb_framework_Screen.prototype.bbm_Render=function(){
}
bb_framework_Screen.prototype.bbm_ExtraRender=function(){
}
bb_framework_Screen.prototype.bbm_DebugRender=function(){
}
bb_framework_Screen.prototype.bbm_OnTouchHit=function(bbt_x,bbt_y,bbt_pointer){
}
bb_framework_Screen.prototype.bbm_OnTouchClick=function(bbt_x,bbt_y,bbt_pointer){
}
bb_framework_Screen.prototype.bbm_OnTouchFling=function(bbt_releaseX,bbt_releaseY,bbt_velocityX,bbt_velocityY,bbt_velocitySpeed,bbt_pointer){
}
bb_framework_Screen.prototype.bbm_OnTouchReleased=function(bbt_x,bbt_y,bbt_pointer){
}
bb_framework_Screen.prototype.bbm_OnTouchDragged=function(bbt_x,bbt_y,bbt_dx,bbt_dy,bbt_pointer){
}
bb_framework_Screen.prototype.bbm_OnTouchLongPress=function(bbt_x,bbt_y,bbt_pointer){
}
bb_framework_Screen.prototype.bbm_Start=function(){
}
bb_framework_Screen.prototype.bbm_PreStart=function(){
	bb_framework_game.bb_currentScreen=this;
	this.bbm_Start();
}
bb_framework_Screen.prototype.bbm_PostFadeOut=function(){
	bb_framework_game.bb_nextScreen.bbm_PreStart();
}
bb_framework_Screen.prototype.bbm_PostFadeIn=function(){
}
bb_framework_Screen.prototype.bbm_Update2=function(){
}
function bb_framework_ExitScreen(){
	bb_framework_Screen.call(this);
}
bb_framework_ExitScreen.prototype=extend_class(bb_framework_Screen);
function bb_framework_new3(){
	bb_framework_new2.call(this);
	this.bb_name="exit";
	return this;
}
bb_framework_ExitScreen.prototype.bbm_Start=function(){
	bb_functions_ExitApp();
}
bb_framework_ExitScreen.prototype.bbm_Render=function(){
}
bb_framework_ExitScreen.prototype.bbm_Update2=function(){
}
function bb_framework_ScreenFade(){
	Object.call(this);
	this.bb_active=false;
	this.bb_ratio=0.0;
	this.bb_counter=.0;
	this.bb_fadeTime=.0;
	this.bb_fadeMusic=false;
	this.bb_fadeOut=false;
	this.bb_fadeSound=false;
}
function bb_framework_new4(){
	return this;
}
bb_framework_ScreenFade.prototype.bbm_Render=function(){
	if(!this.bb_active){
		return;
	}
	bb_graphics_SetAlpha(1.0-this.bb_ratio);
	bb_graphics_SetColor(0.0,0.0,0.0);
	bb_graphics_DrawRect(0.0,0.0,(bb_framework_DEVICE_WIDTH),(bb_framework_DEVICE_HEIGHT));
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
}
bb_framework_ScreenFade.prototype.bbm_CalcRatio=function(){
	this.bb_ratio=this.bb_counter/this.bb_fadeTime;
	if(this.bb_ratio<0.0){
		this.bb_ratio=0.0;
		if(this.bb_fadeMusic){
			bb_framework_game.bbm_SetMojoMusicVolume(0.0);
		}
	}
	if(this.bb_ratio>1.0){
		this.bb_ratio=1.0;
		if(this.bb_fadeMusic){
			bb_framework_game.bbm_SetMojoMusicVolume((bb_framework_game.bb_musicVolume)/100.0);
		}
	}
	if(this.bb_fadeOut){
		this.bb_ratio=1.0-this.bb_ratio;
	}
}
bb_framework_ScreenFade.prototype.bbm_Update2=function(){
	if(!this.bb_active){
		return;
	}
	this.bb_counter+=bb_framework_dt.bb_delta;
	this.bbm_CalcRatio();
	if(this.bb_fadeSound){
		for(var bbt_i=0;bbt_i<=31;bbt_i=bbt_i+1){
			bb_audio_SetChannelVolume(bbt_i,this.bb_ratio*((bb_framework_game.bb_soundVolume)/100.0));
		}
	}
	if(this.bb_fadeMusic){
		bb_framework_game.bbm_SetMojoMusicVolume(this.bb_ratio*((bb_framework_game.bb_musicVolume)/100.0));
	}
	if(this.bb_counter>this.bb_fadeTime){
		this.bb_active=false;
		if(this.bb_fadeOut){
			bb_framework_game.bb_currentScreen.bbm_PostFadeOut();
		}else{
			bb_framework_game.bb_currentScreen.bbm_PostFadeIn();
		}
	}
}
bb_framework_ScreenFade.prototype.bbm_Start2=function(bbt_fadeTime,bbt_fadeOut,bbt_fadeSound,bbt_fadeMusic){
	if(this.bb_active){
		return;
	}
	this.bb_active=true;
	this.bb_fadeTime=bbt_fadeTime;
	this.bb_fadeOut=bbt_fadeOut;
	this.bb_fadeMusic=bbt_fadeMusic;
	this.bb_fadeSound=bbt_fadeSound;
	if(bbt_fadeOut){
		this.bb_ratio=1.0;
	}else{
		this.bb_ratio=0.0;
		if(this.bb_fadeMusic){
			bb_framework_game.bbm_SetMojoMusicVolume(0.0);
		}
	}
	this.bb_counter=0.0;
}
function bb_framework_GameImage(){
	Object.call(this);
	this.bb_w2=.0;
	this.bb_h2=.0;
	this.bb_w=0;
	this.bb_h=0;
}
function bb_boxes_StringObject(){
	Object.call(this);
	this.bb_value="";
}
function bb_boxes_new(bbt_value){
	this.bb_value=String(bbt_value);
	return this;
}
function bb_boxes_new2(bbt_value){
	this.bb_value=String(bbt_value);
	return this;
}
function bb_boxes_new3(bbt_value){
	this.bb_value=bbt_value;
	return this;
}
function bb_boxes_new4(){
	return this;
}
function bb_map_Map(){
	Object.call(this);
	this.bb_root=null;
}
function bb_map_new(){
	return this;
}
bb_map_Map.prototype.bbm_Compare=function(bbt_lhs,bbt_rhs){
}
bb_map_Map.prototype.bbm_FindNode=function(bbt_key){
	var bbt_node=this.bb_root;
	while((bbt_node)!=null){
		var bbt_cmp=this.bbm_Compare(bbt_key,bbt_node.bb_key);
		if(bbt_cmp>0){
			bbt_node=bbt_node.bb_right;
		}else{
			if(bbt_cmp<0){
				bbt_node=bbt_node.bb_left;
			}else{
				return bbt_node;
			}
		}
	}
	return bbt_node;
}
bb_map_Map.prototype.bbm_Contains=function(bbt_key){
	return this.bbm_FindNode(bbt_key)!=null;
}
bb_map_Map.prototype.bbm_Get=function(bbt_key){
	var bbt_node=this.bbm_FindNode(bbt_key);
	if((bbt_node)!=null){
		return bbt_node.bb_value;
	}
	return null;
}
bb_map_Map.prototype.bbm_RotateLeft=function(bbt_node){
	var bbt_child=bbt_node.bb_right;
	bbt_node.bb_right=bbt_child.bb_left;
	if((bbt_child.bb_left)!=null){
		bbt_child.bb_left.bb_parent=bbt_node;
	}
	bbt_child.bb_parent=bbt_node.bb_parent;
	if((bbt_node.bb_parent)!=null){
		if(bbt_node==bbt_node.bb_parent.bb_left){
			bbt_node.bb_parent.bb_left=bbt_child;
		}else{
			bbt_node.bb_parent.bb_right=bbt_child;
		}
	}else{
		this.bb_root=bbt_child;
	}
	bbt_child.bb_left=bbt_node;
	bbt_node.bb_parent=bbt_child;
	return 0;
}
bb_map_Map.prototype.bbm_RotateRight=function(bbt_node){
	var bbt_child=bbt_node.bb_left;
	bbt_node.bb_left=bbt_child.bb_right;
	if((bbt_child.bb_right)!=null){
		bbt_child.bb_right.bb_parent=bbt_node;
	}
	bbt_child.bb_parent=bbt_node.bb_parent;
	if((bbt_node.bb_parent)!=null){
		if(bbt_node==bbt_node.bb_parent.bb_right){
			bbt_node.bb_parent.bb_right=bbt_child;
		}else{
			bbt_node.bb_parent.bb_left=bbt_child;
		}
	}else{
		this.bb_root=bbt_child;
	}
	bbt_child.bb_right=bbt_node;
	bbt_node.bb_parent=bbt_child;
	return 0;
}
bb_map_Map.prototype.bbm_InsertFixup=function(bbt_node){
	while(((bbt_node.bb_parent)!=null) && bbt_node.bb_parent.bb_color==-1 && ((bbt_node.bb_parent.bb_parent)!=null)){
		if(bbt_node.bb_parent==bbt_node.bb_parent.bb_parent.bb_left){
			var bbt_uncle=bbt_node.bb_parent.bb_parent.bb_right;
			if(((bbt_uncle)!=null) && bbt_uncle.bb_color==-1){
				bbt_node.bb_parent.bb_color=1;
				bbt_uncle.bb_color=1;
				bbt_uncle.bb_parent.bb_color=-1;
				bbt_node=bbt_uncle.bb_parent;
			}else{
				if(bbt_node==bbt_node.bb_parent.bb_right){
					bbt_node=bbt_node.bb_parent;
					this.bbm_RotateLeft(bbt_node);
				}
				bbt_node.bb_parent.bb_color=1;
				bbt_node.bb_parent.bb_parent.bb_color=-1;
				this.bbm_RotateRight(bbt_node.bb_parent.bb_parent);
			}
		}else{
			var bbt_uncle2=bbt_node.bb_parent.bb_parent.bb_left;
			if(((bbt_uncle2)!=null) && bbt_uncle2.bb_color==-1){
				bbt_node.bb_parent.bb_color=1;
				bbt_uncle2.bb_color=1;
				bbt_uncle2.bb_parent.bb_color=-1;
				bbt_node=bbt_uncle2.bb_parent;
			}else{
				if(bbt_node==bbt_node.bb_parent.bb_left){
					bbt_node=bbt_node.bb_parent;
					this.bbm_RotateRight(bbt_node);
				}
				bbt_node.bb_parent.bb_color=1;
				bbt_node.bb_parent.bb_parent.bb_color=-1;
				this.bbm_RotateLeft(bbt_node.bb_parent.bb_parent);
			}
		}
	}
	this.bb_root.bb_color=1;
	return 0;
}
bb_map_Map.prototype.bbm_Set=function(bbt_key,bbt_value){
	var bbt_node=this.bb_root;
	var bbt_parent=null;
	var bbt_cmp=0;
	while((bbt_node)!=null){
		bbt_parent=bbt_node;
		bbt_cmp=this.bbm_Compare(bbt_key,bbt_node.bb_key);
		if(bbt_cmp>0){
			bbt_node=bbt_node.bb_right;
		}else{
			if(bbt_cmp<0){
				bbt_node=bbt_node.bb_left;
			}else{
				bbt_node.bb_value=bbt_value;
				return 0;
			}
		}
	}
	bbt_node=bb_map_new3.call(new bb_map_Node,bbt_key,bbt_value,-1,bbt_parent);
	if(!((bbt_parent)!=null)){
		this.bb_root=bbt_node;
		return 0;
	}
	if(bbt_cmp>0){
		bbt_parent.bb_right=bbt_node;
	}else{
		bbt_parent.bb_left=bbt_node;
	}
	this.bbm_InsertFixup(bbt_node);
	return 0;
}
function bb_map_StringMap(){
	bb_map_Map.call(this);
}
bb_map_StringMap.prototype=extend_class(bb_map_Map);
function bb_map_new2(){
	bb_map_new.call(this);
	return this;
}
bb_map_StringMap.prototype.bbm_Compare=function(bbt_lhs,bbt_rhs){
	return string_compare(bbt_lhs.bb_value,bbt_rhs.bb_value);
}
function bb_framework_ImageBank(){
	bb_map_StringMap.call(this);
}
bb_framework_ImageBank.prototype=extend_class(bb_map_StringMap);
function bb_framework_new5(){
	bb_map_new2.call(this);
	return this;
}
function bb_framework_GameSound(){
	Object.call(this);
	this.bb_sound=null;
	this.bb_name="";
	this.bb_pan=0.0;
	this.bb_rate=1.0;
	this.bb_volume=1.0;
	this.bb_loop=0;
	this.bb_channel=0;
	this.bb_loopChannelList=bb_collections_new6.call(new bb_collections_IntArrayList);
}
function bb_framework_new6(){
	return this;
}
bb_framework_GameSound.prototype.bbm_Load=function(bbt_file){
	if((bbt_file.indexOf(".wav")!=-1) || (bbt_file.indexOf(".ogg")!=-1) || (bbt_file.indexOf(".mp3")!=-1)){
		this.bb_sound=bb_functions_LoadSoundSample(bb_framework_path+bbt_file);
	}else{
		this.bb_sound=bb_functions_LoadSoundSample(bb_framework_path+bbt_file+".wav");
	}
	this.bb_name=bb_functions_StripAll(bbt_file.toUpperCase());
}
bb_framework_GameSound.prototype.bbm_Play=function(bbt_playChannel){
	this.bb_channel=bb_framework_PlayFx(this.bb_sound,this.bb_pan,this.bb_rate,this.bb_volume*((bb_framework_game.bb_soundVolume)/100.0),this.bb_loop,bbt_playChannel);
	if(this.bb_loop==1){
		this.bb_loopChannelList.bbm_Add2(bb_boxes_new5.call(new bb_boxes_IntObject,this.bb_channel));
	}
}
function bb_framework_SoundBank(){
	bb_map_StringMap.call(this);
}
bb_framework_SoundBank.prototype=extend_class(bb_map_StringMap);
function bb_framework_new7(){
	bb_map_new2.call(this);
	return this;
}
var bb_framework_path;
bb_framework_SoundBank.prototype.bbm_Load2=function(bbt_name,bbt_nameoverride,bbt_ignoreCache){
	var bbt_storeKey=bbt_nameoverride.toUpperCase();
	if(bbt_storeKey==""){
		bbt_storeKey=bb_functions_StripAll(bbt_name.toUpperCase());
	}
	if(!bbt_ignoreCache && this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		return this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey));
	}
	if(this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey)).bb_sound.bbm_Discard();
	}
	var bbt_s=bb_framework_new6.call(new bb_framework_GameSound);
	bbt_s.bbm_Load(bbt_name);
	bbt_s.bb_name=bbt_storeKey;
	this.bbm_Set((bb_boxes_new3.call(new bb_boxes_StringObject,bbt_s.bb_name)),bbt_s);
	return bbt_s;
}
bb_framework_SoundBank.prototype.bbm_Find=function(bbt_name){
	bbt_name=bbt_name.toUpperCase();
	var bbt_i=this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_name));
	bb_assert_AssertNotNull((bbt_i),"Sound '"+bbt_name+"' not found in the SoundBank");
	return bbt_i;
}
function bb_inputcache_InputCache(){
	Object.call(this);
	this.bb_keyHitEnumerator=null;
	this.bb_keyDownEnumerator=null;
	this.bb_keyReleasedEnumerator=null;
	this.bb_keyHitWrapper=null;
	this.bb_keyDownWrapper=null;
	this.bb_keyReleasedWrapper=null;
	this.bb_touchData=new_object_array(32);
	this.bb_monitorTouch=false;
	this.bb_monitorMouse=false;
	this.bb_touchDownCount=0;
	this.bb_touchHitCount=0;
	this.bb_touchReleasedCount=0;
	this.bb_maxTouchDown=-1;
	this.bb_maxTouchHit=-1;
	this.bb_maxTouchReleased=-1;
	this.bb_minTouchDown=-1;
	this.bb_minTouchHit=-1;
	this.bb_minTouchReleased=-1;
	this.bb_touchHit=new_number_array(32);
	this.bb_touchHitTime=new_number_array(32);
	this.bb_touchDown=new_number_array(32);
	this.bb_touchDownTime=new_number_array(32);
	this.bb_touchReleasedTime=new_number_array(32);
	this.bb_touchReleased=new_number_array(32);
	this.bb_touchX=new_number_array(32);
	this.bb_touchY=new_number_array(32);
	this.bb_currentTouchDown=new_number_array(32);
	this.bb_currentTouchHit=new_number_array(32);
	this.bb_currentTouchReleased=new_number_array(32);
	this.bb_mouseDownCount=0;
	this.bb_mouseHitCount=0;
	this.bb_mouseReleasedCount=0;
	this.bb_mouseHit=new_number_array(3);
	this.bb_mouseHitTime=new_number_array(3);
	this.bb_mouseDown=new_number_array(3);
	this.bb_mouseDownTime=new_number_array(3);
	this.bb_mouseReleasedTime=new_number_array(3);
	this.bb_mouseReleased=new_number_array(3);
	this.bb_currentMouseDown=new_number_array(3);
	this.bb_currentMouseHit=new_number_array(3);
	this.bb_currentMouseReleased=new_number_array(3);
	this.bb_keyDownCount=0;
	this.bb_keyHitCount=0;
	this.bb_keyReleasedCount=0;
	this.bb_monitorKeyCount=0;
	this.bb_monitorKey=new_bool_array(512);
	this.bb_keyHit=new_number_array(512);
	this.bb_keyHitTime=new_number_array(512);
	this.bb_keyDown=new_number_array(512);
	this.bb_keyDownTime=new_number_array(512);
	this.bb_keyReleasedTime=new_number_array(512);
	this.bb_keyReleased=new_number_array(512);
	this.bb_currentKeysDown=new_number_array(512);
	this.bb_currentKeysHit=new_number_array(512);
	this.bb_currentKeysReleased=new_number_array(512);
	this.bb_flingThreshold=250.0;
	this.bb_longPressTime=1000;
}
function bb_inputcache_new(){
	this.bb_keyHitEnumerator=bb_inputcache_new4.call(new bb_inputcache_KeyEventEnumerator,this,3);
	this.bb_keyDownEnumerator=bb_inputcache_new4.call(new bb_inputcache_KeyEventEnumerator,this,1);
	this.bb_keyReleasedEnumerator=bb_inputcache_new4.call(new bb_inputcache_KeyEventEnumerator,this,2);
	this.bb_keyHitWrapper=bb_inputcache_new10.call(new bb_inputcache_EnumWrapper,this.bb_keyHitEnumerator);
	this.bb_keyDownWrapper=bb_inputcache_new10.call(new bb_inputcache_EnumWrapper,this.bb_keyDownEnumerator);
	this.bb_keyReleasedWrapper=bb_inputcache_new10.call(new bb_inputcache_EnumWrapper,this.bb_keyReleasedEnumerator);
	for(var bbt_i=0;bbt_i<this.bb_touchData.length;bbt_i=bbt_i+1){
		this.bb_touchData[bbt_i]=bb_inputcache_new12.call(new bb_inputcache_TouchData);
	}
	this.bb_monitorTouch=false;
	this.bb_monitorMouse=true;
	return this;
}
bb_inputcache_InputCache.prototype.bbm_ReadInput=function(){
	var bbt_newval=0;
	var bbt_now=bb_app_Millisecs();
	if(this.bb_monitorTouch){
		this.bb_touchDownCount=0;
		this.bb_touchHitCount=0;
		this.bb_touchReleasedCount=0;
		this.bb_maxTouchDown=-1;
		this.bb_maxTouchHit=-1;
		this.bb_maxTouchReleased=-1;
		this.bb_minTouchDown=-1;
		this.bb_minTouchHit=-1;
		this.bb_minTouchReleased=-1;
		for(var bbt_i=0;bbt_i<32;bbt_i=bbt_i+1){
			bbt_newval=bb_input_TouchHit(bbt_i);
			if(!((this.bb_touchHit[bbt_i])!=0) && ((bbt_newval)!=0)){
				this.bb_touchHitTime[bbt_i]=bbt_now;
			}
			this.bb_touchHit[bbt_i]=bbt_newval;
			bbt_newval=bb_input_TouchDown(bbt_i);
			if(((bbt_newval)!=0) && !((this.bb_touchDown[bbt_i])!=0)){
				this.bb_touchDownTime[bbt_i]=bbt_now;
			}
			if(((this.bb_touchDown[bbt_i])!=0) && !((bbt_newval)!=0)){
				this.bb_touchReleasedTime[bbt_i]=bbt_now;
				this.bb_touchReleased[bbt_i]=1;
			}else{
				this.bb_touchReleased[bbt_i]=0;
			}
			this.bb_touchDown[bbt_i]=bbt_newval;
			this.bb_touchX[bbt_i]=bb_input_TouchX(bbt_i);
			this.bb_touchY[bbt_i]=bb_input_TouchY(bbt_i);
			if((this.bb_touchDown[bbt_i])!=0){
				this.bb_currentTouchDown[this.bb_touchDownCount]=bbt_i;
				this.bb_touchDownCount+=1;
				if(this.bb_minTouchDown<0){
					this.bb_minTouchDown=bbt_i;
				}
				this.bb_maxTouchDown=bbt_i;
			}
			if((this.bb_touchHit[bbt_i])!=0){
				this.bb_currentTouchHit[this.bb_touchHitCount]=bbt_i;
				this.bb_touchHitCount+=1;
				if(this.bb_minTouchHit<0){
					this.bb_minTouchHit=bbt_i;
				}
				this.bb_maxTouchHit=bbt_i;
			}
			if((this.bb_touchReleased[bbt_i])!=0){
				this.bb_currentTouchReleased[this.bb_touchReleasedCount]=bbt_i;
				this.bb_touchReleasedCount+=1;
				if(this.bb_minTouchReleased<0){
					this.bb_minTouchReleased=bbt_i;
				}
				this.bb_maxTouchReleased=bbt_i;
			}
		}
	}
	if(this.bb_monitorMouse){
		this.bb_mouseDownCount=0;
		this.bb_mouseHitCount=0;
		this.bb_mouseReleasedCount=0;
		for(var bbt_i2=0;bbt_i2<3;bbt_i2=bbt_i2+1){
			bbt_newval=bb_input_MouseHit(bbt_i2);
			if(!((this.bb_mouseHit[bbt_i2])!=0) && ((bbt_newval)!=0)){
				this.bb_mouseHitTime[bbt_i2]=bbt_now;
			}
			this.bb_mouseHit[bbt_i2]=bbt_newval;
			bbt_newval=bb_input_MouseDown(bbt_i2);
			if(((bbt_newval)!=0) && !((this.bb_mouseDown[bbt_i2])!=0)){
				this.bb_mouseDownTime[bbt_i2]=bbt_now;
			}
			if(((this.bb_mouseDown[bbt_i2])!=0) && !((bbt_newval)!=0)){
				this.bb_mouseReleasedTime[bbt_i2]=bbt_now;
				this.bb_mouseReleased[bbt_i2]=1;
			}else{
				this.bb_mouseReleased[bbt_i2]=0;
			}
			this.bb_mouseDown[bbt_i2]=bbt_newval;
			if((this.bb_mouseDown[bbt_i2])!=0){
				this.bb_currentMouseDown[this.bb_mouseDownCount]=bbt_i2;
				this.bb_mouseDownCount+=1;
			}
			if((this.bb_mouseHit[bbt_i2])!=0){
				this.bb_currentMouseHit[this.bb_mouseHitCount]=bbt_i2;
				this.bb_mouseHitCount+=1;
			}
			if((this.bb_mouseReleased[bbt_i2])!=0){
				this.bb_currentMouseReleased[this.bb_mouseReleasedCount]=bbt_i2;
				this.bb_mouseReleasedCount+=1;
			}
		}
	}
	this.bb_keyDownCount=0;
	this.bb_keyHitCount=0;
	this.bb_keyReleasedCount=0;
	if(this.bb_monitorKeyCount>0){
		for(var bbt_i3=8;bbt_i3<=222;bbt_i3=bbt_i3+1){
			if(this.bb_monitorKey[bbt_i3]){
				bbt_newval=bb_input_KeyHit(bbt_i3);
				if(!((this.bb_keyHit[bbt_i3])!=0) && ((bbt_newval)!=0)){
					this.bb_keyHitTime[bbt_i3]=bbt_now;
				}
				this.bb_keyHit[bbt_i3]=bbt_newval;
				bbt_newval=bb_input_KeyDown(bbt_i3);
				if(((bbt_newval)!=0) && !((this.bb_keyDown[bbt_i3])!=0)){
					this.bb_keyDownTime[bbt_i3]=bbt_now;
				}
				if(((this.bb_keyDown[bbt_i3])!=0) && !((bbt_newval)!=0)){
					this.bb_keyReleasedTime[bbt_i3]=bbt_now;
					this.bb_keyReleased[bbt_i3]=1;
				}else{
					this.bb_keyReleased[bbt_i3]=0;
				}
				this.bb_keyDown[bbt_i3]=bbt_newval;
				if((this.bb_keyDown[bbt_i3])!=0){
					this.bb_currentKeysDown[this.bb_keyDownCount]=bbt_i3;
					this.bb_keyDownCount+=1;
				}
				if((this.bb_keyHit[bbt_i3])!=0){
					this.bb_currentKeysHit[this.bb_keyHitCount]=bbt_i3;
					this.bb_keyHitCount+=1;
				}
				if((this.bb_keyReleased[bbt_i3])!=0){
					this.bb_currentKeysReleased[this.bb_keyReleasedCount]=bbt_i3;
					this.bb_keyReleasedCount+=1;
				}
			}
		}
	}
}
bb_inputcache_InputCache.prototype.bbm_HandleEvents=function(bbt_screen){
	for(var bbt_i=0;bbt_i<this.bb_touchHitCount;bbt_i=bbt_i+1){
		var bbt_pointer=this.bb_currentTouchHit[bbt_i];
		var bbt_x=((this.bb_touchX[bbt_pointer])|0);
		var bbt_y=((this.bb_touchY[bbt_pointer])|0);
		this.bb_touchData[bbt_pointer].bbm_Reset(bbt_x,bbt_y);
		bbt_screen.bbm_OnTouchHit(bbt_x,bbt_y,bbt_pointer);
	}
	for(var bbt_i2=0;bbt_i2<this.bb_touchReleasedCount;bbt_i2=bbt_i2+1){
		var bbt_pointer2=this.bb_currentTouchReleased[bbt_i2];
		var bbt_x2=((this.bb_touchX[bbt_pointer2])|0);
		var bbt_y2=((this.bb_touchY[bbt_pointer2])|0);
		this.bb_touchData[bbt_pointer2].bbm_Update3(bbt_x2,bbt_y2);
		if(!this.bb_touchData[bbt_pointer2].bb_movedTooFar && !this.bb_touchData[bbt_pointer2].bb_firedLongPress){
			bbt_screen.bbm_OnTouchClick(bbt_x2,bbt_y2,bbt_pointer2);
		}else{
			if(this.bb_touchData[bbt_pointer2].bb_touchVelocityX*this.bb_touchData[bbt_pointer2].bb_touchVelocityX+this.bb_touchData[bbt_pointer2].bb_touchVelocityY*this.bb_touchData[bbt_pointer2].bb_touchVelocityY>=this.bb_flingThreshold*this.bb_flingThreshold){
				bbt_screen.bbm_OnTouchFling(bbt_x2,bbt_y2,this.bb_touchData[bbt_pointer2].bb_touchVelocityX,this.bb_touchData[bbt_pointer2].bb_touchVelocityY,this.bb_touchData[bbt_pointer2].bb_touchVelocitySpeed,bbt_pointer2);
			}
		}
		bbt_screen.bbm_OnTouchReleased(bbt_x2,bbt_y2,bbt_pointer2);
	}
	for(var bbt_i3=0;bbt_i3<this.bb_touchDownCount;bbt_i3=bbt_i3+1){
		var bbt_pointer3=this.bb_currentTouchDown[bbt_i3];
		var bbt_x3=((this.bb_touchX[bbt_pointer3])|0);
		var bbt_y3=((this.bb_touchY[bbt_pointer3])|0);
		this.bb_touchData[bbt_pointer3].bbm_Update3(bbt_x3,bbt_y3);
		bbt_screen.bbm_OnTouchDragged(bbt_x3,bbt_y3,this.bb_touchData[bbt_pointer3].bb_distanceMovedX,this.bb_touchData[bbt_pointer3].bb_distanceMovedY,bbt_pointer3);
		if(!this.bb_touchData[bbt_pointer3].bb_testedLongPress && bb_framework_dt.bb_currentticks-(this.bb_touchData[bbt_pointer3].bb_firstTouchTime)>=(this.bb_longPressTime)){
			this.bb_touchData[bbt_pointer3].bb_testedLongPress=true;
			if(!this.bb_touchData[bbt_pointer3].bb_movedTooFar){
				bbt_screen.bbm_OnTouchLongPress(bbt_x3,bbt_y3,bbt_pointer3);
				this.bb_touchData[bbt_pointer3].bb_firedLongPress=true;
			}
		}
	}
}
function bb_inputcache_InputEventEnumerator(){
	Object.call(this);
	this.bb_ic=null;
	this.bb_eventType=0;
}
function bb_inputcache_new2(bbt_ic,bbt_eventType){
	this.bb_ic=bbt_ic;
	this.bb_eventType=bbt_eventType;
	return this;
}
function bb_inputcache_new3(){
	return this;
}
function bb_inputcache_KeyEventEnumerator(){
	bb_inputcache_InputEventEnumerator.call(this);
	this.bb_event=null;
}
bb_inputcache_KeyEventEnumerator.prototype=extend_class(bb_inputcache_InputEventEnumerator);
function bb_inputcache_new4(bbt_ic,bbt_eventType){
	bb_inputcache_new2.call(this,bbt_ic,bbt_eventType);
	this.bb_event=bb_inputcache_new9.call(new bb_inputcache_KeyEvent);
	return this;
}
function bb_inputcache_new5(){
	bb_inputcache_new3.call(this);
	return this;
}
function bb_inputcache_InputEvent(){
	Object.call(this);
	this.bb_eventType=0;
}
function bb_inputcache_new6(bbt_eventType){
	this.bb_eventType=bbt_eventType;
	return this;
}
function bb_inputcache_new7(){
	return this;
}
function bb_inputcache_KeyEvent(){
	bb_inputcache_InputEvent.call(this);
}
bb_inputcache_KeyEvent.prototype=extend_class(bb_inputcache_InputEvent);
function bb_inputcache_new8(bbt_eventType){
	bb_inputcache_new6.call(this,bbt_eventType);
	return this;
}
function bb_inputcache_new9(){
	bb_inputcache_new7.call(this);
	return this;
}
function bb_inputcache_EnumWrapper(){
	Object.call(this);
	this.bb_wrappedEnum=null;
}
function bb_inputcache_new10(bbt_wrappedEnum){
	this.bb_wrappedEnum=bbt_wrappedEnum;
	return this;
}
function bb_inputcache_new11(){
	return this;
}
function bb_inputcache_TouchData(){
	Object.call(this);
	this.bb_firstTouchX=0;
	this.bb_firstTouchY=0;
	this.bb_lastTouchX=0;
	this.bb_lastTouchY=0;
	this.bb_firstTouchTime=0;
	this.bb_testedLongPress=false;
	this.bb_firedLongPress=false;
	this.bb_flingSamplesX=new_number_array(10);
	this.bb_flingSamplesY=new_number_array(10);
	this.bb_flingSamplesTime=new_number_array(10);
	this.bb_flingSampleCount=0;
	this.bb_flingSampleNext=0;
	this.bb_movedTooFar=false;
	this.bb_touchVelocityX=.0;
	this.bb_touchVelocityY=.0;
	this.bb_touchVelocitySpeed=.0;
	this.bb_distanceMovedX=0;
	this.bb_distanceMovedY=0;
}
function bb_inputcache_new12(){
	return this;
}
bb_inputcache_TouchData.prototype.bbm_AddFlingSample=function(bbt_x,bbt_y){
	this.bb_flingSamplesX[this.bb_flingSampleNext]=bbt_x;
	this.bb_flingSamplesY[this.bb_flingSampleNext]=bbt_y;
	this.bb_flingSamplesTime[this.bb_flingSampleNext]=((bb_framework_dt.bb_currentticks)|0);
	if(this.bb_flingSampleCount<10){
		this.bb_flingSampleCount+=1;
	}
	this.bb_flingSampleNext+=1;
	if(this.bb_flingSampleNext>=10){
		this.bb_flingSampleNext=0;
	}
	var bbt_first=this.bb_flingSampleNext-this.bb_flingSampleCount;
	var bbt_last=this.bb_flingSampleNext-1;
	while(bbt_first<0){
		bbt_first+=10;
	}
	while(bbt_last<0){
		bbt_last+=10;
	}
	if(this.bb_flingSampleCount>0){
		var bbt_secs=(this.bb_flingSamplesTime[bbt_last]-this.bb_flingSamplesTime[bbt_first])/1000.0;
		this.bb_touchVelocityX=(this.bb_flingSamplesX[bbt_last]-this.bb_flingSamplesX[bbt_first])/bbt_secs;
		this.bb_touchVelocityY=(this.bb_flingSamplesY[bbt_last]-this.bb_flingSamplesY[bbt_first])/bbt_secs;
		this.bb_touchVelocitySpeed=Math.sqrt(this.bb_touchVelocityX*this.bb_touchVelocityX+this.bb_touchVelocityY*this.bb_touchVelocityY);
	}
}
bb_inputcache_TouchData.prototype.bbm_Reset=function(bbt_x,bbt_y){
	this.bb_firstTouchX=bbt_x;
	this.bb_firstTouchY=bbt_y;
	this.bb_lastTouchX=bbt_x;
	this.bb_lastTouchY=bbt_y;
	this.bb_firstTouchTime=((bb_framework_dt.bb_currentticks)|0);
	this.bb_testedLongPress=false;
	this.bb_firedLongPress=false;
	for(var bbt_i=0;bbt_i<10;bbt_i=bbt_i+1){
		this.bb_flingSamplesX[bbt_i]=0;
		this.bb_flingSamplesY[bbt_i]=0;
		this.bb_flingSamplesTime[bbt_i]=0;
	}
	this.bb_flingSampleCount=0;
	this.bb_flingSampleNext=0;
	this.bb_movedTooFar=false;
	this.bb_touchVelocityX=0.0;
	this.bb_touchVelocityY=0.0;
	this.bb_touchVelocitySpeed=0.0;
	this.bbm_AddFlingSample(bbt_x,bbt_y);
}
bb_inputcache_TouchData.prototype.bbm_Update3=function(bbt_x,bbt_y){
	this.bb_distanceMovedX=bbt_x-this.bb_lastTouchX;
	this.bb_distanceMovedY=bbt_y-this.bb_lastTouchY;
	this.bb_lastTouchX=bbt_x;
	this.bb_lastTouchY=bbt_y;
	this.bbm_AddFlingSample(bbt_x,bbt_y);
	if(!this.bb_movedTooFar){
		var bbt_dx=bbt_x-this.bb_firstTouchX;
		var bbt_dy=bbt_y-this.bb_firstTouchY;
		if((bbt_dx*bbt_dx+bbt_dy*bbt_dy)>400.0){
			this.bb_movedTooFar=true;
		}
	}
}
var bb_framework_game;
function bbMain(){
	bb_framework_game=(bb_main_new.call(new bb_main_Game));
	return 0;
}
function bb_graphics_Image(){
	Object.call(this);
	this.bb_surface=null;
	this.bb_width=0;
	this.bb_height=0;
	this.bb_frames=[];
	this.bb_flags=0;
	this.bb_tx=.0;
	this.bb_ty=.0;
	this.bb_source=null;
}
var bb_graphics_DefaultFlags;
function bb_graphics_new3(){
	return this;
}
bb_graphics_Image.prototype.bbm_SetHandle=function(bbt_tx,bbt_ty){
	this.bb_tx=bbt_tx;
	this.bb_ty=bbt_ty;
	this.bb_flags=this.bb_flags&-2;
	return 0;
}
bb_graphics_Image.prototype.bbm_ApplyFlags=function(bbt_iflags){
	this.bb_flags=bbt_iflags;
	if((this.bb_flags&2)!=0){
		var bbt_=this.bb_frames;
		var bbt_2=0;
		while(bbt_2<bbt_.length){
			var bbt_f=bbt_[bbt_2];
			bbt_2=bbt_2+1;
			bbt_f.bb_x+=1;
		}
		this.bb_width-=2;
	}
	if((this.bb_flags&4)!=0){
		var bbt_3=this.bb_frames;
		var bbt_4=0;
		while(bbt_4<bbt_3.length){
			var bbt_f2=bbt_3[bbt_4];
			bbt_4=bbt_4+1;
			bbt_f2.bb_y+=1;
		}
		this.bb_height-=2;
	}
	if((this.bb_flags&1)!=0){
		this.bbm_SetHandle((this.bb_width)/2.0,(this.bb_height)/2.0);
	}
	if(this.bb_frames.length==1 && this.bb_frames[0].bb_x==0 && this.bb_frames[0].bb_y==0 && this.bb_width==this.bb_surface.Width() && this.bb_height==this.bb_surface.Height()){
		this.bb_flags|=65536;
	}
	return 0;
}
bb_graphics_Image.prototype.bbm_Load3=function(bbt_path,bbt_nframes,bbt_iflags){
	this.bb_surface=bb_graphics_context.bb_device.LoadSurface(bbt_path);
	if(!((this.bb_surface)!=null)){
		return null;
	}
	this.bb_width=((this.bb_surface.Width()/bbt_nframes)|0);
	this.bb_height=this.bb_surface.Height();
	this.bb_frames=new_object_array(bbt_nframes);
	for(var bbt_i=0;bbt_i<bbt_nframes;bbt_i=bbt_i+1){
		this.bb_frames[bbt_i]=bb_graphics_new4.call(new bb_graphics_Frame,bbt_i*this.bb_width,0);
	}
	this.bbm_ApplyFlags(bbt_iflags);
	return this;
}
bb_graphics_Image.prototype.bbm_Grab=function(bbt_x,bbt_y,bbt_iwidth,bbt_iheight,bbt_nframes,bbt_iflags,bbt_source){
	this.bb_source=bbt_source;
	this.bb_surface=bbt_source.bb_surface;
	this.bb_width=bbt_iwidth;
	this.bb_height=bbt_iheight;
	this.bb_frames=new_object_array(bbt_nframes);
	var bbt_ix=bbt_x+bbt_source.bb_frames[0].bb_x;
	var bbt_iy=bbt_y+bbt_source.bb_frames[0].bb_y;
	for(var bbt_i=0;bbt_i<bbt_nframes;bbt_i=bbt_i+1){
		if(bbt_ix+this.bb_width>bbt_source.bb_width){
			bbt_ix=bbt_source.bb_frames[0].bb_x;
			bbt_iy+=this.bb_height;
		}
		if(bbt_ix+this.bb_width>bbt_source.bb_width || bbt_iy+this.bb_height>bbt_source.bb_height){
			error("Image frame outside surface");
		}
		this.bb_frames[bbt_i]=bb_graphics_new4.call(new bb_graphics_Frame,bbt_ix,bbt_iy);
		bbt_ix+=this.bb_width;
	}
	this.bbm_ApplyFlags(bbt_iflags);
	return this;
}
bb_graphics_Image.prototype.bbm_GrabImage=function(bbt_x,bbt_y,bbt_width,bbt_height,bbt_frames,bbt_flags){
	if(this.bb_frames.length!=1){
		return null;
	}
	return (bb_graphics_new3.call(new bb_graphics_Image)).bbm_Grab(bbt_x,bbt_y,bbt_width,bbt_height,bbt_frames,bbt_flags,this);
}
bb_graphics_Image.prototype.bbm_Width=function(){
	return this.bb_width;
}
bb_graphics_Image.prototype.bbm_Height=function(){
	return this.bb_height;
}
bb_graphics_Image.prototype.bbm_Frames=function(){
	return this.bb_frames.length;
}
function bb_graphics_Frame(){
	Object.call(this);
	this.bb_x=0;
	this.bb_y=0;
}
function bb_graphics_new4(bbt_x,bbt_y){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	return this;
}
function bb_graphics_new5(){
	return this;
}
function bb_graphics_LoadImage(bbt_path,bbt_frameCount,bbt_flags){
	return (bb_graphics_new3.call(new bb_graphics_Image)).bbm_Load3(bbt_path,bbt_frameCount,bbt_flags);
}
function bb_graphics_LoadImage2(bbt_path,bbt_frameWidth,bbt_frameHeight,bbt_frameCount,bbt_flags){
	var bbt_atlas=(bb_graphics_new3.call(new bb_graphics_Image)).bbm_Load3(bbt_path,1,0);
	if((bbt_atlas)!=null){
		return bbt_atlas.bbm_GrabImage(0,0,bbt_frameWidth,bbt_frameHeight,bbt_frameCount,bbt_flags);
	}
	return null;
}
function bb_graphics_SetFont(bbt_font,bbt_firstChar){
	if(!((bbt_font)!=null)){
		if(!((bb_graphics_context.bb_defaultFont)!=null)){
			bb_graphics_context.bb_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		bbt_font=bb_graphics_context.bb_defaultFont;
		bbt_firstChar=32;
	}
	bb_graphics_context.bb_font=bbt_font;
	bb_graphics_context.bb_firstChar=bbt_firstChar;
	return 0;
}
var bb_graphics_renderDevice;
function bb_graphics_SetMatrix(bbt_ix,bbt_iy,bbt_jx,bbt_jy,bbt_tx,bbt_ty){
	bb_graphics_context.bb_ix=bbt_ix;
	bb_graphics_context.bb_iy=bbt_iy;
	bb_graphics_context.bb_jx=bbt_jx;
	bb_graphics_context.bb_jy=bbt_jy;
	bb_graphics_context.bb_tx=bbt_tx;
	bb_graphics_context.bb_ty=bbt_ty;
	bb_graphics_context.bb_tformed=((bbt_ix!=1.0 || bbt_iy!=0.0 || bbt_jx!=0.0 || bbt_jy!=1.0 || bbt_tx!=0.0 || bbt_ty!=0.0)?1:0);
	bb_graphics_context.bb_matDirty=1;
	return 0;
}
function bb_graphics_SetMatrix2(bbt_m){
	bb_graphics_SetMatrix(bbt_m[0],bbt_m[1],bbt_m[2],bbt_m[3],bbt_m[4],bbt_m[5]);
	return 0;
}
function bb_graphics_SetColor(bbt_r,bbt_g,bbt_b){
	bb_graphics_context.bb_color_r=bbt_r;
	bb_graphics_context.bb_color_g=bbt_g;
	bb_graphics_context.bb_color_b=bbt_b;
	bb_graphics_context.bb_device.SetColor(bbt_r,bbt_g,bbt_b);
	return 0;
}
function bb_graphics_SetAlpha(bbt_alpha){
	bb_graphics_context.bb_alpha=bbt_alpha;
	bb_graphics_context.bb_device.SetAlpha(bbt_alpha);
	return 0;
}
function bb_graphics_SetBlend(bbt_blend){
	bb_graphics_context.bb_blend=bbt_blend;
	bb_graphics_context.bb_device.SetBlend(bbt_blend);
	return 0;
}
function bb_graphics_DeviceWidth(){
	return bb_graphics_context.bb_device.Width();
}
function bb_graphics_DeviceHeight(){
	return bb_graphics_context.bb_device.Height();
}
function bb_graphics_SetScissor(bbt_x,bbt_y,bbt_width,bbt_height){
	bb_graphics_context.bb_scissor_x=bbt_x;
	bb_graphics_context.bb_scissor_y=bbt_y;
	bb_graphics_context.bb_scissor_width=bbt_width;
	bb_graphics_context.bb_scissor_height=bbt_height;
	bb_graphics_context.bb_device.SetScissor(((bbt_x)|0),((bbt_y)|0),((bbt_width)|0),((bbt_height)|0));
	return 0;
}
function bb_graphics_BeginRender(){
	bb_graphics_renderDevice=bb_graphics_context.bb_device;
	bb_graphics_context.bb_matrixSp=0;
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetBlend(0);
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	return 0;
}
function bb_graphics_EndRender(){
	bb_graphics_renderDevice=null;
	return 0;
}
var bb_framework_DEVICE_WIDTH;
var bb_framework_DEVICE_HEIGHT;
var bb_framework_SCREEN_WIDTH;
var bb_framework_SCREEN_HEIGHT;
var bb_framework_SCREEN_WIDTH2;
var bb_framework_SCREEN_HEIGHT2;
var bb_framework_SCREENX_RATIO;
var bb_framework_SCREENY_RATIO;
function bb_input_MouseX(){
	return bb_input_device.MouseX();
}
function bb_input_MouseY(){
	return bb_input_device.MouseY();
}
var bb_random_Seed;
function bb_framework_DeltaTimer(){
	Object.call(this);
	this.bb_targetfps=60.0;
	this.bb_lastticks=.0;
	this.bb_delta=.0;
	this.bb_frametime=.0;
	this.bb_currentticks=.0;
}
function bb_framework_new8(bbt_fps){
	this.bb_targetfps=bbt_fps;
	this.bb_lastticks=(bb_app_Millisecs());
	return this;
}
function bb_framework_new9(){
	return this;
}
bb_framework_DeltaTimer.prototype.bbm_UpdateDelta=function(){
	this.bb_currentticks=(bb_app_Millisecs());
	this.bb_frametime=this.bb_currentticks-this.bb_lastticks;
	this.bb_delta=this.bb_frametime/(1000.0/this.bb_targetfps);
	this.bb_lastticks=this.bb_currentticks;
}
function bb_app_Millisecs(){
	return bb_app_device.MilliSecs();
}
var bb_framework_dt;
function bb_app_SetUpdateRate(bbt_hertz){
	return bb_app_device.SetUpdateRate(bbt_hertz);
}
function bb_framework_Sprite(){
	Object.call(this);
	this.bb_image=null;
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_alpha=1.0;
	this.bb_hitBoxX=0;
	this.bb_hitBoxY=0;
	this.bb_hitBoxWidth=0;
	this.bb_hitBoxHeight=0;
	this.bb_visible=false;
}
bb_framework_Sprite.prototype.bbm_SetHitBox=function(bbt_hitX,bbt_hitY,bbt_hitWidth,bbt_hitHeight){
	this.bb_hitBoxX=bbt_hitX;
	this.bb_hitBoxY=bbt_hitY;
	this.bb_hitBoxWidth=bbt_hitWidth;
	this.bb_hitBoxHeight=bbt_hitHeight;
}
function bb_framework_new10(bbt_img,bbt_x,bbt_y){
	this.bb_image=bbt_img;
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_alpha=1.0;
	this.bbm_SetHitBox(((-bbt_img.bb_w2)|0),((-bbt_img.bb_h2)|0),bbt_img.bb_w,bbt_img.bb_h);
	this.bb_visible=true;
	return this;
}
function bb_framework_new11(){
	return this;
}
function bb_framework_Particle(){
	bb_framework_Sprite.call(this);
}
bb_framework_Particle.prototype=extend_class(bb_framework_Sprite);
var bb_framework_MAX_PARTICLES;
function bb_framework_new12(){
	bb_framework_new11.call(this);
	return this;
}
var bb_framework_particles;
function bb_framework_Cache(){
	for(var bbt_i=0;bbt_i<=bb_framework_MAX_PARTICLES-1;bbt_i=bbt_i+1){
		bb_framework_particles[bbt_i]=bb_framework_new12.call(new bb_framework_Particle);
	}
}
function bb_framework_FPSCounter(){
	Object.call(this);
}
var bb_framework_startTime;
var bb_framework_fpsCount;
var bb_framework_totalFPS;
function bb_framework_Update(){
	if(bb_app_Millisecs()-bb_framework_startTime>=1000){
		bb_framework_totalFPS=bb_framework_fpsCount;
		bb_framework_fpsCount=0;
		bb_framework_startTime=bb_app_Millisecs();
	}else{
		bb_framework_fpsCount+=1;
	}
}
function bb_framework_Draw(bbt_x,bbt_y,bbt_ax,bbt_ay){
	bb_graphics_DrawText("FPS: "+String(bb_framework_totalFPS),(bbt_x),(bbt_y),bbt_ax,bbt_ay);
}
function bb_graphics_PushMatrix(){
	var bbt_sp=bb_graphics_context.bb_matrixSp;
	bb_graphics_context.bb_matrixStack[bbt_sp+0]=bb_graphics_context.bb_ix;
	bb_graphics_context.bb_matrixStack[bbt_sp+1]=bb_graphics_context.bb_iy;
	bb_graphics_context.bb_matrixStack[bbt_sp+2]=bb_graphics_context.bb_jx;
	bb_graphics_context.bb_matrixStack[bbt_sp+3]=bb_graphics_context.bb_jy;
	bb_graphics_context.bb_matrixStack[bbt_sp+4]=bb_graphics_context.bb_tx;
	bb_graphics_context.bb_matrixStack[bbt_sp+5]=bb_graphics_context.bb_ty;
	bb_graphics_context.bb_matrixSp=bbt_sp+6;
	return 0;
}
function bb_graphics_Transform(bbt_ix,bbt_iy,bbt_jx,bbt_jy,bbt_tx,bbt_ty){
	var bbt_ix2=bbt_ix*bb_graphics_context.bb_ix+bbt_iy*bb_graphics_context.bb_jx;
	var bbt_iy2=bbt_ix*bb_graphics_context.bb_iy+bbt_iy*bb_graphics_context.bb_jy;
	var bbt_jx2=bbt_jx*bb_graphics_context.bb_ix+bbt_jy*bb_graphics_context.bb_jx;
	var bbt_jy2=bbt_jx*bb_graphics_context.bb_iy+bbt_jy*bb_graphics_context.bb_jy;
	var bbt_tx2=bbt_tx*bb_graphics_context.bb_ix+bbt_ty*bb_graphics_context.bb_jx+bb_graphics_context.bb_tx;
	var bbt_ty2=bbt_tx*bb_graphics_context.bb_iy+bbt_ty*bb_graphics_context.bb_jy+bb_graphics_context.bb_ty;
	bb_graphics_SetMatrix(bbt_ix2,bbt_iy2,bbt_jx2,bbt_jy2,bbt_tx2,bbt_ty2);
	return 0;
}
function bb_graphics_Transform2(bbt_coords){
	var bbt_out=new_number_array(bbt_coords.length);
	for(var bbt_i=0;bbt_i<bbt_coords.length-1;bbt_i=bbt_i+2){
		var bbt_x=bbt_coords[bbt_i];
		var bbt_y=bbt_coords[bbt_i+1];
		bbt_out[bbt_i]=bbt_x*bb_graphics_context.bb_ix+bbt_y*bb_graphics_context.bb_jx+bb_graphics_context.bb_tx;
		bbt_out[bbt_i+1]=bbt_x*bb_graphics_context.bb_iy+bbt_y*bb_graphics_context.bb_jy+bb_graphics_context.bb_ty;
	}
	return bbt_out;
}
function bb_graphics_Scale(bbt_x,bbt_y){
	bb_graphics_Transform(bbt_x,0.0,0.0,bbt_y,0.0,0.0);
	return 0;
}
function bb_graphics_PopMatrix(){
	var bbt_sp=bb_graphics_context.bb_matrixSp-6;
	bb_graphics_SetMatrix(bb_graphics_context.bb_matrixStack[bbt_sp+0],bb_graphics_context.bb_matrixStack[bbt_sp+1],bb_graphics_context.bb_matrixStack[bbt_sp+2],bb_graphics_context.bb_matrixStack[bbt_sp+3],bb_graphics_context.bb_matrixStack[bbt_sp+4],bb_graphics_context.bb_matrixStack[bbt_sp+5]);
	bb_graphics_context.bb_matrixSp=bbt_sp;
	return 0;
}
function bb_graphics_ValidateMatrix(){
	if((bb_graphics_context.bb_matDirty)!=0){
		bb_graphics_context.bb_device.SetMatrix(bb_graphics_context.bb_ix,bb_graphics_context.bb_iy,bb_graphics_context.bb_jx,bb_graphics_context.bb_jy,bb_graphics_context.bb_tx,bb_graphics_context.bb_ty);
		bb_graphics_context.bb_matDirty=0;
	}
	return 0;
}
function bb_graphics_DrawRect(bbt_x,bbt_y,bbt_w,bbt_h){
	bb_graphics_ValidateMatrix();
	bb_graphics_renderDevice.DrawRect(bbt_x,bbt_y,bbt_w,bbt_h);
	return 0;
}
function bb_graphics_Translate(bbt_x,bbt_y){
	bb_graphics_Transform(1.0,0.0,0.0,1.0,bbt_x,bbt_y);
	return 0;
}
function bb_graphics_DrawImage(bbt_image,bbt_x,bbt_y,bbt_frame){
	var bbt_f=bbt_image.bb_frames[bbt_frame];
	if((bb_graphics_context.bb_tformed)!=0){
		bb_graphics_PushMatrix();
		bb_graphics_Translate(bbt_x-bbt_image.bb_tx,bbt_y-bbt_image.bb_ty);
		bb_graphics_ValidateMatrix();
		if((bbt_image.bb_flags&65536)!=0){
			bb_graphics_context.bb_device.DrawSurface(bbt_image.bb_surface,0.0,0.0);
		}else{
			bb_graphics_context.bb_device.DrawSurface2(bbt_image.bb_surface,0.0,0.0,bbt_f.bb_x,bbt_f.bb_y,bbt_image.bb_width,bbt_image.bb_height);
		}
		bb_graphics_PopMatrix();
	}else{
		bb_graphics_ValidateMatrix();
		if((bbt_image.bb_flags&65536)!=0){
			bb_graphics_context.bb_device.DrawSurface(bbt_image.bb_surface,bbt_x-bbt_image.bb_tx,bbt_y-bbt_image.bb_ty);
		}else{
			bb_graphics_context.bb_device.DrawSurface2(bbt_image.bb_surface,bbt_x-bbt_image.bb_tx,bbt_y-bbt_image.bb_ty,bbt_f.bb_x,bbt_f.bb_y,bbt_image.bb_width,bbt_image.bb_height);
		}
	}
	return 0;
}
function bb_graphics_Rotate(bbt_angle){
	bb_graphics_Transform(Math.cos((bbt_angle)*D2R),-Math.sin((bbt_angle)*D2R),Math.sin((bbt_angle)*D2R),Math.cos((bbt_angle)*D2R),0.0,0.0);
	return 0;
}
function bb_graphics_DrawImage2(bbt_image,bbt_x,bbt_y,bbt_rotation,bbt_scaleX,bbt_scaleY,bbt_frame){
	var bbt_f=bbt_image.bb_frames[bbt_frame];
	bb_graphics_PushMatrix();
	bb_graphics_Translate(bbt_x,bbt_y);
	bb_graphics_Rotate(bbt_rotation);
	bb_graphics_Scale(bbt_scaleX,bbt_scaleY);
	bb_graphics_Translate(-bbt_image.bb_tx,-bbt_image.bb_ty);
	bb_graphics_ValidateMatrix();
	if((bbt_image.bb_flags&65536)!=0){
		bb_graphics_context.bb_device.DrawSurface(bbt_image.bb_surface,0.0,0.0);
	}else{
		bb_graphics_context.bb_device.DrawSurface2(bbt_image.bb_surface,0.0,0.0,bbt_f.bb_x,bbt_f.bb_y,bbt_image.bb_width,bbt_image.bb_height);
	}
	bb_graphics_PopMatrix();
	return 0;
}
function bb_graphics_DrawText(bbt_text,bbt_x,bbt_y,bbt_xalign,bbt_yalign){
	if(!((bb_graphics_context.bb_font)!=null)){
		return 0;
	}
	var bbt_w=bb_graphics_context.bb_font.bbm_Width();
	var bbt_h=bb_graphics_context.bb_font.bbm_Height();
	bbt_x-=(bbt_w*bbt_text.length)*bbt_xalign;
	bbt_y-=(bbt_h)*bbt_yalign;
	for(var bbt_i=0;bbt_i<bbt_text.length;bbt_i=bbt_i+1){
		var bbt_ch=bbt_text.charCodeAt(bbt_i)-bb_graphics_context.bb_firstChar;
		if(bbt_ch>=0 && bbt_ch<bb_graphics_context.bb_font.bbm_Frames()){
			bb_graphics_DrawImage(bb_graphics_context.bb_font,bbt_x+(bbt_i*bbt_w),bbt_y,bbt_ch);
		}
	}
	return 0;
}
function bb_assert_AssertError(bbt_msg){
	print(bbt_msg);
	error(bbt_msg);
}
function bb_assert_Assert(bbt_val,bbt_msg){
	if(!bbt_val){
		bb_assert_AssertError(bbt_msg);
	}
}
function bb_functions_RSet(bbt_str,bbt_n,bbt_char){
	var bbt_rep="";
	for(var bbt_i=1;bbt_i<=bbt_n;bbt_i=bbt_i+1){
		bbt_rep=bbt_rep+bbt_char;
	}
	bbt_str=bbt_rep+bbt_str;
	return bbt_str.slice(bbt_str.length-bbt_n);
}
function bb_functions_FormatNumber(bbt_number,bbt_decimal,bbt_comma,bbt_padleft){
	bb_assert_Assert(bbt_decimal>-1 && bbt_comma>-1 && bbt_padleft>-1,"Negative numbers not allowed in FormatNumber()");
	var bbt_str=String(bbt_number);
	var bbt_dl=bbt_str.indexOf(".",0);
	if(bbt_decimal==0){
		bbt_decimal=-1;
	}
	bbt_str=bbt_str.slice(0,bbt_dl+bbt_decimal+1);
	if((bbt_comma)!=0){
		while(bbt_dl>bbt_comma){
			bbt_str=bbt_str.slice(0,bbt_dl-bbt_comma)+","+bbt_str.slice(bbt_dl-bbt_comma);
			bbt_dl-=bbt_comma;
		}
	}
	if((bbt_padleft)!=0){
		var bbt_paddedLength=bbt_padleft+bbt_decimal+1;
		if(bbt_paddedLength<bbt_str.length){
			bbt_str="Error";
		}
		bbt_str=bb_functions_RSet(bbt_str,bbt_paddedLength," ");
	}
	return bbt_str;
}
function bb_audio_MusicState(){
	return bb_audio_device.MusicState();
}
function bb_framework_SoundPlayer(){
	Object.call(this);
}
var bb_framework_channel;
var bb_framework_playerChannelState;
function bb_framework_PlayFx(bbt_s,bbt_pan,bbt_rate,bbt_volume,bbt_loop,bbt_playChannel){
	if(bbt_playChannel==-1){
		var bbt_cnt=0;
		bb_framework_channel+=1;
		if(bb_framework_channel>31){
			bb_framework_channel=0;
		}
		while(bb_framework_playerChannelState[bb_framework_channel]==1){
			bb_framework_channel+=1;
			if(bb_framework_channel>31){
				bb_framework_channel=0;
			}
			bbt_cnt=1;
			if(bbt_cnt>62){
				break;
			}
		}
	}else{
		bb_framework_channel=bbt_playChannel;
		bb_framework_playerChannelState[bbt_playChannel]=0;
	}
	bb_audio_StopChannel(bb_framework_channel);
	bb_audio_PlaySound(bbt_s,bb_framework_channel,bbt_loop);
	bb_audio_SetChannelPan(bb_framework_channel,bbt_pan);
	bb_audio_SetChannelRate(bb_framework_channel,bbt_rate);
	bb_audio_SetChannelVolume(bb_framework_channel,bbt_volume);
	if((bbt_loop)!=0){
		bb_framework_playerChannelState[bb_framework_channel]=1;
	}
	return bb_framework_channel;
}
function bb_input_TouchHit(bbt_index){
	return bb_input_device.KeyHit(384+bbt_index);
}
function bb_input_TouchDown(bbt_index){
	return bb_input_device.KeyDown(384+bbt_index);
}
function bb_input_TouchX(bbt_index){
	return bb_input_device.TouchX(bbt_index);
}
function bb_input_TouchY(bbt_index){
	return bb_input_device.TouchY(bbt_index);
}
function bb_input_MouseHit(bbt_button){
	return bb_input_device.KeyHit(1+bbt_button);
}
function bb_input_MouseDown(bbt_button){
	return bb_input_device.KeyDown(1+bbt_button);
}
function bb_input_KeyHit(bbt_key){
	return bb_input_device.KeyHit(bbt_key);
}
function bb_input_KeyDown(bbt_key){
	return bb_input_device.KeyDown(bbt_key);
}
function bb_audio_SetMusicVolume(bbt_volume){
	bb_audio_device.SetMusicVolume(bbt_volume);
	return 0;
}
function bb_audio_SetChannelVolume(bbt_channel,bbt_volume){
	bb_audio_device.SetVolume(bbt_channel,bbt_volume);
	return 0;
}
function bb_virtual_VirtualResolutionManager(){
	Object.call(this);
	this.bb_parent=null;
	this.bb_optimalResolution=null;
	this.bb_currentResolution=null;
	this.bb_mode=0;
}
function bb_virtual_new(bbt_parent,bbt_optimalResolution,bbt_currentResolution,bbt_mode){
	this.bb_parent=bbt_parent;
	this.bb_optimalResolution=bbt_optimalResolution;
	this.bb_currentResolution=bbt_currentResolution;
	this.bb_mode=bbt_mode;
	return this;
}
function bb_virtual_new2(){
	return this;
}
bb_virtual_VirtualResolutionManager.prototype.bbm_TargetScreenSize=function(bbt_mode,bbt_width,bbt_height){
	var bbt_dwidth=this.bb_currentResolution.bb_x;
	var bbt_dheight=this.bb_currentResolution.bb_y;
	var bbt_dratio=bbt_dwidth/bbt_dheight;
	var bbt_ratio=bbt_width/bbt_height;
	bb_essentials_DebugPrint("Perfect resolution: "+String(bbt_width)+"x"+String(bbt_height));
	bb_essentials_DebugPrint("Perfect ratio: "+String(bbt_ratio));
	bb_essentials_DebugPrint("Device resolution: "+String(bbt_dwidth)+"x"+String(bbt_dheight));
	bb_essentials_DebugPrint("Device ratio: "+String(bbt_dratio));
	var bbt_resultResolution=null;
	if(bbt_dratio==bbt_ratio){
		bb_essentials_DebugPrint("Target ratio is correct..");
		bbt_resultResolution=bb_essentials_new.call(new bb_essentials_Vector2,bbt_width,bbt_height);
	}else{
		if(bbt_mode==0 && bbt_dratio<bbt_ratio || bbt_mode==1 && bbt_dratio>bbt_ratio){
			bb_essentials_DebugPrint("Target ratio is higher (tall)..");
			bbt_resultResolution=bb_essentials_new.call(new bb_essentials_Vector2,bbt_width,bbt_dheight*(bbt_width/bbt_dwidth));
		}else{
			if(bbt_mode!=2){
				bb_essentials_DebugPrint("Target ratio is lower (wide)..");
				bbt_resultResolution=bb_essentials_new.call(new bb_essentials_Vector2,bbt_dwidth*(bbt_height/bbt_dheight),bbt_height);
			}
		}
	}
	return bbt_resultResolution;
}
bb_virtual_VirtualResolutionManager.prototype.bbm_AdjustScreenSize=function(bbt_mode,bbt_width,bbt_height){
	var bbt_resultResolution=null;
	if(bbt_mode!=2){
		bbt_resultResolution=this.bbm_TargetScreenSize(bbt_mode,bbt_width,bbt_height);
	}else{
		var bbt_maximalResolution=this.bbm_TargetScreenSize(0,bbt_width,bbt_height);
		var bbt_minimalResolution=this.bbm_TargetScreenSize(1,bbt_width,bbt_height);
		bbt_maximalResolution.bbm_divide(bbt_minimalResolution,2);
		bbt_resultResolution=bbt_maximalResolution;
	}
	this.bb_parent.bbm_SetScreenSize(bbt_resultResolution.bb_x,bbt_resultResolution.bb_y);
	bb_essentials_DebugPrint("New virtual resolution: "+String(bb_framework_SCREEN_WIDTH)+"x"+String(bb_framework_SCREEN_HEIGHT));
}
function bb_essentials_Vector2(){
	Object.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
}
function bb_essentials_new(bbt_x,bbt_y){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	return this;
}
function bb_essentials_new2(){
	return this;
}
bb_essentials_Vector2.prototype.bbm_divide=function(bbt_dividend,bbt_divisor){
	this.bb_x-=(this.bb_x-bbt_dividend.bb_x)/(bbt_divisor);
	this.bb_y-=(this.bb_y-bbt_dividend.bb_y)/(bbt_divisor);
}
function bb_essentials_DebugPrint(bbt_message){
}
function bb_xml_XMLParser(){
	Object.call(this);
}
function bb_xml_new(){
	return this;
}
var bb_sound_sfxRepo;
function bb_functions_StripExt(bbt_path){
	var bbt_i=bbt_path.lastIndexOf(".");
	if(bbt_i!=-1 && bbt_path.indexOf("/",bbt_i+1)==-1){
		return bbt_path.slice(0,bbt_i);
	}
	return bbt_path;
}
function bb_functions_StripDir(bbt_path){
	var bbt_i=bbt_path.lastIndexOf("/");
	if(bbt_i!=-1){
		return bbt_path.slice(bbt_i+1);
	}
	return bbt_path;
}
function bb_functions_StripAll(bbt_path){
	return bb_functions_StripDir(bb_functions_StripExt(bbt_path));
}
function bb_map_Node(){
	Object.call(this);
	this.bb_key=null;
	this.bb_right=null;
	this.bb_left=null;
	this.bb_value=null;
	this.bb_color=0;
	this.bb_parent=null;
}
function bb_map_new3(bbt_key,bbt_value,bbt_color,bbt_parent){
	this.bb_key=bbt_key;
	this.bb_value=bbt_value;
	this.bb_color=bbt_color;
	this.bb_parent=bbt_parent;
	return this;
}
function bb_map_new4(){
	return this;
}
function bb_audio_Sound(){
	Object.call(this);
	this.bb_sample=null;
}
bb_audio_Sound.prototype.bbm_Discard=function(){
	if((this.bb_sample)!=null){
		this.bb_sample.Discard();
		this.bb_sample=null;
	}
	return 0;
}
function bb_audio_new(bbt_sample){
	this.bb_sample=bbt_sample;
	return this;
}
function bb_audio_new2(){
	return this;
}
function bb_audio_LoadSound(bbt_path){
	var bbt_sample=bb_audio_device.LoadSample(bbt_path);
	if((bbt_sample)!=null){
		return bb_audio_new.call(new bb_audio_Sound,bbt_sample);
	}
	return null;
}
function bb_assert_AssertNotNull(bbt_val,bbt_msg){
	if(bbt_val==null){
		bb_assert_AssertError(bbt_msg);
	}
}
function bb_functions_LoadSoundSample(bbt_path){
	var bbt_pointer=bb_audio_LoadSound(bbt_path);
	bb_assert_AssertNotNull((bbt_pointer),"Error loading sound "+bbt_path);
	return bbt_pointer;
}
function bb_splashscreen_SplashScreen(){
	bb_framework_Screen.call(this);
	this.bb_logo=null;
	this.bb_subLogo=null;
	this.bb_timer=null;
}
bb_splashscreen_SplashScreen.prototype=extend_class(bb_framework_Screen);
function bb_splashscreen_new(){
	bb_framework_new2.call(this);
	this.bb_name="Splash";
	return this;
}
bb_splashscreen_SplashScreen.prototype.bbm_Start=function(){
	bb_framework_game.bb_screenFade.bbm_Start2(50.0,false,false,false);
	bb_main_pm=bb_units_new.call(new bb_units_ParticleManager);
	bb_main_zom=bb_units_new2.call(new bb_units_ZObjectManager);
	this.bb_logo=bb_text_new.call(new bb_text_UnitString,bb_framework_SCREEN_WIDTH2,bb_framework_SCREEN_HEIGHT2,0.0,"CheeseKeg Games",true,10.0,20.0,400.0,5,true,76,146,216,125,45,10);
	this.bb_subLogo=bb_text_new.call(new bb_text_UnitString,bb_framework_SCREEN_WIDTH2,bb_framework_SCREEN_HEIGHT2+this.bb_logo.bb_space*6.0,0.0,"Home Brewed, Pixel by Pixel",true,3.0,10.0,100.0,3,true,230,210,210,100,100,100);
	this.bb_timer=bb_essentials_new3.call(new bb_essentials_Timer,60,true);
}
bb_splashscreen_SplashScreen.prototype.bbm_Update2=function(){
	this.bb_timer.bbm_Update2();
	if(this.bb_timer.bb_ticking && this.bb_timer.bb_ticks>=4){
		this.bb_timer.bbm_Pause();
		bb_framework_game.bb_nextScreen=bb_main_screens[1];
		bb_framework_game.bb_screenFade.bbm_Start2(50.0,true,false,false);
	}
	if(this.bb_timer.bb_ticks>0 || this.bb_timer.bb_frameCounter>30){
		this.bb_subLogo.bbm_Update2();
	}
	this.bb_logo.bbm_Update2();
	bb_main_pm.bbm_Update2();
	bb_main_zom.bbm_Update2();
}
bb_splashscreen_SplashScreen.prototype.bbm_Render=function(){
	bb_graphics_Cls(0.0,0.0,0.0);
	bb_main_zom.bbm_Render();
}
function bb_gamescreen_GameScreen(){
	bb_framework_Screen.call(this);
	this.bb_player=null;
	this.bb_testCircle=null;
	this.bb_collectCount=0;
	this.bb_collectCountString=null;
}
bb_gamescreen_GameScreen.prototype=extend_class(bb_framework_Screen);
function bb_gamescreen_new(){
	bb_framework_new2.call(this);
	this.bb_name="Game";
	return this;
}
bb_gamescreen_GameScreen.prototype.bbm_Start=function(){
	bb_main_wm=bb_world_new.call(new bb_world_WorldManager);
	bb_main_pm=bb_units_new.call(new bb_units_ParticleManager);
	bb_main_zom=bb_units_new2.call(new bb_units_ZObjectManager);
	this.bb_player=bb_world_new8.call(new bb_world_Player,bb_framework_SCREEN_WIDTH2,bb_framework_SCREEN_HEIGHT2,50.0,50.0);
	this.bb_testCircle=bb_units_new11.call(new bb_units_UnitCircle,bb_framework_SCREEN_WIDTH2,bb_framework_SCREEN_HEIGHT2,0.0,bb_framework_SCREEN_HEIGHT2*0.0,20,-1.0,255,255,255);
	this.bb_collectCount=this.bb_player.bb_bodySphere.bb_unitArray.length;
	this.bb_collectCountString=bb_text_new.call(new bb_text_UnitString,bb_framework_SCREEN_WIDTH2,50.0,0.0,String(this.bb_collectCount),true,10.0,8.0,80.0,2,true,230,230,240,150,150,165);
	this.bb_collectCountString.bbm_ResetString("Well, fuck.");
	bb_framework_game.bb_screenFade.bbm_Start2(50.0,false,false,false);
}
bb_gamescreen_GameScreen.prototype.bbm_Update2=function(){
	this.bb_testCircle.bbm_Update2();
	bb_main_wm.bbm_Update2();
	bb_main_pm.bbm_Update2();
	bb_main_zom.bbm_Update2();
	if(((bb_input_JoyHit(7,0))!=0) || ((bb_input_KeyHit(13))!=0)){
		bb_framework_game.bb_nextScreen=(this);
		bb_framework_game.bb_screenFade.bbm_Start2(50.0,true,false,false);
	}else{
		if(((bb_input_JoyHit(6,0))!=0) || ((bb_input_KeyHit(27))!=0)){
			bb_framework_game.bb_nextScreen=(bb_framework_game.bb_exitScreen);
			bb_framework_game.bb_screenFade.bbm_Start2(50.0,true,false,false);
		}
	}
	this.bb_collectCountString.bbm_Update2();
}
bb_gamescreen_GameScreen.prototype.bbm_Render=function(){
	bb_graphics_Cls(0.0,0.0,0.0);
	bb_main_wm.bbm_Render();
	bb_main_zom.bbm_Render();
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_DrawText("Rendering "+String(bb_main_zom.bb_ZObjectList.length)+" objects.",bb_framework_SCREEN_WIDTH-200.0,30.0,0.0,0.0);
}
var bb_main_screens;
function bb_functions_ExitApp(){
	error("");
}
function bb_units_ParticleManager(){
	Object.call(this);
	this.bb_charList=new_object_array(0);
	this.bb_flingList=new_object_array(0);
}
function bb_units_new(){
	return this;
}
bb_units_ParticleManager.prototype.bbm_AddChar=function(bbt_cu){
	this.bb_charList=resize_object_array(this.bb_charList,this.bb_charList.length+1);
	this.bb_charList[this.bb_charList.length-1]=bbt_cu;
}
bb_units_ParticleManager.prototype.bbm_RemoveFling=function(bbt_fu){
	var bbt_j=0;
	for(var bbt_i=0;bbt_i<=this.bb_flingList.length-1;bbt_i=bbt_i+1){
		bbt_j=bbt_i;
		if(this.bb_flingList[bbt_j]==bbt_fu){
			break;
		}
		bbt_j=-1;
	}
	if(bbt_j==-1){
		return;
	}
	while(bbt_j+1<this.bb_flingList.length){
		this.bb_flingList[bbt_j]=this.bb_flingList[bbt_j+1];
		bbt_j+=1;
	}
	this.bb_flingList=resize_object_array(this.bb_flingList,this.bb_flingList.length-1);
}
bb_units_ParticleManager.prototype.bbm_RemoveChar=function(bbt_cu){
	var bbt_j=0;
	for(var bbt_i=0;bbt_i<=this.bb_charList.length-1;bbt_i=bbt_i+1){
		bbt_j=bbt_i;
		if(this.bb_charList[bbt_j]==bbt_cu){
			break;
		}
		bbt_j=-1;
	}
	if(bbt_j==-1){
		return;
	}
	while(bbt_j+1<this.bb_charList.length){
		this.bb_charList[bbt_j]=this.bb_charList[bbt_j+1];
		bbt_j+=1;
	}
	this.bb_charList=resize_object_array(this.bb_charList,this.bb_charList.length-1);
}
bb_units_ParticleManager.prototype.bbm_Update2=function(){
	var bbt_=this.bb_flingList;
	var bbt_2=0;
	while(bbt_2<bbt_.length){
		var bbt_fu=bbt_[bbt_2];
		bbt_2=bbt_2+1;
		bbt_fu.bbm_FlingUpdate();
	}
	var bbt_3=this.bb_charList;
	var bbt_4=0;
	while(bbt_4<bbt_3.length){
		var bbt_cu=bbt_3[bbt_4];
		bbt_4=bbt_4+1;
		bbt_cu.bbm_CharUpdate();
	}
}
bb_units_ParticleManager.prototype.bbm_AddFling=function(bbt_fu){
	this.bb_flingList=resize_object_array(this.bb_flingList,this.bb_flingList.length+1);
	this.bb_flingList[this.bb_flingList.length-1]=bbt_fu;
}
var bb_main_pm;
function bb_units_ZObjectManager(){
	Object.call(this);
	this.bb_ZObjectList=new_object_array(0);
}
function bb_units_new2(){
	return this;
}
bb_units_ZObjectManager.prototype.bbm_Add=function(bbt_zo){
	this.bb_ZObjectList=resize_object_array(this.bb_ZObjectList,this.bb_ZObjectList.length+1);
	this.bb_ZObjectList[this.bb_ZObjectList.length-1]=bbt_zo;
}
bb_units_ZObjectManager.prototype.bbm_Remove=function(bbt_zo){
	var bbt_j=0;
	for(var bbt_i=0;bbt_i<=this.bb_ZObjectList.length-1;bbt_i=bbt_i+1){
		bbt_j=bbt_i;
		if(this.bb_ZObjectList[bbt_j]==bbt_zo){
			break;
		}
		bbt_j=-1;
	}
	if(bbt_j==-1){
		return;
	}
	while(bbt_j+1<this.bb_ZObjectList.length){
		this.bb_ZObjectList[bbt_j]=this.bb_ZObjectList[bbt_j+1];
		bbt_j+=1;
	}
	this.bb_ZObjectList=resize_object_array(this.bb_ZObjectList,this.bb_ZObjectList.length-1);
}
bb_units_ZObjectManager.prototype.bbm_Update2=function(){
	if(this.bb_ZObjectList.length<2){
		return;
	}
	for(var bbt_i=1;bbt_i<=this.bb_ZObjectList.length-1;bbt_i=bbt_i+1){
		var bbt_newZO=this.bb_ZObjectList[bbt_i];
		var bbt_j=bbt_i;
		while(bbt_j>0 && this.bb_ZObjectList[bbt_j-1].bbm_GetZ()<bbt_newZO.bbm_GetZ()){
			this.bb_ZObjectList[bbt_j]=this.bb_ZObjectList[bbt_j-1];
			bbt_j-=1;
		}
		this.bb_ZObjectList[bbt_j]=bbt_newZO;
	}
}
bb_units_ZObjectManager.prototype.bbm_Render=function(){
	for(var bbt_i=0;bbt_i<=this.bb_ZObjectList.length-1;bbt_i=bbt_i+1){
		this.bb_ZObjectList[bbt_i].bbm_Render();
	}
}
var bb_main_zom;
function bb_text_UnitString(){
	Object.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_z=.0;
	this.bb_center=false;
	this.bb_r=0;
	this.bb_g=0;
	this.bb_b=0;
	this.bb_r2=0;
	this.bb_g2=0;
	this.bb_b2=0;
	this.bb_displayString="";
	this.bb_space=.0;
	this.bb_distance=.0;
	this.bb_divisor=.0;
	this.bb_fade=false;
	this.bb_unitChar=[];
	this.bb_timer=null;
	this.bb_complete=false;
}
function bb_text_new(bbt_x,bbt_y,bbt_z,bbt_displayString,bbt_center,bbt_space,bbt_divisor,bbt_distance,bbt_time,bbt_fade,bbt_r,bbt_g,bbt_b,bbt_r2,bbt_g2,bbt_b2){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_z=bbt_z;
	this.bb_center=bbt_center;
	this.bb_r=bbt_r;
	this.bb_g=bbt_g;
	this.bb_b=bbt_b;
	this.bb_r2=bbt_r2;
	this.bb_g2=bbt_g2;
	this.bb_b2=bbt_b2;
	this.bb_displayString=bbt_displayString;
	this.bb_space=bbt_space;
	this.bb_distance=bbt_distance;
	this.bb_divisor=bbt_divisor;
	this.bb_fade=bbt_fade;
	this.bb_unitChar=resize_object_array(this.bb_unitChar,bbt_displayString.length);
	this.bb_timer=bb_essentials_new3.call(new bb_essentials_Timer,bbt_time,true);
	this.bb_timer.bb_frameCounter=this.bb_timer.bb_ticks;
	this.bb_complete=false;
	return this;
}
function bb_text_new2(){
	return this;
}
bb_text_UnitString.prototype.bbm_Update2=function(){
	this.bb_timer.bbm_Update2();
	if(this.bb_timer.bb_active){
		if(this.bb_timer.bb_ticks<=this.bb_displayString.length){
			if(this.bb_timer.bb_ticking){
				var bbt_finalX=.0;
				var bbt_finalY=.0;
				if(this.bb_center){
					bbt_finalX=this.bb_x-((this.bb_displayString.length)*this.bb_space*3.0+(this.bb_displayString.length-1)*this.bb_space)/2.0;
					bbt_finalY=this.bb_y-this.bb_space*5.0/2.0;
				}else{
					bbt_finalX=this.bb_x;
					bbt_finalY=this.bb_y;
				}
				var bbt_stringIndex=this.bb_timer.bb_ticks-1;
				this.bb_unitChar[bbt_stringIndex]=bb_text_new3.call(new bb_text_UnitChar,bbt_finalX+(bbt_stringIndex)*this.bb_space*4.0,bbt_finalY,this.bb_z,this.bb_displayString.charCodeAt(bbt_stringIndex),this.bb_space,this.bb_divisor,this.bb_distance,this.bb_fade,this.bb_r,this.bb_g,this.bb_b,this.bb_r2,this.bb_g2,this.bb_b2);
			}
		}else{
			this.bb_timer.bbm_Pause();
			this.bb_complete=true;
		}
	}
}
bb_text_UnitString.prototype.bbm_ClearString=function(){
	for(var bbt_i=0;bbt_i<=this.bb_unitChar.length-1;bbt_i=bbt_i+1){
		if(this.bb_unitChar[bbt_i]!=null){
			this.bb_unitChar[bbt_i].bbm_ClearChar();
			this.bb_unitChar[bbt_i]=null;
		}
	}
}
bb_text_UnitString.prototype.bbm_ResetString=function(bbt_newString){
	this.bbm_ClearString();
	this.bb_displayString=bbt_newString;
	this.bb_unitChar=resize_object_array(this.bb_unitChar,this.bb_displayString.length);
	this.bb_timer.bbm_Reset2(this.bb_timer.bb_tickFrames,true);
	this.bb_timer.bb_frameCounter=this.bb_timer.bb_tickFrames;
}
function bb_text_UnitChar(){
	Object.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_z=.0;
	this.bb_r=0;
	this.bb_g=0;
	this.bb_b=0;
	this.bb_r2=0;
	this.bb_g2=0;
	this.bb_b2=0;
	this.bb_distance=.0;
	this.bb_divisor=.0;
	this.bb_charUnit=new_object_array(15);
	this.bb_keyCode=0;
}
bb_text_UnitChar.prototype.bbm_ClearChar=function(){
	for(var bbt_i=0;bbt_i<=this.bb_charUnit.length-1;bbt_i=bbt_i+1){
		if(this.bb_charUnit[bbt_i]!=null){
			this.bb_charUnit[bbt_i].bbm_StartOut();
			this.bb_charUnit[bbt_i]=null;
		}
	}
}
bb_text_UnitChar.prototype.bbm_SetChar=function(bbt_keyCode,bbt_space,bbt_fade){
	this.bbm_ClearChar();
	this.bb_keyCode=bbt_keyCode;
	var bbt_unitLayout=bb_text_GetCharUnitLayout(bbt_keyCode);
	if(bbt_unitLayout.length<15){
		return;
	}
	var bbt_rowR=0;
	var bbt_rowG=0;
	var bbt_rowB=0;
	var bbt_deltaR=(((this.bb_r2-this.bb_r)/4)|0);
	var bbt_deltaG=(((this.bb_g2-this.bb_g)/4)|0);
	var bbt_deltaB=(((this.bb_b2-this.bb_b)/4)|0);
	var bbt_num=0;
	for(var bbt_i=0;bbt_i<=4;bbt_i=bbt_i+1){
		bbt_rowR=this.bb_r+bb_functions_Round(bbt_deltaR*(bbt_i));
		bbt_rowG=this.bb_g+bb_functions_Round(bbt_deltaG*(bbt_i));
		bbt_rowB=this.bb_b+bb_functions_Round(bbt_deltaB*(bbt_i));
		for(var bbt_j=0;bbt_j<=2;bbt_j=bbt_j+1){
			if(bbt_unitLayout[bbt_num]){
				this.bb_charUnit[bbt_num]=bb_text_new5.call(new bb_text_CharUnit,this.bb_x+bbt_space*(bbt_j),this.bb_y+bbt_space*(bbt_i),0.0,bbt_fade,this.bb_divisor,this.bb_distance,bbt_space/2.0,bbt_rowR,bbt_rowG,bbt_rowB);
			}
			bbt_num+=1;
		}
	}
}
function bb_text_new3(bbt_x,bbt_y,bbt_z,bbt_keyCode,bbt_space,bbt_divisor,bbt_distance,bbt_fade,bbt_r,bbt_g,bbt_b,bbt_r2,bbt_g2,bbt_b2){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_z=bbt_z;
	this.bb_r=bbt_r;
	this.bb_g=bbt_g;
	this.bb_b=bbt_b;
	if(bbt_r2==-1 || bbt_g2==-1 || bbt_b2==-1){
		this.bb_r2=bbt_r;
		this.bb_g2=bbt_g;
		this.bb_b2=bbt_b;
	}else{
		this.bb_r2=bbt_r2;
		this.bb_g2=bbt_g2;
		this.bb_b2=bbt_b2;
	}
	this.bb_distance=bbt_distance;
	this.bb_divisor=bbt_divisor;
	this.bbm_SetChar(bbt_keyCode,bbt_space,bbt_fade);
	return this;
}
function bb_text_new4(){
	return this;
}
function bb_essentials_Timer(){
	Object.call(this);
	this.bb_tickFrames=0;
	this.bb_active=false;
	this.bb_frameCounter=0;
	this.bb_ticks=0;
	this.bb_ticking=false;
}
bb_essentials_Timer.prototype.bbm_Reset2=function(bbt_tickFrames,bbt_active){
	this.bb_tickFrames=bbt_tickFrames;
	this.bb_active=bbt_active;
	this.bb_frameCounter=0;
	this.bb_ticks=0;
	this.bb_ticking=false;
}
function bb_essentials_new3(bbt_tickFrames,bbt_active){
	this.bbm_Reset2(bbt_tickFrames,bbt_active);
	return this;
}
function bb_essentials_new4(){
	return this;
}
bb_essentials_Timer.prototype.bbm_Update2=function(){
	if(this.bb_active){
		this.bb_frameCounter+=1;
		if(this.bb_frameCounter>=this.bb_tickFrames){
			this.bb_ticks+=1;
			this.bb_frameCounter=0;
			this.bb_ticking=true;
		}else{
			this.bb_ticking=false;
		}
	}
}
bb_essentials_Timer.prototype.bbm_Pause=function(){
	this.bb_ticking=false;
	this.bb_active=false;
}
function bb_units_Unit(){
	Object.call(this);
	this.bb_size=.0;
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_z=.0;
	this.bb_a=.0;
	this.bb_radius=.0;
	this.bb_r=0;
	this.bb_g=0;
	this.bb_b=0;
	this.implments={bb_units_ZObject:1};
}
bb_units_Unit.prototype.bbm_Update4=function(bbt_x,bbt_y,bbt_z,bbt_sizeRelative){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_z=bbt_z;
	if(bbt_sizeRelative==false || bbt_z<=0.0){
		this.bb_a=100.0;
		this.bb_radius=this.bb_size;
	}else{
		this.bb_a=100.0-bbt_z*0.7;
		this.bb_radius=this.bb_size-bbt_z*0.03;
		if(this.bb_radius<0.1){
			this.bb_radius=0.1;
		}
	}
}
function bb_units_new3(bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b){
	this.bb_size=bbt_size;
	this.bbm_Update4(bbt_x,bbt_y,bbt_z,true);
	this.bb_r=bbt_r;
	this.bb_g=bbt_g;
	this.bb_b=bbt_b;
	bb_main_zom.bbm_Add(this);
	return this;
}
function bb_units_new4(){
	return this;
}
bb_units_Unit.prototype.bbm_Render=function(){
	bb_graphics_SetAlpha(this.bb_a/100.0);
	bb_graphics_SetColor((this.bb_r),(this.bb_g),(this.bb_b));
	var bbt_drawX=this.bb_x;
	var bbt_drawY=this.bb_y;
	var bbt_drawRadius=this.bb_radius;
	bb_graphics_DrawCircle(bbt_drawX,bbt_drawY,bbt_drawRadius);
}
bb_units_Unit.prototype.bbm_GetZ=function(){
	return this.bb_z;
}
function bb_text_CharUnit(){
	bb_units_Unit.call(this);
	this.bb_baseX=.0;
	this.bb_maxDistance=.0;
	this.bb_targetX=.0;
	this.bb_baseY=.0;
	this.bb_targetY=.0;
	this.bb_divisor=.0;
	this.implments={bb_units_ZObject:1};
}
bb_text_CharUnit.prototype=extend_class(bb_units_Unit);
bb_text_CharUnit.prototype.bbm_StartOut=function(){
	var bbt_direction=bb_random_Rnd3(360.0);
	this.bb_targetX=this.bb_baseX+Math.sin((bbt_direction)*D2R)*this.bb_maxDistance*1.0001;
	this.bb_targetY=this.bb_baseY+Math.cos((bbt_direction)*D2R)*this.bb_maxDistance*1.0001;
}
bb_text_CharUnit.prototype.bbm_StartIn=function(){
	this.bb_targetX=this.bb_baseX;
	this.bb_targetY=this.bb_baseY;
}
function bb_text_new5(bbt_baseX,bbt_baseY,bbt_z,bbt_fade,bbt_divisor,bbt_maxDistance,bbt_size,bbt_r,bbt_g,bbt_b){
	bb_units_new4.call(this);
	this.bb_baseX=bbt_baseX;
	this.bb_baseY=bbt_baseY;
	this.bb_z=bbt_z;
	this.bb_divisor=bbt_divisor;
	this.bb_maxDistance=bbt_maxDistance;
	if(bbt_fade){
		var bbt_direction=bb_random_Rnd3(360.0);
		this.bb_x=bbt_baseX+Math.sin((bbt_direction)*D2R)*bbt_maxDistance;
		this.bb_y=bbt_baseY+Math.cos((bbt_direction)*D2R)*bbt_maxDistance;
	}else{
		this.bb_x=bbt_baseX;
		this.bb_y=bbt_baseY;
	}
	this.bbm_StartIn();
	this.bb_size=bbt_size;
	this.bb_r=bbt_r;
	this.bb_g=bbt_g;
	this.bb_b=bbt_b;
	bb_main_zom.bbm_Add(this);
	bb_main_pm.bbm_AddChar(this);
	return this;
}
function bb_text_new6(){
	bb_units_new4.call(this);
	return this;
}
bb_text_CharUnit.prototype.bbm_CharUpdate=function(){
	var bbt_newX=.0;
	var bbt_newY=.0;
	bbt_newX=this.bb_x+(this.bb_targetX-this.bb_x)/this.bb_divisor;
	bbt_newY=this.bb_y+(this.bb_targetY-this.bb_y)/this.bb_divisor;
	if(bbt_newX==this.bb_x){
		bbt_newX=this.bb_targetX;
	}
	if(bbt_newY==this.bb_y){
		bbt_newY=this.bb_targetY;
	}
	this.bbm_Update4(bbt_newX,bbt_newY,this.bb_z,true);
	var bbt_distance=Math.sqrt(Math.pow(this.bb_baseX-this.bb_x,2.0)+Math.pow(this.bb_baseY-this.bb_y,2.0));
	if(bbt_distance>this.bb_maxDistance){
		bb_main_zom.bbm_Remove(this);
		bb_main_pm.bbm_RemoveChar(this);
	}
	this.bb_a=(this.bb_maxDistance-bbt_distance)/this.bb_maxDistance*100.0;
	this.bb_radius=(this.bb_maxDistance-bbt_distance)/this.bb_maxDistance*this.bb_size;
}
function bb_random_Rnd(){
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	return (bb_random_Seed>>8&16777215)/16777216.0;
}
function bb_random_Rnd2(bbt_low,bbt_high){
	return bb_random_Rnd3(bbt_high-bbt_low)+bbt_low;
}
function bb_random_Rnd3(bbt_range){
	return bb_random_Rnd()*bbt_range;
}
var bb_text_UnitCharLayout;
var bb_text_UnitCharCompression;
function bb_text_GetCharUnitLayout(bbt_keyCode){
	var bbt_result=new_bool_array(15);
	var bbt_charLayout="";
	for(var bbt_i=0;bbt_i<=bb_text_UnitCharLayout.length-1;bbt_i=bbt_i+1){
		if(bb_text_UnitCharLayout[bbt_i][0]==bbt_keyCode){
			bbt_charLayout=String(bb_text_UnitCharLayout[bbt_i][1]);
			break;
		}
	}
	if(bbt_charLayout.length<5){
		print("DERP!");
		return [false];
	}
	for(var bbt_row=0;bbt_row<=4;bbt_row=bbt_row+1){
		var bbt_compressionBank=bb_text_UnitCharCompression[bbt_charLayout.charCodeAt(bbt_row)-49];
		for(var bbt_i2=0;bbt_i2<=2;bbt_i2=bbt_i2+1){
			bbt_result[bbt_row*3+bbt_i2]=bbt_compressionBank[bbt_i2];
		}
	}
	return bbt_result;
}
function bb_functions_Round(bbt_flot){
	return ((Math.floor(bbt_flot+0.5))|0);
}
function bb_units_FlingUnit(){
	bb_units_Unit.call(this);
	this.bb_friction=.0;
	this.bb_speed=.0;
	this.bb_rotation=.0;
	this.bb_direction=.0;
	this.bb_realX=.0;
	this.bb_realY=.0;
	this.bb_startSpeed=.0;
	this.bb_startSize=.0;
	this.implments={bb_units_ZObject:1};
}
bb_units_FlingUnit.prototype=extend_class(bb_units_Unit);
bb_units_FlingUnit.prototype.bbm_FlingUpdate=function(){
	this.bb_speed-=this.bb_friction;
	if(this.bb_speed<0.0){
		bb_main_pm.bbm_RemoveFling(this);
		bb_main_zom.bbm_Remove(this);
	}
	this.bb_direction+=this.bb_rotation;
	this.bb_realX+=Math.sin((this.bb_direction)*D2R)*this.bb_speed;
	this.bb_realY+=Math.cos((this.bb_direction)*D2R)*this.bb_speed;
	bb_units_Unit.prototype.bbm_Update4.call(this,this.bb_realX,this.bb_realY,this.bb_z,true);
	this.bb_a=this.bb_a*(this.bb_speed/this.bb_startSpeed);
	this.bb_size=this.bb_startSize*(this.bb_speed/this.bb_startSpeed);
	var bbt_leftBound=bb_main_wm.bb_leftBound+this.bb_radius;
	var bbt_rightBound=bb_main_wm.bb_rightBound-this.bb_radius;
	var bbt_topBound=bb_main_wm.bb_topBound+this.bb_radius;
	var bbt_bottomBound=bb_main_wm.bb_bottomBound-this.bb_radius;
	var bbt_xDir=Math.sin((this.bb_direction)*D2R);
	var bbt_yDir=Math.cos((this.bb_direction)*D2R);
	if(this.bb_x<bbt_leftBound){
		bbt_xDir=-bbt_xDir;
		this.bb_realX+=(bbt_leftBound-this.bb_x)*2.0;
	}else{
		if(this.bb_x>bbt_rightBound){
			bbt_xDir=-bbt_xDir;
			this.bb_realX+=(bbt_rightBound-this.bb_x)*2.0;
		}
	}
	if(this.bb_y<bbt_topBound){
		bbt_yDir=-bbt_yDir;
		this.bb_realY+=(bbt_topBound-this.bb_y)*2.0;
	}else{
		if(this.bb_y>bbt_bottomBound){
			bbt_yDir=-bbt_yDir;
			this.bb_realY+=(bbt_bottomBound-this.bb_y)*2.0;
		}
	}
	this.bb_x=this.bb_realX+bb_random_Rnd2(-1.0,1.0);
	this.bb_y=this.bb_realY+bb_random_Rnd2(-1.0,1.0);
	this.bb_direction=(Math.atan2(bbt_xDir,bbt_yDir)*R2D);
}
function bb_units_new5(bbt_x,bbt_y,bbt_z,bbt_speed,bbt_direction,bbt_rotation,bbt_friction,bbt_size,bbt_r,bbt_g,bbt_b){
	bb_units_new3.call(this,bbt_x,bbt_y,bbt_z,bbt_size,((bbt_r)|0),((bbt_g)|0),((bbt_b)|0));
	this.bb_realX=bbt_x;
	this.bb_realY=bbt_y;
	this.bb_startSpeed=bbt_speed;
	this.bb_speed=bbt_speed;
	this.bb_direction=bbt_direction;
	this.bb_rotation=bbt_rotation;
	this.bb_startSize=bbt_size;
	this.bb_friction=bbt_friction;
	bb_main_pm.bbm_AddFling(this);
	return this;
}
function bb_units_new6(){
	bb_units_new4.call(this);
	return this;
}
function bb_world_WorldManager(){
	Object.call(this);
	this.bb_leftBound=7.0;
	this.bb_rightBound=bb_framework_SCREEN_WIDTH-7.0;
	this.bb_topBound=7.0;
	this.bb_bottomBound=bb_framework_SCREEN_HEIGHT-7.0;
	this.bb_entity=new_object_array(0);
	this.bb_collectable=new_object_array(0);
}
function bb_world_new(){
	return this;
}
bb_world_WorldManager.prototype.bbm_AddEntity=function(bbt_e){
	this.bb_entity=resize_object_array(this.bb_entity,this.bb_entity.length+1);
	this.bb_entity[this.bb_entity.length-1]=bbt_e;
}
bb_world_WorldManager.prototype.bbm_AddCollectable=function(bbt_c){
	this.bb_collectable=resize_object_array(this.bb_collectable,this.bb_collectable.length+1);
	this.bb_collectable[this.bb_collectable.length-1]=bbt_c;
}
bb_world_WorldManager.prototype.bbm_RemoveCollectable=function(bbt_c){
	var bbt_j=0;
	for(var bbt_i=0;bbt_i<=this.bb_collectable.length-1;bbt_i=bbt_i+1){
		bbt_j=bbt_i;
		if(this.bb_collectable[bbt_j]==bbt_c){
			break;
		}
		bbt_j=-1;
	}
	if(bbt_j==-1){
		return;
	}
	while(bbt_j+1<this.bb_collectable.length){
		this.bb_collectable[bbt_j]=this.bb_collectable[bbt_j+1];
		bbt_j+=1;
	}
	this.bb_collectable=resize_object_array(this.bb_collectable,this.bb_collectable.length-1);
}
bb_world_WorldManager.prototype.bbm_Update2=function(){
	if(bb_random_Rnd()>0.0){
		var bbt_radius=Math.sqrt(Math.pow(bb_framework_SCREEN_WIDTH2,2.0)+Math.pow(bb_framework_SCREEN_HEIGHT2,2.0));
		var bbt_direction=bb_random_Rnd3(360.0);
		var bbt_offset=Math.sin((bb_random_Rnd3(360.0))*D2R)*bb_framework_SCREEN_HEIGHT2;
		var bbt_r=0;
		var bbt_g=0;
		var bbt_b=0;
		if(bb_random_Rnd()>0.0){
			bbt_r=255;
			bbt_g=0;
			bbt_b=0;
		}else{
			bbt_r=((bb_random_Rnd3(100.0))|0);
			bbt_g=((bb_random_Rnd2(100.0,255.0))|0);
			bbt_b=((bb_random_Rnd2(100.0,255.0))|0);
		}
		bb_world_new12.call(new bb_world_SineCollectable,bb_framework_SCREEN_WIDTH2-Math.sin((bbt_direction)*D2R)*bbt_radius+Math.sin((bbt_direction+90.0)*D2R)*bbt_offset,bb_framework_SCREEN_HEIGHT2-Math.cos((bbt_direction)*D2R)*bbt_radius+Math.cos((bbt_direction+90.0)*D2R)*bbt_offset,50.0,10.0,bbt_direction,bb_random_Rnd2(1.0,3.0),bb_random_Rnd2(2.0,7.0),bb_random_Rnd2(10.0,40.0),bb_random_Rnd2(0.0,359.0),bbt_r,bbt_g,bbt_b);
	}
	var bbt_=this.bb_collectable;
	var bbt_2=0;
	while(bbt_2<bbt_.length){
		var bbt_c=bbt_[bbt_2];
		bbt_2=bbt_2+1;
		bbt_c.bbm_Update2();
	}
	var bbt_3=this.bb_entity;
	var bbt_4=0;
	while(bbt_4<bbt_3.length){
		var bbt_e=bbt_3[bbt_4];
		bbt_4=bbt_4+1;
		bbt_e.bbm_Update2();
		var bbt_5=this.bb_collectable;
		var bbt_6=0;
		while(bbt_6<bbt_5.length){
			var bbt_c2=bbt_5[bbt_6];
			bbt_6=bbt_6+1;
			bbt_c2.bbm_CollisionCheck(bbt_e);
		}
	}
}
bb_world_WorldManager.prototype.bbm_Render=function(){
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetColor(100.0,100.0,150.0);
	bb_graphics_DrawRect(this.bb_leftBound,this.bb_topBound,this.bb_rightBound-this.bb_leftBound,this.bb_bottomBound-this.bb_topBound);
	bb_graphics_SetColor(150.0,100.0,100.0);
	bb_graphics_DrawRect(0.0,0.0,this.bb_leftBound,bb_framework_SCREEN_HEIGHT);
	bb_graphics_DrawRect(bb_framework_SCREEN_WIDTH-(bb_framework_SCREEN_WIDTH-this.bb_rightBound),0.0,bb_framework_SCREEN_WIDTH-this.bb_rightBound,bb_framework_SCREEN_HEIGHT);
	bb_graphics_DrawRect(this.bb_leftBound,0.0,this.bb_rightBound-this.bb_leftBound,this.bb_topBound);
	bb_graphics_DrawRect(this.bb_leftBound,this.bb_bottomBound,this.bb_rightBound-this.bb_leftBound,bb_framework_SCREEN_HEIGHT-(bb_framework_SCREEN_HEIGHT-this.bb_bottomBound));
}
var bb_main_wm;
function bb_graphics_Cls(bbt_r,bbt_g,bbt_b){
	bb_graphics_renderDevice.Cls(bbt_r,bbt_g,bbt_b);
	return 0;
}
function bb_world_GameObject(){
	Object.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_z=.0;
}
function bb_world_new2(bbt_x,bbt_y,bbt_z){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_z=bbt_z;
	return this;
}
function bb_world_new3(){
	return this;
}
bb_world_GameObject.prototype.bbm_Update2=function(){
}
function bb_world_Orb(){
	bb_world_GameObject.call(this);
	this.bb_size=.0;
	this.bb_body=null;
}
bb_world_Orb.prototype=extend_class(bb_world_GameObject);
function bb_world_new4(bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b){
	bb_world_new2.call(this,bbt_x,bbt_y,bbt_z);
	this.bb_size=bbt_size;
	this.bb_body=bb_units_new3.call(new bb_units_Unit,bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b);
	return this;
}
function bb_world_new5(){
	bb_world_new3.call(this);
	return this;
}
bb_world_Orb.prototype.bbm_Update2=function(){
	this.bb_body.bbm_Update4(this.bb_x,this.bb_y,this.bb_z,true);
}
function bb_world_Entity(){
	bb_world_Orb.call(this);
	this.bb_accelSpeed=.0;
	this.bb_maxSpeed=.0;
	this.bb_friction=.0;
	this.bb_speed=.0;
	this.bb_targetAccelX=.0;
	this.bb_targetAccelY=.0;
	this.bb_targetAccelAngle=.0;
	this.bb_accelX=.0;
	this.bb_accelY=.0;
	this.bb_accelAngle=.0;
	this.bb_inputXAxis=.0;
	this.bb_inputYAxis=.0;
	this.bb_bodySphere=null;
	this.bb_deltaPitch=.0;
	this.bb_deltaRoll=.0;
	this.bb_deltaYaw=.0;
}
bb_world_Entity.prototype=extend_class(bb_world_Orb);
function bb_world_new6(bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b,bbt_accelSpeed,bbt_maxSpeed,bbt_friction){
	bb_world_new4.call(this,bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b);
	this.bb_accelSpeed=bbt_accelSpeed;
	this.bb_maxSpeed=bbt_maxSpeed;
	this.bb_friction=bbt_friction;
	this.bb_speed=0.0;
	this.bb_targetAccelX=0.0;
	this.bb_targetAccelY=0.0;
	this.bb_targetAccelAngle=0.0;
	this.bb_accelX=0.0;
	this.bb_accelY=0.0;
	this.bb_accelAngle=0.0;
	this.bb_inputXAxis=0.0;
	this.bb_inputYAxis=0.0;
	this.bb_bodySphere=bb_units_new7.call(new bb_units_UnitSphere,bbt_x,bbt_y,bbt_z,bbt_size,0,10.0);
	bb_main_wm.bbm_AddEntity(this);
	return this;
}
function bb_world_new7(){
	bb_world_new5.call(this);
	return this;
}
bb_world_Entity.prototype.bbm_UpdateInput=function(){
}
bb_world_Entity.prototype.bbm_Update2=function(){
	this.bbm_UpdateInput();
	this.bb_targetAccelAngle=(Math.atan2(this.bb_inputXAxis,this.bb_inputYAxis)*R2D);
	this.bb_targetAccelX=Math.sin((this.bb_targetAccelAngle)*D2R)*bb_math_Abs2(this.bb_inputXAxis)*this.bb_accelSpeed;
	this.bb_targetAccelY=Math.cos((this.bb_targetAccelAngle)*D2R)*bb_math_Abs2(this.bb_inputYAxis)*this.bb_accelSpeed;
	this.bb_accelX+=this.bb_targetAccelX;
	this.bb_accelY+=this.bb_targetAccelY;
	this.bb_speed=Math.sqrt(Math.pow(this.bb_accelX,2.0)+Math.pow(this.bb_accelY,2.0));
	this.bb_accelAngle=(Math.atan2(this.bb_accelX,this.bb_accelY)*R2D);
	var bbt_relativeFriction=this.bb_friction*(this.bb_speed/this.bb_maxSpeed);
	this.bb_speed-=bbt_relativeFriction;
	var bbt_constantFriction=this.bb_friction/3.0;
	if(this.bb_speed>0.0){
		if(this.bb_speed>bbt_constantFriction){
			this.bb_speed-=bbt_constantFriction;
		}else{
			this.bb_speed=0.0;
		}
	}
	if(this.bb_speed>this.bb_maxSpeed){
		this.bb_speed=this.bb_maxSpeed;
	}
	this.bb_accelX=Math.sin((this.bb_accelAngle)*D2R)*this.bb_speed;
	this.bb_accelY=Math.cos((this.bb_accelAngle)*D2R)*this.bb_speed;
	this.bb_x+=this.bb_accelX;
	this.bb_y-=this.bb_accelY;
	this.bb_deltaPitch=this.bb_accelX;
	this.bb_deltaRoll=this.bb_accelY;
	var bbt_leftBound=bb_main_wm.bb_leftBound+this.bb_body.bb_radius;
	var bbt_rightBound=bb_main_wm.bb_rightBound-this.bb_body.bb_radius;
	var bbt_topBound=bb_main_wm.bb_topBound+this.bb_body.bb_radius;
	var bbt_bottomBound=bb_main_wm.bb_bottomBound-this.bb_body.bb_radius;
	if(this.bb_x<bbt_leftBound){
		var bbt_bounceOffset=bbt_leftBound-this.bb_x;
		this.bb_deltaPitch+=bbt_bounceOffset*2.0*0.7;
		this.bb_x=bbt_leftBound+bbt_bounceOffset*0.7;
		this.bb_accelX=-this.bb_accelX*0.7;
	}else{
		if(this.bb_x>bbt_rightBound){
			var bbt_bounceOffset2=bbt_rightBound-this.bb_x;
			this.bb_deltaPitch+=bbt_bounceOffset2*2.0*0.7;
			this.bb_x=bbt_rightBound+bbt_bounceOffset2*0.7;
			this.bb_accelX=-this.bb_accelX*0.7;
		}
	}
	if(this.bb_y<bbt_topBound){
		var bbt_bounceOffset3=bbt_topBound-this.bb_y;
		this.bb_deltaRoll-=bbt_bounceOffset3*2.0*0.7;
		this.bb_y=bbt_topBound+bbt_bounceOffset3*0.7;
		this.bb_accelY=-this.bb_accelY*0.7;
	}else{
		if(this.bb_y>bbt_bottomBound){
			var bbt_bounceOffset4=bbt_bottomBound-this.bb_y;
			this.bb_deltaRoll-=bbt_bounceOffset4*2.0*0.7;
			this.bb_y=bbt_bottomBound+bbt_bounceOffset4*0.7;
			this.bb_accelY=-this.bb_accelY*0.7;
		}
	}
	bb_world_Orb.prototype.bbm_Update2.call(this);
	this.bb_bodySphere.bbm_Update5(this.bb_x,this.bb_y,this.bb_z,this.bb_deltaYaw,this.bb_deltaPitch,this.bb_deltaRoll);
}
bb_world_Entity.prototype.bbm_Collect=function(bbt_c){
	var bbt_soundOffset=((Math.floor(bb_random_Rnd2(0.0,5.0)))|0);
	if(bbt_c.bb_body.bb_r==255 && bbt_c.bb_body.bb_g==0 && bbt_c.bb_body.bb_b==0){
		bb_sound_PlaySoundType(1);
		var bbt_closestSort=new_array_array(this.bb_bodySphere.bb_unitArray.length);
		for(var bbt_i=0;bbt_i<=this.bb_bodySphere.bb_unitArray.length-1;bbt_i=bbt_i+1){
			bbt_closestSort[bbt_i]=new_number_array(2);
			bbt_closestSort[bbt_i][0]=(bbt_i);
			var bbt_distance=Math.sqrt(Math.pow(bbt_c.bb_x-this.bb_bodySphere.bb_unitArray[bbt_i].bb_x,2.0)+Math.pow(bbt_c.bb_y-this.bb_bodySphere.bb_unitArray[bbt_i].bb_y,2.0)+Math.pow(bbt_c.bb_z-this.bb_bodySphere.bb_unitArray[bbt_i].bb_z,2.0));
			bbt_closestSort[bbt_i][1]=bbt_distance;
		}
		for(var bbt_i2=1;bbt_i2<=bbt_closestSort.length-1;bbt_i2=bbt_i2+1){
			var bbt_newCS=bbt_closestSort[bbt_i2];
			var bbt_j=bbt_i2;
			while(bbt_j>0 && bbt_closestSort[bbt_j-1][1]>bbt_newCS[1]){
				bbt_closestSort[bbt_j]=bbt_closestSort[bbt_j-1];
				bbt_j-=1;
			}
			bbt_closestSort[bbt_j]=bbt_newCS;
		}
		var bbt_removeNum=((Math.ceil((this.bb_bodySphere.bb_unitArray.length)/5.0))|0);
		if(this.bb_bodySphere.bb_unitArray.length<bbt_removeNum){
			bbt_removeNum=this.bb_bodySphere.bb_unitArray.length;
		}
		var bbt_impactDirection=(Math.atan2(bbt_c.bb_x-this.bb_body.bb_x,bbt_c.bb_y-this.bb_body.bb_y)*R2D);
		for(var bbt_i3=0;bbt_i3<=bbt_removeNum-1;bbt_i3=bbt_i3+1){
			var bbt_targetNum=((bbt_closestSort[bbt_i3][0])|0);
			var bbt_target=this.bb_bodySphere.bb_unitArray[bbt_targetNum];
			var bbt_speed=Math.sqrt(Math.pow(bbt_target.bb_x-this.bb_bodySphere.bb_x,2.0)+Math.pow(bbt_target.bb_y-this.bb_bodySphere.bb_y,2.0))/this.bb_bodySphere.bb_radius*10.0;
			var bbt_direction=(Math.atan2(bbt_target.bb_x-this.bb_bodySphere.bb_x,bbt_target.bb_y-this.bb_bodySphere.bb_y)*R2D);
			var bbt_relativeDirection=.0;
			if(bbt_direction<bbt_impactDirection-180.0){
				bbt_relativeDirection=bbt_relativeDirection+360.0;
			}else{
				if(bbt_direction>bbt_impactDirection+179.0){
					bbt_relativeDirection=bbt_relativeDirection-360.0;
				}else{
					bbt_relativeDirection=bbt_direction;
				}
			}
			var bbt_deltaDirection=(bbt_relativeDirection-bbt_impactDirection)/180.0*1.5;
			bb_units_new5.call(new bb_units_FlingUnit,bbt_target.bb_x,bbt_target.bb_y,bbt_target.bb_z,bbt_speed,bbt_direction,bbt_deltaDirection,bb_random_Rnd2(0.05,0.3),bbt_target.bb_size,(bbt_target.bb_r),(bbt_target.bb_g),(bbt_target.bb_b));
		}
		for(var bbt_i4=1;bbt_i4<=bbt_removeNum;bbt_i4=bbt_i4+1){
			this.bb_bodySphere.bbm_RemoveSurfaceUnit((bbt_closestSort[bbt_i4-1][0])|0);
			for(var bbt_j2=bbt_i4;bbt_j2<=bbt_closestSort.length-1;bbt_j2=bbt_j2+1){
				if(bbt_closestSort[bbt_j2][0]>bbt_closestSort[bbt_i4-1][0]){
					bbt_closestSort[bbt_j2][0]=bbt_closestSort[bbt_j2][0]-1.0;
				}
			}
		}
		var bbt_feedbackX=-Math.sin((bbt_impactDirection)*D2R)*10.0;
		var bbt_feedbackY=Math.cos((bbt_impactDirection)*D2R)*10.0;
		this.bb_accelX+=bbt_feedbackX;
		this.bb_accelY+=bbt_feedbackY;
	}else{
		bb_sound_PlaySoundType(0);
		this.bb_bodySphere.bbm_AddSurfaceUnit(90.0,(Math.atan2(bbt_c.bb_y-this.bb_y,bbt_c.bb_x-this.bb_x)*R2D),bbt_c.bb_size,bbt_c.bb_body.bb_r,bbt_c.bb_body.bb_g,bbt_c.bb_body.bb_b);
	}
}
function bb_world_Player(){
	bb_world_Entity.call(this);
}
bb_world_Player.prototype=extend_class(bb_world_Entity);
function bb_world_new8(bbt_x,bbt_y,bbt_z,bbt_size){
	bb_world_new6.call(this,bbt_x,bbt_y,bbt_z,bbt_size,100,100,210,0.4,15.0,0.13);
	return this;
}
function bb_world_new9(){
	bb_world_new7.call(this);
	return this;
}
bb_world_Player.prototype.bbm_UpdateInput=function(){
	var bbt_upControl=false;
	var bbt_downControl=false;
	var bbt_leftControl=false;
	var bbt_rightControl=false;
	if(((bb_input_KeyDown(87))!=0) || ((bb_input_KeyDown(38))!=0)){
		bbt_upControl=true;
	}
	if(((bb_input_KeyDown(83))!=0) || ((bb_input_KeyDown(40))!=0)){
		bbt_downControl=true;
	}
	if(((bb_input_KeyDown(65))!=0) || ((bb_input_KeyDown(37))!=0)){
		bbt_leftControl=true;
	}
	if(((bb_input_KeyDown(68))!=0) || ((bb_input_KeyDown(39))!=0)){
		bbt_rightControl=true;
	}
	if(bbt_upControl && !bbt_downControl){
		this.bb_inputYAxis=1.0;
	}else{
		if(bbt_downControl && !bbt_upControl){
			this.bb_inputYAxis=-1.0;
		}else{
			this.bb_inputYAxis=0.0;
		}
	}
	if(bbt_leftControl && !bbt_rightControl){
		this.bb_inputXAxis=-1.0;
	}else{
		if(bbt_rightControl && !bbt_leftControl){
			this.bb_inputXAxis=1.0;
		}else{
			this.bb_inputXAxis=0.0;
		}
	}
	if(Math.sqrt(Math.pow(bb_input_JoyX(0,0),2.0)+Math.pow(bb_input_JoyY(0,0),2.0))>0.1){
		this.bb_inputXAxis=bb_input_JoyX(0,0);
		this.bb_inputYAxis=bb_input_JoyY(0,0);
	}
	if((bb_input_KeyDown(82))!=0){
		this.bb_bodySphere.bbm_Reset3();
	}
}
function bb_units_UnitSphere(){
	Object.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_z=.0;
	this.bb_radius=.0;
	this.bb_unitArray=new_object_array(0);
}
bb_units_UnitSphere.prototype.bbm_AddSurfaceUnit=function(bbt_inclination,bbt_azimuth,bbt_size,bbt_r,bbt_g,bbt_b){
	this.bb_unitArray=resize_object_array(this.bb_unitArray,this.bb_unitArray.length+1);
	this.bb_unitArray[this.bb_unitArray.length-1]=bb_units_new9.call(new bb_units_SphereUnit,this.bb_x,this.bb_y,this.bb_z,this.bb_radius,bbt_inclination,bbt_azimuth,bbt_size,bbt_r,bbt_g,bbt_b);
	var bbt_u=this.bb_unitArray[this.bb_unitArray.length-1];
}
function bb_units_new7(bbt_x,bbt_y,bbt_z,bbt_radius,bbt_unitNum,bbt_size){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_z=bbt_z;
	this.bb_radius=bbt_radius;
	for(var bbt_i=1;bbt_i<=bbt_unitNum;bbt_i=bbt_i+1){
		this.bbm_AddSurfaceUnit((Math.asin(bb_random_Rnd2(-1.0,1.0))*R2D)+90.0,bb_random_Rnd2(0.0,360.0),bbt_size,255,255,255);
	}
	return this;
}
function bb_units_new8(){
	return this;
}
bb_units_UnitSphere.prototype.bbm_Update5=function(bbt_x,bbt_y,bbt_z,bbt_yaw,bbt_pitch,bbt_roll){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_z=bbt_z;
	var bbt_=this.bb_unitArray;
	var bbt_2=0;
	while(bbt_2<bbt_.length){
		var bbt_unit=bbt_[bbt_2];
		bbt_2=bbt_2+1;
		bbt_unit.bbm_RotationUpdate(bbt_x,bbt_y,bbt_z,bbt_yaw,bbt_pitch,bbt_roll);
	}
}
bb_units_UnitSphere.prototype.bbm_RemoveSurfaceUnit=function(bbt_arrayNum){
	bb_main_zom.bbm_Remove(this.bb_unitArray[bbt_arrayNum]);
	for(var bbt_i=bbt_arrayNum+1;bbt_i<=this.bb_unitArray.length-1;bbt_i=bbt_i+1){
		this.bb_unitArray[bbt_i-1]=this.bb_unitArray[bbt_i];
	}
	this.bb_unitArray=resize_object_array(this.bb_unitArray,this.bb_unitArray.length-1);
}
bb_units_UnitSphere.prototype.bbm_Reset3=function(){
	var bbt_=this.bb_unitArray;
	var bbt_2=0;
	while(bbt_2<bbt_.length){
		var bbt_unit=bbt_[bbt_2];
		bbt_2=bbt_2+1;
		bbt_unit.bbm_Reset3();
	}
}
function bb_units_SphereUnit(){
	bb_units_Unit.call(this);
	this.bb_cx=.0;
	this.bb_cy=.0;
	this.bb_cz=.0;
	this.bb_sphereRadius=.0;
	this.bb_inclination=.0;
	this.bb_azimuth=.0;
	this.implments={bb_units_ZObject:1};
}
bb_units_SphereUnit.prototype=extend_class(bb_units_Unit);
bb_units_SphereUnit.prototype.bbm_Reset3=function(){
	this.bbm_Update4(this.bb_cx+Math.sin((this.bb_inclination)*D2R)*Math.cos((this.bb_azimuth)*D2R)*this.bb_sphereRadius,this.bb_cy+Math.sin((this.bb_inclination)*D2R)*Math.sin((this.bb_azimuth)*D2R)*this.bb_sphereRadius,this.bb_cz+Math.cos((this.bb_inclination)*D2R)*this.bb_sphereRadius,true);
}
function bb_units_new9(bbt_cx,bbt_cy,bbt_cz,bbt_sphereRadius,bbt_inclination,bbt_azimuth,bbt_size,bbt_r,bbt_g,bbt_b){
	bb_units_new4.call(this);
	this.bb_cx=bbt_cx;
	this.bb_cy=bbt_cy;
	this.bb_cz=bbt_cz;
	this.bb_sphereRadius=bbt_sphereRadius;
	this.bb_inclination=bbt_inclination;
	this.bb_azimuth=bbt_azimuth;
	this.bb_size=bbt_size;
	this.bbm_Reset3();
	this.bb_r=bbt_r;
	this.bb_g=bbt_g;
	this.bb_b=bbt_b;
	bb_main_zom.bbm_Add(this);
	return this;
}
function bb_units_new10(){
	bb_units_new4.call(this);
	return this;
}
bb_units_SphereUnit.prototype.bbm_RotationUpdate=function(bbt_ncx,bbt_ncy,bbt_ncz,bbt_yaw,bbt_pitch,bbt_roll){
	var bbt_deltaX=this.bb_x-this.bb_cx;
	var bbt_deltaY=this.bb_y-this.bb_cy;
	var bbt_deltaZ=this.bb_z-this.bb_cz;
	this.bb_cx=bbt_ncx;
	this.bb_cy=bbt_ncy;
	this.bb_cz=bbt_ncz;
	this.bb_x=bbt_ncx+bbt_deltaX;
	this.bb_y=bbt_ncy+bbt_deltaY;
	this.bb_z=bbt_ncz+bbt_deltaZ;
	var bbt_m11=.0;
	var bbt_m12=.0;
	var bbt_m13=.0;
	var bbt_m21=.0;
	var bbt_m22=.0;
	var bbt_m23=.0;
	var bbt_m31=.0;
	var bbt_m32=.0;
	var bbt_m33=.0;
	var bbt_sinYaw=Math.sin((bbt_yaw)*D2R);
	var bbt_cosYaw=Math.cos((bbt_yaw)*D2R);
	var bbt_sinPitch=Math.sin((bbt_pitch)*D2R);
	var bbt_cosPitch=Math.cos((bbt_pitch)*D2R);
	var bbt_sinRoll=Math.sin((bbt_roll)*D2R);
	var bbt_cosRoll=Math.cos((bbt_roll)*D2R);
	bbt_m11=bbt_cosYaw*bbt_cosPitch;
	bbt_m12=bbt_cosYaw*bbt_sinPitch*bbt_sinRoll-bbt_sinYaw*bbt_cosRoll;
	bbt_m13=bbt_cosYaw*bbt_sinPitch*bbt_cosRoll+bbt_sinYaw*bbt_sinRoll;
	bbt_m21=bbt_sinYaw*bbt_cosPitch;
	bbt_m22=bbt_sinYaw*bbt_sinPitch*bbt_sinRoll+bbt_cosYaw*bbt_cosRoll;
	bbt_m23=bbt_sinYaw*bbt_sinPitch*bbt_cosRoll-bbt_cosYaw*bbt_sinRoll;
	bbt_m31=-bbt_sinPitch;
	bbt_m32=bbt_cosPitch*bbt_sinRoll;
	bbt_m33=bbt_cosPitch*bbt_cosRoll;
	this.bbm_Update4(this.bb_cx+(bbt_deltaX*bbt_m11+bbt_deltaY*bbt_m21+bbt_deltaZ*bbt_m31),this.bb_cy+(bbt_deltaX*bbt_m12+bbt_deltaY*bbt_m22+bbt_deltaZ*bbt_m32),this.bb_cz+(bbt_deltaX*bbt_m13+bbt_deltaY*bbt_m23+bbt_deltaZ*bbt_m33),true);
}
function bb_units_UnitCircle(){
	Object.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_z=.0;
	this.bb_radius=.0;
	this.bb_r=0;
	this.bb_g=0;
	this.bb_b=0;
	this.bb_unitArray=[];
}
bb_units_UnitCircle.prototype.bbm_GenerateCircle=function(bbt_unitNum,bbt_unitSize){
	this.bb_unitArray=resize_object_array(this.bb_unitArray,bbt_unitNum);
	var bbt_directionOffset=((360/bbt_unitNum)|0);
	var bbt_unitRadius=.0;
	var bbt_sizeRelative=false;
	if(bbt_unitSize==-1.0){
		bbt_sizeRelative=true;
		var bbt_x1=0.0;
		var bbt_y1=this.bb_radius;
		var bbt_x2=Math.sin((bbt_directionOffset)*D2R)*this.bb_radius;
		var bbt_y2=Math.cos((bbt_directionOffset)*D2R)*this.bb_radius;
		bbt_unitRadius=Math.sqrt(Math.pow(bbt_x2-bbt_x1,2.0)+Math.pow(bbt_y2-bbt_y1,2.0))/2.0;
	}else{
		bbt_sizeRelative=false;
		bbt_unitRadius=bbt_unitSize;
	}
	var bbt_unitDirection=.0;
	for(var bbt_i=0;bbt_i<=bbt_unitNum-1;bbt_i=bbt_i+1){
		bbt_unitDirection=bbt_directionOffset*(bbt_i);
		this.bb_unitArray[bbt_i]=bb_units_new13.call(new bb_units_CircleUnit,this.bb_x,this.bb_y,this.bb_z,bbt_unitRadius,this.bb_radius,bbt_unitDirection,2.0,this.bb_r,this.bb_g,this.bb_b,bbt_sizeRelative);
	}
}
function bb_units_new11(bbt_x,bbt_y,bbt_z,bbt_radius,bbt_unitNum,bbt_unitSize,bbt_r,bbt_g,bbt_b){
	this.bb_x=bbt_x;
	this.bb_y=bbt_y;
	this.bb_z=bbt_z;
	this.bb_radius=bbt_radius;
	this.bb_r=bbt_r;
	this.bb_g=bbt_g;
	this.bb_b=bbt_b;
	this.bbm_GenerateCircle(bbt_unitNum,bbt_unitSize);
	return this;
}
function bb_units_new12(){
	return this;
}
bb_units_UnitCircle.prototype.bbm_Update2=function(){
	var bbt_=this.bb_unitArray;
	var bbt_2=0;
	while(bbt_2<bbt_.length){
		var bbt_unit=bbt_[bbt_2];
		bbt_2=bbt_2+1;
		bbt_unit.bbm_CircleUpdate();
	}
}
function bb_units_CircleUnit(){
	bb_units_Unit.call(this);
	this.bb_centerX=.0;
	this.bb_centerY=.0;
	this.bb_centerZ=.0;
	this.bb_distance=.0;
	this.bb_startDirection=.0;
	this.bb_direction=.0;
	this.bb_destinationDirection=.0;
	this.bb_sizeRelative=false;
	this.bb_divisor=.0;
	this.implments={bb_units_ZObject:1};
}
bb_units_CircleUnit.prototype=extend_class(bb_units_Unit);
bb_units_CircleUnit.prototype.bbm_SetDirection=function(bbt_direction){
	this.bb_destinationDirection=this.bb_startDirection+bbt_direction;
}
bb_units_CircleUnit.prototype.bbm_CircleUpdate=function(){
	this.bb_direction+=(this.bb_destinationDirection-this.bb_direction)/this.bb_divisor;
	bb_units_Unit.prototype.bbm_Update4.call(this,Math.sin((this.bb_direction)*D2R)*this.bb_distance,Math.cos((this.bb_direction)*D2R)*this.bb_distance,this.bb_centerZ,this.bb_sizeRelative);
}
function bb_units_new13(bbt_centerX,bbt_centerY,bbt_centerZ,bbt_size,bbt_distance,bbt_direction,bbt_divisor,bbt_r,bbt_g,bbt_b,bbt_sizeRelative){
	bb_units_new4.call(this);
	this.bb_centerX=bbt_centerX;
	this.bb_centerY=bbt_centerY;
	this.bb_centerZ=bbt_centerZ;
	this.bb_distance=bbt_distance;
	this.bb_startDirection=bbt_direction;
	this.bb_direction=bbt_direction;
	this.bbm_SetDirection(bbt_direction);
	this.bb_r=bbt_r;
	this.bb_g=bbt_g;
	this.bb_b=bbt_b;
	this.bb_sizeRelative=bbt_sizeRelative;
	this.bbm_CircleUpdate();
	bb_main_zom.bbm_Add(this);
	return this;
}
function bb_units_new14(){
	bb_units_new4.call(this);
	return this;
}
function bb_world_Collectable(){
	bb_world_Orb.call(this);
}
bb_world_Collectable.prototype=extend_class(bb_world_Orb);
function bb_world_new10(bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b){
	bb_world_new4.call(this,bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b);
	bb_main_wm.bbm_AddCollectable(this);
	return this;
}
function bb_world_new11(){
	bb_world_new5.call(this);
	return this;
}
bb_world_Collectable.prototype.bbm_Update2=function(){
	var bbt_boundOffset=200.0;
	if(this.bb_x<bb_main_wm.bb_leftBound-bbt_boundOffset || this.bb_x>bb_main_wm.bb_rightBound+bbt_boundOffset || this.bb_y<bb_main_wm.bb_topBound-bbt_boundOffset || this.bb_y>bb_main_wm.bb_bottomBound+bbt_boundOffset){
		bb_main_zom.bbm_Remove(this.bb_body);
		bb_main_wm.bbm_RemoveCollectable(this);
	}
	bb_world_Orb.prototype.bbm_Update2.call(this);
}
bb_world_Collectable.prototype.bbm_Collect2=function(bbt_e){
	bb_main_zom.bbm_Remove(this.bb_body);
	bbt_e.bbm_Collect(this);
	var bbt_flingNum=0;
	bbt_flingNum=50;
	for(var bbt_i=1;bbt_i<=bbt_flingNum;bbt_i=bbt_i+1){
		var bbt_directionOffset=bb_random_Rnd2(-1.0,1.0);
		bb_units_new5.call(new bb_units_FlingUnit,this.bb_x,this.bb_y,this.bb_z,bbt_e.bb_speed+bb_random_Rnd2(-3.0,3.0),(Math.atan2(this.bb_x-bbt_e.bb_x,this.bb_y-bbt_e.bb_y)*R2D)+bbt_directionOffset*90.0,bbt_directionOffset*1.5,bb_random_Rnd2(0.05,0.3),bb_random_Rnd2(5.0,8.0),200.0+bb_random_Rnd3(50.0),210.0,50.0);
	}
	bb_main_wm.bbm_RemoveCollectable(this);
}
bb_world_Collectable.prototype.bbm_CollisionCheck=function(bbt_e){
	if(Math.pow(bbt_e.bb_x-this.bb_x,2.0)+Math.pow(bbt_e.bb_y-this.bb_y,2.0)<Math.pow(bbt_e.bb_size,2.0)){
		this.bbm_Collect2(bbt_e);
	}
}
function bb_world_SineCollectable(){
	bb_world_Collectable.call(this);
	this.bb_direction=.0;
	this.bb_speed=.0;
	this.bb_wavespeed=.0;
	this.bb_amplitude=.0;
	this.bb_cyclePosition=.0;
	this.bb_baseX=.0;
	this.bb_baseY=.0;
}
bb_world_SineCollectable.prototype=extend_class(bb_world_Collectable);
function bb_world_new12(bbt_x,bbt_y,bbt_z,bbt_size,bbt_direction,bbt_speed,bbt_wavespeed,bbt_amplitude,bbt_cycleStart,bbt_r,bbt_g,bbt_b){
	bb_world_new10.call(this,bbt_x,bbt_y,bbt_z,bbt_size,bbt_r,bbt_g,bbt_b);
	this.bb_direction=bbt_direction;
	this.bb_speed=bbt_speed;
	this.bb_wavespeed=bbt_wavespeed;
	this.bb_amplitude=bbt_amplitude;
	this.bb_cyclePosition=bbt_cycleStart;
	this.bb_baseX=this.bb_x;
	this.bb_baseY=this.bb_y;
	return this;
}
function bb_world_new13(){
	bb_world_new11.call(this);
	return this;
}
bb_world_SineCollectable.prototype.bbm_Update2=function(){
	this.bb_baseX+=Math.sin((this.bb_direction)*D2R)*this.bb_speed;
	this.bb_baseY+=Math.cos((this.bb_direction)*D2R)*this.bb_speed;
	this.bb_cyclePosition+=this.bb_wavespeed;
	if(this.bb_cyclePosition>=360.0){
		this.bb_cyclePosition=this.bb_cyclePosition-360.0;
	}
	var bbt_cycleOffset=Math.sin((this.bb_cyclePosition)*D2R)*this.bb_amplitude;
	this.bb_x=this.bb_baseX+Math.sin((this.bb_direction+90.0)*D2R)*bbt_cycleOffset;
	this.bb_y=this.bb_baseY+Math.cos((this.bb_direction+90.0)*D2R)*bbt_cycleOffset;
	bb_world_Collectable.prototype.bbm_Update2.call(this);
}
function bb_math_Abs(bbt_x){
	if(bbt_x>=0){
		return bbt_x;
	}
	return -bbt_x;
}
function bb_math_Abs2(bbt_x){
	if(bbt_x>=0.0){
		return bbt_x;
	}
	return -bbt_x;
}
function bb_audio_StopChannel(bbt_channel){
	bb_audio_device.StopChannel(bbt_channel);
	return 0;
}
function bb_audio_PlaySound(bbt_sound,bbt_channel,bbt_flags){
	if((bbt_sound.bb_sample)!=null){
		bb_audio_device.PlaySample(bbt_sound.bb_sample,bbt_channel,bbt_flags);
	}
	return 0;
}
function bb_audio_SetChannelPan(bbt_channel,bbt_pan){
	bb_audio_device.SetPan(bbt_channel,bbt_pan);
	return 0;
}
function bb_audio_SetChannelRate(bbt_channel,bbt_rate){
	bb_audio_device.SetRate(bbt_channel,bbt_rate);
	return 0;
}
function bb_boxes_IntObject(){
	Object.call(this);
	this.bb_value=0;
}
function bb_boxes_new5(bbt_value){
	this.bb_value=bbt_value;
	return this;
}
function bb_boxes_new6(bbt_value){
	this.bb_value=((bbt_value)|0);
	return this;
}
function bb_boxes_new7(){
	return this;
}
function bb_collections_AbstractCollection(){
	Object.call(this);
}
function bb_collections_new(){
	return this;
}
bb_collections_AbstractCollection.prototype.bbm_ToArray=function(){
}
bb_collections_AbstractCollection.prototype.bbm_Add2=function(bbt_o){
}
function bb_collections_AbstractList(){
	bb_collections_AbstractCollection.call(this);
	this.bb_modCount=0;
}
bb_collections_AbstractList.prototype=extend_class(bb_collections_AbstractCollection);
function bb_collections_new2(){
	bb_collections_new.call(this);
	return this;
}
function bb_collections_ArrayList(){
	bb_collections_AbstractList.call(this);
	this.bb_elements=[];
	this.bb_size=0;
}
bb_collections_ArrayList.prototype=extend_class(bb_collections_AbstractList);
function bb_collections_new3(){
	bb_collections_new2.call(this);
	this.bb_elements=new_object_array(10);
	return this;
}
function bb_collections_new4(bbt_initialCapacity){
	bb_collections_new2.call(this);
	bb_assert_AssertGreaterThanOrEqualInt(bbt_initialCapacity,0,"ArrayList.New: Illegal Capacity:");
	this.bb_elements=new_object_array(bbt_initialCapacity);
	return this;
}
function bb_collections_new5(bbt_c){
	bb_collections_new2.call(this);
	this.bb_elements=bbt_c.bbm_ToArray();
	this.bb_size=this.bb_elements.length;
	return this;
}
bb_collections_ArrayList.prototype.bbm_EnsureCapacity=function(bbt_minCapacity){
	var bbt_oldCapacity=this.bb_elements.length;
	if(bbt_minCapacity>bbt_oldCapacity){
		var bbt_newCapacity=((bbt_oldCapacity*3/2)|0)+1;
		if(bbt_newCapacity<bbt_minCapacity){
			bbt_newCapacity=bbt_minCapacity;
		}
		this.bb_elements=resize_object_array(this.bb_elements,bbt_newCapacity);
		this.bb_modCount+=1;
	}
}
bb_collections_ArrayList.prototype.bbm_Add2=function(bbt_o){
	if(this.bb_size+1>this.bb_elements.length){
		this.bbm_EnsureCapacity(this.bb_size+1);
	}
	this.bb_elements[this.bb_size]=(bbt_o);
	this.bb_size+=1;
	this.bb_modCount+=1;
	return true;
}
bb_collections_ArrayList.prototype.bbm_ToArray=function(){
	var bbt_arr=new_object_array(this.bb_size);
	for(var bbt_i=0;bbt_i<this.bb_size;bbt_i=bbt_i+1){
		bbt_arr[bbt_i]=this.bb_elements[bbt_i];
	}
	return bbt_arr;
}
function bb_collections_IntArrayList(){
	bb_collections_ArrayList.call(this);
}
bb_collections_IntArrayList.prototype=extend_class(bb_collections_ArrayList);
function bb_collections_new6(){
	bb_collections_new3.call(this);
	return this;
}
function bb_assert_AssertGreaterThanOrEqualInt(bbt_val,bbt_expected,bbt_msg){
	if(bbt_val<bbt_expected){
		bb_assert_AssertError(bbt_msg+" "+String(bbt_val)+"<"+String(bbt_expected));
	}
}
function bb_sound_PlaySoundType(bbt_type){
	var bbt_selection=Math.floor(bb_random_Rnd2(0.0,(bb_sound_sfxRepo[bbt_type].length-1)));
	bb_sound_sfxRepo[bbt_type][((bbt_selection)|0)].bbm_Play(-1);
}
function bb_input_JoyHit(bbt_button,bbt_unit){
	return bb_input_device.KeyHit(bbt_button|bbt_unit<<4|256);
}
function bb_graphics_DrawCircle(bbt_x,bbt_y,bbt_r){
	bb_graphics_ValidateMatrix();
	bb_graphics_renderDevice.DrawOval(bbt_x-bbt_r,bbt_y-bbt_r,bbt_r*2.0,bbt_r*2.0);
	return 0;
}
function bb_input_JoyX(bbt_index,bbt_unit){
	return bb_input_device.JoyX(bbt_index|bbt_unit<<4);
}
function bb_input_JoyY(bbt_index,bbt_unit){
	return bb_input_device.JoyY(bbt_index|bbt_unit<<4);
}
function bbInit(){
	bb_graphics_context=null;
	bb_input_device=null;
	bb_audio_device=null;
	bb_app_device=null;
	bb_framework_game=null;
	bb_graphics_DefaultFlags=0;
	bb_graphics_renderDevice=null;
	bb_framework_DEVICE_WIDTH=0;
	bb_framework_DEVICE_HEIGHT=0;
	bb_framework_SCREEN_WIDTH=.0;
	bb_framework_SCREEN_HEIGHT=.0;
	bb_framework_SCREEN_WIDTH2=.0;
	bb_framework_SCREEN_HEIGHT2=.0;
	bb_framework_SCREENX_RATIO=1.0;
	bb_framework_SCREENY_RATIO=1.0;
	bb_random_Seed=1234;
	bb_framework_dt=null;
	bb_framework_MAX_PARTICLES=800;
	bb_framework_particles=new_object_array(bb_framework_MAX_PARTICLES);
	bb_framework_startTime=0;
	bb_framework_fpsCount=0;
	bb_framework_totalFPS=0;
	bb_framework_channel=0;
	bb_sound_sfxRepo=[];
	bb_framework_path="sounds/";
	bb_main_screens=[];
	bb_main_pm=null;
	bb_main_zom=null;
	bb_text_UnitCharLayout=[[65,36866],[66,46468],[67,72227],[68,46664],[69,82428],[70,82422],[71,72867],[72,66866],[73,83338],[74,75563],[75,66466],[76,22228],[77,88866],[78,68866],[79,36663],[80,46422],[81,36683],[82,46466],[83,72754],[84,83333],[85,66668],[86,66663],[87,66888],[88,66366],[89,66333],[90,85328],[97,45768],[98,22468],[99,17227],[100,55768],[101,13827],[102,32422],[103,17854],[104,22466],[105,31433],[106,31334],[107,26466],[108,43333],[109,18886],[110,14666],[111,13663],[112,13682],[113,13685],[114,12822],[115,17274],[116,33837],[117,16668],[118,16663],[119,16888],[120,16366],[121,16754],[122,18548],[48,36863],[49,34338],[50,36538],[51,45354],[52,66855],[53,82454],[54,72863],[55,85533],[56,76364],[57,76855],[32,11111],[46,11113],[33,77313],[63,75313],[44,11132],[39,33111],[59,13132],[58,13131],[43,13831],[45,11811],[42,16361],[47,55332],[34,66111],[61,18181],[95,11118],[40,53335],[41,23332],[60,53235],[62,23532]];
	bb_text_UnitCharCompression=[[false,false,false],[true,false,false],[false,true,false],[true,true,false],[false,false,true],[true,false,true],[false,true,true],[true,true,true]];
	bb_main_wm=null;
	bb_framework_playerChannelState=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
}
//${TRANSCODE_END}
