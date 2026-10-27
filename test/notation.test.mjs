import test from "node:test"
import assert from "node:assert/strict"
import { parseScore } from "../src/lib/notation.ts"

test("two digit tempos and sixteenth notes have correct timing", () => {
  const score = parseScore("T90\nPIANO C16 D16")
  assert.equal(score.events[0].duration, 1 / 6)
  assert.equal(score.events[1].time, 1 / 6)
})
test("rests advance the clock without scheduling invalid notes", () => {
  const score = parseScore("T120\nPIANO C4 ;4 D4")
  assert.equal(score.events.length, 2)
  assert.equal(score.events[1].time, 1)
})
test("a sharp above B crosses into the next octave", () => {
  assert.equal(parseScore("PIANO B+4").events[0].note, 72)
})
test("tracks start together and reset their instrument and octave", () => {
  const score = parseScore("VIOLIN OCTAVE5 C4\nC4")
  assert.deepEqual(
    score.events.map(({ note, instrument, time }) => ({
      note,
      instrument,
      time,
    })),
    [
      { note: 72, instrument: "violin", time: 0 },
      { note: 60, instrument: "acoustic_grand_piano", time: 0 },
    ],
  )
})
test("invalid notation reports the line without silently dropping notes", () => {
  assert.throws(
    () => parseScore("PIANO C4\nFLUTE Q4"),
    /Line 2: Unknown notation/,
  )
  assert.throws(() => parseScore("T0 C4"), /Tempo/)
})
