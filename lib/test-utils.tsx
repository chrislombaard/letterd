import React from "react";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return rtlRender(ui, { wrapper: TestWrapper, ...options });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFetch = (response: any, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: () => Promise.resolve(response),
  });
};

export * from "@testing-library/react";
export { render };
