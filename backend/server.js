// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';
// import notesRoutes from './routes/notes.js';
// import usersRoutes from './routes/users.js';
// import User from './models/User.js';
// import bcrypt from 'bcryptjs';

// // app.use('/api/users', usersRoutes);

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors());

// app.use('/api/users', usersRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/notes', notesRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     // Admin creation logic
//     const adminEmail = process.env.ADMIN_EMAIL;
//     const adminPassword = process.env.ADMIN_PASSWORD;
//     const adminUsername = process.env.ADMIN_USERNAME;

//     let admin = await User.findOne({ email: adminEmail });
//     if (admin) {
//       console.log('Admin already created.');
//     } else {
//       const hash = await bcrypt.hash(adminPassword, 10);
//       admin = new User({
//         username: adminUsername,
//         email: adminEmail,
//         password: hash,
//         isAdmin: true
//       });
//       await admin.save();
//       console.log('Default admin created.');
//     }
//     console.log('Connected to MongoDB');
//     app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
//   })
//   .catch(err => {
//     console.log('could not connecting to MongoDB:', err);
//     process.exit(1);
//   });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import usersRoutes from './routes/users.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Ensure admin user exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hash = await bcrypt.hash(adminPassword, 10);
      admin = new User({ username: adminUsername, email: adminEmail, password: hash, isAdmin: true });
      await admin.save();
      console.log('Default admin created.');
    } else {
      console.log('Admin already exists.');
    }

    const server = app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

    // Graceful shutdown logic
    const shutdown = (signal) => {
      console.log(`${signal} received: shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
        process.exit(0);
      });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  }
}
startServer();
