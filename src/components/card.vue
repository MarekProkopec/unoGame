<template>
  <div class="card" :style="style">
    <p class="cardContent number" v-if="data.type == 'number'">
      {{ data.number }}
    </p>
    <div class="cardContent allColors" v-else-if="data.type == 'wild'">
      <div
        class="color"
        v-for="(color, index) in colors"
        :key="index"
        :style="{ background: color }"
      ></div>
    </div>
    <div class="cardContent draw" v-else-if="data.type == 'draw'">
      <div class="smallCard" v-for="i in 2" :key="i"></div>
    </div>
    <div class="cardContent draw draw4" v-else-if="data.type == 'draw4'">
      <div
        class="smallCard"
        v-for="color in colors"
        :key="color"
        :style="{ background: color }"
      ></div>
    </div>
    <font-awesome-icon v-else :icon="icon" class="cardContent icon" />
  </div>
</template>

<script>
export default {
  props: ["data"],
  computed: {
    style() {
      const color = this.data.color;
      return { background: color, color };
    },
    icon() {
      const icons = {
        reverse: "fa-solid fa-undo",
        skip: "fa-solid fa-ban",
      };

      let icon = icons[this.data.type];

      if (!icon) {
        console.log(this.data.type);
        icon = "fa-solid fa-user-secret";
      }

      return icon;
    },
  },
  data() {
    return {
      colors: ["#D72600", "#0956BF", "#ECD407", "#379711"],
    };
  },
};
</script>

<style lang="scss">
.card {
  $cardWidth: 150px;
  $cardHeight: 250px;
  width: $cardWidth;
  height: $cardHeight;
  border-radius: 8px;
  border: solid $cardHeight/25 rgba($color: #fff, $alpha: 1);
  box-shadow: 0 0 0 2px black;
  cursor: pointer;

  position: relative;

  .cardContent {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-weight: bolder;
    font-size: $cardHeight / 2.5;

    color: white;
    text-shadow: -4px 4px black;

    &.number {
    }

    &.icon {
    }

    &.allColors {
      $size: $cardHeight / 2.5;
      width: $size;
      height: $cardHeight / 2;
      display: flex;
      overflow: hidden;
      flex-wrap: wrap;

      border: solid 5px white;
      border-radius: 50%;
      justify-content: center;
      align-items: center;

      transform: skew(-25deg) translate(-80%, -50%);

      .color {
        height: 50%;
        width: 50%;
        flex-shrink: 0;
        flex-grow: 0;
      }
    }

    &.draw {
      width: 50%;
      height: 50%;
      position: relative;
      .smallCard {
        $divider: 4;
        height: $cardHeight/$divider;
        width: $cardWidth/$divider;
        background: white;
        border: solid 3px black;
        border-radius: 4px;
        $shadowSize: 2px;
        box-shadow: -$shadowSize $shadowSize 0 $shadowSize
          rgba($color: #000000, $alpha: 0.9);
        position: absolute;

        &:first-child {
          right: 5%;
          top: 10%;
        }
        &:nth-child(2) {
          left: 5%;
          bottom: 10%;
        }
      }
    }

    &.draw4 {
        background: white;
        border-radius: 50%;
        width: 80%;
        height: 80%;
      .smallCard {
        // Red
        &:first-child {
          left: 40%;
          top: 35%;
          z-index: 4;
        }
        // Blue
        &:nth-child(2) {
            z-index: 2;
          left: 15%;
          top: 20%;
        }
        // Yellow
        &:nth-child(3) {
            z-index: 3;
          left: 60%;
          top: 10%;
        }
        // Green
        &:nth-child(4) {
          left: 5%;
          top: 45%;
        }
      }
    }
  }
}
</style>
