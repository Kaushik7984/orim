import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(
  path.join(__dirname, '../../firebase-service-account.json'),
);

// Only initialize if no apps are already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'miro-1ad07', // Replace with your actual Firebase project ID
  });
}

export default admin;
