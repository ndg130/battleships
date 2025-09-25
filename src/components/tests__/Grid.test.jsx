import { render, screen } from "@testing-library/react";
import { test, expect } from '@jest/globals';
import "@testing-library/jest-dom";
import Grid from "../Grid";

test("renders the correct number of cells", () => {
    render(<Grid gridSize={10} shipCells={[]} hitCells={[]}/>)
    const cells = screen.getAllByTestId("gridCell");
    expect(cells).toHaveLength(100);
});

test("renders a grid role", () => {
    render(<Grid gridSize={10} shipCells={[]} hitCells={[]}/>)
    expect(screen.getByRole("grid")).toBeInTheDocument();
})