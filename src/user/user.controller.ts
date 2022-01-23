import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: any): Promise<any> {
    const user = await this.userService.createUser(body);
    return { status: true, data: user };
  }
  @Get()
  async getAllUsers(): Promise<any> {
    const users = await this.userService.getAllUsers();
    if (!users) {
      throw new NotFoundException(`Failed to fetch all users`);
    }
    return { status: true, data: users };
  }
  @Get(':id')
  async getUserById(@Param() { id }: any): Promise<any> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return { status: true, data: user };
  }
}
