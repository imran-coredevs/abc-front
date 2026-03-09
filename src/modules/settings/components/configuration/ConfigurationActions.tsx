import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader'

interface ConfigurationActionsProps {
    hasUnsavedChanges: boolean
    hasSavedConfig: boolean
    onResetToDefault: () => void
    isSaving?: boolean
}

export const ConfigurationActions = ({
    hasUnsavedChanges,
    hasSavedConfig,
    onResetToDefault,
    isSaving = false,
}: ConfigurationActionsProps) => {
    return (
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button type="submit" className="px-6 sm:px-8 text-base sm:text-lg text-neutral-950" disabled={!hasUnsavedChanges || isSaving}>
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <Loader className="size-4" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        'Save Changes'
                    )}
                </Button>

                <Button type="button" onClick={onResetToDefault} variant="secondary" className="px-6 sm:px-8 text-base sm:text-lg" disabled={isSaving}>
                    Reset to Default
                </Button>
            </div>

            {hasSavedConfig && !isSaving && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
                    <div className="size-2 rounded-full bg-green-500"></div>
                    <span>Configuration saved</span>
                </div>
            )}
        </div>
    )
}
