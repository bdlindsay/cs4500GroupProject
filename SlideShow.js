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
//var audio = new Audio('cs4500Media/Songs/Love Story-Taylor Swift.mp3');//Global for ease of coding for now
var audio = document.createElement('audio');	//create audio element in html
audio.setAttribute('id','playing');
audio.src = 'cs4500Media/Songs/Love Story-Taylor Swift.mp3'; //can change the src later
$("body").append(audio);						//append the audio element to the body
$("#playing")[0].volume = 1;					//full volume


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
var gameMode = { 1:false,2:false,3:false}; //This is used to set which game mode has been selected
var wrongChoicesForGame2; //this is the number of wrong choices that will display on game 2
var songChoice = 0; // determines starting song for solo play (gameMode[2]) - TODO could change with options menu
////////////////////////////////////////////////////////////////////////////
////////////// boolean var for use of reset game and stop pauses ///////////
////////////////////////////////////////////////////////////////////////////
var resetFlag = "N";
var stopFlag = "N";



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
   IF YOU ADD A FAMILY MEMBER YOU MUST HAVE self,mad,happy,sad,surprised PICTURES AND THE whoAudio
   if you want to add an emotion, it must be added to each object and change the emotionOptions array in questionInteruppt() and emotionAudio source*/
var family = [
 	{ name:"Grandpa",
 		self:"cs4500Media/images/grandpa/AlainaGrandad1-USE copy.JPG",
 		Mad:"cs4500Media/images/grandpa/emotions/angry2.jpg",
 		Happy:"cs4500Media/images/grandpa/emotions/happy2.jpg",
 		Sad:"cs4500Media/images/grandpa/emotions/sad2.jpg",
		
		
		
 		whoAudio:"cs4500Media/images/grandpa/whoisgrandpa.mp3"},
 	{ name:"Cece",
 		self:"cs4500Media/images/grandma/Grandparents-Alaina-USE copy.JPG",
 		Mad:"cs4500Media/images/grandma/emotions/angry2.jpg",
 		Happy:"cs4500Media/images/grandma/emotions/happy2.jpg",
 		Sad:"cs4500Media/images/grandma/emotions/sad2.jpg",
		
 		/* The emotion "Surprised" is removed right now at
		   the request of the family. */
 		/* Surprised:"cs4500Media/images/grandpa/emotions/surprised2.jpg", */
		
 		whoAudio:"cs4500Media/images/grandma/whoiscece.mp3"},
 	{ name:"Mom",
 		self:"cs4500Media/images/mom/MomAndAlaina.jpg",
 		Mad:"cs4500Media/images/mom/emotions/angry.jpg",
 		Happy:"cs4500Media/images/mom/emotions/happy.jpg",
 		Sad:"cs4500Media/images/mom/emotions/sad.jpg",
		
 		/* The emotion "Surprised" is removed right now at
		   the request of the family. */
 		/* Surprised:"cs4500Media/images/grandpa/emotions/surprised2.jpg", */
		
 		whoAudio:"cs4500Media/images/mom/whoismom.mp3"},
 	{ name:"Dad",
 		self:"cs4500Media/images/dad/AlainaFamilyC.jpg",
 		Mad:"cs4500Media/images/dad/emotions/angry2.jpg",
 		Happy:"cs4500Media/images/dad/emotions/happy2.jpg",
 		Sad:"cs4500Media/images/dad/emotions/sad2.jpg",
		
 		/* The emotion "Surprised" is removed right now at
		   the request of the family. */
 		/* Surprised:"cs4500Media/images/grandpa/emotions/surprised2.jpg", */
		
 		whoAudio:"cs4500Media/images/dad/whoisdad.mp3"},
 	{ name:"Colin",
 		self:"cs4500Media/images/brother/BrotherCullen.JPG",
 		Mad:"cs4500Media/images/brother/emotions/angry2.jpg",
 		Happy:"cs4500Media/images/brother/emotions/happy2.jpg",
 		Sad:"cs4500Media/images/brother/emotions/sad2.jpg",
		
 		/* The emotion "Surprised" is removed right now at
		   the request of the family. */
 		/* Surprised:"cs4500Media/images/grandpa/emotions/surprised2.jpg", */
		
 		whoAudio:"cs4500Media/images/brother/whoisbro.mp3"}
 ];


