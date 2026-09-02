'use client'

import { sanitizeHtml } from '@/lib/sanitize-html'

/* The spinrvm backend stores FAQ answers as PLAIN TEXT (60/60 live rows carry
 * no tags; 7 use blank lines between paragraphs), while the website CMS stores
 * Tiptap HTML. Rendering plain text as HTML collapsed those paragraphs into one
 * block and would mangle a literal '<' or '&'. So: content with no tag in it is
 * escaped and paragraphed here; anything that already looks like HTML goes
 * through the allowlist sanitizer in lib/sanitize-html.js. (That used to be
 * isomorphic-dompurify, whose server side needs jsdom — which cannot load on
 * Vercel's runtime and took the page down with a 500; see that file.) */
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
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        />
    )
}
