import { render } from "@testing-library/react";
import StatusDot from "@/components/common/StatusDot";
describe("StatusDot", () => { test("renders without crashing", () => { render(<StatusDot />); }); });
