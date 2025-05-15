import Roles from '../../models/roles.model.js';


const seedRoles = async () => {
    try {
        const existingRoles = await Roles.find();

        if (existingRoles.length === 0) {
            const defaultRoles = [
                { name: 'Admin' },
                { name: 'Manager' },
                { name: 'User' },
            ];

            await Roles.insertMany(defaultRoles);
            console.log('Default roles seeded successfully');
        } else {
            console.log('Roles already exist. No seeding needed');
        }
    } catch (error) {
        console.error('Error seeding roles :', error.message);
    }
};

export default seedRoles;
