/* This is the CSS for the "Elena's Love Story" webpage. 
/* Project: UMSL CS4500 SS2016 Group Project. 
/* Author: Chad Nelson  
/* Partners: Brett Lindsay
             Jason Pharm
			 Benjamin Leach
			 Ryan */
//Globals
//////////////////////////////////////////////////////////////////////////////////////////////////
var audio = new Audio('Audio/Love Story-Taylor Swift.mp3');//Global for ease of coding for now
var imageArray = new Array();
var numOfImages = 0; //This constant can be set incase they want to upload their own images for a song.
var counter; //setting the counter as global for this iteration for simplicity
//////////////////////////////////////////////////////////////////////////////////////////////////

//Functions to manipulate Image Area
//////////////////////////////////////////////////////////////////////////////////////////////
function displayImages(){
	var DURATION_PER_IMAGE = 1000;
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
	imageArray[0].src = 'Images/Alaina1.JPG';
	imageArray[1].src = 'Images/AlainaGrandad1.JPG';
	imageArray[2].src = 'Images/BrotherCullen.JPG';
	imageArray[3].src = 'Images/AlainasFamily.JPG';
	imageArray[4].src = 'Images/Grandparents-Alaina-USE.JPG';
	imageArray[5].src = 'Images/musicalToy-USE.JPG';
	/////////////////////////////////////////////////////////////////////////
	
	var imgArea = document.getElementById("imageBox");
	var img = document.getElementById("image");

//maybe create another function called start slide show
	var interval = setInterval(showImage,DURATION_PER_IMAGE);
	
	function showImage(){		
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
		clearInterval(interval);//this eventually will need to be called at end of song or on a pause
		}
		else if(counter == 3){//Manually setting time of interupt for now
			clearInterval(interval);
			interruptSong();
			counter++;
		}
		else{
			counter++;
			//console.log(counter);
		}
		
		//have if statment here to test for end of song to keep everything going
		
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
	$( "#popupBox" ).append( "<button id=\"resumebutton\" class=\"startbutton\">RESUME</button>" );
	
	//Add event handler for created button
	$( "#resumebutton" ).click(function() {
		document.getElementById("resumebutton").style.display = "none";
 		displayImages();
		audio.play();
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
	var button = document.getElementById("startButton");
	button.style.display = "none";
	audio.play();
}
//////////////////////////////////////////////////////////////////////////////////////////////

