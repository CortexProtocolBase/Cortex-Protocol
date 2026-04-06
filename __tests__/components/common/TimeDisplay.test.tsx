import { render } from "@testing-library/react";
import TimeDisplay from "@/components/common/TimeDisplay";
describe("TimeDisplay", () => { test("renders without crashing", () => { render(<TimeDisplay />); }); });
