import Separator from '@/components/ui/Separator'
import { instanceService } from '@/services/instanceService'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router'
import { useBinanceConnectionStore } from '@/store/useBinanceConnectionStore'
import BasicConfigSection from '../components/strategy-form/BasicConfigSection'
import FormActions from '../components/strategy-form/FormActions'
import StrategyFormHeader from '../components/strategy-form/StrategyFormHeader'
import { STRATEGY_FORM_DEFAULTS } from '../constants/strategy-form.defaults'
import type { StrategyFormData } from '../types/strategy-form.types'

type ApiErrorShape = {
    response?: {
        data?: {
            message?: string
            errors?: unknown
        }
    }
}

const buildRiskPayload = (data: StrategyFormData) => {
    const stopLoss = data.risk.stopLoss.type === 'FIXED_PERCENTAGE'
        ? {
              type: 'FIXED_PERCENTAGE',
              fixedPercentage: data.risk.stopLoss.fixedPercentage,
          }
        : {
              type: 'STRUCTURAL',
              structuralLookback: data.risk.stopLoss.structuralLookback,
              ...(data.risk.stopLoss.structuralBufferPercent != null
                  ? { structuralBufferPercent: data.risk.stopLoss.structuralBufferPercent }
                  : {}),
              ...(data.risk.stopLoss.structuralMaxDistancePercent != null
                  ? { structuralMaxDistancePercent: data.risk.stopLoss.structuralMaxDistancePercent }
                  : {}),
          }

    const takeProfit = data.risk.takeProfit.type === 'FIXED_PERCENTAGE'
        ? {
              type: 'FIXED_PERCENTAGE',
              fixedPercentage: data.risk.takeProfit.fixedPercentage,
          }
        : data.risk.takeProfit.type === 'RISK_REWARD'
          ? {
                type: 'RISK_REWARD',
                riskRewardRatio: data.risk.takeProfit.riskRewardRatio,
            }
          : {
                type: 'MULTI_LEVEL',
                partialLevels: data.risk.takeProfit.partialLevels,
            }

    return {
        stopLoss,
        breakEven: data.risk.breakEven,
        trailingStop: data.risk.trailingStop,
        takeProfit,
    }
}

const buildStrategyPayload = (data: StrategyFormData) => ({
    ...data,
    risk: buildRiskPayload(data),
})

