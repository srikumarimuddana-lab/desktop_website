import {
    RegisterPayload,
    VehicleDetailsPayload,
    DocumentUploadResponse,
    AuthResponse
} from '@/src/types/driver-api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.spinr.app' // Fallback or strictly env

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

export async function uploadImage(file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_BASE_URL}/image-upload`, {
        method: 'POST',
        body: formData,
        // Content-Type is set automatically with FormData
    })

    return handleResponse<DocumentUploadResponse>(response)
}

export async function registerDriver(data: RegisterPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/become/driver`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return handleResponse<AuthResponse>(response)
}

export async function verifyPhoneOtp(otp: string, token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-phone`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp }),
    })

    return handleResponse<AuthResponse>(response)
}

export async function verifyEmailOtp(otp: string, token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp }),
    })

    return handleResponse<AuthResponse>(response)
}

export async function fetchVehicleTypes(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vehicle/types`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })

    return handleResponse<any>(response)
}

export async function fetchDocTypes(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/driver/doc-type`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })

    return handleResponse<any>(response)
}

export async function submitVehicleDetails(data: VehicleDetailsPayload, token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/driver/set-vehicle-detail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })

    return handleResponse<any>(response)
}

export async function submitFinalDocs(docs: any[], token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/edit-profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ documents: docs }), // Assuming wrapped in object, typical for APIs, but instructions said "submitFinalDocs(docs: any[])...". 
        // If the API expects the array directly, I should change this. 
        // "submitFinalDocs(docs: any[], token: string) -> PUT /auth/edit-profile"
        // Usually /edit-profile takes an object merging updates. I'll assume { documents: docs } or spread docs? 
        // Given previous payloads were objects, likely this is a partial update. 
        // Safeguard: I'll assume the payload is { documents: docs } or similar based on typical patterns unless user specified payload structure strictly for this call which they didn't, other than the arg name.
        // Wait, let's look at `RegisterPayload` vs `submitFinalDocs`. 
        // I will adhere to sending `docs` as part of a body. I'll wrap it in `{ documents: docs }` as a reasonable default for "submitting docs" to a profile endpoint.
    })

    // Actually, re-reading: "submitFinalDocs(docs: any[], token: string)"
    // The API endpoint is `/auth/edit-profile`. This usually takes user profile fields.
    // Maybe `docs` is just one field? Or the body IS the docs array? (Unlikely for edit-profile).
    // I'll stick to `JSON.stringify({ documents: docs })` but add a comment or allow passing the whole object if needed.
    // For now, I'll send it as `docs` if it matches the legacy structure.

    return handleResponse<any>(response)
}
