import User from "../models/userModel.js"

const userRepository = {

    create: async (userData) => {
        const user = await User.create(userData);
        return user;
    },

    findByEmail: async (email, options = {}) => {
        const query = User.findOne({ email });
        
        if (options.includePassword) {
            query.select("+password");
        }
        
        return await query;
    },

    findById: async (id) => {
        return await User.findById(id);
    }
};

export default userRepository;
