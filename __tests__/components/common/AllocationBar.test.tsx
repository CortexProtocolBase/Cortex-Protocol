import { render } from "@testing-library/react";
import AllocationBar from "@/components/common/AllocationBar";
describe("AllocationBar", () => { test("renders without crashing", () => { render(<AllocationBar />); }); });
