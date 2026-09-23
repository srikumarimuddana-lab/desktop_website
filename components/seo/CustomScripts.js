'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Script from 'next/script'
import { supabase } from '@/lib/supabase'

/**
 * CustomScripts - Generic HTML/Script injector for SEO pages
 * 
 * WHY WE USE next/script FOR <script> TAGS:
 * ──────────────────────────────────────────
 * Browsers do NOT execute <script> tags inserted via innerHTML / dangerouslySetInnerHTML.
 * This is a security feature of the DOM spec. So if you paste a Google Analytics snippet
 * (or any <script> tag) into the admin SEO page, it would appear in the HTML but never
 * actually run — causing 404s for external scripts and silent failures for inline ones.
 * 
 * To solve this, we parse out any <script> tags from the raw HTML and render them using
 * Next.js's <Script> component, which properly loads and executes them.
 * 
 * ALL OTHER HTML (divs, noscript, meta tags, style tags, etc.) is rendered as-is via
 * dangerouslySetInnerHTML. You can put whatever HTML you want — this component is fully
 * generic. Only <script> tags get special treatment because they literally won't work
 * otherwise.
 *
 * position === 'head' is the one exception: its non-script HTML is server-rendered by
 * app/layout.js (via CustomHeadHtml/lib/sanitize-html.js) instead of here, so it's
 * present in the initial HTML for crawlers that don't run JS. This component still
 * fetches and renders that position's <script> tags, unaffected.
 *
 * @param {string} position - 'head' | 'body_start' | 'body_end'
 */

/**
 * Separates <script> tags from the rest of the HTML.
 * Returns { scripts: [...], nonScriptHtml: "..." }
 */
function separateScripts(html) {
    if (typeof window === 'undefined' || !html) return { scripts: [], nonScriptHtml: '' }

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Extract all <script> elements
    const scriptEls = doc.querySelectorAll('script')
    const scripts = Array.from(scriptEls).map((el, i) => ({
        src: el.getAttribute('src') || null,
        innerHTML: el.innerHTML || null,
        id: el.getAttribute('id') || `custom-script-${i}-${Date.now()}`,
        async: el.hasAttribute('async'),
    }))

    // Remove <script> tags from the parsed doc so we get the remaining HTML
    scriptEls.forEach(el => el.remove())

    // Get remaining non-script HTML (everything the user typed that isn't a <script>)
    const nonScriptHtml = doc.body.innerHTML + doc.head.innerHTML

    return { scripts, nonScriptHtml }
}

export default function CustomScripts({ position }) {
    const pathname = usePathname()
    const [scripts, setScripts] = useState([])
    const [nonScriptHtml, setNonScriptHtml] = useState('')

    useEffect(() => {
        async function fetchScripts() {
            const { data } = await supabase
                .from('seo_pages')
                .select(`custom_${position}`)
                .eq('path', pathname)
                .maybeSingle()

            if (data && data[`custom_${position}`]) {
                const { scripts: parsed, nonScriptHtml: html } = separateScripts(data[`custom_${position}`])
                setScripts(parsed)
                setNonScriptHtml(html)
            } else {
                setScripts([])
                setNonScriptHtml('')
            }
        }

        fetchScripts()
    }, [pathname, position])

    // Non-script HTML for position === 'head' is server-rendered instead —
    // see app/layout.js (CustomHeadHtml) — so it's never injected here.
    if (!scripts.length && !(nonScriptHtml && position !== 'head')) return null

    return (
        <>
            {/* Render any non-script HTML as-is (divs, noscript, meta, style, etc.) */}
            {nonScriptHtml && position !== 'head' && (
                <div dangerouslySetInnerHTML={{ __html: nonScriptHtml }} />
            )}

            {/* Render <script> tags via next/script so they actually execute */}
            {scripts.map((s) =>
                s.src ? (
                    <Script
                        key={s.id}
                        id={s.id}
                        src={s.src}
                        strategy={position === 'head' ? 'afterInteractive' : 'lazyOnload'}
                    />
                ) : s.innerHTML ? (
                    <Script
                        key={s.id}
                        id={s.id}
                        strategy={position === 'head' ? 'afterInteractive' : 'lazyOnload'}
                        dangerouslySetInnerHTML={{ __html: s.innerHTML }}
                    />
                ) : null
            )}
        </>
    )
}
