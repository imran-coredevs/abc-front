import Separator from '@/components/ui/Separator'
import type { StrategyControl, StrategyWatch } from '../../types/strategy-form.types'
import AdxIndicator from './indicators/AdxIndicator'
import HullSuiteIndicator from './indicators/HullSuiteIndicator'
import RsiIndicator from './indicators/RsiIndicator'
import SqueezeMomentumIndicator from './indicators/SqueezeMomentumIndicator'
import SupertrendIndicator from './indicators/SupertrendIndicator'
import UtBotIndicator from './indicators/UtBotIndicator'
import { InfoCircle } from 'iconsax-reactjs'

type Props = {
    control: StrategyControl
    watch: StrategyWatch
}

export default function IndicatorsSection({ control, watch }: Props) {
    return (
        <div className="w-full space-y-4 rounded-lg bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-neutral-50">Indicators</h2>
            <Separator />

            <div className="w-full bg-white/5 inline-flex items-center justify-start gap-3 self-stretch rounded-lg px-3 py-2">
                <InfoCircle />
                <div className="text-neutral-200 justify-start text-sm leading-4 font-normal">
                    At least one indicator must be enabled
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <RsiIndicator control={control} watch={watch} />
                <UtBotIndicator control={control} watch={watch} />
                <SupertrendIndicator control={control} watch={watch} />
                <HullSuiteIndicator control={control} watch={watch} />
                <AdxIndicator control={control} watch={watch} />
                <SqueezeMomentumIndicator control={control} watch={watch} />
            </div>
        </div>
    )
}
