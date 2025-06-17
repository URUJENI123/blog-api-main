"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.userRepository = UserRepository_1.UserRepository;
    }
    async findAll() {
        return await this.userRepository.find();
    }
    async findById(id) {
        return await this.userRepository.findOneBy({ id });
    }
    async findByName(name) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` })
            .getMany();
    }
    async findByEmail(email) {
        return await this.userRepository.findOneBy({ email });
    }
    async create(userData) {
        return UserRepository_1.UserRepository.createUser(userData);
    }
    async update(id, updatedData) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user)
            return null;
        if (updatedData.password) {
            updatedData.password = await bcrypt_1.default.hash(updatedData.password, 10);
        }
        Object.assign(user, updatedData);
        return await this.userRepository.save(user);
    }
    async delete(id) {
        const result = await this.userRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
    async login(email, password) {
        console.log("Login request for email:", email);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            console.log("User not found");
            return null;
        }
        console.log("User found:", user.email);
        console.log("Stored password:", user.password);
        console.log("Input password:", password);
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch)
            return null;
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserServices.js.map