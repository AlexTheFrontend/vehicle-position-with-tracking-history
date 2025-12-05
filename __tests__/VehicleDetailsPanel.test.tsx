import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VehicleDetailsPanel } from "@/presentation/components/VehicleDetails/VehicleDetailsPanel";
import type { Vehicle } from "@/domain/models";

const vehicle: Vehicle = {
  id: "veh-1",
  name: "Hauler 1",
  registration: "ABC123",
  position: { lat: -36.85, lng: 174.76 },
  speed: 42.345,
  heading: 90,
  ignitionOn: true,
  timestamp: "2025-01-01T00:00:00Z",
};

describe("VehicleDetailsPanel", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders nothing when no vehicle is provided", () => {
    const { container } = render(
      <VehicleDetailsPanel vehicle={null} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows vehicle info and handles close", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    jest.spyOn(Date.prototype, "toLocaleString").mockReturnValue("Jan 1, 2025");

    render(<VehicleDetailsPanel vehicle={vehicle} onClose={onClose} />);

    expect(screen.getByText("Hauler 1")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("Ignition On")).toBeInTheDocument();
    expect(screen.getByText("42.3 km/h")).toBeInTheDocument();
    expect(screen.getByText("90°")).toBeInTheDocument();
    expect(screen.getByText(/Jan 1, 2025/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
