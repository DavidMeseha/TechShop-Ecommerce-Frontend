import { fireEvent, screen, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { renderDiscoverPages } from "../../../test-mic";
import axios from "@/lib/axios";
import en from "@/dictionaries/en.json";
import Page from "@/app/[lang]/discover/categories/page";

const mockCategoriesResponse = (page: number) => ({
  data: [
    { _id: `category-${page}-1`, name: `Category ${page}-1` },
    { _id: `category-${page}-2`, name: `Category ${page}-2` }
  ],
  pages: { hasNext: true }
});

describe("HomePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/en/discover/categories");
    (axios.get as jest.Mock).mockImplementation((url, options: { params: { page: number } }) => {
      if (url.includes("/api/catalog/discover/categories")) {
        return Promise.resolve({ data: mockCategoriesResponse(options.params.page) });
      }
      return Promise.reject(new Error("Not Found"));
    });
  });

  it("displays categories after fetching", async () => {
    renderDiscoverPages(<Page />);

    await waitFor(() => {
      expect(screen.getByText("Category 1-1")).toBeInTheDocument();
      expect(screen.getByText("Category 1-2")).toBeInTheDocument();
    });
  });

  it("loads more categories on click", async () => {
    renderDiscoverPages(<Page />);

    await waitFor(() => {
      expect(screen.getByText(en["loadMore"])).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(en["loadMore"]));

    await waitFor(() => {
      expect(screen.getByText("Category 2-1")).toBeInTheDocument();
      expect(screen.getByText("Category 2-2")).toBeInTheDocument();
    });
  });
});
