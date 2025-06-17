"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = require("../config/db");
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.UserRepository = db_1.AppDataSource.getRepository(User_1.User).extend({
    async findByName(name) {
        return this.createQueryBuilder("user")
            .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` })
            .getMany();
    },
    async findOneById(id) {
        return this.findOneBy({ id });
    },
    async findByEmail(email) {
        return this.findOneBy({ email });
    },
    async createUser(userData) {
        if (userData.password) {
            userData.password = await bcrypt_1.default.hash(userData.password, 10);
        }
        const newUser = this.create(userData);
        return this.save(newUser);
    },
    async updateUser(id, userData) {
        const user = await this.findOneById(id);
        if (!user)
            return null;
        Object.assign(user, userData);
        return this.save(user);
    },
    async deleteUser(id) {
        const result = await this.delete(id);
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }
});
//# sourceMappingURL=UserRepository.js.map