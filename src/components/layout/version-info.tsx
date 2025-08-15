import { buildInfo } from '@/build-info';

export function VersionInfo() {

  return (
    <div className="text-xs text-white">
      <div>v{buildInfo.version}</div>
    </div>
  );
}