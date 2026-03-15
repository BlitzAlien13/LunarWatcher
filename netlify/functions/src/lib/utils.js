import { Permissions } from "discord.js";

/**
 * @param {string | number | bigint} permissions
 * @param {import("discord.js").PermissionResolvable} permission
 */
export function hasPermissions(permissions, permission) {
  // Discord API sends permissions as a stringified int; use BigInt to avoid precision loss.
  const perms = new Permissions(BigInt(permissions));

  // discord.js v13 expects permission names in UPPER_SNAKE_CASE.
  const key =
    typeof permission === "string"
      ? permission.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase()
      : permission;

  return perms.has(key);
}
