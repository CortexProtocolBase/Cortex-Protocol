import { render } from "@testing-library/react";
import Accordion from "@/components/common/Accordion";
describe("Accordion", () => { test("renders without crashing", () => { render(<Accordion />); }); });
