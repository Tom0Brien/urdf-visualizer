import type { FileInfo } from '../../../types';

function getFileNameFromPath(path: string): FileInfo {
  const lastSlashIdx = path.lastIndexOf('/');
  const fileName = path.slice(lastSlashIdx + 1);
  const lastDotIdx = fileName.lastIndexOf('.');
  return {
    fileName,
    fileExtension: fileName.slice(lastDotIdx + 1).toLowerCase(),
  };
}

export default getFileNameFromPath;
