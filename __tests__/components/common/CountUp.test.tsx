import { render } from "@testing-library/react";
import CountUp from "@/components/common/CountUp";
describe("CountUp", () => { test("renders without crashing", () => { render(<CountUp />); }); });
