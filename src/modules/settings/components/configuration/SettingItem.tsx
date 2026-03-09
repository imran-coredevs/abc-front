import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'

interface SettingItemProps {
    title: string
    subTitle?: string
    description?: string
    name: string
    control: any
    placeholder?: string
}

export const SettingItem = ({ title, subTitle, description, name, control, placeholder }: SettingItemProps) => (
    <>
        <div className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-[12.5rem]">
            <div className="flex max-w-full lg:max-w-[42.5rem] flex-1 flex-col gap-2">
                <p className="text-base sm:text-lg font-medium text-neutral-50">{title}</p>
                {subTitle && <p className="text-sm sm:text-md font-medium text-neutral-400">{subTitle}</p>}
                {description && <p className="text-xs sm:text-sm font-medium text-neutral-600">{description}</p>}
            </div>

            <div className="w-full lg:min-w-[200px] lg:max-w-[200px]">
                <InputField name={name} control={control} type="number" placeholder={placeholder || 'Enter value'} />
            </div>
        </div>

        <Separator className="my-4 bg-neutral-700" />
    </>
)
