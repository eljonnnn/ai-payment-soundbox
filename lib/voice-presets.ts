// Voice preset configurations
export interface VoicePreset {
  name: string;
  rate: number;
  pitch: number;
  volume: number;
  description: string;
  emoji: string;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    name: 'Professional',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    description: 'Clear and formal',
    emoji: '👔'
  },
  {
    name: 'Friendly',
    rate: 1.0,
    pitch: 1.1,
    volume: 0.9,
    description: 'Warm and welcoming',
    emoji: '😊'
  },
  {
    name: 'Excited',
    rate: 1.2,
    pitch: 1.3,
    volume: 1.0,
    description: 'Energetic and upbeat',
    emoji: '🎉'
  },
  {
    name: 'Calm',
    rate: 0.8,
    pitch: 0.9,
    volume: 0.8,
    description: 'Soothing and relaxed',
    emoji: '😌'
  },
  {
    name: 'Robotic',
    rate: 1.0,
    pitch: 0.7,
    volume: 1.0,
    description: 'Mechanical and precise',
    emoji: '🤖'
  },
  {
    name: 'Custom',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    description: 'Your own settings',
    emoji: '⚙️'
  }
];

// Message templates
export interface MessageTemplate {
  id: string;
  name: string;
  template: string;
  language: string;
  variables: string[];
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'en-default',
    name: 'Default (English)',
    template: 'Payment received: {amount} pesos from {customer}',
    language: 'en-US',
    variables: ['amount', 'customer']
  },
  {
    id: 'en-formal',
    name: 'Formal (English)',
    template: 'Transaction completed. Amount: {amount} pesos. Customer: {customer}',
    language: 'en-US',
    variables: ['amount', 'customer']
  },
  {
    id: 'en-friendly',
    name: 'Friendly (English)',
    template: 'Great! {customer} just paid {amount} pesos. Thank you!',
    language: 'en-US',
    variables: ['customer', 'amount']
  },
  {
    id: 'en-short',
    name: 'Short (English)',
    template: '{amount} pesos from {customer}',
    language: 'en-US',
    variables: ['amount', 'customer']
  },
  {
    id: 'tl-default',
    name: 'Default (Tagalog)',
    template: 'May bayad na: {amount} pesos mula kay {customer}',
    language: 'tl-PH',
    variables: ['amount', 'customer']
  },
  {
    id: 'tl-friendly',
    name: 'Friendly (Tagalog)',
    template: 'Salamat! Si {customer} ay nagbayad ng {amount} pesos',
    language: 'tl-PH',
    variables: ['customer', 'amount']
  },
  {
    id: 'es-default',
    name: 'Default (Spanish)',
    template: 'Pago recibido: {amount} pesos de {customer}',
    language: 'es-ES',
    variables: ['amount', 'customer']
  },
  {
    id: 'custom',
    name: 'Custom Message',
    template: 'Payment received: {amount} pesos from {customer}',
    language: 'en-US',
    variables: ['amount', 'customer']
  }
];

export const formatMessage = (
  template: string,
  amount: number,
  customerName: string
): string => {
  return template
    .replace('{amount}', amount.toFixed(2))
    .replace('{customer}', customerName);
};

export const getLanguageName = (langCode: string): string => {
  const languages: Record<string, string> = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'tl-PH': 'Tagalog (Philippines)',
    'es-ES': 'Spanish',
    'fil-PH': 'Filipino',
    'zh-CN': 'Chinese'
  };
  return languages[langCode] || langCode;
};
