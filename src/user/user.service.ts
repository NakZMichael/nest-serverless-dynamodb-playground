import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './user.dto';

let dynamoDB: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE === 'true') {
  dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: process.env.DYNAMODB_ENDPOINT,
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET',
  });
} else {
  dynamoDB = new AWS.DynamoDB.DocumentClient();
}

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const user = {
      id: uuid(),
      ...createUserDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await dynamoDB
        .put({
          TableName: process.env.USERS_TABLE_NAME,
          Item: user,
        })
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return user;
  }
  async getUserById(id: string): Promise<any> {
    let user;
    try {
      const result = await dynamoDB
        .get({
          TableName: process.env.USERS_TABLE_NAME,
          Key: { id },
        })
        .promise();
      user = result.Item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return user;
  }

  async getAllUsers(): Promise<any> {
    const result = await dynamoDB
      .scan({
        TableName: process.env.USERS_TABLE_NAME,
      })
      .promise()
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
    return result.Items;
  }
}
