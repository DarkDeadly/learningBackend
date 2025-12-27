import bcrypt from "bcryptjs"

const passwordHelper = {
    hash: async (password) => {
        return await bcrypt.hash(password, 12);
    },

    compare: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default passwordHelper