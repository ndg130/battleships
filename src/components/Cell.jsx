import React, { useEffect, useState } from 'react';

export default function Cell({ index, hasShip, isHit, gridSize }) {
  const [label, setLabel] = useState(null);

  /**
   * Generate cell label
   * @param {number} index - The index of the cell
   * @param {number} gridSize - The size of the grid
   * @returns {object} The cell label
   */
  const generateCellLabel = (index, gridSize) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    const cellNumber = col + 1;
    const cellLetter = rows[row];

    const showLetter = col === 0; // first column - row label
    const showNumber = row === 0; // first row - col number

    return { cellLetter, cellNumber, showLetter, showNumber };
  };

  /**
   * Update cell label when index or gridSize changes
   */
  useEffect(() => {
    setLabel(generateCellLabel(index, gridSize));
  }, [index, gridSize]);

  return (
    <div className="cell__wrapper" data-testid="gridCellWrapper">
      {/* row labels on first column */}
      {label?.showLetter && (
        <span className="cell__label cell__label--row">{label.cellLetter}</span>
      )}

      {/* column numbers on first row */}
      {label?.showNumber && (
        <span className="cell__label cell__label--col">{label.cellNumber}</span>
      )}

      <div
        className={`
          cell 
          ${!hasShip && isHit === null ? 'cell-state--default' : ''}
          ${!hasShip && isHit ? 'cell--state-empty-hit' : ''}
          ${hasShip && isHit ? 'cell--state-ship-hit' : ''}
        `}
        data-testid="gridCell"
      >
      </div>
    </div>
  );
}