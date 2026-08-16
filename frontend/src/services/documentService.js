import api from './api'

/**
 * POST /api/files/getdocuments
 * Body: { botId }
 * Response data: array of { id, bot_id, file_name }
 */
export const getDocuments = async (botId) => {
  
  const res = await api.get('/files/getdocuments', {params:{ botId }})
  return res.data
}

/**
 * POST /api/files/upload/:botId
 * Body: FormData with field "document"
 * Response data: created document row
 */
export const uploadDocument = async (botId, file) => {
  const formData = new FormData()
  formData.append('document', file)
  const res = await api.post(`/files/upload/${botId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

/**
 * DELETE /api/files/delete/:id
 * Response data: deleted row
 */
export const deleteDocument = async (documentId) => {
  const res = await api.delete(`/files/delete/${documentId}`)
  return res.data
}

/**
 * POST /api/files/geturl
 * Body: { botId, document_id }
 * Response data: presigned S3 URL string
 */
export const getDocumentUrl = async (botId, document_id) => {
  const res = await api.post('/files/geturl', { botId, document_id })
  return res.data // data field is the URL string
}

/**
 * PATCH /api/files/updatedocument
 * Body: { botId, documentId, fileName }
 */
export const updateDocument = async (botId, documentId, fileName) => {
  const res = await api.patch('/files/updatedocument', {
    botId,
    documentId,
    fileName,
  })
  return res.data
}
