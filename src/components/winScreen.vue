<template>
  <div class="winScreen">
    <h1>{{ playerName }} WON!</h1>
    <button class="startGame" @click="$emit('start')">Play again</button>
  </div>
</template>

<script>
export default {
  props: {
    playerName: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.winScreen {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: Min(400px, 90vw);
  padding: 10px;
  border-radius: 10px;
  background: rgba($color: #000000, $alpha: 0.1);
  border: solid 2px rgba($color: #000000, $alpha: 0.2);

  & > h1 {
    font-size: 2rem;
    margin-bottom: 5vh;
    text-align: center;
    color: black;
  }

  button.startGame {
    margin-top: 4vh;
    width: 50%;
    font-size: 1.5rem;
    border-radius: 10px;
    padding: 0.2rem 0.4rem;
    cursor: pointer;
    background: rgba($color: #43b956, $alpha: 0.8);
    transition: background 0.1s linear;
    border: solid 2px rgba($color: #000000, $alpha: 0.8);

    &:hover {
      background: rgba($color: #1cbe37, $alpha: 0.9);
    }
  }

  @media only screen and (max-width: 400px) {
    // example
    & > h1 {
      font-size: 7vw;
    }

    button.startGame {
      width: fit-content;
      padding: 0.5rem 2rem;
    }
  }
}
</style>
