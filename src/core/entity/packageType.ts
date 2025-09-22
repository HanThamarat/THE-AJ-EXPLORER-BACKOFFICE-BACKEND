
export interface packageTypeDTO {
    name:       string;
    status:     boolean;
    created_by: number;
    updated_by: number;
}

export interface packageTypeEntity  {
    id:         number;
    name:       string;
    status:     boolean;
    created_by: string;
    created_at: Date | string;
    updated_by: string;
    updated_at: Date | string;
}