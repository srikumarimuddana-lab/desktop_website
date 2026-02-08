'use client'

import DOMPurify from 'isomorphic-dompurify'

export default function SafeHtml({ content, className }) {
    if (!content) return null

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        />
    )
}
