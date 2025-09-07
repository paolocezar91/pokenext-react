import { VersionInfo } from "@/components/layout/version-info";
import { getMessages } from "@/i18n/messages";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import RootLayout from "./layout";
import { locales } from "@/i18n/config";

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      locale: context.params?.locale,
      messages: await getMessages(String(context.params?.locale))
    }
  };
}

export async function getStaticPaths() {
  return {
    paths: locales.map(locale => ({ params: { locale }})),
    fallback: false
  };
}

export default function AboutPage() {
  const t = useTranslations();
  const title = t('about.title');

  const me = <Link href="https://github.com/paolocezar91/" target="_blank" className="underline">Paolo Pestalozzi</Link>;
  const pokeApi = <Link href="https://pokeapi.co/" target="_blank" className="underline">PokeAPI</Link>;
  const nextJs = <Link href="https://nextjs.org/" target="_blank" className="underline">Next.js</Link>;
  const react = <Link href="https://react.dev/" target="_blank" className="underline">React</Link>;
  const graphQL = <Link href="https://graphql.org/" target="_blank" className="underline">GraphQL</Link>;
  const mongoDB = <Link href="https://www.mongodb.com/" target="_blank" className="underline">Mongo DB</Link>;
  const vercel = <Link href="https://vercel.com/" target="_blank" className="underline">Vercel</Link>;
  const render = <Link href="https://www.render.com/" target="_blank" className="underline">Render</Link>;
  const github = <Link href="https://github.com/paolocezar91/" target="_blank" className="underline">Github</Link>;
  


  return <RootLayout title={title}>
    <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto md:overflow-[initial]">
      <div className="p-4 bg-background rounded shadow-md h-[-webkit-fill-available]">
        <p>
          <span className="flex flex-row">
            <h2 className="mb-3">
              <strong className="mr-1">PokéNext</strong>
            </h2>
            <VersionInfo />
          </span>
          Developed by {me} using {nextJs}, {react}, {graphQL}, {mongoDB}, {vercel} and {render} as a project to study and deep dive into React's ecosystem. Data was extracted from {pokeApi} project.
        </p>
        <p className="mt-3">
            You can find more about the project on {github}.
        </p>
        <p className="mt-3">
          Pokémon belongs to Creatures Inc., GAME FREAK Inc. and Nintendo. All images and data are used in spirit of fair use. 
        </p>
      </div>
    </div>
  </RootLayout>;
}