/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { env } from 'process';
import { Storage } from '@google-cloud/storage';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin'

import { PrismaService } from '../../database/prisma.service';
import { UserRepository } from '../user-respositories';
import { UserEntity } from '../../entity/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  baseName = 'casal_site_images'
  firebaseConfig = {
    type: env.TYPE,
    project_id: env.PROJECT_ID,
    private_key_id: env.PRIVATE_KEY_ID,
    private_key: env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: env.CLIENT_EMAIL,
    client_id: env.CLIENT_ID,
  }

  private storage: Storage
  private bucket;

  constructor(private prisma: PrismaService) {
    admin.initializeApp({
      credential: admin.credential.cert(this.firebaseConfig as admin.ServiceAccount)
    })

    this.storage = new Storage({
      credentials: {
        client_email: this.firebaseConfig.client_email,
        private_key: this.firebaseConfig.private_key,
      },
      projectId: this.firebaseConfig.project_id,
    })

    this.bucket = this.storage.bucket(env.BUCKET)
  }

  async createUser(newUserModel: UserEntity): Promise<any> {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: {
          email: newUserModel.email,
        },
      });

      if (existUser) return new NotAcceptableException('Conta já registrada');

      const salt = await bcrypt.genSalt(10);
      newUserModel.password = await bcrypt.hash(newUserModel.password, salt);

      return await this.prisma.user.create({
        data: newUserModel,
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return new NotAcceptableException(
          'Credenciais Inválidas! Favor, tentar novamente'
        );
      }

      const invalidPassword = await bcrypt.compare(password, user.password);

      if (!invalidPassword) return new NotAcceptableException('Senha inválida');

      const token = jwt.sign(
        {
          user: user.name,
          email: user.email,
          userId: user.id,
        },
        env.SECRET_MESSAGE,
        {
          expiresIn: '1h',
        }
      );
      
      const userData: UserEntity = user;
      delete userData.password;
      
      return {
        token,
        expiresIn: 3600,
        userData,
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async updateUser(userData: { user: UserEntity, userId: string }): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userData.userId }
      })

      if (!user) return new NotFoundException('Usuário não encontrado');

      userData.user.updated_at = new Date()

      if (userData.user.couple_image?.length) {
        userData.user.couple_image = await this.uploadImage(userData.user.couple_image, user.name)
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: userData.user
      })

      delete updatedUser.password

      return updatedUser
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  async checkUser(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return !!user;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getAccountInfo(userId: string): Promise<UserEntity> {
    console.log(userId)
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException(
        'Não foi possível encontrar o user de ID:' + userId
      );

      delete user.password

      return user;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async uploadImage(file: string, userName: string): Promise<string> {
    try {
      const buffer = Buffer.from(file, 'base64');
      const secondName = `${userName.toLocaleLowerCase().replace(' ', '_')}_${new Date().toISOString().replace(' ', '_')}`
      const originalname = `${this.baseName}/image_${secondName}.png`;

      const blob = this.bucket.file(originalname);

      const [files] = await this.bucket.getFiles({
        prefix: `${this.baseName}/image_${userName.toLocaleLowerCase().replace(' ', '_')}`,
      });

      for (const file of files) {
        await file.delete();
      }

      const blobStream = blob.createWriteStream({
        resumable: false,
        public: true,
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          console.error(err);
          reject(err);
        });

        blobStream.on('finish', async () => {
          await blob.makePublic();
          const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });

        blobStream.end(buffer);
      });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
