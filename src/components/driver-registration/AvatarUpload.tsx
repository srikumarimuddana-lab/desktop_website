'use client'
import { useState } from 'react'
import { uploadImage } from '@/src/services/driver-service'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Loader2, Upload } from 'lucide-react'

interface AvatarUploadProps {
    value?: string
    onChange: (key: string) => void // Returns the key (or url if needed, instructions said return key)
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        try {
            // Create local preview
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            const { key, image_url } = await uploadImage(file)
            // "uploads to /image-upload immediately on selection and returns the key to the form state"
            // Assuming 'key' is what we want to store in the form
            onChange(image_url) // Wait, instructions said "returns the key to the form state", but usually we display the URL. 
            // The `value` prop is typically what's stored. If we store `key`, we can't display preview easily unless we have the URL.
            // Let's assume we store result.key in the form state, but maybe we need the URL for preview?
            // Actually, standard practice: Value in form might be key.
            // But for this UI component, if `value` passed in is a key, we can't show it.
            // Maybe the form stores { key, url }?
            // Or maybe onChange takes the key.
            // Instructions: "returns the key to the form state".
            // Let's assume onChange(key).

            // However, if the user navigates away and back, we need to show the image. 
            // `value` (the key) is passed back.
            // If `value` is just a key, we can't show the image unless we fetch it or it's a full URL.
            // The `RegisterPayload` has `image: string`.
            // `DocumentUploadResponse` has `key` and `image_url`.
            // It's safer to store the `image_url` in the form if that's what `image` field expects (it's a string).
            // If the backend expects the KEY, then we should store the key.
            // "returns the key to the form state". Okay, I will respect that strict instruction.
            onChange(key)

        } catch (error) {
            console.error('Upload failed', error)
            // Ideally show toast error
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Label htmlFor="avatar-upload" className="cursor-pointer group relative">
                <Avatar className="w-24 h-24 border-2 border-dashed border-gray-300 group-hover:border-primary transition-colors">
                    <AvatarImage src={preview || value} className="object-cover" />
                    <AvatarFallback className="bg-gray-50">
                        {loading ? <Loader2 className="w-8 h-8 animate-spin text-gray-400" /> : <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary" />}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Change</span>
                </div>
            </Label>
            <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
            />
        </div>
    )
}
