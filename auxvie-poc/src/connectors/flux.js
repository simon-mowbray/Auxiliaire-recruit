import SFTPClient from 'ssh2-sftp-client';
import fs from 'fs';

export async function pushViaSftp(localPath) {
  const host = process.env.SFTP_HOST;
  const port = parseInt(process.env.SFTP_PORT || '22', 10);
  const username = process.env.SFTP_USER;
  const remotePath = process.env.SFTP_REMOTE_PATH || '/incoming/jobs.xml';
  const password = process.env.SFTP_PASSWORD;
  const privateKey = process.env.SFTP_PRIVATE_KEY ? Buffer.from(process.env.SFTP_PRIVATE_KEY.replace(/\\n/g, '\n'), 'utf8') : undefined;

  if (!host || !username) {
    throw new Error('SFTP creds manquants: SFTP_HOST & SFTP_USER requis');
  }

  if (!fs.existsSync(localPath)) {
    throw new Error(`XML introuvable: ${localPath}`);
  }

  const sftp = new SFTPClient();
  await sftp.connect({ host, port, username, password, privateKey });
  await sftp.fastPut(localPath, remotePath);
  await sftp.end();
  return { ok: true, host, remotePath };
}
