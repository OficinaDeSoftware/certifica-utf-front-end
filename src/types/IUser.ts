import userRolesEnum from '@/enums/userRoleEnum'

export default interface IUser {
  nrUuid: string
  name: string
  email: string
  accessToken: string
  roles: Array<userRolesEnum>
}
