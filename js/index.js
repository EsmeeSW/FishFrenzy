/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 
///////////////////////////////////////////////////////////////////////////////////////////////////////
/// Insert animation Pause-Resume code (basically an external library function)
///////////////////////////////////////////////////////////////////////////////////////////////////////
/*!
 * Pause jQuery plugin v0.1
 *
 * Copyright 2010 by Tobia Conforto <tobia.conforto@gmail.com>
 *
 * Based on Pause-resume-animation jQuery plugin by Joe Weitzel
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or(at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
/* Changelog:
 *
 * 0.1    2010-06-13  Initial release
 */
(function() {
	var $ = jQuery,
		pauseId = 'jQuery.pause',
		uuid = 1,
		oldAnimate = $.fn.animate,
		anims = {};

	function now() { return new Date().getTime(); }

	$.fn.animate = function(prop, speed, easing, callback) {
		var optall = $.speed(speed, easing, callback);
		optall.complete = optall.old; // unwrap callback
		return this.each(function() {
			// check pauseId
			if (! this[pauseId])
				this[pauseId] = uuid++;
			// start animation
			var opt = $.extend({}, optall);
			oldAnimate.apply($(this), [prop, $.extend({}, opt)]);
			// store data
			anims[this[pauseId]] = {
				run: true,
				prop: prop,
				opt: opt,
				start: now(),
				done: 0
			};
		});
	};

	$.fn.pause = function() {
		return this.each(function() {
			// check pauseId
			if (! this[pauseId])
				this[pauseId] = uuid++;
			// fetch data
			var data = anims[this[pauseId]];
			if (data && data.run) {
				data.done += now() - data.start;
				if (data.done > data.opt.duration) {
					// remove stale entry
					delete anims[this[pauseId]];
				} else {
					// pause animation
					$(this).stop();
					data.run = false;
				}
			}
		});
	};

	$.fn.resume = function() {
		return this.each(function() {
			// check pauseId
			if (! this[pauseId])
				this[pauseId] = uuid++;
			// fetch data
			var data = anims[this[pauseId]];
			if (data && ! data.run) {
				// resume animation
				data.opt.duration -= data.done;
				data.done = 0;
				data.run = true;
				data.start = now();
				oldAnimate.apply($(this), [data.prop, $.extend({}, data.opt)]);
			}
		});
	};
})();
///////////////////////////////////////////////////////////////////////////////////////////////////////
/// End animation Pause-Resume code
///////////////////////////////////////////////////////////////////////////////////////////////////////
/// Start Drop-Down routine
///////////////////////////////////////////////////////////////////////////////////////////////////////

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
/*function mainMenu() {
    document.getElementById("menuDropdown").classList.toggle("show");
}*/

// Close the dropdown menu if the user clicks outside of it
/*window.onclick = function(event) {
  if (!event.target.className.match('mMenu')) {  //if (!event.target.matches('.mMenu')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  } else {
	  if (event.target.parentElement.childElementCount>1) {
		event.target.parentElement.children[1].classList.toggle("show");
	  } else {
		 event.target.parentElement.classList.toggle('show');
	  }	
  }
}
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
/// End Drop-Down routine
///////////////////////////////////////////////////////////////////////////////////////////////////////

 /*  TO DO LIST:
	-----------
----change to pre-deterministic / server-side catching
	=> X add 'pace' fish
	=> X create status array to be passed
	=> X store speed (+/- for direction) & pace fish x-location (with +/- to indicate direction) on each turn 
	=> X store 'pace' fish x-location on 'cast'
	=> X pause all fish 
	=> X calculate 'collision' i.e. if fish is caught on down or up
	=> X resume all fish 
	=> send hook to fish to catch
	
----add 'bait' 
	=> X 'worm' preferred by 'animal' type fish 
	=> X 'donut' preferred by legends, archer, doodle & bear prefer donut)
	=> X 'none' preferred by bonefish, fuzzball, fishsandwich
	
----try background again using tiles instead of stretch
-X--add bubbles
	
----improve buttons and menus and display

-X--add button controls '<' 'a' , '>' 'd' , 'v' 'space'
	

 */

			var hdSpeed = 2*1000;  //speed # msec to complete or #sec * 1000
			var huSpeed = 2*1000;  //speed # msec to complete or #sec * 1000
			var hEasing = "linear";
			var casting = false;
			var fishCaught = false; //
			//var furballPicture="https://lh6.googleusercontent.com/-PILAoRPF0-g/U7XJMwdO9gI/AAAAAAAAAKU/kR9uP7vEK4U/w426-h440/furball.png"; //"furball.png"
			var points = 0;
			var yposArr = new Array(); //an array of the location of each fish and the corresponding fish handle
			var fishCount = 12;
			var hookTop = 0;
			var lineHeight = 0;
			var paceTime = 10000;
			var constantFishSpeed = false;
