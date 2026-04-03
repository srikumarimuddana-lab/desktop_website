/**
 * Build XML-bounded context string from retrieved knowledge base entries.
 * XML boundaries prevent the LLM from confusing context with the user question.
 *
 * @param {Array<{title, content, category, similarity}>} entries - Retrieved KB entries
 * @param {string} userType - 'rider', 'driver', or 'anonymous'
 * @returns {string} Formatted context string, or empty string if no entries
 */
export function buildStructuredContext(entries, userType) {
  if (!entries || entries.length === 0) return ''

  let ctx = '<context>\n'
  entries.forEach((entry, i) => {
    const relevance = entry.similarity
      ? (entry.similarity * 100).toFixed(0) + '%'
      : 'N/A'
    ctx += `<source index="${i + 1}" category="${entry.category || 'general'}" relevance="${relevance}">\n`
    ctx += `Title: ${entry.title}\n`
    ctx += `${entry.content}\n`
    ctx += `</source>\n`
  })
  ctx += '</context>'

  return ctx
}

/**
 * Format the user message with context and question in XML boundaries.
 *
 * @param {string} context - The XML-bounded context from buildStructuredContext
 * @param {string} question - The user's original question
 * @returns {string} Formatted user message for the LLM
 */
export function formatUserMessage(context, question) {
  if (!context) {
    return `<question>${question}</question>`
  }
  return `${context}\n\n<question>${question}</question>`
}
