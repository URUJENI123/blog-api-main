"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const db_1 = require("../config/db");
const Post_1 = require("../entities/Post");
class PostService {
    constructor() {
        this.postRepository = db_1.AppDataSource.getRepository(Post_1.Post);
    }
    async create(data) {
        const post = this.postRepository.create(data);
        return await this.postRepository.save(post);
    }
    async findAll() {
        return await this.postRepository.find();
    }
    async findById(id) {
        return await this.postRepository.findOneBy({ id });
    }
    async update(id, updatedData) {
        const post = await this.postRepository.findOneBy({ id });
        if (!post)
            return null;
        Object.assign(post, updatedData);
        return await this.postRepository.save(post);
    }
    async delete(id) {
        const result = await this.postRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
    async findByIdWithUser(id) {
        return this.postRepository.findOne({
            where: { id },
            relations: ["user"],
        });
    }
}
exports.PostService = PostService;
//# sourceMappingURL=PostServices.js.map