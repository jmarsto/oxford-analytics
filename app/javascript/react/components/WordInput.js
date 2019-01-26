import React from 'react';

const WordInput = props => {
  return(
    <form onChange={props.handleChange} onSubmit={props.handleSubmit}>
      <input className="word-input" type="text" name="input" value={props.value}></input>
      <input className="submit-button" type="submit" value="Submit" />
    </form>
  )
}

export default WordInput
