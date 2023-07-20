function matching() {
    //----- keep the tag below; it is replaced with code from the deploy script
    document.querySelector("#container").classList.add("transition");

    function play() {
        var audioFlip = document.getElementById("audio1");
        var audioWrong = document.getElementById("audio2");
        var audioRight = document.getElementById("audio3");
    }

    function Flip() {
        //controls how cards are "flipped"
        audio1.play();
        if (locked) return; //return from function if locked is true so rest of the code will not be run
        if (this === first) return;
        this.style.cssText = this.style.cssText + "transform:" + transformString[this.id] + "rotateY(180deg)";
        if (!firstchosen) {
            //when the variable "firstchosen" is false
            firstchosen = true; //set variable to true
            first = this; //sets first card to whichever card you clicked first
        } //when the variable "firstchosen" is not false
        else {
            firstchosen = false;
            second = this; //sets second card to whichever card you clicked second
            Matching(); //calls the function Matching
        }
    }

    function Matching() {
        //controls how cards are checked to see if they match
        if (first.dataset.framework === second.dataset.framework) {
            //if the first and second card matches, === is has to match
            right();
            if (roundCount === totalRoundCount) {
                if (totalRoundCount === 6) {
                    gameOver();
                } else {
                    setTimeout(() => {
                        newRound();
                    }, 1000);
                }
            }
        } // if the 1st and 2nd cards DO NOT match flip the cards over again
        else {
            wrong();
        }
    }

    function wrong() {
        //when the cards DO NOT match flip them over again
        locked = true; //locks board until after the timer & flip runs
        //set a time for 1.5 seconds before flipping the cards back
        setTimeout(() => {
            //console.log(first.style);
            //console.log(second.style);
            audio2.currentTime = 0;
            audio2.play();
            first.style.cssText = "transform:" + transformString[first.id];
            second.style.cssText = "transform:" + transformString[second.id];
            resetBoard(); //calls reset function
        }, 1000);
    }

    function right() {
        //when the cards DO match keep them open
        cardsMatched++;
        first.removeEventListener("click", Flip);
        second.removeEventListener("click", Flip);
        setTimeout(() => {
            first.style.opacity = "0";
            second.style.opacity = "0";
            document.getElementById("cMatch").innerHTML = "Найдено пар: " + cardsMatched;
        }, 1000);
        audio3.currentTime = 0;
        audio3.play();
        roundCount++;
    }

    function resetBoard() {
        //resets all variables for an initial board state
        firstchosen = false; //sets variable to false
        locked = false; //sets variable to false
        first = null; //empties variable
        second = null; //empties variable
    }

    function shuffle(cards) {
        //used to  shuffle the cards around every game
        for (let n = 0; n < totalCards; n++) {
            numList.push(n);
        }

        setTimeout(() => {
            cards.forEach((cards) => {
                //cards.classList.remove("flip");
                cards.style.opacity = "1";
            });

            cards.forEach((card) => {
                var index; //get a number that corresponds with a location within the array numList
                var newPick; //get the value within the array
                var x;
                while (numList[0] !== undefined) {
                    index = Math.floor(Math.random() * numList.length); //get a number that corresponds with a location within the array numList
                    newPick = numList[index]; //get the value within the array
                    x = numList.splice(index, 1);
                    order.push(newPick);
                }
            });
            for (let n = 0; n < totalCards; n++) {
                var visibleCard;
                visibleCard = document.getElementById(n);
                visibleCard.classList.remove("noUse");
            }
            moveCards();
            resetBoard();

            const timeBeforeFlip = totalRoundCount <= 4 ? 2000 : 5000;

            setTimeout(() => {
                cards.forEach((card) => {
                    card.style.cssText = card.style.cssText.replace("rotateY(180deg)", "");
                });
            }, timeBeforeFlip);
        }, 1000);
    }

    function moveCards() {
        var currentCard;
        order.forEach(function (cardNum, orderIndex) {
            // order is something like [3, 2, 0, 1] -- these are where you want the cards to go, in other words the TARGET S(cardNum)
            // orderIndex is 0,1,2,3 -- these are the SOURCE locations of the cards
            /*
        X translation formula: (100 * (target % 4 - source % 4))%, ((target % 4 - source % 4) * 10)px
        X translation:         (100 * (0      % 4 - 4      % 4))%, ((0      % 4 - 4      % 4) * 10)px
        Y translation formula: (100 * (target / 4 - source / 4))%, ((target / 4 - source / 4) * 10)px // make sure to FLOOR divisions
        Y translation:         (100 * ((0      - 4     )   / 4))%, (((0      - 4     )   / 4) * 10)px
        */ //var actual = orderIndex + 1;
            currentCard = document.getElementById("" + orderIndex);
            var perX = 100 * ((cardNum % 4) - (orderIndex % 4));
            var pixX = ((cardNum % 4) - (orderIndex % 4)) * 10;
            var perY = 100 * (Math.floor(cardNum / 4) - Math.floor(orderIndex / 4));
            var pixY = (Math.floor(cardNum / 4) - Math.floor(orderIndex / 4)) * 10;
            transformString.push(
                "translate(calc(" + perX + "% + " + pixX + "px), calc(" + perY + "% + " + pixY + "px))"
            );
            currentCard.style.cssText =
                currentCard.style.cssText +
                "transform: translate(calc(" +
                perX +
                "% + " +
                pixX +
                "px), calc(" +
                perY +
                "% + " +
                pixY +
                "px))" + " rotateY(180deg)";
            //currentCard.style.cssText = currentCard.style.cssText + "rotateY(180deg)";
        });
        //console.log(order);
        //console.log(transformString);
    }

    let first, second; //empty variables for first and second cards chosen
    let firstchosen = false; //did player choose a 1st card, sets the variable to false
    let locked = false; //used to prevent player from picking more cards after you have picked 2 already, sets variable to false
    let roundCount = 0;
    let totalRoundCount = 2; //starts at 2 since there are 2 pairs
    let cards; //card objects
    let inUse; //objects that need to
    let numList = []; //list of numbers that order copys
    let order = []; //array to set position of cards
    let totalCards = 4; //total amount of cards per round, add 2 each round
    let transformString = [];
    let currentRound = 1;
    let cardsMatched = 0;
    let w = window.innerWidth;
    let h = window.innerHeight;
    //let gOverText;
    const pos = [0, 106.8, 213.6, 320.4]; // %'s used to translate cards when width & height are 640px

    function newRound() {
        roundCount = 0;
        totalRoundCount++; //keep but erase for now so game works
        cardsMatched = 0;
        cards = null;
        order = []; //reset array order
        transformString = [];
        totalCards += 2;
        currentRound++;
        activateCards();
    }

    function activateCards() {
        //console.log("ACTIVATE!");
        //playArea = document.querySelector('.inUse');
        //console.log(playArea);
        //playArea.style.cssText += 'width: 75%';
        //playArea.style.cssText += 'height: 75%'
        cards = document.querySelectorAll(".memory-card"); //selects all objects that are identified under the class memory-card, and sticks them under the variable cards
        shuffle(cards);

        setTimeout(() => {
            document.getElementById("cRound").innerHTML = "Раунд: " + currentRound;
            document.getElementById("cMatch").innerHTML = "Найдено пар: 0";
        }, 1000);

        cards.forEach((cards) => {
            cards.classList.add("flip");
            cards.addEventListener("click", Flip)
        }); //for each object within the variable cards, check for a click. If a click is recognized call the function Flop
    }

    function gameOver() {
        setTimeout(() => {
            //resetBoard();
            document.getElementById("over").style.cssText =
                document.getElementById("over").style.cssText + "visibility: visible;";
            //----- keep the below tags; they are replaced with code from the deploy script
            document.querySelector("#container").classList.add("no-opacity");
            changeScene();
            //-----
        }, 1000);
        //alert("Game Over");
    }
    // we have replaced the onload function with 'defer' in the associated script tag
    //window.onload = function()//when web window is open up run a function
    //{
    activateCards();
    //}
}
