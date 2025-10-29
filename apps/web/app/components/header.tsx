import { DoorOpen, Moon, PackageOpen, Plus, Sun } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Theme, useTheme } from "remix-themes";
import { signOut, useListOrganizations, useSession } from "~/lib/auth";
import { getInitials } from "~/lib/helpers";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./ui/empty";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function Header() {
	return (
		<header className="fixed flex items-center justify-between gap-4 px-4 py-2 top-0 border z-10 w-full h-16">
			<div className="flex items-center gap-2">
				<Logo />
				<Switcher />
				<Link
					className={buttonVariants({ variant: "outline" })}
					to={"/new-org"}
				>
					<Plus /> New{" "}
				</Link>
			</div>
			<UserDropdown />
		</header>
	);
}

function Switcher() {
	const { data } = useListOrganizations();
	const [query, setQuery] = useState("");

	return (
		<Popover>
			<PopoverTrigger className={buttonVariants({ variant: "secondary" })}>
				Select organization
			</PopoverTrigger>
			<PopoverContent align="start">
				<Command>
					<CommandInput
						value={query}
						onValueChange={setQuery}
						placeholder="Search organizations..."
					/>
					<CommandList>
						<CommandEmpty>
							<SwitcherEmpty query={query} />
						</CommandEmpty>
						<CommandGroup>
							{data && data.length > 0 ? (
								data.map((org) => (
									<CommandItem key={org.id}>
										<Link
											to={`/${org.slug}`}
											className={buttonVariants({ variant: "ghost" })}
										>
											<Avatar className="size-6">
												<AvatarImage src={org.logo ?? ""} />
												<AvatarFallback>{getInitials(org.name)}</AvatarFallback>
											</Avatar>
											<span>{org.name}</span>
										</Link>
									</CommandItem>
								))
							) : (
								<SwitcherEmpty />
							)}
						</CommandGroup>
						<CommandItem>
							<Link
								to={"/new-org"}
								className={buttonVariants({ variant: "ghost" })}
							>
								<Plus /> Create new organization
							</Link>
						</CommandItem>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function SwitcherEmpty({ query }: { query?: string }) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant={"icon"}>
					<PackageOpen />
				</EmptyMedia>
				<EmptyTitle>Nothing to see here</EmptyTitle>
				{query && (
					<EmptyDescription>
						No organization found for{" "}
						<span className="font-semibold">"{query}"</span>
					</EmptyDescription>
				)}
			</EmptyHeader>
		</Empty>
	);
}

function UserDropdown() {
	const { data } = useSession();
	const navigate = useNavigate();
	const [, setTheme] = useTheme();

	const handleSignOut = () => {
		signOut();
		navigate("/login");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
			>
				<Avatar>
					<AvatarImage src={data?.user?.image ?? ""} />
					<AvatarFallback>
						{getInitials(data?.user.name || "New user")}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel className="flex items-center gap-1">
					<Avatar>
						<AvatarImage src={data?.user?.image ?? ""} />
						<AvatarFallback>
							{getInitials(data?.user.name || "New user")}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-0.5">
						<span className="text-sm">{data?.user.name || "New user"}</span>
						<span className="text-xs text-muted-foreground">
							{data?.user.email}
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
						<Sun /> Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
						<Moon /> Dark
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Button
						variant={"destructive"}
						onClick={handleSignOut}
						className="w-full"
					>
						<DoorOpen />
						Sign out
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
