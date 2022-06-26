const cardTypes = {
  number: "number",
  action: "action",
  reverse: "reverse",
  skip: "skip",
  draw: "draw",
  draw4: "draw4",
  wild: "wild",
};

const cardColors = {
  red: "#D72600",
  yellow: "#ECD407",
  blue: "#0956BF",
  green: "#379711",
};

class Card {
  /**
   * Create a point.
   * @param {string} type - Type of card from cardTypes
   * @param {string} color - Color of card from cardColors
   * @param {number} number - Number of card 0-9
   */
  constructor(type = "number", color = "#000000", number = 0) {
    this.type = type;
    this.color = color;
    this.number = number;
  }
}

let defaultCards = [];

// Add card to default cards array
for (let color of Object.keys(cardColors)) {
  // Add number cards

  //   Add one 0 card for each color
  defaultCards.push(new Card(cardTypes.number, cardColors[color], 0));

  //   Add two of each 1-9 card for each color
  for (let j = 0; j < 2; j++) {
    for (let i = 1; i < 10; i++) {
      defaultCards.push(new Card(cardTypes.number, cardColors[color], i));
    }
  }

  //   Add action cards for each color
  for (let i = 0; i < 2; i++) {
    defaultCards.push(new Card(cardTypes.draw, cardColors[color]));
    defaultCards.push(new Card(cardTypes.reverse, cardColors[color]));
    defaultCards.push(new Card(cardTypes.skip, cardColors[color]));
  }
}

// Add draw cards
for (let i = 0; i < 4; i++) {
  defaultCards.push(new Card(cardTypes.wild));
  defaultCards.push(new Card(cardTypes.draw4));
}

export { defaultCards, cardTypes, cardColors, Card };
