//////////////////////////////////////////////////////////////////////////////
//File: Audio.js                                                            //
//Programmer(s): Ryan Admire                                                //
//Description: This file will handle the starting and stopping of the audio //
//////////////////////////////////////////////////////////////////////////////

//ideally this function will begin playing when a button is pushed or based on timing
//for now it just play on page load.

function beginPlaying(){
	var audio = new Audio('Love Story-Taylor Swift.mp3');
	audio.play();
}

beginPlaying();