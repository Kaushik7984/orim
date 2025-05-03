import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(
  path.join(__dirname, '../../firebase-service-account.json'),
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'miro-1ad07',
  });
}

export default admin;
