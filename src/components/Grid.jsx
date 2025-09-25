import React from 'react'
import Cell from './Cell'

export default function Grid({ gridSize, shipCells, hitCells }) {

    return (
        <div role="grid" className={`grid grid--size-${gridSize}`}>
            {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                <Cell 
                    key={index} 
                    index={index} 
                    role="gridCell"
                    hasShip={shipCells.includes(index)}
                    isHit={hitCells.includes(index)}
                    gridSize={gridSize}
                />
            ))}
        </div>
    )
}
