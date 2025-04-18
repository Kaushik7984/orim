import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccount = require(
  path.join(__dirname, '../../firebase-service-account.json'),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'miro-1ad07', // Replace with your project ID
});

export default admin;
