<template>
  <div id="app">
    <colorselection @colorSelected="setColor" v-if="showColorSelect" />
    <div class="playfield">
      <div class="drawStack">
        <card
          :visible="false"
          :class="moveDone ? '' : 'active'"
          :data="cardStack[0]"
          @click="drawCard()"
        ></card>
        <p>Left: {{ cardStack.length }}</p>
      </div>
      <div class="playedCards">
        <card v-if="lastPlayed" :data="lastPlayed"></card>
        <button @click="endTurn()" class="endTurn" :disabled="!moveDone">
          <span>End turn</span>
          <font-awesome-icon class="icon" icon="fa-solid fa-angles-right" />
        </button>
      </div>
    </div>
    <div class="playerCards">
      <p class="playerIndicator">
        {{currentPlayer.name}}
      </p>
      <card
        v-for="(card, index) in currentPlayer.cards"
        :key="index"
        :data="card"
        :playable="isPlayable(card) && !moveDone"
        :visible="!moveDone"
        @click="playCard(index)"
        :class="moveDone ? '' : 'active'"
      />
    </div>
  </div>
</template>

<script>
import card from "./components/card.vue";
import colorselection from "./components/colorselection.vue";

import { defaultCards } from "./js/uno";

export default {
  name: "App",
  components: { card, colorselection },
  data() {
    return {
      cardStack: [],
      usedCards: [],
      currentPlayerIndex: 0,
      playerCount: 2,
      moveDone: false,
      players: [],
      showColorSelect: false,
      cardsToDraw: 0,
      nextPlayerSkipped: false,
    };
  },
  computed: {
    lastPlayed() {
      return this.usedCards[this.usedCards.length - 1];
    },
    currentPlayer() {
      return this.players[this.currentPlayerIndex];
    },
  },
  methods: {
    playCard(index) {
      const card = this.currentPlayer.cards[index];
      if (!this.isPlayable(card)) return;
      this.usedCards.push(card);
      this.currentPlayer.cards.splice(index, 1);
      this.moveDone = true;

      switch (card.type) {
        case "wild":
          this.showColorSelect = true;
          break;

        case "draw4":
          this.showColorSelect = true;
          this.cardsToDraw += 4;
          break;

        case "draw":
          this.cardsToDraw += 2;
          break;

        case "reverse":
          this.reverseOrder();
          break;

        case "skip":
          this.skipNextPlayer();
          break;

        default:
          break;
      }
    },
    drawCard() {
      this.currentPlayer.cards.push(this.cardStack.pop());
      if (this.cardStack.length == 0) {
        this.shuffleUsedCards();
      }
      this.moveDone = true;
    },
    isPlayable(card) {
      if (["wild", "draw4"].includes(card.type)) return true;

      if (card.color == this.lastPlayed.color) return true;

      if (card.type == "number" && this.lastPlayed.type == "number") {
        return card.number == this.lastPlayed.number;
      }

      return card.type == this.lastPlayed.type;
    },
    shuffleUsedCards() {
      if (this.usedCards.length < 2) return;
      console.log(this.usedCards);
      this.cardStack = [...this.usedCards];
      this.usedCards = [this.cardStack.pop()];
      console.log(this.cardStack);
      console.log(this.usedCards);
    },
    endTurn() {
      this.moveDone = false;
      if (this.currentPlayerIndex > this.playerCount - 2) {
        this.currentPlayerIndex = 0;
        return;
      }
      this.currentPlayerIndex++;
    },
    setColor(color) {
      this.lastPlayed.color = color;
      this.showColorSelect = false;
    },
    reverseOrder() {},
    skipNextPlayer() {},
  },
  created() {
    for (let i = 0; i < this.playerCount; i++) {
      this.players.push({
        name: `Player ${i + 1}`,
        cards: [],
      });
    }

    this.cardStack = this.shuffleArray(defaultCards);
    this.usedCards.push(this.cardStack.pop());

    for (let playerNum = 0; playerNum < this.playerCount; playerNum++) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          this.players[playerNum].cards.push(this.cardStack.pop());
        }, i * 200);
      }
    }
  },
};
</script>

<style lang="scss">
@import "./styles/reset.css";
@import url("https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap");

#app {
  font-family: "Cabin", sans-serif;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 60% auto;
  flex-direction: column;

  .playfield {
    background: #413f42;
    display: flex;

    .drawStack,
    .playedCards {
      height: 100%;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drawStack {
      display: flex;
      flex-direction: column;
      gap: 10px;
      & > p {
        color: white;
      }

      .card {
        transition: all 0.1s ease-out;
        &.active {
          cursor: pointer;
          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }

    .playedCards {
      position: relative;

      button.endTurn {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 10px;
        font-size: 1.4rem;
        outline: none;
        padding: 8px 16px;

        background: #3ec70b;
        color: black;

        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s linear;

        .icon {
          opacity: 0;
          width: 0px;

          display: inline-flex;

          transition: all 0.2s linear;
        }

        &:hover:not(:disabled) {
          .icon {
            opacity: 1;
            width: 30px;
          }
        }

        &:disabled {
          cursor: unset;
          background: #26640f;
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  .playerCards {
    background: #7f8487;
    overflow: auto;

    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .playerIndicator {
      z-index: 10;
      color: white;
      position: absolute;
      left: 0;
      top: 0;
      background: #4c4f51;
      border: solid 2px #1e2020;
      border-width: 0 2px 2px 0;
      border-bottom-right-radius: 8px;
      padding: 8px;
      font-size: 1.5rem;
    }

    .card {
      margin-right: -40px;
      transition: all 0.2s linear;
      animation: flyIn 0.2s ease-out;

      &.active {
        &:hover {
          margin: 0;
          transform: scale(110%);

          z-index: 9;
        }
      }

      @keyframes flyIn {
        from {
          transform: translateY(-100%) scale(0);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
    }
  }
}
</style>