export default function CreateEditStrategyPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const isEditMode = Boolean(id)
    const [isLoading, setIsLoading] = useState(isEditMode)
    const { isConnected, fetchConnectionStatus } = useBinanceConnectionStore()

    const methods = useForm<StrategyFormData>({
        defaultValues: STRATEGY_FORM_DEFAULTS,
    })
    const { handleSubmit, setError, clearErrors, reset, formState: { isSubmitting } } = methods
    type FormFieldPath = Parameters<typeof setError>[0]

    const getBackendFieldErrors = (errors: unknown): Array<{ path: string; message: string }> => {
        const fieldErrors: Array<{ path: string; message: string }> = []

        const walk = (value: unknown, currentPath: string) => {
            if (Array.isArray(value)) {
                // Collect ALL error messages (not just the first one)
                const messages = value.filter((item) => typeof item === 'string')
                if (messages.length > 0 && currentPath) {
                    // Join multiple messages with " • " separator
                    const combinedMessage = messages.join(' • ')
                    fieldErrors.push({ path: currentPath, message: combinedMessage })
                }
                return
            }

            if (typeof value === 'string') {
                if (currentPath) {
                    fieldErrors.push({ path: currentPath, message: value })
                }
                return
            }

            if (value && typeof value === 'object') {
                Object.entries(value).forEach(([key, nestedValue]) => {
                    const nextPath = currentPath ? `${currentPath}.${key}` : key
                    walk(nestedValue, nextPath)
                })
            }
        }

        walk(errors, '')
        return fieldErrors
    }

    // Fetch existing strategy data in edit mode
    useEffect(() => {
        const fetchStrategy = async () => {
            if (!id) return
            if (isConnected === null) {
                void fetchConnectionStatus()
                return
            }
            if (isConnected !== true) {
                toast.error('Please connect to Binance API key to load strategies')
                navigate('/strategy-management')
                return
            }

            try {
                setIsLoading(true)
                const response = await instanceService.getInstance(id)
                const instance = response.data

                // Map API response to form data
                const formData: StrategyFormData = {
                    name: instance.name,
                    symbols: instance.symbols,
                    timeframe: instance.timeframe,
                    tradeDirection: instance.tradeDirection,
                    candleType: instance.candleType,
                    capitalAllocationType: instance.capitalAllocationType,
                    allocationValue: instance.allocationValue,
                    leverage: instance.leverage,
                    maxOpenPositions: instance.maxOpenPositions,
                    maxPortfolioExposurePercentage: instance.maxPortfolioExposurePercentage,
                    maxTradeDuration: 0,
                    positionSizingMethod: instance.positionSizingMethod,
                    fixedTradeAmount: instance.fixedTradeAmount || 0,
                    capitalPercentagePerTrade: instance.capitalPercentagePerTrade || 0,
                    minSignalAgreement: instance.minSignalAgreement,
                    indicators: instance.indicators || {},
                    risk: instance.risk,
                    strategyExits: instance.strategyExits,
                }

                reset(formData)
            } catch (error: unknown) {
                const apiError = error as ApiErrorShape
                console.error('Failed to fetch strategy:', error)
                toast.error(apiError?.response?.data?.message || 'Failed to load strategy')
                navigate('/strategy-management')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStrategy()
    }, [id, reset, navigate, isConnected, fetchConnectionStatus])

    const onSubmit = async (data: StrategyFormData) => {
        if (isConnected !== true) {
            toast.error('Please connect to Binance API key to create strategies')
            return
        }

        try {
            clearErrors()
            const payload = buildStrategyPayload(data)

            if (isEditMode && id) {
                await instanceService.updateInstance(id, payload)
                toast.success('Strategy updated successfully')
                navigate(`/strategy-management/${id}`)
            } else {
                const response = await instanceService.createInstance(payload)
                toast.success('Strategy created successfully')
                navigate(`/strategy-management/${response.data._id}`)
            }
        } catch (error: unknown) {
            const apiError = error as ApiErrorShape
            const errorData = apiError?.response?.data
            
            console.error('Failed to save strategy:', error)
            console.error('Full error response:', errorData)
            console.error('Error structure:', {
                message: errorData?.message,
                errors: errorData?.errors,
                hasErrors: !!errorData?.errors,
            })

            // Try to parse backend field errors
            const backendFieldErrors = getBackendFieldErrors(errorData?.errors)
            
            if (backendFieldErrors.length > 0) {
                console.log(`Found ${backendFieldErrors.length} field errors:`, backendFieldErrors)
                backendFieldErrors.forEach(({ path, message }) => {
                    console.warn(`Setting field error: ${path} → ${message}`)
                    setError(path as FormFieldPath, { type: 'server', message })
                })
                toast.error('Please fix the validation errors below')
                return
            }

            // If no field-level errors, show the general error message
            const errorMessage = errorData?.message || 'Failed to save strategy'
            console.warn(`No field errors found, showing general error: ${errorMessage}`)
            toast.error(errorMessage)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="size-12 animate-spin rounded-full border-4 border-neutral-700 border-t-green-500" />
            </div>
        )
    }

    return (
        <FormProvider {...methods}>
            <div className="relative overflow-hidden">
                <div className="absolute -bottom-[20%] left-[50%] -z-1 -translate-x-1/2">
                    <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-900 to-blue-800 blur-[500px]" />
                </div>
                <StrategyFormHeader isEditMode={isEditMode} id={id} />
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <BasicConfigSection />
                    <Separator />
                    <FormActions isEditMode={isEditMode} id={id} isSubmitting={isSubmitting} />
                </form>
            </div>
        </FormProvider>
    )
}
