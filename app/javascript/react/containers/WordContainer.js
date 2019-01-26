import React, { Component } from 'react';

import WordInput from '../components/WordInput'

class WordContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
  }

  handleInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  handleInputSubmit = (event) => {
    event.preventDefault();
    console.log(`submit ${this.state.input}`);
  }

  render() {
    return(
      <div>
        <p>WordContainer</p>
        <WordInput
          input={this.state.input}
          handleChange={this.handleInputChange}
          handleSubmit={this.handleInputSubmit}
        >
        </WordInput>
      </div>
    )
  }
}

export default WordContainer
