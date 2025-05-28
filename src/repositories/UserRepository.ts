
import { AppDataSource } from "../config/db";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByName(name: string): Promise<User[]> {
    return this.createQueryBuilder("user")
      .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` })
      .getMany();
  },

  async findOneById(id: number): Promise<User | null> {
    return this.findOneBy({ id });
  },

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    return this.save(user);
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.findOneById(id);
    if (!user) return null;
    Object.assign(user, userData);
    return this.save(user);
  },

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }
});
