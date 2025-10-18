import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/common/decators/roles/roles.guard';

const usersServiceMock = {
  createUser: jest.fn().mockResolvedValue({ userId: 99, username: 'createdUser' }),
  findAll: jest.fn().mockResolvedValue([{ userId: 1, username: 'User1' }]),
  findByUserId: jest.fn().mockResolvedValue({ userId: 2, username: 'User2' }),
  findById: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', username: 'mongoUser' }),
  updateUser: jest.fn().mockResolvedValue({ _id: 'id', username: 'updatedUser' }),
  deleteUser: jest.fn().mockResolvedValue({ success: true }),
  resetUsers: jest.fn().mockResolvedValue({ success: true, count: 30 }),
};

// Her zaman true döndüren sahte guardlar
const mockGuard = { canActivate: jest.fn(() => true) };


const userModelMock = {
  find: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([{ userId: 1, username: 'User1' }]),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: getModelToken(User.name), useValue: userModelMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const result = await controller.register({ username: 'test', password: '123', role: 'user' });
    expect(result).toEqual({ userId: 99, username: 'createdUser' });
    expect(usersServiceMock.createUser).toHaveBeenCalledWith('test', '123', 'user');
  });

  it('should return users (findAll)', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(usersServiceMock.findAll).toHaveBeenCalled();
  });

  it('should get user by userId (findOne)', async () => {
    const result = await controller.findOne('2');
    expect(result).toEqual({ userId: 2, username: 'User2' });
    expect(usersServiceMock.findByUserId).toHaveBeenCalledWith(2);
  });

  it('should throw on invalid userId (findOne)', async () => {
    await expect(controller.findOne('not_a_number')).rejects.toThrow('Invalid user id');  });

  it('should get user by mongo id (findById)', async () => {
    const result = await controller.findById('507f1f77bcf86cd799439011');
    expect(result).toEqual({ _id: '507f1f77bcf86cd799439011', username: 'mongoUser' });
    expect(usersServiceMock.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });

  it('should update user', async () => {
    const result = await controller.update('id', { username: 'newname' });
    expect(result).toEqual({ _id: 'id', username: 'updatedUser' });
    expect(usersServiceMock.updateUser).toHaveBeenCalledWith('id', { username: 'newname' });
  });

  it('should remove (delete) user', async () => {
    const result = await controller.remove('id');
    expect(result).toEqual({ success: true });
    expect(usersServiceMock.deleteUser).toHaveBeenCalledWith('id');
  });

  it('should reset users', async () => {
    const result = await controller.resetUsers();
    expect(result).toEqual({ success: true, count: 30 });
    expect(usersServiceMock.resetUsers).toHaveBeenCalled();
  });
});
