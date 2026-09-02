'use client'

import DOMPurify from 'isomorphic-dompurify'

/* The spinrvm backend stores FAQ answers as PLAIN TEXT (60/60 live rows carry
 * no tags; 7 use blank lines between paragraphs), while the website CMS stores
 * Tiptap HTML. Rendering plain text as HTML collapsed those paragraphs into one
 * block and would mangle a literal '<' or '&'. So: content with no tag in it is
 * escaped and paragraphed here; anything that already looks like HTML is left
 * to DOMPurify exactly as before. */
const looksLikeHtml = (s) => /<[a-z!/][^>]*>/i.test(s)

const escapeHtml = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function plainTextToHtml(text) {
    return text
        .trim()
        .split(/\n\s*\n/)
        .map((para) => `<p>${escapeHtml(para).replace(/\n/g, '<br />')}</p>`)
        .join('')
}

export default function SafeHtml({ content, className }) {
    if (!content) return null

    const html = looksLikeHtml(content) ? content : plainTextToHtml(String(content))

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
        />
    )
}
