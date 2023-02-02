import React, { Component } from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css";

const BASE_API_URL = "https://deckofcardsapi.com/api/deck";

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      cards: []
    };
    this.getCard = this.getCard.bind(this);
    this.loadGame = this.loadGame.bind(this);
    this.restart = this.restart.bind(this)
  };

  async componentDidMount() {
    this.loadGame();
  }

  async loadGame() {
    let response = await axios.get(
      `${BASE_API_URL}/new/shuffle/`
    );
    this.setState({
      deck: response.data
    });
  }
  //Handle click to draw a new card from API. Add card to state "cards" list.

  async getCard() {
    let deck_id = this.state.deck.deck_id;

    try {
      let drawResponse = await axios.get(`${BASE_API_URL}/${deck_id}/draw/`);

      if (drawResponse.data.remaining === 0) {
        throw new Error("no cards left to draw!");

      }

      let card = drawResponse.data.cards[0];

      this.setState(st => ({
        cards: [...st.cards,
        {
          id: card.code,
          name: `${card.suit} ${card.value}`,
          image: card.image,
        }]
      }));
    } catch (err) {
      alert(err);
    }
  }

  // Reset state of cards list to empty and begin a new deck

  restart() {
    this.setState({ 
      deck: null, 
      cards: [] 
    });
    this.loadGame();
  }

  render() {
    let drawnCards = this.state.cards.map(
      c => <Card
        key={c.id}
        name={c.name}
        image={c.image} />);

    return (
      <div className="Deck">
        <button className="Deck-button"
          onClick={this.getCard}>
          GIMME A CARD!
        </button>
        <button className="Deck-button"
          onClick={this.restart}>
          RESTART
        </button>
        <div className="Deck-drawncards">
          {drawnCards}
        </div>
      </div>
    );
  }
}

export default Deck;