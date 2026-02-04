import { useState, useEffect } from 'react'
import {
    registerDriver,
    verifyPhoneOtp,
    verifyEmailOtp,
    // resendOtp - Service not explicitly defined in previous step, will handle logic locally or assume reuse
} from '../services/driver-service'
import { RegisterPayload, AuthResponse } from '../types/driver-api'

export type RegistrationStep = 'BASIC_INFO' | 'PHONE_OTP' | 'EMAIL_OTP' | 'VEHICLE_DETAILS' | 'SUCCESS'

interface UseDriverRegistrationReturn {
    currentStep: RegistrationStep
    authToken: string | null
    formData: Partial<RegisterPayload>
    isLoading: boolean
    error: string | null
    submitBasicInfo: (data: RegisterPayload) => Promise<void>
    submitPhoneOtp: (otp: string) => Promise<void>
    submitEmailOtp: (otp: string) => Promise<void>
    resendOtp: (type: 'phone' | 'email') => Promise<void>
    resetState: () => void
}

const STORAGE_KEYS = {
    STEP: 'driver_reg_step',
    TOKEN: 'driver_reg_token',
    DATA: 'driver_reg_data'
}

export function useDriverRegistration(): UseDriverRegistrationReturn {
    // Initialize state from localStorage if available
    const [currentStep, setCurrentStep] = useState<RegistrationStep>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem(STORAGE_KEYS.STEP) as RegistrationStep) || 'BASIC_INFO'
        }
        return 'BASIC_INFO'
    })

    const [authToken, setAuthToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEYS.TOKEN)
        }
        return null
    })

    const [formData, setFormData] = useState<Partial<RegisterPayload>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEYS.DATA)
            return saved ? JSON.parse(saved) : {}
        }
        return {}
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Persist state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.STEP, currentStep)
            if (authToken) localStorage.setItem(STORAGE_KEYS.TOKEN, authToken)
            else localStorage.removeItem(STORAGE_KEYS.TOKEN)
            localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(formData))
        }
    }, [currentStep, authToken, formData])

    const submitBasicInfo = async (data: RegisterPayload) => {
        setIsLoading(true)
        setError(null)
        try {
            // Save form data first
            setFormData(prev => ({ ...prev, ...data }))

            const response = await registerDriver(data)
            if (response.token) {
                setAuthToken(response.token)
                setCurrentStep('PHONE_OTP')
            } else {
                throw new Error('No access token received from registration')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit basic info')
        } finally {
            setIsLoading(false)
        }
    }

    const submitPhoneOtp = async (otp: string) => {
        setIsLoading(true)
        setError(null)
        try {
            if (!authToken) throw new Error('No auth token found')

            const response = await verifyPhoneOtp(otp, authToken)
            // Update token if refreshed/provided
            if (response.token || response.access_token) {
                setAuthToken(response.token || response.access_token || authToken)
            }

            setCurrentStep('EMAIL_OTP')
        } catch (err: any) {
            setError(err.message || 'Failed to verify phone OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const submitEmailOtp = async (otp: string) => {
        setIsLoading(true)
        setError(null)
        try {
            if (!authToken) throw new Error('No auth token found')

            const response = await verifyEmailOtp(otp, authToken)
            // Update token if refreshed
            if (response.token || response.access_token) {
                setAuthToken(response.token || response.access_token || authToken)
            }

            setCurrentStep('VEHICLE_DETAILS')
        } catch (err: any) {
            setError(err.message || 'Failed to verify email OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const resendOtp = async (type: 'phone' | 'email') => {
        setIsLoading(true)
        setError(null)
        try {
            if (type === 'phone') {
                // Typically involves re-triggering registration or a specific resend endpoint
                // Assuming we have the data to re-request, or relying on backend behavior
                if (formData.country_code && formData.phone && formData.name && formData.email && formData.license_number && formData.image && formData.timeZone) {
                    await registerDriver(formData as RegisterPayload)
                } else {
                    throw new Error('Missing registration data to resend OTP')
                }
            } else {
                // Logic for resending email OTP
                // Likely re-triggering phone verification success or specific endpoint
                // For now, placeholder or assuming verifyPhoneOtp might trigger it if we had the phone OTP again
                // But we don't store the OTP.
                // If an explicit resend endpoint exists, it should be called here.
                // Since it wasn't defined in the service step, we'll log logic gap or attempt a re-request if possible.
                console.warn('Resend Email OTP logic requires specific endpoint')
            }
        } catch (err: any) {
            setError(err.message || `Failed to resend ${type} OTP`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetState = () => {
        setCurrentStep('BASIC_INFO')
        setAuthToken(null)
        setFormData({})
        setError(null)
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.STEP)
            localStorage.removeItem(STORAGE_KEYS.TOKEN)
            localStorage.removeItem(STORAGE_KEYS.DATA)
        }
    }

    return {
        currentStep,
        authToken,
        formData,
        isLoading,
        error,
        submitBasicInfo,
        submitPhoneOtp,
        submitEmailOtp,
        resendOtp,
        resetState
    }
}
