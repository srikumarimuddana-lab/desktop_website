'use client'

// Drag-and-drop file picker for driver document uploads.
// Selection-only component: the parent performs the actual upload
// (multipart POST via apiFetch + FormData) and passes busy/uploaded state.

import { useCallback, useRef, useState } from 'react'
import { CheckCircle2, FileText, Loader2, UploadCloud, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_SIZE_MB = 10
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export default function FileUpload({
  label,
  file,
  onFileSelected, // (File|null) => void
  uploading = false,
  uploaded = false, // already on file with the backend
  error = null,
  className,
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState(null)

  const pick = useCallback(
    (candidate) => {
      setLocalError(null)
      if (!candidate) return
      if (!ACCEPTED.includes(candidate.type)) {
        setLocalError('Use a JPG, PNG, WebP or PDF file.')
        return
      }
      if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`File is too large (max ${MAX_SIZE_MB} MB).`)
        return
      }
      onFileSelected?.(candidate)
    },
    [onFileSelected]
  )

  const message = localError || error

  return (
    <div className={className}>
      {label && <p className="text-sm font-medium mb-1.5">{label}</p>}
      <div
        role="button"
        tabIndex={0}
        aria-label={label ? `Upload ${label}` : 'Upload file'}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !uploading) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (!uploading) pick(e.dataTransfer.files?.[0])
        }}
        className={cn(
          'flex items-center gap-3 rounded-lg border-2 border-dashed p-4 cursor-pointer transition-colors',
          dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/60',
          uploading && 'opacity-70 cursor-wait',
          uploaded && !file && 'border-green-500/60 bg-green-50'
        )}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary" />
        ) : uploaded && !file ? (
          <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
        ) : file ? (
          <FileText className="h-6 w-6 shrink-0 text-primary" />
        ) : (
          <UploadCloud className="h-6 w-6 shrink-0 text-gray-400" />
        )}
        <div className="min-w-0 flex-1">
          {file ? (
            <p className="text-sm font-medium truncate">{file.name}</p>
          ) : uploaded ? (
            <p className="text-sm font-medium text-green-700">Uploaded — click to replace</p>
          ) : (
            <p className="text-sm text-gray-600">
              <span className="text-primary font-medium">Choose a file</span> or drag it here
            </p>
          )}
          <p className="text-xs text-gray-400">JPG, PNG, WebP or PDF · max {MAX_SIZE_MB} MB</p>
        </div>
        {file && !uploading && (
          <button
            type="button"
            aria-label="Remove file"
            className="shrink-0 text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation()
              setLocalError(null)
              onFileSelected?.(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {message && <p className="text-sm text-red-600 mt-1">{message}</p>}
    </div>
  )
}
