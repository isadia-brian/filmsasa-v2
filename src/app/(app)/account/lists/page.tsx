import UserLists from "@/features/users/components/UserLists";

const page = () => {
  return (
    <div className=" relative min-h-screen pt-[80px] md:pt-[100px] pb-[50px] flex flex-col gap-8 w-full px-4 text-slate-200">
      <h1 className="font-bold text-4xl">My Lists</h1>
      <UserLists />
    </div>
  );
};

export default page;
