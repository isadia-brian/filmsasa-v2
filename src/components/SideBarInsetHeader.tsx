"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

interface BreadcrumbItem {
  name: string;
  href: string;
}

const humanize = (str: string) => {
  return str
    .replace(/^\/+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const SideBarInsetHeader = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems: BreadcrumbItem[] = [];
  let accumulatedPath = "";

  pathSegments.forEach((segment) => {
    accumulatedPath += `/${segment}`;
    breadcrumbItems.push({
      name: segment,
      href: accumulatedPath,
    });
  });

  // Handle root case
  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({
      name: "Dashboard",
      href: "/",
    });
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <Fragment key={item.href}>
                <BreadcrumbItem className={index > 0 ? "" : "hidden md:block"}>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>
                      <span className="capitalize">
                        {humanize(index === 0 ? "Admin" : item.name)}
                      </span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>
                      <span className="capitalize">
                        {humanize(index === 0 ? "Admin" : item.name)}
                      </span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default SideBarInsetHeader;
