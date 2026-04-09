import { render, screen } from "@testing-library/react";
import Badge from "@/components/Badge";
describe("Badge", () => {
  test("renders children", () => { render(<Badge>Active</Badge>); expect(screen.getByText("Active")).toBeInTheDocument(); });
  test("applies variant classes", () => { const { container } = render(<Badge variant="success">OK</Badge>); expect(container.firstChild).toHaveClass("bg-green-500/10"); });
});
