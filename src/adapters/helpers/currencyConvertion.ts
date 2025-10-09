
export class CurrencyConvert {
    static formatAsThb(amount: number) {
        const decimalValue = amount / 100;
        
        const formatter = new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: "THB" ,
            minimumFractionDigits: 2,
        });

        return formatter.format(decimalValue);
    }
}