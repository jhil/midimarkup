import test from "node:test"
import assert from "node:assert/strict"
import { highlightScore } from "../src/lib/highlight.ts"

test("notation highlights instruments, notes, rests, and modifiers", () => {
  assert.deepEqual(highlightScore("PIANO C#16 ;4 T90 OCTAVE5"), [
    { text: "PIANO", kind: "instrument" },
    { text: " ", kind: "" },
    { text: "C#", kind: "note" },
    { text: "16", kind: "modifier" },
    { text: " ", kind: "" },
    { text: ";", kind: "rest" },
    { text: "4", kind: "modifier" },
    { text: " ", kind: "" },
    { text: "T90", kind: "modifier" },
    { text: " ", kind: "" },
    { text: "OCTAVE5", kind: "modifier" },
  ])
})

test("highlighting preserves case, whitespace, and unknown text for editing", () => {
  const source = "  piano\tC4\n<img> & Q4\n"
  assert.equal(
    highlightScore(source)
      .map(({ text }) => text)
      .join(""),
    source,
  )
  assert.deepEqual(highlightScore("<img>"), [{ text: "<img>", kind: "" }])
})
