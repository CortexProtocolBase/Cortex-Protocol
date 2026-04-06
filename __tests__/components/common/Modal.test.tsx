import { render } from "@testing-library/react";
import Modal from "@/components/common/Modal";
describe("Modal", () => { test("renders without crashing", () => { render(<Modal />); }); });
