'use client'

// Wizard step 3 — required documents. Requirements come from
// GET /drivers/requirements (service-area aware); each file is uploaded
// immediately via multipart POST /drivers/documents/upload. Re-uploading a
// rejected/expired document supersedes the old one server-side.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FileUpload from '@/components/driver/FileUpload'
import { apiFetch } from '@/lib/spinr-api'

const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

function latestDocFor(documents, requirement, side) {
  // documents come newest-first; match on denormalized document_type (name)
  return documents.find(
    (d) =>
      d.document_type === requirement.name &&
      (side ? d.side === side : true) &&
      d.status !== 'superseded'
  )
}

function UploadSlot({ requirement, side, doc, expiry, onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = useCallback(
    async (file) => {
      if (!file) return
      setError(null)
      setUploading(true)
      try {
        await onUpload(requirement, side, file, expiry)
      } catch (err) {
        setError(err.message)
      } finally {
        setUploading(false)
      }
    },
    [onUpload, requirement, side, expiry]
  )

  return (
    <div className="flex-1 min-w-0">
      <FileUpload
        label={side ? `${side === 'front' ? 'Front' : 'Back'} side` : null}
        file={null}
        onFileSelected={handleFile}
        uploading={uploading}
        uploaded={Boolean(doc)}
        error={error || (doc?.status === 'rejected' ? doc.rejection_reason || 'Rejected — please re-upload' : null)}
      />
    </div>
  )
}

export default function StepDocuments({ user, onboardingStatus, onDone }) {
  const [requirements, setRequirements] = useState(null)
  const [documents, setDocuments] = useState([])
  const [expiryByReq, setExpiryByReq] = useState({})
  const [finishing, setFinishing] = useState(false)

  const load = useCallback(async () => {
    const [reqs, docs] = await Promise.all([
      apiFetch('/api/v1/drivers/requirements'),
      apiFetch('/api/v1/drivers/documents'),
    ])
    setRequirements(reqs || [])
    setDocuments(docs || [])
  }, [])

  useEffect(() => {
    load().catch((err) => {
      toast.error(err.message)
      setRequirements([])
    })
  }, [load])

  const handleUpload = useCallback(
    async (requirement, side, file, expiry) => {
      const form = new FormData()
      form.append('file', file)
      form.append('requirement_id', requirement.id)
      if (side) form.append('side', side)
      if (expiry) form.append('expiry_date', expiry)
      await apiFetch('/api/v1/drivers/documents/upload', { method: 'POST', body: form })
      toast.success(`${requirement.name}${side ? ` (${side})` : ''} uploaded`)
      await load()
    },
    [load]
  )

  const mandatory = useMemo(
    () => (requirements || []).filter((r) => r.is_mandatory !== false),
    [requirements]
  )

  const allUploaded = useMemo(() => {
    if (!requirements) return false
    return mandatory.every((r) => {
      const front = latestDocFor(documents, r, r.requires_back_side ? 'front' : null)
      const back = r.requires_back_side ? latestDocFor(documents, r, 'back') : true
      const ok = (d) => d && d.status !== 'rejected'
      return ok(front) && (r.requires_back_side ? ok(back) : true)
    })
  }, [requirements, mandatory, documents])

  async function handleFinish() {
    setFinishing(true)
    try {
      await onDone?.()
    } finally {
      setFinishing(false)
    }
  }

  if (requirements === null) {
    return <p className="py-8 text-center text-gray-500">Loading requirements…</p>
  }

  if (requirements.length === 0) {
    return (
      <div className="py-8 text-center space-y-4">
        <p className="text-gray-600">
          No documents are configured for your area yet. Your application has been
          received — we'll email you when document upload opens.
        </p>
        <Button onClick={handleFinish} disabled={finishing}>
          Finish
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {onboardingStatus === 'documents_rejected' && (
        <p className="text-sm rounded-md bg-red-50 text-red-700 p-3">
          One or more documents were rejected. Re-upload the flagged items below.
        </p>
      )}
      {onboardingStatus === 'documents_expired' && (
        <p className="text-sm rounded-md bg-amber-50 text-amber-800 p-3">
          One or more documents have expired. Upload current versions below.
        </p>
      )}

      {requirements.map((req) => {
        const front = latestDocFor(documents, req, req.requires_back_side ? 'front' : null)
        const back = req.requires_back_side ? latestDocFor(documents, req, 'back') : null
        const shown = front || back
        return (
          <div key={req.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium">
                  {req.name}
                  {req.is_mandatory !== false && <span className="text-red-500"> *</span>}
                </p>
                {req.description && <p className="text-xs text-gray-500">{req.description}</p>}
              </div>
              {shown && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${STATUS_BADGE[shown.status] || 'bg-gray-100 text-gray-600'}`}
                >
                  {shown.status}
                </span>
              )}
            </div>
            {req.has_expiry && (
              <div className="space-y-1 max-w-xs">
                <Label htmlFor={`exp-${req.id}`} className="text-xs">
                  Document expiry date
                </Label>
                <Input
                  id={`exp-${req.id}`}
                  type="date"
                  value={expiryByReq[req.id] || ''}
                  onChange={(e) =>
                    setExpiryByReq((m) => ({ ...m, [req.id]: e.target.value }))
                  }
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {req.requires_back_side ? (
                <>
                  <UploadSlot
                    requirement={req}
                    side="front"
                    doc={front}
                    expiry={expiryByReq[req.id]}
                    onUpload={handleUpload}
                  />
                  <UploadSlot
                    requirement={req}
                    side="back"
                    doc={back}
                    expiry={expiryByReq[req.id]}
                    onUpload={handleUpload}
                  />
                </>
              ) : (
                <UploadSlot
                  requirement={req}
                  side={null}
                  doc={front}
                  expiry={expiryByReq[req.id]}
                  onUpload={handleUpload}
                />
              )}
            </div>
          </div>
        )
      })}

      <Button className="w-full" onClick={handleFinish} disabled={!allUploaded || finishing}>
        {finishing ? 'Submitting…' : 'Submit application for review'}
      </Button>
      {!allUploaded && (
        <p className="text-xs text-center text-gray-500">
          Upload every required document to submit your application.
        </p>
      )}
    </div>
  )
}
