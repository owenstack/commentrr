import { Check, Loader } from "lucide-react";
import { OnboardingEditProfile } from "~/components/onboarding/edit-profile";
import { Badge } from "~/components/ui/badge";
import {
	Stepper,
	StepperContent,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperPanel,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "~/components/ui/stepper";
import { handleLoader, steps } from "~/lib/constants";
import { useStepStore } from "~/lib/store";
import { caller } from "~/lib/trpc";
import type { Route } from "./+types/onboarding";

export const loader = (args: Route.LoaderArgs) =>
	handleLoader(async () => {
		const api = caller(args);
		const user = await api.user.getUser.query();
		return { name: user.name };
	});

export default function Page({ loaderData }: Route.ComponentProps) {
	const { currentStep, setCurrentStep } = useStepStore();

	return (
		<div className="min-h-screen bg-background flex items-center justify-center w-full p-6">
			<div className="max-w-4xl w-full space-y-12">
				<div className="text-center space-y-3">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Welcome{loaderData?.name ? `, ${loaderData.name}` : ""}!
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Set up your account to get the best experience from our application.
					</p>
				</div>
				<Stepper
					value={currentStep}
					onValueChange={setCurrentStep}
					indicators={{
						completed: <Check className="size-4" />,
						loading: <Loader className="animate-spin size-4" />,
					}}
					className="space-y-8"
				>
					<StepperNav className="gap-4 mb-16">
						{steps.map((step, index) => (
							<StepperItem
								key={step.title}
								step={index}
								className="flex item-start justify-center relative group/data-[orientation=horizontal]/stepper-nav"
							>
								<StepperTrigger
									disabled={currentStep !== index}
									asChild
									className="flex flex-col items-start justify-center gap-3 grow p-2"
								>
									<StepperIndicator className="size-8 border-2 data-[state=completed]:text-white data-[state=completed]:bg-green-500 data-[state=inactive]:bg-transparent data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground">
										<step.icon className="size-4" />
									</StepperIndicator>
									<div className="flex flex-col items-start gap-1">
										<div className="text-[10px] font-semibold uppercase text-muted-foreground">
											Step {index + 1}
										</div>
										<StepperTitle className="text-start text-base font-medium leading-tight group-data-[state=inactive]/step:text-muted-foreground">
											{step.title}
										</StepperTitle>
										<div>
											<Badge
												variant={"outline"}
												className="hidden group-data-[state=active]/step:inline-flex"
											>
												In Progress
											</Badge>
											<Badge className="hidden group-data-[state=completed]/step:inline-flex">
												Completed
											</Badge>
											<Badge
												variant="secondary"
												className="hidden group-data-[state=inactive]/step:inline-flex text-muted-foreground"
											>
												Pending
											</Badge>
										</div>
									</div>
								</StepperTrigger>
								{steps.length > index + 1 && (
									<StepperSeparator className="absolute top-4 start-[calc(50%+1rem)] w-[calc(50%-2rem)] h-px bg-border group-data-[state=completed]/step:bg-green-500" />
								)}
							</StepperItem>
						))}
					</StepperNav>
					<StepperPanel className="animate-in slide-in-from-bottom-8 fade-in-0 duration-500 pt-8 border-t border-border">
						<StepperContent value={currentStep} key={currentStep}>
							<OnboardingEditProfile />
						</StepperContent>
					</StepperPanel>
				</Stepper>
			</div>
		</div>
	);
}
