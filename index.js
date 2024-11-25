const cors = require("cors");
const express = require("express");
const { z } = require("zod");
const sendEmail = require("./services/email/email.service");
const sendTicketEmail = require("./services/email/ticket.view");
const Participant = require("./participant.model");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const axios = require("axios");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

const participantSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  country: z.string().optional(),
  affiliatedOrganization: z.string().optional(),
  attendedAs: z.enum([
    "Author",
    "Non-Author",
    "Student",
    "Speaker",
    "Exhibitor",
    "Guest",
    "Academia",
    "Non-Academia",
  ]),
  attendanceType: z.enum(["virtual", "physical"]).default("physical"),
  titleOfPaper: z.string().optional(),
  paidParticipationFee: z.boolean().default(false),
  participatedAs: z.enum(["local", "international"]).default("local"),
  registeredAs: z.enum(["free", "paid"]).default("free"),
});

const generateTicketId = () => {
  return `NITHUB-TICKET-ID-${Math.random()
    .toString(36)
    .substr(2, 8)
    .toUpperCase()}`;
};

app.get("/self", (_, res) => {
  console.log("Self route called");
  return res.send("Self call succeeded!");
});

app.post("/participant", async (req, res) => {
  try {
    const validatedData = participantSchema.parse(req.body);

    const existingParticipant = await Participant.findOne({
      email: validatedData.email,
    });

    if (existingParticipant) {
      return res.status(409).json({
        success: false,
        message: "Participant with this email already exists.",
      });
    }

    const ticketId = generateTicketId();

    const participant = await Participant.create({
      ...validatedData,
      ticketId,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(ticketId);
    participant?.ticketId?.to;

    await sendEmail({
      to: validatedData.email,
      subject: "Ticket Confirmation",
      body: sendTicketEmail({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        ticketId: participant.ticketId,
        attendedAs: participant.attendedAs,
        registeredAs: participant.registeredAs,
        email: participant.email,
        qrCodeDataUrl,
      }),
    });

    return res.status(201).json({ success: true, data: participant });
  } catch (error) {
    console.log("error", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.errors });
    } else if (error.name === "MongoError" && error.code === 11000) {
      res.status(409).json({ success: false, message: "Duplicate entry." });
    } else {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
});

app.post("/participant/bulk", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const participants = Array.isArray(req.body) ? req.body : [];

    const participantsWithTickets = participants.map((participant) => {
      return {
        ...participant,
        ticketId: generateTicketId(),
        dayOneAttendance: false,
        dayTwoAttendance: false,
      };
    });

    const createdParticipants = await Participant.insertMany(
      participantsWithTickets,
      { session }
    );

    // Send registration emails in parallel
    await Promise.all(
      createdParticipants.map(async (participant) => {
        const qrCodeDataUrl = await QRCode.toDataURL(participant?.ticketId);

        await sendEmail({
          to: participant.email,
          subject: "Ticket Confirmation",
          body: sendTicketEmail({
            firstName: participant.firstName,
            lastName: participant.lastName,
            qrCodeDataUrl,
          }),
        });
      })
    );

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      data: {
        count: createdParticipants.length,
        participants: createdParticipants,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    // Check for duplicate key error
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create participants",
      });
    }
  } finally {
    session.endSession();
  }
});

const upload = multer({ dest: "uploads/" });

const formatData = (csvRow) => {
  return {
    title: csvRow["Title"] || "",
    firstName: csvRow["First Name"] || "",
    lastName: csvRow["Last Name"] || "",
    country: csvRow["Country"] || "",
    affiliatedOrganization: csvRow["Affiliated Organization"] || undefined,
    registeredAs: csvRow["Registered as"]?.toLowerCase().includes("free")
      ? "free"
      : csvRow["Registered as"]?.toLowerCase().includes("paid")
      ? "paid"
      : undefined,
    attendedAs: csvRow["Attended as"] || "",
    participatedAs: csvRow["Participated as"]?.toLowerCase().includes("local")
      ? "local"
      : csvRow["Participated as"]?.toLowerCase().includes("international")
      ? "international"
      : undefined,
    attendanceType:
      csvRow["Attended"]?.toLowerCase() === "physical"
        ? "physical"
        : csvRow["Attended"]?.toLowerCase() === "virtual"
        ? "virtual"
        : undefined,
    titleOfPaper: csvRow["Title of Paper"] || undefined,
    paidParticipationFee: !!csvRow["Paid participation fee"],
  };
};

