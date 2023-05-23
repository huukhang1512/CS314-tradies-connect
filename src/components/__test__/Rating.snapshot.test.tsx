/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import Rating from "../Rating";

describe("<Rating/> test", () => {
  it("Matches DOM Snapshot", () => {
    const { container } = render(
      <Rating
        maxRating={5}
        name="test"
        size={3}
        value={3}
        onChange={() => console.log()}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
