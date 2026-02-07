'use client'

import DOMPurify from 'isomorphic-dompurify'

export default function LegalContent({ content }) {
    // Config for DOMPurify to allow specific tags/attributes if needed
    // For legal docs, standard sanitization is usually fine

    if (!content) return null

    return (
        <div
            className="prose prose-lg max-w-none
        prose-headings:text-slate-900 prose-headings:font-semibold
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
        prose-p:text-slate-700 prose-p:leading-relaxed
        prose-ul:text-slate-700 prose-li:text-slate-700
        prose-a:text-emerald-600 prose-a:hover:text-emerald-500"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        />
    )
}
