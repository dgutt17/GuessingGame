function generateWinningNumber(){
    var answer = 100*Math.random()
    if(answer < 1){
        return 1;
    } else if(answer === Math.round(answer)){
        return answer + 1;
    } else {
        return Math.round(answer);
    }
}

function shuffle(arr){
 
   var j, x, i;
   for(i = arr.length - 1; i > 0; i--){
       j = Math.floor(Math.random() * (i + 1));
       x = arr[i];
       arr[i] = arr[j];
       arr[j] = x;
   }
   return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
    if(this.playersGuess < this.winningNumber){
        return true;
    }
    return false;
}

Game.prototype.playersGuessSubmission = function (num) {
    if(num < 1 || num > 100 || !Number(num)){
        throw 'That is an invalid guess.'
    }
    this.playersGuess = num;
    return this.checkGuess(); 
}

Game.prototype.checkGuess = function () {
    if(this.playersGuess === this.winningNumber){
        $('#subtitle').text('Click the Reset Button')
        $('#hint, #submit').prop("disabled",true);
        return 'You Win!';        
    } if(this.pastGuesses.indexOf(this.playersGuess) !== -1){
        return 'You have already guessed that number.';
    } if(this.pastGuesses.indexOf(this.pastGuesses) === -1 && this.playersGuess !== this.winningNumber){
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    } if(this.pastGuesses.length === 5){
        $('#subtitle').text('Click the Reset Button')
        $('#hint, #submit').prop("disabled",true);
        return 'You Lose.';
    } else {
        if(this.playersGuess < this.winningNumber){
            $('#subtitle').text('Guess Higher!')
        } else {
            $('#subtitle').text('Guess Lower!') 
        }
        if(this.playersGuess - this.winningNumber < 10){
            return 'You\'re burning up!';
        } if(this.playersGuess - this.winningNumber < 25){
            return 'You\'re lukewarm.';
        } if(this.playersGuess - this.winningNumber < 50){
            return 'You\'re a bit chilly.';
        } if(this.playersGuess - this.winningNumber < 100){
            return 'You\'re ice cold!';
        } 
    }
}

function newGame () {
    Game.call(this);
    return {
        playersGuess: null,
        pastGuesses: [],
    }
}

Game.prototype.provideHint = function () {
    var finalArray = [];
    finalArray.push(this.winningNumber);
    finalArray.push(generateWinningNumber());
    finalArray.push(generateWinningNumber());
    return shuffle(finalArray);
}

function makeAGuess(game){
    var playerInput = $('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(parseInt(playerInput, 10));
    $('#title').text(output);
    console.log(output);
}

$(document).ready(function (){
    console.log('ready');
    var game = new Game;
   $('#submit').on('click', function(){
       makeAGuess(game);
   });
   $('#reset').on('click', function (){
        window.location.reload();
   })
   $('#hint').on('click', function(){
       var newHint = game.provideHint();
       $('#subtitle').text(`The winning number is ${newHint[0]}, ${newHint[1]}, or ${newHint[2]}.`);
   })
   $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
            makeAGuess(game);
        }
    });
});
