import { getUser } from "@/lib/dal";
import PrewatchClient from "./component.client";

const Prewatch = async ({
  film,
  kidsPage,
}: {
  film: any;
  kidsPage?: boolean;
}) => {
  const user = await getUser();
  const userId = user?.id;
  return <PrewatchClient film={film} kidsPage={kidsPage} userId={userId} />;
};

export default Prewatch;
