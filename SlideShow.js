/* This is the Javascript for the "Alaina's Love Story" webpage. 
/* Project: UMSL CS4500 SS2016 Group Project. 
/* Author: Chad Nelson  
/* Partners: Brett Lindsay
             Jason Pham
             Benjamin Leach
	     Ryan Admire*/
	    
/* Description: SildeShow.js is the main piece of the entire project. It contains code for both game modes as well as the menu system
	        and audio control. A brief description of the components and game modes can be found in the README.*/
//Globals
//////////////////////////////////////////////////////////////////////////////////////////////////
var audio = new Audio('Love Story-Taylor Swift.mp3');//Global for ease of coding for now
var imageArray = new Array();
var DURATION_PER_IMAGE = 2019;
var interval;
var numOfImages = 0; //This constant can be set incase they want to upload their own images for a song.
var counter = 0; //setting the counter as global for this iteration for simplicity
var pausePlacement = 0;
var pausePlacementCounter = 0;
var numPauses = 0;
var maxPauses = document.getElementById("pSlider").value; // pulled from slider value in options
var shouldPause = true;
var gameMode = { 1:false,2:false}; //This is used to set which game mode has been selected
var wrongChoicesForGame2; //this is the number of wrong choices that will display on game 2

/* variable to randomize between correct emotion or correct person
if question_type is 1 then elaina chooses a person
if question_type is 2 then elaina chooses an emotion
*/
//var question_type; // assigned 1 or 2

 /*used to set the source of the audio that plays on the interrupt,
  *used in playactionAudio(), set in questionInterrupt() and interrupt song(),
  * prefer the song be in .mp3 or mp4 for best results*/
var cueAudio;

/* dynamic counter will inrement and decrement as necessarily and will be added on to the maxWrongChoicesForGame2 variable in questionInterrupt function */
var dynamic_counter = 0;

/* optionMenuOn will be set to true if the options are up. */
var optionsMenuOn = false;

/* isGameRunning will be a boolean that will see if one of the 
   games are being ran. This will be used to show different
   options menus depending on whether the games are being
   currently ran or not. */
var isGameRunning = false;

/* text_on_pause will be a string that will be displayed on
   the webpage when the song pauses on Solo Play. It will
   be removed form the webpage when the user clicks the 
   "RESUME" button. */
var text_on_pause = "I love you";


/* This is an array containing a JSON a few JSON objects. These "people"
   objects will be named after Alaina's family members and will be used
   in Game Mode 2. The main purpose is to hold the soruce of images and audio files.
   self:picture of the named family member
   emotions:pictures of them making the given emotion
   whoAudio: a audio file of them saying "Who is ****" where the *'s are the named family member
   IF YOU ADD A FAMILY MEMBER YOU MUST HAVE self,angry,happy,sad,surprised PICTURES AND THE whoAudio
   if you want to add an emotion, it must be added to each object and change the emotionOptions array in questionInteruppt() and emotionAudio source*/
