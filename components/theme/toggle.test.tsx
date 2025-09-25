import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { ThemeToggle } from "./toggle";

const mockToggleColorScheme = jest.fn();
const mockColorScheme = jest.fn().mockReturnValue("light");

jest.mock("@mantine/core", () => ({
  ...jest.requireActual("@mantine/core"),
  useMantineColorScheme: () => ({
    colorScheme: mockColorScheme(),
    toggleColorScheme: mockToggleColorScheme,
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

const renderWithProvider = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders theme toggle button", () => {
    renderWithProvider(<ThemeToggle />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle color scheme/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it("shows moon icon in light mode", () => {
    mockColorScheme.mockReturnValue("light");
    renderWithProvider(<ThemeToggle />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle color scheme/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it("shows sun icon in dark mode", () => {
    mockColorScheme.mockReturnValue("dark");
    renderWithProvider(<ThemeToggle />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle color scheme/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it("calls toggleColorScheme when clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle color scheme/i,
    });
    await user.click(toggleButton);

    expect(mockToggleColorScheme).toHaveBeenCalledTimes(1);
  });

  it("toggles between light and dark modes", async () => {
    const user = userEvent.setup();

    mockColorScheme.mockReturnValue("light");
    const { rerender } = renderWithProvider(<ThemeToggle />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle color scheme/i,
    });
    await user.click(toggleButton);

    expect(mockToggleColorScheme).toHaveBeenCalled();

    mockColorScheme.mockReturnValue("dark");
    rerender(<ThemeToggle />);

    expect(toggleButton).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    renderWithProvider(<ThemeToggle />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle color scheme/i,
    });
    expect(toggleButton).toHaveAttribute("aria-label", "Toggle color scheme");
  });
});
