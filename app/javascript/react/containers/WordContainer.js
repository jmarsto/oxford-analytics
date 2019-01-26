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
    this.requestAnalytics(this.state.input)
  }

  requestAnalytics(word) {
    fetch(`/api/v1/analytics/${word}.json`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        console.log("ERROR");
      }
    })
    .then(response => response.json())
    .then(body => {
      debugger
    })
  }

  render() {
    return(
      <div className="row">
        <h3 className="prompt">What word would you like to analyze?</h3>
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
