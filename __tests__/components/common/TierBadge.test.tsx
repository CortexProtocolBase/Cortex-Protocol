import { render } from "@testing-library/react";
import TierBadge from "@/components/common/TierBadge";
describe("TierBadge", () => { test("renders without crashing", () => { render(<TierBadge />); }); });
