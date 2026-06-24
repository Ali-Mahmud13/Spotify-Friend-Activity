import { getDashboardData } from "@/lib/data";
import { DashboardLive } from "@/components/dashboard-live";

export async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <DashboardLive
      initialData={data}
      initialRefreshedAt={new Date().toISOString()}
    />
  );
}
