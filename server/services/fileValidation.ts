import { createHash } from 'node:crypto';
import { fileTypeFromBuffer } from 'file-type';
import { MAX_REFERENCE_FILE_SIZE } from '../../src/shared/contact-contract.js';
import type { ValidatedReferenceFile } from '../types.js';

const allowedSignatures: Record<
  string,
  ReadonlyArray<{ ext: string; mime: string }>
> = {
  jpg: [{ ext: 'jpg', mime: 'image/jpeg' }],
  jpeg: [{ ext: 'jpg', mime: 'image/jpeg' }],
  png: [{ ext: 'png', mime: 'image/png' }],
  webp: [{ ext: 'webp', mime: 'image/webp' }],
  pdf: [{ ext: 'pdf', mime: 'application/pdf' }],
  doc: [{ ext: 'cfb', mime: 'application/x-cfb' }],
  docx: [
    {
      ext: 'docx',
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  ]
};

export class ReferenceFileError extends Error {}

function cleanFileName(fileName: string): string {
  const leafName = fileName.replace(/^.*[\\/]/, '').replace(/[\0\r\n]/g, '');
  return leafName.slice(0, 255) || 'reference-file';
}

export async function validateReferenceUpload(
  file: Express.Multer.File | undefined
): Promise<ValidatedReferenceFile | null> {
  if (!file) return null;
  if (file.size < 1) {
    throw new ReferenceFileError('The reference file is empty.');
  }
  if (file.size > MAX_REFERENCE_FILE_SIZE) {
    throw new ReferenceFileError(
      'The reference file must be 5 MB or smaller.'
    );
  }

  const originalFileName = cleanFileName(file.originalname);
  const extension = originalFileName.split('.').pop()?.toLowerCase() ?? '';
  const permitted = allowedSignatures[extension];
  if (!permitted) {
    throw new ReferenceFileError(
      'Use a JPG, JPEG, PNG, WEBP, PDF, DOC, or DOCX file.'
    );
  }

  let detected: Awaited<ReturnType<typeof fileTypeFromBuffer>>;
  try {
    detected = await fileTypeFromBuffer(file.buffer);
  } catch {
    throw new ReferenceFileError(
      'The file contents do not match the selected file extension.'
    );
  }
  const signatureMatches =
    detected &&
    permitted.some(
      (signature) =>
        signature.ext === detected.ext && signature.mime === detected.mime
    );
  if (!signatureMatches || !detected) {
    throw new ReferenceFileError(
      'The file contents do not match the selected file extension.'
    );
  }

  return {
    originalFileName,
    extension,
    detectedMime:
      extension === 'doc' ? 'application/msword' : detected.mime,
    byteSize: file.size,
    sha256: createHash('sha256').update(file.buffer).digest(),
    content: file.buffer
  };
}
