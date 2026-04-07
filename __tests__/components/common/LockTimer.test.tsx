import { render } from "@testing-library/react";
import LockTimer from "@/components/common/LockTimer";
describe("LockTimer", () => { test("renders without crashing", () => { render(<LockTimer />); }); });
