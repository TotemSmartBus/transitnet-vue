import ApiService from '@/service/api.service'


export const searchTrajectory = (form) => {
  return ApiService.post('query/trajectory', form)
}
