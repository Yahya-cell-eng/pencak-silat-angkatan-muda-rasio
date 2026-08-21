import { User } from '../types';

/**
 * Generates official PAMUR Member ID (Nomor Induk Anggota / NIA).
 * Format: 51 + 3-digit Join Year + Sequence Number (resets annually).
 * 
 * Example:
 * - Year 2026, 1st member -> "51026001"
 * - Year 2026, 2nd member -> "51026002"
 * - Year 2025, 1st member -> "51025001" (reset per different year)
 * 
 * @param joinYearOrDate Year as number (e.g. 2026) or ISO date string (e.g. "2026-08-21")
 * @param existingUsers List of all current registered users in the database
 * @returns Formatted member ID string (e.g. "51026001")
 */
export function generatePamurMemberId(
  joinYearOrDate?: string | number,
  existingUsers: User[] = []
): string {
  let yearNum = new Date().getFullYear();

  if (typeof joinYearOrDate === 'number' && joinYearOrDate > 1950 && joinYearOrDate < 2100) {
    yearNum = joinYearOrDate;
  } else if (typeof joinYearOrDate === 'string' && joinYearOrDate.trim()) {
    const cleanStr = joinYearOrDate.trim();
    const parsed = parseInt(cleanStr.slice(0, 4), 10);
    if (!isNaN(parsed) && parsed > 1950 && parsed < 2100) {
      yearNum = parsed;
    }
  }

  // 3-digit year: e.g. 2026 -> "026", 2025 -> "025"
  const year3Digit = (yearNum % 1000).toString().padStart(3, '0');
  const prefix = `51${year3Digit}`; // e.g. "51026"

  let maxSeq = 0;

  existingUsers.forEach((u) => {
    const mId = (u.memberId || '').trim();
    if (mId.startsWith(prefix)) {
      const seqPart = mId.slice(prefix.length).replace(/\D/g, '');
      const parsedSeq = parseInt(seqPart, 10);
      if (!isNaN(parsedSeq) && parsedSeq > maxSeq) {
        maxSeq = parsedSeq;
      }
    }
  });

  const nextSeq = maxSeq + 1;
  const seqPadded = nextSeq.toString().padStart(3, '0'); // "001", "002", etc.

  return `${prefix}${seqPadded}`;
}

/**
 * Validates or parses a PAMUR member ID
 */
export function parsePamurMemberId(memberId: string): {
  isValid: boolean;
  prefix: string;
  year?: number;
  sequence?: number;
} {
  const clean = (memberId || '').trim();
  if (clean.length >= 8 && clean.startsWith('51')) {
    const year3Digit = clean.slice(2, 5);
    const seqStr = clean.slice(5);
    const yearNum = 2000 + parseInt(year3Digit, 10);
    const seqNum = parseInt(seqStr, 10);

    return {
      isValid: !isNaN(yearNum) && !isNaN(seqNum),
      prefix: '51',
      year: isNaN(yearNum) ? undefined : yearNum,
      sequence: isNaN(seqNum) ? undefined : seqNum
    };
  }

  return { isValid: false, prefix: '' };
}
