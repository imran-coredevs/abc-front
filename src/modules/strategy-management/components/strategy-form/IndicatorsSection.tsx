import Separator from '@/components/ui/Separator'
import FormSelect from '@/components/ui/FormSelect'
import type { StrategyFormData } from '../../types/strategy-form.types'
import AdxIndicator from './indicators/AdxIndicator'
import HullSuiteIndicator from './indicators/HullSuiteIndicator'
import RsiIndicator from './indicators/RsiIndicator'
import SqueezeMomentumIndicator from './indicators/SqueezeMomentumIndicator'
import SupertrendIndicator from './indicators/SupertrendIndicator'
import UtBotIndicator from './indicators/UtBotIndicator'
import { InfoCircle } from 'iconsax-reactjs'
import { Controller, useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const MARKET_DATA_OPTIONS = [
    { value: 'STANDARD', label: 'Classic (Standard OHLC)' },
    { value: 'HEIKIN_ASHI', label: 'Heikin-Ashi' },
]

export default function IndicatorsSection() {
    const { control } = useFormContext<StrategyFormData>()
    return (
        <div className="w-full space-y-6 rounded-xl bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-neutral-50">Indicators</h2>

            <div className="inline-flex w-full items-center justify-start gap-3 self-stretch rounded-lg bg-white/5 px-3 py-2">
                <InfoCircle size={18} className="text-neutral-300" />
                <div className="justify-start text-sm leading-[18px] font-normal text-neutral-200">
                    At least one indicator must be enabled
                </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <p className="text-lg leading-6 font-medium text-neutral-50">Market Data Source</p>
                    <p className="text-base leading-[21px] font-normal text-neutral-400">
                        Select which candle type indicators should use for calculation
                    </p>
                </div>

                <Controller
                    name="candleType"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value as string} defaultValue={field.value as string}>
                            <SelectTrigger className="h-12 w-full rounded-lg border-neutral-700 bg-white/5 px-3 text-neutral-50 lg:w-[220px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MARKET_DATA_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-5">
                <RsiIndicator />
                <UtBotIndicator />
                <SupertrendIndicator />
                <HullSuiteIndicator />
                <AdxIndicator />
                <SqueezeMomentumIndicator />
            </div>
        </div>
    )
}
