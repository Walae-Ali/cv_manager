import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class FilterCvDto{
    @IsOptional()
    @IsString()
    critere?:string;
    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(0)
    age?:number;
}