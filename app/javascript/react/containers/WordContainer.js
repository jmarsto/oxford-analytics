import React, { Component } from 'react';

import WordInput from '../components/WordInput'
import ResultContainer from './ResultContainer'

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
    this.requestAnalytics(this.state.input)
  }

  fail() {
    this.setState({
      definition: null
    })
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
        this.fail()
      }
    })
    .then(response => response.json())
    .then(body => {
      if (body.results[0].lexicalEntries[0].entries[0].senses[0].definitions) {
        let definition = body.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
        this.setState({
          word: word,
          definition: definition,
          input: ""
        })
      } else {
        this.fail()
      }
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
        <ResultContainer
          definition={this.state.definition}
          word={this.state.word}
        >
        </ResultContainer>
      </div>
    )
  }
}

export default WordContainer
