<template>
  <div class="colorSelection">
    <div class="colorContainer">
      <p class="description">Pick a color:</p>
      <div class="colors">
        <div
          @click="$emit('colorSelected', color)"
          class="color"
          v-for="color in colors"
          :key="color"
          :style="{ background: color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { cardColors } from "../js/uno";

export default {
  data() {
    return {
      colors: [],
    };
  },
  created() {
    this.colors = cardColors;
  },
};
</script>

<style lang="scss">
.colorSelection {
  z-index: 100;
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: rgba($color: #000000, $alpha: 0.7);
  display: flex;
  align-items: center;
  justify-content: center;

  .colorContainer {
    width: Min(500px, 90vw);
    height: Min(300px, 90vh);

    border-radius: 8px;

    background: rgba($color: #272727, $alpha: 1);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    p.description {
      color: white;
      font-size: 1.5rem;
    }

    .colors {
      width: 90%;
      height: 50%;

      display: flex;
      justify-content: space-evenly;
      align-items: center;

      .color {
        height: 90%;
        width: 20%;
        border-radius: 4px;
        border: solid 4px rgba($color: #000000, $alpha: 0.8);
        cursor: pointer;
        transition: all 0.1s ease-out;

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
}
</style>
