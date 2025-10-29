import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updateUser, useSession } from "~/lib/auth";
import { useTRPC } from "~/lib/trpc";
import AvatarUpload from "../file-upload/avatar-upload";
import { Button } from "../ui/button";
import { useMounted } from "~/hooks/use-mounted";
import { Skeleton } from "../ui/skeleton";

export function OnboardingEditProfile() {
	const { data } = useSession();
	return (
		<div className="flex flex-col gap-4">
			<h3>Update your profile as you see fit</h3>
			<div className="grid gap-2">
				<UserAvatarUpload />
			</div>
		</div>
	);
}

function UserAvatarUpload() {
	const mounted = useMounted();
	if (!mounted) {
		return <Skeleton className="size-32 rounded-full" />;
	}
	return <UserAvatarUploadClient />;
}

function UserAvatarUploadClient() {
	const { data, refetch } = useSession();
	const trpc = useTRPC();
	const [newImage, setNewImage] = useState<File>();
	const { mutateAsync: uploadAvatar, isPending: isUploading } = useMutation(
		trpc.user.updateUserImage.mutationOptions(),
	);
	const { mutateAsync: createPresignedUrl } = useMutation(
		trpc.miscellaneous.createPresignedUrl.mutationOptions(),
	);
	const handleUpload = async () => {
		if (!newImage) {
			toast.error("No image selected");
			return;
		}
		const promise = async () => {
			const presignedUrl = await createPresignedUrl({
				relationId: data?.user.id ?? "",
				fileName: newImage.name,
				fileType: newImage.type,
			});
			if (presignedUrl.error) {
				toast.error(presignedUrl.error);
				return;
			}
			const { url, key } = presignedUrl;
			if (!url || !key) {
				toast.error("Failed to get presigned URL");
				return;
			}
			await fetch(url, {
				method: "PUT",
				body: newImage,
				headers: {
					"Content-Type": newImage.type,
				},
			});

			await uploadAvatar({
				key,
				name: newImage.name,
				type: "image",
			});
		};
		toast.promise(promise(), {
			loading: `Uploading new avatar...`,
			success: () => {
				refetch();
				setNewImage(undefined);
				return "Profile image updated successfully";
			},
			error: (err) => (err instanceof Error ? err.message : "Unknown error"),
		});
	};

	return (
		<div className="flex items-center justify-evenly gap-2">
			<AvatarUpload
				defaultAvatar={data?.user.image ?? ""}
				onFileChange={(file) => {
					const image = file?.file as File;
					setNewImage(image);
				}}
			/>
			{newImage && (
				<Button onClick={handleUpload} disabled={isUploading} type="button">
					{isUploading ? <Loader className="mr-2 size-4 animate-spin" /> : null}
					Upload
				</Button>
			)}
		</div>
	);
}