var family = [
 	{ name:"Grandpa",
 		self:"cs4500Media/images/grandpa/AlainaGrandad1-USE copy.JPG",
 		angry:"cs4500Media/images/grandpa/emotions/angry2.jpg",
 		happy:"cs4500Media/images/grandpa/emotions/happy2.jpg",
 		sad:"cs4500Media/images/grandpa/emotions/sad2.jpg",
 		surprised:"cs4500Media/images/grandpa/emotions/surprised2.jpg",
 		whoAudio:"cs4500Media/images/grandpa/whoisgrandpa.mp3"},
 	{ name:"Grandma",
 		self:"cs4500Media/images/grandma/Grandparents-Alaina-USE copy.JPG",
 		angry:"cs4500Media/images/grandma/emotions/angry2.jpg",
 		happy:"cs4500Media/images/grandma/emotions/happy2.jpg",
 		sad:"cs4500Media/images/grandma/emotions/sad2.jpg",
 		surprised:"cs4500Media/images/grandma/emotions/surprised2.jpg",
 		whoAudio:"cs4500Media/images/grandma/whoisgrandma.mp3"},
 	{ name:"Mom",
 		self:"cs4500Media/images/mom/Alaina's Family-USE copy.JPG",
 		angry:"cs4500Media/images/mom/emotions/angry.jpg",
 		happy:"cs4500Media/images/mom/emotions/happy.jpg",
 		sad:"cs4500Media/images/mom/emotions/sad.jpg",
 		surprised:"cs4500Media/images/mom/emotions/surprised.jpg",
 		whoAudio:"cs4500Media/images/mom/whoismom.mp3"},
 	{ name:"Dad",
 		self:"cs4500Media/images/dad/Alaina's Family-USE copy.JPG",
 		angry:"cs4500Media/images/dad/emotions/angry2.jpg",
 		happy:"cs4500Media/images/dad/emotions/happy2.jpg",
 		sad:"cs4500Media/images/dad/emotions/sad2.jpg",
 		surprised:"cs4500Media/images/dad/emotions/surprised2.jpg",
 		whoAudio:"cs4500Media/images/dad/whoisdad.mp3"},
 	{ name:"Colin",
 		self:"cs4500Media/images/brother/BrotherCullen-USE copy.JPG",
 		angry:"cs4500Media/images/brother/emotions/angry2.jpg",
 		happy:"cs4500Media/images/brother/emotions/happy2.jpg",
 		sad:"cs4500Media/images/brother/emotions/sad2.jpg",
 		surprised:"cs4500Media/images/brother/emotions/surprised2.jpg",
 		whoAudio:"cs4500Media/images/brother/whoisbro.mp3"}
 ];


/////////////////////////////////////////////////////////////////////////
//// This array holds all the encouragement/congratulation rewards //////
//// when Alaina answer correctly.								   //////
/////////////////////////////////////////////////////////////////////////
var congratsArray = ["cs4500Media/encouragement/tada.mp3","cs4500Media/encouragement/kidsyay.mp3","cs4500Media/encouragement/goodjob.mp3"];

//////////////////////////////////////////////////////////////////////////////////////////////////

//Functions to manipulate Image Area
//////////////////////////////////////////////////////////////////////////////////////////////
function displayImages(){
	var SONG_DURATION = audio.duration; //return the duration of the song in seconds,rounded up.
	var croppedDuration = SONG_DURATION - 60;
	pausePlacement = Math.floor((croppedDuration/(DURATION_PER_IMAGE/1000))/maxPauses);
	
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
	
	var imgArea = document.getElementById("imageBox");
	var img = document.getElementById("image");

	//maybe create another function called start slide show
	interval = setInterval(showImage,DURATION_PER_IMAGE);
	
	//Funciton that display the image
	///////////////////////////////////////////////////////////////////
	function showImage(){
		//console.log(counter);		
		img.src = imageArray[counter].src;
		
		/* test code - used for workaround to no PHP for now*/
		loadOptions();
		
		if(counter == (numOfImages-1)){ //reset counter to 0 if we are at max image array
			counter = 0;
			pausePlacementCounter++;
		}
		else if(pausePlacementCounter >= pausePlacement && shouldPause){//Manually setting time of interupt for now
			clearInterval(interval);
			numPauses++; // we paused
			updatePauses();
			interruptSong();
			// only pause maxPauses times
			if (numPauses >= maxPauses) {
				shouldPause = false;
			}
			counter++;
			pausePlacementCounter = 0;
		}
		else{
			counter++;
			pausePlacementCounter++;
		}
		// if song has ended, reset the app
		if(audio.ended) {
			// reset everything for a new start of program
			resetGame();
		}
	}
	////end of show image///////////////////////////////////////////////////////////////
}
/////////////////////////////////////////////////////////////////////////////////////

// Functions for options menu
function resetGame() {
	
	/* When the "Reset Game" button is clicked, remove the text
	   on pause from the webpage. */
	document.getElementById("text_on_together_pause").innerHTML = "";
	
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
	document.getElementById("imageBox").style.visibility = "visible";
	document.getElementById("replayAudioCue").style.visibility = "hidden";
	shouldPause = true;
	numPauses = 0;
	updatePauses();
	pausePlacementCounter = 0;

	
	if (gameMode[2] == true) { // removes the choices for gameMode2 on restart
		$( "#correctChoice" ).remove();
		for(var i = 0;i < wrongChoicesForGame2;i++){
			$( "#wrongChoice"+i ).remove();
		}
		document.getElementById("textSupportDiv").style.visibility = "hidden";
	}
}

