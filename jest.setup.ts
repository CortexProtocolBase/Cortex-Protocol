import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }), useSearchParams: () => new URLSearchParams() }));
