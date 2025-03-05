import { act, fireEvent, screen } from "@testing-library/react";
import { BsCompass, BsCompassFill } from "react-icons/bs";
import { renderWithTransation } from "../../test-mic";
import { usePathname } from "next/navigation";
import en from "../../src/dictionaries/en.json";
import SubMenuItem from "../../src/components/SubMenuItem";

describe("Sub Menu Item", () => {
  const menuItem = {
    name: en["discover"],
    sup: [
      {
        name: en["categories"],
        to: `/discover/categories`
      },
      {
        name: en["vendors"],
        to: `/discover/vendors`
      },
      {
        name: en["tags"],
        to: `/discover/tags`
      }
    ],
    icon: <BsCompass data-testid="discover-item-icon" size={20} />,
    iconActive: <BsCompassFill size={20} />
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/en" + menuItem.sup[0].to);
    renderWithTransation(<SubMenuItem item={menuItem} />);
  });

  it("renders correctly", () => {
    expect(screen.getByText(menuItem.name)).toBeInTheDocument();
    menuItem.sup.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.name)).toHaveAttribute("href", "/en" + item.to);
    });
    expect(screen.getByTestId("sub-items")).toHaveClass("max-h-0");
    expect(screen.getByTestId("discover-item-icon")).toBeInTheDocument();
  });

  it("toggels", async () => {
    expect(screen.getByText(menuItem.name)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText(menuItem.name));
    });
    expect(screen.getByTestId("sub-items")).toHaveClass("max-h-52");
    await act(async () => {
      fireEvent.click(screen.getByText(menuItem.name));
    });
    expect(screen.getByTestId("sub-items")).toHaveClass("max-h-0");
  });

  it("highlights when page matchs route", () => {
    expect(screen.getByText(menuItem.sup[0].name)).toHaveClass("text-primary");
    expect(screen.getByText(menuItem.sup[1].name)).not.toHaveClass("text-primary");
    expect(screen.getByText(menuItem.sup[2].name)).not.toHaveClass("text-primary");
  });
});
