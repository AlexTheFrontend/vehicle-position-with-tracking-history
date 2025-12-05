import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimeRangeSelector } from "@/presentation/components/Map/TimeRangeSelector";

describe("TimeRangeSelector", () => {
  it("renders ranges and highlights the selected one", () => {
    const { rerender } = render(
      <TimeRangeSelector value="now-1h" onChange={jest.fn()} />
    );

    expect(screen.getByRole("button", { name: "1h" })).toHaveClass("bg-blue-500");
    expect(screen.getByRole("button", { name: "6h" })).toHaveClass("bg-gray-100");

    rerender(<TimeRangeSelector value="now-7d" onChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "7d" })).toHaveClass("bg-blue-500");
  });

  it("calls onChange when a different range is selected", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<TimeRangeSelector value="now-1h" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "6h" }));
    expect(onChange).toHaveBeenCalledWith("now-6h");
  });
});
