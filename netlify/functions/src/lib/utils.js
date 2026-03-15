import { PermissionsBitField } from "discord.js";

/**
 * @param {string | number | bigint | bigint} permissions
 * @param {import("discord.js").PermissionResolvable} permission
 */
export function hasPermissions(permissions, permission) {
  // Discord API sends permissions as a stringified int; use BigInt to avoid precision loss.
  const perms = new PermissionsBitField(BigInt(permissions));
  return perms.has(permission);
}
