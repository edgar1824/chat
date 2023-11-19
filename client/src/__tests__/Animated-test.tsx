import { Animated } from "components/reusable";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

let container: HTMLDivElement = null!;

beforeEach(() => {
  // Set up a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container!);
});

afterEach(() => {
  // Clean up on exiting
  unmountComponentAtNode(container!);
  container!.remove();
});

it("renders with show true", () => {
  act(() => {
    render(<Animated show={true}>Hello, World!</Animated>, container!);
  });
  expect(container!.textContent).toBe("Hello, World!");
});

it("renders with show false", () => {
  act(() => {
    render(<Animated show={false}>Hello, World!</Animated>, container!);
  });
  expect(container!.textContent).toBe("");
});
