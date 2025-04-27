const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const paypal = require("@paypal/checkout-server-sdk");

// PayPal client setup
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Register a new student
exports.registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      profilePhoto,
      maritalStatus,
      dob,
      state,
      localGovt,
      address,
      nationality,
      nin,
      department,
      gender,
      privacyPolicy,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !profilePhoto ||
      !maritalStatus ||
      !dob ||
      !state ||
      !localGovt ||
      !address ||
      !nationality ||
      !nin ||
      !department ||
      !gender ||
      !privacyPolicy
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student record
    const student = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      profilePhoto,
      maritalStatus,
      dob,
      state,
      localGovt,
      address,
      nationality,
      nin,
      department,
      gender,
      privacyPolicy,
      paymentStatus: "pending",
    });

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "2.50",
          },
        },
      ],
    });

    const order = await paypalClient.execute(request);

    // Update student with PayPal order ID
    await student.update({
      paypalOrderId: order.result.id,
      paymentStatus: "processing",
    });

    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student.id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
      },
      paypalOrderId: order.result.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering student" });
  }
};

// Handle PayPal payment completion
exports.completePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find student by PayPal order ID
    const student = await Student.findOne({
      where: { paypalOrderId: orderId },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Capture PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await paypalClient.execute(request);

    if (capture.result.status === "COMPLETED") {
      // Update student payment status
      await student.update({
        paymentStatus: "completed",
        paymentDate: new Date(),
      });

      res.status(200).json({
        message: "Payment completed successfully",
        student: {
          id: student.id,
          email: student.email,
          paymentStatus: student.paymentStatus,
        },
      });
    } else {
      await student.update({ paymentStatus: "failed" });
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment completion error:", error);
    res.status(500).json({ message: "Error completing payment" });
  }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Error retrieving student profile" });
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update allowed fields
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "profilePhoto",
      "maritalStatus",
      "dob",
      "state",
      "localGovt",
      "address",
      "nationality",
      "nin",
      "department",
      "gender",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await student.update(updates);

    res.status(200).json({
      message: "Profile updated successfully",
      student: {
        id: student.id,
        email: student.email,
        ...updates,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating student profile" });
  }
};
