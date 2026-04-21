// Manually promote / demote a user. Run from backend/:
//   node scripts/promote-admin.js <email>               # promote to superadmin
//   node scripts/promote-admin.js <email> user          # demote to user
// Useful when the server was never restarted after SUPER_ADMIN_EMAIL was set,
// or when you want to grant access without touching .env.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function main() {
  const [, , rawEmail, rawRole] = process.argv;
  if (!rawEmail) {
    console.error(
      "Usage: node scripts/promote-admin.js <email> [user|superadmin]"
    );
    process.exit(1);
  }
  const email = rawEmail.trim().toLowerCase();
  const role = rawRole === "user" ? "user" : "superadmin";

  const uri =
    process.env.MONGO_URI ||
    (console.error("MONGO_URI is not set in .env"), process.exit(1));

  await mongoose.connect(uri);
  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found for ${email}.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const prev = user.role;
  user.role = role;
  await user.save();
  console.log(`${email}: ${prev} → ${role}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
