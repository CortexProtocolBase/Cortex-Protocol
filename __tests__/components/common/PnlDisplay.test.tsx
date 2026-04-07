import { render } from "@testing-library/react";
import PnlDisplay from "@/components/common/PnlDisplay";
describe("PnlDisplay", () => { test("renders without crashing", () => { render(<PnlDisplay />); }); });
