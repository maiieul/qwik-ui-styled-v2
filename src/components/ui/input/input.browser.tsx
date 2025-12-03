import { component$, useSignal } from "@qwik.dev/core";
import { expect, describe, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-qwik";
import { Input } from "./input";

const inputEl = (dataTestId: string) => page.getByTestId(`input_${dataTestId}`);

const Basic = component$(() => {
  return (
    <div>
      <Input data-testid="basic" />
    </div>
  );
});

const WithPlaceholder = component$(() => {
  return (
    <div>
      <Input data-testid="placeholder" placeholder="test placeholder" />
    </div>
  );
});

const WithDefaultValue = component$(() => {
  return (
    <div>
      <Input data-testid="value" value="test value" />
    </div>
  );
});

const WithBindValue = component$(() => {
  const valueSig = useSignal("test value");
  return (
    <div>
      <Input data-testid="bind" bind:value={valueSig} />
    </div>
  );
});

describe("Input", () => {
  describe("standalone", () => {
    it("should be visible", async () => {
      render(<Basic />);
      await expect.element(inputEl("basic")).toBeVisible();
    });

    it("should be empty by default", async () => {
      render(<Basic />);
      await expect.element(inputEl("basic")).toHaveValue("");
    });

    it("should be filled when typed", async () => {
      render(<Basic />);
      const el = inputEl("basic");
      await el.fill("test");
      await expect.element(el).toHaveValue("test");
    });
  });

  describe("with placeholder", () => {
    it("should render with a placeholder", async () => {
      render(<WithPlaceholder />);
      await expect
        .element(inputEl("placeholder"))
        .toHaveAttribute("placeholder", "test placeholder");
    });
  });

  describe("with a default value", () => {
    it("should render with a default value", async () => {
      render(<WithDefaultValue />);
      await expect.element(inputEl("value")).toHaveValue("test value");
    });
  });

  describe("with a bind:value", () => {
    it("should render with a default value", async () => {
      render(<WithBindValue />);
      await expect.element(inputEl("bind")).toHaveValue("test value");
    });
  });
});
