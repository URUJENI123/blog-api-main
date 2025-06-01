import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/db';

export class UserService {
  private userRepository = UserRepository;

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    return UserRepository.createUser(userData);
  }

  async update(id: number, updatedData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    Object.assign(user, updatedData);
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async login(email: string, password: string) {
    console.log("Login request for email:", email);

      const user = await this.userRepository.findByEmail(email);
    if (!user) {
      console.log("User not found");
      return null;
    } 
    
    console.log("User found:", user.email);
    console.log("Stored password:", user.password);
    console.log("Input password:", password);
  
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

      if (!isMatch) return null;
  
      return user;
    }
}
