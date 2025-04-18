import { IMove } from "pokeapi-typescript";

interface MoveEffectProps {
  moveData: IMove;
}

export default function MoveEffect({ moveData }: MoveEffectProps) {

  const getEffects = () => {
    return moveData.effect_entries.filter(effect => effect.language.name === 'en');
  };

  return (
    <div className="effect flex flex-col max-h-50 w-full">
      <h3 className="text-lg mb-4">Effect</h3>
      <div className="flex-1 py-1 h-[-webkit-fill-available] overflow-auto">
        <p>{getEffects()[0].effect}</p>
      </div>
    </div>
  );
}