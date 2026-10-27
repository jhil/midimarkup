"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { parseScore, instruments } from "../lib/notation"
import type { Soundfont } from "smplr"

type Player = ReturnType<typeof Soundfont>
import { exampleScore, exampleTitle } from "../lib/example"
import { highlightScore } from "../lib/highlight"

export default function Editor() {
  const [source, setSource] = useState(exampleScore)
  const [status, setStatus] = useState("Ready")
  const [error, setError] = useState("")
  const [active, setActive] = useState(false)
  const [speech, setSpeech] = useState(false)
  const highlighted = useRef<HTMLPreElement | null>(null)
  const context = useRef<AudioContext | null>(null)
  const players = useRef(new Map<string, Promise<Player>>())
  const session = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function stop() {
    session.current++
    if (timer.current) clearTimeout(timer.current)
    for (const player of players.current.values())
      void player.then(
        (instrument) => instrument.stop(),
        () => {},
      )
    setActive(false)
    setStatus("Stopped")
  }

  useEffect(() => {
    const cache = players.current
    const generation = session
    return () => {
      generation.current++
      if (timer.current) clearTimeout(timer.current)
      for (const player of cache.values())
        void player.then(
          (instrument) => instrument.stop(),
          () => {},
        )
      void context.current?.close()
      window.speechSynthesis?.cancel()
    }
  }, [])

  async function play() {
    stop()
    setError("")
    let score
    try {
      score = parseScore(source)
    } catch (failure) {
      setError((failure as Error).message)
      setStatus("Check the notation")
      return
    }
    const currentSession = ++session.current
    setActive(true)
    setStatus("Loading instruments")
    try {
      context.current ??= new AudioContext()
      const audio = context.current
      await audio.resume()
      const { Soundfont } = await import("smplr")
      const names = [...new Set(score.events.map((event) => event.instrument))]
      const loaded = await Promise.all(
        names.map(async (name) => {
          let promise = players.current.get(name)
          if (!promise) {
            const instrument = Soundfont(audio, { instrument: name })
            promise = instrument.ready.then(() => instrument)
            players.current.set(name, promise)
            void promise.catch(() => players.current.delete(name))
          }
          return [name, await promise] as const
        }),
      )
      if (session.current !== currentSession) return
      const ready = new Map(loaded)
      const start = audio.currentTime + 0.08
      const velocity = Math.max(25, Math.floor(85 / Math.sqrt(names.length)))
      for (const event of score.events)
        ready.get(event.instrument)!.start({
          note: event.note,
          time: start + event.time,
          duration: event.duration * 0.95,
          velocity,
        })
      setStatus("Playing")
      timer.current = setTimeout(
        () => {
          if (session.current === currentSession) {
            setActive(false)
            setStatus("Finished")
          }
        },
        (score.duration + 0.2) * 1000,
      )
    } catch (failure) {
      if (session.current !== currentSession) return
      stop()
      setStatus("Could not play")
      setError(
        `Instruments could not load. Check your connection and try again. ${(failure as Error).message}`,
      )
    }
  }

  return (
    <main>
      <nav>
        <h1>MIDI Markup</h1>
        <a href="#notation">See Docs →</a>
      </nav>
      <section className="editor" aria-label="Composition editor">
        <header>
          <label className="header-title">
            <span className="sr-only">Composition title</span>
            <input aria-label="Composition title" defaultValue={exampleTitle} />
          </label>
          <div className="transport">
            <button
              onClick={() => void play()}
              disabled={active}
              aria-label="Play"
            >
              <Image
                src="/images/icon-play.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
            <button onClick={stop} disabled={!active} aria-label="Stop">
              <Image
                src="/images/icon-stop.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
        </header>
        <label className="sr-only" htmlFor="score">
          Music notation
        </label>
        <div className="track">
          <pre ref={highlighted} aria-hidden="true">
            {highlightScore(source).map(({ text, kind }, index) => (
              <span key={index} className={kind ? `track-${kind}` : undefined}>
                {text}
              </span>
            ))}
            {"\n "}
          </pre>
          <textarea
            id="score"
            spellCheck={false}
            wrap="off"
            rows={Math.min(18, Math.max(6, source.split("\n").length))}
            onScroll={(event) => {
              if (!highlighted.current) return
              highlighted.current.scrollTop = event.currentTarget.scrollTop
              highlighted.current.scrollLeft = event.currentTarget.scrollLeft
            }}
            value={source}
            onChange={(event) => setSource(event.target.value)}
            aria-describedby="editor-help playback-status"
            onKeyDown={(event) => {
              if (event.shiftKey && event.key === "Enter") {
                event.preventDefault()
                if (active) stop()
                else void play()
              }
            }}
            onKeyUp={(event) => {
              if (
                !speech ||
                !["ArrowUp", "ArrowDown"].includes(event.key) ||
                !window.speechSynthesis
              )
                return
              const text =
                event.currentTarget.value
                  .slice(0, event.currentTarget.selectionStart)
                  .split("\n")
                  .at(-1)
                  ?.trim()
                  .split(/\s+/)[0] || "Empty line"
              window.speechSynthesis.cancel()
              window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
            }}
          />
        </div>
        <div className="editor-footer">
          <p id="playback-status" role="status">
            {status}
          </p>
          <button onClick={() => setSpeech(!speech)} aria-pressed={speech}>
            Speak instrument {speech ? "on" : "off"}
          </button>
        </div>
      </section>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p id="editor-help" className="hint">
        Shift + Enter to play or stop. Instruments load on first play.
      </p>
      <details className="guide">
        <summary>Notation guide</summary>
        <section id="notation">
          <h2>Write what you hear.</h2>
          <p>
            Each line is a track. Tracks start together. Begin a line with an
            instrument, then add notes separated by spaces.
          </p>
          <dl>
            <div>
              <dt>Instruments</dt>
              <dd>{Object.keys(instruments).join(", ")}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>
                C D E F G A B. Add + or # for sharp, - for flat. C4 is a quarter
                note, C8 an eighth, C16 a sixteenth. A note without a number
                lasts one whole note.
              </dd>
            </div>
            <div>
              <dt>Rests</dt>
              <dd>Use R or a semicolon. R4 is a quarter rest.</dd>
            </div>
            <div>
              <dt>Tempo and octave</dt>
              <dd>
                T90 sets 90 BPM. OCTAVE5 raises the octave. Defaults are T120
                and OCTAVE4.
              </dd>
            </div>
          </dl>
        </section>
      </details>
      <footer>
        Created by Niko Lazaris + Stef Cohen + Jeff Anders @ SXSW Music
        Hackathon 2016. <a href="https://github.com/jhil/midimarkup">Source</a>
      </footer>
    </main>
  )
}
