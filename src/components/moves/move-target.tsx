import { IMoveTarget } from "pokeapi-typescript";

interface MoveTargetProps {
  targetData: IMoveTarget;
}

export default function MoveTarget({ targetData }: MoveTargetProps) {
  return (
    <div className="target w-full mt-2">
      <h3 className="text-lg font-semibold mb-4">Target</h3>
      <p>
        {targetData.descriptions.find((d) => d.language.name === 'en')?.description}
      </p>
    </div>
  );
}