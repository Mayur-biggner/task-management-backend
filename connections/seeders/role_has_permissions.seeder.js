import RoleHasPermissions from "../../models/role_has_permissions.model.js";
import Roles from "../../models/roles.model.js";
import Permissions from "../../models/permissions.model.js";
const seedRolePermissions = async () => {
  try {
    const roles = await Roles.find();
    const permissions = await Permissions.find();

    if (roles.length === 0 || permissions.length === 0) {
      return console.log('Cannot seed role permissions: Roles or Permissions are missing.');
    }

    const adminRole = roles.find(r => r.name === 'Admin'.toLowerCase());
    const managerRole = roles.find(r => r.name === 'Manager'.toLowerCase());
    const userRole = roles.find(r => r.name === 'User'.toLowerCase());

    if (!adminRole || !managerRole || !userRole) {
      return console.log('Required roles not found.');
    }

    // Assign all permissions to Admin
    const adminMappings = permissions.map(p => ({
      role: adminRole._id,
      permission: p._id,
    }));

    // Assign selected permissions to Manager
    const managerPermissionNames = [
      'create_task',
      'view_task',
      'update_task',
      'assign_task',
      'change_task_status',
      'view_project',
      'assign_project_members',
      'invite_member',
      'view_team',
      'view_dashboard'
    ];
    const managerMappings = permissions
      .filter(p => managerPermissionNames.includes(p.name))
      .map(p => ({
        role: managerRole._id,
        permission: p._id,
      }));

    // Assign selected permissions to User
    const userPermissionNames = [
      'view_task',
      'change_task_status',
      'add_task_comment',
      'upload_task_attachment',
      'view_project',
      'view_dashboard',
    ];
    const userMappings = permissions
      .filter(p => userPermissionNames.includes(p.name))
      .map(p => ({
        role: userRole._id,
        permission: p._id,
      }));

    const allMappings = [...adminMappings, ...managerMappings, ...userMappings];

    // Prevent duplicates by checking existing mappings
    const existing = await RoleHasPermissions.find();
    if (existing.length === 0) {
      await RoleHasPermissions.insertMany(allMappings);
      console.log('Role-permission mappings seeded successfully.');
    } else {
      console.log('Role-permission mappings already exist. Skipping seeding.');
    }

  } catch (error) {
    console.error('Failed to seed role-permission mappings:', error.message);
  }
};

export default seedRolePermissions;
