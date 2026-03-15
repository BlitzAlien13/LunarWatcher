import { PermissionsBitField } from "discord.js";

/**
 * @param {string | number | bigint} permissions
 * @param {import("discord.js").PermissionsString} permission
 */
export function hasPermissions(permissions, permission) {
  const perms = new PermissionsBitField(permissions);
  return perms.has(permission);
}