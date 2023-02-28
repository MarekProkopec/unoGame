<template>
  <div id="app">
    <playerCountSelection
      @start="startGame"
      v-if="stage == 0"
    ></playerCountSelection>
    <game
      v-if="stage == 1"
      :selectedNumberOfPlayers="numberOfPlayers"
      @won="won"
    ></game>
    <winScreen
      v-if="stage == 2"
      :playerName="playerWin"
      @start="restart"
    ></winScreen>
  </div>
</template>

<script>
import game from "./components/game.vue";
import playerCountSelection from "./components/playerCountSelection.vue";
import winScreen from "./components/winScreen.vue";

export default {
  name: "App",
  components: { game, playerCountSelection, winScreen },
  data() {
    return {
      stage: 0,
      numberOfPlayers: 2,
      playerWin: null,
    };
  },
  methods: {
    startGame(playerCount) {
      this.numberOfPlayers = playerCount;
      this.stage = null;
      this.stage = 1;
    },
    won(playerName) {
      this.playerWin = playerName;
      this.stage = 2;
    },
    restart() {
      this.stage = 0;
    },
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7f8487;
}
</style>
