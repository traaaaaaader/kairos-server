import { User } from '@prisma/db-auth';

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'imageUrl'>;

export type AuthUser = {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
};
