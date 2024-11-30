export class UserDTO {
  name: string;
  email: string;
  createdAt: Date;
  id: string;
  profileImageId: number | null;

  constructor(
    name: string,
    email: string,
    createdAt: Date,
    id: string,
    profileImageId: number | null
  ) {
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.id = id;
    this.profileImageId = profileImageId;
  }

  toJson() {
    return {
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      id: this.id,
      profileImageId: this.profileImageId,
    };
  }
}
