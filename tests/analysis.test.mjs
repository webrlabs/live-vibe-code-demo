import test from "node:test";
import assert from "node:assert/strict";
import { keywordHits, plainText } from "../src/analysis.ts";
import { onRequestGet } from "../functions/api/osti.js";

test("keywords match boundaries, plurals, and hyphenated phrases", () => {
  assert.deepEqual(
    keywordHits("Wind turbines, fuel cells and iron-air batteries.", [
      "wind",
      "turbine",
      "fuel cell",
      "iron air",
      "batteries",
    ]),
    ["wind", "turbine", "fuel cell", "iron air", "batteries"],
  );
  assert.deepEqual(
    keywordHits("The window is open. A microgrid is not the word grid.", [
      "wind",
    ]),
    [],
  );
});
test("source text strips tags and decodes entities without rendering markup", () => {
  assert.equal(
    plainText("<jats:p>Solar &amp; storage &#x26; grids</jats:p>"),
    "Solar & storage & grids",
  );
  assert.equal(plainText("Bad &#99999999; entity"), "Bad &#99999999; entity");
});
test("OSTI rejects missing, short, and overlong queries before fetching", async () => {
  for (const q of ["", "a", "x".repeat(161)]) {
    const response = await onRequestGet({
      request: new Request(`https://example.test/api/osti?q=${q}`),
    });
    assert.equal(response.status, 400);
  }
});
test("OSTI adapter fixes upstream host, bounds results, streams JSON, and handles failure", async () => {
  const realFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      assert.equal(url.hostname, "www.osti.gov");
      assert.equal(url.searchParams.get("rows"), "40");
      assert.equal(url.searchParams.get("search"), "solar & wind");
      return Response.json([{ osti_id: "123", title: "Solar" }]);
    };
    const response = await onRequestGet({
      request: new Request(
        "https://example.test/api/osti?q=solar%20%26%20wind",
      ),
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json())[0].osti_id, "123");
    globalThis.fetch = async () => new Response("", { status: 503 });
    assert.equal(
      (
        await onRequestGet({
          request: new Request("https://example.test/api/osti?q=solar"),
        })
      ).status,
      502,
    );
    globalThis.fetch = async () => {
      throw new Error("offline");
    };
    assert.equal(
      (
        await onRequestGet({
          request: new Request("https://example.test/api/osti?q=solar"),
        })
      ).status,
      504,
    );
  } finally {
    globalThis.fetch = realFetch;
  }
});
