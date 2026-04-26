// Semantic role descriptions for canonical color tokens.
// Lookup is by token name; if a token has no entry, no alias pill is shown.
// These are hand-curated guidance — extend as roles solidify.
//
// One day this map will live in the ledger as $extensions.bc.usage; for now
// it's hardcoded.

export const COLOR_ALIASES: Record<string, string[]> = {
  // Brand / primary
  'color/brand/primary': [
    'Use for: primary buttons, CTAs, selected nav, focused borders',
  ],
  'color/primary/500': [
    'Use for: secondary primary surfaces, accent highlights',
  ],
  'color/primary/50': [
    'Use for: hover backgrounds on primary elements',
  ],

  // Neutral (16-step ramp from /100 white to /1600 black)
  'color/neutral/100': [
    'Use for: page backgrounds, card surfaces',
  ],
  'color/neutral/200': [
    'Use for: borders, dividers, input strokes',
  ],
  'color/neutral/400': [
    'Use for: secondary text, placeholders, disabled text',
  ],
  'color/neutral/600': [
    'Use for: body text, default text',
  ],
  'color/neutral/1400': [
    'Use for: primary text, headings',
  ],

  // Feedback
  'color/success/500': [
    'Use for: success states, confirmations, positive feedback',
  ],
  'color/error/500': [
    'Use for: error states, destructive actions, validation failures',
  ],
  'color/warning/500': [
    'Use for: warning states, caution indicators',
  ],
  'color/info/500': [
    'Use for: informational states, links, focus indicators',
  ],
}
