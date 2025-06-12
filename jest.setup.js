import "@testing-library/jest-dom";

// jest.mock("embla-carousel-react", () => {
//   return {
//     __esModule: true,
//     default: jest.fn(() => {
//       return [
//         jest.fn(),
//         {
//           scrollTo: jest.fn(),
//           canScrollPrev: jest.fn(() => true),
//           canScrollNext: jest.fn(() => true),
//           on: jest.fn((event, callback) => {
//             if (event === "scroll") {
//               const emblaApi = { selectedScrollSnap: jest.fn(() => 0) };
//               callback(emblaApi);
//             }
//           }),
//           off: jest.fn((event, callback) => {
//             if (event === "scroll") callback();
//           }),
//           destroy: jest.fn()
//         }
//       ];
//     })
//   };
// });

// jest.mock("react-intersection-observer", () => ({
//   useInView: jest.fn()
// }));

// jest.mock("next/navigation", () => ({
//   usePathname: jest.fn()
// }));

// jest.mock("./src/lib/axios.ts");
// jest.mock("react-scan", () => ({ scan: jest.fn }));
