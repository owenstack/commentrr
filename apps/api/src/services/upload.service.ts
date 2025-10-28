import { env } from "cloudflare:workers";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const S3 = new S3Client({
	region: "auto",
	endpoint,
	credentials: {
		accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
		secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
	},
});

export async function getPresignedUrl(key: string, contentType: string) {
	try {
		const command = new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
			ContentType: contentType,
		});
		const url = await getSignedUrl(S3, command, {
			expiresIn: 3600,
		});
		return url;
	} catch (error) {
		console.error("Error creating presigned URL:", error);
	}
}
