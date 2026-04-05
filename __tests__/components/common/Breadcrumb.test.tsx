import { render } from "@testing-library/react";
import Breadcrumb from "@/components/common/Breadcrumb";
describe("Breadcrumb", () => { test("renders without crashing", () => { render(<Breadcrumb />); }); });
