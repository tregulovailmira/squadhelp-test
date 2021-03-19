import http from '../interceptor'

export const registerRequest = (data) => http.post('/auth/registration', data)
export const loginRequest = (data) => http.post('/auth/login', data)
export const getUser = () => http.get('/auth/authUser')

export const payMent = (data) => http.post('/contests/payment', data.formData)
export const getActiveContests = ({ offset, limit, typeIndex, contestId, industry, awardSort, ownEntries }) =>
  http.get(`contests?offset=${offset}&limit=${limit}&typeIndex=${typeIndex}&contestId=${contestId}&industry=${industry}&awardSort=${awardSort}&ownEntries=${ownEntries}`)
export const dataForContest = ({ characteristic1, characteristic2 }) => http.get(`/contests/data?characteristic1=${characteristic1}&characteristic2=${characteristic2}`)
export const getContestById = ({ contestId }) => http.get(`contests/${contestId}`)
export const updateContest = data => http.put(`/contests/${data.get('contestId')}`, data)
export const setNewOffer = data => http.post(`/contests/${data.get('contestId')}/offers`, data)
export const setOfferStatus = ({ contestId, offerId, command, creatorId, orderId, priority }) =>
  http.put(`/contests/${contestId}/offers/${offerId}?command=${command}&creatorId=${creatorId}&orderId=${orderId}&priority=${priority}`)
export const downloadContestFile = ({ fileName }) => http.get(`/contests/files/${fileName}`)

export const changeMark = ({ offerId, ...data }) => http.put(`offers/${offerId}/rating`, data)

export const cashOut = (data) => http.post('/user/cashout', data)
export const getCustomersContests = ({ limit, offset, contestStatus }) =>
  http.get(`/user/contests?limit=${limit}&offset=${offset}&status=${contestStatus}`)
export const updateUser = (data) => http.patch('/user', data)

export const getPreviewChat = () => http.get('/chat/preview')
export const newMessage = (data) => http.post('/chat/messages', data)
export const getDialog = ({ interlocutorId }) => http.get(`/chat/conversations/${interlocutorId}`)
export const toggleBlackAndFavoriteList = ({ interlocutorId, ...data }) => http.patch(`/chat/conversations/${interlocutorId}`, data)
export const createCatalog = (data) => http.post('/chat/catalogs', data)
export const getCatalogList = () => http.get('/chat/catalogs')
export const updateCatalog = ({ catalogId, ...data }) => http.patch(`chat/catalogs/${catalogId}`, data)
export const deleteCatalog = ({ catalogId }) => http.delete(`/chat/catalogs/${catalogId}`)
