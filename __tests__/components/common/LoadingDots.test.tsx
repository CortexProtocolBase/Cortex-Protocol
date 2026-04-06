import { render } from "@testing-library/react";
import LoadingDots from "@/components/common/LoadingDots";
describe("LoadingDots", () => { test("renders without crashing", () => { render(<LoadingDots />); }); });
