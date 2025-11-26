import { z } from "zod";

export const transactionFeesSchema = z.object({
    fee_flat: z.string(),
    fee_rate: z.string(),
    vat_rate: z.string(),
});

export type TransactionFees = z.infer<typeof transactionFeesSchema>;

export const platformFeeSchema = z.object({
    fixed: z.unknown(),
    percentage: z.unknown(),
});

export type PlatformFee = z.infer<typeof platformFeeSchema>;

export const refundsSchema = z.object({
    object: z.string(),
    data: z.array(z.unknown()),
    limit: z.number(),
    offset: z.number(),
    total: z.number(),
    location: z.string(),
    order: z.string(),
    from: z.string(),
    to: z.string(),
});

export type Refunds = z.infer<typeof refundsSchema>;

export const imageSchema = z.object({
    object: z.string(),
    livemode: z.boolean(),
    id: z.string(),
    deleted: z.boolean(),
    filename: z.string(),
    location: z.string(),
    kind: z.string().optional(),
    download_uri: z.string(),
    created_at: z.string(),
});

export type Image = z.infer<typeof imageSchema>;

export const scannableCodeSchema = z.object({
    object: z.string(),
    type: z.string(),
    image: imageSchema,
    raw_data: z.unknown().optional(),
});

export type ScannableCode = z.infer<typeof scannableCodeSchema>;

export const referencesSchema = z.object({
    expires_at: z.unknown(),
    device_id: z.unknown(),
    customer_amount: z.unknown(),
    customer_currency: z.unknown(),
    customer_exchange_rate: z.unknown(),
    omise_tax_id: z.unknown(),
    reference_number_1: z.string(),
    reference_number_2: z.unknown(),
    barcode: z.unknown(),
    payment_code: z.unknown(),
    va_code: z.unknown(),
});

export type References = z.infer<typeof referencesSchema>;

export const providerReferencesSchema = z.object({
    reference_number_1: z.string(),
    reference_number_2: z.unknown(),
    buyer_name: z.unknown(),
});

export type ProviderReferences = z.infer<typeof providerReferencesSchema>;

export const metadataSchema = z.record(z.unknown());

export type Metadata = z.infer<typeof metadataSchema>;

export const sourceSchema = z.object({
    object: z.string(),
    id: z.string(),
    livemode: z.boolean(),
    location: z.string(),
    amount: z.number(),
    barcode: z.unknown().nullable(),
    bank: z.unknown().optional(),
    created_at: z.string(),
    currency: z.string(),
    email: z.unknown(),
    flow: z.string(),
    installment_term: z.unknown(),
    ip: z.unknown().optional(),
    absorption_type: z.unknown().optional(),
    name: z.unknown(),
    mobile_number: z.unknown(),
    phone_number: z.unknown(),
    platform_type: z.unknown().optional(),
    scannable_code: scannableCodeSchema,
    qr_settings: z.unknown().optional(),
    billing: z.unknown(),
    shipping: z.unknown(),
    items: z.array(z.unknown()),
    references: referencesSchema,
    provider_references: providerReferencesSchema.optional(),
    store_id: z.unknown(),
    store_name: z.unknown(),
    terminal_id: z.unknown(),
    type: z.string(),
    zero_interest_installments: z.unknown(),
    charge_status: z.string(),
    receipt_amount: z.unknown().optional(),
    discounts: z.array(z.unknown()).optional(),
    promotion_code: z.unknown(),
});

export type Source = z.infer<typeof sourceSchema>;

