import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  ltcWalletAddress: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
