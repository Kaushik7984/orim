export class CreateUserDto {
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
}
