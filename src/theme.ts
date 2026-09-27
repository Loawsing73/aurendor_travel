export const CHART = {
  accent: '#1f4f82',
  ink: '#111418',
  muted: '#5f6670',
  rule: '#e3e6ea',
  hover: '#f3f5f7',
  mono: "'IBM Plex Mono', ui-monospace, monospace",
}

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#ffffff',
    border: `1px solid ${CHART.ink}`,
    borderRadius: 0,
    fontFamily: CHART.mono,
    fontSize: 12,
  },
  labelStyle: { color: CHART.ink, fontWeight: 500 },
}