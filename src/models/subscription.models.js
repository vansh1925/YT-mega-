import mongoose, { Schema } from 'mongoose';
const subscriptionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamstamps: true })
export const Subscription = mongoose.model('Subscription', subscriptionSchema)