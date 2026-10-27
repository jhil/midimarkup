import { instruments } from "./notation.ts"

export function highlightScore(source: string) {
  return source.split(/(\s+)/).flatMap((text) => {
    const token = text.toUpperCase()
    let kind = ""
    if (Object.hasOwn(instruments, token)) kind = "instrument"
    else if (/^[R;](1|2|4|8|16|32)?$/.test(token)) kind = "rest"
    else if (/^[A-G][+#-]?(1|2|4|8|16|32)?$/.test(token)) kind = "note"
    else if (/^(T\d+|OCTAVE\d)$/.test(token)) kind = "modifier"
    if (kind === "note" || kind === "rest") {
      const [, name, duration] = /^([^0-9]+)([0-9]*)$/.exec(text)!
      return [
        { text: name, kind },
        ...(duration ? [{ text: duration, kind: "modifier" }] : []),
      ]
    }
    return [{ text, kind }]
  })
}
