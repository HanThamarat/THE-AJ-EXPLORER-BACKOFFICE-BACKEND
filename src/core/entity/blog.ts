import { imageDTO, imageEntity } from "../../const/schema/image";
import { Request } from "express";

export interface blogDTO {
    title:          string;
    thumnbnail:     imageDTO;
    descrition:     string;
    status:         boolean;
    created_by:     number;
    updated_by:     number;
    req:            Request;
}

export interface blogEntity {
    id:             number;
    title:          string;
    thumnbnail:     imageEntity | string;
    descrition:     string;
    status:         boolean | string;
    created_by:     string;
    created_at:     Date | string;
    updated_by:     string;
    updated_at:     Date | string;
}
