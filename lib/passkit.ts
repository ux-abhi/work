import { toArray } from 'do-not-zip';
import forge from 'node-forge';

interface PassData {
  name: string;
  username: string;
  bio?: string;
  profileUrl: string;
  avatarUrl?: string;
}

interface PassFiles {
  [key: string]: Uint8Array | string;
}

// Generate pass.json content
function generatePassJSON(data: PassData): string {
  const pass = {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.com.linkcard.profile',
    serialNumber: `linkcard-${data.username}-${Date.now()}`,
    teamIdentifier: process.env.APPLE_TEAM_ID || 'TEAM_ID',
    organizationName: 'LinkCard',
    description: `${data.name}'s LinkCard`,
    logoText: 'LinkCard',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 0, 0)',
    labelColor: 'rgb(155, 155, 155)',
    generic: {
      primaryFields: [
        {
          key: 'name',
          label: 'NAME',
          value: data.name,
        },
      ],
      secondaryFields: [
        {
          key: 'username',
          label: 'USERNAME',
          value: `@${data.username}`,
        },
      ],
      auxiliaryFields: data.bio
        ? [
            {
              key: 'bio',
              label: 'BIO',
              value: data.bio,
            },
          ]
        : [],
      backFields: [
        {
          key: 'url',
          label: 'Profile URL',
          value: data.profileUrl,
        },
      ],
    },
    barcode: {
      message: data.profileUrl,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
    },
    barcodes: [
      {
        message: data.profileUrl,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
      },
    ],
  };

  return JSON.stringify(pass);
}

// Create SHA1 hash
function sha1(data: string | Uint8Array): string {
  const md = forge.md.sha1.create();
  if (typeof data === 'string') {
    md.update(data);
  } else {
    md.update(forge.util.binary.raw.encode(data));
  }
  return md.digest().toHex();
}

// Generate manifest.json
function generateManifest(files: PassFiles): string {
  const manifest: Record<string, string> = {};

  for (const [filename, content] of Object.entries(files)) {
    if (filename !== 'manifest.json' && filename !== 'signature') {
      const data = typeof content === 'string' ? content : content;
      manifest[filename] = sha1(data);
    }
  }

  return JSON.stringify(manifest);
}

// Sign the manifest (requires certificates)
function signManifest(manifest: string): Uint8Array | null {
  const certPem = process.env.APPLE_PASS_CERTIFICATE;
  const keyPem = process.env.APPLE_PASS_PRIVATE_KEY;
  const wwdrPem = process.env.APPLE_WWDR_CERTIFICATE;

  if (!certPem || !keyPem || !wwdrPem) {
    console.warn('Apple Pass certificates not configured');
    return null;
  }

  try {
    const cert = forge.pki.certificateFromPem(certPem);
    const key = forge.pki.privateKeyFromPem(keyPem);
    const wwdr = forge.pki.certificateFromPem(wwdrPem);

    const p7 = forge.pkcs7.createSignedData();
    p7.content = forge.util.createBuffer(manifest);
    p7.addCertificate(cert);
    p7.addCertificate(wwdr);
    p7.addSigner({
      key: key,
      certificate: cert,
      digestAlgorithm: forge.pki.oids.sha256,
      authenticatedAttributes: [
        {
          type: forge.pki.oids.contentType,
          value: forge.pki.oids.data,
        },
        {
          type: forge.pki.oids.messageDigest,
        },
        {
          type: forge.pki.oids.signingTime,
          value: new Date() as unknown as string,
        },
      ],
    });
    p7.sign({ detached: true });

    const asn1 = p7.toAsn1();
    const der = forge.asn1.toDer(asn1);
    return new Uint8Array(forge.util.binary.raw.decode(der.getBytes()));
  } catch (error) {
    console.error('Error signing manifest:', error);
    return null;
  }
}

// Default icon as base64 PNG (simple black square with white L)
const DEFAULT_ICON = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x1d, 0x00, 0x00, 0x00, 0x1d,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x2e, 0xaf, 0x40, 0xfe, 0x00, 0x00, 0x00,
  0x01, 0x73, 0x52, 0x47, 0x42, 0x00, 0xae, 0xce, 0x1c, 0xe9, 0x00, 0x00,
  0x00, 0x04, 0x67, 0x41, 0x4d, 0x41, 0x00, 0x00, 0xb1, 0x8f, 0x0b, 0xfc,
  0x61, 0x05, 0x00, 0x00, 0x00, 0x09, 0x70, 0x48, 0x59, 0x73, 0x00, 0x00,
  0x0e, 0xc3, 0x00, 0x00, 0x0e, 0xc3, 0x01, 0xc7, 0x6f, 0xa8, 0x64, 0x00,
  0x00, 0x00, 0x19, 0x74, 0x45, 0x58, 0x74, 0x53, 0x6f, 0x66, 0x74, 0x77,
  0x61, 0x72, 0x65, 0x00, 0x70, 0x61, 0x69, 0x6e, 0x74, 0x2e, 0x6e, 0x65,
  0x74, 0x20, 0x34, 0x2e, 0x30, 0x2e, 0x33, 0x61, 0x47, 0xac, 0x58, 0x00,
  0x00, 0x00, 0x46, 0x49, 0x44, 0x41, 0x54, 0x38, 0x4f, 0x63, 0x60, 0x18,
  0x05, 0xa3, 0x60, 0x14, 0x8c, 0x82, 0x51, 0x30, 0x0a, 0x46, 0xc1, 0x28,
  0x18, 0x05, 0xa3, 0x80, 0x2e, 0x00, 0x00, 0x00, 0xff, 0xff, 0x03, 0x00,
  0x48, 0x2e, 0x02, 0x87, 0xf7, 0xf7, 0x23, 0xef, 0x00, 0x00, 0x00, 0x00,
  0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

export async function generatePass(data: PassData): Promise<Uint8Array> {
  const files: PassFiles = {};

  // Add pass.json
  files['pass.json'] = generatePassJSON(data);

  // Add icons (use default or fetch avatar)
  files['icon.png'] = DEFAULT_ICON;
  files['icon@2x.png'] = DEFAULT_ICON;
  files['logo.png'] = DEFAULT_ICON;
  files['logo@2x.png'] = DEFAULT_ICON;

  // Generate manifest
  files['manifest.json'] = generateManifest(files);

  // Sign manifest
  const signature = signManifest(files['manifest.json']);
  if (signature) {
    files['signature'] = signature;
  }

  // Create zip
  const zipFiles = Object.entries(files).map(([name, content]) => ({
    path: name,
    data: typeof content === 'string' ? new TextEncoder().encode(content) : content,
  }));

  return new Uint8Array(toArray(zipFiles));
}

export function getPassMimeType(): string {
  return 'application/vnd.apple.pkpass';
}
