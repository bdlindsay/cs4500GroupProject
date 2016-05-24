<?php
///////////////////////////////////////////////////////////////////////////////////
///// This is a php file that handles the server side File write //////////////////
///////////////////////////////////////////////////////////////////////////////////

	$fp = fopen('config.txt', 'w');
	$pause_num = $_POST['pause'];
	$pause_as_string = (string)$pause_num;
	$stop_pause = $_POST['StopFlag'];
	$reset_game = $_POST['ResetFlag'];

	fwrite($fp, $pause_as_string);
	fwrite($fp, "\n");
	fwrite($fp, $stop_pause);
	fwrite($fp, "\n");
	fwrite($fp, $reset_game);

	fclose($fp);

?>