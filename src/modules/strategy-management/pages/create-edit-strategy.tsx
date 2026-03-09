import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { STRATEGY_FORM_DEFAULTS } from '../constants/strategy-form.defaults'
import BasicConfigSection from '../components/strategy-form/BasicConfigSection'
import FormActions from '../components/strategy-form/FormActions'
import IndicatorsSection from '../components/strategy-form/IndicatorsSection'
import RiskManagementSection from '../components/strategy-form/RiskManagementSection'
import StrategyExitsSection from '../components/strategy-form/StrategyExitsSection'
import StrategyFormHeader from '../components/strategy-form/StrategyFormHeader'
import type { StrategyFormData } from '../types/strategy-form.types'

export default function CreateEditStrategyPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const isEditMode = Boolean(id)

    const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm<StrategyFormData>({
        defaultValues: STRATEGY_FORM_DEFAULTS,
    })

    const onSubmit = (data: StrategyFormData) => {
        console.log(isEditMode ? 'Update strategy:' : 'Create strategy:', data)
        navigate('/strategy-management')
    }

    return (
        <div>
            <StrategyFormHeader isEditMode={isEditMode} id={id} />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <BasicConfigSection control={control} watch={watch} />
                <RiskManagementSection control={control} watch={watch} />
                <IndicatorsSection control={control} watch={watch} />
                <StrategyExitsSection control={control} watch={watch} />
                <FormActions isEditMode={isEditMode} id={id} isSubmitting={isSubmitting} />
            </form>
        </div>
    )
}
