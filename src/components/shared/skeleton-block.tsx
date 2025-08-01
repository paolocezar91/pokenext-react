export default function SkeletonBlock({ className = "w-full" }: { className?: string }) {
  return <div className={`${className} h-3 bg-gray-200 rounded-full dark:bg-gray-700 animation-pulse`}></div>;
}