app.post("/participant/bulk/csv", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No File Found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const participants = [];
  const invalidParticipants = [];

  try {
    const csvData = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => csvData.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    for (const row of csvData) {
      const formattedRow = formatData(row);

      if (
        !formattedRow.email ||
        !formattedRow.firstName ||
        !formattedRow.lastName
      ) {
        invalidParticipants.push(formattedRow);
        continue;
      }

      const existingParticipant = await Participant.findOne({
        email: formattedRow.email,
      });

      if (existingParticipant) {
        await Participant.findByIdAndUpdate(
          existingParticipant._id,
          formattedRow,
          { session }
        );
      } else {
        participants.push({
          ...formattedRow,
          ticketId: generateTicketId(),
        });
      }
    }

    if (participants.length > 0) {
      await Participant.insertMany(participants, { session });

      await Promise.all(
        participants.map(async (participant) => {
          const qrCodeDataUrl = await QRCode.toDataURL(participant?.ticketId);

          await sendEmail({
            to: participant.email,
            subject: "Ticket Confirmation",
            body: sendTicketEmail({
              firstName: participant.firstName,
              lastName: participant.lastName,
              qrCodeDataUrl,
            }),
          });
        })
      );
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      data: {
        count: participants.length,
        participants,
      },
    });
  } catch (error) {
    console.error("Error processing participants:", error);

    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: "Failed to process participants.",
    });
  } finally {
    session.endSession();
  }
});

app.delete("/participant", async (req, res) => {
  try {
    const result = await Participant.deleteMany({
      firstName: "John",
    });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} participants deleted.`,
    });
  } catch (error) {
    console.error("Error deleting participants:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/participant", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    const query = search
      ? {
          $or: Object.keys(Participant.schema.paths)
            .filter(
              (field) => Participant.schema.paths[field].instance === "String"
            ) // Only include string fields
            .map((field) => ({
              [field]: { $regex: search, $options: "i" },
            })),
        }
      : {};

    const [participants, total] = await Promise.all([
      Participant.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Participant.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: participants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/participant/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const validatedData = participantSchema.partial().parse(req.body);

    const participant = await Participant.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!participant) {
      res
        .status(404)
        .json({ success: false, message: "Participant not found" });
      return;
    }
    res.json({ success: true, data: participant });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
});

app.put("/participant/:id/resend-email", async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await Participant.findById(id);

    if (!participant) {
      res
        .status(404)
        .json({ success: false, message: "Participant not found" });
      return;
    }

    const qrCodeDataUrl = await QRCode.toDataURL(participant?.ticketId);

    await sendEmail({
      to: participant.email,
      subject: "Ticket Confirmation",
      body: sendTicketEmail({
        firstName: participant.firstName,
        lastName: participant.lastName,
        qrCodeDataUrl,
      }),
    });

    res.json({ success: true, data: participant });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
});

app.post("/participant/check-in", async (req, res) => {
  try {
    const { ticketId } = req.body;

    const participant = await Participant.findOne({ ticketId });

    if (!participant) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const currentDate = new Date();

    const dayMapping = {
      [new Date(currentDate.getFullYear(), 10, 25).toDateString()]: "day0",
      [new Date(currentDate.getFullYear(), 10, 26).toDateString()]: "day1",
      [new Date(currentDate.getFullYear(), 10, 28).toDateString()]: "day2",
      [new Date(currentDate.getFullYear(), 10, 29).toDateString()]: "day2",
    };

    const day = dayMapping[currentDate.toDateString()];

    if (!day) {
      return res.status(400).json({ success: false, message: "Invalid day" });
    }

    if (day === "day0") {
      if (participant.dayZeroAttendance === true)
        return res
          .status(400)
          .json({ success: false, message: "Participant Already Checked In" });

      participant.dayZeroAttendance = true;
    }

    if (day === "day1") {
      if (participant.dayOneAttendance === true)
        return res
          .status(400)
          .json({ success: false, message: "Participant Already Checked In" });

      participant.dayOneAttendance = true;
    }

    if (day === "day2") {
      if (participant.dayTwoAttendance === true)
        return res
          .status(400)
          .json({ success: false, message: "Participant Already Checked In" });

      participant.dayTwoAttendance = true;
    }

    if (day === "day3") {
      if (participant.dayThreeAttendance === true)
        return res
          .status(400)
          .json({ success: false, message: "Participant Already Checked In" });

      participant.dayThreeAttendance = true;
    }

    await participant.save();

    res.json({ success: true, data: participant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.use(async (error, _, res, __) => {
  const INTERNAL_SERVER_ERROR = 500;

  let statusCode = INTERNAL_SERVER_ERROR;

  let message = error?.message ?? "internal server error";

  if (statusCode == INTERNAL_SERVER_ERROR) console.error(error);

  const response = {
    status: false,
    code: statusCode,
    message,
  };

  return res.status(statusCode).send(response);
});

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Schedule periodic self-calls every 30 minutes to avoid render server shutting down
  setInterval(async () => {
    try {
      console.log("Calling /self endpoint...");
      await axios.get(`${process.env.ORIGIN_URL}/self`);
    } catch (error) {
      console.error("Self call failed:", error.message);
    }
  }, 14 * 60 * 1000); // 30 minutes in milliseconds
});

module.exports = app;
