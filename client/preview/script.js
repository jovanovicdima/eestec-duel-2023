const socket = io('http://localhost:3000', {
	transports: ['websocket'],
	path: '/socket/'
});

socket.on('changeGame', function(game) {
	if (game < 0 || game > 3) {
		return;
	}
	let container = document.getElementsByClassName('container gameContainer');
	Array.from(container).forEach(element => {
		element.classList.remove('active');
	});
	if(game == 0) {
		document.getElementById('home').classList.add('active');
		return;	
	}
	
	document.getElementById('game' + game).classList.add('active');
	document.getElementById('startingPage' + game).classList.add('active');
	document.getElementById('actualGame' + game).classList.remove('active');
	document.getElementById('endingPage' + game).classList.remove('active');
});

socket.on('updatePoints', function(team1score, team2score) {
	document.getElementById("scoreTeam1").innerHTML = "<h2>Team 1: " + team1score + " points</h2>";
	document.getElementById("scoreTeam2").innerHTML = "<h2>Team 2: " + team2score + " points</h2>";
});

// Game 1 - Slovo po slovo
socket.on('updateAnswerGame1', function(masked, letters) {
	document.getElementById("maskedWord1").innerHTML = masked;
	document.getElementById("usedLetters1").innerHTML = `Iskorišćena slova: ${letters}`;
	document.getElementById("startingPage1").classList.remove('active');
	document.getElementById("actualGame1").classList.add('active');
	document.getElementById("endingPage1").classList.remove('active');
});

socket.on('revealAnswer1', function(answer) {
	document.getElementById("maskedWord1").innerHTML = answer;
});

// Game 2 - Trka znanja
socket.on('revealAnswer2', function(answer) {
	document.getElementById("answer2").innerHTML = answer;
});

socket.on('nextQuestion2', function(question) {
	document.getElementById("question2").innerHTML = question;
	document.getElementById("answer2").innerHTML = "";
	document.getElementById("startingPage2").classList.remove('active');
	document.getElementById("actualGame2").classList.add('active');
	document.getElementById("endingPage2").classList.remove('active');
});

// Game 3 - Rekli su nam...
socket.on('revealField3', function(id, answer) {
	document.getElementById("ffAnswer" + id).innerHTML = `${answer.text} ${answer.value}`;
	document.getElementById("ffAnswer" + id).style.backgroundColor = "#FFE600";
	document.getElementById("ffAnswer" + id).style.color = "#000000";
});

socket.on('nextQuestion3', function(question, nullIndex) {
	document.getElementById("question3").innerHTML = question;

	for(let i = 1; i <= 8; i++) {
		document.getElementById("ffAnswer" + i).innerHTML = i;
		document.getElementById("ffAnswer" + i).style.backgroundColor = null;
		document.getElementById("ffAnswer" + i).style.color = "#ffcc00";
	}

	document.getElementById("startingPage3").classList.remove('active');
	document.getElementById("actualGame3").classList.add('active');
	document.getElementById("endingPage3").classList.remove('active');
	
	for(let i = nullIndex; i <= 8; i++) { // starting field from nullIndex to the last are null answers;
		document.getElementById("ffAnswer" + i).style.backgroundColor = "#2E2E2E";
	}
});

socket.on('gameEnd', function(winner) {
	document.getElementById("startingPage1").classList.remove('active');
	document.getElementById("actualGame1").classList.remove('active');
	document.getElementById("endingPage1").classList.add('active');
	document.getElementById("startingPage2").classList.remove('active');
	document.getElementById("actualGame2").classList.remove('active');
	document.getElementById("endingPage2").classList.add('active');
	document.getElementById("startingPage3").classList.remove('active');
	document.getElementById("actualGame3").classList.remove('active');
	document.getElementById("endingPage3").classList.add('active');
	if (winner == 0) {
		document.getElementById("endingPage1").innerHTML = "<div style=\"font-size: 120px; text-align: center; padding-top: 100px;\">Nerešeno!</div>";
		document.getElementById("endingPage2").innerHTML = "<div style=\"font-size: 120px; text-align: center; padding-top: 100px;\">Nerešeno!</div>";
		document.getElementById("endingPage3").innerHTML = "<div style=\"font-size: 120px; text-align: center; padding-top: 100px;\">Nerešeno!</div>";
	} else {
		document.getElementById("endingPage1").innerHTML = "<div style=\"font-size: 120px; text-align: center; padding-top: 100px;\">Pobednik je tim " + winner + "!</div>";
		document.getElementById("endingPage2").innerHTML = "<div style=\"font-size: 120px; text-align: center; padding-top: 100px;\">Pobednik je tim " + winner + "!</div>";
		document.getElementById("endingPage3").innerHTML = "<div style=\"font-size: 120px; text-align: center; padding-top: 100px;\">Pobednik je tim " + winner + "!</div>";
	}
});