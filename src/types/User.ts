import userRolesEnum from '@/enums/userRoleEnum'

export default interface User {
  nrUuid: string
  name: string
  email: string
  accessToken: string
  roles: userRolesEnum
}
