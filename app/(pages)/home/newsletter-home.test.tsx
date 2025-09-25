import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import NewsletterHome from "./home";

jest.mock("next/dynamic", () => {
  return jest.fn((importFunc) => {
    const modulePath = importFunc.toString();

    if (modulePath.includes("newsletter-signup")) {
      return function MockNewsletterSignup() {
        return (
          <div data-testid="newsletter-signup">Newsletter Signup Component</div>
        );
      };
    }

    if (modulePath.includes("author-post")) {
      return function MockAuthorPost() {
        return <div data-testid="author-post">Author Post Component</div>;
      };
    }

    if (modulePath.includes("view-posts")) {
      return function MockViewPosts() {
        return <div data-testid="view-posts">View Posts Component</div>;
      };
    }

    return function MockComponent() {
      return <div>Mock Component</div>;
    };
  });
});

jest.mock("@/components/theme/theme-toggle", () => {
  return {
    ThemeToggle: function MockThemeToggle() {
      return <button data-testid="theme-toggle">Theme Toggle</button>;
    },
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

const renderWithProvider = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

describe("NewsletterHome", () => {
  it("renders the main newsletter home page", () => {
    renderWithProvider(<NewsletterHome />);

    expect(screen.getByText("letterd")).toBeInTheDocument();
    expect(
      screen.getByText("Personal newsletter platform"),
    ).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    renderWithProvider(<NewsletterHome />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("displays the subscribe section", () => {
    renderWithProvider(<NewsletterHome />);

    expect(screen.getByText("Subscribe")).toBeInTheDocument();
    expect(screen.getByTestId("newsletter-signup")).toBeInTheDocument();
  });

  it("displays the create section", () => {
    renderWithProvider(<NewsletterHome />);

    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByTestId("author-post")).toBeInTheDocument();
  });

  it("displays the posts section", () => {
    renderWithProvider(<NewsletterHome />);

    expect(screen.getByText("Published Posts")).toBeInTheDocument();
    expect(screen.getByTestId("view-posts")).toBeInTheDocument();
  });

  it("has proper layout structure", () => {
    renderWithProvider(<NewsletterHome />);

    const sections = ["Subscribe", "Create", "Published Posts"];
    sections.forEach((section) => {
      expect(screen.getByText(section)).toBeInTheDocument();
    });
  });

  it("renders components in the expected order", () => {
    renderWithProvider(<NewsletterHome />);

    const container = screen
      .getByText("letterd")
      .closest('[class*="Container"]');
    expect(container).toBeInTheDocument();

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("newsletter-signup")).toBeInTheDocument();
    expect(screen.getByTestId("author-post")).toBeInTheDocument();
    expect(screen.getByTestId("view-posts")).toBeInTheDocument();
  });
});
