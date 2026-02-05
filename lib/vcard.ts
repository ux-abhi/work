interface VCardInput {
  displayName: string;
  email?: string;
  phone?: string;
  location?: string;
  url?: string;
}

/** Generate a vCard 3.0 string from contact info */
export function generateVCard(input: VCardInput): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${input.displayName}`,
  ];

  if (input.email) lines.push(`EMAIL:${input.email}`);
  if (input.phone) lines.push(`TEL:${input.phone}`);
  if (input.location) lines.push(`ADR:;;${input.location};;;;`);
  if (input.url) lines.push(`URL:${input.url}`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
