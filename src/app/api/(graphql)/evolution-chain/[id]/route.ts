import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';
import { IEvolutionChain } from 'pokeapi-typescript';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = { id: Number(id) };
  const query = gql`
    query ($id: Int) {
      evolutionChain(id: $id) {
        id
        baby_trigger_item {
          name
          url
        }
        chain {
          is_baby
          species {
            name
            url
          }
          evolution_details {
            item { name url }
            trigger { name url }
            gender
            held_item { name url }
            move { name url }
            known_move_type { name url }
            location { name url }
            min_level
            min_happiness
            min_beauty
            min_affection
            needs_overworld_rain
            party_species { name url }
            party_type { name url }
            relative_physical_stats
            time_of_day
            trade_species { name url }
            turn_upside_down
          }
          evolves_to {
            is_baby
            species { name url }
            evolution_details {
              item { name url }
              trigger { name url }
              gender
              held_item { name url }
              move { name url }
              known_move_type { name url }
              location { name url }
              min_level
              min_happiness
              min_beauty
              min_affection
              needs_overworld_rain
              party_species { name url }
              party_type { name url }
              relative_physical_stats
              time_of_day
              trade_species { name url }
              turn_upside_down
            }
            evolves_to {
              is_baby
              species { name url }
              evolution_details {
                item { name url }
                trigger { name url }
                gender
                held_item { name url }
                move { name url }
                known_move_type { name url }
                location { name url }
                min_level
                min_happiness
                min_beauty
                min_affection
                needs_overworld_rain
                party_species { name url }
                party_type { name url }
                relative_physical_stats
                time_of_day
                trade_species { name url }
                turn_upside_down
              }
            }
          }
        }
      }
    }`;
  try {
    const { evolutionChain } = await request<{ evolutionChain: IEvolutionChain }>(apiUrl, query, vars);
    return NextResponse.json(evolutionChain, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