/////////////////////////////////////////////////////////////////////////
//// This array holds all the encouragement/congratulation rewards //////
//// when Alaina answer correctly.								   //////
/////////////////////////////////////////////////////////////////////////
var congratsArray = ["cs4500Media/encouragement/tada.mp3","cs4500Media/encouragement/kidsyay.mp3","cs4500Media/encouragement/goodjob.mp3"];

//////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
//// This array holds all the song choices used in the game   /////
///////////////////////////////////////////////////////////////////
var	songArray = ["cs4500Media/Songs/1MFadeLetItGoMP3.mp3", 
				"cs4500Media/Songs/1MFadeFirstTimeInForeverMP3.mp3", 
				"cs4500Media/Songs/1MFadeDefTaylorLoveStoryMP3.mp3", 
				"cs4500Media/Songs/1MFadePhotographMP3.mp3",
				"cs4500Media/Songs/1MFadeSnowmanMP3.mp3", 
				"cs4500Media/Songs/1MFadeLoveStoryMP3.mp3"];

//////////////////////////////////////////////////////////////////////////////////////////////

//Functions to manipulate Image Area
//////////////////////////////////////////////////////////////////////////////////////////////
function displayImages(){
	// TODO Probably need to refactor this into two functions one for each mode type
	var oneMinCounter = 0; // increment to 30 for ~1 min - solo play
	var SONG_DURATION = audio.duration; //return the duration of the song in seconds,rounded up. - play together 
	var croppedDuration = SONG_DURATION - 60;
	pausePlacement = Math.floor((croppedDuration/(DURATION_PER_IMAGE/1000))/maxPauses);
	
	numOfImages = 7;
	
	if(isNaN(counter)){
		console.log("counter is not a number");
		counter = 0;
	}
	
	//setting up Image Array, can use this to auto load images
	for(var i = 0;i < numOfImages;i++){
		imageArray[i] = new Image();
	}
	imageArray[0].src = 'cs4500Media/images/Alaina1-USE.JPG';
	imageArray[1].src = 'cs4500Media/images/AlainaGrandad1-USE.JPG';
	imageArray[2].src = 'cs4500Media/images/BrotherCullen.jpg';
	imageArray[3].src = 'cs4500Media/images/AlainaGrandad2.JPG';
	imageArray[4].src = 'cs4500Media/images/Grandparents-Alaina-USE.JPG';
	imageArray[5].src = 'cs4500Media/images/AlainaFamilyC.jpg';
	imageArray[6].src = 'cs4500Media/alainaImages/Alaina Laughing.JPG';
	

	
	var imgArea = document.getElementById("imageBox");
	var img = document.getElementById("image");

	//maybe create another function called start slide show
	interval = setInterval(showImage,DURATION_PER_IMAGE);
	
	//Funciton that display the image
	///////////////////////////////////////////////////////////////////

	/* weirdly placed function.  Thoughts? 
	* This function wsa originally here to work with the interval before it was global,it could probabaly be changed -Chad 
	*/
	function showImage(){
		//console.log(counter);		
		img.src = imageArray[counter].src;
		
		/* TODO test code - used for workaround to no PHP for now*/
		loadOptions();
		
		if(gameMode[3] == true){//Begin game mode 3 code
		
		//End of mode 3 logic	
		} else if (gameMode[2] == true) {
			if(counter == (numOfImages-1)){ //reset counter to 0 if we are at max image array
				counter = 0;
				pausePlacementCounter++;
			} else {
				counter++;
			}
		// End of mode 2 logic
		} else if (gameMode[1] == true) {
			if(pausePlacementCounter >= pausePlacement && shouldPause){//Manually setting time of interupt for now
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
			} else{
				counter++;
				pausePlacementCounter++;
			}
		// End of mode1 logic
		}
		// if song has ended, reset the app
		if(audio.ended) {
			if (gameMode[2] == true) {
				clearInterval(interval);
				songChoice++;
				audio.src = songArray[songChoice];
				audio.load();
				console.log(audio.src);
				if (songChoice <= 5){			
					questionInterrupt();
				} else {
					resetGame();
				}
			} else {	
				// reset everything for a new start of program
				resetGame();
			}
		}
	}
	////end of show image///////////////////////////////////////////////////////////////
}
/////////////////////////////////////////////////////////////////////////////////////


// /////////////////////////////////////
// // Function to fade the song //////// have own faded versions of songs now
// /////////////////////////////////////
// function fadeSong() {
	// if (gameMode[2] == true) {
		// $("#playing").animate({volume: 0}, 10000); 
