import{Prop,Schema,SchemaFactory}from '@nestjs/mongoose';
import{Document}from'mongoose';
import{Gender}from'./gender-enum'
import { generateKey } from 'crypto';

export type UserDocument=User&Document;

@Schema({timestamps:true})
export class User extends Document{

@Prop({unique:true})
userId?:number;

@Prop({required:true})
eMail:string

@Prop()
username:string

@Prop()
surname:string

@Prop()
passwordHash:string

@Prop({default:true})
isActive:boolean

@Prop({required:true,enum:Gender})
gender:Gender;

@Prop({required:true,enum:['admin','user'],default:'user'})
role:string;

  @Prop({ type: String, default: null })
  refreshTokenHash?: string;

}

export const UserSchema=SchemaFactory.createForClass(User);