//				var maxHookSpan = (gameInfo.fieldH - $("#fishingHook").height())-hookTop;
//				var maxLineSpan = (gameInfo.fieldH - $("#fishingLine").position(0).top - +$("#fishingLine").css("margin").split("px")[0])-lineHeight;
			
			var gameInfo = {"hookHeight":50, "hookTop":15, "hookX":30, "hookY":50, "lineHeight":25, "boatX":50, "hookDown":2000, "hookUp":2000, 
							"fieldW":500, "fieldH":500, "hookMaxY":435, "lineMaxY":435, "bait":"hook"}
			var fishInfo = {  //JSON object with all the specific fish information
				//fishname: mouthX/mouthY (x/y coordinates of mouth from fish centerpoint), mouthsize, junk (0=junk, 1=fish), 
				//          bkgndOffset (location of sprite in background image), width (width of fish image), 
				//			hook/worm/donutLike (%like for ea. type of hook option), 
				//			speed (swim time to cross with neg. meaning left), paceX (x location of pace fish)
				"DoodleFish":{"mouthX":-17, "mouthXL":17, "mouthXR":52, "mouthY":5, "mouthSize":10, "junk":1, "bkgndOffset":0, "width":69, 
							"hook":50, "worm":25, "donut":90, "ypos":100, "speed":0, "paceX":0},
				"FurBallFish":{"mouthX":0, "mouthXL":23, "mouthXR":23, "mouthY":0, "mouthSize":5, "junk":1, "bkgndOffset":-69, "width":46, 
							"hook":90, "worm":50, "donut":25, "ypos":100, "speed":0, "paceX":0},
				"LegendsFish":{"mouthX":-5, "mouthXL":21, "mouthXR":31, "mouthY":0, "mouthSize":5, "junk":1, "bkgndOffset":-115, "width":52, 
							"hook":25, "worm":25, "donut":90, "ypos":100, "speed":0, "paceX":0},
				"BoneFish":{"mouthX":-40, "mouthXL":6, "mouthXR":87, "mouthY":10, "mouthSize":10, "junk":1, "bkgndOffset":-167, "width":93, 
							"hook":90, "worm":70, "donut":30, "ypos":100, "speed":0, "paceX":0},
				"FishSandwich":{"mouthX":-23, "mouthXL":6, "mouthXR":52, "mouthY":5, "mouthSize":10, "junk":1, "bkgndOffset":-260, "width":58, 
							"hook":90, "worm":50, "donut":20, "ypos":100, "speed":0, "paceX":0},
				"ToddFish":{"mouthX":-40, "mouthXL":12, "mouthXR":92, "mouthY":15, "mouthSize":10, "junk":1, "bkgndOffset":-318, "width":104, 
							"hook":40, "worm":90, "donut":70, "ypos":100, "speed":0, "paceX":0},
				"DragonFish":{"mouthX":-27, "mouthXL":27, "mouthXR":81, "mouthY":5, "mouthSize":10, "junk":1, "bkgndOffset":-422, "width":108, 
							"hook":30, "worm":70, "donut":90, "ypos":100, "speed":0, "paceX":0},
				"ChameleonFish":{"mouthX":-25, "mouthXL":10, "mouthXR":60, "mouthY":10, "mouthSize":10, "junk":1, "bkgndOffset":-530, "width":70, 
							"hook":30, "worm":90, "donut":50, "ypos":100, "speed":0, "paceX":0},
				"BoarFish":{"mouthX":-18, "mouthXL":17, "mouthXR":53, "mouthY":5, "mouthSize":5, "junk":1, "bkgndOffset":-600, "width":70, 
							"hook":30, "worm":50, "donut":90, "ypos":100, "speed":0, "paceX":0},
				"ArcherFish" :{"mouthX":-27, "mouthXL":3, "mouthXR":57, "mouthY":5, "mouthSize":5, "junk":1, "bkgndOffset":-670, "width":60, 
							"hook":30, "worm":50, "donut":90, "ypos":100, "speed":0, "paceX":0},
				"BearacudaFish":{"mouthX":-30, "mouthXL":5, "mouthXR":65, "mouthY":5, "mouthSize":5, "junk":1, "bkgndOffset":-730, "width":70, 
							"hook":50, "worm":90, "donut":50, "ypos":100, "speed":0, "paceX":0},
				"Tire":{"mouthX":0, "mouthXL":22, "mouthXR":22, "mouthY":0, "mouthSize":20, "junk":0, "bkgndOffset":-800, "width":44, 
							"hook":100, "worm":100, "donut":100, "ypos":100, "speed":0, "paceX":0},
				"Boot":{"mouthX":-12, "mouthXL":20, "mouthXR":44, "mouthY":12, "mouthSize":15, "junk":0, "bkgndOffset":-844, "width":64, 
							"hook":100, "worm":100, "donut":100, "ypos":100, "speed":0, "paceX":0},
				"Pace":{"speed":-10000, "width":50, "paceX":0, "bait":"hook"}
			};


			function initializeFish(){
				var ypos = 0;
				var i = 0;
				//	$('#FishLoc')[0].value = ""; //erase Fish Location string from 'FishingForm'
					$('#pointBox').html(0);  //set score to 0
					$('.fish').each(function(i, obj) { //for each of the fish images referenced as "obj"
						fish=$(obj);
						fish.stop(); //make sure to stop any previous animations
//						ypos = (Math.random()*0.8+0.2)*($('#Field').height()-$(obj).height());
						ypos = (Math.random()*0.8+0.2)*(gameInfo.fieldH-fish.height());
						fish.css({left:Math.random()*gameInfo.fieldW, top:ypos});
						yposArr[i]=[ypos+ fish.height()/2 +fish.attr('mouthY'), fish];
						fishInfo[fish.attr("id")].ypos=ypos;
				//		$('#FishLoc')[0].value = $('#FishLoc')[0].value + ypos.toPrecision(6)+'&#%0.00000&#%'; //ascii string array passed using 'FishingForm'
						start_fish(fish); //call the start_fish function (decared below)
						thisFish=fishInfo[fish[0].id];
						thisFish.fishXactD=0;
						thisFish.fishXactU=0;
					});
					fishCount=yposArr.length;
					sort(yposArr); //sortArray(yposArr);
					//$('#Pace').css({"background-Position": "100px 0px"});
					fish=$('#Pace')
					fish.attr("fishspeed", -paceTime).css({left:(gameInfo.fieldW - fishInfo.Pace.width)});
					fish.animate({left: "0px"}, paceTime, "linear", function(){paceRight(fish);} );
			//		$('#FishLoc')[0].value = $('#FishLoc')[0].value + 'Pace';  //ascii string array passed using 'FishingForm'
					
				}
			
			function bubbleStream(maxNumber, x, y) {
				var b,c,i,n, s,t,xx;
				//decide how many to start
				n=Math.floor(Math.random()*maxNumber)+1;
				//for loop
				t=0;
				xx=Math.floor((x*gameInfo.fieldW+100*(Math.random()-.5)));
				for (i=1; i<=n; i++) {
					//create bubble object //<img id="bb1-1" class="bubble" style="left:103px;top:440px;z-index:-1" src="img/bubble.png">
					c='<img src="img/bubble.png" style="left:'+xx+'px;top:'+y+'px;display:none;position:absolute">';
					b=$(c).appendTo($('#bubbles')); //appendTo($('#bubbles'));
					//call timeout-call disolve in - call bubbling
					s=Math.floor(700*Math.random()+500); //travelTime for bubble //time_range * Math.random() + min_time;
					t+=Math.floor(500*Math.random()+100); //time till next bubble //time_range * Math.random() + min_time;
					bubbleStart(b,s,t); //setTimeout(function(){b.fadeTo(300,.8,function(){bubbling(b,s);});},t);
				}
				//settimeout call bubbles
				t=Math.floor(20000*Math.random()+5000); //time to next bubble stream //time_range * Math.random() + min_time;
				setTimeout(function(){bubbleStream(maxNumber,x,y);},t);
			}
			
			function bubbleStart(b,s,t) {
					setTimeout(function(){b.fadeTo(100,.8,function(){bubbling(b,s);});},t);
			}
			
			function bubbling(bubble,travelTime)	{
				//if disolved away then create new
				//	new set of arrBubbles
				//  new travelTime
				if (parseInt(bubble.css("top"))<100) {
					//disolve away
					bubble.animate({top:"65px"},travelTime,"linear",function(){bubble.fadeOut(500,function(){bubble.remove();});});
				}else{
					//float up
					x=Math.floor(30*(Math.random()-0.5));//maxShift*2*(Math.random()-0.5);
					bubble.animate({left:"+="+x+"px",top:"-=50px"},travelTime,"linear", function(){bubbling(bubble,travelTime);});
				}
			}
				
			function markAllFish(){//intended to take a 'snap shot' of all the fish  
				//var i = 0;
				//	for (i=0; i<yposArr.length; i++) { //for each fish index "i" and ref as "obj"
				//		yposArr[i][1].stop(); //make sure to stop any previous animations
				//		//need to take snapshot of direction, x-position, speed, and y-position
				//		yposArr[i][2]=1;
				//	};
				$('.fish').each(function(i,obj) { //for each fish
					var thisFish = $(obj);
					//fishI=fishInfo[thisFish[0].id];
					//fishI.speed = $(obj).attr("fishspeed");
					//fishI.fishX = thisFish.position(0).left;
					fishInfo[thisFish[0].id].fishX = thisFish.position(0).left;
					});
				
				}
				
				
			function sort(Array2sort){ //original sorting algorithm find smallest and move to first spot, find next smallest ...
				var temp = new Array();
				var nextMinVal, nextMinIndex, i, j;
				for (i=0; i<Array2sort.length; i++) {
					nextMinVal = Array2sort[i][0];
					nextMinIndex = i;
					for (j=i+1; j<Array2sort.length; j++) {
						if ( Array2sort[j][0]<nextMinVal) {
							nextMinVal = Array2sort[j][0];
							nextMinIndex = j;
						}
					}
					temp = Array2sort[i];
					Array2sort[i]=Array2sort[nextMinIndex];
					Array2sort[nextMinIndex] = temp;
				}
			}
			
			function sortArray(Array2sort) {  //improved sorting - look @ index n and insert in sorted elements 0:(n-1)
				var ll, ul, i;
				for (index=1; index<Array2sort.length; index++) {
					//////////////////////////////////////  BINARY SEARCH attempt #1 ///////////////////////
					ll=0;
					ul=index;
					i=ceil(index/2);
					while (i!=ul) {
						if (Array2sort[index][0] >Array2sort[i][0]) {
								ll=i;
								i=ceil((ul+i)/2);
							}
							/////////// this isn't needed since very unlikely to hit exact /////////////////
							///////////   and very likely just adding many more compares   /////////////////
							//	else if (Array2sort[index][0] =Array2sort[i][0]){
							//			ul=i;
							//		}
						else {
								ul=i;
								i=floor((i+ll)/2);
							}
					}
					/////////////////////////////////////////////////////////////////////////////////////////
					////////////////////////////////   Simple Iteration Search   ////////////////////////////
					//var i=-1;
					//while (eval(Array2sort[index][0])>eval(Array2sort[++i][0])) { //replace with binary search to further improve
					//}
					/////////////////////////////////////////////////////////////////////////////////////////
					if (i<index) { 
	//					Array2sort = Array2sort.slice(0,i).concat(Array2sort.splice(index,1).concat(Array2sort.slice(i)));
						Array2sort.splice(i,0,Array2sort.splice(index,1)[0]);
					}
				}
			}

			function newFishSpeed() { //calculate random speed for fish to swim
				//var fieldWidth = $("#Field").width();
				//var minSpeed = 0.2; //minimun fish speed (pixels/msec) 0.2 is slow
				//var maxSpeed = 0.7; // maximum fish speed (pixels/msec) 0.5 is moderate
				//return(Math.floor(fieldWidth*(1/minSpeed + (1/maxSpeed - 1/minSpeed)*Math.random())));
				var minTime = 1.5; //(msec/pixel) 1.5 is moderately fast
				var maxTime = 5;   //(msec/pixel) 5 is slow
				return (Math.floor(gameInfo.fieldW*(minTime + (maxTime - minTime)*Math.random())));
			}
			
			function start_fish(this_fish){ //declare the start_fish function, accept a fish obj as input and initiate it swimming.
				
					var maxWidth = (gameInfo.fieldW - $(this_fish).width()); //maximum movement is the edge of the "Field"
					var xpos = maxWidth; //need to add 0 for fish going left //Math.floor(Math.random() * maxwidth) + 1; //get a random x position to move to within the "Field"
					var speed = newFishSpeed(); //(2000+2000*Math.random());//(4000-$(this_fish).position(0).top*(7*Math.random())); //Math.floor(Math.random() * 1500) + 750; //selects a random speed between 3/4 second and 1 1/2 seconds (values are in miliseconds)
					var bkgndX = this_fish.css("background-Position").split("px")[0] ;
					this_fish.stop();
					var fishLeft = this_fish.position(0).left;
					if ((Math.random()>=0.5)||(fishLeft>=maxWidth)){ //random swim left or right unless already at max right
						xpos=0;
						//this_fish.css({"background-Position": bkgndX + "px 0px"}).attr("fishspeed",-speed); //.split("px")[0] +"px 0px"});
						this_fish.removeClass('swimRight').addClass('swimLeft');
						fishInfo[this_fish.attr("id")].speed=-speed;
	//					$('#FishLoc')[0].value = $('#FishLoc')[0].value + '-' + speed.toPrecision(6)+'$#@';
						speed*=(fishLeft/maxWidth);
						this_fish.animate({left: xpos+"px"}, speed, "linear", function(){swimRight(this_fish);} );
					}else{
						//this_fish.css({"background-Position": bkgndX + "px -50px"});//.attr("fishspeed",speed); //.split("px")[0] +"px -50px"});
						this_fish.removeClass('swimLeft').addClass('swimRight');
						fishInfo[this_fish.attr("id")].speed=speed;
	//					$('#FishLoc')[0].value = $('#FishLoc')[0].value + speed.toPrecision(7)+'$#@';
						speed*=(1-fishLeft/maxWidth);
						if (speed<0) throw "speed <0";
						this_fish.animate({left: xpos+"px"}, speed, "linear", function(){swimLeft(this_fish);} );
					}
					//this_fish.animate({left: xpos+"px"}, speed, "linear", function(){swim_fish(this_fish);} );
				}
			
			function swim_fish(this_fish) {  //recursively called to make fish (this_fish) continue to swim (i.e. flip and go to other end)
					var xpos=0;
					var fishName = this_fish[0].id; //this_fish.attr("id");
					var fishI = fishInfo[fishName];   //fishInfo[this_fish.attr("id")];
					if (casting || (fishName == 'Pace') || constantFishSpeed) { //force fish to keep their speed the same during casting
	//					++xpos;
						fishI.speed *= -1; 
					}else{
						fishI.speed = -Math.sign(fishI.speed)*newFishSpeed();//selects a random speed between 3/4 second and 1 1/2 seconds (values are in miliseconds)
					} 
					if (fishI.speed<0){ //i.e. new speed is negative and hence will now go to the left 
						this_fish.css({"background-Position": fishI.bkgndOffset + "px 0px"}); 
					}else{
						this_fish.css({"background-Position": fishI.bkgndOffset + "px -50px"}); 
						xpos= (gameInfo.fieldW - fishI.width); // maxwidth;
					}
					this_fish.animate({left: xpos+"px"}, Math.abs(fishI.speed), "linear", function(){swim_fish(this_fish);} );
			}

			function swimLeft(this_fish) {  //recursively called to make fish (this_fish) continue to swim (i.e. flip and go to other end)
					this_fish.removeClass("swimRight").addClass("swimLeft").animate({left: "-50px"}, newFishSpeed(), "linear", function(){swimRight(this_fish);} );
			}
			function swimRight(this_fish) {  //recursively called to make fish (this_fish) continue to swim (i.e. flip and go to other end)
					this_fish.removeClass("swimLeft").addClass("swimRight").animate({left: gameInfo.fieldW+"px"}, newFishSpeed(), "linear", function(){swimLeft(this_fish);} );
			}
			function paceLeft(this_fish) {  //recursively called to make fish (this_fish) continue to swim (i.e. flip and go to other end)
					this_fish.animate({left: "0px"}, newFishSpeed(), "linear", function(){paceRight(this_fish);} );
			}
			function paceRight(this_fish) {  //recursively called to make fish (this_fish) continue to swim (i.e. flip and go to other end)
					this_fish.animate({left: "100px"}, newFishSpeed(), "linear", function(){paceLeft(this_fish);} );
			}

			
			var caughtFish={};
			
			function sendFish() {  //grab fish data and 'send' it to check if fishing will be successful
				var gameInfo = {"fieldWidth":$("#Field").width(), "fieldHeight":$("#Field").height(), 
								"hookX":($("#fishingHook").position(0).left+ $('#fishingHook').width()/3), 
								"hookDown":hdSpeed, "hookUp":huSpeed, "bait":fishInfo.Pace.bait,
								"paceX":(Math.sign(fishInfo.Pace.speed)*$('#Pace').position(0).left), 
								"paceWidth":fishInfo.Pace.width, "paceSpeed":fishInfo.Pace.speed };
				markAllFish();
				fishInfo.Pace.paceX = gameInfo.paceX; //$('#Pace').position(0).left;
				fishInfo.Pace.hookX = gameInfo.hookX; //$('#fishingHook').position(0).left + $('#fishingHook').width/3;
	//			$('#FishPace')[0].value = fishInfo.Pace.paceX.toPrecision(6) + '&#%' 
	//						+ fishInfo.Pace.hookX.toPrecision(6) + '$#@';
				
				/////// this is where you call the did I catch something, which could be on the server-side
				caughtFish = fishingResult(JSON.stringify(fishInfo), JSON.stringify(gameInfo));
				//animate hook to fish location (or bottom and then up to fish location)
				//reel fish in
			}	
			
			function fishingResult(fishInfoString, gameInfoString) { //check if a fish is caught and return fish and direction (server-side)
				var fishSnapShot = JSON.parse(fishInfoString);
				var game = JSON.parse(gameInfoString);
				var pX, fX, fSpeed;
				var caught = {"fish":"pace", "yDist":2*game.fieldHeight, "upDown":"up"};
				
				for (var fish in fishSnapShot) { //check each fish
//var fish = fishSnapShot.DoodleFish;
					if ((fishSnapShot[fish].ypos < caught.yDist)&&(fishSnapShot[fish].ypos>0)) { //ignore if closer fish will be caught or this fish is already caught
					//	pX = game.paceX - fishSnapShot[fish].paceX;  //calculate how far pace fish swam
					//	if (pX<0) {  //pace fish must have hit left wall and turned around
					//		pX+=2*(game.fieldWidth-game.paceWidth);
					//	}
						fSpeed = fishSnapShot[fish].speed;
					//	fX = pX*Math.abs(game.paceSpeed)/fSpeed;  //how far did this fish swim from edge
					//	if (fSpeed<0) { //if going left then position is field width - swim distance
					//		fX+=game.fieldWidth-fishSnapShot[fish].width;
					//	}
//this is error check for fish location
//fish.concat(": actual=", $("#"+fish).position(0).left, ", calc=", fX, ", diff=", $("#"+fish).position(0).left-fX)

						//next predict fish position when hook comes down to its height
						//fX += fishSnapShot[fish].ypos*game.hookDown*game.fieldWidth/game.fieldHeight/fSpeed;
						fX = fishSnapShot[fish].fishX+ fishSnapShot[fish].ypos*game.hookDown*game.fieldWidth/game.fieldHeight/fSpeed;
						if (fX<0) {  //fish hit left wall so flip it around
							fX*=-1;
							fSpeed*=-1;
						}else if (fX>(game.fieldWidth-fishSnapShot[fish].width)) {  //fish hit right wall so flip it around
							fX = 2*(game.fieldWidth-fishSnapShot[fish].width) - fX;
							fSpeed*=-1;
						}
//debug info/test
fishInfo[fish].fishXPredictD=fX;
						//now check if hook catches fish
						if (Math.abs(game.hookX-fX)<(fishSnapShot[fish].mouthSize*fish[game.bait.concat("Like")])) {
							caught.fish=fish;
							caught.yDist = fishSnapShot[fish].ypos;
							caught.upDown = "Down";
						}
						//only check if hook catches on way up if closer fish will not be caught
						if ((2*game.fieldHeight-fishSnapShot[fish].ypos)<caught.yDist) {
							//check if caught on way up
							fX += (game.fieldHeight-fishSnapShot[fish].ypos)/game.fieldHeight*(game.hookDown+game.hookUp)*game.fieldWidth/fSpeed;
							if (fX<0) { //hit left wall; flip
								fX*=-1;
								//fSpeed*=-1;
							}else if (fX>game.fieldWidth) { //hit right wall; flip
								fX = 2*(game.fieldWidth - fishSnapShot[fish].width)- fX;
								//fSpeed*=-1;
							}
							//did it get caught on way up?
//debug info/test
fishInfo[fish].fishXPredictU=fX;
							if (Math.abs(game.hookX-fX)<(fishSnapShot[fish].mouthSize*fish[game.bait.concat("Like")])) {
								caught.fish=fish;
								caught.yDist = 2*game.fieldHeight-fishSnapShot[fish].ypos;
								caught.upDown = "Up";
							}
							
						}
					}
				}
				return (caught)
			}
			
			function cast(){ //start fishing
					if (!casting) {
						throwFishBack();
						//$(".fish,.pacefish").pause();
						//sendFish();
						//$(".fish,.pacefish").resume();
//						hookTop = $('#fishingHook').position(0).top;
//						lineHeight = $('#fishingLine').height();
						castHookLine(-1);
						$('#message').html("Good Luck."); //change the html of the message div
					}
			}
			
			function castHookLine(count) { //-1 is start
	//			var maxHookSpan = (gameInfo.fieldH - gameInfo.hookHeight - gameInfo.hookTop); //$("#fishingHook").height())-hookTop;
	//			var maxLineSpan = (gameInfo.fieldH - 65); //- $("#fishingLine").position(0).top - +$("#fishingLine").css("margin").split("px")[0])-lineHeight;
				var nowHookTop = - gameInfo.hookHeight; //$("#fishingHook").position(0).top;
				var nowLineHeight = - 50; //$("#fishingLine").height();
				var newHookTop = - gameInfo.hookHeight; //$("#fishingHook").height();
				var newLineHeight = - 50; //$("#fishingLine").position(0).top - 25;
				
	//			$(".fish,.pacefish").pause();
				casting = true; 
				//$('#FishPace')[0].value = $('#Pace').position(0).left.toPrecision(6) + '&#%' 
				//							+ ($('#fishingHook').position(0).left + $('#fishingHook').width/3).toPrecision(6) + '$#@';
				//the sequence is count 0 goes from boat to fish 0, ..., count n goes from last fish to bottom, 
				//   n+1 is from bottom to nth fish (index n-1), ..., count n+n goes to first fish (index 0), count 2n+1 goes back to boat
					
			//		fishIndex = count-1; //set fishIndex to match fish location in array
			//		if (count>fishCount) { //if hook coming back up - recalc location in array
			//				fishIndex = 2*fishCount-count+1;
			//		}
		/*			if ((count>0)&&(count!=fishCount+1)&&(count<=(2*fishCount+1))) {
						if(count>fishCount) {
							fishIndex = 2*fishCount-count+1;
			//				thisFish=$(yposArr[fishIndex][1]);
			//				fishInfo[thisFish[0].id].fishXactU=thisFish.position(0).left;
						} else {
							fishIndex = count-1;
			//				thisFish=$(yposArr[fishIndex][1]);
			//				fishInfo[thisFish[0].id].fishXactD=thisFish.position(0).left;
						}
						fishCaught = fishing(gameInfo.hookTop, gameInfo.lineHeight, yposArr[fishIndex][1]);
						if (fishCaught==false) {
						} else {
							//DoneFishing
	//						$(".fish,.pacefish").resume();
							return;
						}
					}
	*/
	//				while (((count<fishCount)&&(yposArr[count][0]<0)) || ((count>fishCount)&&(count<(2*fishCount)+1)&&(yposArr[2*fishCount-count][0]<0))) {
	//					count++;
	//				}
					if (count < fishCount) { //hook going down
						//check fish if not 1st time in
						if (count>=0) {
							fishCaught = fishing(gameInfo.hookTop, gameInfo.lineHeight, yposArr[count][1]);
							if (fishCaught!=false) {return;} //if fish is caught then exit
							nowHookTop += +yposArr[count][0];
							nowLineHeight += +yposArr[count][0];
						}else{ //starting @ top
							nowHookTop = gameInfo.hookTop;
							nowLineHeight = gameInfo.lineHeight;
						}
						//move hook down to next fish
						if (++count<fishCount) {
							newHookTop += +yposArr[count][0];
							newLineHeight += +yposArr[count][0];
							newSpeed = hdSpeed*(newHookTop - nowHookTop)/gameInfo.hookMaxY; //maxHookSpan;
							$("#fishingHook").animate({top: newHookTop+"px"}, newSpeed, hEasing);
							$("#fishingLine").animate({height: newLineHeight+"px"}, newSpeed, hEasing, function(){castHookLine(count);});
						}else{ //going to sea floor next
							newHookTop = gameInfo.hookTop+gameInfo.hookMaxY-25; //maxHookSpan;
							newLineHeight = lineHeight + gameInfo.lineMaxY-25; //maxLineSpan;
							newSpeed = (newHookTop - nowHookTop)/gameInfo.hookMaxY; //maxHookSpan;
							$("#fishingHook").animate({top: newHookTop+"px"}, hdSpeed*newSpeed, hEasing, function(){
								$("#fishingHook").animate({top: nowHookTop+"px"}, huSpeed*newSpeed, hEasing);});
							$("#fishingLine").animate({height: newLineHeight+"px"}, hdSpeed*newSpeed, hEasing, function(){
								$("#fishingLine").animate({height: nowLineHeight+"px"}, huSpeed*newSpeed, hEasing, function(){castHookLine(count);});});
						}
//						newSpeed = hdSpeed*(newHookTop - nowHookTop)/gameInfo.hookMaxY; //maxHookSpan;
//					} else if (count== fishCount){
//								//move hook to bottom
//								newHookTop = gameInfo.hookTop+gameInfo.hookMaxY; //maxHookSpan;
//								newLineHeight = lineHeight + gameInfo.lineMaxY; //maxLineSpan;
//								newSpeed = hdSpeed*(newHookTop - nowHookTop)/gameInfo.hookMaxY; //maxHookSpan;
					} else { //if ((count>fishCount)&&(count < ((2*fishCount)+1))) {
						//hook coming back up
						fishIndex=2*fishCount-count-1;
						fishCaught = fishing(gameInfo.hookTop, gameInfo.lineHeight, yposArr[fishIndex][1]);
						if (fishCaught!=false) {return;} //if fish is caught then exit
						nowHookTop += +yposArr[fishIndex][0];
						nowLineHeight += +yposArr[fishIndex][0];
						//move hook UP to next fish
						if (--fishIndex>=0) {
							newHookTop += +yposArr[fishIndex][0];
							newLineHeight += +yposArr[fishIndex][0];
							newSpeed = huSpeed*(nowHookTop - newHookTop)/gameInfo.hookMaxY; //maxHookSpan;
							$("#fishingHook").animate({top: newHookTop+"px"}, newSpeed, hEasing);
							$("#fishingLine").animate({height: newLineHeight+"px"}, newSpeed, hEasing, function(){castHookLine(++count);});
						} else { // if (count == (2*fishCount +1)) {
							//return hook to original location
							newHookTop = gameInfo.hookTop;
							newLineHeight = gameInfo.lineHeight;
							newSpeed = huSpeed*(nowHookTop - newHookTop)/gameInfo.hookMaxY; //maxHookSpan;
							$("#fishingHook").animate({top: newHookTop+"px"}, newSpeed, hEasing);
							$("#fishingLine").animate({height: newLineHeight+"px"}, newSpeed, hEasing, function(){casting=false;});
						}
//					} else if (count>(2*fishCount+1)) {
	//							casting = false;
		//						return;
								//error??
					}
							
	//					$(".fish,.pacefish").resume();
					//if (casting) {
					//		$("#fishingHook").animate({top: newHookTop+"px"}, newSpeed, hEasing);
					//		$("#fishingLine").animate({height: newLineHeight+"px"}, newSpeed, hEasing, function(){castHookLine(count+1);});
					//}			
			}
			
			function fishing(hTop, lHeight, obj){ //function to check if we caught this fish
				var count=0;
				var fish=$(obj);
				var fInfo=fishInfo[obj[0].id];
				var mouthXlocation = +fish.position(0).left; // + fish.width()/2;
				if (fish.css("background-Position").split("px")[1]==0)  //is fish LEFT facing?
					{mouthXlocation += fInfo.mouthXL;} //+fInfo.mouthX;} //fish.attr('mouthX');} //facing left
				else
					{mouthXlocation += fInfo.mouthXR;} //-= +fInfo.mouthX;} //fish.attr('mouthX');} //facing right
				var hookXlocation = $("#fishingHook").position(0).left + gameInfo.hookX; //+$("#fishingHook").attr('mouthX')+;
				baitFactor=fInfo[gameInfo.bait]/100;
				if ((fishCaught==false)&&(Math.abs(mouthXlocation-hookXlocation) <= fInfo.mouthSize*baitFactor)) //$(obj).attr('mouthSize'))) //caught a fish!
				{  //caught so reel it in
					fishCaught = obj; //set return obj to the caught fish
				  fish.stop();	//stop fish swim animation
				  $(".boat").stop();//stop hook animation
				  fish.animate({left: "+=0", top: hTop + $(obj).position(0).top - $('#fishingHook').position(0).top}, huSpeed);//send fish up to boat
				  $("#fishingHook").animate({top: hTop},huSpeed);//send hook directly back to boat
				  $("#fishingLine").animate({height: lHeight}, huSpeed, function(){doneFishing();} ); //recoil line and then call 'doneFishing'
				}
				return(fishCaught); //send the result back 
			}
			
			
			function doneFishing(){
				var pointTxt="";
				window.clearInterval(casting);
				casting = false;
				if (fishCaught){
					if ($(fishCaught).attr('junk')==0){
						points=0;
						pointTxt=". Sorry you lost all your points.";
						$('#pointBox').html(0);
					}else{
						points = Math.floor(100*(1+Math.random())/$(fishCaught).attr('mouthSize'));
						pointTxt=" worth "+points+" points!";
						$('#pointBox').html(+$('#pointBox').html() + points);
					}
					$('#message').html('You caught a '+($(fishCaught).attr('id'))+pointTxt); //change the html of the message div
				}else{
					$('#message').html("Sorry, you didn't catch a fish.  Try again."); //change the html of the message div
				}
			}
			
			function throwFishBack(){  //this will check if a fish is caught and put it back in the pool if so.
				if (fishCaught) {
		//			var ypos=-1000;
					if ($(fishCaught).attr('junk')==0) {
						ypos=Math.random()*200+100;
						$(fishCaught).css({left:Math.random()*700, top:ypos});
						start_fish($(fishCaught)); //call the start_fish function (decared below)
						for (i=0; i<fishCount; i++) {
							if (yposArr[i][1]==fishCaught) {
								yposArr[i][0]=ypos+ $(fishCaught).height()/2 +$(fishCaught).attr('mouthY');
								i=fishCount;
							}
						}
						sort(yposArr); //sortArray(yposArr);
					}else{ 
							$(fishCaught).css({left:-1000});//just hide it off the screen to the left
							//fishInfo[$(fishCaught)[0].id].ypos=-1;
					}
		//			for (i=0; i<fishCount; i++) {
		//				if (yposArr[i][1]==fishCaught) {
		//					yposArr[i][0]=ypos+ $(fishCaught).height()/2 +$(fishCaught).attr('mouthY');
		//					i=fishCount;
		//				}
		//			}
		//			sort(yposArr); //sortArray(yposArr);
					fishCaught=false;
				}
			}

			function boatLeft() { //move boat left
					if (!casting) {
						var stepSize = 50;
						throwFishBack();
						bb=$('.boat');
						if (bb.position(0).left > stepSize) {
							bb.animate({left:"-="+stepSize+"px"},1);
						}else{
							bb.animate({left:"0px"},1);
						}
					}
				}

			function boatRight() { //move boat right...
					if (!casting) {
						var stepSize = 50;
						throwFishBack();
						bb=$('.boat');
						if ((bb.position(0).left + $('#fishingPlayer').width()) < (gameInfo.fieldW - stepSize)) {
							bb.animate({left:"+="+stepSize+"px"},1);
						}else{
							bb.animate({left:""+(gameInfo.fieldW-$('#fishingPlayer').width())+"px"},1);
						}
					}
				}

			function fieldWidth(ww) {
				var fWidth=500;
				var scoreSize="24px";
				var titleSize="36px";
				if (ww=="field-width-init") {
					ww=window.innerWidth;
					if (ww>500) {
						if (ww>1000) {
							ww="field-width-wide";
						} else {
							ww="field-width-med";
						}
					} else {
						ww="field-width-narrow";
					}
				}
				switch (ww) {
					case "field-width-narrow": //300:
						fWidth=300;
						idname="#field-width-narrow";
						break;
					case "field-width-med": //500:
						fWidth=500;
						idname="#field-width-med";
						break;
					case "field-width-wide": //1000:
						fWidth=1000;
						idname="#field-width-wide";
						break;
					case "field-width-auto":
					case "field-width-custom":
					default:
						fWidth=window.innerWidth-20;
						idname="#field-width-custom";
						break;
				}
				scoreLeft=fWidth-100;
				if (fWidth<500) {
					titleSize="16px";
					scoreSize="14px";
					scoreLeft=fWidth-70;
				}
				gameInfo.fieldW=fWidth;
				$('#Field').width(fWidth);
				$('#message').width(fWidth);
				$('#Title').width(fWidth).css({"font-size":titleSize}); //$('#Title').css({left:(ww/2-100)});
				$('#Score').css({left:scoreLeft, "font-size":scoreSize});
				$('#rightBoatButton').css({left:(fWidth-75)});
				$('.field-width').removeClass("selected");
				$(idname).addClass("selected");
			}
			
			function changeWeight(weightIndex) {
			var fast = 1*1000;  //speed # msec to complete or #sec * 1000
			var medium = 2*1000;  //speed # msec to complete or #sec * 1000
			var slow = 3*1000;  //speed # msec to complete or #sec * 1000
				$('.weight').removeClass("selected");
				switch ($(weightIndex)[0].id){
					case "weight-light":  //1:  //Light
						hdSpeed = slow;
						huSpeed = fast;
			//			$('#FishOpt')[0].value = 'L' + $('#FishOpt')[0].value.slice(1); 
						idname="#weight-light";
						break;
					case "weight-heavy":  //3:  //Heavy
						hdSpeed = fast;
						huSpeed = slow;
			//			$('#FishOpt')[0].value = 'H' + $('#FishOpt')[0].value.slice(1); 
						idname="#weight-heavy";
						break;
					case "weight-med": //2:  //Medium (default)
					default:
						hdSpeed = medium;
						huSpeed = medium;
			//			$('#FishOpt')[0].value = 'M' + $('#FishOpt')[0].value.slice(1); 
						idname="#weight-med";
						break;
				}
				$(idname).addClass("selected");
			}
			
