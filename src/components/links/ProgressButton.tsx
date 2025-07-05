"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { ReactNode, MouseEvent, ComponentProps } from "react";

interface ProgressLinkProps
  extends Omit<ComponentProps<typeof Link>, "onClick"> {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ProgressLink({
  href,
  children,
  className,
  onClick,
  ...props
}: ProgressLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    NProgress.start();
    onClick?.();
    router.push(href);
  };

  return (
    <Link {...props} href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
