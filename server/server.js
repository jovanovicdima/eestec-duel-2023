const { Server } = require("socket.io");
const io = new Server({
  path: "/socket/"
});
let port = 3000;

let questions = [];
let questionCounter = 0;

let team1Score = 0;
let team2Score = 0;
let question = {};
let mistakes = 0;
let tempScore = 0;

io.on('connection', socket => {
    console.log(`Connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
    });
    
    // Change game
    socket.on('changeGame', id => {
        resetStats(socket);
        socket.broadcast.emit('changeGame', id);
    });

    socket.on('loadQuestions', object => {
        resetStats(socket);

        if(object.game1 != null) {
            questions = object.game1;
        }
        else if(object.game2 != null) {
            questions = object.game2;
        }
        else if(object.game3 != null) {
            questions = object.game3;
        }
    });

    // Game 1 - Slovo po slovo
    socket.on('letterGuess1', letter => {
        if(question.guesses.includes(letter)) {
            //socket.broadcast.emit('letterUsed'); //TODO - implement error message in ../client/controller
            return;
        }
        question.guesses.push(letter);
        
        question.masked = question.masked.split("")
        for(let i = 0; i < question.text.length; i++) {
            if(question.text[i] == letter) {
                question.masked[i] = letter;
            }
        }

        question.masked = question.masked.join("");
        console.log(question.masked)
        socket.broadcast.emit('updateAnswerGame1', question.masked, question.guesses);
    });

    socket.on('revealAnswer1', team => {
        if(team == 1) team1Score++;
        else if(team == 2) team2Score++
        socket.broadcast.emit('updatePoints', team1Score, team2Score);
        socket.broadcast.emit('revealAnswer1', question.text);
    });

    socket.on('nextQuestion1', () => {
        if(questionCounter >= questions.length) {
            socket.broadcast.emit('gameEnd', whoIsWinner());
            return;
        }
    
        question.text = questions[questionCounter++].text;
        question.masked = "";
        for(let item of question.text) {
            if(item == " ") question.masked += " ";
            else question.masked += "_";
        }
        question.guesses = [];
        socket.broadcast.emit('updateAnswerGame1', question.masked, question.guesses);
    });

    // Game 2 - Trka znanja
    socket.on('revealAnswer2', team => {
        if(team == 1) team1Score++;
        else if(team == 2) team2Score++
        socket.broadcast.emit('updatePoints', team1Score, team2Score);
        socket.broadcast.emit('revealAnswer2', question.answer);
    });

    socket.on('wrongAnswer2', team => {
        if(team == 1) team1Score--;
        else if(team == 2) team2Score--
        socket.broadcast.emit('updatePoints', team1Score, team2Score);
    });

    socket.on('nextQuestion2', () => {
        if(questionCounter >= questions.length) {
            socket.broadcast.emit('gameEnd', whoIsWinner());
            return;
        }
        
        question.text = questions[questionCounter].text;
        question.answer = questions[questionCounter].answer;
        questionCounter++;
        socket.broadcast.emit('nextQuestion2', question.text)
    });

    // Game 3 - Rekli su nam...
    socket.on('revealField3', id => {
        tempScore += question.answers[id - 1].value;
        console.log(question.answers[id - 1])
        socket.broadcast.emit('revealField3', id, question.answers[id - 1]);
    });

    socket.on('addMistake', () => {
        socket.broadcast.emit(++mistakes);
    });

    socket.on('assignPoints3', team => {
        if(team == 1) team1Score += tempScore;
        else team2Score += tempScore;
        socket.broadcast.emit('updatePoints', team1Score, team2Score);
    });

    socket.on('nextQuestion3', () => {
        if(questionCounter >= questions.length) {
            socket.broadcast.emit('gameEnd', whoIsWinner());
            return;
        }
        mistakes = 0;
        tempScore = 0;

        console.log(questions[questionCounter]);

        question.text = questions[questionCounter].question;
        question.answers = questions[questionCounter].answers;

        questionCounter++;

        let nullIndex = 0;
        for(let i = 0; i < question.answers.length; i++) {
            if(question.answers[i].text == "null") {
                nullIndex = i + 1;
                break;
            }
        }
        socket.broadcast.emit('nextQuestion3', question.text, nullIndex);
        socket.emit('adminNextQuestion3', question);
    });
});

io.listen(port);
console.log(`Server started on port ${port}`);

function whoIsWinner() {
    if(team1Score > team2Score) return 1;
    if(team1Score == team2Score) return 0;
    return 2;
}

function resetStats(socket) {
    team1Score = 0;
    team2Score = 0;
    socket.broadcast.emit('updatePoints', team1Score, team2Score);
    questionCounter = 0;
    questions = {};
    tempScore = 0;
}