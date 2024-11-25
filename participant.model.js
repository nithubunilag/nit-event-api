const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ParticipantSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    country: { type: String },
    phone: { type: String },
    affiliatedOrganization: { type: String, required: false },
    attendedAs: {
      type: String,
      required: true,
      enum: [
        "Author",
        "Non-Author",
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
    title: { type: String, required: false },
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
    dayZeroAttendance: { type: Boolean, default: false },
    dayOneAttendance: { type: Boolean, default: false },
    dayTwoAttendance: { type: Boolean, default: false },
    dayThreeAttendance: { type: Boolean, default: false },
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
