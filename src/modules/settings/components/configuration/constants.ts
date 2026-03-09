export interface ConfigurationFormData {
    minPriceDifference: string
    gasLimit: string
    tradeFrequency: string
}

export interface Wallet {
    publicKey: string
    privateKey: string
}

export const CONFIGURATION_DEFAULTS: ConfigurationFormData = {
    minPriceDifference: '',
    gasLimit: '',
    tradeFrequency: '',
}

export const FACTORY_DEFAULTS: ConfigurationFormData = {
    minPriceDifference: '0.5',
    gasLimit: '400000',
    tradeFrequency: '10',
}

export const SETTINGS_CONFIG = [
    {
        name: 'minPriceDifference' as const,
        title: 'Minimum Price Difference (%)',
        subTitle: 'Trade only within this price range',
        description:
            'Ensures trades are not executed when profit margin is too narrow.  If < 0.1% → "Too low — may result in losses." If > 3% → "Too high — may limit trading activity."',
        placeholder: 'e.g., 0.5',
    },
    {
        name: 'gasLimit' as const,
        title: 'Gas Limit',
        subTitle: 'Maximum gas the bot can use per trade',
        description:
            'If < 200000 → "Gas too low — transaction may fail." If > 1200000 → "Unusually high — may result in losses."',
        placeholder: 'e.g., 400000',
    },
    {
        name: 'tradeFrequency' as const,
        title: 'Trade Frequency (per day)',
        subTitle: 'Number of trades allowed per day',
        description: 'Limits total trade executions per day for risk management.',
        placeholder: 'e.g., 10',
    },
] as const
