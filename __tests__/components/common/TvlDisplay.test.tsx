import { render } from "@testing-library/react";
import TvlDisplay from "@/components/common/TvlDisplay";
describe("TvlDisplay", () => { test("renders without crashing", () => { render(<TvlDisplay />); }); });
