/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.fetch = jest.fn();

// Add TextEncoder/TextDecoder for Prisma
if (typeof (global as any).TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
  (global as any).TextDecoder = TextDecoder;
}

if (!global.Request) {
  global.Request = class Request {
    constructor(
      public input: string,
      public init?: any,
    ) {}
    json() {
      return Promise.resolve({});
    }
  } as any;
}

if (!global.Response) {
  global.Response = class Response {
    constructor(
      public body?: any,
      public init?: any,
    ) {}
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
      });
    }
  } as any;
}

if (!global.Headers) {
  global.Headers = class Headers {
    private headers = new Map();
    constructor(init?: any) {}
    get(name: string) {
      return this.headers.get(name);
    }
    set(name: string, value: string) {
      this.headers.set(name, value);
    }
  } as any;
}

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: "",
      asPath: "",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

jest.mock("next/dynamic", () => (func: any) => {
  const MockedComponent = (props: any) => {
    return null;
  };
  MockedComponent.displayName = "MockedDynamicComponent";
  return MockedComponent;
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
