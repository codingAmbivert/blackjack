(function () {
  let blackjackGame = {
    you: { cardScore: "#yourScore", div: "#yourDiv", score: 0 },
    dealer: { cardScore: "#dealerScore", div: "#dealerDiv", score: 0 },
    cards: [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "K", "Q", "A"],
    cardsMap: {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      J: 10,
      K: 10,
      Q: 10,
      A: [1, 11],
    },
    wins: 0,
    losses: 0,
    draws: 0,
    isStand: false,
    turnOver: false,
  };

  const YOU = blackjackGame.you;
  const DEALER = blackjackGame.dealer;

  const cardDisplaySound = new Audio("./assets/sounds/swish.m4a");
  const winSound = new Audio("./assets/sounds/cash.mp3");
  const looseSound = new Audio("./assets/sounds/aww.mp3");

  document
    .getElementById("blackjack-hit-btn")
    .addEventListener("click", blackjackHit);
  document
    .getElementById("blackjack-deal-btn")
    .addEventListener("click", blackjackDeal);

  function blackjackHit() {
    if (blackjackGame.isStand === false) {
      let card = randomCard();
      displayCard(card, YOU);
      updateScore(card, YOU);
      displayScore(YOU);
      blackjackGame.turnOver === false;
    }
    document
      .getElementById("blackjack-stand-btn")
      .addEventListener("click", blackjackStand);
  }

  function displayCard(card, activePlayer) {
    if (activePlayer.score <= 21) {
      let cardImage = document.createElement("img");
      cardImage.src = `./assets/images/${card}.png`;
      cardImage.setAttribute("id", "play");
      document.querySelector(activePlayer.div).append(cardImage);
      cardDisplaySound.play();
    }
  }

  function randomCard() {
    let random = Math.floor(Math.random() * 13);
    return blackjackGame.cards[random];
  }

  function updateScore(card, activePlayer) {
    let score = blackjackGame.cardsMap[card];
    if (card === "A") {
      if (activePlayer.score + blackjackGame.cardsMap[card][1] <= 21) {
        return (activePlayer.score += blackjackGame.cardsMap[card][1]);
      } else {
        return (activePlayer.score += blackjackGame.cardsMap[card][0]);
      }
    } else {
      return (activePlayer.score += score);
    }
  }
  function displayScore(activePlayer) {
    if (activePlayer.score <= 21) {
      document.querySelector(activePlayer.cardScore).innerText =
        activePlayer.score;
    } else {
      document.querySelector(activePlayer.cardScore).innerText = "BUST!";
      document.querySelector(activePlayer.cardScore).style.color = "red";
    }
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function blackjackStand() {
    blackjackGame.isStand = true;
    while (DEALER.score < 16 && blackjackGame.isStand === true) {
      let card = randomCard();
      displayCard(card, DEALER);
      updateScore(card, DEALER);
      displayScore(DEALER);
      await sleep(1000);
    }
    let winner = updateResult();
    displayResult(winner);
    blackjackGame.turnOver = true;
  }

  function updateResult() {
    let winner;
    if (YOU.score <= 21) {
      if (YOU.score > DEALER.score || DEALER.score > 21) {
        blackjackGame.wins++;
        winner = YOU;
      } else if (YOU.score < DEALER.score) {
        blackjackGame.losses++;
        winner = DEALER;
      } else if (YOU.score === DEALER.score) {
        blackjackGame.draws++;
      }
    } else if (DEALER.score <= 21 && YOU.score > 21) {
      blackjackGame.losses++;
      winner = DEALER;
    } else if (YOU.score > 21 && DEALER.score > 21) {
      blackjackGame.draws++;
    }
    return winner;
  }
  function displayResult(winner) {
    if (winner === YOU) {
      document.getElementById("blackjackResult").innerText = "You win!";
      document.getElementById("blackjackResult").style.color = "green";
      document.getElementById("wins").innerText = blackjackGame.wins;
      winSound.play();
    } else if (winner === DEALER) {
      document.getElementById("blackjackResult").innerText = "You lose!";
      document.getElementById("blackjackResult").style.color = "red";
      document.getElementById("losses").innerText = blackjackGame.losses;
      looseSound.play();
    } else {
      document.getElementById("blackjackResult").innerText = "It's a Tie!";
      document.getElementById("blackjackResult").style.color = "black";
      document.getElementById("draws").innerText = blackjackGame.draws;
    }
  }
  function blackjackDeal() {
    if (blackjackGame.turnOver === true) {
      let yourImages = document.querySelector(YOU.div).querySelectorAll("img");
      let dealerImages = document
        .querySelector(DEALER.div)
        .querySelectorAll("img");

      for (i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
      }
      for (i = 0; i < dealerImages.length; i++) {
        dealerImages[i].remove();
      }

      YOU.score = 0;
      DEALER.score = 0;

      document.querySelector(YOU.cardScore).innerText = YOU.score;
      document.querySelector(YOU.cardScore).style.color = "#fff";
      document.querySelector(DEALER.cardScore).innerText = DEALER.score;
      document.querySelector(DEALER.cardScore).style.color = "#fff";

      document.getElementById("blackjackResult").innerText = "Let's play ";
      document.getElementById("blackjackResult").style.color = "black";
      blackjackGame.isStand = false;
    }
    document
      .getElementById("blackjack-stand-btn")
      .removeEventListener("click", blackjackStand);
  }
})();
