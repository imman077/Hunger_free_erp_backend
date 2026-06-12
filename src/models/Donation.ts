import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    foodType: { type: String, required: true },
    category: { type: String, required: true },
    dietaryType: { type: String, required: true },
    preparationType: { type: String, required: true },
    quantity: { type: String, required: true },
    ngo: { type: String }, // Optional until NGO accepts
    donor: { type: String },
    date: { type: String, required: true },
    status: { type: String, required: true, default: "PENDING" },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String }, // Optional until NGO accepts
    description: { type: String, required: true },
    expiryTime: { type: String }, // Stores Expiry ISO date or custom string
    image: String,
    volunteer: {
      name: String,
      phone: String,
      rating: String,
    },
    volunteerLocation: {
      lat: Number,
      lng: Number,
    },
    pickupCoords: {
      lat: Number,
      lng: Number,
    },
    deliveryCoords: {
      lat: Number,
      lng: Number,
    },
    timeline: [
      {
        status: String,
        date: String,
        time: String,
        completed: Boolean,
        description: String,
      },
    ],
    relatedNeed: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Donation = mongoose.model("Donation", donationSchema);
