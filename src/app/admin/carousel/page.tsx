import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import { SidebarInset } from "@/components/ui/sidebar";
import Modal from "@/components/modal";
import CarouselFilms from "../_components/CarouselFilms";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";

  return (
    <SidebarInset>
      <SideBarInsetHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[100vh] px-4 py-5 flex-1 rounded-xl md:min-h-min">
          <div className="mb-4">
            <Modal>
              <CarouselFilms />
            </Modal>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
