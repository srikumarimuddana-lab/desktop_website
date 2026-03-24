export interface RegisterPayload {
    country_code: string
    phone: string
    name: string
    email: string
    image: string // URL or base64? Usually URL from previous upload, or raw? User said uploadImage returns {key, url}, likely key or url used here.
    license_number: string
    timeZone: string
}

export interface VehicleDetailsPayload {
    vehicle_id: string
    name: string
    model: string
    number: string
    year: string
    color: string
    vin: string
    child_seat_availabilty: boolean // Typo preserved as requested
    wheel_chair_availabilty: boolean // Typo preserved as requested
    vehicle_insurance_image: string
    vehicle_registration_image: string
}

export interface DocumentUploadResponse {
    key: string
    image_url: string
}

export interface AuthResponse {
    token: string
    access_token?: string // For OTP steps
}
