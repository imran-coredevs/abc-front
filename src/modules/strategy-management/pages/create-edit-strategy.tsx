import Separator from '@/components/ui/Separator'
import { instanceService } from '@/services/instanceService'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import BasicConfigSection from '../components/strategy-form/BasicConfigSection'
import FormActions from '../components/strategy-form/FormActions'
import StrategyFormHeader from '../components/strategy-form/StrategyFormHeader'
import { STRATEGY_FORM_DEFAULTS } from '../constants/strategy-form.defaults'
import type { StrategyFormData } from '../types/strategy-form.types'

export default function CreateEditStrategyPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const isEditMode = Boolean(id)
    const [isLoading, setIsLoading] = useState(isEditMode)

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { isSubmitting },
    } = useForm<StrategyFormData>({
        defaultValues: STRATEGY_FORM_DEFAULTS,
    })

    // Fetch existing strategy data in edit mode
    useEffect(() => {
        const fetchStrategy = async () => {
            if (!id) return

            try {
                setIsLoading(true)
                const response = await instanceService.getInstance(id)
                const instance = response.data
                
                // Map API response to form data
                const formData: StrategyFormData = {
                    name: instance.name,
                    symbol: instance.symbol,
                    timeframe: instance.timeframe,
                    tradeDirection: instance.tradeDirection,
                    candleType: instance.candleType,
                    marginType: instance.marginType,
                    capitalAllocationType: instance.capitalAllocationType,
                    allocationValue: instance.allocationValue,
                    leverage: instance.leverage,
                    maxOpenPositions: instance.maxOpenPositions,
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
            } catch (error: any) {
                console.error('Failed to fetch strategy:', error)
                toast.error(error?.response?.data?.message || 'Failed to load strategy')
                navigate('/strategy-management')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStrategy()
    }, [id, reset, navigate])

    const onSubmit = async (data: StrategyFormData) => {
        try {
            if (isEditMode && id) {
                await instanceService.updateInstance(id, data)
                toast.success('Strategy updated successfully')
                navigate(`/strategy-management/${id}`)
            } else {
                const response = await instanceService.createInstance(data)
                toast.success('Strategy created successfully')
                navigate(`/strategy-management/${response.data._id}`)
            }
        } catch (error: any) {
            console.error('Failed to save strategy:', error)
            const errorMessage = error?.response?.data?.message || 'Failed to save strategy'
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
        <div className="relative overflow-hidden">
            <div className="absolute -bottom-[20%] left-[50%] -z-1 -translate-x-1/2">
                <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-900 to-blue-800 blur-[500px]" />
            </div>
            <StrategyFormHeader isEditMode={isEditMode} id={id} />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <BasicConfigSection control={control} watch={watch} setValue={setValue} />
                <Separator />
                <FormActions isEditMode={isEditMode} id={id} isSubmitting={isSubmitting} />
            </form>
        </div>
    )
}
