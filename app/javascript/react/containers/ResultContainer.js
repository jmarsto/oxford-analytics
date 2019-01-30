import React from 'react';
import D3Container from './D3Container'

const ResultContainer = (props) => {
  let definition;
  if (props.definition) {
    definition = props.definition;
  }
  else {
    definition = "No definition.";
  }

  return(
    <div className="result">
      {definition}
      <D3Container
        definition={props.definition}
        word={props.word}
      >
      </D3Container>
    </div>
  )
}

export default ResultContainer;
