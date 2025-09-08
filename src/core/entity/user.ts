export interface userEntity {
    id?:             number;
    firstName?:      string;
    lastName?:       string;
    email?:          string;
    username?:       string;
    password?:       string;
    roleId?:         number;
    role?:           role; 
    created_at?:     Date;      
    updated_at?:     Date;      
}

export interface role {
    id:             number;
    name:           string | null;
}

export interface userDTO {
    firstName?:      string;
    lastName?:       string;
    email?:          string;
    username?:       string;
    password?:       string;
    currentPassword?:string;
    roleId?:         number;
}