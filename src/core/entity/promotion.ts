

export interface PromotionDTO {
    promoName:          string;
    type:               'promotion' | 'coupon',
    couponCode?:        string;
    description?:       string;
    startDate:          Date;
    endDate:            Date;
    status:             boolean;
    packagePromoLink:   PromotionLinkDTO[];
    created_by:         number;
    updated_by:         number;
}

export interface PromotionLinkDTO {
    id?:            number;
    promoId?:       number;
    percentage:     number;
    packageLink:    number;
}

export interface Promotion {
    id:                 number;
    promoName:          string;
    type:               'promotion' | 'coupon',
    couponCode?:        string;
    description?:       string;
    startDate:          Date | string;
    endDate:            Date | string;
    status:             boolean | string;
    packagePromoLink:   PromotionLink[] | string;
    created_by:         number | string;
    created_at:         Date | string;
    updated_by:         number | string;
    updated_at:         Date | string;
}

export interface PromotionLink {
    id:             number;
    packageLink:    string;
    pakcageId:      number;
    percentage:     number;
}

export interface promotionDay {
    id:             number;
    startDate:      string | Date;
    endDate:        string | Date;
}