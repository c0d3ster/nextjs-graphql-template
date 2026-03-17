import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { Env } from '@/libs/Env'

const FALLBACK_LOGO = '/c0d3sterlogo.png'

export async function getLogoUrl(): Promise<string> {
  const { PROJECT_LOGO_KEY, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = Env

  if (!PROJECT_LOGO_KEY || !R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    return FALLBACK_LOGO
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  })

  const command = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: PROJECT_LOGO_KEY })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}
