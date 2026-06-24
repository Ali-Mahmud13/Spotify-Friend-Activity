import { notFound } from "next/navigation";
import { getDashboardData } from "@/lib/data";
import { findUserGroup } from "@/lib/dashboard-groups";
import { UserDetailLive } from "@/components/user-detail-live";

export const dynamic = "force-dynamic";

export default async function UserPage({
  params
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId);
  const data = await getDashboardData();
  const group = findUserGroup(data, userId);

  if (!group) {
    notFound();
  }

  return (
    <UserDetailLive
      initialData={data}
      userId={userId}
      initialRefreshedAt={new Date().toISOString()}
    />
  );
}
