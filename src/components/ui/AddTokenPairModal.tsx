import { useForm } from 'react-hook-form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'

interface AddTokenPairModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddPair: (data: { tokenAddress: string; feeTier: number }) => void
    isSubmitting?: boolean
}

export const AddTokenPairModal = ({ open, onOpenChange, onAddPair, isSubmitting }: AddTokenPairModalProps) => {
    const { control, handleSubmit, reset, formState: { errors }} = useForm({
        defaultValues: {
            tokenAddress: '',
            feeTier: '',
        },
    })

    const onSubmit = (data: { tokenAddress: string; feeTier: string }) => {
        // Convert fee tier string to number and divide by 1000
        // e.g., "3000" -> 3000 / 1000 = 3 -> 0.003 (0.3%)
        const feeTierNumber = parseInt(data.feeTier, 10)
        
        onAddPair({
            tokenAddress: data.tokenAddress.trim(),
            feeTier: feeTierNumber / 10000, // Convert basis points to decimal (3000 -> 0.003)
        })
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:!max-w-3xl rounded-lg border border-neutral-700 bg-neutral-950 lg:p-10">
                <DialogHeader>
                    <DialogTitle className="lg:-mt-4 text-[25px] leading-8 font-semibold text-neutral-100">
                        Add Token Pair
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-neutral-300">
                        Select the two tokens you want the bot to monitor across Uniswap v3 and Aerodrome
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-8" />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputField
                        name="tokenAddress"
                        control={control}
                        label="Token Address"
                        placeholder="Enter token address"
                        rules={{ required: 'Token Address is required' }}
                        required
                    />
                    <InputField
                        name="feeTier"
                        control={control}
                        label="Uniswap V3 Fee Tier"
                        placeholder="e.g., 500, 3000, 10000"
                        rules={{
                            required: 'Fee Tier is required',
                            pattern: { value: /^\d+$/, message: 'Fee Tier must be a number' },
                        }}
                        required
                    />

                    
                    {errors.tokenAddress && <p className="text-sm text-red-500">{errors.tokenAddress.message}</p>}
                    {errors.feeTier && <p className="text-sm text-red-500">{errors.feeTier.message}</p>}

                    <Separator className="my-8" />

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" className="w-full sm:w-auto" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Pair'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
