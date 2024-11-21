const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ParticipantSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    affiliatedOrganization: { type: String, required: false },
    attendedAs: {
      type: String,
      required: true,
      enum: [
        "Author",
        "Student",
        "Speaker",
        "Exhibitor",
        "Guest",
        "Academia",
        "Non-Academia",
      ],
    },
    attendanceType: {
      type: String,
      default: "physical",
      enum: ["virtual", "physical"],
    },
    title: { type: String, required: true },
    titleOfPaper: { type: String },
    paidParticipationFee: { type: Boolean, default: false },
    participatedAs: {
      type: String,
      default: "local",
      enum: ["local", "international"],
    },
    registeredAs: {
      type: String,
      default: "free",
      enum: ["free", "paid"],
    },
    ticketId: { type: String, required: true, unique: true },
    dayOneAttendance: { type: Boolean, default: false },
    dayTwoAttendance: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search
ParticipantSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
  ticketId: "text",
});

module.exports = mongoose.model("Participant", ParticipantSchema);
