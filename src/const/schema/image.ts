
export interface imageDTO {
    base64:             string;
    fileName:           string;
    mainFile:          boolean;               
}

export interface imageEntity {
    file_name:          string;
    file_original_name: string;
    file_path:          string;
    mainFile:           boolean;
    base64?:            string | null;
}