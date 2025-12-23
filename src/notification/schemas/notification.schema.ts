import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: false })
    read: boolean;

    @Prop()
    actionUrl?: string;

    @Prop()
    actionText?: string;

    @Prop({ default: 'info' })
    type: string; // info, success, warning, error
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
