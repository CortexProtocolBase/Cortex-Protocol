import { render } from "@testing-library/react";
import CopyButton from "@/components/common/CopyButton";
describe("CopyButton", () => { test("renders without crashing", () => { render(<CopyButton />); }); });
