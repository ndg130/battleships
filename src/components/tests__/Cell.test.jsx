import { render, screen } from "@testing-library/react";
import { test, expect } from '@jest/globals';
import "@testing-library/jest-dom";
import Cell from "../Cell";

// tests for rendering

test("renders a cell", () => {
    render(<Cell index={0} hasShip={false} isHit={false} gridSize={10}/>)
    expect(screen.getByTestId("gridCell")).toBeInTheDocument();
})

// tests for labels

test("shows row letter for first column", () => {
    render(<Cell index={0} hasShip={false} isHit={false} gridSize={10}/>);
    expect(screen.getByText("A")).toBeInTheDocument();
})

test("does not show row letter for other columns", () => {
    render(<Cell index={1} hasShip={false} isHit={false} gridSize={10}/>);
    expect(screen.queryByText("A")).not.toBeInTheDocument();
})

test("shows column number for first row", () => {
    render(<Cell index={0} hasShip={false} isHit={false} gridSize={10}/>);
    expect(screen.getByText("1")).toBeInTheDocument();
})

test("does not show column number for other rows", () => {
    render(<Cell index={10} hasShip={false} isHit={false} gridSize={10}/>);
    expect(screen.queryByText("1")).not.toBeInTheDocument();
})

// tests for css classes

test("applies default class when no ship and not hit", () => {
    render(<Cell index={0} hasShip={false} isHit={null} gridSize={10} />);
    const cell = screen.getByTestId('gridCell');
    expect(cell).toHaveClass('cell-state--default');
});

test("applies miss class when no ship and is hit", () => {
    render(<Cell index={0} hasShip={false} isHit={true} gridSize={10} />);
    const cell = screen.getByTestId('gridCell');
    expect(cell).toHaveClass('cell--state-empty-hit');
})

test("applies hit class when has ship and is hit", () => {
    render(<Cell index={0} hasShip={true} isHit={true} gridSize={10} />);
    const cell = screen.getByTestId('gridCell');
    expect(cell).toHaveClass('cell--state-ship-hit');
})