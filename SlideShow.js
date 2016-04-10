/* This is the CSS for the "Elena's Love Story" webpage. 
/* Project: UMSL CS4500 SS2016 Group Project. 
/* Author: Chad Nelson  
/* Partners: Brett Lindsay
             Jason Pharm
			 Benjamin Leach
			 Ryan */
//Globals
//////////////////////////////////////////////////////////////////////////////////////////////////
var audio = new Audio('Love Story-Taylor Swift.mp3');//Global for ease of coding for now
var imageArray = new Array();
var numOfImages = 0; //This constant can be set incase they want to upload their own images for a song.
var counter = 0; //setting the counter as global for this iteration for simplicity
var numPauses = 0;
var maxPauses = 3; // hard coded for now. adjust with user options later
var shouldPause = true;
//////////////////////////////////////////////////////////////////////////////////////////////////

//Functions to manipulate Image Area
//////////////////////////////////////////////////////////////////////////////////////////////
function displayImages(){
	var DURATION_PER_IMAGE = 1500;
	var SONG_DURATION = Math.ceil(audio.duration); //return the duration of the song in seconds,rounded up.
	numOfImages = 6;
	
	if(isNaN(counter)){
		console.log("counter is not a number");
		counter = 0;
	}
	
	
	//setting up Image Array, can use this to auto load images down the road
	for(var i = 0;i < numOfImages;i++){
		imageArray[i] = new Image();
	}
	imageArray[0].src = 'cs4500Media/images/Alaina1-USE.JPG';
	imageArray[1].src = 'cs4500Media/images/AlainaGrandad1-USE.JPG';
	imageArray[2].src = 'cs4500Media/images/BrotherCullen-USE.JPG';
	imageArray[3].src = 'cs4500Media/images/Alaina\'s Family-USE.JPG';
	imageArray[4].src = 'cs4500Media/images/Grandparents-Alaina-USE.JPG';
	imageArray[5].src = 'cs4500Media/images/musicalToy-USE.JPG';
	/////////////////////////////////////////////////////////////////////////
	
	var imgArea = document.getElementById("imageBox");
	var img = document.getElementById("image");

	//maybe create another function called start slide show
	var interval = setInterval(showImage,DURATION_PER_IMAGE);
	
	function showImage(){
		//console.log(counter);		
		img.src = imageArray[counter].src;
		/*
		$("#image").fadeIn(500, function() {
			$("#image").fadeOut(500, function() {
				//complete
			});
		});
		*/
		if(counter == (numOfImages-1)){
			counter = 0;
			//clearInterval(interval);//this eventually will need to be called at end of song or on a pause
		}
		else if(counter == 4 && shouldPause){//Manually setting time of interupt for now
			clearInterval(interval);
			interruptSong();
			// only pause maxPauses times
			numPauses++;
			if (numPauses >= maxPauses) {
				shouldPause = false;
			}
			counter++;
		}
		else{
			counter++;
		}
		
		// if song has ended, reset the app
		if(audio.ended) {
			clearInterval(interval);
			// reset everything for a new start of program
			$("#startButton").css("display", "initial");
			shouldPause = true;
			numPauses = 0;
		}
	}
	
	//var songEnded = audio.ended
	//var currentSongTime = audio.getStartDate;//this has an error
	//console.log(currentSongTime+","+audio.duration);
	
}
//////////////////////////////////////////////////////////////////////////////////////////////

//Audio Manipluation Functions
//////////////////////////////////////////////////////////////////////////////////////////////
function interruptSong(){
	pauseAudio();
	
	//Append a button to the popup div, currently using the sratbutton CSS
	$( "#popupBox" ).after( "<button id=\"resumebutton\" class=\"startbutton\">RESUME</button>" );
	$("#resumebutton").appendTo("#popupBox");
	
	//Add event handler for created button
	$( "#resumebutton" ).click(function() {
 		displayImages();
		audio.play();
		$( "#resumebutton" ).remove();
	});

	
}

function pauseAudio(){
	//var button = document.getElementById("startButton");
	//button.style.display = "inline";
	audio.pause();	
}


//Ryan Admire function to play music
function beginPlaying(){
	//audio.canPlayType()//checks if the browser can play the audio file
	displayImages();

	//code to stop displaying the initial buttons
	//is repeated for all 3 initial buttons
	var button = document.getElementById("startButton");
	button.style.display = "none";
	var button = document.getElementById("mode2button");
	button.style.display = "none";
	var button = document.getElementById("optionsbutton");
	button.style.display = "none";
	audio.play();
}
//////////////////////////////////////////////////////////////////////////////////////////////

