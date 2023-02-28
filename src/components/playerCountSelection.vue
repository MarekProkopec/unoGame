<template>
  <div class="playerCountSelection">
    <h1>Select number of players:</h1>
    <div class="selector">
      <input
        type="text"
        readonly
        disabled
        name="numberOfPlayers"
        class="count"
        v-model="count"
      />
      <div class="inputsContainer">
        <button @click="count++" :disabled="count >= maxPlayerCount">+</button>
        <button @click="count--" :disabled="count <= minPlayerCount">-</button>
      </div>
    </div>
    <button class="startGame" @click="$emit('start', count)">Start game</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 2,
    };
  },
  props: {
    minPlayerCount: {
      type: Number,
      default: 2,
      validator(value) {
        return value > 1;
      },
    },
    maxPlayerCount: {
      type: Number,
      default: 10,
      validator(value) {
        return value < 100;
      },
    },
  },
  methods: {
    submit() {},
  },
};
</script>

<style lang="scss" scoped>
.playerCountSelection {
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

  .selector {
    $size: 7rem;
    $radius: 10px;
    $borderStyle: 2px solid rgba(0, 0, 0, 0.7);

    display: flex;
    height: $size;

    & * {
      user-select: none;
    }

    input.count {
      width: $size / 1.5;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      border-radius: $radius 0 0 $radius;
      background: rgba($color: #fff, $alpha: 0.7);
      border: $borderStyle;
      color: black;
      font-weight: 500;
    }

    .inputsContainer {
      display: grid;
      grid-template-rows: 50% 50%;
      width: $size / 2;

      button {
        font-size: 2rem;
        cursor: pointer;
        border: none;
        border: $borderStyle;
        border-left: none;
        background: rgba($color: #fff, $alpha: 0.9);
        transition: background 0.1s linear;

        &:hover:not(:disabled) {
          background: rgba($color: #fff, $alpha: 0.7);
        }

        &:disabled {
          cursor: unset;
          background: rgba($color: #fff, $alpha: 0.4);
        }

        &:first-child {
          border-top-right-radius: $radius;
          border-bottom: none;
        }
        &:nth-child(2) {
          border-top: none;
          border-bottom-right-radius: $radius;
        }
      }
    }
  }

  button.startGame{
    margin-top: 4vh;
    width: 50%;
    font-size: 1.5rem;
    border-radius: 10px;
    padding: .2rem .4rem;
    cursor: pointer;
    background: rgba($color: #43b956, $alpha: .8);
    transition: background .1s linear;
    border: solid 2px rgba($color: #000000, $alpha: .8);
    
    &:hover{
        background: rgba($color: #1cbe37, $alpha: .9);
    }
  }

  @media only screen and (max-width: 400px){
  	// example
    & > h1{
        font-size: 7vw;
    }

    button.startGame{
        width: fit-content;
        padding:  .5rem 2rem;
    }
}
}
</style>
