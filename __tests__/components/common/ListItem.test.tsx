import { render } from "@testing-library/react";
import ListItem from "@/components/common/ListItem";
describe("ListItem", () => { test("renders without crashing", () => { render(<ListItem />); }); });
