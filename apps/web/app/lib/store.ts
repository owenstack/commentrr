import { create } from "zustand";

interface StepStore {
	currentStep: number;
	setCurrentStep: (step: number) => void;
}

export const useStepStore = create<StepStore>((set) => ({
	currentStep: 0,
	setCurrentStep: (currentStep) => set({ currentStep }),
}));
