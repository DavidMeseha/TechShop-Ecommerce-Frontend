import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckboxGroup from "@/common/components/ui/CheckboxGroup";

describe("Checkbox group", () => {
  const options = [
    { name: "option 1", value: "option1" },
    { name: "option 2", value: "option2" },
    { name: "option 3", value: "option3" }
  ];
  const onChange = jest.fn();
  const title = "checkbox group";
  const user = userEvent.setup();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    render(<CheckboxGroup className="p-2" options={options} title={title} values={["option1"]} onChange={onChange} />);
  });

  it("renders correctly with props", () => {
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-group")).toHaveClass("p-2");
    options.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
    });
    expect(screen.getByLabelText("option 1")).toBeChecked();
    expect(screen.getByLabelText("option 2")).not.toBeChecked();
    expect(screen.getByLabelText("option 3")).not.toBeChecked();
  });

  it("fires onChange with correct values", async () => {
    await user.click(screen.getByLabelText("option 1"));
    expect(onChange).toHaveBeenCalledWith([]);

    await user.click(screen.getByLabelText("option 2"));
    expect(onChange).toHaveBeenCalledWith(["option1", "option2"]);
  });
});
