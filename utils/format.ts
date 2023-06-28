export const maybeBackupString = ({ str, backup }: { str?: string, backup: string }) => {
  if (str && str.length > 0) return str
  return backup
}