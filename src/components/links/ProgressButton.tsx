"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { ReactNode, MouseEvent } from "react";

interface ProgressLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ProgressLink({
  href,
  children,
  className,
  
}: ProgressLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    NProgress.start();
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
