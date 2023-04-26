import ApiService from '@/service/api.service'


export const searchTrajectory = (form) => {
  return ApiService.post('api/query/trajectory', form)
}
