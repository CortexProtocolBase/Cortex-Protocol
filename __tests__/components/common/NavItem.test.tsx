import { render } from "@testing-library/react";
import NavItem from "@/components/common/NavItem";
describe("NavItem", () => { test("renders without crashing", () => { render(<NavItem />); }); });
