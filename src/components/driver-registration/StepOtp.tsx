'use client'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2 } from "lucide-react"

const otpSchema = z.object({
    otp: z.string().min(4, "OTP must be at least 4 characters"), // Adjust length as needed (4 or 6)
})

interface StepOtpProps {
    type: 'PHONE' | 'EMAIL'
    target: string
    onSubmit: (otp: string) => Promise<void>
    onResend: () => Promise<void>
    isLoading: boolean
}

export function StepOtp({ type, target, onSubmit, onResend, isLoading }: StepOtpProps) {
    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    })

    async function handleSubmit(values: z.infer<typeof otpSchema>) {
        await onSubmit(values.otp)
    }

    return (
        <div className="max-w-md mx-auto py-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
                {type === 'PHONE' ? 'Verify Phone Number' : 'Verify Email Address'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Enter the code sent to <span className="font-medium text-gray-900">{target}</span>
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="flex justify-center">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-[#E63946] hover:bg-[#d0333f]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify
                    </Button>

                    <div className="text-sm text-gray-500 mt-4">
                        Didn't receive code?{' '}
                        <button
                            type="button"
                            onClick={onResend}
                            className="text-[#E63946] font-medium hover:underline"
                            disabled={isLoading}
                        >
                            Resend
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
