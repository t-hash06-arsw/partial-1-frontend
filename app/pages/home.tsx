import { Input, Select, SelectItem, type SharedSelection } from "@heroui/react";
import { useForm } from "@tanstack/react-form";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

interface FormState {
	symbol: string;
	function: SharedSelection;
	interval: SharedSelection;
}

const FUNCTIONS = [
	{ label: "Intraday", value: "TIME_SERIES_INTRADAY" },
	{ label: "Daily", value: "TIME_SERIES_DAILY" },
	{ label: "Weekly", value: "TIME_SERIES_WEEKLY" },
	{ label: "Monthly", value: "TIME_SERIES_MONTHLY" },
];

export default function Home() {
	const form = useForm({
		defaultValues: {
			function: new Set(["TIME_SERIES_MONTHLY"]),
			symbol: "",
			interval: new Set(["5min"]),
		} satisfies FormState,
	});

	return (
		<main className="bg-content2 w-dvw h-dvh overflow-hidden flex justify-center py-16">
			<section className="bg-content1 flex flex-col w-full max-w-2xl p-5 shadow-medium rounded-medium h-min">
				<div className="flex gap-4">
					<form.Field name="symbol">
						{(field) => (
							<Input
								label="Symbol"
								placeholder="IBM"
								labelPlacement="outside"
								name={field.name}
								value={field.state.value}
								onValueChange={field.handleChange}
							/>
						)}
					</form.Field>
					<form.Field name="function">
						{(field) => (
							<Select
								label="Function"
								labelPlacement="outside"
								selectedKeys={field.state.value}
								onSelectionChange={(value) =>
									field.handleChange(new Set(value as unknown as string[]))
								}
							>
								{FUNCTIONS.map((func) => (
									<SelectItem key={func.value}>{func.label}</SelectItem>
								))}
							</Select>
						)}
					</form.Field>
					<form.Subscribe
						selector={(store) =>
							store.values.function.has("TIME_SERIES_INTRADAY")
						}
					>
						{(isIntraday) =>
							!isIntraday ? null : (
								<form.Field name="interval">
									{(field) => (
										<Select
											label="Interval"
											labelPlacement="outside"
											selectedKeys={field.state.value}
											onSelectionChange={(value) =>
												field.handleChange(
													new Set(value as unknown as string[]),
												)
											}
										>
											<SelectItem key="1min">1min</SelectItem>
											<SelectItem key="5min">5min</SelectItem>
											<SelectItem key="15min">15min</SelectItem>
											<SelectItem key="30min">30min</SelectItem>
											<SelectItem key="60min">60min</SelectItem>
										</Select>
									)}
								</form.Field>
							)
						}
					</form.Subscribe>
				</div>
			</section>
		</main>
	);
}
