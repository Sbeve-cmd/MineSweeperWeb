// components/Cell.js
import React from 'react'

function Cell(props) {
  var c = props.cell
  var text = ''
  var cls = 'cell'

  if (c.revealed) {
    cls += ' revealed'
    if (c.mine) {
      text = '💣'
    } else if (c.count > 0) {
      text = c.count
    }
  } else if (c.flagged) {
    cls += ' flagged'
    text = '🚩'
  }

  return (
    <div
      className={cls}
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
    >
      {text}
    </div>
  )
}

export default Cell
