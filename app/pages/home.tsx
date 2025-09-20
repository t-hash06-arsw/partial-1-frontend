import {
	Button,
	Input,
	Select,
	SelectItem,
	type SharedSelection,
	Tooltip,
} from "@heroui/react";
import { useForm, useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

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

export interface StockAction {
	id: string;
	symbol: string;
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
}

const FUNCTIONS = [
	{ label: "Intraday", value: "intraday" },
	{ label: "Daily", value: "daily" },
	{ label: "Weekly", value: "weekly" },
	{ label: "Monthly", value: "monthly" },
];

export default function Home() {
	const form = useForm({
		defaultValues: {
			function: new Set(["monthly"]),
			symbol: "",
			interval: new Set(["5min"]),
		} satisfies FormState,
	});

	const symbol = useStore(form.store, (state) => state.values.symbol);
	const func = useStore(
		form.store,
		(state) => Array.from(state.values.function)[0],
	);
	const interval = useStore(
		form.store,
		(state) => Array.from(state.values.interval)[0],
	);

	const query = useQuery({
		queryKey: ["STOCK_ACTIONS"],
		queryFn: async () => {
			const url = new URL(
				`${import.meta.env.VITE_API_URL}/actions/${symbol.toLocaleUpperCase()}/${func}`,
			);
			if (func === "intraday") {
				url.searchParams.append("interval", interval);
			}
			const response = await fetch(url.toString());

			if (!response.ok) {
				return [];
			}

			if (response.status !== 200) {
				return [];
			}

			const data = await response.json();

			if (Array.isArray(data)) {
				return data as StockAction[];
			}

			return [];
		},
		enabled: symbol.length > 0,
	});

	const chartData =
		query.data?.map((item) => ({
			date: new Date(item.date).toLocaleDateString(),
			close: item.close,
		})) || [];

	const handleSubmit = () => {
		query.refetch();
	};

	return (
		<main className="bg-content2 w-dvw h-dvh overflow-hidden flex justify-center py-16">
			<section className="bg-content1 flex flex-col gap-8 w-full max-w-2xl p-5 shadow-medium rounded-medium h-min">
				<div className="flex gap-4 items-end">
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
					<Button color="primary" onPress={handleSubmit} className="w-xs">
						Fetch
					</Button>
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
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="close" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</section>
		</main>
	);
}
