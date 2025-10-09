

export interface omiseFinancialEntity {
    object:         string;
    livemode?:       boolean;
    location?:       string;
    currency:       string;
    total:          number | string;
    transferable:   number | string;
    reserve:        number;
    created_at:     string | Date;
}

export interface omiseSourceEntity {
    object:                         string;
    id:                             string;
    livemode:                       boolean;
    location:                       string;
    amount:                         number;
    barcode:                        string | null;
    bank:                           string | null;
    created_at:                     string;
    currency:                       string;
    email:                          string | null;
    flow:                           string;
    installment_term:               string | null;
    ip:                             string | null;
    absorption_type:                string | null;
    name:                           string | null;
    mobile_number:                  string | null;
    phone_number:                   string | null;
    platform_type:                  string | null;
    scannable_code:                 string | null;
    qr_settings:                    string | null;
    billing:                        string | null;
    shipping:                       string | null;
    items?:                         [];
    references:                     string | null;
    provider_references:            string | null;
    store_id:                       string | null;
    store_name:                     string | null;
    terminal_id:                    string | null;
    type:                           string | null;
    zero_interest_installments:     string | null;
    charge_status:                  string | null;
    receipt_amount:                 string | null;
    discounts:                      [];
    promotion_code:                 string | null;
}

export interface chargeDTO {
    bookingId:      string;
    amount:         number;
}

export interface omiseChargeEntity {
  object: string
  id: string
  location: string
  amount: number
  net: number
  interest: number
  interest_vat: number
  refunded_amount: number
  platform_fee: PlatformFee
  currency: string
  ip: any
  refunds: Refunds
  link: any
  description: any
  metadata: Metadata
  card: any
  source: Source
  schedule: any
  linked_account: any
  customer: any
  dispute: any
  transaction: any
  failure_code: any
  failure_message: any
  status: string
  authorize_uri: string
  return_uri: any
  created_at: string
  paid_at: any
  expires_at: string
  expired_at: any
  reversed_at: any
  zero_interest_installments: boolean
  branch: any
  terminal: any
  device: any
  authorized: boolean
  capturable: boolean
  capture: boolean
  disputable: boolean
  livemode: boolean
  refundable: boolean
  reversed: boolean
  reversible: boolean
  voided: boolean
  paid: boolean
  expired: boolean
}

export interface TransactionFees {
  fee_flat: string
  fee_rate: string
  vat_rate: string
}

export interface PlatformFee {
  fixed: any
  percentage: any
}

export interface Refunds {
  object: string
  data: any[]
  limit: number
  offset: number
  total: number
  location: string
  order: string
  from: string
  to: string
}

export interface Metadata {}

export interface Source {
  object: string
  id: string
  livemode: boolean
  location: string
  amount: number
  barcode: any
  bank?: any
  created_at: string
  currency: string
  email: any
  flow: string
  installment_term: any
  ip?: any
  absorption_type?: any
  name: any
  mobile_number: any
  phone_number: any
  platform_type?: any
  scannable_code: ScannableCode
  qr_settings?: any
  billing: any
  shipping: any
  items: any[]
  references: References
  provider_references?: ProviderReferences
  store_id: any
  store_name: any
  terminal_id: any
  type: string
  zero_interest_installments: any
  charge_status: string
  receipt_amount?: any
  discounts?: any[]
  promotion_code: any
}

export interface ScannableCode {
  object: string
  type: string
  image: Image
  raw_data?: any
}

export interface Image {
  object: string
  livemode: boolean
  id: string
  deleted: boolean
  filename: string
  location: string
  kind?: string
  download_uri: string
  created_at: string
}

export interface References {
  expires_at: any
  device_id: any
  customer_amount: any
  customer_currency: any
  customer_exchange_rate: any
  omise_tax_id: any
  reference_number_1: string
  reference_number_2: any
  barcode: any
  payment_code: any
  va_code: any
}

export interface ProviderReferences {
  reference_number_1: string
  reference_number_2: any
  buyer_name: any
}
