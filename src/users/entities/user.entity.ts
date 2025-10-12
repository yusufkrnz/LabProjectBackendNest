import{Prop,Schema,SchemaFactory}from'@nestjs/mongoose';
import{Document}from'mongoose';





@Schema()
export class User extends Document{

   @Prop()
   username:string;

   @Prop()
   surname:string;






}
