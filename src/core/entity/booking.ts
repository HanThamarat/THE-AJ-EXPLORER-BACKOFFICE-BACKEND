
export interface bookingEntity {
    id?:                number;
    bookingId?:         string;
    paymentRef?:        string;
    paymentStatus:      "panding" | "paid" | "failed";
    bookingStatus:      "panding" | "confirmed" | "failed";
    userId:             string;
    childPrice?:        number;
    childQty?:          number;
    adultPrice?:        number;
    adultQty?:          number;
    groupPrice?:        number;
    groupQty?:          number;
    amount:             number;
    additionalDetail?:  string;
    locationId?:        number;
    pickup_lat:         number;
    pickup_lgn:         number;
    trip_at:            Date | string;
    policyAccept:       boolean;
    expire_at?:         Date | string;
    created_at?:        Date | string;
    updated_at?:        Date | string;
}