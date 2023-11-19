import ApiService from '@/service/api.service'

export const searchTrajectory_Range_realtime = (form) => {
  return ApiService.post('query/traj_range_realtime', form)
}
export const searchTrajectory_Range_history = (form) => {
  return ApiService.post('query/traj_range_history', form)
}
export const searchTrajectory_Knn_realtime = (form) => {
  return ApiService.post('query/traj_knn_realtime', form)
}

export const searchTrajectory_Knn_history = (form) => {
  return ApiService.post('query/traj_knn_history', form)
}

