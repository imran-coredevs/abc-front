import AuthBG from '@/assets/images/SignInBG.png'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useLoginUserStore } from '@/store/useLoginUserStore'
import { GeneratePassword } from './steps/GeneratePassword'
import { LoginStep } from './steps/LoginStep'
import { SendOtp } from './steps/SendOtp'

export type Stage = 'login' | 'sendotp' | 'generatepassword'

export default function LoginPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { user, token, isLoaded } = useLoginUserStore()
    const [stage, setStage] = useState<Stage>('login')

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (isLoaded && user && token) {
            navigate('/', { replace: true })
        }
    }, [isLoaded, user, token, navigate])

    // Check if user is coming from reset password link
    useEffect(() => {
        const isPasswordRoute =
            location.pathname === '/reset-password' || location.pathname === '/auth/set-password'
        if (isPasswordRoute && searchParams.get('token')) {
            setStage('generatepassword')
        }
    }, [location.pathname, searchParams])

    return (
        <>
            {isLoaded && user && token ? null : (
                <div
                    className="flex h-screen max-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${AuthBG})` }}
                >
                    <div className="flex h-full w-full flex-row p-4">
                        <div className="flex h-full w-full justify-center pt-10 lg:items-center lg:pt-0">
                            {stage === 'login' && <LoginStep setStage={setStage} />}
                            {stage === 'sendotp' && <SendOtp setStage={setStage} />}
                            {stage === 'generatepassword' && <GeneratePassword setStage={setStage} />}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
