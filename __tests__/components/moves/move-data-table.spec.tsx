import MoveDataTable from "@/components/moves/move-data-table";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Move } from "pokeapi-typescript";

// Mock dependencies
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <img {...props} />, // Simplified Image mock
}));

jest.mock("@/context/user-context", () => ({
  useUser: () => ({
    settings: { typeArtworkUrl: "sword-shield" },
  }),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

describe("MoveDataTable Component", () => {
  const mockMoveData: Move = {
    name: "thunderbolt",
    type: {
      name: "electric",
      url: "https://pokeapi.co/api/v2/type/13/",
    },
    damage_class: {
      name: "special",
      url: "",
    },
    power: 90,
    accuracy: 100,
    pp: 15,
    // Include other required Move properties with mock values
    id: 1,
    effect_chance: 0,
    effect_entries: [],
    flavor_text_entries: [],
    generation: { name: "", url: "" },
    names: [],
    past_values: [],
    stat_changes: [],
    target: { name: "", url: "" },
  } as unknown as Move;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the table with all move data", () => {
    render(<MoveDataTable moveData={mockMoveData} />);

    // Verify table title
    expect(
      screen.getByRole("heading", { name: "moves.moveData.title" })
    ).toBeInTheDocument();

    // Verify all headers are rendered
    expect(screen.getByText("pokedex.details.moves.type")).toBeInTheDocument();
    expect(screen.getByText("pokedex.details.moves.class")).toBeInTheDocument();
    expect(screen.getByText("pokedex.details.moves.power")).toBeInTheDocument();
    expect(
      screen.getByText("pokedex.details.moves.accuracy")
    ).toBeInTheDocument();
    expect(screen.getByText("pokedex.details.moves.pp")).toBeInTheDocument();

    // Verify type image
    const typeImage = screen.getByAltText("electric");
    expect(typeImage).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/13.png"
    );

    // Verify damage class tooltip and image
    const classImage = screen.getByAltText("special");
    expect(classImage).toHaveAttribute("src", "/move-special.png");

    // Verify numeric values
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("should handle null power value", () => {
    const moveDataWithoutPower = {
      ...mockMoveData,
      power: null,
    } as unknown as Move;
    render(<MoveDataTable moveData={moveDataWithoutPower} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should handle null accuracy value", () => {
    const moveDataWithoutAccuracy = {
      ...mockMoveData,
      accuracy: null,
    } as unknown as Move;
    screen.debug();
    render(<MoveDataTable moveData={moveDataWithoutAccuracy} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should handle null pp value", () => {
    const moveDataWithoutPP = {
      ...mockMoveData,
      pp: null,
    } as unknown as Move;
    render(<MoveDataTable moveData={moveDataWithoutPP} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should match snapshot with complete data", () => {
    const { asFragment } = render(<MoveDataTable moveData={mockMoveData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should match snapshot with null values", () => {
    const moveDataWithNulls = {
      ...mockMoveData,
      power: null,
      accuracy: null,
      pp: null,
    } as unknown as Move;
    const { asFragment } = render(
      <MoveDataTable moveData={moveDataWithNulls} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
