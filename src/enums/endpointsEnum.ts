export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const apiEndpointsEnum = {
  LOGIN: `${API_BASE_URL}/api/auth/signIn`,
}

export default apiEndpointsEnum
