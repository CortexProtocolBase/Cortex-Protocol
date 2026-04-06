import { render } from "@testing-library/react";
import ExternalLink from "@/components/common/ExternalLink";
describe("ExternalLink", () => { test("renders without crashing", () => { render(<ExternalLink />); }); });