export const omiseChargeEntitySchema = z.object({
    object: z.string(),
    id: z.string(),
    location: z.string(),
    amount: z.number(),
    net: z.number(),
    interest: z.number(),
    interest_vat: z.number(),
    refunded_amount: z.number(),
    platform_fee: platformFeeSchema,
    currency: z.string(),
    ip: z.unknown(),
    refunds: refundsSchema,
    link: z.unknown(),
    description: z.unknown(),
    metadata: metadataSchema,
    card: z.unknown(),
    source: sourceSchema,
    schedule: z.unknown(),
    linked_account: z.unknown(),
    customer: z.unknown(),
    dispute: z.unknown(),
    transaction: z.unknown(),
    failure_code: z.unknown(),
    failure_message: z.unknown(),
    status: z.string(),
    authorize_uri: z.string(),
    return_uri: z.unknown(),
    created_at: z.string(),
    paid_at: z.unknown(),
    expires_at: z.string(),
    expired_at: z.unknown(),
    reversed_at: z.unknown(),
    zero_interest_installments: z.boolean(),
    branch: z.unknown(),
    terminal: z.unknown(),
    device: z.unknown(),
    authorized: z.boolean(),
    capturable: z.boolean(),
    capture: z.boolean(),
    disputable: z.boolean(),
    livemode: z.boolean(),
    refundable: z.boolean(),
    reversed: z.boolean(),
    reversible: z.boolean(),
    voided: z.boolean(),
    paid: z.boolean(),
    expired: z.boolean(),
});

export type omiseChargeEntity = z.infer<typeof omiseChargeEntitySchema>;

export const omiseFinancialEntitySchema = z.object({
    object: z.string(),
    livemode: z.boolean().optional(),
    location: z.string().optional(),
    currency: z.string(),
    total: z.union([z.number(), z.string()]),
    transferable: z.union([z.number(), z.string()]),
    reserve: z.number(),
    created_at: z.union([z.string(), z.date()]),
});

export type omiseFinancialEntity = z.infer<typeof omiseFinancialEntitySchema>;

export const omiseSourceEntitySchema = z.object({
    object: z.string(),
    id: z.string(),
    livemode: z.boolean(),
    location: z.string(),
    amount: z.number(),
    barcode: z.string().nullable(),
    bank: z.string().nullable(),
    created_at: z.string(),
    currency: z.string(),
    email: z.string().nullable(),
    flow: z.string(),
    installment_term: z.string().nullable(),
    ip: z.string().nullable(),
    absorption_type: z.string().nullable(),
    name: z.string().nullable(),
    mobile_number: z.string().nullable(),
    phone_number: z.string().nullable(),
    platform_type: z.string().nullable(),
    scannable_code: z.string().nullable(),
    qr_settings: z.string().nullable(),
    billing: z.string().nullable(),
    shipping: z.string().nullable(),
    items: z.array(z.unknown()).optional(),
    references: z.string().nullable(),
    provider_references: z.string().nullable(),
    store_id: z.string().nullable(),
    store_name: z.string().nullable(),
    terminal_id: z.string().nullable(),
    type: z.string().nullable(),
    zero_interest_installments: z.string().nullable(),
    charge_status: z.string().nullable(),
    receipt_amount: z.string().nullable(),
    discounts: z.array(z.unknown()).optional(),
    promotion_code: z.string().nullable(),
});

export type omiseSourceEntity = z.infer<typeof omiseSourceEntitySchema>;

export const chargeDTOSchema = z.object({
    bookingId: z.string(),
    amount: z.number().positive(),
});

export type chargeDTO = z.infer<typeof chargeDTOSchema>;

export const omiseRefundEntitySchema = z.object({
    object: z.string(),
    id: z.string(),
    location: z.string(),
    livemode: z.boolean(),
    voided: z.boolean(),
    currency: z.string(),
    amount: z.number(),
    metadata: z.unknown(),
    charge: z.string(),
    terminal: z.unknown().optional(),
    transaction: z.string(),
    status: z.string().optional(),
    funding_amount: z.number().optional(),
    funding_currency: z.string().optional(),
    created_at: z.string(),
});

export type OmiseRefundEntiry = z.infer<typeof omiseRefundEntitySchema>;

export const refundDTOSchema = z.object({
    chargesId: z.string(),
    amount: z.number().positive(),
    booking_id: z.string(),
});

export type RefundDTO = z.infer<typeof refundDTOSchema>;

export const financialIdParamSchema = z.object({
    id: z.string().min(1, "Charge id is required."),
});

export type FinancialIdParams = z.infer<typeof financialIdParamSchema>;
