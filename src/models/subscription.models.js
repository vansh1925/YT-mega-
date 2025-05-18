import mongoose, { Schema } from 'mongoose';
const subscriptionSchema = new Schema({
    subscriber: {//the subscriber
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    channel: {//the subscribed 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamstamps: true })
export const Subscription = mongoose.model('Subscription', subscriptionSchema)