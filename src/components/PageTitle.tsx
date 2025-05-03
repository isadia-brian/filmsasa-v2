const PageTitle = ({ title }: { title: string }) => {
  return (
    <h1 className="text-white  uppercase font-black text-lg md:text-2xl md:mb-9">
      {title}
    </h1>
  );
};

export default PageTitle;
