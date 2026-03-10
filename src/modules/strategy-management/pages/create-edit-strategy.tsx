import Separator from '@/components/ui/Separator'
import { useStrategyStore } from '@/store/useStrategyStore'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import BasicConfigSection from '../components/strategy-form/BasicConfigSection'
import FormActions from '../components/strategy-form/FormActions'
import StrategyFormHeader from '../components/strategy-form/StrategyFormHeader'
import { STRATEGY_FORM_DEFAULTS } from '../constants/strategy-form.defaults'
import type { StrategyFormData } from '../types/strategy-form.types'

export default function CreateEditStrategyPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const isEditMode = Boolean(id)

    const { addStrategy, updateStrategy, getById } = useStrategyStore()
    const existing = id ? getById(id) : undefined

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm<StrategyFormData>({
        defaultValues: existing?.formData ?? STRATEGY_FORM_DEFAULTS,
    })

    const onSubmit = (data: StrategyFormData) => {
        if (isEditMode && id) {
            updateStrategy(id, data)
            navigate(`/strategy-management/${id}`)
        } else {
            const newId = addStrategy(data)
            navigate(`/strategy-management/${newId}`)
        }
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
