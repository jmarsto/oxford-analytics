import React from 'react';

const Result = props => {
  let result;
  if (props.definition) {
    result = props.definition
  }
  else {
    result = "Please try another word."
  }

  return(
    <div className="result">
      {result}
    </div>
  )
}

export default Result
