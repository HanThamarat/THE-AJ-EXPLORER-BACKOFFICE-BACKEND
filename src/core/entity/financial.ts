
export interface omiseFinancialEntity {
    object:         string;
    livemode:       boolean;
    location:       string;
    currency:       string;
    total:          number;
    transferable:   number;
    reserve:        number;
    created_at:     string | Date;
}