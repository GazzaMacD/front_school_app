import { PERMISSIONS } from "./constants.server";

/* Permissions */
export function hasSchedulePermissions(
  groups: { name: string }[],
  staff: boolean
): boolean {
  if (staff) return true;
  const schedulePerms = new Set(PERMISSIONS.schedule.split(","));
  for (let i = 0; i < groups.length; i += 1) {
    if (schedulePerms.has(groups[i].name)) return true;
  }
  return false;
}
