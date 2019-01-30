import React from 'react';
import BarGraphWithToolTips from '../components/BarGraphWithToolTips'

const D3Container = (props) => {

  return(
    <div>
      <BarGraphWithToolTips
        key={props.word}
      >
      </BarGraphWithToolTips>
    </div>
  )
}

export default D3Container;
