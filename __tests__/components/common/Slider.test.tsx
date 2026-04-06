import { render } from "@testing-library/react";
import Slider from "@/components/common/Slider";
describe("Slider", () => { test("renders without crashing", () => { render(<Slider />); }); });
