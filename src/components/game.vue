<template>
  <div class="game">
    <colorselection @colorSelected="setColor" v-if="showColorSelect" />
    <div class="playfield">
      <div class="notifications">
        <div
          class="cardsToDraw"
          :class="cardsToDraw == 0 ? 'inactive' : 'active'"
        >
          <p>
            Cards to draw: <span>{{ cardsToDraw }}</span>
          </p>
        </div>
        <div
          class="cardsToDraw"
          :class="!nextPlayerSkipped ? 'inactive' : 'active'"
        >
          <p>Skip card is on you</p>
        </div>
      </div>

      <div class="drawStack">
        <card
          :visible="false"
          :class="moveDone && !nextPlayerSkipped ? '' : 'active'"
          :data="cardStack[0]"
          @click="drawCardFromDeck()"
          :playable="suggestDraw"
        ></card>
        <p>Left: {{ cardStack.length }}</p>
      </div>
      <div class="playedCards">
        <card v-if="lastPlayed" :data="lastPlayed"></card>
        <div class="actionButtons">
          <button
            @click="endTurn()"
            class="endTurn"
            :disabled="endTurnDisabled"
            :class="suggestEndTurn ? 'playable' : ''"
          >
            <span>End turn</span>
            <font-awesome-icon class="icon" icon="fa-solid fa-angles-right" />
          </button>
        </div>
      </div>
    </div>
    <div class="playerCards">
      <p class="playerIndicator">
        {{ currentPlayer.name }}
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
import card from "./card.vue";
import colorselection from "./colorselection.vue";

import { defaultCards } from "../js/uno";

