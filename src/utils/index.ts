export const fetcher = async <T>(...args: Parameters<typeof fetch>): Promise<T> => {
  const res = await fetch(...args)

  console.log('fetcher res ====>>>>', res);
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // 使用 Object.assign 来添加额外属性
    Object.assign(error, {
      status: res.status,
      info: null
    })
    
    try {
      const errorData = await res.json()
      Object.assign(error, { info: errorData })
    } catch {
      Object.assign(error, { info: { message: 'Failed to parse error response' } })
    }
    
    throw error
  }
  
  const result = await res.json()

  return result;
}
