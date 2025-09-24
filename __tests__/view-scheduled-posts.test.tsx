/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import ViewScheduledPosts from "../app/view-scheduled-posts";

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseSWR = require("swr").default;

const renderWithMantine = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe("ViewScheduledPosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    renderWithMantine(<ViewScheduledPosts />);
    expect(screen.getByText("Loading scheduled posts...")).toBeInTheDocument();
  });

  it("shows empty state when no scheduled posts", () => {
    mockUseSWR.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    });

    renderWithMantine(<ViewScheduledPosts />);
    expect(screen.getByText(/No posts scheduled yet/)).toBeInTheDocument();
  });

  it("displays scheduled posts correctly", () => {
    const scheduledPosts = [
      {
        id: "1",
        title: "Future Newsletter",
        subject: "Coming Soon!",
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        createdAt: new Date().toISOString(),
      },
    ];

    mockUseSWR.mockReturnValue({
      data: scheduledPosts,
      error: undefined,
      isLoading: false,
    });

    renderWithMantine(<ViewScheduledPosts />);
    
    expect(screen.getByText("Future Newsletter")).toBeInTheDocument();
    expect(screen.getByText("Subject: Coming Soon!")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: new Error("Failed to fetch"),
      isLoading: false,
    });

    renderWithMantine(<ViewScheduledPosts />);
    expect(screen.getByText("Failed to load scheduled posts")).toBeInTheDocument();
  });
});