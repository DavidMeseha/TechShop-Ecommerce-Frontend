import { render, screen } from "@testing-library/react";
import RadioGroup from "@/components/RadioGroup";

describe("Radio input group", () => {
  const options = [
    { name: "option 1", value: "option1" },
    { name: "option 2", value: "option2" },
    { name: "option 3", value: "option3" }
  ];
  const onChange = jest.fn();
  const title = "radio group";

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    render(<RadioGroup checkedValue="option1" className="p-2" options={options} title={title} onChange={onChange} />);
  });

  it("renders correctly with props", () => {
    expect(screen.getByText(title)).toBeInTheDocument();
    options.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
    });
    expect(screen.getByLabelText("option 1")).toBeChecked();
    expect(screen.getByLabelText("option 2")).not.toBeChecked();
    expect(screen.getByLabelText("option 3")).not.toBeChecked();
    expect(screen.getByTestId("radio-group")).toHaveClass("p-2");
  });
});
