/* This is the CSS for the "Alaina's Love Story" webpage. 
/* Project: UMSL CS4500 SS2016 Group Project. 
/* Author: Chad Nelson  
/* Partners: Brett Lindsay
             Jason Pham
             Benjamin Leach
	     Ryan Admire*/
//Globals
//////////////////////////////////////////////////////////////////////////////////////////////////
var audio = new Audio('Love Story-Taylor Swift.mp3');//Global for ease of coding for now
var imageArray = new Array();
var DURATION_PER_IMAGE = 2019;
var interval;
var numOfImages = 0; //This constant can be set incase they want to upload their own images for a song.
var counter = 0; //setting the counter as global for this iteration for simplicity
var numPauses = 0;
var maxPauses = 3; // hard coded for now. adjust with user options later
var shouldPause = true;
var gameMode = { 1:false,2:false}; //This is used to set which game mode has been selected

/* optionMenuOn will be set to true if the options are up. */
var optionsMenuOn = false;

/* isGameRunning will be a boolean that will see if one of the 
   games are being ran. This will be used to show different
   options menus depending on whether the games are being
   currently ran or not. */
var isGameRunning = false;
//////////////////////////////////////////////////////////////////////////////////////////////////

//Functions to manipulate Image Area
//////////////////////////////////////////////////////////////////////////////////////////////
function displayImages(){
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
	interval = setInterval(showImage,DURATION_PER_IMAGE);
	
	function showImage(){
		//console.log(counter);		
		img.src = imageArray[counter].src;

		if(counter == (numOfImages-1)){ //reset counter to 0 if we are at max image array
			counter = 0;
		}
		else if(counter == 4 && shouldPause){//Manually setting time of interupt for now
			clearInterval(interval);
			numPauses++; // we paused
			updatePauses();
			interruptSong();
			// only pause maxPauses times
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
			// reset everything for a new start of program
			resetGame();
		}
	}
}

// Functions for options menu
function resetGame() {
	if (isGameRunning) { // reset running
		clearInterval(interval);
		audio.pause();
		audio.load();
		$(".resetGameButton").hide();
		$(".stopPausesButton").hide();
		$("#resumebutton").remove();
		isGameRunning = false;
	}
	// reset everything for a new start of program
	$("#activebutton").css("display", "initial");
	$("#mode2Button").css("display", "initial");
	$("#optionsButton").css("display", "initial");
	$("#optionsSymDiv").hide();
	shouldPause = true;
	numPauses = 0;
	updatePauses();
	
	if (gameMode[2] == true) { // removes the choices for gameMode2 on restart
		$( "#correctChoice" ).remove();
		$( "#wrongChoice" ).remove();
	}
}

function stopPauses() {
	shouldPause = false;
	numPauses = maxPauses;
	updatePauses();
	if(shouldPause == false) {
		audio.play();
		displayImages();
	}
}

