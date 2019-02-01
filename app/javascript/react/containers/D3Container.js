import React from 'react';
import BarGraphWithToolTips from '../components/BarGraphWithToolTips'

const D3Container = (props) => {
  let graphs;
  if (props.definition) {
    graphs = (
      <BarGraphWithToolTips
        key={props.word}
        definition={props.definition}
      >
      </BarGraphWithToolTips>
    )
  }

  return(
    <div>
      {graphs}
    </div>
  )
}

export default D3Container;
