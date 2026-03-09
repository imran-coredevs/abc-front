import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import SymbolSearchSelect from '@/components/ui/SymbolSearchSelect'
import {
    CANDLE_TYPES,
    CAPITAL_ALLOCATION_TYPES,
    MARGIN_TYPES,
    POSITION_SIZING_METHODS,
    TIMEFRAMES,
    TRADE_DIRECTIONS,
} from '../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../types/strategy-form.types'

type Props = {
    control: StrategyControl
    watch: StrategyWatch
}

export default function BasicConfigSection({ control, watch }: Props) {
    const capitalAllocationType = watch('capitalAllocationType')
    const positionSizingMethod = watch('positionSizingMethod')

    const isPercentageAlloc = capitalAllocationType === 'PERCENTAGE_OF_PORTFOLIO'

    return (
        <div className="space-y-4 rounded-lg bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-neutral-50">Basic Configuration</h2>
            <Separator />

            {/* Row 1: Name, Symbol, Timeframe */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InputField
                    name="name"
                    control={control}
                    label="Strategy Name"
                    placeholder="e.g. Momentum Breakout"
                    rules={{
                        required: 'Strategy name is required',
                        minLength: { value: 3, message: 'Min 3 characters' },
                        maxLength: { value: 100, message: 'Max 100 characters' },
                    }}
                />

                {/* Binance FAPI searchable symbol dropdown */}
                <SymbolSearchSelect
                    label="Symbol"
                    name="symbol"
                    control={control}
                    required
                />

                <FormSelect
                    label="Timeframe"
                    name="timeframe"
                    control={control}
                    options={TIMEFRAMES}
                    required
                />
            </div>

            {/* Row 2: Trade Direction, Candle Type, Margin Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                    label="Trade Direction"
                    name="tradeDirection"
                    control={control}
                    options={TRADE_DIRECTIONS}
                    required
                />

                <FormSelect
                    label="Candle Type"
                    name="candleType"
                    control={control}
                    options={CANDLE_TYPES}
                    required
                />

                <FormSelect
                    label="Margin Type"
                    name="marginType"
                    control={control}
                    options={MARGIN_TYPES}
                    required
                />
            </div>

            {/* Row 3: Capital Allocation Type, Allocation Value, Leverage */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                    label="Capital Allocation Type"
                    name="capitalAllocationType"
                    control={control}
                    options={CAPITAL_ALLOCATION_TYPES}
                    required
                />

                <InputField
                    name="allocationValue"
                    control={control}
                    label={isPercentageAlloc ? 'Allocation (%)' : 'Allocation (USDT)'}
                    type="number"
                    placeholder={isPercentageAlloc ? '1–100' : 'e.g. 1000'}
                    rules={{
                        required: 'Allocation value is required',
                        min: { value: 0.01, message: 'Must be > 0' },
                        ...(isPercentageAlloc && { max: { value: 100, message: 'Max 100%' } }),
                    }}
                />

                <InputField
                    name="leverage"
                    control={control}
                    label="Leverage (×)"
                    type="number"
                    placeholder="1–125"
                    rules={{
                        required: 'Leverage is required',
                        min: { value: 1, message: 'Min 1' },
                        max: { value: 125, message: 'Max 125' },
                    }}
                />
            </div>

            {/* Row 4: Position Controls */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InputField
                    name="maxOpenPositions"
                    control={control}
                    label="Max Open Positions"
                    type="number"
                    placeholder="1"
                    rules={{
                        required: 'Required',
                        min: { value: 1, message: 'Min 1' },
                        max: { value: 100, message: 'Max 100' },
                    }}
                />

                <InputField
                    name="maxTradeDuration"
                    control={control}
                    label="Max Trade Duration (sec, 0 = no limit)"
                    type="number"
                    placeholder="0"
                    rules={{ required: 'Required', min: { value: 0, message: 'Must be ≥ 0' } }}
                />

                <InputField
                    name="minSignalAgreement"
                    control={control}
                    label="Min Signal Agreement"
                    type="number"
                    placeholder="1"
                    rules={{
                        required: 'Required',
                        min: { value: 1, message: 'Min 1' },
                        max: { value: 100, message: 'Max 100' },
                    }}
                />
            </div>

            {/* Row 5: Position Sizing */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                    label="Position Sizing Method"
                    name="positionSizingMethod"
                    control={control}
                    options={POSITION_SIZING_METHODS}
                    required
                />

                {positionSizingMethod === 'FIXED' && (
                    <InputField
                        name="fixedTradeAmount"
                        control={control}
                        label="Fixed Trade Amount (USDT)"
                        type="number"
                        placeholder="e.g. 100"
                        rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                    />
                )}

                {positionSizingMethod === 'PERCENTAGE' && (
                    <InputField
                        name="capitalPercentagePerTrade"
                        control={control}
                        label="Capital % Per Trade"
                        type="number"
                        placeholder="0.01–100"
                        rules={{
                            required: 'Required',
                            min: { value: 0.01, message: 'Min 0.01' },
                            max: { value: 100, message: 'Max 100' },
                        }}
                    />
                )}
            </div>
        </div>
    )
}
