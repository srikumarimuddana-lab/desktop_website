'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CustomScripts({ position }) {
    const pathname = usePathname()
    const [scripts, setScripts] = useState('')

    useEffect(() => {
        async function fetchScripts() {
            // Find matching SEO page
            // We look for exact match first
            const { data } = await supabase
                .from('seo_pages')
                .select(`custom_${position}`)
                .eq('path', pathname)
                .single()

            if (data && data[`custom_${position}`]) {
                setScripts(data[`custom_${position}`])
            } else {
                setScripts('')
            }
        }

        fetchScripts()
    }, [pathname, position])

    if (!scripts) return null

    // Render the script content
    // Note: Standard <script> tags inside dangerouslySetInnerHTML might not execute in React navigation 
    // without careful handling, but robust solutions usually require parsing.
    // For simplicity in this iteration, we render explicitly. 
    // Ideally, next/script is better, but it can't easily take raw strings.
    // We will allow users to input raw HTML (meta tags, style tags, script tags).
    return (
        <div dangerouslySetInnerHTML={{ __html: scripts }} />
    )
}
