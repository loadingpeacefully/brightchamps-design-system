// Figma library file ID — single source of truth.
export const FIGMA_FILE_ID = '8eNJf875iY9HISEsczDfOh'

/**
 * Build a Figma `embed?embed_host=share` URL for a given node-id.
 *
 * Figma's embed endpoint expects the node-id passed inside a URL-encoded
 * Figma URL. The node-id itself uses `-` as the separator inside that URL
 * (e.g. `69-2`), even though Plugin API IDs use `:` (`69:2`).
 *
 * @example getFigmaEmbedUrl("69:2")
 * // → https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2F8eNJf875iY9HISEsczDfOh%2F%3Fnode-id%3D69-2
 */
export function getFigmaEmbedUrl(nodeId: string): string {
  const encodedNodeId = nodeId.replace(':', '-')
  return `https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2F${FIGMA_FILE_ID}%2F%3Fnode-id%3D${encodedNodeId}`
}

/** Direct (non-embed) link, for "Open in Figma →" affordances. */
export function getFigmaLinkUrl(nodeId: string): string {
  const encodedNodeId = nodeId.replace(':', '-')
  return `https://www.figma.com/design/${FIGMA_FILE_ID}/?node-id=${encodedNodeId}`
}
