import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "~/lib/auth";
import { orpc } from "~/lib/orpc";
import AvatarUpload from "../file-upload/avatar-upload";
import { Button } from "../ui/button";

export function OnboardingEditProfile() {
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
	const { data, refetch } = useSession();
	const [image, setImage] = useState<File>();
	const { mutateAsync, isPending } = useMutation(
		orpc.user.uploadUserImage.mutationOptions(),
	);
	const handleUpload = async () => {
		if (!image) {
			toast.error("No image selected");
			return;
		}
		toast.promise(mutateAsync({ image }), {
			loading: `Uploading new avatar...`,
			success: (res) => {
				if (res.error) {
					toast.error(res.error);
					return;
				}
				refetch();
				setImage(undefined);
				return res.message;
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
					setImage(image);
				}}
			/>
			{image && (
				<Button onClick={handleUpload} disabled={isPending}>
					{isPending ? <Loader className="mr-2 size-4 animate-spin" /> : null}
					Upload
				</Button>
			)}
		</div>
	);
}
