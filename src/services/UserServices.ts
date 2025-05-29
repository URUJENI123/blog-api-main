import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';

export class UserService {
  async findAll(): Promise<User[]> {
    return UserRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return UserRepository.findOneById(id);
  }

  async findByName(name: string): Promise<User[]> {
    return UserRepository.findByName(name);
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserRepository.findByEmail(email);
  }

  async create(userData: Partial<User>): Promise<User> {
    return UserRepository.createUser(userData);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    return UserRepository.updateUser(id, userData);
  }

  async delete(id: number): Promise<boolean> {
    return UserRepository.deleteUser(id);
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }
}
