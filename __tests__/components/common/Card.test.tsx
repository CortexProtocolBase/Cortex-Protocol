import { render } from "@testing-library/react";
import Card from "@/components/common/Card";
describe("Card", () => { test("renders without crashing", () => { render(<Card />); }); });
