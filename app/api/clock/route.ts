import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  currentTime: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const currentTime = new Date().toLocaleTimeString()
  res.status(200).json({ currentTime })
}