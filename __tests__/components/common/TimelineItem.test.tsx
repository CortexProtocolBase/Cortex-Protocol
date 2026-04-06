import { render } from "@testing-library/react";
import TimelineItem from "@/components/common/TimelineItem";
describe("TimelineItem", () => { test("renders without crashing", () => { render(<TimelineItem />); }); });
