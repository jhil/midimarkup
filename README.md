# MIDI Markup

Compose music with a keyboard in an accessible text editor.

Live at https://midimarkup.jeffand.co.

Each line is a track and all tracks start together. Use PIANO, GUITAR, SAXOPHONE, TRUMPET, VIOLIN, FLUTE, or DRUMS. `T90` sets tempo, `OCTAVE5` sets octave, `C4` is a quarter note, `C16` a sixteenth, and `R4` or `;4` a quarter rest. Use `+` or `#` for sharp and `-` for flat. Shift + Enter plays or stops.

Instrument samples load over the network on first play through [smplr](https://github.com/danigb/smplr). Loading failures are shown in the editor. No microphone or MIDI device is required.

Created by Jeff Anders, Stef Cohen, and Niko Lazaris at SXSW Music Hackathon 2016.

## Development

Use Node 24 and the pinned pnpm release from `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm test          # focused behavior tests
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build         # Next static export into out/
pnpm check         # all checks and the production build
pnpm preview       # serve the exported files with Wrangler
pnpm cf:deploy     # build and deploy to Cloudflare Workers
```

`wrangler.jsonc` owns the subdomain. Deployment requires Cloudflare credentials with Workers and zone access. No application secrets are required. Build output and local credentials stay out of Git.

Browser verification covers the core interaction, a direct reload, keyboard operation, and a narrow viewport. Audio changes also require a listening check.
