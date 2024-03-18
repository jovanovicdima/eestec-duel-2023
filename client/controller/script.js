const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    path: '/socket/'
});

function showDiv(index) {
    const panelContainer = document.getElementById('panelContainer');
    const divs = panelContainer.querySelectorAll('div');
    divs.forEach((div) => {
        div.classList.remove('active');
    });

    const selectedDiv = document.getElementById(`div${index + 1}`);
    selectedDiv.classList.add('active');
    const selectedDivChildren = selectedDiv.querySelectorAll('div');
    selectedDivChildren.forEach((child) => {
        child.classList.add('active');
    });
    const navbar = document.getElementById('navbar');
    const navItems = navbar.querySelectorAll('li');
    navItems.forEach((navItem) => {
        navItem.children[0].classList.remove('active');
    });
    const selectedNavItem = document.getElementById(`nav-item-${index + 1}`);
    selectedNavItem.children[0].classList.add('active');
    if (index >= 0) {
        socket.emit("changeGame", index);
    }
}

function swapAdding(index) {
    const questionContainer = document.getElementById('questionContainer');
    const divs = questionContainer.querySelectorAll("article");
    divs.forEach((div) => {
        div.classList.remove('active');
    });

    const selectedDiv = document.getElementById(`questionDiv${index + 1}`);
    selectedDiv.classList.add('active');
    const selectedDivChildren = selectedDiv.querySelectorAll('div');
    selectedDivChildren.forEach((child) => {
        child.classList.add('active');
    });
    const navbar = document.getElementById('verticalNav');
    const navItems = navbar.querySelectorAll('li');
    navItems.forEach((navItem) => {
        navItem.children[0].classList.remove('active');
    });
    const selectedNavItem = document.getElementById(`vertical-nav-item-${index + 1}`);
    selectedNavItem.children[0].classList.add('active');
}

// Game 1 - Slovo po slovo
function nextQuestion1() {
    socket.emit("nextQuestion1");
}

function revealAnswer1(team) {
    socket.emit("revealAnswer1", team);
}

function guessLetter1() {
    const letterGuess = $('#letterGuess').val().trim();
    console.log(letterGuess)
    $('#letterGuess').val("");
    if(letterGuess.length > 1) {
        alert("Please enter only one letter.");
        return;
    }
    if(letterGuess === "") {
        alert("Please enter a letter guess.");
        return;
    }
    socket.emit("letterGuess1", letterGuess.toUpperCase());
}

// Game 2 - Trka znanja
function nextQuestion2() {
    socket.emit("nextQuestion2");
}

function revealAnswer2(team) {
    socket.emit("revealAnswer2", team);
}

function wrongAnswer2(team) {
    socket.emit("wrongAnswer2", team);
}

// Game 3 - Rekli su nam...
function nextQuestion3() {
	socket.emit("nextQuestion3");
	$('.ffField').each(function() {
		this.style.backgroundColor = "lightblue";
	});
}

function addPoints3(team) {
    socket.emit("assignPoints3", team);
}

function addMistake() {
    socket.emit("addMistake");
}

$('.ffField').on('click', function() {
    const id = $(this).attr('id');
    this.classList.add("disabled");
    this.style.backgroundColor = "lightgreen";
    socket.emit("revealField3", id[id.length - 1]);
});

socket.on('adminNextQuestion3', question => {
    console.log('admin');
    for(let i = 1; i <= 8; i++) {
        document.getElementById(`ffField${i}`).classList.remove("disabled");
        document.getElementById(`ffField${i}`).innerHTML = question.answers[i - 1].text;
        console.log(question.answers[i - 1].text);
        if(question.answers[i - 1].text == "null") {
            document.getElementById(`ffField${i}`).classList.add("disabled");
        }
        console.log(`ffField${i}`);
    }
});

// Create questions
function addMoreFields1() {
    const questionDiv = document.getElementById("sentenceInputArea");
    const divToAppend = questionDiv.lastElementChild.cloneNode(true);
    divToAppend.getElementsByClassName("firstQuestionSentance")[0].value = "";
    questionDiv.appendChild(divToAppend);
}

function removeFields1() {
    const words = document.getElementsByClassName("firstQuestionSentance");
    if (words.length <= 1) {
        alert("Not enough fields");
        return;
    }
    const questionDiv = document.getElementById("sentenceInputArea");
    questionDiv.removeChild(questionDiv.lastChild);
}

function resetFields1() {
    $(".firstQuestionSentance").each(function() {
        this.value = "";
    });
}

function createFirstJson() {
    let value = { game1: [] };
    $(".firstQuestionSentance").each(function() {
        if(this.value == "") {
            alert("Please fill all fields.");
            return;
        }
        value.game1.push({ text: this.value.toUpperCase() });
    })
    download('firstGame.json', JSON.stringify(value));
}