export default {
  name: "uno",
  components: { card, colorselection },
  props: {
    selectedNumberOfPlayers: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      cardStack: [],
      usedCards: [],
      currentPlayerIndex: 0,
      playerCount: 5,
      moveDone: false,
      players: [],
      showColorSelect: false,
      cardsToDraw: 0,
      nextPlayerSkipped: false,
      nextPlayerWillBeSkipped: false,
    };
  },
  computed: {
    lastPlayed() {
      return this.usedCards[this.usedCards.length - 1];
    },
    currentPlayer() {
      return this.players[this.currentPlayerIndex];
    },
    moveSkippable() {
      return this.nextPlayerSkipped;
    },
    endTurnDisabled() {
      if (this.moveSkippable) return false;
      return !this.moveDone;
    },
    skipTurnDisabled() {
      return !this.moveSkippable;
    },
    canPlayerPlayCard() {
      if (!this.currentPlayer.cards) return true;
      if (this.currentPlayer.cards.some((e) => this.isPlayable(e))) return true;
      return false;
    },
    suggestDraw() {
      if (this.moveDone) return false;
      if (this.nextPlayerSkipped) return false;
      if (this.canPlayerPlayCard) return false;
      return true;
    },
    suggestEndTurn() {
      if (this.moveDone) return false;
      if (this.canPlayerPlayCard) return false;
      if (!this.nextPlayerSkipped) return false;
      return true;
    },
  },
  methods: {
    playCard(index) {
      if(this.moveDone) return;
      const card = this.currentPlayer.cards[index];
      if (!this.isPlayable(card)) return;
      this.usedCards.push(card);
      this.currentPlayer.cards.splice(index, 1);
      this.moveDone = true;

      switch (card.type) {
        case "wild":
          this.showColorSelect = true;
          this.moveDone = false;
          break;

        case "draw4":
          this.showColorSelect = true;
          this.moveDone = false;
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

      if (this.currentPlayer.cards.length == 0) {
        this.$emit("won", this.currentPlayer.name);
      }
    },
    drawCardFromDeck() {
      if (this.nextPlayerSkipped) return;
      if (this.cardsToDraw == 0) {
        this.drawCard();
        return;
      }

      for (let i = 0; i < this.cardsToDraw; i++) {
        setTimeout(() => {
          this.drawCard(false);
        }, i * 100);
      }
      this.cardsToDraw = 0;
    },
    drawCard(needsMove = true) {
      if (needsMove && this.moveDone) return;
      this.currentPlayer.cards.push(this.cardStack.pop());
      if (this.cardStack.length == 0) {
        this.shuffleUsedCards();
      }
      this.moveDone = true;
    },
    isPlayable(card) {
      if (this.nextPlayerSkipped) {
        return card.type == "skip";
      }

      if (this.cardsToDraw != 0) {
        if (card.type == "draw4") return true;
        if (card.type == "draw") {
          if (
            card.color == this.lastPlayed.color ||
            this.lastPlayed.type == "draw"
          )
            return true;
        }
        return false;
      }

      if (["wild", "draw4"].includes(card.type)) return true;

      if (card.color == this.lastPlayed.color) return true;

      if (card.type == "number" && this.lastPlayed.type == "number") {
        return card.number == this.lastPlayed.number;
      }

      return card.type == this.lastPlayed.type;
    },
    shuffleUsedCards() {
      if (this.usedCards.length < 2) return;
      this.cardStack = this.shuffleArray([...this.usedCards]);
      this.usedCards = [this.cardStack.pop()];
    },
    endTurn() {
      this.nextPlayerSkipped = false;
      if (this.nextPlayerWillBeSkipped) this.nextPlayerSkipped = true;
      this.nextPlayerWillBeSkipped = false;
      this.moveDone = false;
      if (this.currentPlayerIndex > this.playerCount - 2) {
        this.currentPlayerIndex = 0;
        return;
      }
      this.currentPlayerIndex++;
      this.startTurn();
    },
    startTurn() {
      // Need to handle if player doesn't want to play, even if he has stop card
      // Mby skip turn button
      if (this.nextPlayerSkipped) {
        if (!this.currentPlayer.cards.find((e) => e.type == "skip")) {
          this.moveDone = true;
        }
      }
    },
    setColor(color) {
      this.lastPlayed.color = color;
      this.showColorSelect = false;
      this.moveDone = true;
    },
    reverseOrder() {
      let arr = [this.currentPlayer];
      for (let i = this.currentPlayerIndex - 1; i >= 0; i--) {
        arr.push(this.players[i]);
      }
      for (let i = this.players.length - 1; i > this.currentPlayerIndex; i--) {
        arr.push(this.players[i]);
      }
      this.currentPlayerIndex = 0;
      this.players = arr;
    },
    skipNextPlayer() {
      this.nextPlayerWillBeSkipped = true;
    },
  },
  created() {
    this.playerCount = this.selectedNumberOfPlayers;
    for (let i = 0; i < this.playerCount; i++) {
      this.players.push({
        name: `Player ${i + 1}`,
        cards: [],
      });
    }

    this.cardStack = this.shuffleArray(defaultCards);
    let firstCard = this.cardStack.pop();
    if (firstCard.color == "#000000") {
      firstCard.color = ["#D72600", "#ECD407", "#0956BF", "#379711"][
        Math.floor(Math.random() * 4)
      ];
    }
    this.usedCards.push(firstCard);

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

<style lang="scss" scoped>
button {
  user-select: none;
}

.game {
  height: 100%;
  width: 100%;
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

      .actionButtons {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 10px;
        display: flex;
        gap: 10px;

        button {
          font-size: 1.4rem;
          outline: none;
          padding: 8px 16px;

          background: #3ec70b;
          color: black;

          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s linear;

          &.skipTurn {
            background: #ffb562;

            &:disabled {
              background: #a88154;
              color: rgba(255, 255, 255, 0.3);
            }
          }

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

          &.playable {
            box-shadow: 0 0 2px 4px yellow;
          }
        }
      }
    }
    .notifications {
      position: absolute;
      left: 50%;
      top: 20px;
      transform: translateX(-50%);

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      .cardsToDraw {
        background: #ffb562;
        border: solid 4px #ffa136;
        color: #000;
        padding: 8px 16px;
        border-radius: 8px;
        display: flex;
        transition: all 0.15s linear;
        opacity: 1;

        &.inactive {
          opacity: 0;
        }

        p {
          span {
            font-weight: bolder;
          }
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
