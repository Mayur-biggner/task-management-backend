import Permissions from "../../models/permissions.model.js";

const seedPermissions = async () => {
  try {
    const count = await Permissions.countDocuments();

    if (count === 0) {
      const permissions = [
        // Task-related
        { name: 'create_task', description: 'Create a new task' },
        { name: 'view_task', description: 'View tasks' },
        { name: 'update_task', description: 'Edit a task' },
        { name: 'delete_task', description: 'Delete a task' },
        { name: 'assign_task', description: 'Assign task to users' },
        { name: 'change_task_status', description: 'Change the status of a task' },
        { name: 'prioritize_task', description: 'Mark task as high/medium/low priority' },
        { name: 'add_task_comment', description: 'Add comments to task' },
        { name: 'delete_task_comment', description: 'Delete comments on task' },
        { name: 'upload_task_attachment', description: 'Upload files to a task' },
        { name: 'delete_task_attachment', description: 'Delete uploaded files from a task' },

        // Project-related
        { name: 'create_project', description: 'Create new projects' },
        { name: 'view_project', description: 'View project details' },
        { name: 'update_project', description: 'Update project information' },
        { name: 'delete_project', description: 'Delete a project' },
        { name: 'assign_project_members', description: 'Assign members to a project' },

        // Team/User-related
        { name: 'invite_member', description: 'Invite new team members' },
        { name: 'remove_member', description: 'Remove a team member' },
        { name: 'change_member_role', description: 'Change user role' },
        { name: 'view_team', description: 'View team and members' },

        // Other
        { name: 'manage_settings', description: 'Change application settings' },
      ];

      await Permissions.insertMany(permissions);
      console.log('Task management permissions seeded successfully.');
    } else {
      console.log('Permissions already exist. Skipping seeding.');
    }
  } catch (error) {
    console.error('Permission seeding failed:', error.message);
  }
};

export default seedPermissions;
