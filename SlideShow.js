/* This is the CSS for the "Alaina's Love Story" webpage. 
/* Project: UMSL CS4500 SS2016 Group Project. 
/* Author: Chad Nelson  
/* Partners: Brett Lindsay
             Jason Pharm
             Benjamin Leach
	     Ryan Admire*/
//Globals
//////////////////////////////////////////////////////////////////////////////////////////////////
var audio = new Audio('Love Story-Taylor Swift.mp3');//Global for ease of coding for now
var imageArray = new Array();
var numOfImages = 0; //This constant can be set incase they want to upload their own images for a song.
var counter = 0; //setting the counter as global for this iteration for simplicity
var numPauses = 0;
var maxPauses = 3; // hard coded for now. adjust with user options later
var shouldPause = true;
var gameMode = { 1:false,2:false}; //This is used to set which game mode has been selected
//////////////////////////////////////////////////////////////////////////////////////////////////

//Functions to manipulate Image Area
//////////////////////////////////////////////////////////////////////////////////////////////
function displayImages(){
	var DURATION_PER_IMAGE = 2019;
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
	imageArray[5].src = 'cs4500Media/images/AlainaGrandad2.JPG';
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
		if(counter == (numOfImages-1)){ //reset counter to 0 if we are at max image array
			counter = 0;
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
			$("#mode2Button").css("display", "initial");
			$("#optionsButton").css("display", "initial");
			shouldPause = true;
			numPauses = 0;
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////

//Audio Manipluation Functions
//////////////////////////////////////////////////////////////////////////////////////////////
function interruptSong(){
	pauseAudio();

	if (gameMode[1] == true) {//if statement for first game mode
		playActionAudio();
		//Append a button to the popup div, currently using the sratbutton CSS
		window.setTimeout(function() {
			$("#popupBox").after("<button id=\"resumebutton\" class=\"resumebutton\">RESUME</button>");
			$("#resumebutton").appendTo("#popupBox");

			//Add event handler for created button
			$("#resumebutton").click(function() {
				displayImages();
				audio.play();
				$("#resumebutton").remove();
			});
		}, 2500);
		
	}
	
	//Game 2 is slected, use question format
	if(gameMode[2] == true){
		questionInterrupt();
	}

}

function pauseAudio(){
	//var button = document.getElementById("startButton");
	//button.style.display = "inline";
	audio.pause();	
}


//this function is called when game button is pressed, the variable passed in is which game mode was selected
function beginPlaying(gameModeChoice){
	//audio.canPlayType()//checks if the browser can play the audio file
	
	//check and set which gmae mode was sleceted
	if(gameModeChoice =="game1"){
		gameMode[1] = true;
		gameMode[2] = false;
	}
	else if(gameModeChoice =="game2"){
		gameMode[1] = false;
		gameMode[2] = true;
	}
	displayImages();

	//code to stop displaying the initial buttons
	//is repeated for all 3 initial buttons
	var button = document.getElementById("startButton");
	button.style.display = "none";
	var button = document.getElementById("mode2Button");
	button.style.display = "none";
	var button = document.getElementById("optionsButton");
	button.style.display = "none";
	audio.play();
}

function playActionAudio() {
	
	var actionAudio1 = 
		new Audio('cs4500Media/i-love-you-audio/girl_voice.wav');
	var actionAudio2 = 
		new Audio('cs4500Media/i-love-you-audio/girl_i_love_you_too.wav');
		actionAudio1.media_type = "audio/wav";
		actionAudio2.media_type = "audio/wav";
		
	window.setTimeout(function () {
		actionAudio1.play();
	}, 200);
	window.setTimeout(function() {
		actionAudio2.play();
	}, 1500);	
}

//Use this function with a while loop, when wrong everything will reappear,when correct all will resume
//Currently the function has commented code, leaving this in until i understand it more
var questionInterrupt = function(){
	//var deferred = new $.Deferred();
	playActionAudio();//play the action audio to prompt the question
	
	//images that will popup for Alaina to choose from
	var correctChoice = new Image();
	var wrongChoice = new Image();
	correctChoice.src = 'cs4500Media/images/AlainaGrandad2.JPG';
	wrongChoice.src = 'cs4500Media/images/beachBall.jpg';
	
	
	$( "#popupBox" ).append( "<img id=\"correctChoice\" class=\"popupImageDisplay\" src=\""+correctChoice.src+"\" /> <img id=\"wrongChoice\" class=\"popupImageDisplay\" src=\""+wrongChoice.src+"\" />");
							 
	$( "#correctChoice" ).click(function() {
			console.log("right answer clicked");
			$( "#correctChoice" ).remove();
			$( "#wrongChoice" ).remove();
			//deferred.resolve();
			displayImages();
			audio.play();
			//return deferred.promise();
		});

	$( "#wrongChoice" ).click(function() {
			console.log("wrong answer clicked");
			$( "#correctChoice" ).remove();
			$( "#wrongChoice" ).remove();
			//deferred.resolve();
			//return deferred.promise();
			window.setTimeout(function () {
				questionInterrupt();
			}, 600);
			
		});
		
};

//////////////////////////////////////////////////////////////////////////////////////////////

