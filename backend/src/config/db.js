import mongoose from 'mongoose';

export async function connectToDatabase(uri) {
  await mongoose.connect(uri, {
    dbName: "employeeDB"  // 🔥 FORCE DB NAME
  });

  console.log("✅ Connected to MongoDB (employeeDB)");
}