import { render } from "@testing-library/react";
import TruncatedText from "@/components/common/TruncatedText";
describe("TruncatedText", () => { test("renders without crashing", () => { render(<TruncatedText />); }); });
