import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import ViewPosts, { refreshPosts } from "./posts";

jest.mock("swr", () => {
  const mockMutate = jest.fn();
  return {
    __esModule: true,
    default: jest.fn(() => ({
      data: [
        {
          id: "1",
          title: "Test Post",
          subject: "Test Subject",
          bodyHtml: "<p>Test content</p>",
          status: "SENT",
          scheduledAt: null,
          createdAt: "2025-09-24T10:00:00Z",
        },
      ],
      error: null,
    })),
    mutate: mockMutate,
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

const renderWithProvider = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

describe("ViewPosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders posts list", () => {
    renderWithProvider(<ViewPosts />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Test Subject")).toBeInTheDocument();
  });

  it("exports refreshPosts function", () => {
    expect(typeof refreshPosts).toBe("function");
  });

  it("calls mutate when refreshPosts is called", () => {
    const swr = jest.requireMock("swr");
    refreshPosts();
    expect(swr.mutate).toHaveBeenCalledWith("/api/posts");
  });
});
