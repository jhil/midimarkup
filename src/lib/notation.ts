export const instruments = {
  PIANO: "acoustic_grand_piano",
  GUITAR: "acoustic_guitar_steel",
  SAXOPHONE: "alto_sax",
  TRUMPET: "trumpet",
  VIOLIN: "violin",
  FLUTE: "flute",
  DRUMS: "synth_drum",
} as const
export type Instrument = (typeof instruments)[keyof typeof instruments]
export type NoteEvent = {
  note: number
  instrument: Instrument
  time: number
  duration: number
}
export type Score = { events: NoteEvent[]; duration: number }

export function parseScore(source: string): Score {
  if (source.length > 50000)
    throw new Error(
      "The composition is too long. Use fewer than 50,000 characters.",
    )
  const events: NoteEvent[] = []
  let tempo = 120
  let defaultOctave = 4
  let duration = 0
  const lines = source.split(/\r?\n/)
  for (const [index, line] of lines.entries()) {
    let time = 0
    let octave = defaultOctave
    let instrument: Instrument = instruments.PIANO
    for (const raw of line.trim().split(/\s+/).filter(Boolean)) {
      const token = raw.toUpperCase()
      const fail = (message: string): never => {
        throw new Error(`Line ${index + 1}: ${message} (${raw})`)
      }
      if (/^T\d+$/.test(token)) {
        const value = Number(token.slice(1))
        if (value < 20 || value > 300) fail("Tempo must be between 20 and 300")
        tempo = value
        continue
      }
      if (/^OCTAVE\d$/.test(token)) {
        octave = Number(token.slice(6))
        if (octave > 8) fail("Octave must be between 0 and 8")
        if (line.trim().split(/\s+/).length === 1) defaultOctave = octave
        continue
      }
      if (token in instruments) {
        instrument = instruments[token as keyof typeof instruments]
        continue
      }
      const match = /^([A-GR;])([+#-]?)(1|2|4|8|16|32)?$/.exec(token)
      if (!match) fail("Unknown notation")
      const [, letter, accidental, length] = match!
      const seconds = 240 / tempo / Number(length || 1)
      if (letter !== ";" && letter !== "R") {
        const pitch = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[letter]!
        const note =
          12 * (octave + 1) +
          pitch +
          (accidental === "-" ? -1 : accidental ? 1 : 0)
        if (note < 0 || note > 127) fail("Note is outside the MIDI range")
        events.push({ note, instrument, time, duration: seconds })
      } else if (accidental) fail("Rests cannot have accidentals")
      time += seconds
      if (time > 900) fail("Tracks must be shorter than 15 minutes")
    }
    duration = Math.max(duration, time)
  }
  if (!events.length) throw new Error("Add at least one note to play.")
  return { events, duration }
}