var baitOption={"hook":{"sourcefile":"img/hook.png", "index":1},
				"worm":{"sourcefile":"img/worm.gif", "index":2},
				"donut":{"sourcefile":"img/donut.png", "index":3}};
			function changeBait(bait) {
				//change the bait 1=Hook, 2=Worm, 3=Donut
//				var baitOption=[{"type":"hook", "sourcefile":"img/hook.png", "index":1},
//								{"type":"worm", "sourcefile":"img/worm.gif", "index":2},
//								{"type":"donut", "sourcefile":"img/donut.png", "index":3}];
				baitIndex=bait.id;
				$('#fishingHook').attr({'src': baitOption[baitIndex].sourcefile, 'hookType':baitIndex});
				//$('#FishOpt')[0].value = $('#FishOpt')[0].value.slice(0,1)+baitOption[baitIndex].index; 
				fishInfo.Pace.bait=baitIndex;
				gameInfo.bait=baitIndex;
				//update menu
				$('.bait').removeClass("selected");
				idname="#"+baitIndex;
				$(idname).addClass("selected");
			}
			
//			function distance(x1,y1,x2,y2) {
//				return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
//			}

//	I added my event listener events here...
			$(document).keyup(function(a){
				switch (a.which) {
					case 37: //'left arrow'
					case 65: //'A'
					case 97: //'a' 
						//boat left
						boatLeft();
						break;
					case 39:  //'right arrow'
					case 68:  //'D'
					case 100: //'d' 
						//boat right
						boatRight();
						break;
					case 32: //'space'
						//cast
						cast();
						break;
				}
			});
			
			$( document ).ready(function() { //when the page is done loading ...
				fieldWidth("field-width-init");
			//add bubble generator(s)
				bubbleStream(17,.25,480); //(max#bubbles@a_time, ~x-position as fraction of width, y-position)
				setTimeout(function(){bubbleStream(17,.75,480);},4000);  //start second generator after a few seconds
				// initialise the drop-down menus
				//runOnLoad(Dropdown.initialise);
				Dropdown.initialise;
				
				initializeFish();
				
				$("#reset").click(function(){ //initialize all the fish
					if (!casting) {
						initializeFish();
						fishCaught = false;
					}
				});
				
				$(".boat").click(function(){ //cast
					cast();
				});

				$("#startButton").click(function(){ //when startButton is clicked ...
					cast();
				});
				
				$("#leftBoatButton").click(function(){ //move boat left
					boatLeft();
				});

				$("#rightBoatButton").click(function(){ //move boat right
					boatRight();
				});
				
				$(".bait").click(function(){ //change bait selection
					changeBait(this);
				});

				$(".weight").click(function(){ //change bait selection
					changeWeight(this);
				});

				$(".field-width").click(function(){ //change bait selection
					fieldWidth(this.id);
				});
				
				$(".fish").click(function(){ //when a tagplayer image is clicked on ...
					$('#message').html("That is a " + (this.id) );
				});
			});

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();