// 
			// window.setTimeout(function() {
				// audio.pause();
				// clearInterval(interval);
				// // can add a new audio.src for a new song here
				// $("#playing")[0].volume = 1;
				// questionInterrupt();
			// }, 10100);
	// }
// 
// }
// 



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
	$("#mode3Button").css("display", "initial");
	$("#optionsButton").css("display", "initial");
	$("#pausesText").show();
	$( "#songOptionsBox" ).css("display","none");
	$( ".mode3ButtonArea").css("display", "none");
	$( "#imageBox").show();
	$("#optionsSymDiv").hide();
	document.getElementById("imageBox").style.visibility = "visible";
	//document.getElementById("replayAudioCue").style.visibility = "hidden";
	$("#replayAudioCue").hide();
	shouldPause = true;
	numPauses = 0;
	updatePauses();
	pausePlacementCounter = 0;
	songChoice = 0; // reset song selection for solo play
	
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
	
	/* i dont think this code is needed anymore -Chad
	
	
	//Game 2 is selected, use question format
	else if(gameMode[2] == true){
		$(".imageDisplay").css("visibility", "hidden");
		questionInterrupt();
	}

	//Game 3 is selected, display options of songs to pick
	else if(gameMode[3] == true){
		
	}
	*******************************************************/
}

function pauseAudio(){  //maybe not needed??
	audio.pause();	
}


//this function is called when game button is pressed, the variable passed in is which game mode was selected
function beginPlaying(gameModeChoice){
	isGameRunning = true;
	//audio.canPlayType()//checks if the browser can play the audio file
	
	//check and set which game mode was selected
	if(gameModeChoice =="game1"){
		gameMode[1] = true;
		gameMode[2] = false;
		gameMode[3] = false;
		displayImages();
		audio.play();
		document.getElementById("pausesText").style.visibility = "visible"; //shows the pause counter text
		updatePauses();
	} 
	else if(gameModeChoice =="game2"){
		gameMode[1] = false;
		gameMode[2] = true;
		gameMode[3] = false;
		// changes to solo play implementation
		shouldPause = false; // No pauses on game mode 2 
		questionInterrupt(); // Ask a question then reward with song
	}
	else if(gameModeChoice =="game3"){
		gameMode[1] = false;
		gameMode[2] = false;
		gameMode[3] = true;
		// changes to pick a song implementation
		shouldPause = false; // No pauses on game mode 3 
		displaySongChoices();//function to display song options
		
	}

	//code to stop displaying the initial buttons
	//is repeated for all 3 initial buttons - changed to jQuery
	$("#activebutton").hide(DURATION_PER_IMAGE);
	$("#mode2Button").hide(DURATION_PER_IMAGE);
	$("#mode3Button").hide(DURATION_PER_IMAGE);
	$("#optionsButton").hide(DURATION_PER_IMAGE);
	if(gameMode[3] == false ){//do not show if game mode 3 is selected
		$("#optionsSymDiv").show(DURATION_PER_IMAGE);
	}
	
}

/*This function will play the action audio to tell endUser what to do
 uses cueAudio variable for the source of the audio*/
