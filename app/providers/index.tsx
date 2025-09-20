import { memo, type ReactNode } from "react";
import { AppHeroUIProvider } from "./heroui.provider";
import { AppQueryClientProvider } from "./query-client.provider";

const AppProviders = memo(({ children }: { children: ReactNode }) => {
	return (
		<AppQueryClientProvider>
			<AppHeroUIProvider>{children}</AppHeroUIProvider>
		</AppQueryClientProvider>
	);
});

export { AppProviders };
