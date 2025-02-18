import getCountries from "@/services/getCountries.service";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import {
  followings,
  getCartIds,
  getAllUserActions,
  getFollowIds,
  getLikeIds,
  getReviewIds,
  getSaveIds,
  registerGuest,
  logout
} from "@/actions";

class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    // Trigger the callback with the entry
    this.callback([{ isIntersecting: true, target: element }]);
  }

  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;

jest.mock("embla-carousel-react", () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return [
        jest.fn(),
        {
          scrollTo: jest.fn(),
          canScrollPrev: jest.fn(() => true),
          canScrollNext: jest.fn(() => true),
          on: jest.fn((event, callback) => {
            if (event === "scroll") {
              const emblaApi = { selectedScrollSnap: jest.fn(() => 0) };
              callback(emblaApi);
            }
          }),
          off: jest.fn((event, callback) => {
            if (event === "scroll") callback();
          }),
          destroy: jest.fn()
        }
      ];
    })
  };
});

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn()
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: (key) => "some message"
  }))
}));

jest.mock("next-nprogress-bar", () => {
  return {
    AppProgressBar: jest.fn(() => null),
    useRouter: jest.fn()
  };
});

jest.mock("./src/lib/axios.ts");

// jest.mock("./src/actions", {
//   addToCart: jest.fn(),
//   changeLanguage: jest.fn(),
//   follow: jest.fn(),
//   followings: jest.fn(),
//   getCartIds: jest.fn(),
//   getAllUserActions: jest.fn(),
//   getFollowIds: jest.fn(),
//   getLikeIds: jest.fn(),
//   getReviewIds: jest.fn(),
//   getSaveIds: jest.fn(),
//   registerGuest: jest.fn(),
//   logout: jest.fn()
// });

// act(() => {
//   followings.mockResolvedValue([]);
//   getCartIds.mockResolvedValue([]);
//   getAllUserActions.mockResolvedValue([]);
//   getFollowIds.mockResolvedValue([]);
//   getLikeIds.mockResolvedValue([]);
//   getReviewIds.mockResolvedValue([]);
//   getSaveIds.mockResolvedValue([]);
//   registerGuest.mockResolvedValue([]);
//   logout.mockResolvedValue([]);
//   getCountries.mockResolvedValue([]);
// });
