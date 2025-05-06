import { fetchFeatured } from "@/features/films/server/db/films";
import SectionOne from "./Component.client";
import { getUser } from "@/lib/dal";

const SectionFilter = async () => {
  const [data, user] = await Promise.all([fetchFeatured(), getUser()]);

  const featured = data ?? [];

  return (
    <div>
      <SectionOne featured={featured} user={user} />
    </div>
  );
};

export default SectionFilter;
