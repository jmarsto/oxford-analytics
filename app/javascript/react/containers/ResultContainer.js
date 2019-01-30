import React from 'react';

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
    </div>
  )
}

export default ResultContainer;
