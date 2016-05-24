var a = "Hi";

$.ajax({
	type: "POST",
	url: "file.php",
	success: function(data) {
		a = data;
		console.log(a); 
	},

	async: false
});

console.log(a); 