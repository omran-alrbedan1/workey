import { cn } from "@/lib/utils"

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />
}

export { Skeleton }