function stopPauses() {
	shouldPause = false;
	numPauses = maxPauses;
	updatePauses();
	
	if (gameMode[2] == true) { // removes the choices for gameMode2 on restart
		$( "#correctChoice" ).remove();
		$( "#wrongChoice" ).remove();
	}
}

function updatePauses() {
	var SONG_DURATION = audio.duration; //return the duration of the song in seconds,rounded up.
	var croppedDuration = SONG_DURATION - 45;
	pausePlacement = Math.floor((croppedDuration/(DURATION_PER_IMAGE/1000))/maxPauses);
	//console.log(pausePlacement);
	if (maxPauses >= numPauses) { // don't let numPauses > than maxPauses display to user
		$(".pausesText").html("Pauses Remain<br>" + (maxPauses-numPauses));
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////

//Main Audio Manipluation Functions
//////////////////////////////////////////////////////////////////////////////////////////////
function interruptSong(){
	pauseAudio();
	shouldPause = true;
	if (gameMode[1] == true) {//if statement for first game mode
		
		//hard code the source for the cueAudio for this game mode
		cueAudio = 'cs4500Media/i-love-you-audio/girl_voice.wav';
		playActionAudio();
		
		document.getElementById("imageBox").style.visibility = "hidden";
		
		/* When the song interrupts, the webpage should display the 
	    words "I love you." The words should be removed when the 
	    user clicks on the RESUME button.*/
		
		/* There is an option to not show text on pauses. This condition
		   will be checked. */
		var text_on_pauses_boolean = document.getElementById("text_on_pauses_checkbox");
		
		if (text_on_pauses_boolean.checked)
		{
			document.getElementById("text_on_together_pause").innerHTML = text_on_pause;
		}
		
		//Append a button to the popup div, currently using the sratbutton CSS
		window.setTimeout(function() {
			$("#resumeButtonDiv").append("<button id=\"resumebutton\" class=\"resumebutton\">RESUME</button>");
			
			if (optionsMenuOn) {
				$("#resumebutton").hide();
			}
			//Add event handler for created button
			$("#resumebutton").click(function() {
				
				/* When the RESUME button is clicked, remove the text
				   "I love you" from the webpage. */
				document.getElementById("text_on_together_pause").innerHTML = "";
				document.getElementById("imageBox").style.visibility = "visible";
				
				displayImages();
				audio.play();
				$("#resumebutton").remove();
			});
		}, 2500);
		
	}
	
	//Game 2 is selected, use question format
	if(gameMode[2] == true){
		questionInterrupt();
	}

}

function pauseAudio(){
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
	$("#activebutton").hide(DURATION_PER_IMAGE);
	$("#mode2Button").hide(DURATION_PER_IMAGE);
	$("#optionsButton").hide(DURATION_PER_IMAGE);
	$("#optionsSymDiv").show(DURATION_PER_IMAGE);
	audio.play();
	document.getElementById("pausesText").style.visibility = "visible"; //shows the pause counter text
	updatePauses();
}

/*This function will play the action audio to tell endUser what to do
 uses cueAudio variable for the source of the audio*/
function playActionAudio() {
	
	var actionAudio = new Audio(cueAudio);
	window.setTimeout(function () {
		actionAudio.play();
	}, 200);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Use this function with a while loop, when wrong answer is choosen it will disappear,when correct all will resume ///////////
/////////////// Function to use in Game Mode 2 /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var questionInterrupt = function(){
	var correctChoice = new Image();
	var madeWrongChoice;
	//var wrongChoice = new Array();//array for wrong choice images
	var wrongAnswerArray = new Array();//This array will hold all the wrong answer pictures and wrongchoice array can pick out from
	var maxWrongChoicesForGame2 = 3;//This is the max number of wrong choices for each interrupt for game 2
	wrongChoicesForGame2 = 1 + dynamic_counter;
	
	//---------------------------------------------------//
	//Choose right answer and worng answers for question-//
	//---------------------------------------------------//
		var question_type = Math.floor((Math.random()*2)+1); //randomizes 2 choices 1 or 2
		var familyMemberChosen = Math.floor(Math.random()*(family.length-1)); //pick random family member for correct answer
		var emotionOptions = ["Angry","Surprised","Happy","Sad"]; //possible emotions,these must be in family objects
		var emotionChosen = emotionOptions[Math.floor(Math.random()*(emotionOptions.length-1))];//randomly choose correct emotion
		var emotionAudio = {//this object holds the source files for the emtions audio questions
				Angry:"cs4500Media/whoisangry.mp3",
				Sad:"cs4500Media/whoissad.mp3",
				Happy:"cs4500Media/whoishappy.mp3",
				Surprised:"cs4500Media/whoissurprised.mp3"
			};
		
		
		

		if (question_type == 1) { // question_type 1 is to pick the correct person
			
			$(".textSupportText").html("Pick <br>" + family[familyMemberChosen].name); // display chosen family member name to find
			document.getElementById("textSupportDiv").style.visibility = "visible";
			
			
			correctChoice.src = family[familyMemberChosen].self;//set correct answer
			
			cueAudio = family[familyMemberChosen].whoAudio;//set the correct audio to prompt

			var j = 0; //this will be used to skip the index that is already chosen
			for(var i = 0; i<maxWrongChoicesForGame2; i++) {//set wrong answers
				wrongAnswerArray[i] = new Image();
				if(family[familyMemberChosen].name == family[i].name){//make sure correct answer is not set as wrong answer
					j++;
				}
				wrongAnswerArray[i].src = family[j].self;
				j++;
			}
		}
		else { // question_type 2 is to pick the correct emotion
			
			$(".textSupportText").html("Pick <br>" + emotionChosen); // set to ask the chosen emotion
			document.getElementById("textSupportDiv").style.visibility = "visible";
		
			correctChoice.src = family[familyMemberChosen][emotionChosen.toLowerCase()];//set correct answer
			
			cueAudio = emotionAudio[emotionChosen];//set cue audio
		


			var j = 0; //this will be used to skip the index that is already chosen
			for(var i = 0; i<maxWrongChoicesForGame2; i++) {//set wrong answers
				wrongAnswerArray[i] = new Image();
				if(emotionOptions[i] == emotionChosen){
					j++;
				}
				wrongAnswerArray[i].src = family[familyMemberChosen][emotionOptions[j].toLowerCase()];
				j++;
			}
		}

	//--------------------------------------------------------------------------//
	//once question type is identified and correct/wrong answers are assigned,
	//map the choices randomly to the popupDiv using the area Array
	//--------------------------------------------------------------------------//
	
	switch (wrongChoicesForGame2) {
		 case 1:
		 	var area = new Array( 
		 		"<img id=\"correctChoice\" class=\"popupImageDisplay\" src=\""+correctChoice.src+"\" />",
				"<img id=\"wrongChoice0\" class=\"popupImageDisplay\" src=\""+wrongAnswerArray[0].src+"\" />");
		 	break;

		 case 2:
		 	var area = new Array( 
		 		"<img id=\"correctChoice\" class=\"popupImageDisplay\" src=\""+correctChoice.src+"\" />",
				"<img id=\"wrongChoice0\" class=\"popupImageDisplay\" src=\""+wrongAnswerArray[0].src+"\" />",
				"<img id=\"wrongChoice1\" class=\"popupImageDisplay\" src=\""+wrongAnswerArray[1].src+"\" />");
		 	break;

		 case 3:
		 	var area = new Array(
				"<img id=\"correctChoice\" class=\"popupImageDisplay\" src=\""+correctChoice.src+"\" />",
				"<img id=\"wrongChoice0\" class=\"popupImageDisplay\" src=\""+wrongAnswerArray[0].src+"\" />",
				"<img id=\"wrongChoice1\" class=\"popupImageDisplay\" src=\""+wrongAnswerArray[1].src+"\" />",
				"<img id=\"wrongChoice2\" class=\"popupImageDisplay\" src=\""+wrongAnswerArray[2].src+"\" />");	
		 	break;
	}

	//Shuffle Array Of images a few times,This could be optimized in future if needed
	var temp,randomIndex;
		for(var i = 0;i<wrongChoicesForGame2+1;i++){
			randomIndex = Math.floor(Math.random()*(wrongChoicesForGame2+1));
			temp = area[i];
			area[i]=area[randomIndex];
			area[randomIndex] = temp;
		}
		
	//append the answers to the popup div
	for(var i = 0;i<wrongChoicesForGame2+1;i++){
		$( "#popupBox" ).append(area[i]);
	}
	
	///////////////////////////////////	
	//// Audio Support Play Action ////
	///////////////////////////////////
	playActionAudio();//play the action audio to prompt the question
	document.getElementById("replayAudioCue").style.visibility = "visible"; //show replay question button
							 
	//creating click event for the correct choice chosen img ID						
	$( "#correctChoice" ).click(function() {
			$( "#correctChoice" ).remove();
			document.getElementById("textSupportDiv").style.visibility = "hidden";
			document.getElementById("replayAudioCue").style.visibility = "hidden";
			for(var i = 0;i < wrongChoicesForGame2;i++){
				$( "#wrongChoice"+i ).remove();
			}

			if(madeWrongChoice != true) { // If elaina made a wrong choice dynamic_counter is unaffected after she hits right one	
				dynamic_counter++; // Increase the dynamic counter which increases the maxWrongChoices
			}

			if(dynamic_counter > 2) { //bound to 2 
				dynamic_counter = 2;
			}
			madeWrongChoice = false;
			
			//PLAY GOOD JOB ALANIA AUDIO
			//var goodJobAudio = new Audio("cs4500Media/encouragement/kidsYAY.mp3");
			var u = Math.floor(Math.random()*(congratsArray.length));
			var goodJobAudio = new Audio(congratsArray[Math.floor(Math.random()*(congratsArray.length))]);
			//var goodJobAudio = new Audio(congratsArray[u]);
			goodJobAudio.play();
			document.getElementById("image").src = "cs4500Media/encouragement/goodjob.png";
			window.setTimeout(function() {
				displayImages();
				audio.play();
			}, 1500);
			
		});
	
	//Manually assigning click events to wrong answers for now, until better solution is found.
			$( "#wrongChoice0").click(function() {
				//If wrong choice is made, add a red X over the image
				$( "#wrongChoice0").attr("src","cs4500Media/images/Red_X.png");
				$( "#wrongChoice0").css("background-image", "url(\'"+wrongAnswerArray[0].src+"\')");
				$( "#wrongChoice0").css("background-size", "cover");
				playActionAudio();//replay audio question
				madeWrongChoice = true;
				dynamic_counter--;
				if(dynamic_counter < 0) {
					dynamic_counter = 0;
				}
			});

			$( "#wrongChoice1").click(function() {
				//If wrong choice is made, add a red X over the image
				$( "#wrongChoice1").attr("src","cs4500Media/images/Red_X.png");
				$( "#wrongChoice1").css("background-image", "url(\'"+wrongAnswerArray[1].src+"\')");
				$( "#wrongChoice1").css("background-size", "cover");
				playActionAudio();//replay audio question
				madeWrongChoice = true;
				dynamic_counter--;
				if(dynamic_counter < 0) {
					dynamic_counter = 0;
				}
			});

			$( "#wrongChoice2").click(function() {
				//If wrong choice is made, add a red X over the image
				$( "#wrongChoice2").attr("src","cs4500Media/images/Red_X.png");
				$( "#wrongChoice2").css("background-image", "url(\'"+wrongAnswerArray[2].src+"\')");
				$( "#wrongChoice2").css("background-size", "cover");
				playActionAudio();//replay audio question
				madeWrongChoice = true;
				dynamic_counter--;
				if(dynamic_counter < 0) {
					dynamic_counter = 0;
				}
			});

};


//////////////////////////////////////////////////////////////////////////////////////////////
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
function loadOptions() // called on page load
{
	// load options from a text file
	$.get('options.txt', function (data) {
    	console.log(data.toString());
	    // shouldReadFile, maxPauses, shouldStopPauses, shouldResetGame
    	var options = data.split(" ");

	    if (options[0] == 1) {
    		choosePause(options[1]);
       		if (options[2] == 1) {
         		stopPauses();
       		}
       		if (options[3] == 1) {
       			resetGame();
       		}  
    	}
  	}, 'text');
}

function updateOptions() // called on options page close
{
	// on options close update the options file to the current options
}

/* hideOptionsMenu() hides the <div>
   for the options menu as soon as 
   main.html loads. */
function hideOptionsMenu()
{		
	$(document).ready(function()  {
		/* hide the options menu */
		$(".optionsMenu").hide();
		$("#optionsSymDiv").hide();
		document.querySelector('#numOfPauses_outputID').value = document.getElementById("pSlider").value;
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
	else {	
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
	
	$(".optionsMenu").css("visibility", "visible");
	$(".optionsMenu").show(1000);
	optionsMenuOn = true;
	//document.getElementById("optionsBox").innerHTML = optionsMenuOn;
	
}

/* close OptionMenu() closes the options menu. */
	function closeOptionsMenu()
{
	/* Get the string the user typed in the textbox in
	   the options menu and save it. */
	 text_on_pause = document.getElementById("text_on_pauses_id").value;
	 
	 if (isGameRunning) { // hard to reset interval on random click time?
		$("#resumebutton").show();
		// audio.play();
		// displayImages();
	 }

	/* blurBackground unblurs everything 
		It is defined futher below. */
	unblurBackground();
	
	changeBackgroundImage();
	
	/* Get the color of the text for the 
	   text that shows up on pauses on 
	   "Solo Play". */
	getPauseTextColor();
	 
	$(".optionsMenu").hide(1000);
	updateOptions(); // when the user closes the options menu, update the options file
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
	blurredBackground.classList.add("everythingClassBlurred");
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
	blurredBackground.classList.remove("everythingClassBlurred");
	blurredBackground.classList.add("everythingClass");
}

/********************************/
/* textboxAvailability()        */
/* 	will grey or ungrey the     */
/* 	text on pauses textbox      */
/*	no longer be blurry.        */
/********************************/
function textboxAvailability()
{
	document.getElementById('text_on_pauses_checkbox').onchange = function() {
    // access properties using this keyword
    if ( this.checked ) {
        // if checked ...
		document.getElementById("text_on_pauses_id").disabled = false;
		document.getElementById("text_on_pauses_color").disabled = false;

    } else if ( !this.checked) {
        // if not checked ...
		document.getElementById("text_on_pauses_id").disabled = true;
		document.getElementById("text_on_pauses_color").disabled = true;
    }
};
	
}


/********************************/
/* getPauseTextColor() gets     */
/* 	a color typed into a textbox*/
/* 	by a user and changes the   */
/*	CSS to change the font color*/
/*  for the text on pauses.     */
/********************************/
function getPauseTextColor()
{	
	var text_on_pause_color = document.getElementById("text_on_pauses_color").value;
	document.getElementById("text_on_together_pause").style.color = text_on_pause_color;
}

/*********************************/
/* changeBackgroundImage()       */
/* 	changes the background image.*/
/*********************************/ 
function changeBackgroundImage()
{
	var backgroundURL = document.getElementById("background_option").value;
	
	var cols = document.getElementsByClassName('everythingClassBlurred');
	for(i=0; i<cols.length; i++) {
    cols[i].style.background = backgroundURL;
	}
	
	cols = document.getElementsByClassName('everythingClass');
	for(i=0; i<cols.length; i++) {
    cols[i].style.background = backgroundURL;
	}
}   

/*_____________________________*/
/*                             */
/*   END OF OPTIONS MENU CODE  */
/*_____________________________*/

/*******************************/

/*_____________________________*/
/*                             */
/* START OF "ABOUT US" AND     */
/* DOCUMENTATION CODE          */
/*_____________________________*/

/* The next two functions open new URLs in a tab/window using
   the window.open function of Javascript. */
function openAboutUs() 
{
	/* window.open() opens the specificed URL */
    window.open("http://benjaminsl.neocities.org/autismProject/aboutus.html");
}

function openDocumentation()
{
	/* window.open() opens the specificed URL */
	window.open("http://benjaminsl.neocities.org/autismProject/documentation.html");
}

/*_____________________________*/
/*                             */
/*   END OF "ABOUT US" AND     */
/*   DOCUMENTATION CODE        */
/*_____________________________*/



