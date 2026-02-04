'use client'
import { useDriverRegistration } from "@/src/hooks/useDriverRegistration"
import { StepBasicInfo } from "./StepBasicInfo"
import { StepOtp } from "./StepOtp"
import { StepVehicle } from "./StepVehicle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export function WizardWrapper() {
    const {
        currentStep,
        submitPhoneOtp,
        submitEmailOtp,
        resendOtp,
        isLoading,
        formData
    } = useDriverRegistration()

    // Helper to determine title
    const getTitle = () => {
        switch (currentStep) {
            case 'BASIC_INFO': return 'Create your account'
            case 'PHONE_OTP': return 'Phone Verification'
            case 'EMAIL_OTP': return 'Email Verification'
            case 'VEHICLE_DETAILS': return 'Vehicle & Documents'
            case 'SUCCESS': return 'All Done!'
            default: return 'Driver Registration'
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-xl border-0 rounded-[30px] overflow-hidden bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                    {getTitle()}
                </CardTitle>
                {/* Simple Stepper UI */}
                <div className="flex justify-center gap-2 mt-4">
                    {['BASIC_INFO', 'PHONE_OTP', 'EMAIL_OTP', 'VEHICLE_DETAILS'].map((step, i) => {
                        const steps = ['BASIC_INFO', 'PHONE_OTP', 'EMAIL_OTP', 'VEHICLE_DETAILS', 'SUCCESS']
                        const currentIndex = steps.indexOf(currentStep)
                        const stepIndex = steps.indexOf(step)
                        const isActive = currentIndex === stepIndex
                        const isCompleted = currentIndex > stepIndex

                        return (
                            <div key={step} className={`h-2 w-12 rounded-full transition-colors ${isActive ? 'bg-[#E63946]' : isCompleted ? 'bg-red-200' : 'bg-gray-200'}`} />
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="p-8">
                {currentStep === 'BASIC_INFO' && <StepBasicInfo />}

                {currentStep === 'PHONE_OTP' && (
                    <StepOtp
                        type="PHONE"
                        target={formData.phone || ''}
                        onSubmit={submitPhoneOtp}
                        onResend={() => resendOtp('phone')}
                        isLoading={isLoading}
                    />
                )}

                {currentStep === 'EMAIL_OTP' && (
                    <StepOtp
                        type="EMAIL"
                        target={formData.email || ''}
                        onSubmit={submitEmailOtp}
                        onResend={() => resendOtp('email')}
                        isLoading={isLoading}
                    />
                )}

                {currentStep === 'VEHICLE_DETAILS' && <StepVehicle />}

                {currentStep === 'SUCCESS' && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We've received your details. Our team will review your documents and verify your profile within 24-48 hours.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
