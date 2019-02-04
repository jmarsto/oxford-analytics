import React from 'react';
import BarGraphWithToolTips from '../components/BarGraphWithToolTips'
import Sunburst from '../components/Sunburst'

const D3Container = (props) => {
  let graphs;
  if (props.definition) {
    graphs = (
      <div>
        <BarGraphWithToolTips
          key={`bargraph-${props.word}`}
          definition={props.definition}
        >
        </BarGraphWithToolTips>
        <Sunburst
          key={`sunburst-${props.word}`}
          definition={props.definition}
        >
        </Sunburst>
      </div>
    )
  }

  return(
    <div>
      {graphs}
    </div>
  )
}

export default D3Container;
