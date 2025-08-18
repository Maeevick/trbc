import { expect, test } from "vitest";
import { isOk } from "./setup.ts";

test(`when setup is complete, everything is plug and works fine`, () => {
  expect(isOk()).toStrictEqual("yes");
});
