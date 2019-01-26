import React from 'react';

const WordInput = props => {
  return(
    <form className="word-input" onChange={props.handleChange} onSubmit={props.handleSubmit}>
      <label htmlFor="body">Review:</label>
      <input type="text" name="body" value={props.value}></input>
      <input className="submit-button" type="submit" value="Submit" />
    </form>
  )
}

export default WordInput
