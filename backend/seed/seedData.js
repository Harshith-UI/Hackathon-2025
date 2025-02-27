const mongoose = require("mongoose");
const Student = require("../models/Student");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

mongoose
  .connect("mongodb+srv://manikanthdaru82:5y67fbrUJ8yCG3cc@cluster0.am5ev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const students = [
  {
    name: "Aarav Sharma",
    rollNo: "S101",
    class: "5",
    section: "A",
    parentName: "Rohit Sharma",
    parentContact: "9876543210",
    alternateContact: "9123456789",
    address: "123 Green Street, Mumbai",
    photoUrl: "https://example.com/photos/aarav.jpg"
  },
  {
    name: "Diya Mehta",
    rollNo: "S102",
    class: "5",
    section: "A",
    parentName: "Priya Mehta",
    parentContact: "9988776655",
    alternateContact: "9112233445",
    address: "56 Blue Avenue, Delhi",
    photoUrl: "https://example.com/photos/diya.jpg"
  },
  {
    name: "Karan Verma",
    rollNo: "S103",
    class: "5",
    section: "A",
    parentName: "Raj Verma",
    parentContact: "9823456789",
    alternateContact: "9001122334",
    address: "89 Yellow Road, Bangalore",
    photoUrl: "https://example.com/photos/karan.jpg"
  },
  {
    name: "Ishita Patel",
    rollNo: "S104",
    class: "5",
    section: "A",
    parentName: "Anita Patel",
    parentContact: "9786543210",
    alternateContact: "9887766554",
    address: "45 Orchid Lane, Ahmedabad",
    photoUrl: "https://example.com/photos/ishita.jpg"
  },
  {
    name: "Rahul Nair",
    rollNo: "S105",
    class: "5",
    section: "A",
    parentName: "Suresh Nair",
    parentContact: "9654321098",
    alternateContact: "9123456780",
    address: "76 Lotus Street, Kochi",
    photoUrl: "https://example.com/photos/rahul.jpg"
  },
  {
    name: "Meera Iyer",
    rollNo: "S106",
    class: "5",
    section: "A",
    parentName: "Lakshmi Iyer",
    parentContact: "9988112233",
    alternateContact: "9003344556",
    address: "90 Jasmine Path, Chennai",
    photoUrl: "https://example.com/photos/meera.jpg"
  },
  {
    name: "Vikram Joshi",
    rollNo: "S107",
    class: "5",
    section: "A",
    parentName: "Ramesh Joshi",
    parentContact: "9877654321",
    alternateContact: "9223344556",
    address: "23 Rose Avenue, Pune",
    photoUrl: "https://example.com/photos/vikram.jpg"
  },
  {
    name: "Ananya Desai",
    rollNo: "S108",
    class: "5",
    section: "A",
    parentName: "Neeta Desai",
    parentContact: "9876234510",
    alternateContact: "9654321890",
    address: "12 Sunflower Street, Jaipur",
    photoUrl: "https://example.com/photos/ananya.jpg"
  },
  {
    name: "Yash Malhotra",
    rollNo: "S109",
    class: "5",
    section: "A",
    parentName: "Amit Malhotra",
    parentContact: "9123456781",
    alternateContact: "9321456789",
    address: "34 Tulip Road, Chandigarh",
    photoUrl: "https://example.com/photos/yash.jpg"
  },
  {
    name: "Sanya Kapoor",
    rollNo: "S110",
    class: "5",
    section: "A",
    parentName: "Kavita Kapoor",
    parentContact: "9001122334",
    alternateContact: "9211334455",
    address: "67 Lily Lane, Hyderabad",
    photoUrl: "https://example.com/photos/sanya.jpg"
  }
];

const parents = [
  {
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    password: "hashedpassword1",
    role: "parent"
  },
  {
    name: "Priya Mehta",
    email: "priya.mehta@example.com",
    password: "hashedpassword2",
    role: "parent"
  },
  {
    name: "Raj Verma",
    email: "raj.verma@example.com",
    password: "hashedpassword3",
    role: "parent"
  },
  {
    name: "Anita Patel",
    email: "anita.patel@example.com",
    password: "hashedpassword4",
    role: "parent"
  },
  {
    name: "Suresh Nair",
    email: "suresh.nair@example.com",
    password: "hashedpassword5",
    role: "parent"
  },
  {
    name: "Lakshmi Iyer",
    email: "lakshmi.iyer@example.com",
    password: "hashedpassword6",
    role: "parent"
  },
  {
    name: "Ramesh Joshi",
    email: "ramesh.joshi@example.com",
    password: "hashedpassword7",
    role: "parent"
  },
  {
    name: "Neeta Desai",
    email: "neeta.desai@example.com",
    password: "hashedpassword8",
    role: "parent"
  },
  {
    name: "Amit Malhotra",
    email: "amit.malhotra@example.com",
    password: "hashedpassword9",
    role: "parent"
  },
  {
    name: "Kavita Kapoor",
    email: "kavita.kapoor@example.com",
    password: "hashedpassword10",
    role: "parent"
  },
  {
    name: "Kavya Rao",
    email: "kavyateacher@school.com",
    password: "passion",
    role: "teacher"
  }
];

const seedData = async () => {
  try {
    await Student.deleteMany();
    await User.deleteMany();
    // just for clearing previous attendance data
    // await Attendance.deleteMany();

    // Insert parents first
    const insertedParents = await User.insertMany(parents);

    // Map students to link parents by name
    const studentsWithParentIds = students.map(student => {
      const parent = insertedParents.find(p => p.name === student.parentName);
      return { ...student, parentId: parent ? parent._id : null };
    });

    // Insert students
    await Student.insertMany(studentsWithParentIds);

    console.log("Student and Parent data seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedData();
