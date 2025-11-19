
export interface bkEntity {
    id?:                number;
    bookingId?:         string;
    paymentRef?:        string | null;
    paymentStatus:      "panding" | "paid" | "failed";
    bookingStatus:      "panding" | "confirmed" | "failed";
    packageName:        string | null;
    name:               string | null;
    trip_at:            Date | string;
    created_at:         Date | string;
    updated_at:         Date | string;
}