function playActionAudio() {
	
	var actionAudio = new Audio(cueAudio);
	actionAudio.play();
// 
	// window.setTimeout(function () {
		// actionAudio.play();
	// }, 200);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Use this function with a while loop, when wrong answer is choosen it will disappear,when correct all will resume ///////////
/////////////// Function to use in Game Mode 2 /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var questionInterrupt = function(){
	
	//Set appearence of items for pick a song mode
	if(gameMode[3] == true){
		$( "#imageBox").show();
		$( ".mode3ButtonArea").css("display", "none");	
		$( "#songOptionsBox").css("display", "none");
		for(var i = 0;i < songArray.length;i++){
				$( "#songChoice"+i ).remove();
			}	
	}
	

	var correctChoice = new Image();
	var madeWrongChoice;
	//var wrongChoice = new Array();//array for wrong choice images
	var wrongAnswerArray = new Array();//This array will hold all the wrong answer pictures and wrongchoice array can pick out from
	var maxWrongChoicesForGame2 = 3;//This is the max number of wrong choices for each interrupt for game 2
	wrongChoicesForGame2 = 1 + dynamic_counter;
	
	//---------------------------------------------------//
	//Choose right answer and worng answers for question-//
	//---------------------------------------------------//
		
		/* The next variable "choose_play_solo_questions" gets its value
		   for a dropbox element in "main.html". If the value is "1" it means
		   only ask family questions, "2" means only ask emotion questions. 
		   "3" means ask both. */
		var choose_play_solo_questions = document.getElementById("choose_play_solo_questions").value;
		
		var question_type;
		
		if (choose_play_solo_questions == "family")
		{
			question_type = 1;
		}
		
		else if (choose_play_solo_questions == "emotions")
		{
			question_type = 2;
		}
		
		else if (choose_play_solo_questions == "family_and_emotions")
		{
			question_type = Math.floor((Math.random()*2)+1); //randomizes 2 choices 1 or 2
		}
		
		var familyMemberChosen = Math.floor(Math.random()*(family.length-1)); //pick random family member for correct answer
		
		/* The emotion "Surprised" is being removed for now
				   at the request of the family. */
		/* var emotionsOptions = ["Mad", "Surprised", "Happy", "Sad"]; */
		
		var emotionOptions = ["Mad","Happy","Sad"]; //possible emotions,these must be in family objects
		var emotionChosen = emotionOptions[Math.floor(Math.random()*(emotionOptions.length-1))];//randomly choose correct emotion
		var emotionAudio = {//this object holds the source files for the emtions audio questions
				Mad:"cs4500Media/whoismad.mp3",
				Sad:"cs4500Media/whoissad.mp3",
				Happy:"cs4500Media/whoishappy.mp3"
				
				/* The emotion "Surprised" is being removed for now
				   at the request of the family. */
				   
				/* Surprised:"cs4500Media/whoissurprised.mp3" */
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
		
			correctChoice.src = family[familyMemberChosen][emotionChosen];//set correct answer
			
			cueAudio = emotionAudio[emotionChosen];//set cue audio
		


			var j = 0; //this will be used to skip the index that is already chosen
			for(var i = 0; i<maxWrongChoicesForGame2; i++) {//set wrong answers
				wrongAnswerArray[i] = new Image();
				if(emotionOptions[i] == emotionChosen){
					j++;
				}
				wrongAnswerArray[i].src = family[familyMemberChosen][emotionOptions[j]];
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
	//document.getElementById("replayAudioCue").style.visibility = "visible"; //show replay question button
	// TODO changed to animation, but clunky looking
	$("#replayAudioCue").show(DURATION_PER_IMAGE);
	//creating click event for the correct choice chosen img ID						
	$( "#correctChoice" ).click(function() {
			$( "#correctChoice" ).remove();
			document.getElementById("textSupportDiv").style.visibility = "hidden";
			//document.getElementById("replayAudioCue").style.visibility = "hidden";
			$("#replayAudioCue").hide();
			

			if (gameMode[3] == true) {//if we are on mode 3 display main menu and new song
				$(".mode3ButtonArea").css("display", "block");
				$( "#imageBox").hide();
				$("#videoPlayer").show();
				loadYouTubePlayer();
			}

			
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
			document.getElementById("image").src = "cs4500Media/alainaImages/Work 055.JPG";
			window.setTimeout(function() {
				$(".imageDisplay").css("visibility", "visible");
			}, 100);	
			// TODO delay to not interfere with previous audio
			//while (!goodJobAudio.ended) {}; // busy wait for good job audio to finish
			if (gameMode[2] == true) {
				if (songChoice == 0) {
					audio = new Audio("cs4500Media/Songs/1MFadeLoveStoryMP3.mp3"); // change to 1 min fade audio
				}
				audio.play();
				displayImages();
			}	
			/*
			window.setTimeout(function() {
				
				if (gameMode[3] == true){//if pick a song is the game mode, play the video
					//play video here, might not need the line below after youtube implementation
					audio.play();
				}
				if (gameMode[2] == true) {
					audio.play();
					displayImages();
					//fadeSong(); // new method called here
				}
				else{//If the other modes are selected continue the slide show and song
					displayImages();
					audio.play();
				}
			}, 1500);
			*/
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


///////End of questionInterrupt()/////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////
//Start of function for Pick A Song Mode                       ///////////////////////////////
//This function will primarily display the song choices        ///////////////////////////////
//then call quesitonInterrupt() everytime a song choice is made///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
function displaySongChoices(){
	
	var videoSrcArray = ["8xg3vE8Ie_E",  //Taylor Swift-Love Story
						"WmKpINPZ4D8", //Def Leppard & Talyor Swift-Love Story
						"B-9V4mfWAWk",//Def Leppard & Taylor Swift - Photograph 
						"YECmDiBhADk", //For The First Time In Forever - FROZEN 
						"L0MK7qz13bU", //Let It Go Sing - FROZEN
						"V-zXT5bIBM0" //Do You Want to Build a Snowman - FROZEN
						];
	
	//Need to stop current audio here just in case it is playing, this
	//would be possible if new song button was clicked in the middle of the song
	
	for(var i = 0;i < songArray.length;i++){//remove existing song choices if they exist
		$( "#songChoice"+i ).remove();
	}

	$( "#imageBox").hide(); //Make original slide show disappear
	$("#pausesText").hide();//hide because this is not needed
	$( ".mode3ButtonArea").css("display", "block"); //display buttons for this gameMode
	$( "#songOptionsBox" ).css("display","block");
	$("#videoPlayer").hide();
	
	
	//Create a div for every song, currently just text is displayed but eventually the thumbnail for the song will be
	for(var i = 0; i < songArray.length; i++)(function(i){ 
		
		$( "#songOptionsBox").append("<div id=\"songChoice"+i+"\"class=\"songChoice\">"+videoSrcArray[i]+"</div>");
		
		$( "#songChoice"+i).click(function() {
				alert(videoSrcArray[i]+" picked");//set the correct audio here
				videoChosen = videoSrcArray[i];
				if(player != null){
					player.cueVideoById(videoChosen);
				}
				questionInterrupt();
			});
	})(i);
	
}
////////////End of displaySongChoices///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//functions for using YouTube Player/////////////////////////////////////////////////////////////
var player;
function loadYouTubePlayer(){
	//Dynamically add script for Youtube API
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	window.onYouTubePlayerAPIReady = function() {
		console.log("YouTube Ready");
		player = new YT.Player('videoPlayer', {
			height : '490',  //min dimensions is 200x200
			width : '880',
			videoId : videoChosen,
			playerVars : { //look at documentation to see what each do.
				enablejsapi: 1, //enables the player to be controlled via IFrame or JavaScript Player API calls
				controls : 0, //do not show controls (play,seek,etc)
				fs:1,       //allow fullscreen
				showinfo : 0,  //do not display video info like title
				rel : 0,   //related videos set to not show
				//showsearch : 0, //no idea what this is
				iv_load_policy : 3, //video annotations not shown
				modestbranding:1 //player does not show a YouTube logo except on pause
				//start: 1 //specify start time in seconds
				//autoplay: 1 //this does not work in firefox
			},
			events : {
				'onReady' : onPlayerReady,
				'onStateChange' : onPlayerStateChange
				//'onError': catchError //If we want to cath the error this is where we would do it.
			}
		});
	};
}

function onPlayerReady(event) {
	//event.target.playVideo();
	//player.cueVideoById(videoChosen);
	player.playVideo();
    
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		setTimeout(stopVideo, 6000);
	} else if (event.data == YT.PlayerState.ENDED) {
		location.reload();
	}
}

function stopVideo() {
	player.stopVideo();
	displaySongChoices();
}


////////////End of displaySongChoices///////////////////////////////////////////////////////////

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

/* 
	This function will be used to write the number of pauses and also the flags for
	stop pauses and reset buttons.  I have put two globals stopFlag and resetFlag
	in line 30 and line 31 that can be used to passed into this function and written
	into our configuration file config.txt.  We will need to update these flags
	accordigly.

	The function will execute whenever the exit button in the menu (x) is pressed

	configuration file is a text file that contain 3 things as of right now
	~1: a value of the #of pauses first
	~2: a Flag (Y/N) for stop pauses second
	~3: a Flag (Y/N) for reset game third

	will implement more as we go but I think these are the important ones for now
*/  // ajax/php stuff commented out for now to avoid the alert being thrown
	// $('#exitB').click(function(){
		// $.ajax({
			// type: "POST",
			// url: "filewrite.php",
			// data: {'pause': maxPauses, 'StopFlag': stopFlag, 'ResetFlag': resetFlag},
			// error: function(XMLHttpRequest, textStatus, errorThrown) {
				// alert("An error has occured");
			// }
		// });
	// });



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



