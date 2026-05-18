const bcrypt = require('bcryptjs');
const { getUserById, getUserByEmail, createUser, updateUserLogin, updateUserProfile, changeUserPassword } = require('../db');

// Export an object mimicking Mongoose User methods used in controllers
module.exports = {
  // used in register and login to check existing
  findOne: async ({ email }) => {
    const row = await getUserByEmail(email);
    return row ? { ...row, _id: row.id, comparePassword: async (pw) => await bcrypt.compare(pw, row.password) } : null;
  },
  // used in register
  create: async ({ name, email, password, role }) => {
    const hashed = await bcrypt.hash(password, 12);
    const res = await createUser({ name, email, password: hashed, role });
    const user = await getUserById(res.id);
    return { ...user, _id: user.id };
  },
  // used in getMe, updateProfile, changePassword etc.
  findById: async (id) => {
    const row = await getUserById(id);
    return row ? { ...row, _id: row.id } : null;
  },
  findByIdAndUpdate: async (id, updates) => {
    // Only handle name, theme, notifications for now
    const { name, theme, notifications } = updates;
    await updateUserProfile(id, { name, theme, notifications });
    return await getUserById(id);
  },
  // used in changePassword flow
  findByIdAndDelete: async (id) => {
    // Not implemented; placeholder
    return null;
  }
};