function updatePauses() {
	if (maxPauses >= numPauses) { // don't let numPauses > than maxPauses display to user
		$(".pausesText").html("Pause Count<br>" + numPauses + "/" + maxPauses);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////

//Audio Manipluation Functions
//////////////////////////////////////////////////////////////////////////////////////////////
function interruptSong(){
	pauseAudio();
	shouldPause = true;
	if (gameMode[1] == true) {//if statement for first game mode
		playActionAudio();
		//Append a button to the popup div, currently using the sratbutton CSS
		window.setTimeout(function() {
			$("#popupBox").after("<button id=\"resumebutton\" class=\"resumebutton\">RESUME</button>");
			$("#resumebutton").appendTo(".pausesDiv");
			if (optionsMenuOn) {
				$("#resumebutton").hide();
			}
			//Add event handler for created button
			$("#resumebutton").click(function() {
				displayImages();
				shouldPause = false;
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
	//var button = document.getElementById("activebutton");
	//button.style.display = "inline";
	audio.pause();	
}


//this function is called when game button is pressed, the variable passed in is which game mode was selected
function beginPlaying(gameModeChoice){
	isGameRunning = true;
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
	//is repeated for all 3 initial buttons - changed to jQuery

	// var button = document.getElementById("activebutton");
	// button.style.display = "none";
	// var button = document.getElementById("mode2Button");
	// button.style.display = "none";
	// var button = document.getElementById("optionsButton");
	// button.style.display = "none";
	$("#activebutton").hide(DURATION_PER_IMAGE);
	$("#mode2Button").hide(DURATION_PER_IMAGE);
	$("#optionsButton").hide(DURATION_PER_IMAGE);
	$("#optionsSymDiv").show(DURATION_PER_IMAGE);
	audio.play();
	document.getElementById("pausesText").style.visibility = "visible"; //shows the pause counter text
	updatePauses();
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


/*_____________________________*/
/*                             */
/* START OF OPTIONS MENU CODE  */
/*_____________________________*/

/*************************************/
/* The options menu for this website */
/*   is a white box that only shows  */
/*   when the user clicks the        */
/*   "OPTIONS" button.               */
/**************************************/

/* hideOptionsMenu() hides the <div>
   for the options menu as soon as 
   main.html loads. */
function hideOptionsMenu()
{
	$(document).ready(function()  {
		/* hide the options menu */
		$(".optionsMenu").hide();
		$("#optionsSymDiv").hide();
	});
}

/* function allows user to choose the number amount of pauses. */
function choosePause(num_of_pause) {
	//update the output text 
	document.querySelector('#numOfPauses_outputID').value = num_of_pause;
	maxPauses = num_of_pause; //update
	if (numPauses < maxPauses) {
		shouldPause = true;
	}
	updatePauses();
	//console.log(numPauses);
}

/**********************************************/
/* The function openOptionsMenu() will contain*/
/*	everything that happens when the options  */
/*	menu is open.                             */
/* The options menu is either opened by       */
/*	clicking the "Options" button on the main */
/*  menu or clicking the gear when a game is  */
/*	running.                                  */
/**********************************************/

/* The options menu "fades" into place by    */
/*    using "1000" as the paramter in slow().*/
function openOptionsMenu()
{
	if (optionsMenuOn) {
		closeOptionsMenu();
		return;
	}
	
	if (isGameRunning == false)
	{
		$(".resetGameButton").hide();
		$(".stopPausesButton").hide();
	}
	
	else
	{	
		// $("#pSlider").hide(); // hides the slider to choose max number of pauses
		$(".resetGameButton").show();
		$(".stopPausesButton").show();
		$("#resumebutton").hide();
		// audio.pause(); // want to pause but hard to rest interval off random click time
		// clearInterval(interval);
	}
	
	/* blurBackground blurs everything 
		except the options Menu. It is 
		defined futher below. */
	blurBackground();
	
	$(".optionsMenu").show(1000);
	optionsMenuOn = true;
	//document.getElementById("optionsBox").innerHTML = optionsMenuOn;
	
}

/* close OptionMenu() closes the options menu. */
	function closeOptionsMenu()
{
	 if (isGameRunning) { // hard to reset interval on random click time?
		$("#resumebutton").show();
		// audio.play();
		// displayImages();
	 }

	/* blurBackground unblurs everything 
		It is defined futher below. */
	unblurBackground();
	 
	$(".optionsMenu").hide(1000);
	optionsMenuOn = false;
}


/********************************/
/* The function blurBackground()*/
/* 	causes everything that is   */
/* 	not the options menu to     */
/*	become blurry.              */
/********************************/
function blurBackground()
{
	var blurredBackground = document.querySelector("#everythingID");
	blurredBackground.classList.remove("everythingClass");
	blurredBackground.classList.add("everythingClassBlurred")
}

/********************************/
/* The function blurBackground()*/
/* 	causes everything that is   */
/* 	not the options menu to     */
/*	no longer be blurry.        */
/********************************/
function unblurBackground()
{
	var blurredBackground = document.querySelector("#everythingID");
	blurredBackground.classList.remove("everythingClassBlurred")
	blurredBackground.classList.add("everythingClass");
}
   
/*_____________________________*/
/*                             */
/*   END OF OPTIONS MENU CODE  */
/*_____________________________*/
