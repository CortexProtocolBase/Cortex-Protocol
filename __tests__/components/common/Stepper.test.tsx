import { render } from "@testing-library/react";
import Stepper from "@/components/common/Stepper";
describe("Stepper", () => { test("renders without crashing", () => { render(<Stepper />); }); });
