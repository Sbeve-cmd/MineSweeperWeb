// components/Cell.js
import React, { useRef } from 'react' // import useRef for long press detection

// Cell displays the visual representation of a single cell
function Cell(props) {
  var c = props.cell // cell data passed from Board
  var text = '' // text or emoji to display inside the cell
  var cls = 'cell' // base css class for cell styling

  // useRef to track long press timeout for mobile flagging
  const longPressTimeout = useRef(null)

  // handle start of touch event to detect long press for flagging
  function handleTouchStart(e) {
    // start a timeout to trigger flagging after 500ms
    longPressTimeout.current = setTimeout(() => {
      props.onContextMenu({ preventDefault: () => {} }) // call flag handler
    }, 500)
  }

  // clear long press timeout if touch ends or moves before threshold
  function handleTouchEnd() {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
  }

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

  // render the cell div with click, context menu, and touch handlers
  return (
    <div
      className={cls}
      onClick={props.onClick} // handle reveal on click/tap
      onContextMenu={props.onContextMenu} // handle flag on right-click
      onTouchStart={handleTouchStart} // handle long press start
      onTouchEnd={handleTouchEnd} // clear on touch end
      onTouchMove={handleTouchEnd} // clear if finger moves
      onTouchCancel={handleTouchEnd} // clear if touch cancelled
    >
      {text}
    </div>
  )
}

export default Cell
