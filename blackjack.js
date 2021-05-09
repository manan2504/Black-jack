$(document).ready(function() {
    //Variable to check whose turn it is
    var isPlayerTurn = true;

    //Variable to check if game is running
    var isGameRunning = false;

    //Variable to store string for message box
    var message = "";

    //Stores original pack of cards in alphabetical order
    var initDeck = $("#cards").html();

    //Used to control mute button action based on boolean value
    var playAudio = true;

    //Modal variables
    var aboutModal = $("#about-modal");
    var newGameModal = $("#start-new-modal");
    var modal = $(".modal");

    //Get the <span> element that closes the modal
    var span = $(".close");

    //For shuffling cards
    var cardsId = $("#cards");
        var deck = cardsId.html().split("\n");
        //Remove empty elements from array
        deck = deck.filter(function(elem) {
            return elem !== "";
        });

    //Show modal with info about game when About button is clicked
    $("#about").click(function() {
        aboutModal.show();
            newGameModal.hide();
    //When the user clicks on <span> (x), close the modal
        span.click(function() {
            aboutModal.hide();
        })  
    })

    //When the user clicks anywhere outside of the modal, close it
    $(document).click(function(event) {
        if (event.target == newGameModal[0]) {
            newGameModal.hide();
        } else if (event.target == aboutModal[0]) {
            aboutModal.hide();
        }
    })

    //Mutes sound when mute button is clicked
    $("#mute").click(function() {
        if (playAudio) {
            $("#mute").text("Unmute");
            playAudio = false;
        } else {
            $("#mute").text("Mute");
            playAudio = true; 
        }
    })

    //Trigger sound functions
    var shuffleAudio = $("#shuffle-sound").get(0);
    
    var flipAudio = $("#flip-sound").get(0);
    
    var youWinAudio = $("#you-win").get(0);
    
    var youLoseAudio = $("#you-lose").get(0);
    
    var youDrawAudio = $("#you-draw").get(0);
    
    var blackjackAudio = $("#blackjack").get(0);
    
    function shuffleSound() {
        if (playAudio) {
            //$("#shuffle-sound").get(0).currentTime = 0;
            //$("#shuffle-sound").get(0).play();
            shuffleAudio.currentTime = 0;
            shuffleAudio.play();
        }
    }
    function flipSound() {
        if (playAudio) {
            //$("#flip-sound").get(0).currentTime = 0;
            //$("#flip-sound").get(0).play();
            flipAudio.currentTime = 0;
            flipAudio.play();
        }
    }
    function youWinSound() {
        if (playAudio) {
            //$("#you-win").get(0).currentTime = 0;
            //$("#you-win").get(0).play();
            youWinAudio.currentTime = 0;
            youWinAudio.play();
        }
    }
    function youLoseSound() {
        if (playAudio) {
            //$("#you-lose").get(0).currentTime = 0;
            //$("#you-lose").get(0).play();
            youLoseAudio.currentTime = 0;
            youLoseAudio.play();
        }
    }
    function youDrawSound() {
        if (playAudio) {
            //$("#you-draw").get(0).currentTime = 0;
            //$("#you-draw").get(0).play();
            youDrawAudio.currentTime = 0;
            youDrawAudio.play();
        }
    }
    function blackjackSound() {
        if (playAudio) {
            //$("#blackjack").get(0).currentTime = 0;
            //$("#blackjack").get(0).play();
            blackjackAudio.currentTime = 0;
            blackjackAudio.play();
        }
    }

    //Update message box
    function updateMessage() {
        $("#message-box").fadeIn("fast");
        $("#message-box").html(message);
    }

    //Shuffle cards in deck
    function shuffleCards() {

        //Shuffle card array
        var newDeck = deck;
        var numCards = newDeck.length;
        for (var i = numCards - 1; i > 0; i--) {
            var randCard = Math.floor(Math.random() * (i + 1));
            var tempCard = newDeck[i];
            newDeck[i] = newDeck[randCard];
            newDeck[randCard] = tempCard;
          }
        //Overwrite list of cards in deck
        return cardsId.html(newDeck);
    }

    //Reset the game to original state
    function resetGame() {
        //Use original pack of cards
        $("#cards").html(initDeck);
        //Empty player and dealer hands
        $("#player-hand").html("");
        $("#dealer-hand").html("");
        isPlayerTurn = true;
        //Reset score values
        $("#dealer-score").text("");
        $("#player-score").text("");
        $("#player-score").data("score", 0);
        $("#dealer-score").data("score", 0);
        message = "";
        $("#message-box").slideUp();
        $("#message-box").removeClass("red yellow green purple");
        $("#hide-card img").hide();
        return isPlayerTurn;
    }

    //Move a card to a hand
    function moveToHand() {
        if (isPlayerTurn) {
            $("#cards img:first").appendTo($("#player-hand"));
            flipSound();
        } else {
            $("#cards img:first").appendTo($("#dealer-hand"));
        }
        return updateScore();
    }

    //Sum the card values and update dealer or player score
    function updateScore() {
        var dealerScore = $("#dealer-score").data("score");
        var playerScore = $("#player-score").data("score");

        //Turns value of Ace card 'soft'
        function makeAceSoft() {
            if (isPlayerTurn) {
                var playerAceSubtotal = 0;
                //Variable that counts the number of aces in player's hand
                var playerNumAces = $("#player-hand .ace").length;
                $("#player-hand .ace").each(function() {
                    playerAceSubtotal += Number($(this).data("card-value"));
                    if (playerAceSubtotal > 21 || playerScore > 21) {
                        if (playerNumAces > 1) {
                            $("#player-hand .ace:nth-last-child(2)").data("card-value", 1);
                        } else {
                            $(this).data("card-value", 1);
                        }
                    } 
                })
            } else {
                var dealerAceSubtotal = 0;
                //Variable that counts the number of aces in dealer's hand
                var dealerNumAces = $("#dealer-hand .ace").length;
                $("#dealer-hand .ace").each(function() {
                    dealerAceSubtotal += Number($(this).data("card-value"));
                    if (dealerAceSubtotal > 21 || dealerScore > 21) {
                        if (dealerNumAces > 1) {
                            $("#dealer-hand .ace:nth-last-child(2)").prev().data("card-value", 1);
                        } else {
                            $(this).data("card-value", 1);
                        }
                    } 
                })
            }
        }

        //Function to use if score still goes over 21
        function makeAllAcesSoft() {
            if (isPlayerTurn) {
                var playerAceSubtotal = 0;
                //Variable that counts the number of aces in player's hand
                var playerNumAces = $("#player-hand .ace").length;
                $("#player-hand .ace").each(function() {
                    playerAceSubtotal += Number($(this).data("card-value"));
                    if (playerAceSubtotal > 21 || playerScore > 21) {
                        $(this).data("card-value", 1);
                    } 
                })
            } else {
                var dealerAceSubtotal = 0;
                //Variable that counts the number of aces in dealer's hand
                var dealerNumAces = $("#dealer-hand .ace").length;
                $("#dealer-hand .ace").each(function() {
                    dealerAceSubtotal += Number($(this).data("card-value"));
                    if (dealerAceSubtotal > 21 || dealerScore > 21) {
                        $(this).data("card-value", 1);
                    }
                })
            }
        }

        //Add up value of cards in player's hand
        function sumPlayerCards() { 
                $("#player-hand img").each(function() {
                playerScore += Number($(this).data("card-value"));
            })
        }

        //Add up value of cards in dealer's hand
        function sumDealerCards() { 
                $("#dealer-hand img").each(function() {
                dealerScore += Number($(this).data("card-value"));
            })
        }

        if (isPlayerTurn) {
            playerScore = 0;
            //Sum cards initially
            sumPlayerCards();
            if (playerScore > 21) {
                makeAceSoft();
                //Reset player's score to 0 to recalculate sum of cards with soft ace value
                playerScore = 0;
                sumPlayerCards();
            }

            if (playerScore > 21) {
                makeAllAcesSoft();
                //Reset player's score to 0 to recalculate sum of cards with soft ace value
                playerScore = 0;
                sumPlayerCards();
            }

            //Pass score to display and data-score attribute
            $("#player-score").text(playerScore);
            $("#player-score").data("score", playerScore);
            return playerScore;
        } else {
            dealerScore = 0;
            //Sum cards initially
            sumDealerCards();
            if (dealerScore > 21) {
                makeAceSoft();
                //Reset dealer's score to 0 to recalculate sum of cards with soft ace value
            dealerScore = 0;
            sumDealerCards();
            }

            if (dealerScore > 21) {
                makeAllAcesSoft();
                //Reset dealer's score to 0 to recalculate sum of cards with soft ace value
            dealerScore = 0;
            sumDealerCards();
            }

            //Pass score to display and data-score attribute
            $("#dealer-score").text(dealerScore);
            $("#dealer-score").data("score", dealerScore);
            return dealerScore;
        }
    } 

    //Add two cards to each hand when Deal button is pressed
    function addTwoCards() {
        for (var i = 1; i <= 4; i++) {
            if (i < 3) {
                //Add two cards to player's hand
                setTimeout(function(i_local) {
                    return function() {
                        $("#cards img:first").appendTo($("#player-hand"));
                        flipSound();
                    }
                }(i),250*i);

            } else {
                //Add two cards to dealer's hand
                setTimeout(function(i_local) {
                    return function() {
                        $("#cards img:first").appendTo($("#dealer-hand"));
                        flipSound();
                        //Keep dealer's score hidden in display
                        $("#dealer-score").text("");
                        //Hide second card in dealer's hand
                        $("#hide-card img").show();
                    }
                }(i), 250*i);
            }
        }
    }

    //Starts game with reset game space and two new cards drawn
    function startNewGame() {
        isGameRunning = true;
        resetGame();
        shuffleSound();
        shuffleCards();
        setTimeout(addTwoCards, 600);
        setTimeout(updateScore, 2000);
        //Waits for player score to update before storing the value in a variable
        function waitForScore(){
            initPlayerScore = $("#player-score").data("score");
            if(initPlayerScore !== 0){
                //variable exists, do what you want
                    if (initPlayerScore === 21) {
                    blackjackSound();
                    $("#message-box").addClass("purple");
                    message = "Lucky! You got Blackjack with your first two cards!<br>Let's see if the dealer can match that!";
                    updateMessage();
                    setTimeout(dealerAutoplay, 2000);    
                }   
            } else {
                setTimeout(waitForScore, 2000);
            }
        }
        waitForScore();
    } 

    //Starts new game when deal button is clicked if game is not running, else it shows modal to confirm you want to start a new game
    $("#deal-button").click(function(){
        if (!(isGameRunning)) {
            startNewGame();
        } else {
            newGameModal.show();
            aboutModal.hide();
            //When user clicked on no button, close the modal
            $("#response-no").click(function(){
                newGameModal.hide();
            })

            //When user clicks on yes button, close the modal and start new game
            $("#response-yes").click(function(){
                newGameModal.hide();
                isGameRunning = false;
                location.reload();
            })

            //When the user clicks on <span> (x), close the modal
            span.click(function() {
                newGameModal.hide();
            }) 
        }
    });

    //Adds a card to player's hand when Hit button is clicked
    $("#hit-button").click(function() {
        var newPlayerScore = 0;
        if (isGameRunning && isPlayerTurn) {
            newPlayerScore = moveToHand();
            //Displays a message when player goes bust
            if (newPlayerScore > 21) {
                isGameRunning = false;
                setTimeout(checkWhoWins, 250);
                $("#hide-card img").hide();
                isPlayerTurn = false;
                updateScore();
            } else if (newPlayerScore === 21) {
                blackjackSound();
                $("#message-box").addClass("purple");
                message = "You got Blackjack!<br>Let's see if the dealer can match that!";
                updateMessage();
                setTimeout(dealerAutoplay, 2000);
            }
        } 
    });

    //makes Dealer play automatically
    var dealerAutoplay = (function() {
        var newDealerScore = 0;
        return function() {
            isPlayerTurn = false;
            $("#hide-card img").hide();
            flipSound();
            newDealerScore = updateScore();
            while (newDealerScore < 17 && $("#cards img").length > 0) {
                newDealerScore = moveToHand();
                $("#dealer-score").data("score", newDealerScore); 
            }
            if (newDealerScore >= 17) {
                isGameRunning = false;
                setTimeout(checkWhoWins, 250);
            }
        }
    })();  

    $("#stand-button").click(function() {

        if (isGameRunning) {
            dealerAutoplay();
        }
    });


    //Verdict function to see who wins the game 
    function checkWhoWins() {
        var finalPlayerScore = $("#player-score").data("score");
        var finalDealerScore = $("#dealer-score").data("score");
        if (finalPlayerScore > 21) {
            youLoseSound();
            $("#message-box").removeClass("purple");
            $("#message-box").addClass("red");
            message = "Oh no, you went bust!<br><strong>Game over.</strong><br>Press <strong>Deal</strong> to play again.";
            updateMessage();
        } else if (finalDealerScore > 21) {
            youWinSound();
            $("#message-box").removeClass("purple");
            $("#message-box").addClass("green");
            message = "The dealer went bust!<br><strong>Congratulations, you win!</strong><br>Press <strong>Deal</strong> to play again.";
            updateMessage();
        } else if (finalPlayerScore > finalDealerScore) {
            youWinSound();
            $("#message-box").removeClass("purple");
            $("#message-box").addClass("green");
            message = "You beat the dealer!<br><strong>Congratulations, you win!</strong><br>Press <strong>Deal</strong> to play again.";
            updateMessage();
        }   else if (finalDealerScore === 21 && finalPlayerScore === 21) {
            youLoseSound();
            $("#message-box").removeClass("purple");
            $("#message-box").addClass("red");
            message = "Oh no, the dealer got Blackjack too!<br><strong>Game over.</strong><br>Press <strong>Deal</strong> to play again.";
            updateMessage();
        }   else if (finalDealerScore === 21) {
            youLoseSound();
            $("#message-box").removeClass("purple");
            $("#message-box").addClass("red");
            message = "Oh no, the dealer got Blackjack!<br><strong>Game over.</strong><br>Press <strong>Deal</strong> to play again.";
            updateMessage();
        }   else if (finalDealerScore > finalPlayerScore) {
            youLoseSound();
            $("#message-box").removeClass("purple");
            $("#message-box").addClass("red");
            message = "Oh no, the dealer won!<br><strong>Game over.</strong><br>Press <strong>Deal</strong> to play again.";
            updateMessage();
        } else if (finalDealerScore === finalPlayerScore) {
            youDrawSound();
            $("#message-box").removeClass("purple");
            $("#message-box").addClass("yellow");
            message = "Not bad! You reached a draw!<br><strong>Game over.</strong><br>Press <strong>Deal</strong> to play again.";
            updateMessage();
        }
    }
    
})
