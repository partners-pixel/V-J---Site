import net from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

let acceptedMessages = 0;

function createFakeSmtpServer() {
  return net.createServer((socket) => {
    let buffer = '';
    let dataMode = false;
    let authLoginStep = 0;

    const write = (line) => socket.write(`${line}\r\n`);
    write('220 localhost ESMTP local smoke test');

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';

      for (const rawLine of lines) {
        const line = rawLine.replace(/\r$/, '');
        const upper = line.toUpperCase();

        if (dataMode) {
          if (line === '.') {
            acceptedMessages += 1;
            dataMode = false;
            write('250 queued');
          }
          continue;
        }

        if (authLoginStep === 1) {
          authLoginStep = 2;
          write('334 UGFzc3dvcmQ6');
          continue;
        }
        if (authLoginStep === 2) {
          authLoginStep = 0;
          write('235 authentication successful');
          continue;
        }

        if (upper.startsWith('EHLO') || upper.startsWith('HELO')) {
          socket.write('250-localhost\r\n250 AUTH PLAIN LOGIN\r\n');
        } else if (upper.startsWith('AUTH PLAIN')) {
          write('235 authentication successful');
        } else if (upper === 'AUTH LOGIN') {
          authLoginStep = 1;
          write('334 VXNlcm5hbWU6');
        } else if (upper.startsWith('MAIL FROM:')) {
          write('250 ok');
        } else if (upper.startsWith('RCPT TO:')) {
          write('250 ok');
        } else if (upper === 'DATA') {
          dataMode = true;
          write('354 end with <CR><LF>.<CR><LF>');
        } else if (upper === 'RSET') {
          write('250 ok');
        } else if (upper === 'QUIT') {
          write('221 bye');
          socket.end();
        } else {
          write('250 ok');
        }
      }
    });
  });
}

async function waitForHttp(url, timeoutMs = 7000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Keep polling until the child server is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

const smtpServer = createFakeSmtpServer();
smtpServer.listen(0, '127.0.0.1');
await once(smtpServer, 'listening');
const smtpPort = smtpServer.address().port;

const appPort = 4107;
const child = spawn(process.execPath, ['server.js'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(appPort),
    SMTP_HOST: '127.0.0.1',
    SMTP_PORT: String(smtpPort),
    SMTP_SECURE: 'false',
    SMTP_USER: 'local-test-user',
    SMTP_PASS: 'local-test-pass',
    FROM_EMAIL: 'info@vjdesai.com',
    TO_EMAIL: 'info@vjdesai.com',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let childOutput = '';
child.stdout.on('data', (chunk) => { childOutput += chunk.toString(); });
child.stderr.on('data', (chunk) => { childOutput += chunk.toString(); });

try {
  await waitForHttp(`http://127.0.0.1:${appPort}/pages/contact.html`);

  const body = new URLSearchParams({
    'First Name': 'Local',
    'Last Name': 'Smoke',
    email: 'local.smoke@example.com',
    Phone: '+91 90000 00000',
    Company: 'Local Test',
    'Entity Type': 'Private Limited Company',
    'Service Enquiry': 'GST Registration & Compliance',
    'Preferred Mode of Contact': 'Email',
    Message: 'This is a local SMTP smoke test.',
  });

  const res = await fetch(`http://127.0.0.1:${appPort}/api/contact`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const payload = await res.json();

  if (!res.ok || payload.success !== true) {
    throw new Error(`Expected successful response, got ${res.status}: ${JSON.stringify(payload)}`);
  }
  if (acceptedMessages !== 1) {
    throw new Error(`Expected 1 SMTP message, fake server accepted ${acceptedMessages}`);
  }

  console.log('Local SMTP smoke test passed.');
  console.log(`App endpoint returned: ${payload.message}`);
  console.log(`Fake SMTP server accepted messages: ${acceptedMessages}`);
} catch (err) {
  console.error('Local SMTP smoke test failed.');
  console.error(err.message);
  if (childOutput.trim()) {
    console.error('\nApp output:');
    console.error(childOutput.trim());
  }
  process.exitCode = 1;
} finally {
  child.kill();
  smtpServer.close();
}
