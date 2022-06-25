<template>
  <div id="app">
    <div class="cardContainer">
      <card
        v-for="(card, index) in cardStack"
        :key="index"
        :data="card"
        
      ></card>
    </div>
  </div>
</template>

<script>
import card from "./components/card.vue";
import defaultCards from "./js/uno";

export default {
  name: "App",
  data() {
    return {
      cardStack: [],
    };
  },
  components: { card },
  created() {
    this.cardStack = this.shuffleArray(defaultCards);
  },
};
</script>

<style lang="scss">
@import "./styles/reset.css";
@import url("https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap");

#app {
  font-family: "Cabin", sans-serif;
  background: rgba($color: #000000, $alpha: .7);

  .cardContainer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 5px;
  }
}
</style>
