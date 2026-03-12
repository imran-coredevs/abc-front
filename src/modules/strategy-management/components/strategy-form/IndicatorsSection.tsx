import Separator from '@/components/ui/Separator'
import FormSelect from '@/components/ui/FormSelect'
import type { StrategyControl, StrategyWatch } from '../../types/strategy-form.types'
import AdxIndicator from './indicators/AdxIndicator'
import HullSuiteIndicator from './indicators/HullSuiteIndicator'
import RsiIndicator from './indicators/RsiIndicator'
import SqueezeMomentumIndicator from './indicators/SqueezeMomentumIndicator'
import SupertrendIndicator from './indicators/SupertrendIndicator'
import UtBotIndicator from './indicators/UtBotIndicator'
import { InfoCircle } from 'iconsax-reactjs'

const MARKET_DATA_OPTIONS = [
    { value: 'STANDARD', label: 'Classic (Standard OHLC)' },
    { value: 'HEIKIN_ASHI', label: 'Heikin-Ashi' },
]

type Props = {
    control: StrategyControl
    watch: StrategyWatch
}

export default function IndicatorsSection({ control, watch }: Props) {
    return (
        <div className="w-full space-y-4 rounded-lg bg-white/5 p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-neutral-50">Indicators</h2>
            <Separator />

            <div className="w-full bg-white/5 inline-flex items-center justify-start gap-3 self-stretch rounded-lg px-3 py-2">
                <InfoCircle />
                <div className="text-neutral-200 justify-start text-sm leading-4 font-normal">
                    At least one indicator must be enabled
                </div>
            </div>

            <Separator />

            <div className="space-y-3">
                <FormSelect
                    label="Market Data Source"
                    name="candleType"
                    control={control}
                    options={MARKET_DATA_OPTIONS}
                    description="Select which candle type indicators should use for calculation"
                />
            </div>

            <Separator />

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
