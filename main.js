// get random r/theonion post

let score = 0;

let source = 0; // 0 = onion, 1 = real
let link = "", title = "";

const getOnion = () => {
    $.getJSON('https://www.reddit.com/r/TheOnion/random.json', function(data) {
        title = data[0].data.children[0].data.title;
        link = data[0].data.children[0].data.url_overridden_by_dest;

        $('#title').text(`"${he.decode(title)}"`);
        $('.button').removeClass('correct incorrect');
    });
};

const getReal = () => {
    $.getJSON('https://www.reddit.com/r/NotTheOnion/random.json', function(data) {
        title = data[0].data.children[0].data.title;
        link = data[0].data.children[0].data.url_overridden_by_dest;
        
        $('#title').text(`"${he.decode(title)}"`);
        $('.button').removeClass('correct incorrect');
    });
}

// randomly select an onion or real post
const getRandom = () => {

    $(".last > a").attr("href", link);

    source = Math.floor(Math.random() * 2);
    if (source === 0) {
        getOnion();
    } else {
        getReal();
    }
}

function setResults(){
    $("#results h2").text(`"${title}" was ${source === 0? "FAKE" : "REAL"}!`);
    $("#results p").text(`You got ${score === 0 ? 'zero' : score} in a row right.`);
    
    $("#results a").attr("href", link);
}

function guess(num, buttonID){
    if (num === source) {
        score++;
        $('#'+buttonID).addClass('correct');

        // set high score to localstorage if higher 
        if (score > localStorage.getItem('highScore')) {
            localStorage.setItem('highScore', score);
            $('#highscore').text(`High Score: ${score}`);
        }

        $("#results").hide();

        setTimeout(getRandom, 1000);

    } else {
        $('#'+buttonID).addClass('incorrect');
        
        setResults();
        $("#results").show();

        score = 0;
    }

    $('#score').text(`Score: ${score}`);
}

$("#results button").click(function(){
    $("#results").hide();
    setTimeout(getRandom, 1000);
});

$(".help").click(function(){
    $("#help").show();
});

$("#help button").click(function(){
    $("#help").hide();
});

$("#onion-button").click(function() {
    guess(0, "onion-button");
});

$("#not-button").click(function() {
    guess(1, "not-button");
});

$(document).ready(function() {
    // load high score from storage
    if (localStorage.getItem('highScore')!== null) {
        $('#highscore').text(`High Score: ${localStorage.getItem('highScore')}`);
    }

    $("#results").hide();
    $("#help").hide();

    getRandom();
});