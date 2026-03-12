import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

type Props = {
    isEditMode: boolean
    id?: string
    isSubmitting: boolean
}

export default function FormActions({ isEditMode, id, isSubmitting }: Props) {
    const navigate = useNavigate()

    const cancelPath = isEditMode ? `/strategy-management/${id}` : '/strategy-management'

    return (
        <div className="flex flex-wrap items-center gap-4 pb-8">
            <Button type="submit" disabled={isSubmitting}>
                {isEditMode ? 'Save Changes' : 'Create Strategy'}
            </Button>
            <Button className="px-10" type="button" variant="secondary" onClick={() => navigate(cancelPath)}>
                Cancel
            </Button>
        </div>
    )
}
