// components/Cell.js
import React from 'react'

// Cell displays the visual representation of a single cell
function Cell(props) {
  var c = props.cell // cell data passed from Board
  var text = '' // text or emoji to display inside the cell
  var cls = 'cell' // base css class for cell styling

  // apply revealed styles and content if cell has been revealed
  if (c.revealed) {
    cls += ' revealed'
    if (c.mine) {
      text = '💣' // emoji for mine cell
    } else if (c.count > 0) {
      text = c.count // show count of adjacent mines
    }
  } else if (c.flagged) {
    // apply flagged styles and emoji if cell is flagged
    cls += ' flagged'
    text = '🚩'
  }

  // render the cell div with click and context menu handlers
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
