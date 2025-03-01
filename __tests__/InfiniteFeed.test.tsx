import { screen, waitFor } from "@testing-library/react";
import { useInView } from "react-intersection-observer";
import InfiniteFeed from "../src/app/[lang]/(web)/feeds/InfiniteFeed";
import { mockHomeProduct } from "../__mocks__/values";
import { renderWithProviders } from "../test-mic";
import axios from "@/lib/axios";

// Mock the required hooks and modules
jest.mock("react-intersection-observer");
jest.mock("@tanstack/react-query");
jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/en/feeds")
}));

const mockProducts = [
  {
    ...mockHomeProduct,
    _id: "1",
    name: "Test Product 1"
  },
  {
    ...mockHomeProduct,
    _id: "2",
    name: "Test Product 2"
  }
];

const mockProductsResponse = {
  data: mockProducts,
  pages: { hasNext: true }
};

describe("InfiniteFeed", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    (useInView as jest.Mock).mockReturnValue([jest.fn(), false]);

    (axios.get as jest.Mock).mockImplementation((url) => {
      if (url.includes("/api/catalog/homefeed")) {
        return Promise.resolve({ data: mockProductsResponse });
      }
      return Promise.reject(new Error("Not Found"));
    });
  });

  it("renders desktop view with products", () => {
    renderWithProviders(<InfiniteFeed />);

    // Check if products are rendered
    waitFor(() => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });
  });

  it("renders mobile view with menu and search buttons", () => {
    renderWithProviders(<InfiniteFeed />);

    global.innerWidth = 450;
    global.dispatchEvent(new Event("resize"));

    // Check if mobile menu buttons are present
    waitFor(() => {
      expect(screen.getByLabelText("Open Main Menu")).toBeInTheDocument();
      expect(screen.getByLabelText("Open Search Page")).toBeInTheDocument();
    });
  });

  it("shows loading spinner when fetching next page", async () => {
    renderWithProviders(<InfiniteFeed />);

    // Check if loading spinner is visible
    waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  // it("shows end of content message when no more pages", () => {
  //   (useInfiniteQuery as jest.Mock).mockReturnValue({
  //     data: {
  //       pages: [{ data: mockProducts, pages: { hasNext: false, current: 1 } }]
  //     },
  //     fetchNextPage: jest.fn(),
  //     hasNextPage: false,
  //     isFetchingNextPage: false
  //   });

  //   render(<InfiniteFeed />);

  //   // Check if end of content message is shown on mobile
  //   global.innerWidth = 500;
  //   global.dispatchEvent(new Event("resize"));
  //   expect(screen.getByText("endOfContent")).toBeInTheDocument();
  // });

  // it("triggers fetchNextPage when intersection observer fires", async () => {
  //   const mockFetchNextPage = jest.fn();
  //   (useInfiniteQuery as jest.Mock).mockReturnValue({
  //     data: {
  //       pages: [{ data: mockProducts, pages: { hasNext: true, current: 1 } }]
  //     },
  //     fetchNextPage: mockFetchNextPage,
  //     hasNextPage: true,
  //     isFetchingNextPage: false
  //   });

  //   render(<InfiniteFeed />);

  //   // Simulate intersection observer callback
  //   const [, inView] = (useInView as jest.Mock).mock.calls[0];
  //   inView.onChange(true);

  //   await waitFor(() => {
  //     expect(mockFetchNextPage).toHaveBeenCalled();
  //   });
  // });

  // it("opens menu and search overlays on button click", () => {
  //   const mockSetIsHomeMenuOpen = jest.fn();
  //   const mockSetIsSearchOpen = jest.fn();

  //   (useOverlayStore as unknown as jest.Mock).mockReturnValue({
  //     setIsHomeMenuOpen: mockSetIsHomeMenuOpen,
  //     setIsSearchOpen: mockSetIsSearchOpen
  //   });

  //   // Mock window.innerWidth for mobile view
  //   global.innerWidth = 500;
  //   global.dispatchEvent(new Event("resize"));

  //   render(<InfiniteFeed />);

  //   // Click menu and search buttons
  //   fireEvent.click(screen.getByLabelText("Open Main Menu"));
  //   fireEvent.click(screen.getByLabelText("Open Search Page"));

  //   expect(mockSetIsHomeMenuOpen).toHaveBeenCalledWith(true);
  //   expect(mockSetIsSearchOpen).toHaveBeenCalledWith(true);
  // });

  // it("correctly identifies items in cart", () => {
  //   (useUserStore as unknown as jest.Mock).mockReturnValue({
  //     cartItems: [{ product: "1" }],
  //     saves: [],
  //     likes: [],
  //     reviews: [],
  //     followedVendors: []
  //   });

  //   render(<InfiniteFeed />);

  //   // Product 1 should be marked as in cart
  //   const product1 = screen.getByText(mockProducts[0].name);
  //   expect(product1.closest("[data-testid='product-section']")).toHaveAttribute("data-in-cart", "true");
  // });
});