function addMoreFields2() {
    const questionDiv = document.getElementById("secondGameInputArea");
    const divToAppend = questionDiv.lastElementChild.cloneNode(true);
    divToAppend.getElementsByClassName("secondQuestionText")[0].value = "";
    divToAppend.getElementsByClassName("secondQuestionAnswer")[0].value = "";
    questionDiv.appendChild(divToAppend);
}

function removeFields2() {
    const words = document.getElementsByClassName("secondQuestionText");
    if (words.length <= 1) {
        alert("Not enough fields");
        return;
    }
    const questionDiv = document.getElementById("secondGameInputArea");
    questionDiv.removeChild(questionDiv.lastChild);
}

function resetFields2() {
    $(".secondQuestionText").each(function() {
        this.value = "";
    });
    $(".secondQuestionAnswer").each(function() {
        this.value = "";
    });
}

function createSecondJson() {
    let value = { game2: [] };
    const qText = document.getElementsByClassName("secondQuestionText");
    const qAns = document.getElementsByClassName("secondQuestionAnswer");
    for(let i = 0; i < qText.length; i++) {
        if(qText.item(i).value == "" || qAns.item(i).value == "") {
            alert("Please fill all fields.");
            return;
        }
        value.game2.push({text: qText.item(i).value, answer: qAns.item(i).value});
    }
    download('secondGame.json', JSON.stringify(value));
}

function addMoreFields3() {
    const questionDiv = document.getElementById("thirdGameInputArea");
    const divToAppend = questionDiv.lastElementChild.cloneNode(true);
    divToAppend.getElementsByClassName("thirdQuestionText")[0].value = "";
    for (let i = 0; i < 8; ++i) {
        divToAppend.getElementsByClassName("thirdQuestionAnswer")[i].value = "";
        divToAppend.getElementsByClassName("thirdQuestionValue")[i].value = "";
    }
    questionDiv.appendChild(divToAppend);
}

function removeFields3() {
    const words = document.getElementsByClassName("thirdQuestionText");
    if (words.length <= 1) {
        alert("Not enough fields")
        return;
    }
    const questionDiv = document.getElementById("thirdGameInputArea");
    questionDiv.removeChild(questionDiv.lastChild);
}

function resetFields3() {
    $(".thirdQuestionText").each(function() {
        this.value = "";
    });
    $(".thirdQuestionAnswer").each(function() {
        this.value = "";
    });
    $(".thirdQuestionValue").each(function() {
        this.value = "";
    });
}

function createThirdJson() {
    const qText = document.getElementsByClassName("thirdQuestionText");
    const qAns = document.getElementsByClassName("thirdQuestionAnswer");
    const qVal = document.getElementsByClassName("thirdQuestionValue");
    let value = { game3: [] };
    for (let i = 0; i < qText.length; i++) {
		if (qText.item(i).value == "") {
			alert("Enter question text!");
			return;
		}
        value.game3.push( {question: qText.item(i).value, answers: []} )
        for (let j = 0; j < 8; j++) {
            if(qAns.item(i * 8 + j).value == "" || qVal.item(i * 8 + j).value == "") value.game3[i].answers.push( { text: "null", value: 0} );
            else value.game3[i].answers.push( { text: qAns.item(i*8+j).value, value: parseInt(qVal.item(i*8+j).value)} );
        }
    }
    download('thirdGame.json', JSON.stringify(value));
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function onChange1(event) {
    let reader = new FileReader();
    reader.onload = event => {
        obj = JSON.parse(event.target.result);
        if(obj.game1 == null) {
            alert("Bad Hangman file");
            return;
        }
        console.log(obj)
        socket.emit("changeGame", 1);
        socket.emit("loadQuestions", obj);
    }
    reader.readAsText(event.target.files[0]);
}

function onChange2(event) {
    let reader = new FileReader();
    reader.onload = event => {
        obj = JSON.parse(event.target.result);
        if(obj.game2 == null) {
            alert("Bad Ko zna zna file");
            return;
        }
        console.log(obj)
        socket.emit("changeGame", 2);
        socket.emit("loadQuestions", obj);
    }
    reader.readAsText(event.target.files[0]);
}

function onChange3(event) {
    let reader = new FileReader();
    reader.onload = event => {
        obj = JSON.parse(event.target.result);
        if(obj.game3 == null) {
            alert("Bad Family feud file");
            return;
        }
        console.log(obj)
        socket.emit("changeGame", 3);
        socket.emit("loadQuestions", obj);
        $('.ffField').each(function() {
            this.style.backgroundColor = "lightblue";
        });
    }
    reader.readAsText(event.target.files[0]);
}

document.getElementById("questionsUpload1").addEventListener("click", function() {
    this.value = "";
});

document.getElementById("questionsUpload2").addEventListener("click", function() {
    this.value = "";
});

document.getElementById("questionsUpload3").addEventListener("click", function() {
    this.value = "";
});

document.getElementById("questionsUpload1").addEventListener("change", onChange1);
document.getElementById("questionsUpload2").addEventListener("change", onChange2);
document.getElementById("questionsUpload3").addEventListener("change", onChange3);
